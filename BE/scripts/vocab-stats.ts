import '../src/config/dotenv.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
try {
  const w = await prisma.word.findMany({ select: { zh: true, topicId: true, hsk2: true, pos: true } });
  const dup = new Map<string, number>();
  w.forEach((x) => dup.set(x.zh, (dup.get(x.zh) ?? 0) + 1));
  console.log('tổng', w.length, '· chữ trùng hẳn:', [...dup].filter(([, n]) => n > 1).length);
  console.log('có chủ đề từ vựng (bảng từ theo chủ đề):', w.filter((x) => x.topicId).length, '· chưa gắn chủ đề (từ trong lời thoại):', w.filter((x) => !x.topicId).length);
  const byLen: Record<number, number> = {};
  w.forEach((x) => (byLen[[...x.zh].length] = (byLen[[...x.zh].length] ?? 0) + 1));
  console.log('theo độ dài (chữ):', byLen);
  const h: Record<string, number> = {};
  w.forEach((x) => (h[x.hsk2 ?? 'chưa nhãn'] = (h[x.hsk2 ?? 'chưa nhãn'] ?? 0) + 1));
  console.log('theo cấp HSK 2.0:', h);
  // từ chứa từ khác (ví dụ 打电话 chứa 电话)
  const set = new Set(w.map((x) => x.zh));
  const contained = w.filter((x) => [...x.zh].length > 1 && [...set].some((o) => o !== x.zh && [...o].length > 1 && x.zh.includes(o)));
  console.log('từ ghép chứa từ khác cũng có trong bảng:', contained.length, contained.slice(0, 20).map((x) => x.zh).join(' '));
  console.log('chữ đơn:', w.filter((x) => [...x.zh].length === 1).map((x) => x.zh).join(''));
} finally {
  await prisma.$disconnect();
}
