// Mã quà (bảng RedeemCode). BẢN DEMO: HV999LUOT tặng 999 lượt gợi ý để thử sự kiện; bản thật xóa mã này.
// Chạy lại được (cập nhật theo mã). Chạy: pnpm db:seed:codes
import '../../src/config/dotenv.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../src/generated/prisma/client.js';

if (process.env.NODE_ENV === 'production') throw new Error('Không seed trên production');
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

const CODES = [{ code: 'HV999LUOT', tokens: 999, label: 'Mã demo: +999 lượt gợi ý' }];

try {
  for (const c of CODES) {
    await prisma.redeemCode.upsert({ where: { code: c.code }, create: c, update: { tokens: c.tokens, label: c.label, active: true } });
  }
  console.log(`Mã quà: ${CODES.map((c) => c.code).join(', ')}`);
} finally {
  await prisma.$disconnect();
}
