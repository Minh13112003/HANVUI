import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { hasHan, isChineseAnswer, pinyinKey } from '../common/text.js';
import { Clock, vnDay } from '../common/time.js';
import { demo } from '../config/demo.js';
import { hintLessonOf, pickHintLesson, slotLessons } from './hint-lesson.js';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  cellsOpen,
  chapterOfDay,
  HINT_COST,
  hoiOpened,
  MEDAL_NAMES,
  medalFor,
  medalThresholds,
  onWrongGuess,
  pointsFor,
  SLOTS_PER_CHAPTER,
  TOTAL_KEYS,
  unlockDay,
  VIP_ITEM_DAYS,
  VIP_GRANT_DAYS,
  weekIndex,
  WEEKLY,
} from './event.rules.js';
import { MissionService } from './mission.service.js';
import { orderSlots } from './slot-order.js';

export interface Hint {
  zh: string;
  vi: string;
}
export type ByGroup = Record<string, Hint>;

/** Số ô đã mở của chương vào ngày `dayNo`. Bản demo (EVENT_OPEN_ALL) mở hết mọi ô của mọi chương. */
const openCount = (chapterIdx: number, dayNo: number) => (demo.openAll ? SLOTS_PER_CHAPTER : cellsOpen(chapterIdx, dayNo));

/** Nhóm cấp dùng cho gợi ý 2, 3: người học cấp 3 trở lên được trỏ tới hội thoại cấp cao. */
const groupOf = (hskLevel: number) => (hskLevel >= 3 ? 2 : 1);

@Injectable()
export class EventService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clock: Clock,
    private readonly missions: MissionService,
  ) {}

  checkin(userId: string) {
    return this.missions.checkin(userId);
  }
  ping(userId: string) {
    return this.missions.ping(userId);
  }
  today(userId: string) {
    return this.missions.today(userId);
  }
  onLessonCompleted(userId: string, lessonId: string) {
    return this.missions.onLessonCompleted(userId, lessonId);
  }

  /** Thứ tự ô riêng của từng người: xáo theo mã người dùng (rule.md 5.3). */
  private order<T extends { id: number }>(userId: string, month: string, slots: T[]): T[] {
    return orderSlots(userId, month, slots);
  }

  private async currentStory(month: string) {
    return this.prisma.story.findUnique({
      where: { month },
      include: {
        chapters: {
          orderBy: { idx: 'asc' },
          include: { slots: { include: { word: true }, orderBy: { idx: 'asc' } }, hoi: { orderBy: { idx: 'asc' } } },
        },
      },
    });
  }

  /** Toàn bộ trạng thái màn Sự kiện. Từ khóa chưa giải không bao giờ có trong kết quả. */
  async state(userId: string) {
    const now = this.clock.now();
    const day = vnDay(now);
    const [user, story, ev] = await Promise.all([
      this.prisma.user.findUniqueOrThrow({ where: { id: userId } }),
      this.currentStory(day.monthKey),
      this.prisma.userEvent.findUnique({ where: { userId_month: { userId, month: day.monthKey } } }),
    ]);
    if (!story) return { active: false, month: day.monthKey };

    const mine = new Map(
      (await this.prisma.userSlot.findMany({ where: { userId, slot: { chapter: { storyId: story.id } } } })).map((u) => [u.slotId, u]),
    );
    const group = groupOf(user.hskLevel);
    const lessonsBySlot = await slotLessons(this.prisma, story.id);
    const curChapter = chapterOfDay(day.day);

    const chapters = story.chapters
      .filter((c) => openCount(c.idx, day.day) > 0)
      .map((c) => {
        const open = openCount(c.idx, day.day);
        const ordered = this.order(userId, day.monthKey, c.slots);
        const cells = ordered.map((s, pos) => {
          const u = mine.get(s.id);
          const solved = !!u?.foundAt;
          const hints = u?.hintsOpened ?? 0;
          if (pos >= open) {
            return { pos, slotId: s.id, status: 'locked' as const, unlockDay: unlockDay(c.idx, pos) };
          }
          const g = (n: number) => (u?.hintGroups?.[n - 1] ?? group).toString();
          return {
            pos,
            slotId: s.id,
            status: solved ? ('solved' as const) : ('open' as const),
            hintsOpened: hints,
            hintGeneral: s.hintGeneral,
            hint1: hints >= 1 ? s.hint1 : null,
            hint2: hints >= 2 ? (s.hint2 as unknown as ByGroup)[g(2)] ?? null : null,
            hint3: hints >= 3 ? (s.hint3 as unknown as ByGroup)[g(3)] ?? null : null,
            // Gợi ý 2 chỉ thẳng một bài chứa từ khóa (tên bài đã che nếu trùng từ khóa).
            hint2Lesson: hints >= 2 ? pickHintLesson(s.word, lessonsBySlot.get(s.id) ?? [], Number(g(2))) : null,
            clueTopicId: hints >= 1 ? s.clueTopicId : null,
            points: solved ? u!.points : null,
            // Chỉ ô đã giải mới lộ từ khóa.
            word: solved ? { zh: s.word.zh, pinyin: s.word.pinyin, vi: s.word.vi } : null,
          };
        });
        const solvedN = cells.filter((x) => x.status === 'solved').length;
        return {
          idx: c.idx,
          current: c.idx === curChapter,
          solved: solvedN,
          hoi: c.hoi.map((h) => ({
            idx: h.idx,
            title: h.title,
            titleZh: h.titleZh,
            opened: hoiOpened(solvedN) >= h.idx,
            lessonId: hoiOpened(solvedN) >= h.idx ? h.storyLessonId : null,
          })),
          cells,
        };
      });

    const w = weekIndex(day.day);
    const e = ev ?? null;
    return {
      active: true,
      story: { id: story.id, title: story.title, titleZh: story.titleZh, month: story.month },
      openAll: demo.openAll,
      day: day.day,
      daysInMonth: day.daysInMonth,
      reserveDay: day.day >= 29,
      optedOut: user.eventOptOut,
      tokens: e?.tokens ?? 0,
      points: e?.points ?? 0,
      solved: e?.solved ?? 0,
      totalKeys: TOTAL_KEYS,
      medal: { level: e?.medal ?? 0, name: e?.medal ? MEDAL_NAMES[e.medal - 1] : null, thresholds: medalThresholds() },
      lockedUntil: e?.lockedUntil && e.lockedUntil > now ? e.lockedUntil : null,
      wrongLeft: e?.left ?? 3,
      pendingPenalty: e?.penalty ?? 0,
      week: {
        index: w + 1,
        login: e ? [...Array(7).keys()].filter((i) => e.loginBits & (1 << (w * 7 + i))).length : 0,
        online: e?.weekOnlineSec[w] ?? 0,
        lessons: e?.weekLessons[w] ?? 0,
        marks: WEEKLY,
        claimed: e?.weekClaimed[w] ?? 0,
      },
      chapters,
    };
  }

  /** Mở gợi ý kế tiếp của một ô: tuần tự, tốn 1 lượt. */
  async openHint(userId: string, slotId: number) {
    const now = this.clock.now();
    const day = vnDay(now);
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (user.eventOptOut) throw new ForbiddenException('Bạn đang tắt sự kiện');
    const slot = await this.prisma.keySlot.findUnique({ where: { id: slotId }, include: { chapter: { include: { story: true, slots: true } } } });
    if (!slot || slot.chapter.story.month !== day.monthKey) throw new NotFoundException('Không có ô này');
    this.assertUnlocked(userId, day.monthKey, slot, day.day);

    const r = await this.prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT 1 FROM "UserEvent" WHERE "userId"=${userId}::uuid AND "month"=${day.monthKey} FOR UPDATE`;
      const u = await tx.userSlot.findUnique({ where: { userId_slotId: { userId, slotId } } });
      if (u?.foundAt) throw new BadRequestException('Ô này đã giải');
      const opened = u?.hintsOpened ?? 0;
      if (opened >= 3) throw new BadRequestException('Đã mở hết gợi ý');
      const paid = await tx.userEvent.updateMany({
        where: { userId, month: day.monthKey, tokens: { gte: HINT_COST } },
        data: { tokens: { decrement: HINT_COST } },
      });
      if (paid.count !== 1) throw new BadRequestException('Không đủ lượt gợi ý');
      const group = groupOf(user.hskLevel);
      await tx.userSlot.upsert({
        where: { userId_slotId: { userId, slotId } },
        create: { userId, slotId, hintsOpened: 1, hintGroups: [group] },
        update: { hintsOpened: opened + 1, hintGroups: [...(u?.hintGroups ?? []), group] },
      });
      await tx.tokenLedger.create({ data: { userId, month: day.monthKey, delta: -HINT_COST, kind: 'HINT', reason: `Ô ${slotId}, gợi ý ${opened + 1}` } });
      const n = opened + 1;
      const hint = n === 1 ? slot.hint1 : (((n === 2 ? slot.hint2 : slot.hint3) as unknown as ByGroup)[String(group)] ?? null);
      const left = await tx.userEvent.findUniqueOrThrow({ where: { userId_month: { userId, month: day.monthKey } }, select: { tokens: true } });
      return { hintNo: n, hint, clueTopicId: n === 1 ? slot.clueTopicId : undefined, tokens: left.tokens, group };
    });
    const { group: g, ...out } = r;
    return { ...out, hint2Lesson: out.hintNo === 2 ? await hintLessonOf(this.prisma, slotId, g) : null };
  }

  /** Ô vị trí `pos` của người này đã mở theo lịch chưa. Ném lỗi nếu chưa. */
  private assertUnlocked(
    userId: string,
    month: string,
    slot: { id: number; chapter: { idx: number; slots: { id: number }[] } },
    dayNo: number,
  ) {
    const pos = this.order(userId, month, slot.chapter.slots).findIndex((s) => s.id === slot.id);
    if (pos >= openCount(slot.chapter.idx, dayNo)) {
      throw new ForbiddenException(`Mở vào ngày ${unlockDay(slot.chapter.idx, pos)}`);
    }
  }

  /**
   * Đoán từ khóa sau khi vừa học một bài. Đoán đúng nếu từ là từ khóa chưa giải, đã mở gợi ý 1, đã mở theo lịch,
   * và nằm trong bài vừa học. Mọi trường hợp khác tính là một lần sai (không tiết lộ ô có tồn tại hay không).
   */
  async guess(userId: string, lessonId: string, rawAnswer: string) {
    const now = this.clock.now();
    const day = vnDay(now);
    const answer = rawAnswer.trim();
    if (!answer || !isChineseAnswer(answer)) {
      throw new BadRequestException('Chỉ nhận đáp án tiếng Trung (chữ Hán hoặc pinyin)');
    }
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (user.eventOptOut) throw new ForbiddenException('Bạn đang tắt sự kiện');
    const story = await this.currentStory(day.monthKey);
    if (!story) throw new NotFoundException('Chưa có sự kiện tháng này');

    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId }, include: { lines: true } });
    const seen = await this.prisma.userLesson.findUnique({ where: { userId_lessonId: { userId, lessonId } } });
    if (!lesson || !seen) throw new BadRequestException('Hãy mở bài học trước khi nhập từ khóa');
    const text = lesson.lines.map((l) => l.zh).join('');

    return this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`
        INSERT INTO "UserEvent" ("userId","month","joinDay","lastLoginDay","createdAt","updatedAt")
        VALUES (${userId}::uuid, ${day.monthKey}, ${day.day}, 0, now(), now())
        ON CONFLICT ("userId","month") DO NOTHING`;
      await tx.$queryRaw`SELECT 1 FROM "UserEvent" WHERE "userId"=${userId}::uuid AND "month"=${day.monthKey} FOR UPDATE`;
      const ev = await tx.userEvent.findUniqueOrThrow({ where: { userId_month: { userId, month: day.monthKey } } });
      if (ev.lockedUntil && ev.lockedUntil > now) {
        throw new HttpException({ message: 'Bạn đang bị khóa đoán tạm thời', lockedUntil: ev.lockedUntil }, HttpStatus.TOO_MANY_REQUESTS);
      }

      const mine = new Map((await tx.userSlot.findMany({ where: { userId, slot: { chapter: { storyId: story.id } } } })).map((u) => [u.slotId, u]));
      const key = pinyinKey(answer);
      let hit: { slot: (typeof story.chapters)[number]['slots'][number]; chapter: (typeof story.chapters)[number] } | null = null;
      for (const chapter of story.chapters) {
        const open = openCount(chapter.idx, day.day);
        const ordered = this.order(userId, day.monthKey, chapter.slots);
        ordered.forEach((slot, pos) => {
          const u = mine.get(slot.id);
          const matches = hasHan(answer) ? slot.word.zh === answer : pinyinKey(slot.word.pinyin) === key;
          if (matches && pos < open && !u?.foundAt && (u?.hintsOpened ?? 0) >= 1 && text.includes(slot.word.zh)) {
            hit = { slot, chapter };
          }
        });
      }

      if (!hit) {
        const o = onWrongGuess(ev.wrong);
        const lockedUntil = o.lockMs ? new Date(now.getTime() + o.lockMs) : null;
        await tx.userEvent.update({
          where: { userId_month: { userId, month: day.monthKey } },
          data: { wrong: o.wrong, left: o.left, penalty: { increment: o.addPenalty }, ...(lockedUntil ? { lockedUntil } : {}) },
        });
        const inLesson = hasHan(answer) && text.includes(answer);
        return {
          correct: false,
          message: inLesson ? 'Từ này có trong hội thoại nhưng không phải từ khóa' : 'Chưa đúng',
          wrongLeft: o.left,
          penaltyAdded: o.addPenalty,
          lockedUntil,
        };
      }

      const { slot, chapter } = hit as { slot: (typeof story.chapters)[number]['slots'][number]; chapter: (typeof story.chapters)[number] };
      const u = mine.get(slot.id)!;
      const early = demo.openAll || chapterOfDay(day.day) === chapter.idx;
      const pts = pointsFor(u.hintsOpened, early, ev.penalty);
      const solved = ev.solved + 1;
      const medal = Math.max(ev.medal, medalFor(solved));
      await tx.userSlot.update({ where: { userId_slotId: { userId, slotId: slot.id } }, data: { foundAt: now, points: pts, early } });
      await tx.userEvent.update({
        where: { userId_month: { userId, month: day.monthKey } },
        data: { solved, points: { increment: pts }, medal, penalty: 0, lastSolvedAt: now },
      });
      // Từ khóa đã giải KHÔNG tự vào sổ tay: người học tự bấm "Lưu vào Sổ tay" (POST notebook).
      let vipItem = false;
      if (medal === 4 && ev.medal < 4) {
        await tx.inventoryItem.upsert({
          where: { userId_source: { userId, source: `event:${day.monthKey}:medal4` } },
          create: { userId, kind: 'VIP_3D', source: `event:${day.monthKey}:medal4`, expiresAt: new Date(now.getTime() + VIP_ITEM_DAYS * 86_400_000) },
          update: {},
        });
        vipItem = true;
      }
      const inChapter = await tx.userSlot.count({ where: { userId, foundAt: { not: null }, slot: { chapterId: chapter.id } } });
      return {
        correct: true,
        word: { zh: slot.word.zh, pinyin: slot.word.pinyin, vi: slot.word.vi },
        points: pts,
        solved,
        newMedal: medal > ev.medal ? { level: medal, name: MEDAL_NAMES[medal - 1] } : null,
        hoiOpened: hoiOpened(inChapter) > hoiOpened(inChapter - 1) ? hoiOpened(inChapter) : null,
        vipItem,
      };
    });
  }

  async setOptOut(userId: string, out: boolean) {
    await this.prisma.user.update({ where: { id: userId }, data: { eventOptOut: out } });
    return { optedOut: out };
  }

  /** Bảng xếp hạng chung: điểm → huy chương → ai giải xong sớm hơn. */
  async leaderboard(userId: string, limit = 50) {
    const month = vnDay(this.clock.now()).monthKey;
    const orderBy = [{ points: 'desc' as const }, { medal: 'desc' as const }, { lastSolvedAt: 'asc' as const }];
    const rows = await this.prisma.userEvent.findMany({
      where: { month, solved: { gt: 0 } },
      orderBy,
      take: limit,
      include: { user: { select: { id: true, displayName: true } } },
    });
    const board = rows.map((r, i) => ({
      rank: i + 1,
      name: r.user.displayName,
      points: r.points,
      solved: r.solved,
      medal: r.medal ? { level: r.medal, name: MEDAL_NAMES[r.medal - 1] } : null,
      me: r.userId === userId,
    }));
    let me = board.find((b) => b.me) ?? null;
    if (!me) {
      const mine = await this.prisma.userEvent.findUnique({ where: { userId_month: { userId, month } } });
      if (mine && mine.solved > 0) {
        const ahead = await this.prisma.userEvent.count({
          where: {
            month,
            solved: { gt: 0 },
            OR: [
              { points: { gt: mine.points } },
              { points: mine.points, medal: { gt: mine.medal } },
              { points: mine.points, medal: mine.medal, lastSolvedAt: { lt: mine.lastSolvedAt! } },
            ],
          },
        });
        me = { rank: ahead + 1, name: '', points: mine.points, solved: mine.solved, medal: mine.medal ? { level: mine.medal, name: MEDAL_NAMES[mine.medal - 1] } : null, me: true };
      }
    }
    return { month, board, me };
  }

  /** Hồi/bài truyện đọc được: hồi đã mở trong tháng đang chạy, hoặc mọi hồi sau khi sự kiện kết thúc (kho lưu trữ). */
  async canReadStory(userId: string, lessonId: string): Promise<boolean> {
    const hoi = await this.prisma.hoi.findFirst({ where: { storyLessonId: lessonId }, include: { chapter: { include: { story: true } } } });
    if (!hoi) return false;
    const cur = vnDay(this.clock.now()).monthKey;
    if (hoi.chapter.story.month < cur) return true;
    if (hoi.chapter.story.month > cur) return false;
    const solved = await this.prisma.userSlot.count({ where: { userId, foundAt: { not: null }, slot: { chapterId: hoi.chapterId } } });
    return hoiOpened(Math.min(solved, SLOTS_PER_CHAPTER)) >= hoi.idx;
  }

  // ───────────── Túi đồ ─────────────

  inventory(userId: string) {
    return this.prisma.inventoryItem.findMany({ where: { userId }, orderBy: { receivedAt: 'desc' } });
  }

  /** Mở vật phẩm VIP 3 ngày: kích hoạt và đếm ngược. Quá hạn mở thì hết dùng. */
  async openItem(userId: string, id: number) {
    const now = this.clock.now();
    const item = await this.prisma.inventoryItem.findFirst({ where: { id, userId } });
    if (!item) throw new NotFoundException('Không có vật phẩm này');
    if (item.openedAt) throw new BadRequestException('Vật phẩm đã được mở');
    if (item.expiresAt < now) throw new BadRequestException('Vật phẩm đã hết hạn dùng');
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const from = user.vipUntil && user.vipUntil > now ? user.vipUntil : now;
    const vipUntil = new Date(from.getTime() + VIP_GRANT_DAYS * 86_400_000);
    await this.prisma.$transaction([
      this.prisma.inventoryItem.update({ where: { id }, data: { openedAt: now } }),
      this.prisma.user.update({ where: { id: userId }, data: { vipUntil } }),
    ]);
    return { vipUntil };
  }
}
