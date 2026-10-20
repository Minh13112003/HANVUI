import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { equivHsk2 } from '../common/hsk.js';
import { PrismaService } from '../prisma/prisma.service.js';

type WType = 'ORDER' | 'FILL' | 'CHOOSE' | 'WRONG';
type Data = { parts?: string[]; alt?: string[]; options?: string[]; answer?: string };

const shuffle = <T>(a: T[]): T[] => {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
};
/** Bỏ khoảng trắng và dấu câu để so sánh câu sắp xếp. */
const norm = (s: string) => s.replace(/[\s，。？！、,.?!]/g, '');

/** Bài tập viết tự chấm (rule.md 3.5): sắp xếp câu, điền chữ, chọn câu đúng nghĩa. Đáp án chỉ ở máy chủ. */
@Injectable()
export class WritingService {
  constructor(private readonly prisma: PrismaService) {}

  /** Lấy ngẫu nhiên `count` bài tập trong cấp của người học (bài cấp cao hơn bị khóa, chỉ báo số lượng). */
  async pick(userId: string, type: WType, count = 8, level?: number) {
    const me = await this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { hskLevel: true, hskStandard: true } });
    const eq = equivHsk2(me.hskStandard, me.hskLevel);
    const rows = await this.prisma.writingItem.findMany({
      where: { type, level: level ? Math.min(level, eq) : { lte: eq } },
      include: { done: { where: { userId } } },
    });
    const locked = await this.prisma.writingItem.count({ where: { type, level: { gt: eq } } });
    // Ưu tiên bài chưa làm hoặc làm sai.
    const fresh = shuffle(rows.filter((r) => !r.done[0]?.correct));
    const rest = shuffle(rows.filter((r) => r.done[0]?.correct));
    const items = [...fresh, ...rest].slice(0, Math.min(Math.max(count, 1), 20)).map((r) => {
      const d = r.data as Data;
      const base = { id: r.id, level: r.level, type: r.type, vi: r.vi };
      if (r.type === 'ORDER') return { ...base, tiles: shuffle(d.parts ?? []) };
      if (r.type === 'FILL') return { ...base, parts: d.parts, options: shuffle(d.options ?? []) };
      return { ...base, options: shuffle(d.options ?? []) };
    });
    return { items, lockedCount: locked, level: eq };
  }

  /** Chấm một bài. ORDER: `answer` là mảng các phần đã sắp; FILL/CHOOSE: `answer` là chuỗi đã chọn. */
  async check(userId: string, itemId: number, answer: string | string[]) {
    const item = await this.prisma.writingItem.findUnique({ where: { id: itemId } });
    if (!item) throw new NotFoundException('Không có bài tập này');
    const me = await this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { hskLevel: true, hskStandard: true } });
    if (item.level > equivHsk2(me.hskStandard, me.hskLevel)) throw new BadRequestException(`Bài này thuộc HSK ${item.level}, chưa mở khóa`);

    const d = item.data as Data;
    let correct = false;
    let shown = '';
    if (item.type === 'ORDER') {
      if (!Array.isArray(answer)) throw new BadRequestException('Cần gửi mảng các phần đã sắp xếp');
      const right = (d.parts ?? []).join('');
      shown = right;
      correct = [right, ...(d.alt ?? [])].some((r) => norm(r) === norm(answer.join('')));
    } else {
      if (typeof answer !== 'string') throw new BadRequestException('Cần gửi chuỗi đã chọn');
      shown = d.answer ?? '';
      correct = answer === d.answer;
    }
    const prev = await this.prisma.writingDone.findUnique({ where: { userId_itemId: { userId, itemId } } });
    await this.prisma.writingDone.upsert({
      where: { userId_itemId: { userId, itemId } },
      create: { userId, itemId, correct },
      update: { correct, attempts: (prev?.attempts ?? 0) + 1 },
    });
    // Câu đầy đủ để hiển thị lại (điền chữ: ghép chỗ trống bằng đáp án đúng).
    const full = item.type === 'FILL' ? (d.parts ?? []).map((p) => p || d.answer).join('') : shown;
    return { correct, answer: shown, sentence: full, vi: item.vi };
  }

  async stats(userId: string) {
    const rows = await this.prisma.writingDone.findMany({ where: { userId }, include: { item: { select: { type: true } } } });
    const total = await this.prisma.writingItem.count();
    return {
      total,
      done: rows.length,
      correct: rows.filter((r) => r.correct).length,
      byType: (['ORDER', 'FILL', 'CHOOSE', 'WRONG'] as WType[]).map((t) => ({
        type: t,
        done: rows.filter((r) => r.item.type === t).length,
        correct: rows.filter((r) => r.item.type === t && r.correct).length,
      })),
    };
  }
  /** Bài luyện của một điểm ngữ pháp, ở dạng gửi cho người học (không có đáp án) kèm kết quả lần gần nhất. */
  async forGrammar(userId: string, grammarId: number) {
    const rows = await this.prisma.writingItem.findMany({
      where: { grammarId },
      orderBy: { sort: 'asc' },
      include: { done: { where: { userId } } },
    });
    return rows.map((r) => {
      const d = r.data as Data;
      const base = { id: r.id, level: r.level, type: r.type, vi: r.vi, done: r.done[0] ? { correct: r.done[0].correct } : null };
      if (r.type === 'ORDER') return { ...base, tiles: shuffle(d.parts ?? []) };
      if (r.type === 'FILL') return { ...base, parts: d.parts, options: shuffle(d.options ?? []) };
      return { ...base, options: shuffle(d.options ?? []) };
    });
  }
}
