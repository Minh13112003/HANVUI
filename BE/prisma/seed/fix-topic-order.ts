// Ghi thứ tự chủ đề của bài (LessonTopic.sort): chủ đề đầu tiên trong dữ liệu nguồn là chủ đề CHÍNH (dùng cho biểu tượng chữ Hán).
// Bài đã nạp trước khi có cột `sort` đều mang 0 nên chủ đề hiện theo thứ tự chữ cái (Ăn uống trước Công việc…) — chạy script này để sửa.
// Chạy lại được. Chạy: pnpm db:fix-topic-order
import '../../src/config/dotenv.js';
import { readFileSync } from 'node:fs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../src/generated/prisma/client.js';
import { CHAPTERS } from './chapters.js';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
const json = (f: string) => JSON.parse(readFileSync(new URL(f, import.meta.url), 'utf8'));

try {
  const demo = json('./demo-data.json');
  const hsk3 = json('./hsk3-dialogs.json');
  const byBase = new Map<string, string[]>(Object.entries<{ topics?: string[] }>(demo.LMETA).map(([k, v]) => [k, v.topics ?? []]));
  for (const ch of CHAPTERS) for (const b of ch.bases) byBase.set(b.id, b.topics);
  const lessons = await prisma.lesson.findMany({ select: { id: true, topics: { select: { topicId: true, topic: { select: { name: true } } } } } });
  const hsk3Base = new Map<string, string>(hsk3.dialogs.map((l: { id: string; base: string }) => [l.id, l.base]));
  let n = 0;
  for (const l of lessons) {
    if (l.topics.length < 2) continue;
    const base = hsk3Base.get(l.id) ?? l.id;
    const names = byBase.get(base) ?? byBase.get(base.replace(/[23]$/, ''));
    if (!names) continue;
    for (const t of l.topics) {
      const i = names.indexOf(t.topic.name);
      if (i < 0) continue;
      await prisma.lessonTopic.update({ where: { lessonId_topicId: { lessonId: l.id, topicId: t.topicId } }, data: { sort: i } });
      n++;
    }
  }
  console.log(`Đã ghi thứ tự chủ đề cho ${n} liên kết.`);
} finally {
  await prisma.$disconnect();
}
