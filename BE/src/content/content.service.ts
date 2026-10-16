import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { fold } from '../common/text.js';
import { Clock, vnDay } from '../common/time.js';
import { EventService } from '../event/event.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { ListLessonsQuery, SubmitAnswersDto } from './content.dto.js';

interface Opt {
  zh: string;
  vi: string;
}

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
        kind: 'DIALOG',
        published: true,
        ...(query.level ? { level: query.level } : {}),
        ...(query.topic ? { topics: { some: { topicId: query.topic } } } : {}),
      },
      include: { topics: { include: { topic: true } }, _count: { select: { lines: true } } },
      orderBy: { createdAt: 'asc' },
    });
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
        tags: r.tags,
        topics: r.topics.map((t) => ({ id: t.topicId, name: t.topic.name })),
        level: r.level,
        hsk2: r.hsk2,
        hsk3: r.hsk3,
        twinId: r.twinId,
        lines: r._count.lines,
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
      },
    });
    if (!lesson || !lesson.published) throw new NotFoundException('Không có bài này');
    if (lesson.kind === 'STORY' && !(await this.event.canReadStory(userId, id))) {
      throw new ForbiddenException('Hồi này chưa mở');
    }
    const progress = await this.prisma.userLesson.findUnique({ where: { userId_lessonId: { userId, lessonId: id } } });
    const unlocked = !!progress?.transcript;
    if (!progress) await this.prisma.userLesson.create({ data: { userId, lessonId: id } });
    const answered = !!progress?.answers;

    return {
      id: lesson.id,
      kind: lesson.kind,
      title: lesson.title,
      situation: lesson.situation,
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
      include: { questions: { orderBy: { idx: 'asc' } } },
    });
    if (!lesson || !lesson.published) throw new NotFoundException('Không có bài này');
    if (lesson.kind === 'STORY' && !(await this.event.canReadStory(userId, id))) {
      throw new ForbiddenException('Hồi này chưa mở');
    }
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
    const lesson = await this.prisma.lesson.findUnique({ where: { id } });
    if (!lesson || !lesson.published) throw new NotFoundException('Không có bài này');
    const today = vnDay(this.clock.now()).key;
    await this.prisma.userLesson.upsert({
      where: { userId_lessonId: { userId, lessonId: id } },
      create: { userId, lessonId: id, transcript: true, skippedDay: today },
      update: { transcript: true, skippedDay: today },
    });
    return { transcript: true };
  }
}
