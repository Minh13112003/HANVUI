import { BadGatewayException, HttpException, HttpStatus, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service.js';

/** Azure Free: 20 yêu cầu mỗi 60 giây. */
const GAP_MS = 3200;
const TIMEOUT_MS = 20_000;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Ký tự tính phí của Azure: mỗi chữ Hán tính 2, ký tự khác tính 1. */
const billable = (s: string) => [...s].reduce((n, c) => n + (/[一-鿿]/.test(c) ? 2 : 1), 0);
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Cùng công thức với scripts/lib/tts.ts để `pnpm audio` nhận ra file đã có. */
export const audioHash = (zh: string, voice: string, pitch: string) => createHash('sha256').update(`azure|${voice}|${pitch}|${zh}`).digest('hex').slice(0, 12);

/** Tạo giọng đọc trên máy chủ bằng Azure. Bộ đếm ký tự nằm trong database, dùng chung với các script tạo âm thanh. */
@Injectable()
export class TtsService {
  private readonly log = new Logger(TtsService.name);
  private nextAt = 0;

  constructor(private readonly prisma: PrismaService) {}

  private get limit() {
    return Number(process.env.AZURE_SPEECH_MONTHLY_LIMIT?.trim() || 400000);
  }
  private get month() {
    return new Date().toISOString().slice(0, 7);
  }

  async usage() {
    const row = await this.prisma.ttsUsage.findUnique({ where: { month: this.month } });
    return { used: row?.chars ?? 0, limit: this.limit };
  }

  async synth(text: string, voice: string, pitch: string): Promise<Buffer> {
    const key = process.env.AZURE_SPEECH_KEY?.trim();
    const region = process.env.AZURE_SPEECH_REGION?.trim();
    if (!key || !region) throw new ServiceUnavailableException('Máy chủ chưa có khóa Azure Speech');
    const inner = pitch === '+0Hz' ? esc(text) : `<prosody pitch="${pitch}">${esc(text)}</prosody>`;
    const ssml = `<speak version="1.0" xml:lang="zh-CN" xmlns="http://www.w3.org/2001/10/synthesis"><voice name="${voice}">${inner}</voice></speak>`;
    const cost = billable(text) + (pitch === '+0Hz' ? 0 : 36); // thẻ prosody cũng bị tính

    const { used, limit } = await this.usage();
    if (used + cost > limit) throw new HttpException(`Đã chạm giới hạn an toàn ${limit} ký tự Azure của tháng này (đã dùng ${used})`, HttpStatus.TOO_MANY_REQUESTS);

    for (let attempt = 1; attempt <= 2; attempt++) {
      await this.wait();
      let res: Response;
      try {
        res = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
          method: 'POST',
          headers: {
            'Ocp-Apim-Subscription-Key': key,
            'Content-Type': 'application/ssml+xml',
            'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
            'User-Agent': 'hanvui-tts',
          },
          body: ssml,
          signal: AbortSignal.timeout(TIMEOUT_MS),
        });
      } catch (e) {
        this.log.error(`Gọi Azure TTS thất bại: ${e instanceof Error ? e.name : 'lỗi mạng'}`);
        throw new BadGatewayException('Không gọi được Azure, bạn bấm tạo tiếp sau ít giây nhé');
      }
      if (res.ok) {
        const audio = Buffer.from(await res.arrayBuffer());
        await this.prisma.ttsUsage.upsert({ where: { month: this.month }, create: { month: this.month, chars: cost }, update: { chars: { increment: cost } } });
        return audio;
      }
      this.log.error(`Azure TTS trả về HTTP ${res.status}`);
      if (res.status !== 429 || attempt === 2) break;
      await sleep(20_000);
    }
    throw new BadGatewayException('Azure từ chối tạo giọng đọc, bạn kiểm tra khóa và hạn mức trong Azure Portal');
  }

  /** Giữ khoảng cách giữa các lần gọi. Tự giữ chỗ trước khi đợi nên nhiều yêu cầu cùng lúc vẫn cách nhau đủ xa. */
  private async wait() {
    const now = Date.now();
    const at = Math.max(now, this.nextAt);
    this.nextAt = at + GAP_MS;
    if (at > now) await sleep(at - now);
  }
}
