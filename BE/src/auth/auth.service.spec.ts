import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcryptjs';
import { AuthService } from './auth.service.js';

// Giả lập Prisma trong bộ nhớ, chỉ đủ cho luồng đăng nhập.
function fakePrisma() {
  const users: any[] = [];
  const tokens: any[] = [];
  return {
    users,
    tokens,
    user: {
      findUnique: async ({ where }: any) =>
        users.find((u) => (where.email ? u.email === where.email : u.id === where.id)) ?? null,
      create: async ({ data }: any) => {
        const u = {
          id: `u${users.length + 1}`,
          role: 'USER',
          hskStandard: 'HSK2',
          hskLevel: 1,
          isVip: false,
          ...data,
        };
        users.push(u);
        return u;
      },
    },
    refreshToken: {
      create: async ({ data }: any) => {
        const t = { id: `t${tokens.length + 1}`, revokedAt: null, ...data };
        tokens.push(t);
        return t;
      },
      findUnique: async ({ where }: any) => {
        const t = tokens.find((x) => x.tokenHash === where.tokenHash);
        return t ? { ...t, user: users.find((u) => u.id === t.userId) } : null;
      },
      updateMany: async ({ where, data }: any) => {
        const hit = tokens.filter(
          (t) =>
            (where.id === undefined || t.id === where.id) &&
            (where.family === undefined || t.family === where.family) &&
            (where.revokedAt === undefined || t.revokedAt === where.revokedAt),
        );
        hit.forEach((t) => Object.assign(t, data));
        return { count: hit.length };
      },
    },
  };
}

describe('AuthService', () => {
  let prisma: ReturnType<typeof fakePrisma>;
  let svc: AuthService;

  beforeEach(() => {
    prisma = fakePrisma();
    const jwt = new JwtService({ secret: 'x'.repeat(40), signOptions: { expiresIn: 60 } });
    svc = new AuthService(prisma as any, jwt);
  });

  const reg = { email: 'a@b.com', password: 'matkhau123', displayName: 'An' };

  it('đăng ký rồi trả cặp token, không lộ mật khẩu', async () => {
    const r = await svc.register(reg);
    expect(r.accessToken).toBeTruthy();
    expect(r.refreshToken).toBeTruthy();
    expect(JSON.stringify(r)).not.toContain('passwordHash');
    expect(prisma.users[0].passwordHash).not.toBe(reg.password);
  });

  it('từ chối đăng ký trùng email', async () => {
    await svc.register(reg);
    await expect(svc.register(reg)).rejects.toBeInstanceOf(ConflictException);
  });

  it('đăng nhập đúng và sai mật khẩu', async () => {
    prisma.users.push({ id: 'u9', email: reg.email, passwordHash: await hash(reg.password, 4), role: 'USER' });
    await expect(svc.login({ email: reg.email, password: reg.password })).resolves.toHaveProperty('accessToken');
    await expect(svc.login({ email: reg.email, password: 'sai' })).rejects.toBeInstanceOf(UnauthorizedException);
    await expect(svc.login({ email: 'khong@co.com', password: 'x' })).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('refresh xoay vòng; dùng lại token cũ thì hủy cả phiên', async () => {
    const { refreshToken: r1 } = await svc.register(reg);
    const { refreshToken: r2 } = await svc.refresh(r1);
    expect(r2).not.toBe(r1);

    await expect(svc.refresh(r1)).rejects.toBeInstanceOf(UnauthorizedException); // dùng lại bản cũ
    await expect(svc.refresh(r2)).rejects.toBeInstanceOf(UnauthorizedException); // cả phiên bị hủy
  });

  it('đăng xuất hủy phiên', async () => {
    const { refreshToken } = await svc.register(reg);
    await svc.logout(refreshToken);
    await expect(svc.refresh(refreshToken)).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
