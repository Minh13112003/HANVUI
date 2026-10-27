import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min, ValidateNested } from 'class-validator';
import { CurrentUser, type AuthUser } from '../auth/auth.decorators.js';
import { VocabTestService, type ModeChoice } from './vocab-test.service.js';

class StartDto {
  @IsIn(['hsk', 'notebook']) source!: 'hsk' | 'notebook';
  @IsOptional() @IsInt() @Min(1) @Max(3) level?: number;
  /** Chỉ kiểm tra các từ này trong Sổ tay (nút "Ôn nhóm này"). */
  @IsOptional() @IsArray() @ArrayMaxSize(2000) @IsInt({ each: true }) ids?: number[];
  @IsInt() @Min(1) @Max(2000) count!: number;
  @IsIn(['zh2vi', 'vi2zh', 'audio', 'mix']) mode!: ModeChoice;
}

class WriteQuery {
  @IsIn(['hsk', 'notebook']) source!: 'hsk' | 'notebook';
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(3) level?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(50) count?: number;
}

class AnswerDto {
  @IsOptional() @IsString() @MaxLength(60) zh?: string;
  @IsOptional() @IsString() @MaxLength(120) vi?: string;
}

class SubmitDto {
  @IsArray() @ArrayMaxSize(2000) @ValidateNested({ each: true }) @Type(() => AnswerDto) answers!: AnswerDto[];
}

@Controller('vocab-test')
export class VocabTestController {
  constructor(private readonly tests: VocabTestService) {}

  /** Các bộ từ HSK, số từ trong Sổ tay, điểm cao nhất và mức sẵn sàng thi từng cấp. */
  @Get()
  overview(@CurrentUser() u: AuthUser) {
    return this.tests.overview(u.id);
  }

  /** Từ để luyện viết chữ từ trí nhớ (Sổ tay hoặc bộ HSK). */
  @Get('write-words')
  writeWords(@CurrentUser() u: AuthUser, @Query() q: WriteQuery) {
    return this.tests.writeWords(u.id, q.source, q.level, q.count ?? 10);
  }

  @Post('start')
  start(@CurrentUser() u: AuthUser, @Body() dto: StartDto) {
    return this.tests.start(u.id, dto);
  }

  @HttpCode(200)
  @Post(':id/submit')
  submit(@CurrentUser() u: AuthUser, @Param('id', ParseIntPipe) id: number, @Body() dto: SubmitDto) {
    return this.tests.submit(u.id, id, dto.answers);
  }
}
