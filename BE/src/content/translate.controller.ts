import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { IsIn, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { CurrentUser, type AuthUser } from '../auth/auth.decorators.js';
import { TranslateService, type Direction } from './translate.service.js';

class DirQuery {
  @IsIn(['zh2vi', 'vi2zh']) direction!: Direction;
}

class CheckDto {
  @IsInt() @Min(1) itemId!: number;
  @IsIn(['zh2vi', 'vi2zh']) direction!: Direction;
  @IsString() @MaxLength(300) answer!: string;
}

class SelfDto {
  @IsInt() @Min(1) itemId!: number;
  @IsIn(['zh2vi', 'vi2zh']) direction!: Direction;
}

class SentencesQuery extends DirQuery {
  @IsOptional() @IsIn(['1', '2', '3', '4', '5', '6', '7', '8', '9']) level?: string;
}

class SentenceCheckDto {
  @IsInt() @Min(1) sentenceId!: number;
  @IsIn(['zh2vi', 'vi2zh']) direction!: Direction;
  @IsString() @MaxLength(300) answer!: string;
}

@Controller('translate')
export class TranslateController {
  constructor(private readonly t: TranslateService) {}

  /** Câu luyện dịch của một điểm ngữ pháp theo một chiều (không kèm đáp án). */
  @Get('grammar/:slug')
  list(@CurrentUser() u: AuthUser, @Param('slug') slug: string, @Query() q: DirQuery) {
    return this.t.forGrammar(u.id, slug, q.direction);
  }

  @HttpCode(200)
  @Post('check')
  check(@CurrentUser() u: AuthUser, @Body() dto: CheckDto) {
    return this.t.check(u.id, dto.itemId, dto.direction, dto.answer);
  }

  @HttpCode(200)
  @Post('self')
  self(@CurrentUser() u: AuthUser, @Body() dto: SelfDto) {
    return this.t.selfMark(u.id, dto.itemId, dto.direction);
  }

  /** Mục Luyện dịch: danh sách câu của một cấp theo một chiều (không kèm đáp án). */
  @Get('sentences')
  sentences(@CurrentUser() u: AuthUser, @Query() q: SentencesQuery) {
    return this.t.sentences(u.id, q.direction, q.level ? Number(q.level) : undefined);
  }

  /** Nút Hiện dịch: sơ đồ mũi tên và bản dịch của một câu. */
  @Get('sentences/:id/reveal')
  reveal(@CurrentUser() u: AuthUser, @Param('id', ParseIntPipe) id: number) {
    return this.t.reveal(u.id, id);
  }

  @HttpCode(200)
  @Post('sentences/check')
  checkSentence(@CurrentUser() u: AuthUser, @Body() dto: SentenceCheckDto) {
    return this.t.checkSentence(u.id, dto.sentenceId, dto.direction, dto.answer);
  }
}
