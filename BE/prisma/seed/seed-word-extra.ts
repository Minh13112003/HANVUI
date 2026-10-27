// Nạp dữ liệu từ vựng nâng cao: (1) tách chữ Hán (hanzi/hanzi.json + nghĩa tiếng Việt của bộ phận), (2) cách nhớ chữ và
// cụm từ đi kèm + câu ví dụ (content/word-extra-*.ts), (3) nhóm từ dễ nhầm (content/word-compare.ts). Chạy lại được.
// Chạy: pnpm db:seed:word-extra
import '../../src/config/dotenv.js';
import { readFileSync } from 'node:fs';
import { pinyin } from 'pinyin-pro';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../src/generated/prisma/client.js';
import { WORD_COMPARE } from './content/word-compare.js';
import { WORD_EXTRA_HSK1 } from './content/word-extra-hsk1.js';
import { COMPONENT_VI } from './hanzi/components-vi.js';

if (process.env.NODE_ENV === 'production') throw new Error('Không seed trên production');
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
const py = (zh: string) => (pinyin(zh, { toneType: 'symbol', type: 'array' }) as string[]).join(' ');

interface HanziRow {
  py: string;
  ids: string;
  rad: string;
  kind: string | null;
  sem: string | null;
  pho: string | null;
  parts: string[];
}

/** Đọc một khối "từ|cách nhớ|mẫu :: ví dụ = nghĩa ;; ví dụ = nghĩa". Từ trùng thì giữ dòng đầu và báo. */
function parseExtra(raw: string) {
  const out = new Map<string, { mnemonic: string; colloc: { p: string; ex: { zh: string; pinyin: string; vi: string }[] }[] }>();
  const dup: string[] = [];
  for (const line of raw.split('\n')) {
    if (!line.trim()) continue;
    const [zh, mnemonic, rest] = line.split('|');
    if (!zh || !mnemonic || !rest) throw new Error('Dòng sai định dạng: ' + line);
    if (out.has(zh.trim())) {
      dup.push(zh.trim());
      continue;
    }
    const [pattern, exs] = rest.split(' :: ');
    const ex = (exs ?? '')
      .split(' ;; ')
      .filter(Boolean)
      .map((e) => {
        const [z, v] = e.split(' = ');
        return { zh: z.trim(), pinyin: py(z.trim()), vi: (v ?? '').trim() };
      });
    out.set(zh.trim(), { mnemonic: mnemonic.trim(), colloc: [{ p: pattern.trim(), ex }] });
  }
  return { out, dup };
}

try {
  // (1) Tách chữ
  const H = JSON.parse(readFileSync(new URL('./hanzi/hanzi.json', import.meta.url), 'utf8')) as Record<string, HanziRow>;
  const single = new Map((await prisma.word.findMany({ select: { zh: true, vi: true } })).filter((w) => [...w.zh].length === 1).map((w) => [w.zh, w.vi]));
  // Nghĩa ngắn: bảng bộ phận trước (đã soạn gọn để nhớ chữ), rồi nghĩa đầu tiên của từ đơn trong từ điển.
  const short = (c: string) => COMPONENT_VI[c] ?? single.get(c)?.replace(/\([^)]*\)/g, '').split(/[,;]/)[0]?.trim() ?? null;
  const rows = Object.entries(H).map(([ch, r]) => ({
    ch, pinyin: r.py, vi: short(ch) || null, ids: r.ids, radical: r.rad, kind: r.kind, semantic: r.sem, phonetic: r.pho, parts: r.parts,
  }));
  await prisma.hanzi.deleteMany({});
  await prisma.hanzi.createMany({ data: rows });
  const noVi = rows.filter((r) => !r.vi).length;

  // (2) Cách nhớ + cụm từ
  const { out, dup } = parseExtra(WORD_EXTRA_HSK1);
  let n = 0;
  const missing: string[] = [];
  for (const [zh, e] of out) {
    const r = await prisma.word.updateMany({ where: { zh }, data: { mnemonic: e.mnemonic, colloc: e.colloc } });
    if (r.count) n++;
    else missing.push(zh);
  }
  const hsk1 = await prisma.word.findMany({ where: { hsk2List: 1 }, select: { zh: true } });
  const noExtra = hsk1.filter((w) => !out.has(w.zh)).map((w) => w.zh);

  // (3) Từ dễ nhầm
  for (const c of WORD_COMPARE) {
    const data = {
      level: c.level, words: c.words, title: c.title, explain: c.explain,
      uses: c.uses.map(([zh, when, ex, exVi]) => ({ zh, when, ex, exVi, exPinyin: py(ex) })),
      trap: c.trap ? { wrong: c.trap[0], right: c.trap[1], why: c.trap[2] } : undefined,
    };
    await prisma.wordCompare.upsert({ where: { slug: c.slug }, create: { slug: c.slug, ...data }, update: data });
  }
  await prisma.wordCompare.deleteMany({ where: { slug: { notIn: WORD_COMPARE.map((c) => c.slug) } } });

  console.log(`Tách chữ: ${rows.length} chữ/bộ phận (${noVi} chưa có nghĩa tiếng Việt, chỉ hiện chữ + pinyin).`);
  console.log(`Cách nhớ + cụm từ: ${n} từ${dup.length ? `; trùng (bỏ qua): ${dup.join(' ')}` : ''}${missing.length ? `; không có trong từ điển: ${missing.join(' ')}` : ''}.`);
  if (noExtra.length) console.log(`Từ HSK 1 chưa có cách nhớ: ${noExtra.join(' ')}`);
  console.log(`Từ dễ nhầm: ${WORD_COMPARE.length} nhóm.`);
} finally {
  await prisma.$disconnect();
}
