import { Module } from '@nestjs/common';
import { EventModule } from '../event/event.module.js';
import { ContentController } from './content.controller.js';
import { ContentService } from './content.service.js';

@Module({ imports: [EventModule], controllers: [ContentController], providers: [ContentService] })
export class ContentModule {}
