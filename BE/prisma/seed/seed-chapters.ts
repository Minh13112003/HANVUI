// Chỉ thêm (hoặc làm lại) chương 2-4 của truyện, không xóa bài cũ nên giữ nguyên âm thanh đã tạo.
// Chạy: pnpm db:seed:chapters   — sau đó: pnpm db:hsk (gán nhãn cấp) và pnpm audio --all (tạo âm thanh bài mới).
import '../../src/config/dotenv.js';
import { readFileSync } from 'node:fs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../src/generated/prisma/client.js';
import { seedChapters } from './chapters.js';

if (process.env.NODE_ENV === 'production') throw new Error('Không seed trên production');

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
const demo = JSON.parse(readFileSync(new URL('./demo-data.json', import.meta.url), 'utf8'));

try {
  const r = await seedChapters(prisma, '2026-10', demo.SUPP);
  console.log('Đã nạp chương 2-4:', r);
} finally {
  await prisma.$disconnect();
}
