import { Module } from '@nestjs/common';
import { EventModule } from '../event/event.module.js';
import { ContentController } from './content.controller.js';
import { ContentService } from './content.service.js';
import { GrammarController } from './grammar.controller.js';
import { GrammarService } from './grammar.service.js';
import { WritingController } from './writing.controller.js';
import { WritingService } from './writing.service.js';

@Module({ imports: [EventModule], controllers: [ContentController, WritingController, GrammarController], providers: [ContentService, WritingService, GrammarService] })
export class ContentModule {}
