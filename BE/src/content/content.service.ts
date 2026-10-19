import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { equivHsk2 } from '../common/hsk.js';
import { fold } from '../common/text.js';
import { Clock, vnDay } from '../common/time.js';
import { EventService } from '../event/event.service.js';
import { mediaUrl } from '../media/media-url.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { ListLessonsQuery, SubmitAnswersDto } from './content.dto.js';

interface Opt {
  zh: string;
  vi: string;
}

/** Số từ tích lũy cần cho mỗi cấp HSK 2.0 (rule.md mục 2). */
export const HSK2_TARGET = [150, 300, 600, 1200, 2500, 5000];

/**
 * Bài hội thoại cấp cao hơn cấp người học thì bị khóa (như vượt ải), trừ bài chứa từ khóa sự kiện:
 * rule.md 5.3 cho mọi cấp dò được từ khóa nên các bài đó không khóa.
 */
const isLocked = (lesson: { kind: string; level: number; _count?: { keySlots: number } }, userLevel: number) =>
  (lesson.kind === 'DIALOG' || lesson.kind === 'READING') && lesson.level > userLevel && !(lesson._count?.keySlots ?? 0);

@Injectable()
export class ContentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clock: Clock,
    private readonly event: EventService,
  ) {}

  topics(kind?: 'VOCAB' | 'SITUATION') {
    return this.prisma.topic.findMany({ where: kind ? { kind } : undefined, orderBy: { sort: 'asc' } });
  }

  /** Bảng từ vựng của một chủ đề. */
  async vocab(topicId: string) {
    const topic = await this.prisma.topic.findUnique({ where: { id: topicId } });
    if (!topic) throw new NotFoundException('Không có chủ đề này');
    const words = await this.prisma.word.findMany({ where: { topicId }, orderBy: { id: 'asc' } });
    return { topic, words };
  }

  /**
   * Danh sách hội thoại. Tìm kiếm chỉ nhìn tên bài, chủ đề và bối cảnh, KHÔNG nhìn nội dung câu thoại
   * (rule.md 3.2: không biến ô tìm kiếm thành cách thử từ khóa miễn phí).
   */
  async listLessons(userId: string, query: ListLessonsQuery) {
    const rows = await this.prisma.lesson.findMany({
      where: {
        kind: query.kind ?? 'DIALOG',
        published: true,
        ...(query.level ? { level: query.level } : {}),
        ...(query.topic ? { topics: { some: { topicId: query.topic } } } : {}),
      },
      include: { topics: { include: { topic: true } }, _count: { select: { lines: true, keySlots: true } } },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
    });
    const me = await this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { hskLevel: true, hskStandard: true } });
    const progress = await this.prisma.userLesson.findMany({
      where: { userId, lessonId: { in: rows.map((r) => r.id) } },
    });
    const byId = new Map(progress.map((p) => [p.lessonId, p]));
    const needle = query.q ? fold(query.q.trim()) : '';
    return rows
      .filter(
        (r) =>
          !needle ||
          fold([r.title, r.situation, ...r.tags, ...r.topics.map((t) => t.topic.name)].join(' ')).includes(needle),
      )
      .map((r) => ({
        id: r.id,
        title: r.title,
        situation: r.situation,
        thumbUrl: mediaUrl(r.coverId, 'thumb'),
        tags: r.tags,
        topics: r.topics.map((t) => ({ id: t.topicId, name: t.topic.name })),
        level: r.level,
        hsk2: r.hsk2,
        hsk3: r.hsk3,
        twinId: r.twinId,
        lines: r._count.lines,
        locked: isLocked(r, equivHsk2(me.hskStandard, me.hskLevel)),
        unlockLevel: r.level,
        status: byId.get(r.id)?.allDone ? 'done' : byId.get(r.id) ? 'started' : 'new',
      }));
  }

  /** Chi tiết bài. Lời thoại ở cuối bài và khóa tới khi trả lời xong (hoặc bấm bỏ qua). */
  async lesson(userId: string, id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        topics: { include: { topic: true } },
        roles: true,
        lines: { orderBy: { idx: 'asc' } },
        questions: { orderBy: { idx: 'asc' } },
        _count: { select: { keySlots: true } },
      },
    });
    if (!lesson || !lesson.published) throw new NotFoundException('Không có bài này');
    if (lesson.kind === 'STORY' && !(await this.event.canReadStory(userId, id))) {
      throw new ForbiddenException('Hồi này chưa mở');
    }
    await this.assertUnlocked(userId, lesson);
    const progress = await this.prisma.userLesson.findUnique({ where: { userId_lessonId: { userId, lessonId: id } } });
    // Bài đọc luôn hiện chữ ngay; hội thoại khóa lời thoại tới khi trả lời xong (rule.md 3.2).
    const unlocked = lesson.kind === 'READING' || !!progress?.transcript;
    if (!progress) await this.prisma.userLesson.create({ data: { userId, lessonId: id } });
    const answered = !!progress?.answers;

    return {
      id: lesson.id,
      kind: lesson.kind,
      title: lesson.title,
      situation: lesson.situation,
      coverUrl: mediaUrl(lesson.coverId, 'cover'),
      level: lesson.level,
      hsk2: lesson.hsk2,
      hsk3: lesson.hsk3,
      twinId: lesson.twinId,
      topics: lesson.topics.map((t) => ({ id: t.topicId, name: t.topic.name })),
      roles: lesson.roles.map((r) => ({
        who: r.who,
        label: r.label,
        gender: r.gender,
        pitchRange: r.pitchRange,
        voiceId: r.voiceId,
        avatarUrl: mediaUrl(r.avatarId, 'chat'),
      })),
      // Chưa mở lời thoại: chỉ trả khung để phát âm thanh, không có chữ.
      lines: lesson.lines.map((l) =>
        unlocked
          ? { idx: l.idx, who: l.who, zh: l.zh, pinyin: l.pinyin, vi: l.vi, tokens: l.tokens, audioKey: l.audioKey }
          : { idx: l.idx, who: l.who, audioKey: l.audioKey },
      ),
      questions: lesson.questions.map((q) => {
        const opts = q.options as unknown as Opt[];
        return {
          idx: q.idx,
          kind: q.kind,
          prompt: q.prompt,
          options: opts.map((o) => o.zh),
          // Bản dịch chỉ gửi sau khi đã trả lời (rule.md 3.2).
          ...(answered ? { promptVi: q.promptVi, optionsVi: opts.map((o) => o.vi) } : {}),
        };
      }),
      progress: { transcript: unlocked, allDone: !!progress?.allDone, correct: progress?.correct ?? 0 },
    };
  }

  /** Nộp đáp án: chấm, mở lời thoại, và tính nhiệm vụ nếu trả lời hết câu hỏi và nghe đủ 80%. */
  async submit(userId: string, id: string, dto: SubmitAnswersDto) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: { questions: { orderBy: { idx: 'asc' } }, _count: { select: { keySlots: true } } },
    });
    if (!lesson || !lesson.published) throw new NotFoundException('Không có bài này');
    if (lesson.kind === 'STORY' && !(await this.event.canReadStory(userId, id))) {
      throw new ForbiddenException('Hồi này chưa mở');
    }
    await this.assertUnlocked(userId, lesson);
    if (dto.answers.length !== lesson.questions.length) {
      throw new BadRequestException('Phải trả lời hết các câu hỏi');
    }

    const results = lesson.questions.map((q, i) => ({
      idx: q.idx,
      picked: dto.answers[i],
      correct: dto.answers[i] === q.answer,
      answer: q.answer,
      promptVi: q.promptVi,
      optionsVi: (q.options as unknown as Opt[]).map((o) => o.vi),
    }));
    const correct = results.filter((r) => r.correct).length;
    const today = vnDay(this.clock.now()).key;

    const prev = await this.prisma.userLesson.findUnique({ where: { userId_lessonId: { userId, lessonId: id } } });
    // Bài đã bấm "Bỏ qua" trong ngày thì không tính nhiệm vụ của ngày đó.
    const skippedToday = prev?.skippedDay === today;
    await this.prisma.userLesson.upsert({
      where: { userId_lessonId: { userId, lessonId: id } },
      create: { userId, lessonId: id, answers: dto.answers, correct, allDone: true, transcript: true, completedAt: new Date() },
      update: { answers: dto.answers, correct, allDone: true, transcript: true, completedAt: new Date() },
    });

    let mission = null;
    if (!skippedToday && (dto.listenedPct ?? 0) >= 80) {
      mission = await this.event.onLessonCompleted(userId, id);
    }
    return { correct, total: results.length, results, mission };
  }

  /** "Bỏ qua, xem lời thoại": mở lời thoại nhưng bài không tính nhiệm vụ trong ngày. */
  async skip(userId: string, id: string) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id }, include: { _count: { select: { keySlots: true } } } });
    if (!lesson || !lesson.published) throw new NotFoundException('Không có bài này');
    await this.assertUnlocked(userId, lesson);
    const today = vnDay(this.clock.now()).key;
    await this.prisma.userLesson.upsert({
      where: { userId_lessonId: { userId, lessonId: id } },
      create: { userId, lessonId: id, transcript: true, skippedDay: today },
      update: { transcript: true, skippedDay: today },
    });
    return { transcript: true };
  }
  private async assertUnlocked(userId: string, lesson: { kind: string; level: number; _count?: { keySlots: number } }) {
    const me = await this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { hskLevel: true, hskStandard: true } });
    if (isLocked(lesson, equivHsk2(me.hskStandard, me.hskLevel))) {
      throw new ForbiddenException(`Bài này thuộc HSK ${lesson.level}. Hãy thi đạt đề lên cấp HSK ${lesson.level} để mở khóa.`);
    }
  }

  /** Tiến độ từ vựng để lên cấp kế (tương đối): đếm từ đã lưu có nhãn HSK 2.0 tới cấp kế so với số từ tích lũy của cấp đó. */
  async vocabProgress(userId: string) {
    const me = await this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { hskLevel: true, hskStandard: true } });
    const cur = equivHsk2(me.hskStandard, me.hskLevel);
    const next = Math.min(cur + 1, HSK2_TARGET.length);
    const target = HSK2_TARGET[next - 1];
    const prevTarget = next > 1 ? HSK2_TARGET[next - 2] : 0;
    const saved = await this.prisma.userWord.findMany({
      where: { userId, isPhrase: false },
      select: { word: { select: { hsk2: true } } },
    });
    const have = saved.map((s) => s.word?.hsk2 ?? 0).filter((h) => h >= 1 && h <= next).length;
    return {
      level: cur,
      nextLevel: next,
      isMax: cur >= HSK2_TARGET.length,
      target, // tổng số từ tích lũy để học trọn cấp kế
      have,
      remaining: Math.max(0, target - have),
      percent: Math.min(100, Math.round((have / target) * 100)),
      newInBand: target - prevTarget, // số từ mới của riêng cấp kế
      note: 'Con số tương đối: chỉ đếm từ đã lưu có trong bảng từ HSK; thi đạt đề vẫn là điều kiện lên cấp.',
    };
  }

  /**
   * Gợi ý từ nên lưu sau khi xem lời thoại: từ của bài thuộc cấp hiện tại hoặc cấp kế mà chưa lưu.
   * Loại các từ khóa sự kiện gắn với bài để app không bao giờ chỉ ra bài có từ khóa (rule.md 5.5).
   */
  async suggestWords(userId: string, id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        lines: { orderBy: { idx: 'asc' } },
        _count: { select: { keySlots: true } },
        keySlots: { include: { slot: { include: { word: true } } } },
      },
    });
    if (!lesson || !lesson.published) throw new NotFoundException('Không có bài này');
    await this.assertUnlocked(userId, lesson);
    const progress = await this.prisma.userLesson.findUnique({ where: { userId_lessonId: { userId, lessonId: id } } });
    if (lesson.kind !== 'READING' && !progress?.transcript) throw new ForbiddenException('Xem lời thoại rồi mới có gợi ý từ');

    const me = await this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { hskLevel: true, hskStandard: true } });
    const banned = new Set(lesson.keySlots.map((k) => k.slot.word.zh));
    const zhs = new Set<string>();
    for (const l of lesson.lines) {
      for (const t of l.tokens as unknown as { t: string; x?: boolean }[]) {
        if (!t.x && /[一-鿿]/.test(t.t) && !banned.has(t.t)) zhs.add(t.t);
      }
    }
    const [words, mine] = await Promise.all([
      this.prisma.word.findMany({ where: { zh: { in: [...zhs] } } }),
      this.prisma.userWord.findMany({ where: { userId, zh: { in: [...zhs] } }, select: { zh: true } }),
    ]);
    const have = new Set(mine.map((m) => m.zh));
    const cur = equivHsk2(me.hskStandard, me.hskLevel);
    const next = cur + 1;
    const rank = (h: number | null) => (h === next ? 0 : h === cur ? 1 : h && h < cur ? 3 : 2);
    const list = words
      .filter((w) => !have.has(w.zh) && w.vi && (w.hsk2 ?? 99) <= next + 1)
      .sort((a, b) => rank(a.hsk2) - rank(b.hsk2) || a.zh.length - b.zh.length)
      .slice(0, 8)
      .map((w) => ({
        zh: w.zh,
        pinyin: w.pinyin,
        vi: w.vi,
        hsk2: w.hsk2,
        why: w.hsk2 === next ? 'Từ của cấp kế, nên lưu để lên cấp' : w.hsk2 === cur ? 'Từ thuộc cấp hiện tại' : 'Từ hay gặp trong bài',
      }));
    return { words: list, progress: await this.vocabProgress(userId) };
  }
  /** Bảng chữ → khóa file âm thanh của mọi từ đã có file; FE nạp một lần để nút nghe từ luôn dùng file thay vì giọng trình duyệt. */
  async wordAudio() {
    const rows = await this.prisma.word.findMany({ where: { audioKey: { not: null } }, select: { zh: true, audioKey: true } });
    return Object.fromEntries(rows.map((r) => [r.zh, r.audioKey]));
  }

  /** Tra một từ: nghĩa, cấp, ví dụ, âm thanh và người học đã lưu từ này vào sổ tay chưa (để hiện nút Lưu hay Bỏ). */
  async lookupWord(userId: string, zh: string) {
    const [word, saved] = await Promise.all([
      this.prisma.word.findFirst({ where: { zh } }),
      this.prisma.userWord.findUnique({ where: { userId_zh: { userId, zh } }, select: { id: true } }),
    ]);
    return {
      zh,
      pinyin: word?.pinyin ?? null,
      vi: word?.vi ?? null,
      pos: word?.pos ?? null,
      hsk2: word?.hsk2 ?? null,
      hsk3: word?.hsk3 ?? null,
      example: word?.example ?? null,
      audioKey: word?.audioKey ?? null,
      savedId: saved?.id ?? null,
    };
  }
}
