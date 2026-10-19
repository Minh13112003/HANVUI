import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { equivHsk2 } from '../common/hsk.js';
import { Clock } from '../common/time.js';
import { PrismaService } from '../prisma/prisma.service.js';

// ───────────── Dạng dữ liệu đề (lưu trong Exam.sections) ─────────────

export interface Say {
  who: string;
  zh: string;
}
export interface StoredQuestion {
  id: string;
  type: 'judge' | 'choice' | 'order';
  script?: Say[];
  /** Âm thanh đã tạo cho từng câu thoại của câu nghe, theo thứ tự. */
  audio?: { who: string; key: string }[];
  statement?: string;
  prompt?: string;
  options?: string[];
  words?: string[];
  /** judge/choice: chỉ số đáp án; order: các cách sắp xếp đúng. */
  answer: number | string[];
}
export interface StoredSection {
  name: string;
  kind: 'listening' | 'reading' | 'writing';
  questions: StoredQuestion[];
}

export const MAX_LEVEL_HSK2 = 6;
const GRACE_MS = 2 * 60_000; // cho phép nộp trễ tối đa 2 phút so với giờ làm bài

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

type Answer = number | string | string[] | null | undefined;

@Injectable()
export class ExamService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clock: Clock,
  ) {}

  /** Các cấp có đề, điểm cao nhất và đã đạt chưa. Chỉ có đề HSK 2.0 (rule.md mục 2, 4). */
  async list(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { hskStandard: true, hskLevel: true } });
    const exams = await this.prisma.exam.findMany({
      where: { standard: 'HSK2', published: true },
      select: { level: true, id: true, durationMin: true, maxScore: true, passScore: true },
    });
    const attempts = await this.prisma.examAttempt.findMany({ where: { userId, submittedAt: { not: null } }, include: { exam: { select: { level: true } } } });
    const levels = [...new Set(exams.map((e) => e.level))].sort((a, b) => a - b).map((level) => {
      const mine = attempts.filter((a) => a.exam.level === level);
      const here = exams.filter((e) => e.level === level);
      return {
        level,
        exams: here.length,
        durationMin: here[0].durationMin,
        maxScore: here[0].maxScore,
        passScore: here[0].passScore,
        attempts: mine.length,
        bestScore: mine.length ? Math.max(...mine.map((a) => a.score ?? 0)) : null,
        passed: mine.some((a) => a.passed),
      };
    });
    return {
      standard: 'HSK2',
      supported: true,
      note: user.hskStandard === 'HSK2' ? null : 'Đề HSK 3.0 chưa soạn riêng: dùng đề HSK 2.0 cấp tương đương (3.0·1 ≈ 2.0·2, 3.0·2 ≈ 2.0·3, 3.0·3 ≈ 2.0·4).',
      currentLevel: equivHsk2(user.hskStandard, user.hskLevel),
      maxLevel: MAX_LEVEL_HSK2,
      levels,
    };
  }

  /** Bắt đầu thi: chọn ngẫu nhiên 1 đề của cấp (ưu tiên đề khác lần trước), tạo lượt thi, trả đề không kèm đáp án. */
  async start(userId: string, level: number) {
    if (!Number.isInteger(level) || level < 1 || level > MAX_LEVEL_HSK2) throw new BadRequestException('Cấp không hợp lệ');
    const exams = await this.prisma.exam.findMany({ where: { standard: 'HSK2', level, published: true } });
    if (!exams.length) throw new NotFoundException(`Chưa có đề HSK ${level}`);

    // Bỏ lượt chưa nộp cũ để không chồng nhiều lượt dở dang.
    await this.prisma.examAttempt.deleteMany({ where: { userId, submittedAt: null } });
    const last = await this.prisma.examAttempt.findFirst({ where: { userId, exam: { level } }, orderBy: { startedAt: 'desc' } });
    const pool = exams.length > 1 ? exams.filter((e) => e.id !== last?.examId) : exams;
    const exam = pool[Math.floor(Math.random() * pool.length)];

    const attempt = await this.prisma.examAttempt.create({ data: { userId, examId: exam.id } });
    const sections = exam.sections as unknown as StoredSection[];
    const total = sections.reduce((n, s) => n + s.questions.length, 0);
    return {
      attemptId: attempt.id,
      startedAt: attempt.startedAt,
      endsAt: new Date(attempt.startedAt.getTime() + exam.durationMin * 60_000),
      exam: {
        id: exam.id,
        title: exam.title,
        level: exam.level,
        durationMin: exam.durationMin,
        maxScore: exam.maxScore,
        passScore: exam.passScore,
        pointsPerQuestion: exam.maxScore / total,
        sections: sections.map((s) => ({ name: s.name, kind: s.kind, questions: s.questions.map((q) => this.publicQuestion(q)) })),
      },
    };
  }

  /** Nộp bài: chấm tự động, ghi kết quả, lên cấp nếu đạt đúng cấp hiện tại của người học. */
  async submit(userId: string, attemptId: number, answers: Record<string, Answer>) {
    const attempt = await this.prisma.examAttempt.findFirst({ where: { id: attemptId, userId }, include: { exam: true } });
    if (!attempt) throw new NotFoundException('Không có lượt thi này');
    if (attempt.submittedAt) throw new BadRequestException('Lượt thi này đã nộp rồi');

    const now = this.clock.now();
    const exam = attempt.exam;
    const deadline = attempt.startedAt.getTime() + exam.durationMin * 60_000 + GRACE_MS;
    if (now.getTime() > deadline) {
      await this.prisma.examAttempt.update({ where: { id: attemptId }, data: { submittedAt: now, score: 0, passed: false, detail: { expired: true } } });
      throw new BadRequestException('Đã hết giờ làm bài, lượt thi này không được tính');
    }

    const sections = exam.sections as unknown as StoredSection[];
    const total = sections.reduce((n, s) => n + s.questions.length, 0);
    const per = exam.maxScore / total;
    let correct = 0;
    const detail = sections.map((s) => {
      const items = s.questions.map((q) => {
        const ok = this.isCorrect(q, answers[q.id]);
        if (ok) correct++;
        return { id: q.id, correct: ok, answer: q.type === 'order' ? (q.answer as string[])[0] : q.answer };
      });
      return { name: s.name, kind: s.kind, correct: items.filter((i) => i.correct).length, total: items.length, items };
    });
    const score = Math.round(correct * per);
    const passed = score >= exam.passScore;

    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { hskLevel: true, hskStandard: true } });
    const maxOwn = user.hskStandard === 'HSK3' ? 9 : MAX_LEVEL_HSK2;
    const leveledUp = passed && exam.level === equivHsk2(user.hskStandard, user.hskLevel) && user.hskLevel < maxOwn;
    await this.prisma.$transaction([
      this.prisma.examAttempt.update({
        where: { id: attemptId },
        data: { submittedAt: now, score, passed, leveledUp, answers: answers as object, detail },
      }),
      ...(leveledUp ? [this.prisma.user.update({ where: { id: userId }, data: { hskLevel: user.hskLevel + 1 } })] : []),
    ]);

    return {
      score,
      maxScore: exam.maxScore,
      passScore: exam.passScore,
      passed,
      leveledUp,
      newLevel: leveledUp ? user.hskLevel + 1 : user.hskLevel,
      correct,
      total,
      sections: detail,
    };
  }

  /** Lịch sử các lần thi đã nộp. */
  async history(userId: string) {
    const rows = await this.prisma.examAttempt.findMany({
      where: { userId, submittedAt: { not: null } },
      orderBy: { submittedAt: 'desc' },
      take: 50,
      include: { exam: { select: { title: true, level: true, maxScore: true, passScore: true } } },
    });
    return rows.map((a) => ({
      id: a.id,
      title: a.exam.title,
      level: a.exam.level,
      score: a.score,
      maxScore: a.exam.maxScore,
      passed: a.passed,
      leveledUp: a.leveledUp,
      submittedAt: a.submittedAt,
    }));
  }

  /** Xem lại một lần thi đã nộp: đề, đáp án đúng và đáp án đã chọn. */
  async review(userId: string, attemptId: number) {
    const a = await this.prisma.examAttempt.findFirst({ where: { id: attemptId, userId }, include: { exam: true } });
    if (!a) throw new NotFoundException('Không có lượt thi này');
    if (!a.submittedAt) throw new ForbiddenException('Hãy nộp bài trước khi xem lại');
    return {
      title: a.exam.title,
      score: a.score,
      maxScore: a.exam.maxScore,
      passed: a.passed,
      sections: (a.exam.sections as unknown as StoredSection[]).map((s) => ({
        name: s.name,
        kind: s.kind,
        questions: s.questions.map((q) => ({ ...q, yours: (a.answers as Record<string, Answer> | null)?.[q.id] ?? null })),
      })),
    };
  }

  // ───────────── Nội bộ ─────────────

  /** Bỏ đáp án; với câu nghe chỉ gửi lời thoại khi chưa có âm thanh (để FE tạm đọc bằng giọng trình duyệt). */
  private publicQuestion(q: StoredQuestion) {
    return {
      id: q.id,
      type: q.type,
      statement: q.statement,
      prompt: q.prompt,
      options: q.options,
      words: q.type === 'order' ? shuffle(q.words ?? []) : undefined,
      audio: q.audio?.length ? q.audio : null,
      script: q.script && !q.audio?.length ? q.script : undefined,
    };
  }

  private isCorrect(q: StoredQuestion, a: Answer): boolean {
    if (a === null || a === undefined) return false;
    if (q.type === 'order') {
      const given = norm(Array.isArray(a) ? a.join('') : String(a));
      return (q.answer as string[]).some((x) => norm(x) === given);
    }
    return typeof a === 'number' && a === q.answer;
  }
}
