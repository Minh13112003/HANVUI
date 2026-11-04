// Nạp câu của mục Luyện dịch (content/translate-sentences.ts). Chạy lại được: cập nhật theo câu tiếng Trung, xóa câu không còn
// trong file. Pinyin sinh bằng pinyin-pro theo cả câu rồi chia cho từng từ. Tự kiểm dữ liệu, sai thì dừng.
// Chạy: pnpm db:seed:translate-sentences
import '../../src/config/dotenv.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { pinyin } from 'pinyin-pro';
import { PrismaClient } from '../../src/generated/prisma/client.js';
import { hanOnly, sentenceErrors } from '../../src/content/translate.grade.js';
import { SENTENCES } from './content/translate-sentences.js';

if (process.env.NODE_ENV === 'production') throw new Error('Không seed trên production');
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
// pinyin-pro đọc sai 得 trong 说得 (dé), và không viết hoa tên riêng.
const PY_FIX: Record<string, string> = { 得: 'de', 女儿: "nǚ'ér", 北京: 'Běijīng', 中国: 'Zhōngguó' };

try {
  const errors = SENTENCES.flatMap((s) => sentenceErrors(s).map((e) => `${s.zh}: ${e}`));
  if (errors.length) throw new Error('Dữ liệu luyện dịch lỗi:\n' + errors.join('\n'));
  for (const s of SENTENCES) {
    const py = pinyin(hanOnly(s.zh), { toneType: 'symbol', type: 'array' });
    let at = 0;
    const tokens = s.tokens.map((t) => {
      const n = hanOnly(t.zh).length;
      const out = { zh: t.zh, py: PY_FIX[t.zh] ?? py.slice(at, at + n).join(''), vi: t.vi };
      at += n;
      return out;
    });
    console.log(s.zh, tokens.map((t) => t.py).join(' '));
    const data = { vi: s.vi, level: s.level, title: s.title, note: s.note, tokens, natural: s.natural, accept: s.accept, optional: s.optional, filler: s.filler, orders: s.orders, alt: s.alt, sort: s.sort };
    await prisma.translateSentence.upsert({ where: { zh: s.zh }, create: { zh: s.zh, ...data }, update: data });
  }
  await prisma.translateSentence.deleteMany({ where: { zh: { notIn: SENTENCES.map((s) => s.zh) } } });
  console.log(`Luyện dịch: ${SENTENCES.length} câu.`);
} finally {
  await prisma.$disconnect();
}
