import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { ItemKind, MailSender, Prisma } from '../generated/prisma/client.js';
import { Clock } from '../common/time.js';
import { MissionService } from '../event/mission.service.js';
import { VIP_ITEM_DAYS } from '../event/event.rules.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { ListMailQuery, SendMailDto } from './mail.dto.js';

type MailRow = Prisma.MailGetPayload<{ include: { states: true } }>;

export interface MailReward {
  tokens?: number;
  item?: ItemKind;
}

const PAGE = 20;

@Injectable()
export class MailService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clock: Clock,
    private readonly missions: MissionService,
  ) {}

  // ───────────── Người dùng ─────────────

  /** Thư của tôi (kể cả thư gửi chung), mới nhất trước. Lọc theo người gửi, có/không quà, chưa đọc. */
  async list(userId: string, q: ListMailQuery) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { createdAt: true } });
    const and: Prisma.MailWhereInput[] = [
      { OR: [{ toUserId: userId }, { toUserId: null, createdAt: { gte: user.createdAt } }] },
      { states: { none: { userId, deletedAt: { not: null } } } },
    ];
    if (q.sender) and.push({ sender: q.sender });
    if (q.reward === 'true') and.push({ OR: [{ rewardTokens: { gt: 0 } }, { rewardItem: { not: null } }] });
    if (q.reward === 'false') and.push({ rewardTokens: 0, rewardItem: null });
    if (q.unread === 'true') and.push({ states: { none: { userId, readAt: { not: null } } } });

    const page = Math.max(1, q.page ?? 1);
    const [rows, total] = await Promise.all([
      this.prisma.mail.findMany({
        where: { AND: and },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * PAGE,
        take: PAGE,
        include: { states: { where: { userId } } },
      }),
      this.prisma.mail.count({ where: { AND: and } }),
    ]);
    return { page, pageSize: PAGE, total, items: rows.map((m) => this.toItem(m, false)), counts: await this.counts(userId, user.createdAt) };
  }

  /** Số thư chưa đọc và số thư còn quà chưa nhận (cho chấm đỏ ở tab tài khoản). */
  async counts(userId: string, createdAt?: Date) {
    const since = createdAt ?? (await this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { createdAt: true } })).createdAt;
    const visible: Prisma.MailWhereInput[] = [
      { OR: [{ toUserId: userId }, { toUserId: null, createdAt: { gte: since } }] },
      { states: { none: { userId, deletedAt: { not: null } } } },
    ];
    const hasReward: Prisma.MailWhereInput = { OR: [{ rewardTokens: { gt: 0 } }, { rewardItem: { not: null } }] };
    const [unread, unclaimed] = await Promise.all([
      this.prisma.mail.count({ where: { AND: [...visible, { states: { none: { userId, readAt: { not: null } } } }] } }),
      this.prisma.mail.count({
        where: {
          AND: [...visible, hasReward, { states: { none: { userId, claimedAt: { not: null } } } }, { OR: [{ expiresAt: null }, { expiresAt: { gt: this.clock.now() } }] }],
        },
      }),
    ]);
    return { unread, unclaimed };
  }

  /** Mở một thư: trả đủ nội dung và đánh dấu đã đọc. */
  async read(userId: string, id: number) {
    const mail = await this.visible(userId, id);
    await this.prisma.userMail.upsert({
      where: { userId_mailId: { userId, mailId: id } },
      create: { userId, mailId: id, readAt: this.clock.now() },
      update: { readAt: mail.states[0]?.readAt ?? this.clock.now() },
    });
    const fresh = await this.visible(userId, id);
    return this.toItem(fresh, true);
  }

  /** Nhận quà của một thư. Chỉ nhận được một lần, thư hết hạn thì không nhận được. */
  async claim(userId: string, id: number) {
    const now = this.clock.now();
    return this.prisma.$transaction(async (tx) => {
      const mail = await this.visibleIn(tx, userId, id);
      if (!this.hasReward(mail)) throw new BadRequestException('Thư này không có quà');
      if (mail.expiresAt && mail.expiresAt <= now) throw new BadRequestException('Thư đã hết hạn nhận quà');
      await tx.userMail.upsert({ where: { userId_mailId: { userId, mailId: id } }, create: { userId, mailId: id }, update: {} });
      const won = await tx.userMail.updateMany({ where: { userId, mailId: id, claimedAt: null }, data: { claimedAt: now, readAt: now } });
      if (won.count !== 1) throw new BadRequestException('Bạn đã nhận quà của thư này rồi');

      if (mail.rewardTokens > 0) await this.missions.grantTokens(userId, mail.rewardTokens, 'MAIL', `Quà thư #${id}: ${mail.subject}`.slice(0, 200), tx);
      if (mail.rewardItem) {
        await tx.inventoryItem.upsert({
          where: { userId_source: { userId, source: `mail:${id}` } },
          create: { userId, kind: mail.rewardItem, source: `mail:${id}`, expiresAt: new Date(now.getTime() + VIP_ITEM_DAYS * 86_400_000) },
          update: {},
        });
      }
      return { claimed: true, reward: { tokens: mail.rewardTokens, item: mail.rewardItem } };
    });
  }

  /** Nhận quà của mọi thư còn quà chưa nhận (và chưa hết hạn). */
  async claimAll(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { createdAt: true } });
    const now = this.clock.now();
    const mails = await this.prisma.mail.findMany({
      where: {
        AND: [
          { OR: [{ toUserId: userId }, { toUserId: null, createdAt: { gte: user.createdAt } }] },
          { states: { none: { userId, OR: [{ deletedAt: { not: null } }, { claimedAt: { not: null } }] } } },
          { OR: [{ rewardTokens: { gt: 0 } }, { rewardItem: { not: null } }] },
          { OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] },
        ],
      },
      select: { id: true },
    });
    let tokens = 0;
    let items = 0;
    for (const m of mails) {
      try {
        const r = await this.claim(userId, m.id);
        tokens += r.reward.tokens;
        if (r.reward.item) items++;
      } catch {
        // thư vừa được nhận ở nơi khác: bỏ qua
      }
    }
    return { mails: mails.length, tokens, items };
  }

  async readAll(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { createdAt: true } });
    const now = this.clock.now();
    const unread = await this.prisma.mail.findMany({
      where: {
        AND: [
          { OR: [{ toUserId: userId }, { toUserId: null, createdAt: { gte: user.createdAt } }] },
          { states: { none: { userId, readAt: { not: null } } } },
        ],
      },
      select: { id: true },
    });
    if (unread.length) {
      await this.prisma.$transaction(
        unread.map((m) =>
          this.prisma.userMail.upsert({ where: { userId_mailId: { userId, mailId: m.id } }, create: { userId, mailId: m.id, readAt: now }, update: { readAt: now } }),
        ),
      );
    }
    return { marked: unread.length };
  }

  /** Xóa thư khỏi hộp thư. Thư còn quà chưa nhận (và chưa hết hạn) thì không cho xóa, để khỏi mất quà. */
  async remove(userId: string, id: number) {
    const mail = await this.visible(userId, id);
    const claimed = !!mail.states[0]?.claimedAt;
    const expired = !!mail.expiresAt && mail.expiresAt <= this.clock.now();
    if (this.hasReward(mail) && !claimed && !expired) throw new BadRequestException('Hãy nhận quà trước khi xóa thư');
    await this.prisma.userMail.upsert({
      where: { userId_mailId: { userId, mailId: id } },
      create: { userId, mailId: id, deletedAt: this.clock.now(), readAt: this.clock.now() },
      update: { deletedAt: this.clock.now() },
    });
  }

  // ───────────── Hệ thống ─────────────

  /** Thư tự động của hệ thống gửi riêng cho một người (chào mừng, trúng thưởng...). */
  sendSystem(userId: string, subject: string, body: string, reward: MailReward = {}) {
    return this.prisma.mail.create({
      data: { sender: 'SYSTEM', toUserId: userId, subject, body, rewardTokens: reward.tokens ?? 0, rewardItem: reward.item ?? null },
    });
  }

  // ───────────── Quản trị ─────────────

  /** Quản trị gửi thư: cho một người (theo email) hoặc cho mọi người. */
  async adminSend(adminId: string, dto: SendMailDto) {
    let toUserId: string | null = null;
    if (dto.toEmail) {
      const u = await this.prisma.user.findUnique({ where: { email: dto.toEmail }, select: { id: true } });
      if (!u) throw new NotFoundException('Không có người dùng với email này');
      toUserId = u.id;
    }
    const now = this.clock.now();
    const mail = await this.prisma.mail.create({
      data: {
        sender: 'ADMIN',
        toUserId,
        subject: dto.subject,
        body: dto.body,
        rewardTokens: dto.rewardTokens ?? 0,
        rewardItem: dto.rewardItem ?? null,
        createdBy: adminId,
        expiresAt: dto.expiresInDays ? new Date(now.getTime() + dto.expiresInDays * 86_400_000) : null,
      },
    });
    return { id: mail.id, audience: toUserId ? 'one' : 'all' };
  }

  /** Thư quản trị đã gửi, kèm số người đã đọc và đã nhận quà. */
  async adminList() {
    const mails = await this.prisma.mail.findMany({
      where: { sender: 'ADMIN' },
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { states: true },
    });
    return mails.map((m) => ({
      id: m.id,
      subject: m.subject,
      audience: m.toUserId ? 'one' : 'all',
      rewardTokens: m.rewardTokens,
      rewardItem: m.rewardItem,
      createdAt: m.createdAt,
      expiresAt: m.expiresAt,
      read: m.states.filter((s) => s.readAt).length,
      claimed: m.states.filter((s) => s.claimedAt).length,
    }));
  }

  // ───────────── Dùng chung ─────────────

  private hasReward(m: { rewardTokens: number; rewardItem: ItemKind | null }) {
    return m.rewardTokens > 0 || m.rewardItem !== null;
  }

  private async visible(userId: string, id: number): Promise<MailRow> {
    return this.visibleIn(this.prisma, userId, id);
  }

  private async visibleIn(db: Pick<PrismaService, 'mail' | 'user'>, userId: string, id: number): Promise<MailRow> {
    const user = await db.user.findUniqueOrThrow({ where: { id: userId }, select: { createdAt: true } });
    const mail = await db.mail.findFirst({
      where: { id, OR: [{ toUserId: userId }, { toUserId: null, createdAt: { gte: user.createdAt } }] },
      include: { states: { where: { userId } } },
    });
    if (!mail || mail.states[0]?.deletedAt) throw new NotFoundException('Không có thư này');
    return mail;
  }

  private toItem(m: MailRow, full: boolean) {
    const st = m.states[0];
    const expired = !!m.expiresAt && m.expiresAt <= this.clock.now();
    const hasReward = this.hasReward(m);
    return {
      id: m.id,
      sender: m.sender as MailSender,
      subject: m.subject,
      ...(full ? { body: m.body } : { preview: m.body.replace(/\s+/g, ' ').slice(0, 80) }),
      createdAt: m.createdAt,
      expiresAt: m.expiresAt,
      hasReward,
      reward: hasReward ? { tokens: m.rewardTokens, item: m.rewardItem } : null,
      read: !!st?.readAt,
      claimed: !!st?.claimedAt,
      expired,
      claimable: hasReward && !st?.claimedAt && !expired,
    };
  }
}
