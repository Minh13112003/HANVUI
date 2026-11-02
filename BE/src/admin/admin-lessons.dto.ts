import { IsBoolean } from 'class-validator';

export class FlagDto {
  @IsBoolean()
  value!: boolean;
}
