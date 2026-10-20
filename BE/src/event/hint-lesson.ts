import type { PrismaService } from '../prisma/prisma.service.js';

/** Bài được chỉ ra ở gợi ý 2 (rule.md 5.4): đúng một bài chứa từ khóa, hợp cấp người học. */
export interface HintLesson {
  id: string;
  title: string;
  level: number;
}

interface Row {
  hskGroup: number;
  lesson: { id: string; title: string; level: number };
}


/** Che phần tên bài trùng với từ khóa (chữ Hán hoặc nghĩa tiếng Việt) để tên bài không lộ đáp án. */
export function maskTitle(title: string, word: { zh: string; vi: string }): string {
  const vi = word.vi.split(/[,(]/)[0].trim();
  let out = title;
  for (const part of [word.zh, ...(vi.length > 1 ? [vi] : [])]) {
    const low = part.toLowerCase();
    for (let at = out.toLowerCase().indexOf(low); at >= 0; at = out.toLowerCase().indexOf(low)) {
      out = out.slice(0, at) + '…' + out.slice(at + part.length);
    }
  }
  return out;
}

/** Chọn một bài ổn định cho mỗi ô: ưu tiên đúng nhóm cấp, tên bài không chứa từ khóa, rồi theo mã bài. */
export function pickHintLesson(word: { zh: string; vi: string }, rows: Row[], group: number): HintLesson | null {
  const same = rows.filter((r) => r.hskGroup === group);
  const pool = same.length ? same : rows;
  if (!pool.length) return null;
  const leaks = (r: Row) => maskTitle(r.lesson.title, word) !== r.lesson.title;
  const best = [...pool].sort((a, b) => Number(leaks(a)) - Number(leaks(b)) || a.lesson.id.localeCompare(b.lesson.id))[0];
  return { id: best.lesson.id, title: maskTitle(best.lesson.title, word), level: best.lesson.level };
}

/** Các bài chứa từ khóa của mọi ô trong một truyện, gom theo ô. */
export async function slotLessons(prisma: PrismaService, storyId: string) {
  const rows = await prisma.keySlotLesson.findMany({
    where: { slot: { chapter: { storyId } } },
    select: { slotId: true, hskGroup: true, lesson: { select: { id: true, title: true, level: true } } },
  });
  const m = new Map<number, Row[]>();
  for (const r of rows) m.set(r.slotId, [...(m.get(r.slotId) ?? []), r]);
  return m;
}

/** Bài chỉ ra ở gợi ý 2 của một ô (dùng ngay sau khi người học mở gợi ý 2). */
export async function hintLessonOf(prisma: PrismaService, slotId: number, group: number): Promise<HintLesson | null> {
  const slot = await prisma.keySlot.findUnique({
    where: { id: slotId },
    select: { word: { select: { zh: true, vi: true } }, lessons: { select: { hskGroup: true, lesson: { select: { id: true, title: true, level: true } } } } },
  });
  return slot ? pickHintLesson(slot.word, slot.lessons, group) : null;
}
