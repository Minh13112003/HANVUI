import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { equivHsk2 } from '../common/hsk.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ALT_MEANINGS } from './alt-meanings.js';
import { hasPlainMeaning, shareMeaning, viCorrect, zhCorrect } from './grade.js';

export type Mode = 'zh2vi' | 'vi2zh' | 'audio';
export type ModeChoice = Mode | 'mix';

/** Các cấp có bộ từ kiểm tra (danh sách HSK 2.0; nội dung app hiện soạn tới HSK 3). */
export const SET_LEVELS = [1, 2, 3] as const;
export const MIN_HSK_COUNT = 20;
/** Mức gợi ý "sẵn sàng thi" (chỉ để tham khảo, không khóa đề — chủ dự án chốt 23/10/2026). */
export const READY = { vocab: 80, dialogs: 70, readings: 70 } as const;

interface Item {
  zh: string;
  mode: Mode;
}
interface Entry {
  zh: string;
  pinyin: string;
  vi: string;
  pos: string | null;
}

const shuffle = <T>(a: T[]): T[] => {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
};

const alt = (zh: string) => ALT_MEANINGS[zh] ?? [];

/**
 * Kiểm tra từ vựng tự luận (rule.md 3.3, đổi 23/10/2026): Hán → Việt, Việt → Hán, nghe → viết cả chữ Hán và nghĩa.
 * Nguồn: Sổ tay của người học hoặc bộ từ HSK 1-3. Chấm cứng ở máy chủ (grade.ts). Kết quả chỉ để tham khảo mức sẵn sàng.
 */
@Injectable()
export class VocabTestService {
  constructor(private readonly prisma: PrismaService) {}

  /** Bộ từ của một cấp: từ có đúng trong danh sách HSK 2.0 (Word.hsk2List). Gộp các dòng cùng chữ (đa âm). */
  private async setWords(level: number): Promise<Entry[]> {
    const rows = await this.prisma.word.findMany({
      where: { hsk2List: level },
      select: { zh: true, pinyin: true, vi: true, pos: true },
      orderBy: { id: 'asc' },
    });
    return merge(rows);
  }

  /** Nghĩa của các chữ cần chấm: từ điển + nghĩa người học tự lưu trong Sổ tay. */
  private async dictionary(userId: string, zhs: string[]): Promise<Map<string, Entry>> {
    const [words, mine] = await Promise.all([
      this.prisma.word.findMany({ where: { zh: { in: zhs } }, select: { zh: true, pinyin: true, vi: true, pos: true } }),
      this.prisma.userWord.findMany({ where: { userId, zh: { in: zhs } }, select: { zh: true, pinyin: true, vi: true, pos: true } }),
    ]);
    return new Map(merge([...words, ...mine]).map((e) => [e.zh, e]));
  }

  async overview(userId: string) {
    const me = await this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { hskLevel: true, hskStandard: true } });
    const current = equivHsk2(me.hskStandard, me.hskLevel);
    const [counts, notebook, readiness] = await Promise.all([
      Promise.all(SET_LEVELS.map((l) => this.prisma.word.findMany({ where: { hsk2List: l }, distinct: ['zh'], select: { zh: true } }))),
      this.prisma.userWord.count({ where: { userId, vi: { not: '' } } }),
      Promise.all(SET_LEVELS.map((l) => this.readiness(userId, l))),
    ]);
    return {
      currentLevel: current,
      notebook,
      minCount: MIN_HSK_COUNT,
      thresholds: READY,
      sets: SET_LEVELS.map((level, i) => ({ level, total: counts[i].length, best: readiness[i].vocab.best })),
      readiness,
    };
  }

  /** Mức sẵn sàng thi đề của cấp `level` (đạt đề cấp N thì lên N+1). Chỉ là gợi ý. */
  async readiness(userId: string, level: number) {
    const tests = await this.prisma.vocabTest.findMany({
      where: { userId, source: 'hsk', level, submittedAt: { not: null } },
      select: { pct: true, setSize: true, items: true, submittedAt: true },
    });
    let best: { pct: number; count: number; full: boolean; at: Date } | null = null;
    for (const t of tests) {
      const count = (t.items as unknown as Item[]).length;
      if (count < MIN_HSK_COUNT || t.pct === null) continue;
      const full = count >= t.setSize;
      // Ưu tiên bài làm toàn bộ bộ từ, rồi điểm cao hơn.
      if (!best || (full && !best.full) || (full === best.full && t.pct > best.pct)) best = { pct: t.pct, count, full, at: t.submittedAt! };
    }
    const lessonStats = async (kind: 'DIALOG' | 'READING') => {
      const where = { kind, level, published: true } as const;
      const [total, done] = await Promise.all([
        this.prisma.lesson.count({ where }),
        this.prisma.userLesson.count({ where: { userId, allDone: true, lesson: where } }),
      ]);
      return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
    };
    const [dialogs, readings] = await Promise.all([lessonStats('DIALOG'), lessonStats('READING')]);
    const checks = {
      vocab: (best?.pct ?? 0) >= READY.vocab,
      dialogs: dialogs.pct >= READY.dialogs,
      readings: readings.total === 0 || readings.pct >= READY.readings,
    };
    return { level, vocab: { best, need: READY.vocab }, dialogs: { ...dialogs, need: READY.dialogs }, readings: { ...readings, need: READY.readings }, checks, ready: checks.vocab && checks.dialogs && checks.readings };
  }

  async start(userId: string, dto: { source: 'hsk' | 'notebook'; level?: number; ids?: number[]; count: number; mode: ModeChoice }) {
    let pool: Entry[];
    let min = 1;
    if (dto.source === 'hsk') {
      if (!dto.level || !SET_LEVELS.includes(dto.level as 1)) throw new BadRequestException('Chỉ có bộ từ HSK 1-3');
      pool = await this.setWords(dto.level);
      min = MIN_HSK_COUNT;
    } else {
      const mine = await this.prisma.userWord.findMany({
        where: { userId, ...(dto.ids?.length ? { id: { in: dto.ids } } : {}) },
        select: { zh: true, pinyin: true, vi: true, pos: true },
      });
      const dict = await this.dictionary(userId, mine.map((w) => w.zh));
      // Từ chưa có nghĩa (đang chờ AI điền) thì chưa kiểm tra được.
      pool = mine.map((w) => dict.get(w.zh)!).filter((e) => e && (hasPlainMeaning(e.vi) || alt(e.zh).length));
    }
    if (!pool.length) throw new BadRequestException('Không có từ nào để kiểm tra');
    if (dto.count > pool.length) throw new BadRequestException(`Bộ này chỉ có ${pool.length} từ`);
    if (dto.count < Math.min(min, pool.length)) throw new BadRequestException(`Tối thiểu ${min} câu`);

    const picked = shuffle(pool).slice(0, dto.count);
    const modes: Mode[] = ['zh2vi', 'vi2zh', 'audio'];
    const items: Item[] = picked.map((e, i) => {
      let mode: Mode = dto.mode === 'mix' ? modes[i % 3] : dto.mode;
      // Trợ từ (了, 吗...) không có nghĩa tiếng Việt viết ra được: chỉ hỏi theo chiều Việt → Hán.
      if (mode !== 'vi2zh' && !hasPlainMeaning(e.vi) && !alt(e.zh).length) mode = 'vi2zh';
      return { zh: e.zh, mode };
    });
    const ordered = dto.mode === 'mix' ? shuffle(items) : items;
    const row = await this.prisma.vocabTest.create({
      data: { userId, source: dto.source, level: dto.source === 'hsk' ? dto.level : null, mode: dto.mode, items: ordered as object[], setSize: pool.length },
    });
    const byZh = new Map(picked.map((e) => [e.zh, e]));
    return {
      id: row.id,
      source: dto.source,
      level: row.level,
      setSize: pool.length,
      questions: ordered.map((it, i) => {
        const e = byZh.get(it.zh)!;
        if (it.mode === 'zh2vi') return { i, mode: it.mode, zh: e.zh, pinyin: e.pinyin };
        if (it.mode === 'vi2zh') return { i, mode: it.mode, vi: e.vi, pos: e.pos };
        return { i, mode: it.mode, zh: e.zh }; // nghe: FE không hiện chữ, chỉ dùng để phát âm
      }),
    };
  }

  async submit(userId: string, id: number, answers: { zh?: string; vi?: string }[]) {
    const t = await this.prisma.vocabTest.findUnique({ where: { id } });
    if (!t) throw new NotFoundException('Không tìm thấy bài kiểm tra');
    if (t.userId !== userId) throw new ForbiddenException();
    if (t.submittedAt) throw new BadRequestException('Bài này đã nộp');
    const items = t.items as unknown as Item[];
    const typedZh = answers.map((a) => a?.zh?.trim()).filter((z): z is string => !!z);
    const dict = await this.dictionary(userId, [...new Set([...items.map((x) => x.zh), ...typedZh])]);

    const detail = items.map((it, i) => {
      const e = dict.get(it.zh) ?? { zh: it.zh, pinyin: '', vi: '', pos: null };
      const a = answers[i] ?? {};
      const yourZh = (a.zh ?? '').trim();
      const yourVi = (a.vi ?? '').trim();
      let zhOk: boolean | null = null;
      let viOk: boolean | null = null;
      let accepted: string | null = null;
      if (it.mode === 'zh2vi') viOk = viCorrect(yourVi, e.vi, alt(e.zh));
      else if (it.mode === 'vi2zh') {
        zhOk = zhCorrect(yourZh, e.zh);
        // Đề cho tiếng Việt nên có thể có từ khác cùng nghĩa (会/能 "có thể"): nhận nếu từ đó có trong từ điển và chung nghĩa.
        const other = !zhOk && yourZh ? dict.get(yourZh) : undefined;
        if (other && other.zh !== e.zh && shareMeaning(e.vi, alt(e.zh), other.vi, alt(other.zh))) {
          zhOk = true;
          accepted = other.zh;
        }
      } else {
        zhOk = zhCorrect(yourZh, e.zh);
        viOk = viCorrect(yourVi, e.vi, alt(e.zh));
      }
      const score = it.mode === 'audio' ? (zhOk ? 0.5 : 0) + (viOk ? 0.5 : 0) : (zhOk ?? viOk) ? 1 : 0;
      return { i, mode: it.mode, zh: e.zh, pinyin: e.pinyin, vi: e.vi, also: alt(e.zh), yourZh, yourVi, zhOk, viOk, accepted, score };
    });
    const score = detail.reduce((s, d) => s + d.score, 0);
    const pct = Math.round((score / items.length) * 100);
    await this.prisma.vocabTest.update({ where: { id }, data: { submittedAt: new Date(), score, pct, detail: detail as object[] } });
    return {
      id,
      source: t.source,
      level: t.level,
      score,
      total: items.length,
      pct,
      full: items.length >= t.setSize,
      detail,
      readiness: t.source === 'hsk' && t.level ? await this.readiness(userId, t.level) : null,
    };
  }
}

/** Gộp các dòng cùng chữ Hán (từ đa âm, hoặc nghĩa ở từ điển và ở Sổ tay), nối nghĩa bằng dấu phẩy. */
function merge(rows: Entry[]): Entry[] {
  const by = new Map<string, Entry>();
  for (const r of rows) {
    const cur = by.get(r.zh);
    if (!cur) by.set(r.zh, { ...r });
    else if (r.vi && !cur.vi.includes(r.vi)) cur.vi = cur.vi ? `${cur.vi}, ${r.vi}` : r.vi;
  }
  return [...by.values()];
}
