// Bổ sung từ vựng thiếu: thêm nghĩa cho từ/chữ trong lời thoại (extra-words.ts), điền nghĩa vào token của mọi câu,
// và lấy câu ví dụ cho mỗi từ từ chính các lời thoại đã có (câu ngắn nhất chứa từ). Chạy lại được.
// Chạy: pnpm db:fill-vocab   — sau đó: pnpm db:hsk (gán nhãn cấp cho từ mới).
import '../../src/config/dotenv.js';
import { pinyin } from 'pinyin-pro';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../src/generated/prisma/client.js';
import { enrichTokens } from './chapters.js';
import { EXTRA_WORDS } from './extra-words.js';

if (process.env.NODE_ENV === 'production') throw new Error('Không seed trên production');
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

try {
  const have = new Set((await prisma.word.findMany({ select: { zh: true } })).map((w) => w.zh));
  const fresh = EXTRA_WORDS.filter(([zh]) => !have.has(zh));
  if (fresh.length) {
    await prisma.word.createMany({
      data: fresh.map(([zh, vi, pos]) => ({
        zh, vi, pos, pinyin: (pinyin(zh, { toneType: 'symbol', type: 'array' }) as string[]).join(''), phrase: pos === 'cụm từ',
      })),
      skipDuplicates: true,
    });
  }

  const words = await prisma.word.findMany({ select: { id: true, zh: true, vi: true, example: true } });
  const vi = new Map(words.filter((w) => w.vi).map((w) => [w.zh, w.vi]));
  const enriched = await enrichTokens(prisma, vi);

  // Câu ví dụ: ưu tiên câu có token đúng bằng từ, rồi tới câu chứa chuỗi; chọn câu ngắn nhất (tối đa 24 chữ).
  const lines = await prisma.lessonLine.findMany({ select: { zh: true, pinyin: true, vi: true, tokens: true } });
  let examples = 0;
  for (const w of words) {
    if (w.example) continue;
    let best: (typeof lines)[number] | null = null;
    let bestScore = Infinity;
    for (const l of lines) {
      if (!l.zh.includes(w.zh) || [...l.zh].length > 24) continue;
      const exact = (l.tokens as unknown as { t: string }[]).some((t) => t.t === w.zh);
      const score = [...l.zh].length + (exact ? 0 : 100);
      if (score < bestScore) {
        best = l;
        bestScore = score;
      }
    }
    if (best) {
      await prisma.word.update({ where: { id: w.id }, data: { example: { zh: best.zh, pinyin: best.pinyin, vi: best.vi } } });
      examples++;
    }
  }
  console.log(`Thêm ${fresh.length} từ mới, bổ sung nghĩa cho ${enriched} câu, thêm ${examples} câu ví dụ.`);
} finally {
  await prisma.$disconnect();
}
