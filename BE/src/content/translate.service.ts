import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { pinyin } from 'pinyin-pro';
import { equivHsk2, OPEN_LEVEL } from '../common/hsk.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { gradeSentenceVi, gradeSentenceZh, gradeVi2Zh, gradeZh2Vi, type Chunk } from './translate.grade.js';

export type Direction = 'zh2vi' | 'vi2zh';
export interface SentenceToken {
  zh: string;
  py: string;
  vi: string;
}

const shuffle = <T>(a: T[]): T[] => {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
};

/**
 * Luyện dịch Trung ↔ Việt theo điểm ngữ pháp (rule.md 3.5, thêm 27/10/2026). Đề chỉ gửi một chiều (không lộ đáp án);
 * bản tham khảo (dịch tự nhiên + dịch sát chữ) chỉ trả sau khi nộp. Chấm theo cụm (translate.grade.ts), người học được tự
 * đánh dấu "dịch đúng ý" sau khi so với bản tham khảo.
 */
@Injectable()
export class TranslateService {
  constructor(private readonly prisma: PrismaService) {}

  private async userLevel(userId: string) {
    const me = await this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { hskLevel: true, hskStandard: true } });
    return equivHsk2(me.hskStandard, me.hskLevel);
  }

  async forGrammar(userId: string, slug: string, direction: Direction) {
    const g = await this.prisma.grammarPoint.findUnique({ where: { slug }, select: { id: true, level: true } });
    if (!g) throw new NotFoundException('Không có điểm ngữ pháp này');
    if (g.level !== OPEN_LEVEL && g.level > (await this.userLevel(userId))) throw new ForbiddenException(`Điểm ngữ pháp này thuộc HSK ${g.level}.`);
    const rows = await this.prisma.translateItem.findMany({
      where: { grammarId: g.id },
      orderBy: { sort: 'asc' },
      include: { done: { where: { userId, direction } } },
    });
    return rows.map((r) => ({
      id: r.id,
      direction,
      prompt: direction === 'zh2vi' ? r.zh : r.vi,
      // Việt → Trung: các cụm tiếng Trung xáo trộn để ghép thẻ (chế độ dễ), hoặc tự gõ (chế độ khó).
      tiles: direction === 'vi2zh' ? shuffle((r.chunks as unknown as Chunk[]).map((c) => c.zh)) : null,
      done: r.done[0] ? { correct: r.done[0].correct, self: r.done[0].self } : null,
    }));
  }

  private async item(userId: string, itemId: number) {
    const r = await this.prisma.translateItem.findUnique({ where: { id: itemId }, include: { grammar: { select: { level: true } } } });
    if (!r) throw new NotFoundException('Không có câu này');
    if (r.grammar.level !== OPEN_LEVEL && r.grammar.level > (await this.userLevel(userId))) throw new ForbiddenException('Câu này chưa mở với cấp của bạn');
    return r;
  }

  async check(userId: string, itemId: number, direction: Direction, answer: string) {
    const r = await this.item(userId, itemId);
    const chunks = r.chunks as unknown as Chunk[];
    const g = direction === 'zh2vi' ? gradeZh2Vi(answer, chunks) : gradeVi2Zh(answer, r.zh, r.alt, chunks);
    if (g.verdict === 'empty') throw new BadRequestException('Bạn chưa nhập câu dịch');
    const correct = g.verdict === 'ok';
    const prev = await this.prisma.translateDone.findUnique({ where: { userId_itemId_direction: { userId, itemId, direction } } });
    await this.prisma.translateDone.upsert({
      where: { userId_itemId_direction: { userId, itemId, direction } },
      create: { userId, itemId, direction, correct },
      // Đã đúng (hoặc tự đánh dấu đúng) rồi thì làm lại sai không xóa thành tích.
      update: { correct: correct || !!prev?.correct, attempts: { increment: 1 } },
    });
    return {
      ...g,
      correct,
      reference: {
        zh: r.zh,
        pinyin: (pinyin(r.zh, { toneType: 'symbol', type: 'array' }) as string[]).join(' '),
        vi: r.vi,
        literal: r.literal,
        chunks: chunks.map((c) => ({ zh: c.zh, vi: c.vi.filter((v) => v !== '-') })),
      },
    };
  }

  /** Người học so với bản tham khảo và tự xác nhận "tôi dịch đúng ý" (chỉ sau khi đã nộp ít nhất một lần). */
  async selfMark(userId: string, itemId: number, direction: Direction) {
    await this.item(userId, itemId);
    const prev = await this.prisma.translateDone.findUnique({ where: { userId_itemId_direction: { userId, itemId, direction } } });
    if (!prev) throw new BadRequestException('Hãy nộp câu dịch trước rồi mới tự đánh giá');
    await this.prisma.translateDone.update({ where: { id: prev.id }, data: { correct: true, self: true } });
    return { ok: true };
  }

  // ── Mục Luyện dịch (tab Học): đáp án và sơ đồ mũi tên chỉ trả khi người học chấm hoặc tự bấm Hiện dịch ──

  async sentences(userId: string, direction: Direction, level?: number) {
    const mine = await this.userLevel(userId);
    const rows = await this.prisma.translateSentence.findMany({
      orderBy: [{ level: 'asc' }, { sort: 'asc' }],
      include: { done: { where: { userId, direction } } },
    });
    const levels = [...new Set(rows.map((r) => r.level))].map((l) => {
      const of = rows.filter((r) => r.level === l);
      return { level: l, total: of.length, correct: of.filter((r) => r.done[0]?.correct).length, locked: l > mine };
    });
    const open = levels.filter((l) => !l.locked).map((l) => l.level);
    const want = level ?? (open.length ? Math.max(...open) : (levels[0]?.level ?? 1));
    const locked = want > mine;
    const items = locked
      ? []
      : rows
          .filter((r) => r.level === want)
          .map((r) => {
            const tokens = r.tokens as unknown as SentenceToken[];
            return {
              id: r.id,
              title: r.title,
              prompt: direction === 'zh2vi' ? r.zh : r.vi,
              pinyin: direction === 'zh2vi' ? tokens.map((t) => t.py).join(' ') : null,
              tiles: direction === 'vi2zh' ? shuffle(tokens.map((t) => t.zh)) : null,
              correct: !!r.done[0]?.correct,
            };
          });
    return { level: want, locked, levels, items };
  }

  private async sentence(userId: string, id: number) {
    const r = await this.prisma.translateSentence.findUnique({ where: { id } });
    if (!r) throw new NotFoundException('Không có câu này');
    if (r.level > (await this.userLevel(userId))) throw new ForbiddenException(`Câu này thuộc HSK ${r.level}.`);
    return r;
  }

  private diagram(r: { zh: string; vi: string; note: string; tokens: unknown; natural: unknown }) {
    return { zh: r.zh, vi: r.vi, note: r.note, tokens: r.tokens as SentenceToken[], natural: r.natural as { vi: string; at: number }[] };
  }

  async reveal(userId: string, id: number) {
    return this.diagram(await this.sentence(userId, id));
  }

  async checkSentence(userId: string, sentenceId: number, direction: Direction, answer: string) {
    const r = await this.sentence(userId, sentenceId);
    const tokens = r.tokens as unknown as SentenceToken[];
    const g =
      direction === 'zh2vi'
        ? gradeSentenceVi(answer, { accept: r.accept as string[][], optional: r.optional, filler: r.filler, orders: r.orders as number[][] })
        : gradeSentenceZh(answer, r.zh, r.alt, tokens.map((t) => t.zh));
    if (g.verdict === 'empty') throw new BadRequestException('Bạn chưa nhập câu dịch');
    const correct = g.verdict === 'ok';
    const where = { userId_sentenceId_direction: { userId, sentenceId, direction } };
    const prev = await this.prisma.translateSentenceDone.findUnique({ where });
    await this.prisma.translateSentenceDone.upsert({
      where,
      create: { userId, sentenceId, direction, correct },
      // Đã đúng rồi thì làm lại sai không xóa thành tích.
      update: { correct: correct || !!prev?.correct, attempts: { increment: 1 } },
    });
    return { verdict: g.verdict, correct, extra: g.extra, missing: g.missing.map((i) => ({ zh: tokens[i].zh, vi: tokens[i].vi })), reference: this.diagram(r) };
  }
}
