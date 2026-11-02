import { Body, Controller, Get, HttpCode, Module, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { CurrentUser, type AuthUser } from '../auth/auth.decorators.js';
import { MAX_WAV_BYTES } from './assess.js';
import { compareSpeech } from './compare.js';
import { PronService } from './pron.service.js';

class CompareDto {
  @IsString() @MinLength(1) @MaxLength(200) target!: string;
  @IsString() @MaxLength(400) heard!: string;
}

class AssessDto {
  @IsString() @MinLength(1) @MaxLength(200) target!: string;
}

/**
 * Kỹ năng Nói (rule.md 3.5).
 * - compare: trình duyệt tự nhận dạng giọng nói (miễn phí, không gửi âm thanh lên máy chủ HanVui) rồi gửi chữ chép được lên
 *   đây để so với câu mẫu theo pinyin. Không lưu gì.
 * - assess: gửi file ghi âm để Azure chấm thang 100. Không lưu âm thanh, có giới hạn lượt mỗi ngày.
 */
@Controller('speak')
class SpeakController {
  constructor(private readonly pron: PronService) {}

  @HttpCode(200)
  @Post('compare')
  compare(@Body() dto: CompareDto) {
    return compareSpeech(dto.target, dto.heard);
  }

  @Get('assess')
  status(@CurrentUser() u: AuthUser) {
    return this.pron.status(u.id);
  }

  /** multipart/form-data: trường "audio" (WAV PCM 16 bit, 16 kHz, một kênh) và trường "target". */
  @Throttle({ default: { limit: 15, ttl: 60_000 } })
  @HttpCode(200)
  @Post('assess')
  @UseInterceptors(FileInterceptor('audio', { limits: { fileSize: MAX_WAV_BYTES, files: 1 } }))
  assess(@CurrentUser() u: AuthUser, @Body() dto: AssessDto, @UploadedFile() audio?: Express.Multer.File) {
    return this.pron.assess(u.id, dto.target, audio?.buffer);
  }
}

@Module({ controllers: [SpeakController], providers: [PronService] })
export class SpeakModule {}
