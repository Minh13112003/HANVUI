// Gắn phần "Vì sao?" (giải thích đáp án) vào bài luyện ngữ pháp HSK 1-2 đã có (content/grammar-why1.ts, grammar-why2.ts).
// Chỉ ghi thêm khóa `why` vào cột data của WritingItem, không đổi đề, đáp án hay tiến độ. Chạy lại được.
// Tạo lại bài luyện (pnpm db:seed:grammar --force) thì phải chạy lại lệnh này.
// Tự kiểm: mọi điểm HSK 1-2 đều có giải thích, đúng số bài và đúng dạng, số lý do sai khớp số lựa chọn sai. --dry chỉ kiểm.
// Chạy: pnpm db:seed:grammar-why
import '../../src/config/dotenv.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../src/generated/prisma/client.js';
import { GRAMMAR as BASE } from './content/grammar.js';
import { GRAMMAR_MORE } from './content/grammar2.js';
import { WHY1, type Why } from './content/grammar-why1.js';
import { WHY2 } from './content/grammar-why2.js';

if (process.env.NODE_ENV === 'production') throw new Error('Không seed trên production');
const dry = process.argv.includes('--dry');
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
const WHY: Record<string, Why[]> = { ...WHY1, ...WHY2 };
const ALL = [...BASE, ...GRAMMAR_MORE];

type D = { options?: string[]; answer?: string } & Record<string, unknown>;

try {
  const errors: string[] = [];
  const updates: { id: number; data: object }[] = [];
  let points = 0;
  for (const g of ALL.filter((x) => x.level <= 2)) {
    const list = WHY[g.slug];
    if (!list) {
      errors.push(`${g.slug}: chưa có giải thích`);
      continue;
    }
    points++;
    const row = await prisma.grammarPoint.findUnique({ where: { slug: g.slug } });
    if (!row) {
      errors.push(`${g.slug}: chưa nạp điểm ngữ pháp (chạy pnpm db:seed:grammar)`);
      continue;
    }
    const items = await prisma.writingItem.findMany({ where: { grammarId: row.id }, orderBy: { sort: 'asc' } });
    const expected = [...g.practice.map((p) => p.type as string), ...(g.practice.some((p) => p.type === 'CHOOSE') ? ['WRONG'] : [])];
    if (items.map((i) => i.type).join() !== expected.join()) {
      errors.push(`${g.slug}: dạng bài trong DB (${items.map((i) => i.type).join()}) khác nội dung (${expected.join()})`);
      continue;
    }
    if (list.length !== items.length) {
      errors.push(`${g.slug}: ${list.length} giải thích cho ${items.length} bài`);
      continue;
    }
    items.forEach((it, i) => {
      const d = it.data as D;
      const [ok, no] = list[i];
      if (ok.trim().length < 20) errors.push(`${g.slug}#${i}: giải thích quá ngắn`);
      const wrongOpts = it.type === 'FILL' || it.type === 'CHOOSE' ? (d.options ?? []).filter((o) => o !== d.answer) : [];
      if ((no?.length ?? 0) !== wrongOpts.length) {
        errors.push(`${g.slug}#${i} (${it.type}): ${no?.length ?? 0} lý do cho ${wrongOpts.length} lựa chọn sai`);
        return;
      }
      for (const n of no ?? []) if (n.trim().length < 12) errors.push(`${g.slug}#${i}: lý do sai quá ngắn`);
      updates.push({ id: it.id, data: { ...d, why: { ok, no: Object.fromEntries(wrongOpts.map((o, k) => [o, (no ?? [])[k]])) } } });
    });
  }
  const extra = Object.keys(WHY).filter((s) => !ALL.some((g) => g.slug === s && g.level <= 2));
  if (extra.length) errors.push('Khóa thừa: ' + extra.join(', '));
  if (errors.length) throw new Error('Giải thích ngữ pháp lỗi:\n' + errors.join('\n'));

  if (dry) console.log(`Đạt kiểm tra: ${points} điểm ngữ pháp, ${updates.length} bài.`);
  else {
    for (const u of updates) await prisma.writingItem.update({ where: { id: u.id }, data: { data: u.data } });
    console.log(`Đã gắn giải thích cho ${updates.length} bài của ${points} điểm ngữ pháp.`);
  }
} finally {
  await prisma.$disconnect();
}
