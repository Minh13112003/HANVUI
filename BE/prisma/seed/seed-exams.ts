// Nạp đề nâng cấp HSK 2.0 (xem exams-data.ts). Chạy lại được: ghi đè nội dung đề theo mã, giữ lịch sử làm bài.
// Chạy: pnpm db:seed:exams   — sau đó tạo âm thanh câu nghe: pnpm audio:exams
import '../../src/config/dotenv.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../src/generated/prisma/client.js';
import type { StoredQuestion, StoredSection } from '../../src/exam/exam.service.js';
import { EXAMS, type Question } from './exams-data.js';
import { EXAMS3 } from './exams3-data.js';

if (process.env.NODE_ENV === 'production') throw new Error('Không seed trên production');

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

// HSK 2.0 cấp 1-2: 200 điểm, đạt 120 (60%); cấp 3-6: 300 điểm, đạt 180 (60%).
const scoring = (level: number) => (level <= 2 ? { max: 200, pass: 120 } : { max: 300, pass: 180 });

const store = (q: Question, id: string): StoredQuestion => {
  if (q.type === 'order') return { id, type: 'order', words: q.words, answer: q.answer };
  if (q.type === 'judge') return { id, type: 'judge', script: q.script, statement: q.statement, options: ['对', '错'], answer: q.answer };
  return { id, type: 'choice', script: q.script, prompt: q.prompt, options: q.options, answer: q.answer };
};

try {
  for (const e of [...EXAMS, ...EXAMS3]) {
    const id = `hsk2-l${e.level}-${e.idx}`;
    // Giữ âm thanh đã tạo nếu lời thoại không đổi.
    const old = await prisma.exam.findUnique({ where: { id } });
    const oldAudio = new Map<string, StoredQuestion>();
    ((old?.sections as unknown as StoredSection[]) ?? []).forEach((s) => s.questions.forEach((q) => oldAudio.set(q.id, q)));
    const keep = (q: StoredQuestion): StoredQuestion => {
      const o = oldAudio.get(q.id);
      const same = o?.script && q.script && JSON.stringify(o.script) === JSON.stringify(q.script);
      return same && o.audio ? { ...q, audio: o.audio } : q;
    };

    const sections: StoredSection[] = [
      { name: 'Nghe', kind: 'listening', questions: e.listening.map((q, i) => keep(store(q, `l${i + 1}`))) },
      { name: 'Đọc', kind: 'reading', questions: e.reading.map((q, i) => store(q, `r${i + 1}`)) },
      { name: 'Viết', kind: 'writing', questions: e.writing.map((q, i) => store(q, `w${i + 1}`)) },
    ];
    const data = {
      standard: 'HSK2' as const, level: e.level, idx: e.idx, title: e.title, durationMin: e.durationMin,
      maxScore: scoring(e.level).max, passScore: scoring(e.level).pass, sections: sections as object[], published: true,
    };
    await prisma.exam.upsert({ where: { id }, create: { id, ...data }, update: data });
    console.log(`✓ ${id}: ${sections.reduce((n, s) => n + s.questions.length, 0)} câu, ${e.durationMin} phút`);
  }
} finally {
  await prisma.$disconnect();
}
