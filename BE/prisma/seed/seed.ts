// Nạp nội dung mẫu lấy từ bản demo (bản thật: AI sinh, người duyệt). Chỉ chạy ở môi trường dev.
// Chạy: pnpm db:seed   (xóa và nạp lại phần NỘI DUNG, không đụng tài khoản)
import { applyHintFixes } from './hint-fixes.js';
import '../../src/config/dotenv.js';
import { readFileSync } from 'node:fs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../src/generated/prisma/client.js';
import { seedChapters } from './chapters.js';

if (process.env.NODE_ENV === 'production') throw new Error('Không seed trên production');

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
const demo = JSON.parse(readFileSync(new URL('./demo-data.json', import.meta.url), 'utf8'));
// 6 hội thoại cấp HSK 3 soạn thêm (18/10/2026), chưa qua duyệt — xem _note trong file.
const hsk3 = JSON.parse(readFileSync(new URL('./hsk3-dialogs.json', import.meta.url), 'utf8'));
const hsk3Words: any[] = hsk3.words.map(([zh, py, vi, pos]: string[]) => ({ zh, py, vi, pos }));

const MONTH = '2026-10';
const slug = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const VOICE: Record<string, string> = {
  m1: 'zh-CN-YunjianNeural',
  m2: 'zh-CN-YunyangNeural',
  m3: 'zh-CN-YunxiNeural',
  f1: 'zh-CN-XiaoxiaoNeural',
  f2: 'zh-CN-XiaoxiaoNeural',
  f3: 'zh-CN-XiaoyiNeural',
};

// Tách từ: ưu tiên cụm dài nhất có trong từ điển (bản thật: AI tách khi sinh bài).
const pyMap = new Map<string, string>();
for (const [zh, py] of demo.SUPP) pyMap.set(zh, py);
const allWords: any[] = [...demo.TOPICS.flatMap((t: any) => t.words), ...demo.EXTRA, ...demo.STORYW, ...hsk3Words];
for (const w of allWords) pyMap.set(w.zh, w.py);
for (const l of demo.DLGS) for (const [zh, py] of l.words ?? []) pyMap.set(zh, py);
for (const k of demo.KEYS) if (!pyMap.has(k.key)) pyMap.set(k.key, '');
const vocab = new Set(pyMap.keys());
const viMap = new Map<string, string>(allWords.map((w) => [w.zh, w.vi]));

function tokenize(zh: string) {
  const ch = [...zh];
  const out: { t: string; p?: string; v?: string; x?: boolean }[] = [];
  for (let i = 0; i < ch.length; ) {
    if (!/[一-鿿]/.test(ch[i])) {
      out.push({ t: ch[i], x: true });
      i++;
      continue;
    }
    let hit = ch[i];
    for (let n = Math.min(4, ch.length - i); n > 1; n--) {
      const s = ch.slice(i, i + n).join('');
      if (vocab.has(s)) {
        hit = s;
        break;
      }
    }
    out.push({ t: hit, p: pyMap.get(hit) || undefined, v: viMap.get(hit) });
    i += [...hit].length;
  }
  return out;
}

async function main() {
  // Xóa nội dung cũ (thứ tự theo khóa ngoại). Tài khoản và tiến độ cascade theo.
  await prisma.$transaction([
    prisma.userSlot.deleteMany(),
    prisma.story.deleteMany(),
    prisma.lesson.deleteMany(),
    prisma.userWord.deleteMany(),
    prisma.word.deleteMany(),
    prisma.topic.deleteMany(),
  ]);

  // Chủ đề từ vựng + chủ đề tình huống
  const vocabTopics = demo.TOPICS.map((t: any, i: number) => ({
    id: `v-${t.id}`, kind: 'VOCAB' as const, name: t.name, glyph: t.zh, sort: i,
  }));
  const sitNames: string[] = ['Ăn uống', 'Công việc', 'Chào hỏi', 'Giao tiếp', 'Đi lại', 'Du lịch', 'Truyện'];
  const glyph: Record<string, string> = { 'Ăn uống': '食', 'Công việc': '工', 'Chào hỏi': '问', 'Giao tiếp': '交', 'Đi lại': '行', 'Du lịch': '旅', 'Truyện': '故' };
  const sitTopics = sitNames.map((n, i) => ({ id: slug(n), kind: 'SITUATION' as const, name: n, glyph: glyph[n], sort: i }));
  await prisma.topic.createMany({ data: [...vocabTopics, ...sitTopics] });

  // Từ vựng
  const seen = new Set<string>();
  const wordRows: any[] = [];
  const add = (w: any, topicId: string | null) => {
    const k = `${w.zh}|${w.py}`;
    if (seen.has(k)) return;
    seen.add(k);
    const [z, p, v] = (w.ph || '').split(' · ');
    wordRows.push({
      topicId, zh: w.zh, pinyin: w.py, vi: w.vi, pos: w.pos || null, phrase: w.pos === 'cụm từ',
      example: z ? { zh: z, pinyin: p, vi: v } : undefined,
    });
  };
  demo.TOPICS.forEach((t: any) => t.words.forEach((w: any) => add(w, `v-${t.id}`)));
  [...demo.EXTRA, ...demo.STORYW, ...hsk3Words].forEach((w: any) => add(w, null));
  await prisma.word.createMany({ data: wordRows });
  const wordId = new Map((await prisma.word.findMany()).map((w) => [w.zh, w.id]));

  // Hội thoại thường: HSK 1 (demo), HSK 2 (demo) và HSK 3 (soạn thêm) — gộp về một dạng chung.
  interface Dlg {
    id: string;
    base: string;
    level: number;
    title: string;
    situation: string;
    who: Record<string, string>;
    cast: Record<string, { g: string; r: number }>;
    lines: any[];
    qs: any[];
  }
  const fromDemo = (l: any): Dlg => {
    const level = l.id.endsWith('2') ? 2 : 1;
    const base = level === 2 ? l.id.slice(0, -1) : l.id;
    const meta = demo.LMETA[base] ?? {};
    return {
      id: l.id,
      base,
      level,
      title: l.title,
      situation: l.sub.split(' · ')[0],
      who: meta.who ?? { A: 'Nhân viên', B: 'Khách' },
      cast: demo.CAST[l.id],
      lines: l.lines,
      qs: l.qs,
    };
  };
  const dialogs: Dlg[] = [
    ...demo.DLGS.filter((l: any) => l.id !== 'story').map(fromDemo),
    ...hsk3.dialogs.map((l: any) => ({
      id: l.id,
      base: l.base,
      level: 3,
      title: l.title,
      situation: l.sub.split(' · ')[0],
      who: l.who,
      cast: l.cast,
      lines: l.lines,
      qs: l.qs,
    })),
  ];

  for (const l of dialogs) {
    const meta = demo.LMETA[l.base] ?? { topics: [], tags: [] };
    await prisma.lesson.create({
      data: {
        id: l.id, kind: 'DIALOG', title: l.title, situation: l.situation,
        tags: meta.tags ?? [], level: l.level, published: true,
        topics: { create: (meta.topics ?? []).map((n: string, i: number) => ({ topicId: slug(n), sort: i })) },
        roles: {
          create: Object.entries(l.cast).map(([who, c]: [string, any]) => ({
            who, label: l.who[who] ?? who, gender: c.g, pitchRange: c.r, voiceId: VOICE[`${c.g}${c.r}`],
          })),
        },
        lines: {
          create: l.lines.map((x: any, i: number) => ({
            idx: i, who: x.who, zh: x.zh, pinyin: x.py, vi: x.vi, tokens: tokenize(x.zh),
          })),
        },
        questions: {
          create: l.qs.map((q: any, i: number) => ({
            idx: i, kind: q.t[1], prompt: q.q[0], promptVi: q.q[1],
            options: q.o.map(([zh, vi]: string[]) => ({ zh, vi })), answer: q.a,
          })),
        },
      },
    });
  }

  // Nút đổi bản: xoay vòng theo cấp trong cùng chủ đề (HSK 1 → 2 → 3 → 1). Chủ đề chỉ có một cấp thì không có nút.
  const byBase = new Map<string, Dlg[]>();
  for (const l of dialogs) byBase.set(l.base, [...(byBase.get(l.base) ?? []), l]);
  for (const group of byBase.values()) {
    const sorted = [...group].sort((x, y) => x.level - y.level);
    for (const [i, l] of sorted.entries()) {
      const twinId = sorted.length > 1 ? sorted[(i + 1) % sorted.length].id : null;
      await prisma.lesson.update({ where: { id: l.id }, data: { twinId } });
    }
  }

  // Truyện sự kiện: tháng 2026-10, chương 1 (4 hồi, 12 ô). Chương 2-4 chờ nội dung.
  const story = await prisma.story.create({
    data: { id: `story-${MONTH}`, month: MONTH, title: 'Ga cũ trong đêm mưa', titleZh: '雨夜旧车站' },
  });
  const chapter = await prisma.chapter.create({ data: { storyId: story.id, idx: 1, title: 'Chương 1' } });
  for (const [i, c] of demo.CH.entries()) {
    const lid = `story-1-${i + 1}`;
    await prisma.lesson.create({
      data: {
        id: lid, kind: 'STORY', title: c.title[1], situation: 'Truyện sự kiện', tags: ['nhà ga', 'đêm mưa', 'kể chuyện'],
        level: 3, published: true,
        topics: { create: [{ topicId: 'truyen' }] },
        roles: { create: [{ who: 'N', label: 'Người kể (tôi)', gender: 'm', pitchRange: 3, voiceId: VOICE.m3 }] },
        lines: {
          create: c.lines.map((x: any, k: number) => ({
            idx: k, who: 'N', zh: x.zh, pinyin: x.py, vi: x.vi, tokens: tokenize(x.zh),
          })),
        },
      },
    });
    await prisma.hoi.create({
      data: { chapterId: chapter.id, idx: i + 1, title: c.title[1], titleZh: c.title[0], storyLessonId: lid },
    });
  }

  // 12 ô từ khóa
  for (const [i, k] of demo.KEYS.entries()) {
    const id = wordId.get(k.key);
    if (!id) throw new Error(`Từ khóa ${k.key} chưa có trong từ điển`);
    const hint = (h: string[]) => ({ zh: h[0], vi: h[1] });
    const both = (h: string[]) => ({ '1': hint(h), '2': hint(h) });
    const carriers = dialogs.filter((l) => l.lines.some((x: any) => x.zh.includes(k.key)));
    await prisma.keySlot.create({
      data: {
        chapterId: chapter.id, idx: i + 1, wordId: id, clueTopicId: slug(demo.KEYTOPIC[k.key]),
        hintGeneral: hint(k.g), hint1: hint(k.h[0]), hint2: both(k.h[1]), hint3: both(k.h[2]),
        lessons: { create: carriers.map((l) => ({ lessonId: l.id, hskGroup: l.level === 1 ? 1 : 2 })) },
      },
    });
  }

  // Chương 2-4 (soạn riêng ở chapters.ts)
  console.log('Chương 2-4:', await seedChapters(prisma, MONTH, demo.SUPP));
  console.log('Sửa gợi ý:', await applyHintFixes(prisma));

  const n = await Promise.all([
    prisma.topic.count(), prisma.word.count(), prisma.lesson.count(), prisma.lessonLine.count(),
    prisma.keySlot.count(), prisma.keySlotLesson.count(),
  ]);
  console.log('Đã nạp:', { topics: n[0], words: n[1], lessons: n[2], lines: n[3], slots: n[4], slotLessons: n[5] });
}

await main().finally(() => prisma.$disconnect());
