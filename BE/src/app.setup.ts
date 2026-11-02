import { INestApplication, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import type { Env } from './config/env.js';

/** Cấu hình dùng chung cho chạy thật và kiểm thử e2e. */
export function configureApp(app: INestApplication, env: Pick<Env, 'corsOrigins'>): void {
  // Sau proxy của Render và Vercel, không bật thì mọi người dùng chung một địa chỉ và chung giới hạn lượt gọi (đăng nhập 10 lần/phút).
  if (process.env.TRUST_PROXY?.trim() === 'true') (app.getHttpAdapter().getInstance() as { set(k: string, v: unknown): void }).set('trust proxy', true);
  app.use(helmet());
  app.enableCors({ origin: env.corsOrigins, credentials: true });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
}
