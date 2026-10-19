import { Module } from '@nestjs/common';
import { EventModule } from '../event/event.module.js';
import { AdminMailController, MailController } from './mail.controller.js';
import { MailService } from './mail.service.js';

@Module({
  imports: [EventModule],
  controllers: [MailController, AdminMailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
