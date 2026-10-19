import '../src/config/dotenv.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
try {
  const lines = await prisma.lessonLine.findMany({ select: { tokens: true } });
  const miss = new Map<string, number>();
  let total = 0;
  for (const l of lines) {
    for (const t of l.tokens as unknown as { t: string; v?: string; x?: boolean }[]) {
      if (t.x || !/[一-鿿]/.test(t.t)) continue;
      total++;
      if (!t.v) miss.set(t.t, (miss.get(t.t) ?? 0) + 1);
    }
  }
  const words = new Set((await prisma.word.findMany({ select: { zh: true } })).map((w) => w.zh));
  const arr = [...miss].sort((a, b) => b[1] - a[1]);
  console.log(`token ${total}, thiếu nghĩa ${[...miss.values()].reduce((a, b) => a + b, 0)}, ${arr.length} loại; trong từ điển: ${arr.filter(([z]) => words.has(z)).length}`);
  console.log(arr.map(([z, n]) => `${z}${n > 1 ? '×' + n : ''}`).join(' '));
} finally {
  await prisma.$disconnect();
}
