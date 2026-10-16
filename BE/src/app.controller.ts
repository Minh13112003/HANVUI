import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/auth.decorators.js';
import { PrismaService } from './prisma/prisma.service.js';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  /** Kiểm tra sống + nối được cơ sở dữ liệu (cho VPS/giám sát). */
  @Public()
  @Get('health')
  async health() {
    await this.prisma.$queryRaw`SELECT 1`;
    return { ok: true, time: new Date().toISOString() };
  }
}
