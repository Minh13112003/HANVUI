import '../src/config/dotenv.js';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { vi } from 'vitest';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/app.setup.js';
import { loadEnv } from '../src/config/env.js';
import { ObjectStorage } from '../src/media/object-storage.service.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

// Cần database thật đã seed. Azure và R2 đều giả lập. Tài khoản, bài, từ thử đều xóa ở cuối.
describe.skipIf(!process.env.DATABASE_URL)('Quản trị bài học (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const put = vi.fn().mockResolvedValue(undefined);
  const stamp = Date.now();
  const title = `Bài thử e2e ${stamp}`;
  const NEW_WORD = '龘靐'; // từ không có trong từ điển
  let admin: { Authorization: string };
  let plain: { Authorization: string };
  const ids: string[] = [];
  let usageBefore = 0;
  const month = new Date().toISOString().slice(0, 7);
  const http = () => app.getHttpServer();

  const signup = async (tag: string) => {
    const email = `e2e-admin-${tag}-${stamp}@example.com`;
    const r = await request(http()).post('/api/v1/auth/register').send({ email, password: 'matkhau-e2e-123', displayName: tag }).expect(201);
    ids.push(r.body.user.id as string);
    return email;
  };
  const login = async (email: string) => {
    const r = await request(http()).post('/api/v1/auth/login').send({ email, password: 'matkhau-e2e-123' }).expect(200);
    return { Authorization: `Bearer ${r.body.accessToken}` };
  };
  const draft = (over: object = {}) => ({
    title,
    situation: 'Ở quán cà phê',
    level: 1,
    topics: [] as string[],
    roles: [
      { who: 'A', label: 'Khách', gender: 'f', pitchRange: 2 },
      { who: 'B', label: 'Nhân viên', gender: 'm', pitchRange: 2 },
    ],
    lines: [
      { who: 'A', zh: '你好，我想喝咖啡。', vi: 'Chào bạn, tôi muốn uống cà phê.' },
      { who: 'B', zh: `好的，${NEW_WORD}。`, vi: 'Được, từ thử.' },
    ],
    questions: [{ prompt: '她想喝什么？', promptVi: 'Cô ấy muốn uống gì?', options: [{ zh: '咖啡', vi: 'cà phê' }, { zh: '水', vi: 'nước' }], answer: 0 }],
    ...over,
  });

  beforeAll(async () => {
    process.env.AZURE_SPEECH_KEY ||= 'khoa-gia';
    process.env.AZURE_SPEECH_REGION ||= 'eastus';
    process.env.S3_BUCKET ||= 'thu';
    const mod = await Test.createTestingModule({ imports: [AppModule] }).overrideProvider(ObjectStorage).useValue({ put, deleteMany: vi.fn() }).compile();
    app = mod.createNestApplication();
    configureApp(app, loadEnv());
    await app.init();
    prisma = app.get(PrismaService);
    const a = await signup('admin');
    const u = await signup('user');
    await prisma.user.updateMany({ where: { email: a }, data: { role: 'ADMIN' } });
    admin = await login(a);
    plain = await login(u);
    usageBefore = (await prisma.ttsUsage.findUnique({ where: { month } }))?.chars ?? 0;
  });

  afterAll(async () => {
    vi.unstubAllGlobals();
    await prisma.lesson.deleteMany({ where: { title: { startsWith: `Bài thử e2e ${stamp}` } } });
    await prisma.word.deleteMany({ where: { zh: NEW_WORD } });
    await prisma.ttsUsage.updateMany({ where: { month }, data: { chars: usageBefore } });
    await prisma.user.deleteMany({ where: { id: { in: ids } } });
    await app.close();
  });

  it('người dùng thường và người chưa đăng nhập không vào được', async () => {
    await request(http()).get('/api/v1/admin/lessons').expect(401);
    await request(http()).get('/api/v1/admin/lessons').set(plain).expect(403);
    await request(http()).post('/api/v1/admin/lessons').set(plain).send(draft()).expect(403);
    await request(http()).post('/api/v1/admin/lessons/preview').set(plain).send(draft()).expect(403);
  });

  it('thêm bài: xem trước, lưu, tạo âm thanh, đăng, sửa giữ file cũ, ẩn', async () => {
    const topic = (await prisma.topic.findFirstOrThrow({ where: { kind: 'SITUATION' } })).id;
    const body = draft({ topics: [topic] });

    // Xem trước không ghi gì; máy tự sinh pinyin và liệt kê từ chưa có nghĩa.
    const p = await request(http()).post('/api/v1/admin/lessons/preview').set(admin).send(body).expect(200);
    expect(p.body.errors).toEqual([]);
    expect(p.body.lines[0].pinyin).toContain('Nǐ');
    expect(p.body.missing.map((w: { zh: string }) => w.zh).join('')).toContain('龘');
    expect(await prisma.lesson.count({ where: { title } })).toBe(0);

    // Lỗi nhập trả về đầy đủ, không tạo bài.
    const bad = await request(http()).post('/api/v1/admin/lessons').set(admin).send(draft({ topics: ['khong-co'], questions: [] })).expect(400);
    expect(bad.body.message.join()).toContain('khong-co');
    expect(bad.body.message.join()).toContain('câu hỏi');

    // Điền nghĩa rồi lưu: bài chưa hiện cho người học, từ mới vào từ điển.
    const tokens = p.body.lines.map((l: { tokens: { t: string; v?: string }[] }) => l.tokens.map((t) => (t.t === NEW_WORD ? { ...t, v: 'từ thử' } : t)));
    const split = p.body.lines[1].tokens.find((t: { t: string }) => t.t === NEW_WORD);
    if (!split) {
      // Từ không có trong từ điển nên bị tách từng chữ: gộp lại như khi quản trị viên sửa.
      tokens[1] = [{ t: '好', p: 'hǎo' }, { t: '的', p: 'de' }, { t: '，', x: true }, { t: NEW_WORD, p: 'dá bìng', v: 'từ thử' }, { t: '。', x: true }];
    }
    const c = await request(http())
      .post('/api/v1/admin/lessons')
      .set(admin)
      .send({ ...body, lines: body.lines.map((l, i) => ({ ...l, tokens: tokens[i] })) })
      .expect(201);
    const id = c.body.id as string;
    expect(id).toMatch(/^bai-thu-e2e/);
    expect(await prisma.word.count({ where: { zh: NEW_WORD, vi: 'từ thử' } })).toBe(1);
    await request(http()).get(`/api/v1/lessons/${id}`).set(plain).expect(404);

    // Âm thanh: mỗi lần gọi một câu, đếm ký tự vào database.
    const fetchMock = vi.fn().mockImplementation(async () => new Response(new Uint8Array([1, 2, 3])));
    vi.stubGlobal('fetch', fetchMock);
    const a1 = await request(http()).post(`/api/v1/admin/lessons/${id}/audio`).set(admin).expect(200);
    expect(a1.body).toMatchObject({ made: 0, total: 2, remaining: 1 });
    const a2 = await request(http()).post(`/api/v1/admin/lessons/${id}/audio`).set(admin).expect(200);
    expect(a2.body).toMatchObject({ made: 1, remaining: 0 });
    const a3 = await request(http()).post(`/api/v1/admin/lessons/${id}/audio`).set(admin).expect(200);
    expect(a3.body).toMatchObject({ made: null, remaining: 0 });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(put).toHaveBeenCalledTimes(2);
    expect(((await prisma.ttsUsage.findUniqueOrThrow({ where: { month } })).chars)).toBeGreaterThan(usageBefore);

    // Đăng và duyệt: người học mở được.
    await request(http()).patch(`/api/v1/admin/lessons/${id}/reviewed`).set(admin).send({ value: true }).expect(200);
    await request(http()).patch(`/api/v1/admin/lessons/${id}/published`).set(admin).send({ value: true }).expect(200);
    await request(http()).get(`/api/v1/lessons/${id}`).set(plain).expect(200);

    // Sửa một câu: câu không đổi giữ file, câu đổi cần tạo lại, bài về chưa duyệt.
    const edited = { ...body, lines: [body.lines[0], { who: 'B', zh: '好的，请等一下。', vi: 'Được, xin đợi một chút.' }] };
    await request(http()).put(`/api/v1/admin/lessons/${id}`).set(admin).send(edited).expect(200);
    const d = await request(http()).get(`/api/v1/admin/lessons/${id}`).set(admin).expect(200);
    expect(d.body.reviewed).toBe(false);
    expect(d.body.audioPending).toBe(1);
    expect(d.body.lines[0].audioKey).toBeTruthy();
    expect(d.body.lines[1].audioKey).toBeNull();

    // Ẩn: người học không mở được nữa, dữ liệu còn nguyên.
    await request(http()).patch(`/api/v1/admin/lessons/${id}/published`).set(admin).send({ value: false }).expect(200);
    await request(http()).get(`/api/v1/lessons/${id}`).set(plain).expect(404);
    expect((await request(http()).get('/api/v1/admin/lessons').set(admin).expect(200)).body.some((r: { id: string }) => r.id === id)).toBe(true);
    vi.unstubAllGlobals();
  });

  it('bài chứa từ khóa sự kiện: không được làm mất từ khóa, không ẩn được', async () => {
    const link = await prisma.keySlotLesson.findFirstOrThrow({ where: { lesson: { kind: 'DIALOG' } }, include: { slot: { include: { word: true } } } });
    const before = await prisma.lesson.findUniqueOrThrow({ where: { id: link.lessonId }, select: { updatedAt: true } });
    const d = (await request(http()).get(`/api/v1/admin/lessons/${link.lessonId}`).set(admin).expect(200)).body;
    expect(d.keywords).toContain(link.slot.word.zh);

    const r = await request(http())
      .put(`/api/v1/admin/lessons/${link.lessonId}`)
      .set(admin)
      .send({ ...d, lines: [{ who: d.lines[0].who, zh: '你好。', vi: 'Xin chào.' }] })
      .expect(400);
    expect(JSON.stringify(r.body)).toContain('từ khóa sự kiện');
    await request(http()).patch(`/api/v1/admin/lessons/${link.lessonId}/published`).set(admin).send({ value: false }).expect(400);
    expect((await prisma.lesson.findUniqueOrThrow({ where: { id: link.lessonId }, select: { updatedAt: true } })).updatedAt).toEqual(before.updatedAt);
  });

  it('không sửa được bài truyện của sự kiện', async () => {
    await request(http()).get('/api/v1/admin/lessons/story-4-4').set(admin).expect(404);
    await request(http()).put('/api/v1/admin/lessons/story-4-4').set(admin).send(draft()).expect(404);
  });
});
