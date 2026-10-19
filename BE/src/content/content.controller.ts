import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { CurrentUser, type AuthUser } from '../auth/auth.decorators.js';
import { ListLessonsQuery, SubmitAnswersDto } from './content.dto.js';
import { ContentService } from './content.service.js';

@Controller()
export class ContentController {
  constructor(private readonly content: ContentService) {}

  @Get('topics')
  topics(@Query('kind') kind?: string) {
    return this.content.topics(kind === 'VOCAB' || kind === 'SITUATION' ? kind : undefined);
  }

  @Get('topics/:id/words')
  vocab(@Param('id') id: string) {
    return this.content.vocab(id);
  }

  @Get('words/audio')
  wordAudio() {
    return this.content.wordAudio();
  }

  @Get('words/lookup')
  lookup(@CurrentUser() u: AuthUser, @Query('zh') zh = '') {
    return this.content.lookupWord(u.id, zh.trim().slice(0, 30));
  }

  @Get('vocab/progress')
  progress(@CurrentUser() u: AuthUser) {
    return this.content.vocabProgress(u.id);
  }

  @Get('lessons/:id/suggest-words')
  suggest(@CurrentUser() u: AuthUser, @Param('id') id: string) {
    return this.content.suggestWords(u.id, id);
  }

  @Get('lessons')
  list(@CurrentUser() u: AuthUser, @Query() q: ListLessonsQuery) {
    return this.content.listLessons(u.id, q);
  }

  @Get('lessons/:id')
  lesson(@CurrentUser() u: AuthUser, @Param('id') id: string) {
    return this.content.lesson(u.id, id);
  }

  @HttpCode(200)
  @Post('lessons/:id/answers')
  submit(@CurrentUser() u: AuthUser, @Param('id') id: string, @Body() dto: SubmitAnswersDto) {
    return this.content.submit(u.id, id, dto);
  }

  @HttpCode(200)
  @Post('lessons/:id/skip')
  skip(@CurrentUser() u: AuthUser, @Param('id') id: string) {
    return this.content.skip(u.id, id);
  }
}
