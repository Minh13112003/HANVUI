import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { IsIn, IsInt, IsString, MaxLength, Min } from 'class-validator';
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
}
