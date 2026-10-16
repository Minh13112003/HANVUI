import { Injectable, NotFoundException } from '@nestjs/common';
import { fold } from '../common/text.js';
import { Clock, vnDay } from '../common/time.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { SaveWordDto } from './notebook.dto.js';

@Injectable()
export class NotebookService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clock: Clock,
  ) {}

  /**
   * Lưu từ hoặc cụm từ. Từ chưa có trong từ điển vẫn lưu, đánh dấu để AI điền nghĩa sau.
   * Chủ đề và cấp HSK lấy tự động từ bài nguồn.
   */
  async save(userId: string, dto: SaveWordDto) {
    const zh = dto.zh.trim();
    const now = this.clock.now();
    const dict = await this.prisma.word.findFirst({ where: { zh } });
    const lesson = dto.lessonId
      ? await this.prisma.lesson.findUnique({ where: { id: dto.lessonId }, include: { topics: { include: { topic: true } } } })
      : null;

    const data = {
      wordId: dict?.id ?? null,
      pinyin: dict?.pinyin ?? dto.pinyin ?? '',
      vi: dict?.vi ?? dto.vi ?? '',
      pos: dict?.pos ?? null,
      isPhrase: dto.isPhrase ?? dict?.phrase ?? Array.from(zh).length > 2,
      aiPending: !(dict?.vi || dto.vi),
      sourceLessonId: lesson?.id ?? null,
      topics: lesson?.topics.map((t) => t.topic.name) ?? [],
      hsk2: dict?.hsk2 ?? lesson?.hsk2 ?? null,
      hsk3: dict?.hsk3 ?? lesson?.hsk3 ?? null,
    };
    return this.prisma.userWord.upsert({
      where: { userId_zh: { userId, zh } },
      create: { userId, zh, savedAt: now, savedDay: vnDay(now).key, ...data },
      update: {}, // đã lưu thì giữ nguyên ngày lưu
    });
  }

  /** view=day: nhóm theo ngày lưu (mới nhất trước). view=topic: nhóm theo chủ đề; một từ nhiều chủ đề hiện ở nhiều nhóm. */
  async list(userId: string, view: 'day' | 'topic', q?: string) {
    const rows = await this.prisma.userWord.findMany({ where: { userId }, orderBy: { savedAt: 'desc' } });
    const needle = q ? fold(q.trim()) : '';
    const hit = rows.filter((r) => !needle || fold(`${r.zh} ${r.pinyin} ${r.vi}`).includes(needle));

    const groups = new Map<string, typeof hit>();
    const push = (k: string, r: (typeof hit)[number]) => groups.set(k, [...(groups.get(k) ?? []), r]);
    for (const r of hit) {
      if (view === 'day') push(r.savedDay, r);
      else if (r.topics.length) r.topics.forEach((t) => push(t, r));
      else push('Chưa có chủ đề', r);
    }
    const keys = [...groups.keys()].sort((a, b) => (view === 'day' ? (a < b ? 1 : -1) : a.localeCompare(b, 'vi')));
    return {
      total: hit.length,
      today: rows.filter((r) => r.savedDay === vnDay(this.clock.now()).key).length,
      groups: keys.map((k) => ({ key: k, count: groups.get(k)!.length, words: groups.get(k) })),
    };
  }

  async remove(userId: string, id: number) {
    const res = await this.prisma.userWord.deleteMany({ where: { id, userId } });
    if (!res.count) throw new NotFoundException('Không có từ này trong sổ tay');
  }
}
