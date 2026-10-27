import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { pinyin } from 'pinyin-pro';
import { equivHsk2 } from '../common/hsk.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { gradeVi2Zh, gradeZh2Vi, type Chunk } from './translate.grade.js';

export type Direction = 'zh2vi' | 'vi2zh';

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
    if (g.level > (await this.userLevel(userId))) throw new ForbiddenException(`Điểm ngữ pháp này thuộc HSK ${g.level}.`);
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
    if (r.grammar.level > (await this.userLevel(userId))) throw new ForbiddenException('Câu này chưa mở với cấp của bạn');
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
}
