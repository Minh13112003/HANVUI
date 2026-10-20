// Áp dụng sửa văn phong gợi ý (hint-fixes.ts) lên DB. Chạy: pnpm db:fix-hints
import '../../src/config/dotenv.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../src/generated/prisma/client.js';
import { applyHintFixes } from './hint-fixes.js';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
try {
  console.log(`Đã sửa gợi ý của ${await applyHintFixes(prisma)} ô.`);
} finally {
  await prisma.$disconnect();
}
