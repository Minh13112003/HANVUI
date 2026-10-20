import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Clock } from '../common/time.js';
import { MissionService } from '../event/mission.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

/** Mã quà: nhập đúng mã thì nhận lượt gợi ý (một người dùng một mã một lần). */
@Injectable()
export class RedeemService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly missions: MissionService,
    private readonly clock: Clock,
  ) {}

  async redeem(userId: string, raw: string) {
    const code = raw.replace(/\s+/g, '').toUpperCase();
    const row = await this.prisma.redeemCode.findUnique({ where: { code } });
    if (!row || !row.active) throw new NotFoundException('Mã không đúng');
    if (row.expiresAt && row.expiresAt <= this.clock.now()) throw new BadRequestException('Mã đã hết hạn');

    return this.prisma.$transaction(async (tx) => {
      const used = await tx.redeemUse.findUnique({ where: { userId_codeId: { userId, codeId: row.id } } });
      if (used) throw new BadRequestException('Bạn đã dùng mã này rồi');
      const took = await tx.redeemCode.updateMany({
        where: { id: row.id, OR: [{ maxUses: null }, { used: { lt: row.maxUses ?? 0 } }] },
        data: { used: { increment: 1 } },
      });
      if (took.count !== 1) throw new BadRequestException('Mã đã hết lượt sử dụng');
      await tx.redeemUse.create({ data: { userId, codeId: row.id } });
      await this.missions.grantTokens(userId, row.tokens, 'CODE', `Mã quà ${row.code}`, tx);
      return { tokens: row.tokens, label: row.label };
    });
  }
}
