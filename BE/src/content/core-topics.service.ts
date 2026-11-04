import { Injectable, NotFoundException } from '@nestjs/common';
import { Clock, vnDay } from '../common/time.js';
import { PrismaService } from '../prisma/prisma.service.js';

/** Sổ từ cốt lõi theo chủ đề (rule.md mục 8): danh sách chỉ có chữ, pinyin, nghĩa; muốn xem đầy đủ thì lưu vào Sổ tay. */
@Injectable()
export class CoreTopicsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clock: Clock,
  ) {}

  async list(userId: string) {
    const topics = await this.prisma.coreTopic.findMany({ orderBy: { sort: 'asc' }, include: { words: { select: { word: { select: { zh: true } } } } } });
    const saved = new Set((await this.prisma.userWord.findMany({ where: { userId }, select: { zh: true } })).map((w) => w.zh));
    return topics.map((t) => ({
      id: t.id,
      name: t.name,
      glyph: t.glyph,
      intro: t.intro,
      total: t.words.length,
      saved: t.words.filter((w) => saved.has(w.word.zh)).length,
    }));
  }

  private async topic(id: string) {
    const t = await this.prisma.coreTopic.findUnique({
      where: { id },
      include: { words: { orderBy: { sort: 'asc' }, include: { word: true } } },
    });
    if (!t) throw new NotFoundException('Không có chủ đề này');
    return t;
  }

  async detail(userId: string, id: string) {
    const t = await this.topic(id);
    const saved = new Set(
      (await this.prisma.userWord.findMany({ where: { userId, zh: { in: t.words.map((w) => w.word.zh) } }, select: { zh: true } })).map((w) => w.zh),
    );
    return {
      id: t.id,
      name: t.name,
      glyph: t.glyph,
      intro: t.intro,
      words: t.words.map(({ word: w }) => ({ id: w.id, zh: w.zh, pinyin: w.pinyin, vi: w.vi, saved: saved.has(w.zh) })),
    };
  }

  /** Từ và câu ví dụ để luyện Nói theo chủ đề. */
  async speak(id: string) {
    const t = await this.topic(id);
    return { words: t.words.map(({ word: w }) => ({ id: w.id, zh: w.zh, pinyin: w.pinyin, vi: w.vi, pos: w.pos, example: w.example })) };
  }

  /** Lưu các từ đã chọn, hoặc cả chủ đề khi không chọn từ nào. Từ đã lưu thì giữ nguyên ngày lưu. */
  async save(userId: string, id: string, wordIds?: number[]) {
    const t = await this.topic(id);
    const picked = wordIds?.length ? t.words.filter((w) => wordIds.includes(w.wordId)) : t.words;
    const now = this.clock.now();
    const { count } = await this.prisma.userWord.createMany({
      data: picked.map(({ word: w }) => ({
        userId,
        zh: w.zh,
        wordId: w.id,
        pinyin: w.pinyin,
        vi: w.vi,
        pos: w.pos,
        isPhrase: w.phrase || [...w.zh].length > 2,
        aiPending: !w.vi,
        topics: [t.name],
        hsk2: w.hsk2,
        hsk3: w.hsk3,
        savedAt: now,
        savedDay: vnDay(now).key,
      })),
      skipDuplicates: true,
    });
    return { added: count, requested: picked.length };
  }
}
