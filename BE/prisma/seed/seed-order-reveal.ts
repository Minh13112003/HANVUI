// Gắn phần hiện sau khi làm vào bài Sắp xếp câu đã có (content/order-reveal.ts): nghĩa từng thẻ, pinyin, sơ đồ mũi tên, cách xếp khác cũng đúng.
// Chỉ ghi thêm vào cột data, không đổi đề và không đổi tiến độ. Chạy lại được; tạo lại bài viết (--force của các seed khác) thì phải chạy lại.
// Tự kiểm: mọi bài có dữ liệu, số nghĩa khớp số thẻ, nối các đoạn đúng câu tiếng Việt, câu khác dùng đủ các thẻ. --dry chỉ kiểm và in, không ghi.
// Chạy: pnpm db:seed:order-reveal
import '../../src/config/dotenv.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { pinyin } from 'pinyin-pro';
import { PrismaClient } from '../../src/generated/prisma/client.js';
import { ORDER_REVEAL } from './content/order-reveal.js';

if (process.env.NODE_ENV === 'production') throw new Error('Không seed trên production');
const dry = process.argv.includes('--dry');
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

// Trợ từ đọc nhẹ và tên riêng mà pinyin-pro đọc sai khi đứng riêng trong câu.
const PARTICLE: Record<string, string> = { 过: 'guo', 得: 'de', 了: 'le', 着: 'zhe', 的: 'de', 吧: 'ba', 吗: 'ma' };
const PROPER: [string, string][] = [['běijīng', 'Běijīng'], ['zhōngguó', 'Zhōngguó'], ['hànyǔ', 'Hànyǔ'], ['yīngyǔ', 'Yīngyǔ'], ['zhōngwén', 'Zhōngwén'], ['shuōdé', 'shuōde'], ['diǎnér', 'diǎnr'], ['diǎner', 'diǎnr'], ['péngyǒu', 'péngyou'], ['míngzì', 'míngzi'], ['yìsī', 'yìsi'], ['shíhòu', 'shíhou']];
const squash = (s: string) => s.toLowerCase().replace(/[\s,.?!;:，。？！]/g, '');
const sortChars = (s: string) => [...s].sort().join('');

function piecePinyin(parts: string[]) {
  const syll = pinyin(parts.join(''), { toneType: 'symbol', type: 'array', nonZh: 'consecutive' }) as string[];
  let at = 0;
  return parts.map((p) => {
    const n = [...p].length;
    let py = PARTICLE[p] ?? syll.slice(at, at + n).join('');
    at += n;
    for (const [a, b] of PROPER) py = py.replace(a, b);
    return py;
  });
}

try {
  const rows = await prisma.writingItem.findMany({ where: { type: 'ORDER' }, orderBy: { id: 'asc' } });
  const words = new Set((await prisma.word.findMany({ select: { zh: true } })).map((w) => w.zh));
  const table = new Map(ORDER_REVEAL.map((r) => [r[0], r]));
  const errors: string[] = [];
  if (table.size !== ORDER_REVEAL.length) errors.push('Có khóa bị trùng trong ORDER_REVEAL');
  const used = new Set<string>();
  const updates: { id: number; data: object }[] = [];
  const noDict = new Set<string>();

  for (const row of rows) {
    const d = row.data as { parts: string[]; alt?: string[] };
    const key = d.parts.join('|');
    const r = table.get(key);
    if (!r) {
      errors.push(`#${row.id} chưa có dữ liệu: ${key}`);
      continue;
    }
    used.add(key);
    const glosses = r[1].split('|');
    if (glosses.length !== d.parts.length) errors.push(`#${row.id} ${key}: ${glosses.length} nghĩa cho ${d.parts.length} thẻ`);
    const natural = r[2]
      ? r[2].split('|').map((s) => {
          const [vi, at] = s.split('@');
          return { vi, at: Number(at) };
        })
      : glosses.flatMap((vi, at) => (vi.startsWith('(') ? [] : [{ vi: at === 0 ? vi[0].toUpperCase() + vi.slice(1) : vi, at }]));
    if (natural.some((n) => !(n.at >= 0 && n.at < d.parts.length))) errors.push(`#${row.id} ${key}: mũi tên sai vị trí`);
    if (squash(natural.map((n) => n.vi).join('')) !== squash(row.vi)) errors.push(`#${row.id} ${key}: "${natural.map((n) => n.vi).join(' ')}" khác "${row.vi}"`);
    const alt = [...new Set([...(d.alt ?? []), ...(r[3] ?? [])])];
    for (const a of alt) if (sortChars(a) !== sortChars(d.parts.join(''))) errors.push(`#${row.id} ${key}: câu khác "${a}" không dùng đúng các chữ của thẻ`);

    const py = piecePinyin(d.parts);
    const tokens = d.parts.map((zh, i) => {
      // Lưu từ: thẻ có trong từ điển thì lưu nguyên, thẻ dính trợ từ hay giới từ thì lưu phần lõi.
      const core = [zh, zh.replace(/[的了吧]$/, ''), zh.replace(/^[在跟给]/, '')].find((c) => c && words.has(c));
      if (!core) noDict.add(zh);
      return { zh, py: py[i], vi: glosses[i], ...(core && core !== zh ? { save: core } : {}) };
    });
    updates.push({ id: row.id, data: { ...d, alt, tokens, natural } });
  }
  for (const k of table.keys()) if (!used.has(k)) errors.push(`Khóa thừa: ${k}`);
  if (errors.length) throw new Error('Dữ liệu sắp xếp câu lỗi:\n' + errors.join('\n'));

  if (dry) {
    console.log(`Đạt kiểm tra: ${updates.length} bài.`);
    console.log('Thẻ không có trong từ điển, lưu nguyên cụm:', [...noDict].join(' '));
    for (const u of updates.slice(0, 200)) console.log((u.data as { tokens: { zh: string; py: string; save?: string }[] }).tokens.map((t) => `${t.zh}=${t.py}${t.save ? `(lưu ${t.save})` : ''}`).join(' '));
  } else {
    for (const u of updates) await prisma.writingItem.update({ where: { id: u.id }, data: { data: u.data } });
    console.log(`Đã cập nhật ${updates.length} bài sắp xếp câu.`);
  }
} finally {
  await prisma.$disconnect();
}
