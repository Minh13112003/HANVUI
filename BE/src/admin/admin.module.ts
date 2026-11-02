import { Module } from '@nestjs/common';
import { MediaModule } from '../media/media.module.js';
import { AdminLessonsController } from './admin-lessons.controller.js';
import { AdminLessonsService } from './admin-lessons.service.js';
import { TtsService } from './tts.service.js';

@Module({ imports: [MediaModule], controllers: [AdminLessonsController], providers: [AdminLessonsService, TtsService] })
export class AdminModule {}
