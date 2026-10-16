import { Transform } from 'class-transformer';
import { IsBoolean, IsIn, IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class SaveWordDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(1, 20)
  zh!: string;

  @IsOptional() @IsString() @MaxLength(80) pinyin?: string;
  @IsOptional() @IsString() @MaxLength(120) vi?: string;
  @IsOptional() @IsBoolean() isPhrase?: boolean;
  @IsOptional() @IsString() @MaxLength(60) lessonId?: string;
}

export class ListNotebookQuery {
  @IsOptional() @IsIn(['day', 'topic']) view?: 'day' | 'topic';
  @IsOptional() @IsString() @MaxLength(60) q?: string;
}
