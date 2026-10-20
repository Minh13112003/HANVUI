import { BadRequestException, ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { loadEnv } from '../config/env.js';
import { MissionService } from '../event/mission.service.js';
import { MailService } from '../mailbox/mail.service.js';
import type { User } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { mediaUrl } from '../media/media-url.js';
import type { LoginDto, RegisterDto, UpdateMeDto } from './auth.dto.js';

const BCRYPT_ROUNDS = 12;
// Băm giả để thời gian trả lời không lộ email có tồn tại hay không.
const DUMMY_HASH = '$2b$12$C6UzMDM.H6dfI/f/IKcEeO5nBo3yqU6bQmV6ZzV6mQ1o9sZP0dZzy';

export interface PublicUser {
  id: string;
  email: string;
  displayName: string;
  role: User['role'];
  hskStandard: User['hskStandard'];
  hskLevel: number;
  isVip: boolean;
  avatarUrl: string | null;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');

@Injectable()
export class AuthService {
  private readonly refreshTtlMs = loadEnv().refreshTtlDays * 24 * 3600 * 1000;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly missions: MissionService,
    private readonly mail: MailService,
  ) {}

  private readonly log = new Logger(AuthService.name);

  /** Việc làm một lần cho tài khoản mới: tặng lượt (bản demo) và thư chào mừng. Lỗi ở đây không làm hỏng đăng ký. */
  private async onboard(userId: string, displayName: string) {
    try {
      const n = await this.missions.grantStarter(userId);
      await this.mail.sendSystem(
        userId,
        'Chào mừng bạn đến với HanVui',
        `Chào ${displayName}! Mỗi ngày hãy nghe vài bài hội thoại, lưu từ mới vào Sổ tay và thử sức với sự kiện truyện.` +
          (n ? `

Bản demo tặng bạn ${n} lượt gợi ý để thử mọi tính năng.` : ''),
      );
      await this.mail.sendWelcomeCampaigns(userId, displayName);
    } catch (e) {
      this.log.error(`Không hoàn tất bước chào tài khoản mới ${userId}: ${(e as Error).message}`);
    }
  }

  toPublic(u: User): PublicUser {
    return {
      id: u.id,
      email: u.email,
      displayName: u.displayName,
      role: u.role,
      hskStandard: u.hskStandard,
      hskLevel: u.hskLevel,
      isVip: !!u.vipUntil && u.vipUntil.getTime() > Date.now(),
      avatarUrl: mediaUrl(u.avatarId, 'avatar'),
    };
  }

  async register(dto: RegisterDto, userAgent?: string) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email đã được đăng ký');

    const passwordHash = await hash(dto.password, BCRYPT_ROUNDS);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        displayName: dto.displayName,
      },
    });
    await this.onboard(user.id, user.displayName);
    return { user: this.toPublic(user), ...(await this.issue(user, randomUUID(), userAgent)) };
  }

  async login(dto: LoginDto, userAgent?: string) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    const ok = await compare(dto.password, user?.passwordHash ?? DUMMY_HASH);
    if (!user || !ok) throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    return { user: this.toPublic(user), ...(await this.issue(user, randomUUID(), userAgent)) };
  }

  /** Đổi refresh token cũ lấy cặp mới (xoay vòng). Dùng lại token đã thu hồi = nghi bị lấy cắp → hủy cả phiên. */
  async refresh(refreshToken: string, userAgent?: string): Promise<TokenPair> {
    const row = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: sha256(refreshToken) },
      include: { user: true },
    });
    if (!row) throw new UnauthorizedException('Phiên đăng nhập không hợp lệ');

    if (row.revokedAt) {
      await this.revokeFamily(row.family);
      throw new UnauthorizedException('Phiên đăng nhập không hợp lệ');
    }
    if (row.expiresAt.getTime() < Date.now()) throw new UnauthorizedException('Phiên đăng nhập đã hết hạn');

    // Chỉ một yêu cầu thắng khi hai yêu cầu cùng lúc dùng chung một token.
    const claimed = await this.prisma.refreshToken.updateMany({
      where: { id: row.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    if (claimed.count !== 1) {
      await this.revokeFamily(row.family);
      throw new UnauthorizedException('Phiên đăng nhập không hợp lệ');
    }
    return this.issue(row.user, row.family, userAgent);
  }

  async logout(refreshToken: string): Promise<void> {
    const row = await this.prisma.refreshToken.findUnique({ where: { tokenHash: sha256(refreshToken) } });
    if (row) await this.revokeFamily(row.family);
  }

  /** Đổi chuẩn HSK, cấp hoặc tên hiển thị. Cấp phải nằm trong số cấp của chuẩn đang chọn. */
  async updateMe(userId: string, dto: UpdateMeDto): Promise<PublicUser> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('Tài khoản không tồn tại');
    const standard = dto.hskStandard ?? user.hskStandard;
    const level = dto.hskLevel ?? user.hskLevel;
    const maxLevel = standard === 'HSK3' ? 9 : 6;
    if (level < 1 || level > maxLevel) {
      throw new BadRequestException(`Chuẩn ${standard === 'HSK3' ? 'HSK 3.0' : 'HSK 2.0'} chỉ có ${maxLevel} cấp`);
    }
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { hskStandard: standard, hskLevel: level, ...(dto.displayName ? { displayName: dto.displayName } : {}) },
    });
    return this.toPublic(updated);
  }

  async me(userId: string): Promise<PublicUser> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('Tài khoản không tồn tại');
    return this.toPublic(user);
  }

  private revokeFamily(family: string) {
    return this.prisma.refreshToken.updateMany({
      where: { family, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private async issue(user: User, family: string, userAgent?: string): Promise<TokenPair> {
    const accessToken = await this.jwt.signAsync({ sub: user.id, role: user.role });
    const refreshToken = randomBytes(48).toString('base64url');
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        family,
        tokenHash: sha256(refreshToken),
        expiresAt: new Date(Date.now() + this.refreshTtlMs),
        userAgent: userAgent?.slice(0, 200),
      },
    });
    return { accessToken, refreshToken };
  }
}
