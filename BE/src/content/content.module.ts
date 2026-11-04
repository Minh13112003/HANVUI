import { Module } from '@nestjs/common';
import { EventModule } from '../event/event.module.js';
import { ContentController } from './content.controller.js';
import { CoreTopicsController } from './core-topics.controller.js';
import { CoreTopicsService } from './core-topics.service.js';
import { ContentService } from './content.service.js';
import { GrammarController } from './grammar.controller.js';
import { TranslateController } from './translate.controller.js';
import { TranslateService } from './translate.service.js';
import { GrammarService } from './grammar.service.js';
import { WritingController } from './writing.controller.js';
import { WritingService } from './writing.service.js';

@Module({ imports: [EventModule], controllers: [CoreTopicsController, ContentController, WritingController, GrammarController, TranslateController], providers: [CoreTopicsService, ContentService, WritingService, GrammarService, TranslateService] })
export class ContentModule {}
