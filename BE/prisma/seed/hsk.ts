// Gán nhãn cấp HSK song song (rule.md mục 2): điền Word.hsk2 / Word.hsk3, rồi tính nhãn của mỗi bài
// = cấp cao nhất trong các từ của bài, theo từng chuẩn (Lesson.hsk2/hsk3, dùng làm chỉ số tham khảo), và Lesson.hskShown = cấp
// HIỂN THỊ cho người học: cấp đã soạn, chỉ nâng khi hơn 70% từ của bài thuộc cấp cao hơn. Chạy lại được nhiều lần: pnpm db:hsk
//
// Dữ liệu cấp từ là BẢN CỘNG ĐỒNG (xem prisma/seed/hsk/README.md) — cần người biết tiếng Trung duyệt.
import '../../src/config/dotenv.js';
import { readFileSync } from 'node:fs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../src/generated/prisma/client.js';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

/** { từ: [cấp HSK 2.0, cấp HSK 3.0] }, 0 = không có trong chuẩn đó. */
const LEVELS: Record<string, [number, number]> = JSON.parse(
  readFileSync(new URL('./hsk/hsk-levels.json', import.meta.url), 'utf8'),
);

const isHan = (ch: string) => /[一-鿿]/.test(ch);

/**
 * Cấp của một từ. Tra đúng từ trước; từ ghép không có trong danh sách (ví dụ 你好, 旅行者) thì tách thành
 * các phần dài nhất có trong danh sách và lấy cấp cao nhất — chỉ nhận khi mọi phần đều tra được.
 */
export function levelsOf(zh: string): { hsk2: number | null; hsk3: number | null; exact: boolean } {
  const direct = LEVELS[zh];
  if (direct) return { hsk2: direct[0] || null, hsk3: direct[1] || null, exact: true };

  const ch = [...zh].filter(isHan);
  if (!ch.length) return { hsk2: null, hsk3: null, exact: false };
  let a = 0;
  let b = 0;
  for (let i = 0; i < ch.length; ) {
    let hit: [number, number] | null = null;
    let len = 1;
    for (let n = Math.min(4, ch.length - i); n >= 1; n--) {
      const part = ch.slice(i, i + n).join('');
      if (LEVELS[part]) {
        hit = LEVELS[part];
        len = n;
        break;
      }
    }
    if (!hit) return { hsk2: null, hsk3: null, exact: false }; // còn phần chưa tra được thì không gán
    a = Math.max(a, hit[0]);
    b = Math.max(b, hit[1]);
    i += len;
  }
  return { hsk2: a || null, hsk3: b || null, exact: false };
}

interface Tok {
  t: string;
  x?: boolean;
}

async function main() {
  // ── Từ vựng ──
  const words = await prisma.word.findMany({ select: { id: true, zh: true, hsk2: true, hsk3: true } });
  let changed = 0;
  let unknown = 0;
  for (const w of words) {
    const l = levelsOf(w.zh);
    if (l.hsk2 === null && l.hsk3 === null) {
      unknown++;
      continue;
    }
    if (l.hsk2 !== w.hsk2 || l.hsk3 !== w.hsk3) {
      await prisma.word.update({ where: { id: w.id }, data: { hsk2: l.hsk2, hsk3: l.hsk3 } });
      changed++;
    }
  }
  console.log(`Từ vựng: ${words.length} từ, cập nhật ${changed}, không tra được ${unknown}.`);

  // ── Bài học: nhãn = cấp cao nhất trong các từ của bài ──
  const lessons = await prisma.lesson.findMany({
    select: { id: true, level: true, hskShown: true, hsk2: true, hsk3: true, lines: { select: { tokens: true, zh: true } } },
  });
  let lChanged = 0;
  const report: string[] = [];
  for (const les of lessons) {
    let a = 0;
    let b = 0;
    let miss = 0;
    const seen = new Set<string>();
    const lv2: number[] = []; // cấp HSK 2.0 của từng từ tra được (để tính cấp hiển thị)
    for (const line of les.lines) {
      const toks = (line.tokens as unknown as Tok[]) ?? [];
      const items = toks.length ? toks.filter((t) => !t.x).map((t) => t.t) : [...line.zh].filter(isHan);
      for (const t of items) {
        if (seen.has(t)) continue;
        seen.add(t);
        const l = levelsOf(t);
        if (l.hsk2 === null && l.hsk3 === null) {
          miss++;
          continue;
        }
        if (l.hsk2) lv2.push(l.hsk2);
        a = Math.max(a, l.hsk2 ?? 0);
        b = Math.max(b, l.hsk3 ?? 0);
      }
    }
    const hsk2 = a || null;
    const hsk3 = b || null;
    // Cấp hiển thị: giữ cấp đã soạn; chỉ nâng khi HƠN 70% từ (tra được) thuộc cấp cao hơn, khi đó lấy cấp trung vị của nhóm từ cao hơn.
    const higher = lv2.filter((v) => v > les.level).sort((x, y) => x - y);
    const shown = lv2.length && higher.length / lv2.length > 0.7 ? higher[Math.floor(higher.length / 2)] : les.level;
    if (hsk2 !== les.hsk2 || hsk3 !== les.hsk3 || shown !== les.hskShown) {
      await prisma.lesson.update({ where: { id: les.id }, data: { hsk2, hsk3, hskShown: shown } });
      lChanged++;
    }
    report.push(`${les.id.padEnd(12)} soạn HSK ${les.level} → hiển thị HSK ${shown}   (từ khó nhất 2.0·${hsk2 ?? '—'} | 3.0·${hsk3 ?? '—'}; ${seen.size} từ, ${higher.length}/${lv2.length} từ cao hơn, ${miss} chưa tra được)`);
  }
  console.log(`Bài học: ${lessons.length} bài, cập nhật ${lChanged}.`);
  report.forEach((r) => console.log('  ' + r));
  console.log('\nLưu ý: dữ liệu cấp từ là bản cộng đồng, cần người biết tiếng Trung duyệt (rule.md mục 2).');
}

await main().finally(() => prisma.$disconnect());
