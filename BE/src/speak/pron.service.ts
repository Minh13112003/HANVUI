import { BadRequestException, HttpException, HttpStatus, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { Clock, vnDay } from '../common/time.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { MAX_SECONDS, MAX_TARGET_CHARS, MIN_SECONDS, type AzureResult, combine, hanCount, readAssessment, wavSeconds } from './assess.js';

const num = (v: string | undefined, fallback: number) => {
  const n = Number(v?.trim());
  return Number.isFinite(n) && n > 0 ? n : fallback;
};
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const TIMEOUT_MS = 12_000;
const ATTEMPTS = 3;
const MAX_WAITING = 10;
const DONE_FOR_THE_MONTH = 'Tháng này máy chấm phát âm đã hết hạn mức, bạn dùng "Đọc để máy chấm" bên dưới nhé.';

/**
 * Chấm phát âm bằng Azure Speech (rule.md 3.5). Khóa Azure chỉ nằm ở đây, không gửi xuống trình duyệt; không lưu âm thanh.
 * Gói Free chỉ cho 1 yêu cầu cùng lúc nên các lượt chấm xếp hàng (PRON_CONCURRENCY, tăng khi lên gói S0).
 */
@Injectable()
export class PronService {
  private readonly log = new Logger(PronService.name);
  private running = 0;
  private readonly queue: (() => void)[] = [];

  constructor(
    private readonly prisma: PrismaService,
    private readonly clock: Clock,
  ) {}

  // Đọc lúc gọi (không đọc một lần) để kiểm thử đổi được, như config/demo.ts.
  private get key() {
    return process.env.AZURE_SPEECH_KEY?.trim();
  }
  private get region() {
    return process.env.AZURE_SPEECH_REGION?.trim();
  }
  private get dailyLimit() {
    return num(process.env.PRON_DAILY_LIMIT, 20);
  }
  /** Mặc định 4 giờ, thấp hơn 5 giờ miễn phí mỗi tháng của gói Free. */
  private get monthlySeconds() {
    return num(process.env.PRON_MONTHLY_SECONDS, 14400);
  }
  private get concurrency() {
    return num(process.env.PRON_CONCURRENCY, 1);
  }

  async status(userId: string) {
    const used = await this.usedToday(userId);
    const enabled = Boolean(this.key && this.region);
    return { enabled, dailyLimit: this.dailyLimit, left: Math.max(0, this.dailyLimit - used), maxSeconds: MAX_SECONDS };
  }

  async assess(userId: string, target: string, audio: Buffer | undefined) {
    if (!this.key || !this.region) throw new ServiceUnavailableException('Máy chấm phát âm chưa được cài đặt');
    const chars = hanCount(target);
    if (chars < 1 || chars > MAX_TARGET_CHARS) throw new BadRequestException(`Câu mẫu phải có từ 1 đến ${MAX_TARGET_CHARS} chữ Hán`);
    if (!audio) throw new BadRequestException('Chưa có file ghi âm');
    const seconds = wavSeconds(audio);
    if (typeof seconds === 'string') throw new BadRequestException(seconds);
    if (seconds < MIN_SECONDS) throw new BadRequestException('Bản ghi quá ngắn, hãy đọc lại');
    if (seconds > MAX_SECONDS) throw new BadRequestException(`Bản ghi dài quá ${MAX_SECONDS} giây`);
    if (this.queue.length >= MAX_WAITING) throw new ServiceUnavailableException('Máy chấm đang bận, bạn thử lại sau ít giây nhé');

    await this.acquire();
    try {
      return await this.grade(userId, target, audio, seconds);
    } finally {
      this.release();
    }
  }

  // Kiểm tra hạn mức sau khi tới lượt, để nhiều yêu cầu xếp hàng cùng lúc không vượt hạn mức.
  private async grade(userId: string, target: string, audio: Buffer, seconds: number) {
    const day = vnDay(this.clock.now());
    const used = await this.usedToday(userId);
    if (used >= this.dailyLimit) throw new HttpException(`Bạn đã dùng hết ${this.dailyLimit} lượt chấm phát âm hôm nay`, HttpStatus.TOO_MANY_REQUESTS);
    const month = await this.prisma.speakUsage.aggregate({ where: { day: { startsWith: day.monthKey } }, _sum: { seconds: true } });
    // Mỗi lượt gọi Azure hai lần nên tốn gấp đôi thời lượng âm thanh.
    if ((month._sum.seconds ?? 0) + seconds * 2 > this.monthlySeconds) throw new ServiceUnavailableException(DONE_FOR_THE_MONTH);

    const raw = await this.call(audio, target);
    const a = readAssessment(raw);
    if (!a) {
      await this.record(userId, day.key, seconds, 0);
      return { noSpeech: true, left: this.dailyLimit - used };
    }
    const plain = await this.call(audio, null).catch((e: unknown) => {
      this.log.warn(`Nhận dạng thường lỗi, chỉ dùng điểm Azure: ${String(e)}`);
      return null;
    });
    await this.record(userId, day.key, plain ? seconds * 2 : seconds, 1);
    const heard = plain?.RecognitionStatus === 'Success' ? (plain.DisplayText ?? '') : null;
    return { noSpeech: false, ...combine(target, a, heard), seconds, left: this.dailyLimit - used - 1 };
  }

  private async usedToday(userId: string) {
    const row = await this.prisma.speakUsage.findUnique({ where: { userId_day: { userId, day: vnDay(this.clock.now()).key } } });
    return row?.attempts ?? 0;
  }

  private record(userId: string, day: string, seconds: number, attempts: number) {
    return this.prisma.speakUsage.upsert({
      where: { userId_day: { userId, day } },
      create: { userId, day, seconds, attempts },
      update: { seconds: { increment: seconds }, attempts: { increment: attempts } },
    });
  }

  /** Gọi Azure; có `reference` thì chấm theo từ mẫu, không có thì là nhận dạng thường. Tự thử lại khi bị giới hạn hoặc mất kết nối. */
  private async call(audio: Buffer, reference: string | null): Promise<AzureResult> {
    const headers: Record<string, string> = {
      'Ocp-Apim-Subscription-Key': this.key!,
      'Content-Type': 'audio/wav; codecs=audio/pcm; samplerate=16000',
      Accept: 'application/json',
    };
    if (reference) {
      // Không bật Prosody: chỉ có cho en-US và tính phí thêm.
      const cfg = { ReferenceText: reference, GradingSystem: 'HundredMark', Granularity: 'Phoneme', Dimension: 'Comprehensive', EnableMiscue: 'True' };
      headers['Pronunciation-Assessment'] = Buffer.from(JSON.stringify(cfg)).toString('base64');
    }
    const url = `https://${this.region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=zh-CN&format=detailed`;

    let why = '';
    for (let i = 0; i < ATTEMPTS; i++) {
      if (i) await sleep(800 * i);
      try {
        const res = await fetch(url, { method: 'POST', headers, body: new Uint8Array(audio), signal: AbortSignal.timeout(TIMEOUT_MS) });
        if (res.ok) return (await res.json()) as AzureResult;
        why = `HTTP ${res.status}`;
        if (res.status !== 429 && res.status < 500) break;
      } catch (e) {
        why = e instanceof Error ? e.name : 'lỗi mạng';
      }
    }
    this.log.error(`Gọi Azure thất bại: ${why}`);
    throw new ServiceUnavailableException('Máy chấm phát âm đang gặp sự cố, bạn thử lại sau nhé');
  }

  private acquire() {
    if (this.running < this.concurrency) {
      this.running++;
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => this.queue.push(resolve));
  }

  private release() {
    const next = this.queue.shift();
    if (next) next();
    else this.running--;
  }
}
