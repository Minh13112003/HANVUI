import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class ListLessonsQuery {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(3) level?: number;
  @IsOptional() @IsString() @MaxLength(60) topic?: string;
  @IsOptional() @IsString() @MaxLength(80) q?: string;
}

export class SubmitAnswersDto {
  @IsArray() @ArrayMaxSize(20) @IsInt({ each: true }) @Min(0, { each: true }) answers!: number[];

  /** % thời lượng đã nghe (0-100). Nhiệm vụ chỉ tính khi >= 80. Máy chủ không tự kiểm được, chỉ tin khách. */
  @IsOptional() @IsNumber() @Min(0) @Max(100) listenedPct?: number;
}
