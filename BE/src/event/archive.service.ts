import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { hasHan, isChineseAnswer, pinyinKey } from '../common/text.js';
import { Clock, vnDay } from '../common/time.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { ByGroup } from './event.service.js';
import { orderSlots } from './slot-order.js';

/** Nhóm cấp dùng cho gợi ý 2, 3 (giống EventService). */
const groupOf = (hskLevel: number) => (hskLevel >= 3 ? 2 : 1);

/**
 * Kho lưu trữ (rule.md 5.8): sau khi sự kiện kết thúc, truyện mở cho mọi người đọc, không điểm, không xếp hạng.
 * Chỉ từ khóa người đó đã giải mới hiện; từ chưa giải vẫn ẩn và giải được như luyện tập, mở gợi ý bằng
 * lượt luyện tập (nghe xong 2 bài khác nhau mỗi ngày được 1 lượt).
 */
@Injectable()
export class ArchiveService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clock: Clock,
  ) {}

  private currentMonth() {
    return vnDay(this.clock.now()).monthKey;
  }

  /** Các sự kiện đã kết thúc, kèm tiến độ sưu tập "đã khám phá X/Y từ khóa". */
  async list(userId: string) {
    const stories = await this.prisma.story.findMany({
      where: { month: { lt: this.currentMonth() } },
      orderBy: { month: 'desc' },
      include: { chapters: { include: { slots: { select: { id: true } } } } },
    });
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { practiceTokens: true } });
    const found = await this.prisma.userSlot.findMany({ where: { userId, foundAt: { not: null } }, select: { slotId: true } });
    const foundIds = new Set(found.map((f) => f.slotId));
    return {
      practiceTokens: user.practiceTokens,
      stories: stories.map((st) => {
        const ids = st.chapters.flatMap((c) => c.slots.map((s) => s.id));
        return { id: st.id, month: st.month, title: st.title, titleZh: st.titleZh, explored: ids.filter((i) => foundIds.has(i)).length, total: ids.length };
      }),
    };
  }

  /** Một sự kiện đã kết thúc: mọi hồi đọc được, ô đã giải lộ từ khóa, ô chưa giải chỉ có gợi ý đã mở. */
  async story(userId: string, month: string) {
    const story = await this.endedStory(month);
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { hskLevel: true, practiceTokens: true } });
    const mine = new Map(
      (await this.prisma.userSlot.findMany({ where: { userId, slot: { chapter: { storyId: story.id } } } })).map((u) => [u.slotId, u]),
    );
    const group = groupOf(user.hskLevel);
    let explored = 0;
    let total = 0;
    const chapters = story.chapters.map((c) => {
      const cells = orderSlots(userId, story.month, c.slots).map((s, pos) => {
        const u = mine.get(s.id);
        const solved = !!u?.foundAt;
        const hints = u?.hintsOpened ?? 0;
        const g = (n: number) => (u?.hintGroups?.[n - 1] ?? group).toString();
        total++;
        if (solved) explored++;
        return {
          pos,
          slotId: s.id,
          status: solved ? ('solved' as const) : ('open' as const),
          hintsOpened: hints,
          hintGeneral: s.hintGeneral,
          hint1: hints >= 1 ? s.hint1 : null,
          hint2: hints >= 2 ? ((s.hint2 as unknown as ByGroup)[g(2)] ?? null) : null,
          hint3: hints >= 3 ? ((s.hint3 as unknown as ByGroup)[g(3)] ?? null) : null,
          clueTopicId: hints >= 1 ? s.clueTopicId : null,
          word: solved ? { zh: s.word.zh, pinyin: s.word.pinyin, vi: s.word.vi } : null,
        };
      });
      return {
        idx: c.idx,
        title: c.title,
        solved: cells.filter((x) => x.status === 'solved').length,
        // Đã kết thúc: mọi hồi đọc được, không cần giải ô.
        hoi: c.hoi.map((h) => ({ idx: h.idx, title: h.title, titleZh: h.titleZh, lessonId: h.storyLessonId })),
        cells,
      };
    });
    return {
      story: { id: story.id, month: story.month, title: story.title, titleZh: story.titleZh },
      explored,
      total,
      practiceTokens: user.practiceTokens,
      chapters,
    };
  }

  /** Mở gợi ý kế tiếp của một ô bằng lượt luyện tập. */
  async openHint(userId: string, slotId: number) {
    const slot = await this.prisma.keySlot.findUnique({ where: { id: slotId }, include: { chapter: { include: { story: true } } } });
    if (!slot || slot.chapter.story.month >= this.currentMonth()) throw new NotFoundException('Ô này chưa vào kho lưu trữ');
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { hskLevel: true } });

    return this.prisma.$transaction(async (tx) => {
      const u = await tx.userSlot.findUnique({ where: { userId_slotId: { userId, slotId } } });
      if (u?.foundAt) throw new BadRequestException('Ô này đã giải');
      const opened = u?.hintsOpened ?? 0;
      if (opened >= 3) throw new BadRequestException('Đã mở hết gợi ý');
      const paid = await tx.user.updateMany({ where: { id: userId, practiceTokens: { gte: 1 } }, data: { practiceTokens: { decrement: 1 } } });
      if (paid.count !== 1) throw new BadRequestException('Không đủ lượt luyện tập (nghe xong 2 bài mỗi ngày được 1 lượt)');
      const group = groupOf(user.hskLevel);
      await tx.userSlot.upsert({
        where: { userId_slotId: { userId, slotId } },
        create: { userId, slotId, hintsOpened: 1, hintGroups: [group] },
        update: { hintsOpened: opened + 1, hintGroups: [...(u?.hintGroups ?? []), group] },
      });
      const n = opened + 1;
      const hint = n === 1 ? slot.hint1 : ((n === 2 ? slot.hint2 : slot.hint3) as unknown as ByGroup)[String(group)] ?? null;
      return { hintNo: n, hint, clueTopicId: n === 1 ? slot.clueTopicId : undefined };
    });
  }

  /**
   * Đoán một từ khóa của sự kiện đã kết thúc. Cùng luật với lúc đang diễn ra (phải mở gợi ý 1, từ phải nằm trong bài
   * vừa học, chỉ nhận tiếng Trung) nhưng không điểm, không phạt, không xếp hạng. Từ đúng tự vào sổ tay.
   */
  async guess(userId: string, lessonId: string, rawAnswer: string) {
    const answer = rawAnswer.trim();
    if (!answer || !isChineseAnswer(answer)) throw new BadRequestException('Chỉ nhận đáp án tiếng Trung (chữ Hán hoặc pinyin)');
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId }, include: { lines: true } });
    const seen = await this.prisma.userLesson.findUnique({ where: { userId_lessonId: { userId, lessonId } } });
    if (!lesson || !seen) throw new BadRequestException('Hãy mở bài học trước khi nhập từ khóa');
    const text = lesson.lines.map((l) => l.zh).join('');

    const mine = await this.prisma.userSlot.findMany({
      where: { userId, hintsOpened: { gte: 1 }, foundAt: null, slot: { chapter: { story: { month: { lt: this.currentMonth() } } } } },
      include: { slot: { include: { word: true } } },
    });
    const key = pinyinKey(answer);
    const hit = mine.find((u) => (hasHan(answer) ? u.slot.word.zh === answer : pinyinKey(u.slot.word.pinyin) === key) && text.includes(u.slot.word.zh));
    if (!hit) {
      const inLesson = hasHan(answer) && text.includes(answer);
      return { correct: false, message: inLesson ? 'Từ này có trong hội thoại nhưng không phải từ khóa' : 'Chưa đúng' };
    }
    const w = hit.slot.word;
    await this.prisma.$transaction([
      this.prisma.userSlot.update({ where: { userId_slotId: { userId, slotId: hit.slotId } }, data: { foundAt: this.clock.now(), points: 0, early: false } }),
      this.prisma.userWord.upsert({
        where: { userId_zh: { userId, zh: w.zh } },
        create: { userId, wordId: w.id, zh: w.zh, pinyin: w.pinyin, vi: w.vi, pos: w.pos, isPhrase: w.phrase, sourceLessonId: lessonId, savedDay: vnDay(this.clock.now()).key },
        update: {},
      }),
    ]);
    return { correct: true, word: { zh: w.zh, pinyin: w.pinyin, vi: w.vi }, points: 0 };
  }

  private async endedStory(month: string) {
    if (!/^\d{4}-\d{2}$/.test(month)) throw new BadRequestException('Tháng không hợp lệ');
    const story = await this.prisma.story.findUnique({
      where: { month },
      include: { chapters: { orderBy: { idx: 'asc' }, include: { slots: { include: { word: true }, orderBy: { idx: 'asc' } }, hoi: { orderBy: { idx: 'asc' } } } } },
    });
    if (!story) throw new NotFoundException('Không có sự kiện tháng này');
    if (story.month >= this.currentMonth()) throw new BadRequestException('Sự kiện này chưa kết thúc');
    return story;
  }
}
