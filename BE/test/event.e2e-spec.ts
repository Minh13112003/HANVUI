import '../src/config/dotenv.js';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/app.setup.js';
import { loadEnv } from '../src/config/env.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

// Cần database thật đã seed (pnpm db:seed). Tài khoản thử xóa ở cuối.
describe.skipIf(!process.env.DATABASE_URL)('Nội dung và sự kiện (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let auth: { Authorization: string };
  let userId: string;
  const email = `e2e-ev-${Date.now()}@example.com`;

  const http = () => app.getHttpServer();
  const get = (url: string) => request(http()).get(`/api/v1${url}`).set(auth);
  const post = (url: string, body: object = {}) => request(http()).post(`/api/v1${url}`).set(auth).send(body);

  beforeAll(async () => {
    const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = mod.createNestApplication();
    configureApp(app, loadEnv());
    await app.init();
    prisma = app.get(PrismaService);
    const reg = await request(http())
      .post('/api/v1/auth/register')
      .send({ email, password: 'matkhau-e2e-123', displayName: 'EV' })
      .expect(201);
    auth = { Authorization: `Bearer ${reg.body.accessToken}` };
    userId = reg.body.user.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: userId } });
    await app.close();
  });

  it('danh sách bài: tìm theo tên/chủ đề/bối cảnh, không tìm trong nội dung câu thoại', async () => {
    const all = await get('/lessons?level=1').expect(200);
    expect(all.body.length).toBeGreaterThanOrEqual(6);
    const byTitle = await get('/lessons?q=ca phe').expect(200);
    expect(byTitle.body.some((l: { id: string }) => l.id === 'cafe')).toBe(true);
    // "咖啡" nằm trong câu thoại nhưng không được tìm thấy qua ô tìm kiếm
    const byContent = await get(`/lessons?q=${encodeURIComponent('咖啡')}`).expect(200);
    expect(byContent.body).toHaveLength(0);
  });

  it('lời thoại khóa tới khi trả lời xong', async () => {
    const before = await get('/lessons/office').expect(200);
    expect(before.body.lines[0].zh).toBeUndefined();
    expect(before.body.questions[0].promptVi).toBeUndefined();
    expect(before.body.questions[0].answer).toBeUndefined();

    const bad = await post('/lessons/office/answers', { answers: [0] }).expect(400);
    expect(bad.body.message).toBeTruthy();

    const done = await post('/lessons/office/answers', { answers: [0, 1], listenedPct: 100 }).expect(200);
    expect(done.body.correct).toBe(2);
    const after = await get('/lessons/office').expect(200);
    expect(after.body.lines[0].zh).toBeTruthy();
    expect(after.body.lines[0].tokens.length).toBeGreaterThan(0);
  });

  it('đăng nhập sự kiện cộng lượt, chỉ một lần mỗi ngày', async () => {
    const first = await post('/event/checkin').expect(200);
    expect(first.body.granted).toBeGreaterThanOrEqual(1);
    const again = await post('/event/checkin').expect(200);
    expect(again.body.alreadyCheckedIn).toBe(true);
  });

  it('đoán từ khóa: bắt buộc mở gợi ý 1, từ khóa chỉ lộ khi đúng', async () => {
    const state = await get('/event').expect(200);
    expect(state.body.active).toBe(true);
    expect(JSON.stringify(state.body)).not.toContain('咖啡');

    const slot = await prisma.keySlot.findFirstOrThrow({ where: { word: { zh: '咖啡' } } });
    // chưa mở gợi ý 1 thì đoán đúng cũng tính sai
    const noHint = await post('/event/guess', { lessonId: 'office', answer: '咖啡' }).expect(200);
    expect(noHint.body.correct).toBe(false);

    const tokensBefore = (await get('/event').expect(200)).body.tokens;
    const hint = await post(`/event/slots/${slot.id}/hint`).expect(200);
    expect(hint.body.hintNo).toBe(1);
    expect((await get('/event').expect(200)).body.tokens).toBe(tokensBefore - 1);

    await post('/event/guess', { lessonId: 'office', answer: 'cà phê' }).expect(400); // tiếng Việt: lỗi, không tốn lượt
    await post('/event/guess', { lessonId: 'hotel', answer: '咖啡' }).expect(400); // chưa mở bài này
    await get('/lessons/hotel').expect(200);
    const wrongLesson = await post('/event/guess', { lessonId: 'hotel', answer: '咖啡' }).expect(200);
    expect(wrongLesson.body.correct).toBe(false); // từ khóa không nằm trong bài hotel

    const ok = await post('/event/guess', { lessonId: 'office', answer: 'kafei' }).expect(200);
    expect(ok.body.correct).toBe(true);
    expect(ok.body.word.zh).toBe('咖啡');
    expect(ok.body.points).toBe(230); // chỉ mở gợi ý 1, chương 1 đã qua tuần (không +30)

    const solvedState = await get('/event').expect(200);
    expect(solvedState.body.solved).toBe(1);
    expect(JSON.stringify(solvedState.body)).toContain('咖啡');
    const again = await post(`/event/slots/${slot.id}/hint`).expect(400); // ô đã giải
    expect(again.body.message).toBeTruthy();
  });

  it('từ khóa đã giải tự vào sổ tay; lưu từ mới và xem theo ngày/chủ đề', async () => {
    const nb = await get('/notebook?view=day').expect(200);
    expect(nb.body.total).toBeGreaterThanOrEqual(1);
    await post('/notebook', { zh: '你好吗', lessonId: 'cafe' }).expect(201);
    const topic = await get('/notebook?view=topic').expect(200);
    expect(topic.body.groups.length).toBeGreaterThan(0);
    const unknown = (await get(`/notebook?q=${encodeURIComponent('你好吗')}`).expect(200)).body.groups.flatMap((g: { words: { aiPending: boolean }[] }) => g.words);
    expect(unknown[0].aiPending).toBe(true);
  });

  it('bảng xếp hạng và túi đồ', async () => {
    const lb = await get('/event/leaderboard').expect(200);
    expect(lb.body.me.solved).toBe(1);
    await get('/event/inventory').expect(200);
  });

  it('tắt sự kiện thì không mở gợi ý', async () => {
    await post('/event/opt-out', { out: true }).expect(200);
    const slot = await prisma.keySlot.findFirstOrThrow({ where: { word: { zh: '银行' } } });
    await post(`/event/slots/${slot.id}/hint`).expect(403);
    await post('/event/opt-out', { out: false }).expect(200);
  });
});
