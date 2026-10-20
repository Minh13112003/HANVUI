import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsDefined, IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import { CurrentUser, type AuthUser } from '../auth/auth.decorators.js';
import { WritingService } from './writing.service.js';

class PickQuery {
  @IsIn(['ORDER', 'FILL', 'CHOOSE', 'WRONG']) type!: 'ORDER' | 'FILL' | 'CHOOSE' | 'WRONG';
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(20) count?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(6) level?: number;
}

class CheckDto {
  @IsInt() @Min(1) itemId!: number;
  /** ORDER: mảng các phần đã sắp · FILL/CHOOSE: chuỗi đã chọn. */
  @IsDefined() answer!: string | string[];
}

@Controller('writing')
export class WritingController {
  constructor(private readonly writing: WritingService) {}

  @Get()
  pick(@CurrentUser() u: AuthUser, @Query() q: PickQuery) {
    return this.writing.pick(u.id, q.type, q.count, q.level);
  }

  @Get('stats')
  stats(@CurrentUser() u: AuthUser) {
    return this.writing.stats(u.id);
  }

  @HttpCode(200)
  @Post('check')
  check(@CurrentUser() u: AuthUser, @Body() dto: CheckDto) {
    return this.writing.check(u.id, dto.itemId, dto.answer);
  }
}
