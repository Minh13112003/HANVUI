import { Body, Controller, HttpCode, Module, Post } from '@nestjs/common';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { compareSpeech } from './compare.js';

class CompareDto {
  @IsString() @MinLength(1) @MaxLength(200) target!: string;
  @IsString() @MaxLength(400) heard!: string;
}

/**
 * Kỹ năng Nói (rule.md 3.5, đổi 27/10/2026): trình duyệt tự nhận dạng giọng nói (miễn phí, không gửi âm thanh lên máy chủ HanVui)
 * rồi gửi chữ chép được lên đây để so với câu mẫu theo pinyin. Không lưu gì.
 */
@Controller('speak')
class SpeakController {
  @HttpCode(200)
  @Post('compare')
  compare(@Body() dto: CompareDto) {
    return compareSpeech(dto.target, dto.heard);
  }
}

@Module({ controllers: [SpeakController] })
export class SpeakModule {}
