import '../src/config/dotenv.js';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/app.setup.js';
import { Clock } from '../src/common/time.js';
import { loadEnv } from '../src/config/env.js';
import type { StoredSection } from '../src/exam/exam.service.js';
import { vnDate, WELCOME_CAMPAIGNS } from '../src/mailbox/campaigns.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

// Cần database thật đã seed (pnpm db:seed, db:seed:chapters, db:seed:exams). Tài khoản thử xóa ở cuối.
// Giả định .env có EVENT_OPEN_ALL=true và DEMO_STARTER_TOKENS=999 (bản demo).
const run = !!process.env.DATABASE_URL;

async function boot(clock?: Date) {
  let builder = Test.createTestingModule({ imports: [AppModule] });
  if (clock) builder = builder.overrideProvider(Clock).useValue({ now: () => new Date(clock) });
  const app = (await builder.compile()).createNestApplication();
  configureApp(app, loadEnv());
  await app.init();
  return app;
}

async function signup(app: INestApplication, tag: string) {
  const email = `e2e-${tag}-${Date.now()}-${Math.floor(Math.random() * 1e4)}@example.com`;
  const res = await request(app.getHttpServer())
    .post('/api/v1/auth/register')
    .send({ email, password: 'matkhau-e2e-123', displayName: tag })
    .expect(201);
  return { email, id: res.body.user.id as string, auth: { Authorization: `Bearer ${res.body.accessToken}` } };
}

describe.skipIf(!run)('Tài khoản mới, mở hết từ khóa, hộp thư, đề thi (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const made: string[] = [];
  const http = () => app.getHttpServer();

  beforeAll(async () => {
    app = await boot();
    prisma = app.get(PrismaService);
  });
  afterAll(async () => {
    await prisma.mail.deleteMany({ where: { OR: [{ toUserId: { in: made } }, { createdBy: { in: made } }] } });
    await prisma.user.deleteMany({ where: { id: { in: made } } });
    await app.close();
  });

  it('tạo tài khoản được tặng lượt gợi ý và có thư chào mừng', async () => {
    const u = await signup(app, 'starter');
    made.push(u.id);
    const ev = await request(http()).get('/api/v1/event').set(u.auth).expect(200);
    expect(ev.body.tokens).toBe(999);
    expect(ev.body.openAll).toBe(true);
    // mở hết 4 chương × 12 ô, không ô nào bị khóa
    expect(ev.body.chapters).toHaveLength(4);
    const cells = ev.body.chapters.flatMap((c: { cells: { status: string }[] }) => c.cells);
    expect(cells).toHaveLength(48);
    expect(cells.some((c: { status: string }) => c.status === 'locked')).toBe(false);
    // chưa giải ô nào thì không lộ từ khóa
    expect(JSON.stringify(ev.body)).not.toContain('衣服');

    const box = await request(http()).get('/api/v1/mailbox').set(u.auth).expect(200);
    const sys = box.body.items.find((m: { sender: string }) => m.sender === 'SYSTEM');
    expect(sys).toMatchObject({ hasReward: false, read: false });
    // thư theo dịp (20/10…) từ quản trị, có tên người đăng ký trong nội dung và quà nếu dịp có quà
    const today = vnDate(new Date());
    const active = WELCOME_CAMPAIGNS.filter((c) => today >= c.from && today <= c.until);
    const camp = box.body.items.filter((m: { sender: string }) => m.sender === 'ADMIN');
    expect(camp).toHaveLength(active.length);
    if (active.length) {
      const full = await request(http()).get(`/api/v1/mailbox/${camp[0].id}`).set(u.auth).expect(200);
      expect(full.body.subject).toBe(active[0].subject);
      expect(full.body.body).toContain('Chào starter,');
      expect(full.body.reward?.tokens ?? 0).toBe(active[0].reward?.tokens ?? 0);
    }
    expect(box.body.counts.unread).toBeGreaterThanOrEqual(1);
    const ledger = await prisma.tokenLedger.findFirst({ where: { userId: u.id, kind: 'STARTER' } });
    expect(ledger?.delta).toBe(999);
  });

  it('một hội thoại chứa nhiều từ khóa: đoán từng từ, chỉ cần đã mở gợi ý 1', async () => {
    const u = await signup(app, 'multikey');
    made.push(u.id);
    await request(http()).get('/api/v1/lessons/shop').set(u.auth).expect(200);
    const slots = await prisma.keySlot.findMany({ where: { word: { zh: { in: ['衣服', '颜色', '便宜'] } } }, include: { word: true } });
    expect(slots).toHaveLength(3);
    // chưa mở gợi ý: đoán đúng cũng tính sai
    const no = await request(http()).post('/api/v1/event/guess').set(u.auth).send({ lessonId: 'shop', answer: '衣服' }).expect(200);
    expect(no.body.correct).toBe(false);
    for (const s of slots) await request(http()).post(`/api/v1/event/slots/${s.id}/hint`).set(u.auth).expect(200);
    for (const zh of ['衣服', '颜色', '便宜']) {
      const r = await request(http()).post('/api/v1/event/guess').set(u.auth).send({ lessonId: 'shop', answer: zh }).expect(200);
      expect(r.body.correct, zh).toBe(true);
    }
    const ev = await request(http()).get('/api/v1/event').set(u.auth).expect(200);
    expect(ev.body.solved).toBe(3);
    expect(ev.body.tokens).toBe(999 - 3);
  });

  describe('hộp thư', () => {
    let admin: Awaited<ReturnType<typeof signup>>;
    let user: Awaited<ReturnType<typeof signup>>;

    beforeAll(async () => {
      user = await signup(app, 'mailuser');
      const a = await signup(app, 'mailadmin');
      made.push(user.id, a.id);
      // bỏ thư theo dịp (campaigns.ts) để các phép đếm bên dưới không phụ thuộc ngày chạy test
      await prisma.mail.deleteMany({ where: { toUserId: user.id, sender: 'ADMIN' } });
      await prisma.user.update({ where: { id: a.id }, data: { role: 'ADMIN' } });
      const login = await request(http()).post('/api/v1/auth/login').send({ email: a.email, password: 'matkhau-e2e-123' }).expect(200);
      admin = { ...a, auth: { Authorization: `Bearer ${login.body.accessToken}` } };
    });

    it('chỉ quản trị mới gửi được thư', async () => {
      await request(http()).post('/api/v1/admin/mails').set(user.auth).send({ subject: 'x', body: 'y' }).expect(403);
      await request(http()).get('/api/v1/admin/mails').set(user.auth).expect(403);
    });

    it('gửi thư có quà và không quà, lọc theo người gửi / có quà', async () => {
      await request(http())
        .post('/api/v1/admin/mails')
        .set(admin.auth)
        .send({ subject: 'Quà tặng', body: 'Tặng bạn 5 lượt gợi ý', rewardTokens: 5, toEmail: user.email })
        .expect(201);
      await request(http())
        .post('/api/v1/admin/mails')
        .set(admin.auth)
        .send({ subject: 'Thông báo bảo trì', body: 'Tối nay bảo trì', toEmail: user.email })
        .expect(201);

      const all = await request(http()).get('/api/v1/mailbox').set(user.auth).expect(200);
      expect(all.body.total).toBe(3); // chào mừng + 2 thư quản trị
      const fromAdmin = await request(http()).get('/api/v1/mailbox?sender=ADMIN').set(user.auth).expect(200);
      expect(fromAdmin.body.items.map((m: { subject: string }) => m.subject).sort()).toEqual(['Quà tặng', 'Thông báo bảo trì']);
      const rewarded = await request(http()).get('/api/v1/mailbox?reward=true').set(user.auth).expect(200);
      expect(rewarded.body.items).toHaveLength(1);
      expect(rewarded.body.items[0]).toMatchObject({ subject: 'Quà tặng', hasReward: true, claimable: true, claimed: false });
      const plain = await request(http()).get('/api/v1/mailbox?reward=false').set(user.auth).expect(200);
      expect(plain.body.items).toHaveLength(2);
      expect(plain.body.counts.unclaimed).toBe(1);
    });

    it('đọc thư, nhận quà một lần, không xóa được thư còn quà', async () => {
      const list = await request(http()).get('/api/v1/mailbox?reward=true').set(user.auth).expect(200);
      const id = list.body.items[0].id as number;
      const before = (await request(http()).get('/api/v1/event').set(user.auth).expect(200)).body.tokens as number;

      await request(http()).delete(`/api/v1/mailbox/${id}`).set(user.auth).expect(400); // còn quà chưa nhận
      const read = await request(http()).get(`/api/v1/mailbox/${id}`).set(user.auth).expect(200);
      expect(read.body.body).toContain('5 lượt');
      expect(read.body.read).toBe(true);

      const claim = await request(http()).post(`/api/v1/mailbox/${id}/claim`).set(user.auth).expect(200);
      expect(claim.body.reward.tokens).toBe(5);
      expect((await request(http()).get('/api/v1/event').set(user.auth).expect(200)).body.tokens).toBe(before + 5);
      await request(http()).post(`/api/v1/mailbox/${id}/claim`).set(user.auth).expect(400); // đã nhận rồi

      await request(http()).delete(`/api/v1/mailbox/${id}`).set(user.auth).expect(204);
      await request(http()).get(`/api/v1/mailbox/${id}`).set(user.auth).expect(404);
    });

    it('thư không có quà thì không nhận được; đánh dấu đã đọc hết', async () => {
      const list = await request(http()).get('/api/v1/mailbox?reward=false&unread=true').set(user.auth).expect(200);
      await request(http()).post(`/api/v1/mailbox/${list.body.items[0].id}/claim`).set(user.auth).expect(400);
      const r = await request(http()).post('/api/v1/mailbox/read-all').set(user.auth).expect(200);
      expect(r.body.marked).toBeGreaterThanOrEqual(1);
      expect((await request(http()).get('/api/v1/mailbox/counts').set(user.auth).expect(200)).body.unread).toBe(0);
    });

    it('người khác không đọc được thư của mình', async () => {
      const other = await signup(app, 'nosy');
      made.push(other.id);
      const mine = await request(http()).get('/api/v1/mailbox').set(user.auth).expect(200);
      await request(http()).get(`/api/v1/mailbox/${mine.body.items[0].id}`).set(other.auth).expect(404);
    });

    it('quản trị xem được thống kê thư đã gửi', async () => {
      const sent = await request(http()).get('/api/v1/admin/mails').set(admin.auth).expect(200);
      const gift = sent.body.find((m: { subject: string }) => m.subject === 'Quà tặng');
      expect(gift).toMatchObject({ audience: 'one', rewardTokens: 5, claimed: 1 });
    });
  });

  describe('đề nâng cấp', () => {
    let u: Awaited<ReturnType<typeof signup>>;
    beforeAll(async () => {
      u = await signup(app, 'exam');
      made.push(u.id);
    });

    it('danh sách cấp có đề', async () => {
      const r = await request(http()).get('/api/v1/exams').set(u.auth).expect(200);
      expect(r.body.levels.map((l: { level: number }) => l.level)).toEqual([1, 2, 3]);
      expect(r.body.levels[0]).toMatchObject({ exams: 3, maxScore: 200, passScore: 120 });
    });

    it('đề gửi cho người học không lộ đáp án', async () => {
      const r = await request(http()).post('/api/v1/exams/start').set(u.auth).send({ level: 1 }).expect(200);
      expect(JSON.stringify(r.body)).not.toContain('"answer"');
      expect(r.body.exam.sections.map((s: { kind: string }) => s.kind)).toEqual(['listening', 'reading', 'writing']);
      expect(r.body.exam.pointsPerQuestion).toBe(10);
      // chưa có âm thanh thì kèm lời thoại để FE tạm đọc
      const q = r.body.exam.sections[0].questions[0];
      expect(q.audio !== null || Array.isArray(q.script)).toBe(true);
    });

    it('nộp toàn sai: 0 điểm, không lên cấp', async () => {
      const s = await request(http()).post('/api/v1/exams/start').set(u.auth).send({ level: 1 }).expect(200);
      const r = await request(http()).post(`/api/v1/exams/attempts/${s.body.attemptId}/submit`).set(u.auth).send({ answers: {} }).expect(200);
      expect(r.body).toMatchObject({ score: 0, passed: false, leveledUp: false, newLevel: 1 });
    });

    it('làm đúng hết: 200 điểm, đạt và lên cấp; thi lại cấp cũ không lên nữa', async () => {
      const answerKey = async (examId: string) => {
        const exam = await prisma.exam.findUniqueOrThrow({ where: { id: examId } });
        const out: Record<string, number | string[]> = {};
        (exam.sections as unknown as StoredSection[]).forEach((s) => s.questions.forEach((q) => (out[q.id] = q.type === 'order' ? [(q.answer as string[])[0]] : (q.answer as number))));
        return out;
      };
      const s = await request(http()).post('/api/v1/exams/start').set(u.auth).send({ level: 1 }).expect(200);
      const att = await prisma.examAttempt.findUniqueOrThrow({ where: { id: s.body.attemptId } });
      const r = await request(http())
        .post(`/api/v1/exams/attempts/${s.body.attemptId}/submit`)
        .set(u.auth)
        .send({ answers: await answerKey(att.examId) })
        .expect(200);
      expect(r.body).toMatchObject({ score: 200, passed: true, leveledUp: true, newLevel: 2, correct: 20, total: 20 });
      await request(http()).post(`/api/v1/exams/attempts/${s.body.attemptId}/submit`).set(u.auth).send({ answers: {} }).expect(400); // đã nộp

      const me = await request(http()).get('/api/v1/auth/me').set(u.auth).expect(200);
      expect(me.body.hskLevel).toBe(2);

      const again = await request(http()).post('/api/v1/exams/start').set(u.auth).send({ level: 1 }).expect(200);
      const att2 = await prisma.examAttempt.findUniqueOrThrow({ where: { id: again.body.attemptId } });
      const r2 = await request(http())
        .post(`/api/v1/exams/attempts/${again.body.attemptId}/submit`)
        .set(u.auth)
        .send({ answers: await answerKey(att2.examId) })
        .expect(200);
      expect(r2.body).toMatchObject({ passed: true, leveledUp: false, newLevel: 2 });

      const hist = await request(http()).get('/api/v1/exams/attempts').set(u.auth).expect(200);
      expect(hist.body.length).toBeGreaterThanOrEqual(3);
      const review = await request(http()).get(`/api/v1/exams/attempts/${s.body.attemptId}`).set(u.auth).expect(200);
      expect(review.body.sections[0].questions[0]).toHaveProperty('answer');
    });

    it('câu sắp xếp chấp nhận nhiều cách đúng, bỏ qua dấu cách', async () => {
      const exam = await prisma.exam.findUniqueOrThrow({ where: { id: 'hsk2-l1-1' } });
      const q = (exam.sections as unknown as StoredSection[])[2].questions.find((x) => (x.answer as string[]).length > 1)!;
      const alt = (q.answer as string[])[1];
      const s = await request(http()).post('/api/v1/exams/start').set(u.auth).send({ level: 1 }).expect(200);
      const att = await prisma.examAttempt.findUniqueOrThrow({ where: { id: s.body.attemptId } });
      // ép đúng đề cần thử
      await prisma.examAttempt.update({ where: { id: att.id }, data: { examId: 'hsk2-l1-1' } });
      const r = await request(http()).post(`/api/v1/exams/attempts/${att.id}/submit`).set(u.auth).send({ answers: { [q.id]: Array.from(alt).join(' ') } }).expect(200);
      expect(r.body.correct).toBe(1);
    });

    it('nộp quá giờ thì không tính', async () => {
      const s = await request(http()).post('/api/v1/exams/start').set(u.auth).send({ level: 2 }).expect(200);
      await prisma.examAttempt.update({ where: { id: s.body.attemptId }, data: { startedAt: new Date(Date.now() - 3 * 3600_000) } });
      await request(http()).post(`/api/v1/exams/attempts/${s.body.attemptId}/submit`).set(u.auth).send({ answers: {} }).expect(400);
      const row = await prisma.examAttempt.findUniqueOrThrow({ where: { id: s.body.attemptId } });
      expect(row).toMatchObject({ score: 0, passed: false });
    });

    it('cấp không hợp lệ bị từ chối', async () => {
      await request(http()).post('/api/v1/exams/start').set(u.auth).send({ level: 9 }).expect(400);
    });
  });

  describe('bài khóa theo cấp, gợi ý từ vựng, Đọc và Viết', () => {
    let S: Awaited<ReturnType<typeof signup>>;
    beforeAll(async () => {
      S = await signup(app, 'ladder'); // một tài khoản dùng chung (đăng ký bị giới hạn 10 lần/phút)
      made.push(S.id);
    });

    it('bài cấp cao hơn bị khóa, bài chứa từ khóa sự kiện thì không', async () => {
      const u = S;
      const list = await request(http()).get('/api/v1/lessons?level=2').set(u.auth).expect(200);
      const byId = new Map<string, { locked: boolean }>(list.body.map((l: { id: string; locked: boolean }) => [l.id, l]));
      expect(byId.get('work-time')?.locked).toBe(true);
      expect(byId.get('intro-friend')?.locked).toBe(true);
      expect(byId.get('cafe2')?.locked).toBe(false); // chứa từ khóa sự kiện nên không khóa
      const res = await request(http()).get('/api/v1/lessons/work-time').set(u.auth).expect(403);
      expect(res.body.message).toContain('HSK 2');
      await request(http()).post('/api/v1/lessons/work-time/skip').set(u.auth).expect(403);
      // bài HSK 1 mới mở bình thường
      await request(http()).get('/api/v1/lessons/intro-name').set(u.auth).expect(200);
      // lên HSK 2 thì mở khóa
      await prisma.user.update({ where: { id: u.id }, data: { hskLevel: 2 } });
      await request(http()).get('/api/v1/lessons/work-time').set(u.auth).expect(200);
      await prisma.user.update({ where: { id: u.id }, data: { hskLevel: 1 } });
    });

    it('gợi ý từ chỉ có sau khi xem lời thoại, và tiến độ từ vựng hợp lý', async () => {
      const u = S;
      await request(http()).get('/api/v1/lessons/intro-name').set(u.auth).expect(200);
      await request(http()).get('/api/v1/lessons/intro-name/suggest-words').set(u.auth).expect(403);
      await request(http()).post('/api/v1/lessons/intro-name/skip').set(u.auth).expect(200);
      const r = await request(http()).get('/api/v1/lessons/intro-name/suggest-words').set(u.auth).expect(200);
      expect(Array.isArray(r.body.words)).toBe(true);
      expect(r.body.words.length).toBeLessThanOrEqual(8);
      expect(r.body.progress).toMatchObject({ level: 1, nextLevel: 2, target: 300 });
      const first = r.body.words[0];
      if (first) {
        await request(http()).post('/api/v1/notebook').set(u.auth).send({ zh: first.zh, lessonId: 'intro-name' }).expect(201);
        const again = await request(http()).get('/api/v1/lessons/intro-name/suggest-words').set(u.auth).expect(200);
        expect(again.body.words.some((w: { zh: string }) => w.zh === first.zh)).toBe(false);
      }
      const p = await request(http()).get('/api/v1/vocab/progress').set(u.auth).expect(200);
      expect(p.body.percent).toBeGreaterThanOrEqual(0);
    });

    it('tra từ cho biết đã lưu chưa, lưu rồi bỏ khỏi sổ tay được; có bảng âm thanh từ', async () => {
      const u = S;
      const before = await request(http()).get('/api/v1/words/lookup?zh=' + encodeURIComponent('喜欢')).set(u.auth).expect(200);
      expect(before.body.vi).toBeTruthy();
      expect(before.body.savedId).toBeNull();
      const saved = await request(http()).post('/api/v1/notebook').set(u.auth).send({ zh: '喜欢' }).expect(201);
      const mid = await request(http()).get('/api/v1/words/lookup?zh=' + encodeURIComponent('喜欢')).set(u.auth).expect(200);
      expect(mid.body.savedId).toBe(saved.body.id);
      await request(http()).delete('/api/v1/notebook/' + saved.body.id).set(u.auth).expect(204);
      const after = await request(http()).get('/api/v1/words/lookup?zh=' + encodeURIComponent('喜欢')).set(u.auth).expect(200);
      expect(after.body.savedId).toBeNull();
      const map = await request(http()).get('/api/v1/words/audio').set(u.auth).expect(200);
      expect(typeof map.body).toBe('object');
    });

    it('có 4 đề HSK 3 (24 câu, 300 điểm, đạt 180) và bài HSK 3 khóa với người HSK 1', async () => {
      const u = S;
      const ex = await request(http()).get('/api/v1/exams').set(u.auth).expect(200);
      const l3 = ex.body.levels.find((l: { level: number }) => l.level === 3);
      expect(l3).toMatchObject({ exams: 4, maxScore: 300, passScore: 180, durationMin: 90 });
      const st = await request(http()).post('/api/v1/exams/start').set(u.auth).send({ level: 3 }).expect(200);
      const total = st.body.exam.sections.reduce((n: number, s2: { questions: unknown[] }) => n + s2.questions.length, 0);
      expect(total).toBe(24);
      expect(JSON.stringify(st.body)).not.toContain('"answer"');
      await request(http()).get('/api/v1/lessons/study-score').set(u.auth).expect(403);
      await request(http()).get('/api/v1/lessons/doc3-chunjie').set(u.auth).expect(403);
      const topics = await request(http()).get('/api/v1/topics?kind=VOCAB').set(u.auth).expect(200);
      expect(topics.body.some((t: { id: string }) => t.id === 'hsk3-hoc-tap')).toBe(true);
    });

    it('ngữ pháp: danh sách có khóa theo cấp, chi tiết có ví dụ và bài luyện không lộ đáp án', async () => {
      const u = S;
      const list = await request(http()).get('/api/v1/grammar').set(u.auth).expect(200);
      expect(list.body.points.length).toBeGreaterThanOrEqual(58);
      // độ phù hợp theo cấp người học (HSK 1): đúng cấp / cấp kế / còn xa, và gợi ý chỉ lấy điểm đã mở khóa
      const fit = new Map<string, string>(list.body.points.map((p: { slug: string; fit: string }) => [p.slug, p.fit]));
      expect(fit.get('ma-ne')).toBe('match');
      expect(fit.get('le')).toBe('next');
      expect(fit.get('ruguo')).toBe('far');
      const rec = list.body.points.filter((p: { recommended: boolean }) => p.recommended);
      expect(rec.length).toBeGreaterThan(0);
      expect(rec.every((p: { locked: boolean; level: number }) => !p.locked && p.level === 1)).toBe(true);
      expect(list.body.levels.find((l: { level: number }) => l.level === 4)).toMatchObject({ locked: true });
      expect(list.body.readyForExam).toBe(false);
      const cats = new Set(list.body.points.map((p: { category: string }) => p.category));
      for (const c of ['Câu điều kiện', 'Mệnh đề quan hệ', 'Câu ước muốn', 'Câu tường thuật']) expect(cats.has(c)).toBe(true);
      const bySlug = new Map<string, { locked: boolean; level: number }>(list.body.points.map((p: { slug: string; locked: boolean; level: number }) => [p.slug, p]));
      expect(bySlug.get('ma-ne')?.locked).toBe(false);
      expect(bySlug.get('le')?.locked).toBe(true);
      await request(http()).get('/api/v1/grammar/le').set(u.auth).expect(403);

      const d = await request(http()).get('/api/v1/grammar/ma-ne').set(u.auth).expect(200);
      expect(d.body.examples).toHaveLength(3);
      expect(d.body.examples[0].pinyin).toContain('nǐ');
      expect(d.body.practice).toHaveLength(5); // 4 bài + 1 bài tìm câu sai
      expect(JSON.stringify(d.body.practice)).not.toContain('"answer"');
      // làm một bài luyện của ngữ pháp bằng API chấm chung
      const fill = d.body.practice.find((x: { type: string }) => x.type === 'FILL');
      const row = await prisma.writingItem.findUniqueOrThrow({ where: { id: fill.id } });
      const ok = await request(http()).post('/api/v1/writing/check').set(u.auth).send({ itemId: fill.id, answer: (row.data as { answer: string }).answer }).expect(200);
      expect(ok.body.correct).toBe(true);
      const after = await request(http()).get('/api/v1/grammar').set(u.auth).expect(200);
      expect(after.body.points.find((p: { slug: string }) => p.slug === 'ma-ne').practice).toMatchObject({ total: 5, done: 1, correct: 1 });
    });

    it('mã quà: sai mã 404, đúng mã +999 lượt, dùng lại 400', async () => {
      const u = S;
      await request(http()).post('/api/v1/redeem').set(u.auth).send({ code: 'SAIMA123' }).expect(404);
      const before = (await request(http()).get('/api/v1/event').set(u.auth).expect(200)).body.tokens as number;
      const ok = await request(http()).post('/api/v1/redeem').set(u.auth).send({ code: ' hv999 luot ' }).expect(200);
      expect(ok.body.tokens).toBe(999);
      expect((await request(http()).get('/api/v1/event').set(u.auth).expect(200)).body.tokens).toBe(before + 999);
      await request(http()).post('/api/v1/redeem').set(u.auth).send({ code: 'HV999LUOT' }).expect(400);
    });

    it('bài đọc hiện chữ ngay, HSK 2 bị khóa với người HSK 1, trả lời xong có bản dịch', async () => {
      const u = S;
      const list = await request(http()).get('/api/v1/lessons?level=1&kind=READING').set(u.auth).expect(200);
      expect(list.body.length).toBeGreaterThanOrEqual(6);
      expect(list.body.every((l: { locked: boolean }) => !l.locked)).toBe(true);
      const l2 = await request(http()).get('/api/v1/lessons?level=2&kind=READING').set(u.auth).expect(200);
      expect(l2.body.every((l: { locked: boolean }) => l.locked)).toBe(true);
      await request(http()).get('/api/v1/lessons/doc-bing').set(u.auth).expect(403);
      // hội thoại không lẫn bài đọc
      const dlg = await request(http()).get('/api/v1/lessons?level=1').set(u.auth).expect(200);
      expect(dlg.body.some((l: { id: string }) => l.id === 'doc-ngay')).toBe(false);

      const one = await request(http()).get('/api/v1/lessons/doc-ngay').set(u.auth).expect(200);
      expect(one.body.kind).toBe('READING');
      expect(one.body.lines[0].zh).toBeTruthy(); // chữ hiện ngay
      expect(one.body.questions[0].promptVi).toBeUndefined(); // bản dịch câu hỏi chỉ sau khi trả lời
      const done = await request(http()).post('/api/v1/lessons/doc-ngay/answers').set(u.auth).send({ answers: [0, 0] }).expect(200);
      expect(done.body.correct).toBe(2);
      expect(done.body.mission).toBeNull(); // đọc không tính nhiệm vụ nghe
    });

    it('bài tập viết: đáp án không lộ, chấm đúng/sai, khóa theo cấp', async () => {
      const u = S;
      const g = await request(http()).get('/api/v1/writing?type=ORDER&count=3').set(u.auth).expect(200);
      expect(g.body.items).toHaveLength(3);
      expect(g.body.lockedCount).toBeGreaterThan(0);
      expect(JSON.stringify(g.body)).not.toContain('"answer"');
      const item = g.body.items[0];
      expect(item.level).toBe(1);
      const row = await prisma.writingItem.findUniqueOrThrow({ where: { id: item.id } });
      const parts = (row.data as { parts: string[] }).parts;
      const bad = await request(http()).post('/api/v1/writing/check').set(u.auth).send({ itemId: item.id, answer: [...parts].reverse() }).expect(200);
      expect(bad.body.correct).toBe(false);
      expect(bad.body.answer).toBe(parts.join(''));
      const ok = await request(http()).post('/api/v1/writing/check').set(u.auth).send({ itemId: item.id, answer: parts }).expect(200);
      expect(ok.body.correct).toBe(true);

      const fill = await request(http()).get('/api/v1/writing?type=FILL&count=1').set(u.auth).expect(200);
      const fr = await prisma.writingItem.findUniqueOrThrow({ where: { id: fill.body.items[0].id } });
      const good = await request(http()).post('/api/v1/writing/check').set(u.auth).send({ itemId: fr.id, answer: (fr.data as { answer: string }).answer }).expect(200);
      expect(good.body.correct).toBe(true);
      // bài HSK 2 chưa mở với người HSK 1
      const hi = await prisma.writingItem.findFirstOrThrow({ where: { level: 2 } });
      await request(http()).post('/api/v1/writing/check').set(u.auth).send({ itemId: hi.id, answer: 'x' }).expect(400);
      const st = await request(http()).get('/api/v1/writing/stats').set(u.auth).expect(200);
      expect(st.body.done).toBeGreaterThanOrEqual(2);
    });

  it('người dùng HSK 3.0 cấp 1 được tính tương đương HSK 2.0 cấp 2', async () => {
    const u = S;
    await request(http()).patch('/api/v1/auth/me').set(u.auth).send({ hskStandard: 'HSK3', hskLevel: 1 }).expect(200);
    await request(http()).get('/api/v1/lessons/work-time').set(u.auth).expect(200);
    const ex = await request(http()).get('/api/v1/exams').set(u.auth).expect(200);
    expect(ex.body.currentLevel).toBe(2);
  });
  });

  it('kho lưu trữ chưa mở khi sự kiện còn diễn ra', async () => {
    const u = await signup(app, 'early');
    made.push(u.id);
    const list = await request(http()).get('/api/v1/event/archive').set(u.auth).expect(200);
    expect(list.body.stories.every((s: { month: string }) => s.month < '2026-10' || s.month < new Date().toISOString().slice(0, 7))).toBe(true);
    await request(http()).get('/api/v1/event/archive/2026-10').set(u.auth).expect(400);
  });
});

describe.skipIf(!run)('Kho lưu trữ sau khi sự kiện kết thúc (e2e, giả đồng hồ sang 05/11/2026)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let id: string;
  let auth: { Authorization: string };
  const http = () => app.getHttpServer();

  beforeAll(async () => {
    app = await boot(new Date('2026-11-05T05:00:00Z'));
    prisma = app.get(PrismaService);
    const u = await signup(app, 'archive');
    id = u.id;
    auth = u.auth;
  });
  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id } });
    await app.close();
  });

  it('truyện tháng 10 vào kho: mọi hồi đọc được, từ khóa chưa giải vẫn ẩn', async () => {
    const list = await request(http()).get('/api/v1/event/archive').set(auth).expect(200);
    const s = list.body.stories.find((x: { month: string }) => x.month === '2026-10');
    expect(s).toMatchObject({ explored: 0, total: 48 });

    const st = await request(http()).get('/api/v1/event/archive/2026-10').set(auth).expect(200);
    expect(st.body.chapters).toHaveLength(4);
    expect(st.body.chapters[3].hoi.every((h: { lessonId: string | null }) => !!h.lessonId)).toBe(true);
    expect(JSON.stringify(st.body)).not.toContain('衣服');
    // đọc được hồi cuối dù chưa giải ô nào
    await request(http()).get('/api/v1/lessons/story-4-4').set(auth).expect(200);
    // tháng chưa có truyện thì không có kho
    await request(http()).get('/api/v1/event/archive/2026-11').set(auth).expect(404);
  });

  it('luyện tập: mở gợi ý bằng lượt luyện tập, đoán đúng thì lộ từ (không tự vào sổ tay), không có điểm', async () => {
    const slot = await prisma.keySlot.findFirstOrThrow({ where: { word: { zh: '医生' } } });
    // chưa mở gợi ý 1: đoán đúng cũng sai
    await request(http()).get('/api/v1/lessons/doctor').set(auth).expect(200);
    const no = await request(http()).post('/api/v1/event/archive/guess').set(auth).send({ lessonId: 'doctor', answer: '医生' }).expect(200);
    expect(no.body.correct).toBe(false);

    const before = (await request(http()).get('/api/v1/event/archive').set(auth).expect(200)).body.practiceTokens as number;
    const h = await request(http()).post(`/api/v1/event/archive/slots/${slot.id}/hint`).set(auth).expect(200);
    expect(h.body.hintNo).toBe(1);
    expect((await request(http()).get('/api/v1/event/archive').set(auth).expect(200)).body.practiceTokens).toBe(before - 1);

    await request(http()).post('/api/v1/event/archive/guess').set(auth).send({ lessonId: 'doctor', answer: 'yisheng' }).expect(200).expect((r) => expect(r.body.correct).toBe(true));
    const after = await request(http()).get('/api/v1/event/archive/2026-10').set(auth).expect(200);
    expect(after.body.explored).toBe(1);
    expect(JSON.stringify(after.body)).toContain('医生');
    const nb = await request(http()).get(`/api/v1/notebook?q=${encodeURIComponent('医生')}`).set(auth).expect(200);
    expect(nb.body.total).toBe(0); // không tự vào sổ tay, người học tự lưu
    // không đụng điểm sự kiện / bảng xếp hạng của tháng hiện tại
    const ev = await prisma.userEvent.findFirst({ where: { userId: id, month: '2026-11' } });
    expect(ev?.points ?? 0).toBe(0);
    await request(http()).post(`/api/v1/event/archive/slots/${slot.id}/hint`).set(auth).expect(400); // đã giải
  });

  it('hết lượt luyện tập thì không mở được gợi ý', async () => {
    await prisma.user.update({ where: { id }, data: { practiceTokens: 0 } });
    const slot = await prisma.keySlot.findFirstOrThrow({ where: { word: { zh: '老师' } } });
    await request(http()).post(`/api/v1/event/archive/slots/${slot.id}/hint`).set(auth).expect(400);
  });

  it('nghe xong 2 bài khác nhau trong ngày được 1 lượt luyện tập', async () => {
    const before = (await prisma.user.findUniqueOrThrow({ where: { id } })).practiceTokens;
    for (const lessonId of ['cafe', 'road']) {
      await request(http()).get(`/api/v1/lessons/${lessonId}`).set(auth).expect(200);
      const lesson = await request(http()).get(`/api/v1/lessons/${lessonId}`).set(auth).expect(200);
      const q = await prisma.lessonQuestion.findMany({ where: { lessonId }, orderBy: { idx: 'asc' } });
      expect(q.length).toBe(lesson.body.questions.length);
      await request(http()).post(`/api/v1/lessons/${lessonId}/answers`).set(auth).send({ answers: q.map((x) => x.answer), listenedPct: 100 }).expect(200);
    }
    expect((await prisma.user.findUniqueOrThrow({ where: { id } })).practiceTokens).toBe(before + 1);
  });
});
