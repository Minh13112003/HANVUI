import '../src/config/dotenv.js';
import { readFileSync } from 'node:fs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
const lv: Record<string, [number, number]> = JSON.parse(readFileSync(new URL('../prisma/seed/hsk/hsk-levels.json', import.meta.url), 'utf8'));
try {
  const have = new Set((await prisma.word.findMany({ select: { zh: true } })).map((w) => w.zh));
  const all3 = Object.entries(lv).filter(([, v]) => v[0] === 3).map(([k]) => k);
  const missing = all3.filter((w) => !have.has(w));
  console.log('HSK 2.0 cấp 3 trong danh sách:', all3.length, '· đã có trong DB:', all3.length - missing.length, '· chưa có:', missing.length);
  console.log(missing.join(' '));
} finally {
  await prisma.$disconnect();
}
