// Nạp bài hội thoại "vượt ải" theo cấp (content/ladder.ts), bài đọc và bài tập viết (content/reading.ts). Chỉ thêm, không đụng bài cũ.
// Bài đã có thì bỏ qua (giữ âm thanh); --force xóa và tạo lại đúng các bài trong file.
// Chạy: pnpm db:seed:ladder   — sau đó: pnpm db:hsk (nhãn cấp) và pnpm audio --all (âm thanh bài mới).
import '../../src/config/dotenv.js';
import { readFileSync } from 'node:fs';
import { pinyin } from 'pinyin-pro';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../src/generated/prisma/client.js';
import { COMMON_WORDS } from './common-words.js';
import { VOICE, enrichTokens, makeTokenizer, slug } from './chapters.js';
import { LADDER, TOPIC_GLYPH_LADDER } from './content/ladder.js';
import { LADDER3, TOPIC_GLYPH_LADDER3 } from './content/ladder3.js';
import { READINGS, WRITING } from './content/reading.js';

if (process.env.NODE_ENV === 'production') throw new Error('Không seed trên production');

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
const force = process.argv.includes('--force');
const ALL = [...LADDER, ...LADDER3];
const GLYPH: Record<string, string> = { ...TOPIC_GLYPH_LADDER, ...TOPIC_GLYPH_LADDER3 };

try {
  const ids = ALL.map((l) => l.id);
  if (new Set(ids).size !== ids.length) throw new Error('Mã bài bị trùng trong ladder.ts');
  for (const l of ALL) {
    const hanTypes = new Set([...l.lines.map((x) => x[1]).join('')].filter((c) => /[一-鿿]/.test(c)));
    if (hanTypes.size < 12) throw new Error(`${l.id}: bài quá ngắn (${hanTypes.size} chữ khác nhau)`);
    for (const q of l.qs) if (q.a < 0 || q.a >= q.o.length) throw new Error(`${l.id}: đáp án câu hỏi ngoài phạm vi`);
    for (const who of new Set(l.lines.map((x) => x[0]))) if (!l.cast[who]) throw new Error(`${l.id}: vai ${who} chưa có giọng`);
    const [a, b] = Object.values(l.cast);
    if (a && b && a.g === b.g && a.r === b.r) throw new Error(`${l.id}: hai vai trùng cả giới tính lẫn khoảng giọng`);
  }

  const dbWords = await prisma.word.findMany({ select: { zh: true, vi: true } });
  const hskWords = Object.keys(JSON.parse(readFileSync(new URL('./hsk/hsk-levels.json', import.meta.url), 'utf8')));
  const vocab = new Set<string>([...hskWords, ...dbWords.map((w) => w.zh)]);
  const vi = new Map<string, string>(dbWords.filter((w) => w.vi).map((w) => [w.zh, w.vi]));
  const newWords = new Map<string, { vi: string; pos: string }>();
  for (const [zh, v, pos] of COMMON_WORDS) newWords.set(zh, { vi: v, pos });
  for (const l of ALL) for (const [zh, v, pos] of l.words) newWords.set(zh, { vi: v, pos });
  for (const [zh, w] of newWords) {
    vocab.add(zh);
    if (!vi.has(zh)) vi.set(zh, w.vi);
  }
  const tokenize = makeTokenizer(vocab, vi);

  const topics = [...new Set(ALL.map((l) => l.topic))];
  const topSort = await prisma.topic.count({ where: { kind: 'SITUATION' } });
  for (const [i, name] of topics.entries()) {
    await prisma.topic.upsert({
      where: { id: slug(name) },
      create: { id: slug(name), kind: 'SITUATION', name, glyph: GLYPH[name], sort: topSort + i },
      update: {},
    });
  }

  const have = new Set(dbWords.map((w) => w.zh));
  const toCreate = [...newWords].filter(([zh]) => !have.has(zh));
  if (toCreate.length) {
    await prisma.word.createMany({
      data: toCreate.map(([zh, w]) => ({
        zh, pinyin: (pinyin(zh, { toneType: 'symbol', type: 'array' }) as string[]).join(''), vi: w.vi, pos: w.pos, phrase: w.pos === 'cụm từ',
      })),
      skipDuplicates: true,
    });
  }

  if (force) await prisma.lesson.deleteMany({ where: { id: { in: ids } } });
  const existing = new Set((await prisma.lesson.findMany({ where: { id: { in: ids } }, select: { id: true } })).map((l) => l.id));

  let made = 0;
  for (const l of ALL) {
    if (existing.has(l.id)) continue;
    await prisma.lesson.create({
      data: {
        id: l.id, kind: 'DIALOG', title: l.title, situation: l.situation, tags: l.tags, level: l.level, published: true,
        topics: { create: [{ topicId: slug(l.topic) }] },
        roles: {
          create: Object.entries(l.cast).map(([who, c]) => ({
            who, label: l.who[who] ?? who, gender: c.g, pitchRange: c.r, voiceId: VOICE[`${c.g}${c.r}`],
          })),
        },
        lines: {
          create: l.lines.map(([who, zh, v], i) => {
            const t = tokenize(zh);
            return { idx: i, who, zh, pinyin: t.pinyin, vi: v, tokens: t.tokens as object[] };
          }),
        },
        questions: {
          create: l.qs.map((q, i) => ({
            idx: i, kind: 'Nghe hiểu', prompt: q.q[0], promptVi: q.q[1], options: q.o.map(([zh, v]) => ({ zh, vi: v })), answer: q.a,
          })),
        },
      },
    });
    made++;
  }
  // Bài đọc (kỹ năng Đọc): mỗi câu là một dòng, vai 'N', không có âm thanh.
  await prisma.topic.upsert({
    where: { id: 'bai-doc' },
    create: { id: 'bai-doc', kind: 'SITUATION', name: 'Bài đọc', glyph: '读', sort: 99 },
    update: {},
  });
  if (force) await prisma.lesson.deleteMany({ where: { id: { in: READINGS.map((r) => r.id) } } });
  const haveRead = new Set((await prisma.lesson.findMany({ where: { kind: 'READING' }, select: { id: true } })).map((l) => l.id));
  let reads = 0;
  for (const r of READINGS) {
    if (haveRead.has(r.id)) continue;
    await prisma.lesson.create({
      data: {
        id: r.id, kind: 'READING', title: r.title[1], situation: r.title[0], tags: ['bài đọc'], level: r.level, published: true,
        topics: { create: [{ topicId: 'bai-doc' }] },
        lines: {
          create: r.sents.map(([zh, v], i) => {
            const t = tokenize(zh);
            return { idx: i, who: 'N', zh, pinyin: t.pinyin, vi: v, tokens: t.tokens as object[] };
          }),
        },
        questions: {
          create: r.qs.map((q, i) => ({
            idx: i, kind: 'Đọc hiểu', prompt: q.q[0], promptVi: q.q[1], options: q.o.map(([zh, v]) => ({ zh, vi: v })), answer: q.a,
          })),
        },
      },
    });
    reads++;
  }

  // Giọng người đọc cho bài đọc (để tạo âm thanh); bổ sung cho cả bài đã nạp trước đó.
  for (const r of READINGS) {
    await prisma.lessonRole.upsert({
      where: { lessonId_who: { lessonId: r.id, who: 'N' } },
      create: { lessonId: r.id, who: 'N', label: 'Người đọc', gender: 'f', pitchRange: 2, voiceId: VOICE.f2 },
      update: {},
    });
  }

  // Bài tập viết
  if (force) await prisma.writingItem.deleteMany({});
  let writes = 0;
  const haveW = new Set((await prisma.writingItem.findMany({ select: { level: true, type: true, vi: true } })).map((x) => `${x.level}|${x.type}|${x.vi}`));
  for (const [i, w] of WRITING.entries()) {
    if (haveW.has(`${w.level}|${w.type}|${w.vi}`)) continue;
    const data =
      w.type === 'ORDER' ? { parts: w.parts, alt: w.alt ?? [] }
      : w.type === 'FILL' ? { parts: w.parts, options: w.options, answer: w.answer }
      : { options: [w.answer, ...w.wrong], answer: w.answer };
    if (w.type === 'FILL' && !w.options.includes(w.answer)) throw new Error(`Điền chữ: đáp án ${w.answer} không nằm trong lựa chọn`);
    await prisma.writingItem.create({ data: { level: w.level, type: w.type, vi: w.vi, data, sort: i } });
    writes++;
  }
  const enriched = await enrichTokens(prisma, vi);
  console.log(`Đã thêm ${made} bài hội thoại (bỏ qua ${existing.size}), ${reads} bài đọc, ${writes} bài tập viết, ${toCreate.length} từ mới, bổ sung nghĩa ${enriched} câu.`);
} finally {
  await prisma.$disconnect();
}
