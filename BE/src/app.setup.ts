import { INestApplication, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import type { Env } from './config/env.js';

/** Cấu hình dùng chung cho chạy thật và kiểm thử e2e. */
export function configureApp(app: INestApplication, env: Pick<Env, 'corsOrigins'>): void {
  app.use(helmet());
  app.enableCors({ origin: env.corsOrigins, credentials: true });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
}
