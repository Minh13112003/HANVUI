import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller.js';
import { AuthModule } from './auth/auth.module.js';
import { CommonModule } from './common/common.module.js';
import { ContentModule } from './content/content.module.js';
import { ExamModule } from './exam/exam.module.js';
import { EventModule } from './event/event.module.js';
import { MailModule } from './mailbox/mail.module.js';
import { RedeemModule } from './redeem/redeem.module.js';
import { MediaModule } from './media/media.module.js';
import { NotebookModule } from './notebook/notebook.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { SpeakModule } from './speak/speak.module.js';
import { VocabTestModule } from './vocab-test/vocab-test.module.js';

@Module({
  imports: [
    // Giới hạn chung: 120 yêu cầu mỗi phút mỗi địa chỉ.
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    CommonModule,
    PrismaModule,
    AuthModule,
    ContentModule,
    EventModule,
    NotebookModule,
    MediaModule,
    MailModule,
    RedeemModule,
    ExamModule,
    VocabTestModule,
    SpeakModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
