// Lọc dữ liệu tách chữ (Make Me a Hanzi, dictionary.txt, giấy phép LGPL — xem prisma/seed/hanzi/LICENSE.md) cho các chữ
// có trong từ điển của app và các bộ phận của chúng, ghi ra prisma/seed/hanzi/hanzi.json (gọn, chỉ phần cần dùng).
// Chạy: pnpm tsx scripts/build-hanzi.ts <đường dẫn dictionary.txt>   — sau đó: pnpm db:seed:hanzi
import '../src/config/dotenv.js';
import { readFileSync, writeFileSync } from 'node:fs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const file = process.argv[2];
if (!file) throw new Error('Thiếu đường dẫn tới dictionary.txt');

interface Raw {
  character: string;
  definition?: string;
  pinyin?: string[];
  decomposition?: string;
  radical?: string;
  etymology?: { type: 'ideographic' | 'pictographic' | 'pictophonetic'; semantic?: string | null; phonetic?: string | null };
}

const IDS = /[⿰-⿻？]/u;
const HAN = /\p{Script=Han}|[⺀-⻳]/u;
/** Các bộ phận trực tiếp của chữ theo chuỗi mô tả cấu trúc (bỏ ký hiệu cấu trúc và dấu ？). */
const parts = (ids: string) => [...ids].filter((c) => !IDS.test(c) && HAN.test(c));

const all = new Map<string, Raw>();
for (const line of readFileSync(file, 'utf8').split('\n')) {
  if (!line.trim()) continue;
  const r = JSON.parse(line) as Raw;
  if (typeof r.character === 'string') all.set(r.character, r);
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
try {
  const words = await prisma.word.findMany({ select: { zh: true } });
  const need = new Set<string>();
  for (const w of words) for (const c of w.zh) if (/\p{Script=Han}/u.test(c)) need.add(c);
  // Thêm bộ phận trực tiếp của mỗi chữ (một tầng) để có nghĩa của từng bộ phận.
  for (const c of [...need]) for (const p of parts(all.get(c)?.decomposition ?? '')) need.add(p);

  const out: Record<string, { py: string; en: string; ids: string; rad: string; kind: string | null; sem: string | null; pho: string | null; parts: string[] }> = {};
  for (const c of [...need].sort()) {
    const r = all.get(c);
    if (!r) continue;
    out[c] = {
      py: r.pinyin?.[0] ?? '',
      en: r.definition ?? '',
      ids: r.decomposition ?? '',
      rad: r.radical ?? '',
      kind: r.etymology?.type ?? null,
      sem: r.etymology?.semantic ?? null,
      pho: r.etymology?.phonetic ?? null,
      parts: parts(r.decomposition ?? ''),
    };
  }
  writeFileSync(new URL('../prisma/seed/hanzi/hanzi.json', import.meta.url), JSON.stringify(out));
  console.log(`Đã lọc ${Object.keys(out).length} chữ/bộ phận (từ ${need.size} cần dùng).`);
} finally {
  await prisma.$disconnect();
}
