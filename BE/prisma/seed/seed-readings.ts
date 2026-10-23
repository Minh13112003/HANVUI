// Nạp lại bài đọc (content/reading-hsk*.ts): bài đã có thì GIỮ mã bài nhưng thay toàn bộ câu và câu hỏi, bài mới thì thêm.
// Bài đọc không có âm thanh: xóa giọng người đọc (LessonRole) và audioKey của bài đọc. Tiến độ trả lời cũ của bài đọc được
// đặt lại (câu hỏi đã đổi). File âm thanh cũ trên R2 không bị xóa ở đây; dọn bằng `pnpm audio --prune` nếu muốn.
// Chạy: pnpm db:seed:readings   — sau đó: pnpm db:hsk (nhãn cấp).
import '../../src/config/dotenv.js';
import { readFileSync } from 'node:fs';
import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from '../../src/generated/prisma/client.js';
import { COMMON_WORDS } from './common-words.js';
import { enrichTokens, makeTokenizer } from './chapters.js';
import { READINGS } from './content/reading.js';

if (process.env.NODE_ENV === 'production') throw new Error('Không seed trên production');

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

try {
  const ids = READINGS.map((r) => r.id);
  if (new Set(ids).size !== ids.length) throw new Error('Mã bài đọc bị trùng');
  for (const r of READINGS) {
    if (r.sents.length < 10) throw new Error(`${r.id}: bài đọc quá ngắn (${r.sents.length} câu)`);
    for (const q of r.qs) if (q.a < 0 || q.a >= q.o.length) throw new Error(`${r.id}: đáp án câu hỏi ngoài phạm vi`);
  }

  const dbWords = await prisma.word.findMany({ select: { zh: true, vi: true } });
  const hskWords = Object.keys(JSON.parse(readFileSync(new URL('./hsk/hsk-levels.json', import.meta.url), 'utf8')));
  const vocab = new Set<string>([...hskWords, ...dbWords.map((w) => w.zh)]);
  const vi = new Map<string, string>(dbWords.filter((w) => w.vi).map((w) => [w.zh, w.vi]));
  for (const [zh, v] of COMMON_WORDS) {
    vocab.add(zh);
    if (!vi.has(zh)) vi.set(zh, v);
  }
  const tokenize = makeTokenizer(vocab, vi);

  await prisma.topic.upsert({
    where: { id: 'bai-doc' },
    create: { id: 'bai-doc', kind: 'SITUATION', name: 'Bài đọc', glyph: '读', sort: 99 },
    update: {},
  });

  const existing = new Set((await prisma.lesson.findMany({ where: { id: { in: ids } }, select: { id: true } })).map((l) => l.id));
  let updated = 0;
  let created = 0;
  for (const r of READINGS) {
    const lines = r.sents.map(([zh, v], i) => {
      const t = tokenize(zh);
      return { idx: i, who: 'N', zh, pinyin: t.pinyin, vi: v, tokens: t.tokens as object[] };
    });
    const questions = r.qs.map((q, i) => ({
      idx: i, kind: 'Đọc hiểu', prompt: q.q[0], promptVi: q.q[1], options: q.o.map(([zh, v]) => ({ zh, vi: v })), answer: q.a,
    }));
    if (existing.has(r.id)) {
      await prisma.$transaction([
        prisma.lessonLine.deleteMany({ where: { lessonId: r.id } }),
        prisma.lessonQuestion.deleteMany({ where: { lessonId: r.id } }),
        prisma.lessonRole.deleteMany({ where: { lessonId: r.id } }),
        prisma.lesson.update({
          where: { id: r.id },
          data: { kind: 'READING', title: r.title[1], situation: r.title[0], level: r.level, published: true, lines: { create: lines }, questions: { create: questions } },
        }),
        prisma.userLesson.updateMany({ where: { lessonId: r.id }, data: { answers: Prisma.DbNull, correct: 0, allDone: false, completedAt: null } }),
      ]);
      updated++;
    } else {
      await prisma.lesson.create({
        data: {
          id: r.id, kind: 'READING', title: r.title[1], situation: r.title[0], tags: ['bài đọc'], level: r.level, published: true,
          topics: { create: [{ topicId: 'bai-doc' }] },
          lines: { create: lines },
          questions: { create: questions },
        },
      });
      created++;
    }
  }
  const enriched = await enrichTokens(prisma, vi);
  const counts = [1, 2, 3].map((n) => `HSK ${n}: ${READINGS.filter((r) => r.level === n).length}`).join(', ');
  console.log(`Bài đọc: cập nhật ${updated}, thêm ${created} (${counts}); bổ sung nghĩa ${enriched} câu.`);
} finally {
  await prisma.$disconnect();
}
