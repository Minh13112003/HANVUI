// Nạp đề nâng cấp HSK 2.0 theo định dạng đề thật (prisma/seed/exams/hsk1|2|3.ts). Chạy lại được: ghi đè nội dung đề
// theo mã, giữ âm thanh câu nghe nếu lời thoại không đổi, giữ lịch sử làm bài. Đề cũ không còn trong danh sách thì ẩn đi
// (published = false), không xóa.
// Chạy: pnpm db:seed:exams   — sau đó tạo âm thanh câu nghe: pnpm audio:exams
import '../../src/config/dotenv.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { pinyin } from 'pinyin-pro';
import { PrismaClient } from '../../src/generated/prisma/client.js';
import type { StoredPart, StoredQuestion, StoredSection } from '../../src/exam/exam.service.js';
import type { Exam, Q } from './exams/kit.js';
import { HSK1 } from './exams/hsk1.js';
import { HSK2 } from './exams/hsk2.js';
import { HSK3 } from './exams/hsk3.js';

if (process.env.NODE_ENV === 'production') throw new Error('Không seed trên production');

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

/** Số câu từng phần của đề thật (HSK 2.0). */
const SHAPE: Record<number, number[]> = { 1: [20, 20], 2: [35, 25], 3: [40, 30, 10] };

const HAN = /\p{Script=Han}/u;
/** Pinyin từng âm tiết, bỏ dấu câu; ô trống "（　）" giữ thành "(   )". */
const py = (zh: string) =>
  zh
    .split('（　）')
    .map((part) => (pinyin(part, { toneType: 'symbol', type: 'array', nonZh: 'removed' }) as string[]).filter((t) => /\p{L}/u.test(t)).join(' '))
    .join(' (   ) ')
    .trim();

/** Kiểm tra một đề; lỗi thì dừng nạp. */
function check(e: Exam) {
  const where = `HSK ${e.level} số ${e.idx}`;
  const fail = (msg: string) => {
    throw new Error(`${where}: ${msg}`);
  };
  const counts = e.sections.map((s) => s.parts.reduce((n, p) => n + p.questions.length, 0));
  if (JSON.stringify(counts) !== JSON.stringify(SHAPE[e.level])) fail(`số câu ${counts.join('/')} khác đề thật ${SHAPE[e.level].join('/')}`);
  for (const s of e.sections) {
    for (const p of s.parts) {
      const used = new Set<number>();
      for (const q of p.questions) {
        const id = `${s.name} ${p.title}: ${'text' in q && q.text ? q.text : q.type}`;
        if (s.kind === 'listening' && !('script' in q && q.script?.length)) fail(`${id} thiếu lời thoại`);
        if (q.type === 'match') {
          if (!p.bank) fail(`${id} không có ngân hàng A–F`);
          if (q.answer < 0 || q.answer >= p.bank!.length) fail(`${id} đáp án ngoài ngân hàng`);
          if (used.has(q.answer)) fail(`${id} trùng đáp án với câu khác trong cùng phần`);
          used.add(q.answer);
        }
        if (q.type === 'choice' && (q.answer < 0 || q.answer >= q.options.length)) fail(`${id} đáp án ngoài lựa chọn`);
        if (q.type === 'order') {
          const letters = (x: string) => [...x.replace(/[\s，。？！]/g, '')].sort().join('');
          for (const a of q.answer) if (letters(a) !== letters(q.words.join(''))) fail(`câu sắp xếp "${a}" không dùng đúng các từ đã cho`);
        }
        if (q.type === 'fill' && !q.text.includes('（　）')) fail(`câu điền "${q.text}" thiếu chỗ trống （　）`);
      }
    }
  }
}

/** Pinyin cho mọi chuỗi chữ Hán hiển thị trong câu (đề HSK 1-2 in pinyin như đề thật). */
const pyOf = (strs: (string | undefined)[]) => {
  const out: Record<string, string> = {};
  for (const s of strs) if (s && HAN.test(s)) out[s] = py(s);
  return Object.keys(out).length ? out : undefined;
};

const store = (q: Q, id: string, withPy: boolean): StoredQuestion => {
  const base: StoredQuestion = { id, type: q.type, answer: q.answer };
  if (q.type === 'order') return { ...base, words: q.words };
  if (q.type === 'fill') return { ...base, text: q.text, pinyin: q.pinyin };
  // Câu nghe có câu hỏi: người dẫn đọc câu hỏi ở cuối đoạn như đề thật (màn hình chỉ hiện đáp án).
  const script = q.script && q.type === 'choice' && q.prompt ? [...q.script, { who: 'N' as const, zh: '问：' + q.prompt }] : q.script;
  const out: StoredQuestion = {
    ...base,
    ...(script ? { script } : {}),
    ...(q.text ? { text: q.text } : {}),
    ...(q.type === 'judge' && q.pic ? { pic: q.pic } : {}),
    ...(q.type === 'judge' && q.statement ? { statement: q.statement } : {}),
    ...(q.type === 'choice' ? { prompt: q.prompt, options: q.options, ...(q.pics ? { pics: true } : {}) } : {}),
  };
  if (q.type === 'judge') out.options = ['✓', '✗'];
  if (withPy) {
    const p = pyOf([out.text, out.statement, out.prompt, ...(out.pics ? [] : (out.options ?? []))]);
    if (p) out.py = p;
  }
  return out;
};

try {
  const all = [...HSK1, ...HSK2, ...HSK3];
  all.forEach(check);
  const ids: string[] = [];

  for (const e of all) {
    const id = `hsk2-l${e.level}-${e.idx}`;
    ids.push(id);
    const withPy = e.level <= 2;
    // Giữ âm thanh đã tạo nếu lời thoại không đổi.
    const old = await prisma.exam.findUnique({ where: { id } });
    const oldAudio = new Map<string, StoredQuestion>();
    ((old?.sections as unknown as StoredSection[]) ?? []).forEach((s) => s.questions.forEach((q) => oldAudio.set(q.id, q)));
    // Giữ âm thanh của từng dòng thoại không đổi (cùng vị trí, cùng vai, cùng chữ); dòng mới thì audio:exams tạo thêm.
    const keep = (q: StoredQuestion): StoredQuestion => {
      const o = oldAudio.get(q.id);
      if (!o?.audio?.length || !o.script || !q.script) return q;
      const audio: { who: string; key: string }[] = [];
      for (const [i, line] of q.script.entries()) {
        const was = o.script[i];
        if (!was || was.who !== line.who || was.zh !== line.zh || !o.audio[i]) break;
        audio.push(o.audio[i]);
      }
      return audio.length ? { ...q, audio } : q;
    };

    let n = 0;
    const sections: StoredSection[] = e.sections.map((s) => {
      const parts: StoredPart[] = [];
      const questions: StoredQuestion[] = [];
      for (const p of s.parts) {
        parts.push({
          title: p.title,
          guide: p.guide,
          count: p.questions.length,
          ...(p.bank ? { bank: p.bank } : {}),
          ...(p.pics ? { pics: true } : {}),
          ...(p.bank && !p.pics && withPy ? { bankPy: p.bank.map(py) } : {}),
        });
        for (const q of p.questions) questions.push(keep(store(q, `q${++n}`, withPy)));
      }
      return { name: s.name, kind: s.kind, max: s.max, parts, questions };
    });

    const data = {
      standard: 'HSK2' as const, level: e.level, idx: e.idx, title: e.title, durationMin: e.durationMin,
      maxScore: e.maxScore, passScore: e.passScore, sections: sections as object[], published: true,
    };
    await prisma.exam.upsert({ where: { id }, create: { id, ...data }, update: data });
    console.log(`✓ ${id}: ${n} câu, ${e.durationMin} phút, đạt ${e.passScore}/${e.maxScore}`);
  }

  const hidden = await prisma.exam.updateMany({ where: { standard: 'HSK2', id: { notIn: ids }, published: true }, data: { published: false } });
  if (hidden.count) console.log(`Ẩn ${hidden.count} đề cũ không còn trong danh sách (không xóa, giữ lịch sử làm bài).`);
} finally {
  await prisma.$disconnect();
}
