import '../src/config/dotenv.js';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import sharp from 'sharp';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/app.setup.js';
import { loadEnv } from '../src/config/env.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

// Phần chặn (đăng nhập, quyền, loại file) chạy luôn; ca tải ảnh thật cần R2 (S3_*) và tự xóa ảnh sau khi xong.
describe.skipIf(!process.env.DATABASE_URL)('Tải ảnh (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let auth: { Authorization: string };
  let userId: string;
  const email = `e2e-media-${Date.now()}@example.com`;
  const http = () => app.getHttpServer();

  beforeAll(async () => {
    const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = mod.createNestApplication();
    configureApp(app, loadEnv());
    await app.init();
    prisma = app.get(PrismaService);
    const reg = await request(http())
      .post('/api/v1/auth/register')
      .send({ email, password: 'matkhau-e2e-123', displayName: 'MD' })
      .expect(201);
    auth = { Authorization: `Bearer ${reg.body.accessToken}` };
    userId = reg.body.user.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: userId } });
    await app.close();
  });

  it('chưa đăng nhập thì bị chặn', async () => {
    await request(http()).post('/api/v1/users/me/avatar').expect(401);
  });

  it('hồ sơ có avatarUrl (null khi chưa có ảnh)', async () => {
    const me = await request(http()).get('/api/v1/auth/me').set(auth).expect(200);
    expect(me.body).toHaveProperty('avatarUrl', null);
  });

  it('avatar: thiếu file hoặc file không phải ảnh thì 400', async () => {
    await request(http()).post('/api/v1/users/me/avatar').set(auth).expect(400);
    await request(http())
      .post('/api/v1/users/me/avatar')
      .set(auth)
      .attach('file', Buffer.from('<svg onload=alert(1)></svg>'), { filename: 'a.png', contentType: 'image/png' })
      .expect(400);
  });

  it('avatar: ảnh quá 2MB bị từ chối', async () => {
    const big = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff]), Buffer.alloc(2 * 1024 * 1024 + 10)]);
    const res = await request(http()).post('/api/v1/users/me/avatar').set(auth).attach('file', big, 'big.jpg');
    expect(res.status).toBe(413);
  });

  it.skipIf(!process.env.S3_BUCKET || !process.env.S3_PUBLIC_URL)('avatar thật: tải lên R2, xem được qua URL công khai, rồi xóa', async () => {
    const img = await sharp({ create: { width: 800, height: 600, channels: 3, background: '#0E7466' } }).jpeg().toBuffer();
    const up = await request(http()).post('/api/v1/users/me/avatar').set(auth).attach('file', img, 'a.jpg').expect(200);
    try {
      expect(up.body.avatarUrl).toContain('/img/avatars/');
      expect(up.body.avatarUrl.endsWith('-avatar.webp')).toBe(true);
      const file = await fetch(up.body.avatarUrl);
      expect(file.status).toBe(200);
      expect(file.headers.get('content-type')).toBe('image/webp');
      const meta = await sharp(Buffer.from(await file.arrayBuffer())).metadata();
      expect([meta.width, meta.height]).toEqual([256, 256]);
      const me = await request(http()).get('/api/v1/auth/me').set(auth).expect(200);
      expect(me.body.avatarUrl).toBe(up.body.avatarUrl);
      expect(await prisma.mediaAsset.count({ where: { ownerId: userId } })).toBe(1);
    } finally {
      await request(http()).delete('/api/v1/users/me/avatar').set(auth).expect(204);
    }
    expect((await fetch(up.body.avatarUrl)).status).toBe(404);
    expect(await prisma.mediaAsset.count({ where: { ownerId: userId } })).toBe(0);
  });

  it('API quản trị cấm người thường', async () => {
    await request(http()).post('/api/v1/admin/lessons/cafe/cover').set(auth).expect(403);
    await request(http()).post('/api/v1/admin/lessons/cafe/roles/A/avatar').set(auth).expect(403);
  });

  it('danh sách bài và chi tiết bài có trường ảnh', async () => {
    const list = await request(http()).get('/api/v1/lessons').set(auth).expect(200);
    expect(list.body[0]).toHaveProperty('thumbUrl');
    const one = await request(http()).get('/api/v1/lessons/cafe').set(auth).expect(200);
    expect(one.body).toHaveProperty('coverUrl');
    expect(one.body.roles[0]).toHaveProperty('avatarUrl');
  });
});
