import { Injectable } from '@nestjs/common';
import { Clock, vnDay, type VnDay } from '../common/time.js';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  absenceBonus,
  BIT,
  catchUpPack,
  DAILY,
  isMonthEndBonusDay,
  isReserveDay,
  MONTH_END_LOGIN,
  RESERVE_LOGIN,
  TOTAL_KEYS,
  weekIndex,
  weeklyClaim,
} from './event.rules.js';

const FLAG_CATCHUP = 1;
const PING_MAX_GAP_SEC = 120; // quá 2 phút không thao tác thì ngừng tính online

const countBits = (mask: number, from: number, to: number) => {
  let n = 0;
  for (let d = from; d <= to; d++) if (mask & (1 << (d - 1))) n++;
  return n;
};

@Injectable()
export class MissionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clock: Clock,
  ) {}

  /**
   * Gọi khi mở app mỗi ngày (idempotent). Tạo hàng sự kiện của tháng nếu chưa có, ghi ngày đăng nhập,
   * cộng lượt: đăng nhập, bù ngày vắng, thưởng cuối tháng, ngày dự trữ, gói theo kịp.
   * Người tắt sự kiện vẫn được ghi ngày nhưng không nhận lượt, không tính tiến độ tuần.
   */
  async checkin(userId: string) {
    const now = this.clock.now();
    const day = vnDay(now);
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { eventOptOut: true } });
    const bit = 1 << (day.day - 1);

    return this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`
        INSERT INTO "UserEvent" ("userId","month","joinDay","lastLoginDay","createdAt","updatedAt")
        VALUES (${userId}::uuid, ${day.monthKey}, ${day.day}, 0, now(), now())
        ON CONFLICT ("userId","month") DO NOTHING`;
      await tx.$queryRaw`SELECT 1 FROM "UserEvent" WHERE "userId"=${userId}::uuid AND "month"=${day.monthKey} FOR UPDATE`;
      const ev = await tx.userEvent.findUniqueOrThrow({ where: { userId_month: { userId, month: day.monthKey } } });
      if (ev.lastLoginDay === day.day) return { granted: 0, alreadyCheckedIn: true };

      const out = user.eventOptOut;
      const parts: { kind: 'ABSENCE' | 'MONTH_END' | 'RESERVE' | 'CATCHUP' | null; n: number; reason: string }[] = [];
      let flags = ev.flags;

      if (!out) {
        const allSolved = ev.solved >= TOTAL_KEYS;
        parts.push({ kind: null, n: DAILY.login, reason: 'Đăng nhập' });
        if (ev.lastLoginDay > 0) {
          const bonus = absenceBonus(ev.lastLoginDay, day.day);
          if (bonus) parts.push({ kind: 'ABSENCE', n: bonus, reason: `Bù ${bonus / 2} ngày vắng` });
        }
        if (isMonthEndBonusDay(day.day)) parts.push({ kind: 'MONTH_END', n: MONTH_END_LOGIN, reason: 'Thưởng ngày cuối tháng' });
        if (isReserveDay(day.day) && !allSolved) parts.push({ kind: 'RESERVE', n: RESERVE_LOGIN, reason: 'Ngày dự trữ' });
        const pack = catchUpPack(ev.joinDay);
        if (pack && !(flags & FLAG_CATCHUP)) {
          parts.push({ kind: 'CATCHUP', n: pack, reason: `Gói theo kịp (vào ngày ${ev.joinDay})` });
          flags |= FLAG_CATCHUP;
        }
      }

      const granted = parts.reduce((s, p) => s + p.n, 0);
      await tx.userEvent.update({
        where: { userId_month: { userId, month: day.monthKey } },
        data: {
          lastLoginDay: day.day,
          flags,
          ...(out ? {} : { loginBits: ev.loginBits | bit, tokens: { increment: granted } }),
        },
      });
      const ledger = parts.filter((p) => p.kind);
      if (ledger.length) {
        await tx.tokenLedger.createMany({
          data: ledger.map((p) => ({ userId, month: day.monthKey, delta: p.n, kind: p.kind!, reason: p.reason })),
        });
      }
      if (!out) {
        const m = await tx.userMission.findUnique({ where: { userId_day: { userId, day: day.key } } });
        await tx.userMission.upsert({
          where: { userId_day: { userId, day: day.key } },
          create: { userId, day: day.key, claimed: BIT.login },
          update: { claimed: (m?.claimed ?? 0) | BIT.login },
        });
        await this.claimWeekly(tx, userId, day, !out);
      }
      return { granted, alreadyCheckedIn: false, parts: parts.map((p) => ({ reason: p.reason, tokens: p.n })) };
    });
  }

  /** Báo đang thao tác. Cộng thời gian online (tối đa 2 phút giữa hai lần báo) và nhận thưởng online. */
  async ping(userId: string) {
    const now = this.clock.now();
    const day = vnDay(now);
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { eventOptOut: true } });
    return this.prisma.$transaction(async (tx) => {
      const m = await tx.userMission.upsert({
        where: { userId_day: { userId, day: day.key } },
        create: { userId, day: day.key, lastPingAt: now },
        update: {},
      });
      const gap = m.lastPingAt ? Math.floor((now.getTime() - m.lastPingAt.getTime()) / 1000) : 0;
      const credit = gap > 0 && gap <= PING_MAX_GAP_SEC ? gap : 0;
      const onlineSec = m.onlineSec + credit;
      let claimed = m.claimed;
      let grant = 0;
      if (!user.eventOptOut && onlineSec >= DAILY.onlineSec && !(claimed & BIT.online)) {
        claimed |= BIT.online;
        grant += DAILY.online;
      }
      await tx.userMission.update({ where: { userId_day: { userId, day: day.key } }, data: { onlineSec, lastPingAt: now, claimed } });
      if (!user.eventOptOut) {
        await this.ensureRow(tx, userId, day);
        if (grant) await this.addTokens(tx, userId, day.monthKey, grant);
        if (credit && !isReserveDay(day.day)) {
          const ev = await tx.userEvent.findUniqueOrThrow({ where: { userId_month: { userId, month: day.monthKey } } });
          const w = weekIndex(day.day);
          const arr = [...ev.weekOnlineSec];
          arr[w] += credit;
          await tx.userEvent.update({ where: { userId_month: { userId, month: day.monthKey } }, data: { weekOnlineSec: arr } });
        }
        await this.claimWeekly(tx, userId, day, true);
      }
      return { onlineSec, granted: grant };
    });
  }

  /** Một bài nghe, trả lời hết câu hỏi (đã lọc nghe đủ 80%). 2 bài khác nhau trong ngày: +2 lượt. */
  async onLessonCompleted(userId: string, lessonId: string) {
    const now = this.clock.now();
    const day = vnDay(now);
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { eventOptOut: true } });
    return this.prisma.$transaction(async (tx) => {
      const m = await tx.userMission.upsert({
        where: { userId_day: { userId, day: day.key } },
        create: { userId, day: day.key },
        update: {},
      });
      if (m.lessonIds.includes(lessonId)) return { lessonsToday: m.lessonIds.length, granted: 0, counted: false };
      const lessonIds = [...m.lessonIds, lessonId];
      let claimed = m.claimed;
      let grant = 0;
      if (!user.eventOptOut && lessonIds.length >= DAILY.lessonsNeeded && !(claimed & BIT.lessons)) {
        claimed |= BIT.lessons;
        grant += DAILY.lessons;
      }
      await tx.userMission.update({ where: { userId_day: { userId, day: day.key } }, data: { lessonIds, claimed } });
      if (!user.eventOptOut) {
        await this.ensureRow(tx, userId, day);
        if (grant) await this.addTokens(tx, userId, day.monthKey, grant);
        if (!isReserveDay(day.day)) {
          const ev = await tx.userEvent.findUniqueOrThrow({ where: { userId_month: { userId, month: day.monthKey } } });
          const arr = [...ev.weekLessons];
          arr[weekIndex(day.day)] += 1;
          await tx.userEvent.update({ where: { userId_month: { userId, month: day.monthKey } }, data: { weekLessons: arr } });
        }
        await this.claimWeekly(tx, userId, day, true);
      }
      return { lessonsToday: lessonIds.length, granted: grant, counted: true };
    });
  }

  private async ensureRow(tx: Tx, userId: string, day: VnDay) {
    await tx.$executeRaw`
      INSERT INTO "UserEvent" ("userId","month","joinDay","lastLoginDay","createdAt","updatedAt")
      VALUES (${userId}::uuid, ${day.monthKey}, ${day.day}, 0, now(), now())
      ON CONFLICT ("userId","month") DO NOTHING`;
  }

  private addTokens(tx: Tx, userId: string, month: string, n: number) {
    return tx.userEvent.update({ where: { userId_month: { userId, month } }, data: { tokens: { increment: n } } });
  }

  /** Nhận các mốc nhiệm vụ tuần mới đạt. Ngày dự trữ không có tuần 5: tiến độ tuần 4 giữ nguyên. */
  private async claimWeekly(tx: Tx, userId: string, day: VnDay, enabled: boolean) {
    if (!enabled) return 0;
    const ev = await tx.userEvent.findUnique({ where: { userId_month: { userId, month: day.monthKey } } });
    if (!ev) return 0;
    const w = weekIndex(day.day);
    const from = w * 7 + 1;
    const { tokens, bits } = weeklyClaim(
      { login: countBits(ev.loginBits, from, from + 6), online: ev.weekOnlineSec[w], lessons: ev.weekLessons[w] },
      ev.weekClaimed[w],
    );
    if (!tokens) return 0;
    const claimed = [...ev.weekClaimed];
    claimed[w] = bits;
    await tx.userEvent.update({
      where: { userId_month: { userId, month: day.monthKey } },
      data: { tokens: { increment: tokens }, weekClaimed: claimed },
    });
    return tokens;
  }
}

type Tx = Parameters<Parameters<PrismaService['$transaction']>[0]>[0];
