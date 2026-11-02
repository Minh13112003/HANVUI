import { BadRequestException, ConflictException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { hskWords, lessonLabels, levelsOf } from '../common/hsk-levels.js';
import { makeTokenizer, renderPinyin, slug, VOICE, type Tok } from '../common/tokenize.js';
import { ObjectStorage } from '../media/object-storage.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { parseDraft, voicePlan, type LessonDraft } from './lesson-draft.js';
import { audioHash, TtsService } from './tts.service.js';

const EDITABLE = ['DIALOG', 'READING'] as const;
const voiceOf = (key: string) => VOICE[key];

/** Trang quản trị bài học (rule.md mục 8): hội thoại và bài đọc. Bài truyện của sự kiện không sửa ở đây. */
@Injectable()
export class AdminLessonsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tts: TtsService,
    private readonly storage: ObjectStorage,
  ) {}

  async list() {
    const rows = await this.prisma.lesson.findMany({
      where: { kind: { in: [...EDITABLE] } },
      include: { lines: { select: { audioKey: true } }, topics: { orderBy: { sort: 'asc' }, take: 1, include: { topic: true } }, _count: { select: { questions: true, keySlots: true } } },
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
    });
    return rows.map((r) => ({
      id: r.id,
      kind: r.kind,
      title: r.title,
      level: r.level,
      published: r.published,
      reviewed: r.reviewed,
      topic: r.topics[0]?.topic.name ?? null,
      lines: r.lines.length,
      audio: r.lines.filter((l) => l.audioKey).length,
      questions: r._count.questions,
      hasKeyword: r._count.keySlots > 0,
      updatedAt: r.updatedAt,
    }));
  }

  async detail(id: string) {
    const lesson = await this.findEditable(id);
    const missing = this.missingWords(lesson.lines.map((l) => l.tokens as unknown as Tok[]));
    return {
      id: lesson.id,
      kind: lesson.kind,
      title: lesson.title,
      situation: lesson.situation,
      level: lesson.level,
      tags: lesson.tags,
      topics: lesson.topics.map((t) => t.topicId),
      roles: lesson.roles.map((r) => ({ who: r.who, label: r.label, gender: r.gender, pitchRange: r.pitchRange, voiceId: r.voiceId })),
      lines: lesson.lines.map((l) => ({ who: l.who, zh: l.zh, vi: l.vi, pinyin: l.pinyin, tokens: l.tokens, audioKey: l.audioKey })),
      questions: lesson.questions.map((q) => ({ kind: q.kind, prompt: q.prompt, promptVi: q.promptVi, options: q.options, answer: q.answer })),
      published: lesson.published,
      reviewed: lesson.reviewed,
      hsk2: lesson.hsk2,
      hsk3: lesson.hsk3,
      hskShown: lesson.hskShown,
      keywords: lesson.keySlots.map((k) => k.slot.word.zh),
      missing,
      audioPending: lesson.kind === 'DIALOG' ? lesson.lines.filter((l) => !l.audioKey).length : 0,
      usage: await this.tts.usage(),
    };
  }

  /** Máy tự sinh pinyin, tách từ, lấy nghĩa, tính nhãn. Không ghi gì vào database. */
  async preview(raw: unknown) {
    const { draft, errors } = parseDraft(raw);
    errors.push(...(await this.topicErrors(draft)));
    const built = await this.build(draft);
    return {
      errors,
      lines: built.lines.map(({ who, zh, vi, pinyin, tokens }) => ({ who, zh, vi, pinyin, tokens })),
      missing: this.missingWords(built.lines.map((l) => l.tokens)),
      labels: built.labels,
    };
  }

  async create(raw: unknown) {
    const draft = await this.valid(raw);
    const built = await this.build(draft);
    const id = await this.freeId(draft.title);
    await this.prisma.$transaction(
      async (tx) => {
        await this.saveWords(tx, built.lines);
        await tx.lesson.create({
          data: {
            id,
            kind: draft.kind,
            title: draft.title,
            situation: draft.situation,
            tags: draft.tags,
            level: draft.level,
            ...built.labels,
            topics: { create: draft.topics.map((topicId, sort) => ({ topicId, sort })) },
            roles: { create: this.roleRows(draft) },
            lines: { create: built.lines.map((l, idx) => this.lineRow(l, idx, null)) },
            questions: { create: this.questionRows(draft) },
          },
        });
      },
      { timeout: 20_000 },
    );
    return { id };
  }

  /** Sửa bài. Câu không đổi chữ và giọng thì giữ file âm thanh; bài về trạng thái chưa duyệt. */
  async update(id: string, raw: unknown) {
    const lesson = await this.findEditable(id);
    const draft = await this.valid(raw);
    if (draft.kind !== lesson.kind) throw new BadRequestException('Không đổi được loại bài');
    const built = await this.build(draft);

    // Bài chứa từ khóa sự kiện phải giữ từ đó, nếu không người chơi sẽ không đoán được ô (event.service kiểm tra chữ trong bài).
    const text = draft.lines.map((l) => l.zh).join('');
    const lost = lesson.keySlots.map((k) => k.slot.word.zh).filter((zh) => !text.includes(zh));
    if (lost.length) throw new BadRequestException(`Bài này chứa từ khóa sự kiện, không được làm mất: ${lost.join(', ')}`);

    const oldAudio = new Map(lesson.lines.filter((l) => l.audioKey && l.audioHash).map((l) => [l.audioHash!, l.audioKey!]));
    const avatars = new Map(lesson.roles.map((r) => [r.who, r.avatarId]));
    await this.prisma.$transaction(
      async (tx) => {
        await this.saveWords(tx, built.lines);
        await tx.lessonTopic.deleteMany({ where: { lessonId: id } });
        await tx.lessonRole.deleteMany({ where: { lessonId: id } });
        await tx.lessonLine.deleteMany({ where: { lessonId: id } });
        await tx.lessonQuestion.deleteMany({ where: { lessonId: id } });
        await tx.lesson.update({
          where: { id },
          data: {
            title: draft.title,
            situation: draft.situation,
            tags: draft.tags,
            level: draft.level,
            reviewed: false,
            ...built.labels,
            topics: { create: draft.topics.map((topicId, sort) => ({ topicId, sort })) },
            roles: { create: this.roleRows(draft).map((r) => ({ ...r, avatarId: avatars.get(r.who) ?? null })) },
            lines: { create: built.lines.map((l, idx) => this.lineRow(l, idx, l.hash ? (oldAudio.get(l.hash) ?? null) : null)) },
            questions: { create: this.questionRows(draft) },
          },
        });
      },
      { timeout: 20_000 },
    );
    return { id };
  }

  async setPublished(id: string, published: boolean) {
    const lesson = await this.findEditable(id);
    if (!published && lesson.keySlots.length) throw new BadRequestException('Bài này chứa từ khóa sự kiện nên không ẩn được');
    if (published && (!lesson.lines.length || !lesson.questions.length)) throw new BadRequestException('Bài phải có câu và câu hỏi mới đăng được');
    await this.prisma.lesson.update({ where: { id }, data: { published } });
    return { published };
  }

  async setReviewed(id: string, reviewed: boolean) {
    await this.findEditable(id);
    await this.prisma.lesson.update({ where: { id }, data: { reviewed } });
    return { reviewed };
  }

  /**
   * Tạo âm thanh cho MỘT câu còn thiếu rồi trả về. Trình duyệt gọi lặp lại tới khi hết câu: máy chủ miễn phí có thể khởi động lại
   * bất cứ lúc nào, làm từng câu thì dừng giữa chừng không mất gì, bấm tạo tiếp là chạy phần còn lại.
   */
  async audioNext(id: string) {
    const lesson = await this.findEditable(id);
    if (lesson.kind !== 'DIALOG') throw new BadRequestException('Bài đọc không có âm thanh');
    if (!process.env.S3_BUCKET?.trim()) throw new ServiceUnavailableException('Máy chủ chưa cấu hình kho lưu âm thanh');
    const plan = voicePlan(lesson.roles, voiceOf);
    const hashOf = (l: { who: string; zh: string }) => {
      const v = plan.get(l.who);
      return v ? audioHash(l.zh, v.voice, v.pitch) : null;
    };
    const pending = lesson.lines.filter((l) => !l.audioKey);
    const line = pending[0];
    let made: number | null = null;
    if (line) {
      const v = plan.get(line.who);
      const hash = hashOf(line);
      if (!v || !hash) throw new BadRequestException(`Câu ${line.idx + 1} dùng vai chưa khai báo`);
      const body = await this.tts.synth(line.zh, v.voice, v.pitch);
      const key = `audio/${id}/${String(line.idx).padStart(2, '0')}-${v.voice}-${hash}.mp3`;
      await this.storage.put(key, body, 'audio/mpeg');
      await this.prisma.lessonLine.update({ where: { lessonId_idx: { lessonId: id, idx: line.idx } }, data: { audioKey: key, audioHash: hash } });
      made = line.idx;
    }
    return { made, total: lesson.lines.length, remaining: Math.max(0, pending.length - (line ? 1 : 0)), usage: await this.tts.usage() };
  }

  // ───────────── Phần dùng chung ─────────────

  private async findEditable(id: string) {
    const lesson = await this.prisma.lesson.findFirst({
      where: { id, kind: { in: [...EDITABLE] } },
      include: {
        topics: { orderBy: { sort: 'asc' } },
        roles: true,
        lines: { orderBy: { idx: 'asc' } },
        questions: { orderBy: { idx: 'asc' } },
        keySlots: { include: { slot: { include: { word: true } } } },
      },
    });
    if (!lesson) throw new NotFoundException('Không có bài này');
    return lesson;
  }

  private async valid(raw: unknown): Promise<LessonDraft> {
    const { draft, errors } = parseDraft(raw);
    errors.push(...(await this.topicErrors(draft)));
    if (errors.length) throw new BadRequestException(errors);
    return draft;
  }

  private async topicErrors(draft: LessonDraft) {
    const found = await this.prisma.topic.findMany({ where: { id: { in: draft.topics } }, select: { id: true } });
    const ok = new Set(found.map((t) => t.id));
    return draft.topics.filter((t) => !ok.has(t)).map((t) => `Không có chủ đề "${t}"`);
  }

  private async build(draft: LessonDraft) {
    const words = await this.prisma.word.findMany({ select: { zh: true, vi: true } });
    const vocab = new Set<string>([...hskWords(), ...words.map((w) => w.zh)]);
    const vi = new Map(words.filter((w) => w.vi).map((w) => [w.zh, w.vi]));
    const tokenize = makeTokenizer(vocab, vi);
    const plan = draft.kind === 'DIALOG' ? voicePlan(draft.roles, voiceOf) : null;
    const lines = draft.lines
      .filter((l) => l.zh)
      .map((l) => {
        const tokens = l.tokens ?? tokenize(l.zh).tokens;
        const v = plan?.get(l.who);
        return { who: l.who, zh: l.zh, vi: l.vi, tokens, pinyin: renderPinyin(tokens), hash: v ? audioHash(l.zh, v.voice, v.pitch) : null };
      });
    const { hsk2, hsk3, hskShown } = lessonLabels(draft.level || 1, lines.flatMap((l) => l.tokens.filter((t) => !t.x).map((t) => t.t)));
    return { lines, labels: { hsk2, hsk3, hskShown } };
  }

  /** Từ chưa có nghĩa, để quản trị viên điền. */
  private missingWords(lines: Tok[][]) {
    const out = new Map<string, string>();
    for (const t of lines.flat()) if (!t.x && !t.v && !out.has(t.t)) out.set(t.t, t.p ?? '');
    return [...out].map(([zh, pinyin]) => ({ zh, pinyin }));
  }

  /** Từ quản trị viên vừa điền nghĩa mà từ điển chưa có thì thêm vào, để chạm từ trong bài tra được. */
  private async saveWords(tx: Pick<PrismaService, 'word'>, lines: { tokens: Tok[] }[]) {
    const fresh = new Map<string, Tok>();
    for (const t of lines.flatMap((l) => l.tokens)) if (!t.x && t.v && t.p && !fresh.has(t.t)) fresh.set(t.t, t);
    if (!fresh.size) return;
    const known = await tx.word.findMany({ where: { zh: { in: [...fresh.keys()] } }, select: { zh: true } });
    known.forEach((w) => fresh.delete(w.zh));
    if (!fresh.size) return;
    await tx.word.createMany({
      data: [...fresh.values()].map((t) => {
        const l = levelsOf(t.t);
        return { zh: t.t, pinyin: t.p!, vi: t.v!, hsk2: l.hsk2, hsk3: l.hsk3, hsk2List: l.exact ? l.hsk2 : null };
      }),
      skipDuplicates: true,
    });
  }

  private roleRows(draft: LessonDraft) {
    return draft.roles.map((r) => ({ who: r.who, label: r.label, gender: r.gender, pitchRange: r.pitchRange, voiceId: r.voiceId ?? voiceOf(r.gender + r.pitchRange) }));
  }

  private lineRow(l: { who: string; zh: string; vi: string; tokens: Tok[]; pinyin: string; hash: string | null }, idx: number, audioKey: string | null) {
    return { idx, who: l.who, zh: l.zh, vi: l.vi, pinyin: l.pinyin, tokens: l.tokens as object[], audioKey, audioHash: audioKey ? l.hash : null };
  }

  private questionRows(draft: LessonDraft) {
    return draft.questions.map((q, idx) => ({
      idx,
      kind: q.kind ?? (draft.kind === 'READING' ? 'Đọc hiểu' : 'Nghe hiểu'),
      prompt: q.prompt,
      promptVi: q.promptVi,
      options: q.options,
      answer: q.answer,
    }));
  }

  private async freeId(title: string) {
    const base = slug(title).slice(0, 40).replace(/-$/, '') || 'bai';
    for (let n = 1; n <= 200; n++) {
      const id = n === 1 ? base : `${base}-${n}`;
      if (!(await this.prisma.lesson.findUnique({ where: { id }, select: { id: true } }))) return id;
    }
    throw new ConflictException('Có quá nhiều bài trùng tên, hãy đổi tên bài');
  }
}
