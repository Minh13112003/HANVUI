import { Test } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { PrismaService } from './prisma/prisma.service.js';

describe('AppController', () => {
  it('health trả ok khi nối được database', async () => {
    const prisma = { $queryRaw: vi.fn().mockResolvedValue([{ '?column?': 1 }]) };
    const mod = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: PrismaService, useValue: prisma }],
    }).compile();

    const res = await mod.get(AppController).health();
    expect(res.ok).toBe(true);
    expect(prisma.$queryRaw).toHaveBeenCalledOnce();
  });
});
