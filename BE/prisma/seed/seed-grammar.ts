// Nạp điểm ngữ pháp và bài luyện (content/grammar.ts). Chạy lại được: cập nhật nội dung điểm ngữ pháp theo slug;
// bài luyện chỉ tạo khi điểm đó chưa có bài (để giữ lịch sử làm bài). --force xóa và tạo lại bài luyện.
// Chạy: pnpm db:seed:grammar
import '../../src/config/dotenv.js';
import { pinyin } from 'pinyin-pro';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../src/generated/prisma/client.js';
import { GRAMMAR as BASE } from './content/grammar.js';
import { GRAMMAR_MORE } from './content/grammar2.js';
import { GRAMMAR_VISUAL } from './content/grammar-visual.js';

// Thứ tự trong danh sách: theo cấp, trong cấp theo thứ tự soạn (bộ gốc trước, bộ mở rộng sau).
const GRAMMAR = [...BASE, ...GRAMMAR_MORE].map((g, i) => ({ g, i })).sort((a, b) => a.g.level - b.g.level || a.i - b.i).map((x) => x.g);

if (process.env.NODE_ENV === 'production') throw new Error('Không seed trên production');
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
const force = process.argv.includes('--force');
const py = (zh: string) => (pinyin(zh, { toneType: 'symbol', type: 'array' }) as string[]).join(' ');

try {
  const slugs = GRAMMAR.map((g) => g.slug);
  if (new Set(slugs).size !== slugs.length) throw new Error('slug bị trùng');
  for (const g of GRAMMAR) {
    const v = GRAMMAR_VISUAL[g.slug];
    if (!v) throw new Error(`${g.slug}: thiếu hình trực quan (content/grammar-visual.ts)`);
    if (v.icons.length !== g.examples.length) throw new Error(`${g.slug}: số biểu tượng phải bằng số ví dụ`);
    for (const r of v.rows) for (const b of r.split(' + ')) if (!/@[svaotpnqkx]/.test(b)) throw new Error(`${g.slug}: khối sơ đồ sai cú pháp: ${b}`);
    if (g.examples.length < 3) throw new Error(`${g.slug}: cần ít nhất 3 ví dụ`);
    if (g.practice.length < 4) throw new Error(`${g.slug}: cần ít nhất 4 bài luyện`);
    for (const p of g.practice) {
      if (p.type !== 'FILL') continue;
      // Quy ước viết gọn: hai phần không có phần rỗng thì chỗ trống nằm giữa hai phần.
      if (!p.parts.includes('')) {
        if (p.parts.length !== 2) throw new Error(`${g.slug}: bài điền chữ cần đúng một chỗ trống`);
        p.parts = [p.parts[0], '', p.parts[1]];
      }
      if (p.parts.filter((x) => x === '').length !== 1) throw new Error(`${g.slug}: bài điền chữ chỉ được một chỗ trống`);
      if (!p.options.includes(p.answer)) throw new Error(`${g.slug}: đáp án ${p.answer} không nằm trong lựa chọn`);
    }
  }

  let made = 0;
  for (const [i, g] of GRAMMAR.entries()) {
    const data = {
      level: g.level, category: g.category, title: g.title, pattern: g.pattern, explain: g.explain, compare: g.compare,
      mistake: g.mistake, sort: i, examples: g.examples.map(([zh, vi]) => ({ zh, pinyin: py(zh), vi })),
      visual: GRAMMAR_VISUAL[g.slug] ? { ...GRAMMAR_VISUAL[g.slug] } : undefined,
    };
    const row = await prisma.grammarPoint.upsert({ where: { slug: g.slug }, create: { slug: g.slug, ...data }, update: data });
    if (force) await prisma.writingItem.deleteMany({ where: { grammarId: row.id } });
    const hadPractice = (await prisma.writingItem.count({ where: { grammarId: row.id, type: { not: 'WRONG' } } })) > 0;
    // Bài "tìm câu sai": 3 câu ví dụ đúng + 1 câu sai lấy từ bài chọn câu. Tự dựng nên cần câu sai được duyệt cùng bài chọn câu.
    const wrongSrc = g.practice.find((p) => p.type === 'CHOOSE');
    if (wrongSrc && wrongSrc.type === 'CHOOSE' && (await prisma.writingItem.count({ where: { grammarId: row.id, type: 'WRONG' } })) === 0) {
      const strip = (s: string) => s.replace(/[。？！]$/, '');
      const wrong = strip(wrongSrc.wrong[0]);
      await prisma.writingItem.create({
        data: {
          level: g.level, type: 'WRONG', vi: 'Chọn câu SAI ngữ pháp', sort: 1000 + i * 10 + 9, grammarId: row.id,
          data: { options: [...g.examples.slice(0, 3).map(([zh]) => strip(zh)), wrong], answer: wrong },
        },
      });
      made++;
    }
    if (hadPractice) continue;
    for (const [k, p] of g.practice.entries()) {
      const d =
        p.type === 'ORDER' ? { parts: p.parts, alt: p.alt ?? [] }
        : p.type === 'FILL' ? { parts: p.parts, options: p.options, answer: p.answer }
        : { options: [p.answer, ...p.wrong], answer: p.answer };
      await prisma.writingItem.create({ data: { level: g.level, type: p.type, vi: p.vi, data: d, sort: 1000 + i * 10 + k, grammarId: row.id } });
      made++;
    }
  }
  console.log(`Ngữ pháp: ${GRAMMAR.length} điểm, thêm ${made} bài luyện.`);
} finally {
  await prisma.$disconnect();
}
