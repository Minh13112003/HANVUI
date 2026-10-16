import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { loadEnv } from '../config/env.js';
import type { User } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { LoginDto, RegisterDto } from './auth.dto.js';

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
  ) {}

  toPublic(u: User): PublicUser {
    return {
      id: u.id,
      email: u.email,
      displayName: u.displayName,
      role: u.role,
      hskStandard: u.hskStandard,
      hskLevel: u.hskLevel,
      isVip: !!u.vipUntil && u.vipUntil.getTime() > Date.now(),
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
