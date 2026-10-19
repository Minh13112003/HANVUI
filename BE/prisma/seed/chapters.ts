// Nạp chương 2-4 của truyện "Ga cũ trong đêm mưa": 12 hội thoại cùng chủ đề × 2 cấp, 36 ô từ khóa, 12 hồi truyện.
// Chạy lại được nhiều lần (xóa và tạo lại đúng phần của chương 2-4, KHÔNG đụng chương 1, tài khoản hay âm thanh
// của bài cũ). Dùng ở hai nơi: seed.ts (nạp đầy đủ) và seed-chapters.ts (chỉ thêm chương 2-4).
import { readFileSync } from 'node:fs';
import { pinyin } from 'pinyin-pro';
import type { PrismaClient } from '../../src/generated/prisma/client.js';
import { ch2 } from './content/ch2.js';
import { ch3 } from './content/ch3.js';
import { ch4 } from './content/ch4.js';
import { COMMON_WORDS } from './common-words.js';
import type { Base, Chapter, Level } from './content/types.js';

export const CHAPTERS: Chapter[] = [ch2, ch3, ch4];

export const slug = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const VOICE: Record<string, string> = {
  m1: 'zh-CN-YunjianNeural',
  m2: 'zh-CN-YunyangNeural',
  m3: 'zh-CN-YunxiNeural',
  f1: 'zh-CN-XiaoxiaoNeural',
  f2: 'zh-CN-XiaoxiaoNeural',
  f3: 'zh-CN-XiaoyiNeural',
};

const TOPIC_GLYPH: Record<string, string> = {
  'Mua sắm': '买', 'Sức khỏe': '医', 'Thời tiết và thời gian': '时', 'Học tập': '学', 'Gia đình': '家',
  'Sở thích và giải trí': '乐', 'Dịch vụ': '务', 'Văn hóa và lễ hội': '节', 'Giao tiếp': '交', 'Ăn uống': '食',
  'Đi lại': '行', 'Du lịch': '旅',
};

const HAN = /[一-鿿]/;
const isHan = (c: string) => HAN.test(c);

interface Tok {
  t: string;
  p?: string;
  v?: string;
  x?: boolean;
}

// ───────────── Pinyin và tách từ ─────────────

const PUNCT: Record<string, string> = { '，': ',', '。': '.', '？': '?', '！': '!', '：': ':', '；': ';', '、': ',', '（': '(', '）': ')' };

/**
 * Tách từ bằng khớp dài nhất với từ điển (từ HSK + từ đã có + từ mới của chương); chữ không tra được thì đứng riêng.
 * (Đã thử bộ tách từ ICU của Node nhưng kết quả nhiễu, ví dụ "我想", "上站".)
 */
export function makeTokenizer(vocab: Set<string>, vi: Map<string, string>) {
  return function tokenize(zh: string): { tokens: Tok[]; pinyin: string } {
    const chars = [...zh];
    // pinyin-pro cho đúng một phần tử mỗi ký tự (kể cả dấu câu), xử lý sẵn biến điệu (不/一) và chữ đa âm.
    const syl = pinyin(zh, { toneType: 'symbol', type: 'array' }) as string[];
    if (syl.length !== chars.length) throw new Error(`pinyin lệch độ dài cho: ${zh}`);

    const tokens: Tok[] = [];
    for (let i = 0; i < chars.length; ) {
      if (!isHan(chars[i])) {
        tokens.push({ t: chars[i], x: true });
        i++;
        continue;
      }
      let len = 0;
      for (let n = Math.min(4, chars.length - i); n >= 2; n--) {
        if (vocab.has(chars.slice(i, i + n).join(''))) {
          len = n;
          break;
        }
      }
      if (!len) len = 1;
      const t = chars.slice(i, i + len).join('');
      tokens.push({ t, p: erhua(t, syl.slice(i, i + len).join('')), v: vi.get(t) });
      i += len;
    }
    return { tokens, pinyin: renderPinyin(tokens) };
  };
}

/** Từ có đuôi 儿 (哪儿, 点儿...) ghi "r" như các bài cũ; trừ những từ mà 儿 là một âm riêng (女儿...). */
const REAL_ER = /女儿|婴儿|孤儿|男儿|儿女|儿童/;
function erhua(word: string, py: string): string {
  if ([...word].length > 1 && word.endsWith('儿') && !REAL_ER.test(word)) return py.replace(/ér$|er$/, 'r');
  return py;
}

/** Pinyin của cả câu: nhóm theo từ, dấu câu đổi sang dạng thường, viết hoa đầu câu (giống các bài cũ). */
export function renderPinyin(tokens: Tok[]): string {
  let out = '';
  let cap = true;
  for (const t of tokens) {
    if (t.x) {
      if (t.t === '“') {
        out += (out && !out.endsWith(' ') ? ' ' : '') + '“';
        cap = true;
        continue;
      }
      const p = PUNCT[t.t] ?? t.t;
      out += p;
      if ('.?!'.includes(p)) cap = true;
      continue;
    }
    let s = t.p ?? '';
    if (cap) {
      s = s.charAt(0).toUpperCase() + s.slice(1);
      cap = false;
    }
    out += (out && !out.endsWith('“') && !out.endsWith(' ') ? ' ' : '') + s;
  }
  return out;
}

// ───────────── Kiểm tra nội dung ─────────────

const bigrams = (s: string) => {
  const c = [...s].filter(isHan);
  return new Set(c.slice(0, -1).map((x, i) => x + c[i + 1]));
};
const similarity = (a: string, b: string) => {
  const x = bigrams(a);
  const y = bigrams(b);
  if (!x.size || !y.size) return 0;
  let inter = 0;
  x.forEach((g) => y.has(g) && inter++);
  return inter / (x.size + y.size - inter);
};

function validate(chapters: Chapter[], existingKeys: string[]): string[] {
  const errors: string[] = [];
  const warnings: string[] = [];
  const allKeys = [...existingKeys, ...chapters.flatMap((c) => c.bases.flatMap((b) => b.keys.map((k) => k.zh)))];
  const seenKey = new Set<string>();
  const seenId = new Set<string>();

  for (const ch of chapters) {
    if (ch.bases.length !== 4) errors.push(`Chương ${ch.idx}: cần đúng 4 hội thoại chủ đề (12 ô), có ${ch.bases.length}`);
    if (ch.hoi.length !== 4) errors.push(`Chương ${ch.idx}: cần đúng 4 hồi, có ${ch.hoi.length}`);

    for (const b of ch.bases) {
      for (const id of [b.id, `${b.id}2`]) {
        if (seenId.has(id)) errors.push(`Trùng mã bài ${id}`);
        seenId.add(id);
      }
      for (const [name, lv] of [['HSK1', b.lv1], ['HSK2', b.lv2]] as [string, Level][]) {
        const tag = `${b.id}/${name}`;
        const text = lv.lines.map((l) => l[1]).join('');
        const [r1, r2] = Object.values(lv.cast);
        if (r1.g === r2.g && r1.r === r2.r) errors.push(`${tag}: hai vai trùng cả giới tính lẫn khoảng giọng`);
        for (const l of lv.lines) if (!lv.cast[l[0]]) errors.push(`${tag}: vai ${l[0]} không có trong cast`);
        for (const k of b.keys) if (!text.includes(k.zh)) errors.push(`${tag}: từ khóa ${k.zh} không có trong lời thoại`);
        for (const q of lv.qs) {
          if (q.o.length !== 3 || q.a < 0 || q.a > 2) errors.push(`${tag}: câu hỏi "${q.q[0]}" cần 3 lựa chọn và đáp án hợp lệ`);
          for (const k of b.keys) {
            if (similarity(q.q[0], k.h3[0]) > 0.5) errors.push(`${tag}: câu hỏi "${q.q[0]}" quá giống gợi ý 3 của ${k.zh}`);
          }
        }
      }
      const distinct = new Set([...b.lv1.lines.map((l) => l[1]).join('')].filter(isHan)).size;
      if (distinct < 21) errors.push(`${b.id}/HSK1: chỉ có ${distinct} chữ Hán khác nhau, cần ít nhất 21 (rule.md 5.5)`);

      for (const k of b.keys) {
        if (seenKey.has(k.zh)) errors.push(`Từ khóa ${k.zh} bị trùng`);
        seenKey.add(k.zh);
        if (existingKeys.includes(k.zh)) errors.push(`Từ khóa ${k.zh} đã là từ khóa của chương 1`);
        const hints = [k.g, k.h2, k.h3];
        const pinyinKey = pinyin(k.zh, { toneType: 'none', type: 'array' }).join('');
        for (const [zh, vi] of hints) {
          if (zh.includes(k.zh)) errors.push(`Gợi ý của ${k.zh} chứa chính từ khóa: "${zh}"`);
          // So khớp theo từ nguyên vẹn ("hát" không tính là có trong "phát").
          const meaning = k.vi.toLowerCase().split(',')[0].trim();
          if (new RegExp(`(?<![\p{L}])${meaning}(?![\p{L}])`, 'u').test(vi.toLowerCase())) errors.push(`Bản dịch gợi ý của ${k.zh} chứa nghĩa của đáp án: "${vi}"`);
          if (zh.toLowerCase().replace(/\s/g, '').includes(pinyinKey)) errors.push(`Gợi ý của ${k.zh} chứa pinyin của đáp án`);
        }
        // Đáp án chia sẻ chữ với gợi ý: chỉ cảnh báo (nhiều từ ghép khó tránh hoàn toàn).
        const shared = [...new Set([...k.zh].filter((c) => hints.some(([zh]) => zh.includes(c))))];
        if (shared.length) warnings.push(`${k.zh}: gợi ý dùng lại chữ ${shared.join('')}`);
      }
    }

    // Truyện không được chứa bất kỳ từ khóa nào (để đọc truyện không làm lộ đáp án).
    ch.hoi.forEach((h, i) => {
      const text = h.lines.map((l) => l[0]).join('');
      for (const k of allKeys) if (text.includes(k)) errors.push(`Truyện chương ${ch.idx} hồi ${i + 1} chứa từ khóa ${k}`);
      if (h.q.o.length !== 3) errors.push(`Truyện chương ${ch.idx} hồi ${i + 1}: câu hỏi cần 3 lựa chọn`);
    });
  }
  if (warnings.length) console.log('Cảnh báo (không chặn):\n  ' + warnings.join('\n  '));
  return errors;
}

// ───────────── Nạp vào DB ─────────────

interface Dlg {
  id: string;
  level: 1 | 2;
  base: Base;
  lv: Level;
}

export async function seedChapters(prisma: PrismaClient, month: string, supp: [string, string][] = []) {
  const story = await prisma.story.findUnique({ where: { month } });
  if (!story) throw new Error(`Chưa có truyện tháng ${month}: hãy chạy pnpm db:seed trước`);

  const ch1Keys = (await prisma.keySlot.findMany({ where: { chapter: { storyId: story.id, idx: 1 } }, include: { word: true } })).map((s) => s.word.zh);
  const errors = validate(CHAPTERS, ch1Keys);
  if (errors.length) throw new Error('Nội dung chương 2-4 chưa hợp lệ:\n  - ' + errors.join('\n  - '));

  // Từ điển cho tách từ: từ đã có trong DB + từ phụ của bản demo + từ mới của chương.
  const dbWords = await prisma.word.findMany({ select: { zh: true, vi: true } });
  const hskWords = Object.keys(JSON.parse(readFileSync(new URL('./hsk/hsk-levels.json', import.meta.url), 'utf8')));
  const vocab = new Set<string>([...hskWords, ...dbWords.map((w) => w.zh), ...supp.map(([zh]) => zh)]);
  const vi = new Map<string, string>(dbWords.filter((w) => w.vi).map((w) => [w.zh, w.vi]));
  const newWords = new Map<string, { vi: string; pos: string }>();
  for (const [zh, v, pos] of COMMON_WORDS) newWords.set(zh, { vi: v, pos });
  for (const ch of CHAPTERS) {
    for (const b of ch.bases) for (const [zh, v, pos] of b.words) newWords.set(zh, { vi: v, pos });
    for (const [zh, v, pos] of ch.words) newWords.set(zh, { vi: v, pos });
  }
  // Từ ghép ngắn hay gặp mà danh sách HSK không có: để tách từ không cắt đôi.
  for (const w of ['点儿', '有点儿', '一点儿', '一个', '两个', '几个', '这个', '那个', '哪个', '每个']) vocab.add(w);
  for (const [zh, w] of newWords) {
    vocab.add(zh);
    if (!vi.has(zh)) vi.set(zh, w.vi);
  }
  const tokenize = makeTokenizer(vocab, vi);

  // Chủ đề tình huống còn thiếu
  const topicNames = new Set<string>(['Truyện']);
  for (const ch of CHAPTERS) for (const b of ch.bases) [...b.topics, b.clue.name].forEach((n) => topicNames.add(n));
  for (const name of topicNames) {
    await prisma.topic.upsert({
      where: { id: slug(name) },
      create: { id: slug(name), kind: 'SITUATION', name, glyph: TOPIC_GLYPH[name] ?? (name === 'Truyện' ? '故' : undefined) },
      update: {},
    });
  }

  // Từ vựng mới (không trùng chữ Hán với từ đã có)
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
  // Từ khóa phải có trong từ điển; từ phụ của truyện có thể thiếu nghĩa thì bỏ qua.
  const wordId = new Map((await prisma.word.findMany({ select: { id: true, zh: true } })).map((w) => [w.zh, w.id]));

  // Xóa phần cũ của chương 2-4 (làm lại được nhiều lần)
  const dialogs: Dlg[] = CHAPTERS.flatMap((ch) =>
    ch.bases.flatMap((b): Dlg[] => [
      { id: b.id, level: 1, base: b, lv: b.lv1 },
      { id: `${b.id}2`, level: 2, base: b, lv: b.lv2 },
    ]),
  );
  const storyIds = CHAPTERS.flatMap((ch) => ch.hoi.map((_, i) => `story-${ch.idx}-${i + 1}`));
  await prisma.chapter.deleteMany({ where: { storyId: story.id, idx: { in: CHAPTERS.map((c) => c.idx) } } });
  await prisma.lesson.deleteMany({ where: { id: { in: [...dialogs.map((d) => d.id), ...storyIds] } } });

  // Hội thoại
  for (const d of dialogs) {
    await prisma.lesson.create({
      data: {
        id: d.id, kind: 'DIALOG', title: d.lv.title, situation: d.lv.situation, tags: d.base.tags, level: d.level,
        twinId: null, published: true,
        topics: { create: d.base.topics.map((n) => ({ topicId: slug(n) })) },
        roles: {
          create: Object.entries(d.lv.cast).map(([who, c]) => ({
            who, label: d.lv.who[who] ?? who, gender: c.g, pitchRange: c.r, voiceId: VOICE[`${c.g}${c.r}`],
          })),
        },
        lines: {
          create: d.lv.lines.map(([who, zh, v], i) => {
            const t = tokenize(zh);
            return { idx: i, who, zh, pinyin: t.pinyin, vi: v, tokens: t.tokens as object[] };
          }),
        },
        questions: {
          create: d.lv.qs.map((q, i) => ({
            idx: i, kind: 'Nghe hiểu', prompt: q.q[0], promptVi: q.q[1], options: q.o.map(([zh, v]) => ({ zh, vi: v })), answer: q.a,
          })),
        },
      },
    });
  }
  for (const b of CHAPTERS.flatMap((c) => c.bases)) {
    await prisma.lesson.update({ where: { id: b.id }, data: { twinId: `${b.id}2` } });
    await prisma.lesson.update({ where: { id: `${b.id}2` }, data: { twinId: b.id } });
  }

  // Chương, hồi (bài truyện), ô từ khóa
  const carriers = await prisma.lesson.findMany({ where: { kind: 'DIALOG' }, select: { id: true, level: true, lines: { select: { zh: true } } } });
  const carrierText = carriers.map((l) => ({ id: l.id, level: l.level, text: l.lines.map((x) => x.zh).join('') }));

  for (const ch of CHAPTERS) {
    const chapter = await prisma.chapter.create({ data: { storyId: story.id, idx: ch.idx, title: ch.title } });

    for (const [i, h] of ch.hoi.entries()) {
      const lid = `story-${ch.idx}-${i + 1}`;
      await prisma.lesson.create({
        data: {
          id: lid, kind: 'STORY', title: h.title[1], situation: 'Truyện sự kiện', tags: ['nhà ga', 'đêm mưa', 'kể chuyện'], level: 3, published: true,
          topics: { create: [{ topicId: 'truyen' }] },
          roles: { create: [{ who: 'N', label: 'Người kể (tôi)', gender: 'm', pitchRange: 3, voiceId: VOICE.m3 }] },
          lines: {
            create: h.lines.map(([zh, v], k) => {
              const t = tokenize(zh);
              return { idx: k, who: 'N', zh, pinyin: t.pinyin, vi: v, tokens: t.tokens as object[] };
            }),
          },
          questions: {
            create: [{ idx: 0, kind: 'Nghe hiểu', prompt: h.q.q[0], promptVi: h.q.q[1], options: h.q.o.map(([zh, v]) => ({ zh, vi: v })), answer: h.q.a }],
          },
        },
      });
      await prisma.hoi.create({ data: { chapterId: chapter.id, idx: i + 1, title: h.title[1], titleZh: h.title[0], storyLessonId: lid } });
    }

    let idx = 0;
    for (const b of ch.bases) {
      for (const k of b.keys) {
        idx++;
        const id = wordId.get(k.zh);
        if (!id) throw new Error(`Từ khóa ${k.zh} chưa có trong từ điển`);
        const hint = (h: [string, string]) => ({ zh: h[0], vi: h[1] });
        const both = (h: [string, string]) => ({ '1': hint(h), '2': hint(h) });
        await prisma.keySlot.create({
          data: {
            chapterId: chapter.id, idx, wordId: id, clueTopicId: slug(b.clue.name),
            hintGeneral: hint(k.g),
            hint1: { zh: `它属于“${b.clue.zh}”这个主题。`, vi: `Nó thuộc chủ đề ${b.clue.vi}.` },
            hint2: both(k.h2), hint3: both(k.h3),
            lessons: { create: carrierText.filter((c) => c.text.includes(k.zh)).map((c) => ({ lessonId: c.id, hskGroup: c.level === 1 ? 1 : 2 })) },
          },
        });
      }
    }
  }

  // Bổ sung nghĩa cho từ trong MỌI bài (cả bài cũ) khi chạm vào từ; không đụng pinyin hay chữ.
  const enriched = await enrichTokens(prisma, vi);

  return {
    enrichedLines: enriched,
    dialogs: dialogs.length,
    storyLessons: storyIds.length,
    keys: CHAPTERS.reduce((n, c) => n + c.bases.length * 3, 0),
    newWords: toCreate.length,
  };
}

/** Điền nghĩa (`v`) còn thiếu cho token của mọi câu thoại, theo từ điển. Trả số câu đã cập nhật. */
export async function enrichTokens(prisma: PrismaClient, vi: Map<string, string>): Promise<number> {
  const lines = await prisma.lessonLine.findMany({ select: { lessonId: true, idx: true, tokens: true } });
  let n = 0;
  for (const l of lines) {
    const toks = l.tokens as unknown as Tok[];
    let changed = false;
    const next = toks.map((t) => {
      if (t.x || t.v) return t;
      const v = vi.get(t.t);
      if (!v) return t;
      changed = true;
      return { ...t, v };
    });
    if (changed) {
      await prisma.lessonLine.update({ where: { lessonId_idx: { lessonId: l.lessonId, idx: l.idx } }, data: { tokens: next as object[] } });
      n++;
    }
  }
  return n;
}
