import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsIn, IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class ListLessonsQuery {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(6) level?: number;
  @IsOptional() @IsString() @MaxLength(60) topic?: string;
  @IsOptional() @IsString() @MaxLength(80) q?: string;
  /** DIALOG (mặc định) hoặc READING (bài đọc). */
  @IsOptional() @IsIn(['DIALOG', 'READING']) kind?: 'DIALOG' | 'READING';
}

export class SubmitAnswersDto {
  @IsArray() @ArrayMaxSize(20) @IsInt({ each: true }) @Min(0, { each: true }) answers!: number[];

  /** % thời lượng đã nghe (0-100). Nhiệm vụ chỉ tính khi >= 80. Máy chủ không tự kiểm được, chỉ tin khách. */
  @IsOptional() @IsNumber() @Min(0) @Max(100) listenedPct?: number;
}
