import 'dotenv/config';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/app.setup.js';
import { loadEnv } from '../src/config/env.js';

// Cần database thật (đặt DATABASE_URL trong .env). Không có thì bỏ qua.
describe.skipIf(!process.env.DATABASE_URL)('Đăng nhập (e2e)', () => {
  let app: INestApplication;
  const email = `e2e-${Date.now()}@example.com`;
  const password = 'matkhau-e2e-123';

  beforeAll(async () => {
    const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = mod.createNestApplication();
    configureApp(app, loadEnv());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('health nối được database', async () => {
    await request(app.getHttpServer()).get('/api/v1/health').expect(200);
  });

  it('chưa đăng nhập thì /auth/me bị chặn', async () => {
    await request(app.getHttpServer()).get('/api/v1/auth/me').expect(401);
  });

  it('đăng ký → me → refresh → logout', async () => {
    const http = app.getHttpServer();
    const reg = await request(http)
      .post('/api/v1/auth/register')
      .send({ email, password, displayName: 'E2E' })
      .expect(201);

    const me = await request(http)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${reg.body.accessToken}`)
      .expect(200);
    expect(me.body.email).toBe(email);

    const ref = await request(http)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: reg.body.refreshToken })
      .expect(200);
    expect(ref.body.refreshToken).not.toBe(reg.body.refreshToken);

    await request(http).post('/api/v1/auth/logout').send({ refreshToken: ref.body.refreshToken }).expect(204);
    await request(http).post('/api/v1/auth/refresh').send({ refreshToken: ref.body.refreshToken }).expect(401);
  });

  it('mật khẩu ngắn bị từ chối', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email: 'x@example.com', password: '123', displayName: 'X' })
      .expect(400);
  });
});
