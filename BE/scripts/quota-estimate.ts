import '../src/config/dotenv.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
const cost = (s: string) => [...s].reduce((n, c) => n + (/[一-鿿]/.test(c) ? 2 : 1), 0);
try {
  const lines = await prisma.lessonLine.findMany({ select: { zh: true, lesson: { select: { kind: true } } } });
  const by: Record<string, { n: number; q: number }> = {};
  for (const l of lines) {
    const k = l.lesson.kind;
    by[k] ??= { n: 0, q: 0 };
    by[k].n++;
    by[k].q += cost(l.zh);
  }
  let ex = { n: 0, q: 0 };
  for (const e of await prisma.exam.findMany()) {
    for (const s of e.sections as unknown as { questions: { script?: { zh: string }[] }[] }[]) {
      for (const q of s.questions) for (const l of q.script ?? []) { ex.n++; ex.q += cost(l.zh); }
    }
  }
  const words = await prisma.word.findMany({ select: { zh: true } });
  const w = { n: words.length, q: words.reduce((n, x) => n + cost(x.zh), 0) };
  console.log('Theo loại bài (câu / ký tự tính phí):', by);
  console.log('Đề thi:', ex, ' Từ vựng (nếu tạo file từng từ):', w);
  const total = Object.values(by).reduce((n, x) => n + x.q, 0) + ex.q;
  console.log('Tổng bài học + đề thi:', total, 'ký tự tính phí (', ((total / 500000) * 100).toFixed(1), '% của 500.000 / tháng )');
} finally {
  await prisma.$disconnect();
}
