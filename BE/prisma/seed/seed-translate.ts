// Nạp câu luyện dịch (content/translate.ts, translate2.ts). Chạy lại được: cập nhật theo (điểm ngữ pháp, câu tiếng Trung),
// xóa câu không còn trong file. Tự kiểm: điểm ngữ pháp phải tồn tại; ghép các cụm theo thứ tự phải ra đúng câu (bỏ dấu câu).
// Chạy: pnpm db:seed:translate (sau pnpm db:seed:grammar)
import '../../src/config/dotenv.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../src/generated/prisma/client.js';
import { hanOnly, parseChunks } from '../../src/content/translate.grade.js';
import { TRANSLATE } from './content/translate.js';
import { TRANSLATE_MORE } from './content/translate2.js';

if (process.env.NODE_ENV === 'production') throw new Error('Không seed trên production');
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

try {
  const all = { ...TRANSLATE, ...TRANSLATE_MORE };
  const points = await prisma.grammarPoint.findMany({ select: { id: true, slug: true, level: true } });
  const bySlug = new Map(points.map((p) => [p.slug, p]));
  const errors: string[] = [];
  for (const [slug, rows] of Object.entries(all)) {
    if (!bySlug.has(slug)) errors.push(`${slug}: không có điểm ngữ pháp này`);
    for (const [zh, vi, lit, chunks] of rows) {
      const joined = parseChunks(chunks).map((c) => c.zh).join('');
      if (hanOnly(joined) !== hanOnly(zh)) errors.push(`${slug}: cụm ghép lại "${joined}" khác câu "${zh}"`);
      if (!vi || !lit) errors.push(`${slug}: thiếu bản dịch cho "${zh}"`);
      for (const c of parseChunks(chunks)) if (!c.vi.length) errors.push(`${slug}: cụm "${c.zh}" chưa có nghĩa (ghi "-" nếu không cần dịch)`);
    }
  }
  const missing = points.filter((p) => !all[p.slug]).map((p) => p.slug);
  if (missing.length) errors.push('Điểm ngữ pháp chưa có câu luyện dịch: ' + missing.join(', '));
  if (errors.length) throw new Error('Dữ liệu luyện dịch lỗi:\n' + errors.join('\n'));

  let n = 0;
  for (const [slug, rows] of Object.entries(all)) {
    const g = bySlug.get(slug)!;
    for (const [i, [zh, vi, literal, chunks, alt]] of rows.entries()) {
      const data = { level: g.level, vi, literal, chunks: parseChunks(chunks) as object[], alt: alt ?? [], sort: i };
      await prisma.translateItem.upsert({ where: { grammarId_zh: { grammarId: g.id, zh } }, create: { grammarId: g.id, zh, ...data }, update: data });
      n++;
    }
    await prisma.translateItem.deleteMany({ where: { grammarId: g.id, zh: { notIn: rows.map((r) => r[0]) } } });
  }
  console.log(`Luyện dịch: ${n} câu cho ${Object.keys(all).length} điểm ngữ pháp.`);
} finally {
  await prisma.$disconnect();
}
