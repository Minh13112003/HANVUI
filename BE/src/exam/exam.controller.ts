import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { IsDefined, IsInt, IsObject, Max, Min } from 'class-validator';
import { CurrentUser, type AuthUser } from '../auth/auth.decorators.js';
import { ExamService } from './exam.service.js';

class StartDto {
  @IsInt() @Min(1) @Max(6) level!: number;
}

class SubmitDto {
  /** { "l1": 0, "r3": 1, "w2": ["我", "喜欢", "猫"] } — khóa là mã câu. */
  @IsDefined() @IsObject() answers!: Record<string, number | string | string[] | null>;
}

@Controller('exams')
export class ExamController {
  constructor(private readonly exams: ExamService) {}

  @Get()
  list(@CurrentUser() u: AuthUser) {
    return this.exams.list(u.id);
  }

  @Get('attempts')
  history(@CurrentUser() u: AuthUser) {
    return this.exams.history(u.id);
  }

  @Get('attempts/:id')
  review(@CurrentUser() u: AuthUser, @Param('id', ParseIntPipe) id: number) {
    return this.exams.review(u.id, id);
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @HttpCode(200)
  @Post('start')
  start(@CurrentUser() u: AuthUser, @Body() dto: StartDto) {
    return this.exams.start(u.id, dto.level);
  }

  @HttpCode(200)
  @Post('attempts/:id/submit')
  submit(@CurrentUser() u: AuthUser, @Param('id', ParseIntPipe) id: number, @Body() dto: SubmitDto) {
    return this.exams.submit(u.id, id, dto.answers);
  }
}
