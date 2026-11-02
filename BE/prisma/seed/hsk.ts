// Gán nhãn cấp HSK song song (rule.md mục 2): điền Word.hsk2 / Word.hsk3, rồi tính nhãn của mỗi bài
// = cấp cao nhất trong các từ của bài, theo từng chuẩn (Lesson.hsk2/hsk3, dùng làm chỉ số tham khảo), và Lesson.hskShown = cấp
// HIỂN THỊ cho người học: cấp đã soạn, chỉ nâng khi hơn 70% từ của bài thuộc cấp cao hơn. Chạy lại được nhiều lần: pnpm db:hsk
//
// Dữ liệu cấp từ là BẢN CỘNG ĐỒNG (xem prisma/seed/hsk/README.md) — cần người biết tiếng Trung duyệt.
import '../../src/config/dotenv.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { lessonLabels, levelsOf } from '../../src/common/hsk-levels.js';
import { PrismaClient } from '../../src/generated/prisma/client.js';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

const isHan = (ch: string) => /[一-鿿]/.test(ch);

interface Tok {
  t: string;
  x?: boolean;
}

async function main() {
  // ── Từ vựng ──
  const words = await prisma.word.findMany({ select: { id: true, zh: true, hsk2: true, hsk3: true, hsk2List: true } });
  let changed = 0;
  let unknown = 0;
  for (const w of words) {
    const l = levelsOf(w.zh);
    // hsk2List: chỉ từ có ĐÚNG trong danh sách HSK 2.0 (bộ kiểm tra từ vựng theo cấp).
    const list = l.exact ? l.hsk2 : null;
    if (list !== w.hsk2List) {
      await prisma.word.update({ where: { id: w.id }, data: { hsk2List: list } });
      changed++;
    }
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
    const items = les.lines.flatMap((line) => {
      const toks = (line.tokens as unknown as Tok[]) ?? [];
      return toks.length ? toks.filter((t) => !t.x).map((t) => t.t) : [...line.zh].filter(isHan);
    });
    const { hsk2, hsk3, hskShown: shown, words, higher, known, miss } = lessonLabels(les.level, items);
    if (hsk2 !== les.hsk2 || hsk3 !== les.hsk3 || shown !== les.hskShown) {
      await prisma.lesson.update({ where: { id: les.id }, data: { hsk2, hsk3, hskShown: shown } });
      lChanged++;
    }
    report.push(`${les.id.padEnd(12)} soạn HSK ${les.level} → hiển thị HSK ${shown}   (từ khó nhất 2.0·${hsk2 ?? '—'} | 3.0·${hsk3 ?? '—'}; ${words} từ, ${higher}/${known} từ cao hơn, ${miss} chưa tra được)`);
  }
  console.log(`Bài học: ${lessons.length} bài, cập nhật ${lChanged}.`);
  report.forEach((r) => console.log('  ' + r));
  console.log('\nLưu ý: dữ liệu cấp từ là bản cộng đồng, cần người biết tiếng Trung duyệt (rule.md mục 2).');
}

await main().finally(() => prisma.$disconnect());
