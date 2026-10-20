import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { equivHsk2 } from '../common/hsk.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { WritingService } from './writing.service.js';

/** Ngữ pháp theo cấp HSK (rule.md 3.5, mục Viết). Điểm ngữ pháp cấp cao hơn cấp người học thì khóa. */
@Injectable()
export class GrammarService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly writing: WritingService,
  ) {}

  private async level(userId: string) {
    const me = await this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { hskLevel: true, hskStandard: true } });
    return equivHsk2(me.hskStandard, me.hskLevel);
  }

  async list(userId: string) {
    const eq = await this.level(userId);
    const points = await this.prisma.grammarPoint.findMany({ orderBy: [{ level: 'asc' }, { sort: 'asc' }], include: { practice: { select: { id: true } } } });
    const done = await this.prisma.writingDone.findMany({
      where: { userId, item: { grammarId: { not: null } } },
      select: { correct: true, item: { select: { grammarId: true } } },
    });
    const byG = new Map<number, { done: number; correct: number }>();
    for (const d of done) {
      const g = d.item.grammarId!;
      const cur = byG.get(g) ?? { done: 0, correct: 0 };
      cur.done++;
      if (d.correct) cur.correct++;
      byG.set(g, cur);
    }
    const rows = points.map((p) => {
      const practice = { total: p.practice.length, ...(byG.get(p.id) ?? { done: 0, correct: 0 }) };
      return { p, practice, mastered: practice.total > 0 && practice.correct >= practice.total };
    });
    // Gợi ý "nên học tiếp": điểm đúng cấp chưa thuộc (theo thứ tự), rồi điểm cấp dưới làm sai nhiều, rồi điểm cấp dưới chưa làm.
    const open = rows.filter((r) => r.p.level <= eq && !r.mastered);
    const weight = (r: (typeof rows)[number]) =>
      r.p.level === eq ? 0 : r.practice.done > 0 ? 1 + (r.practice.done - r.practice.correct ? 0 : 1) : 3;
    const recommended = new Set(
      [...open].sort((a, b) => weight(a) - weight(b) || a.p.sort - b.p.sort).slice(0, 3).map((r) => r.p.slug),
    );
    const levels = [...new Set(rows.map((r) => r.p.level))].sort((a, b) => a - b).map((lv) => {
      const rs = rows.filter((r) => r.p.level === lv);
      return { level: lv, total: rs.length, mastered: rs.filter((r) => r.mastered).length, locked: lv > eq };
    });
    return {
      level: eq,
      levels,
      readyForExam: rows.filter((r) => r.p.level === eq).every((r) => r.mastered),
      points: rows.map(({ p, practice, mastered }) => ({
        slug: p.slug,
        level: p.level,
        category: p.category,
        title: p.title,
        pattern: p.pattern,
        locked: p.level > eq,
        // Độ phù hợp với cấp người học: ôn lại (cấp thấp hơn) · đúng cấp · cấp kế (sắp tới) · còn xa.
        fit: p.level < eq ? 'review' : p.level === eq ? 'match' : p.level === eq + 1 ? 'next' : 'far',
        recommended: recommended.has(p.slug),
        mastered,
        practice,
      })),
    };
  }

  async detail(userId: string, slug: string) {
    const p = await this.prisma.grammarPoint.findUnique({ where: { slug } });
    if (!p) throw new NotFoundException('Không có điểm ngữ pháp này');
    const eq = await this.level(userId);
    if (p.level > eq) throw new ForbiddenException(`Điểm ngữ pháp này thuộc HSK ${p.level}. Hãy lên cấp HSK ${p.level} để mở khóa.`);
    return {
      slug: p.slug,
      level: p.level,
      category: p.category,
      title: p.title,
      pattern: p.pattern,
      explain: p.explain,
      compare: p.compare,
      mistake: p.mistake,
      examples: p.examples,
      practice: await this.writing.forGrammar(userId, p.id),
    };
  }
}
