import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { configureApp } from './app.setup.js';
import { loadEnv } from './config/env.js';

async function bootstrap() {
  const env = loadEnv();
  const app = await NestFactory.create(AppModule);

  configureApp(app, env);
  app.enableShutdownHooks();

  await app.listen(env.port);
  console.log(`HanVui BE chạy tại http://localhost:${env.port}/api/v1`);
}

await bootstrap();
