// Nạp nội dung HSK 4 theo chủ đề (content/hsk4): từ core kèm chi tiết, hội thoại, bài đọc, bài tập viết.
// Chạy lại được: từ và danh sách core cập nhật; bài đã có thì bỏ qua (giữ âm thanh), --force tạo lại đúng các bài HSK 4 này.
// Tự kiểm dữ liệu, sai thì dừng. --dry chỉ kiểm và liệt kê từ trong bài chưa có nghĩa, không ghi database.
// Chạy: pnpm db:seed:hsk4   — sau đó: pnpm db:hsk, pnpm audio --all, pnpm audio:words.
import '../../src/config/dotenv.js';
import { readFileSync } from 'node:fs';
import { PrismaPg } from '@prisma/adapter-pg';
import { pinyin } from 'pinyin-pro';
import { PrismaClient } from '../../src/generated/prisma/client.js';
import { VOICE, enrichTokens, makeTokenizer, slug } from './chapters.js';
import { COMMON_WORDS } from './common-words.js';
import { HSK4_EXTRA } from './content/hsk4/extra.js';
import { HSK4_TOPICS, listenLesson, topicErrors } from './content/hsk4/index.js';

if (process.env.NODE_ENV === 'production') throw new Error('Không seed trên production');
const force = process.argv.includes('--force');
const dry = process.argv.includes('--dry');
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

const py = (zh: string) => (pinyin(zh, { toneType: 'symbol', type: 'array', nonZh: 'consecutive' }) as string[]).join('');
const pySent = (zh: string) => pinyin(zh, { toneType: 'symbol', nonZh: 'consecutive' });
const PROPER: Record<string, string> = { 联合国: 'Liánhéguó', 网络安全: 'wǎngluò ānquán' };
const LEVEL = 4;

try {
  const errors = HSK4_TOPICS.flatMap(topicErrors);
  if (errors.length) throw new Error('Dữ liệu HSK 4 lỗi:\n' + errors.join('\n'));

  const dbWords = await prisma.word.findMany({ select: { zh: true, vi: true } });
  const hskWords = Object.keys(JSON.parse(readFileSync(new URL('./hsk/hsk-levels.json', import.meta.url), 'utf8')));
  const vocab = new Set<string>([...hskWords, ...dbWords.map((w) => w.zh)]);
  const vi = new Map<string, string>(dbWords.filter((w) => w.vi).map((w) => [w.zh, w.vi]));
  for (const [zh, v] of COMMON_WORDS) {
    vocab.add(zh);
    if (!vi.has(zh)) vi.set(zh, v);
  }
  for (const t of HSK4_TOPICS) {
    for (const [zh, v] of t.words) {
      vocab.add(zh);
      vi.set(zh, v);
    }
  }
  for (const [zh, v] of HSK4_EXTRA) {
    vocab.add(zh);
    if (!vi.has(zh)) vi.set(zh, v);
  }
  const tokenize = makeTokenizer(vocab, vi);

  if (dry) {
    const missing = new Map<string, string>();
    for (const t of HSK4_TOPICS) {
      const sents = [...listenLesson(t.dialog).lines.map((l) => l[1]), ...t.reading.sents.map((s) => s[0])];
      for (const s of sents) {
        for (const tok of tokenize(s).tokens as { t: string; v?: string; x?: boolean }[]) {
          if (!tok.x && !tok.v) missing.set(tok.t, s);
        }
      }
    }
    console.log(`Đạt kiểm tra. Từ trong bài chưa có nghĩa (${missing.size}):`);
    console.log([...missing].map(([w, s]) => `${w}\t${s}`).join('\n'));
    process.exit(0);
  }

  // ── Từ core và chi tiết của từ ──
  const words = HSK4_TOPICS.flatMap((t) => t.words);
  const seen = new Set<string>();
  for (const [zh, v, pos, syn, usage, exZh, exVi] of words) {
    if (seen.has(zh)) continue;
    seen.add(zh);
    const detail = {
      usage,
      synonyms: syn ? syn.split(';').map((s) => { const [z, m] = s.split('='); return { zh: z, pinyin: py(z), vi: m }; }) : [],
      example: { zh: exZh, pinyin: pySent(exZh), vi: exVi },
    };
    const have = await prisma.word.findFirst({ where: { zh } });
    if (have) await prisma.word.update({ where: { id: have.id }, data: { ...detail, vi: have.vi || v, pos: have.pos ?? pos, ...(PROPER[zh] ? { pinyin: PROPER[zh] } : {}) } });
    else await prisma.word.create({ data: { zh, pinyin: PROPER[zh] ?? py(zh), vi: v, pos, phrase: [...zh].length > 3, ...detail } });
  }
  const extra = HSK4_EXTRA.filter(([zh]) => !seen.has(zh) && !dbWords.some((w) => w.zh === zh));
  await prisma.word.createMany({ data: extra.map(([zh, v, pos]) => ({ zh, pinyin: py(zh), vi: v, pos })), skipDuplicates: true });

  for (const [sort, t] of HSK4_TOPICS.entries()) {
    await prisma.coreTopic.upsert({
      where: { id: t.id },
      create: { id: t.id, name: t.name, glyph: t.glyph, intro: t.intro, sort },
      update: { name: t.name, glyph: t.glyph, intro: t.intro, sort },
    });
    const rows = await prisma.word.findMany({ where: { zh: { in: t.words.map((w) => w[0]) } }, select: { id: true, zh: true }, orderBy: { id: 'asc' } });
    const idOf = new Map(rows.map((r) => [r.zh, r.id]));
    await prisma.coreTopicWord.deleteMany({ where: { topicId: t.id } });
    await prisma.coreTopicWord.createMany({ data: t.words.map(([zh], i) => ({ topicId: t.id, wordId: idOf.get(zh)!, sort: i })) });

    // Chủ đề tình huống để lọc bài hội thoại.
    const topicId = slug(t.name) || t.id;
    await prisma.topic.upsert({ where: { id: topicId }, create: { id: topicId, kind: 'SITUATION', name: t.name, glyph: t.glyph, sort: 200 + sort }, update: { glyph: t.glyph } });

    // ── Nghe: câu hỏi nằm cuối âm thanh, màn hình chỉ có số câu và 4 đáp án ──
    const id = 'hsk4-' + t.id;
    if (force) await prisma.lesson.deleteMany({ where: { id } });
    if (!(await prisma.lesson.findUnique({ where: { id }, select: { id: true } }))) {
      const l = listenLesson(t.dialog);
      await prisma.lesson.create({
        data: {
          id, kind: 'DIALOG', title: t.dialog.title, situation: t.dialog.situation, tags: [t.name, 'HSK 4'], level: LEVEL, published: true,
          topics: { create: [{ topicId }] },
          roles: { create: Object.entries(l.cast).map(([who, c]) => ({ who, label: l.who[who] ?? who, gender: c.g, pitchRange: c.r, voiceId: VOICE[`${c.g}${c.r}`] })) },
          lines: { create: l.lines.map(([who, zh, v], i) => { const k = tokenize(zh); return { idx: i, who, zh, pinyin: k.pinyin, vi: v, tokens: k.tokens as object[] }; }) },
          questions: { create: l.questions.map((q, i) => ({ idx: i, kind: 'Nghe hiểu', ...q })) },
        },
      });
    }

    // ── Đọc ──
    const rid = 'doc4-' + t.id;
    if (force) await prisma.lesson.deleteMany({ where: { id: rid } });
    if (!(await prisma.lesson.findUnique({ where: { id: rid }, select: { id: true } }))) {
      await prisma.lesson.create({
        data: {
          id: rid, kind: 'READING', title: t.reading.title[1], situation: t.reading.title[0], tags: ['bài đọc', t.name], level: LEVEL, published: true,
          topics: { create: [{ topicId: 'bai-doc' }] },
          lines: { create: t.reading.sents.map(([zh, v], i) => { const k = tokenize(zh); return { idx: i, who: 'N', zh, pinyin: k.pinyin, vi: v, tokens: k.tokens as object[] }; }) },
          questions: { create: t.reading.qs.map((q, i) => ({ idx: i, kind: 'Đọc hiểu', prompt: q.q[0], promptVi: q.q[1], options: q.o.map(([zh, v]) => ({ zh, vi: v })), answer: q.a })) },
        },
      });
    }

    // ── Viết ──
    const haveW = new Set((await prisma.writingItem.findMany({ where: { level: LEVEL }, select: { type: true, vi: true } })).map((x) => `${x.type}|${x.vi}`));
    for (const [i, w] of t.writing.entries()) {
      if (haveW.has(`${w.type}|${w.vi}`)) continue;
      const data =
        w.type === 'ORDER' ? { parts: w.parts, alt: w.alt ?? [] }
        : w.type === 'FILL' ? { parts: w.parts, options: w.options, answer: w.answer }
        : { options: [w.answer, ...w.wrong], answer: w.answer };
      await prisma.writingItem.create({ data: { level: LEVEL, type: w.type, vi: w.vi, data, sort: 1000 + sort * 10 + i } });
    }
  }
  const enriched = await enrichTokens(prisma, vi);
  console.log(`HSK 4: ${HSK4_TOPICS.length} chủ đề, ${seen.size} từ core, thêm ${extra.length} từ phụ, bổ sung nghĩa ${enriched} từ trong bài.`);
} finally {
  await prisma.$disconnect();
}
