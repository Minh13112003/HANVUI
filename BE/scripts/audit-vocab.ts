// Kiểm tra từ vựng của app: mỗi từ phải có nghĩa, pinyin, ví dụ/cách đọc và dữ liệu nét để tập viết.
//   pnpm audit:vocab        chỉ báo cáo
// Dữ liệu nét lấy từ hanzi-writer-data trên CDN (cùng nguồn FE dùng khi tập viết).
import '../src/config/dotenv.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
const HAN = /[一-鿿]/;

async function hasStroke(ch: string): Promise<boolean> {
  for (let t = 0; t < 3; t++) {
    try {
      const r = await fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/${encodeURIComponent(ch)}.json`);
      if (r.status === 404) return false;
      if (r.ok) return true;
    } catch {
      /* thử lại */
    }
  }
  throw new Error(`Không kiểm tra được chữ ${ch}`);
}

try {
  const words = await prisma.word.findMany({ select: { id: true, zh: true, pinyin: true, vi: true, hsk2: true, example: true } });
  const noVi = words.filter((w) => !w.vi.trim());
  const noPy = words.filter((w) => !w.pinyin.trim());
  const chars = new Set<string>();
  for (const w of words) for (const c of w.zh) if (HAN.test(c)) chars.add(c);
  const lines = await prisma.lessonLine.findMany({ select: { zh: true } });
  for (const l of lines) for (const c of l.zh) if (HAN.test(c)) chars.add(c);

  const missing: string[] = [];
  const list = [...chars];
  for (let i = 0; i < list.length; i += 20) {
    const part = list.slice(i, i + 20);
    const ok = await Promise.all(part.map(hasStroke));
    part.forEach((c, k) => !ok[k] && missing.push(c));
  }
  console.log(`Từ trong từ điển: ${words.length}`);
  console.log(`  thiếu nghĩa tiếng Việt: ${noVi.length}${noVi.length ? ' → ' + noVi.slice(0, 30).map((w) => w.zh).join(' ') : ''}`);
  console.log(`  thiếu pinyin: ${noPy.length}${noPy.length ? ' → ' + noPy.slice(0, 30).map((w) => w.zh).join(' ') : ''}`);
  console.log(`  có câu ví dụ: ${words.filter((w) => w.example).length}/${words.length}`);
  console.log(`Chữ Hán khác nhau (từ + lời thoại): ${chars.size}`);
  console.log(`  không có dữ liệu nét để tập viết: ${missing.length}${missing.length ? ' → ' + missing.join(' ') : ''}`);
} finally {
  await prisma.$disconnect();
}
