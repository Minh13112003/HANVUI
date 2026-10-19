import { BadGatewayException, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { createHash } from 'node:crypto';

export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  folder: string;
}

export interface UploadedImage {
  publicId: string;
  bytes: number;
  width: number | null;
  height: number | null;
  format: string | null;
}

/** Chữ ký Cloudinary: SHA-1 của các tham số (sắp theo tên, trừ file/api_key/resource_type) nối với api_secret. */
export function signParams(params: Record<string, string | number>, apiSecret: string): string {
  const base = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');
  return createHash('sha1').update(base + apiSecret).digest('hex');
}

/** Tải ảnh lên Cloudinary bằng API có ký (máy chủ giữ api_secret, FE không bao giờ thấy). */
@Injectable()
export class CloudinaryService {
  private readonly log = new Logger(CloudinaryService.name);

  private config(): CloudinaryConfig {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
    const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
    const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
    if (!cloudName || !apiKey || !apiSecret) throw new ServiceUnavailableException('Chưa cấu hình tải ảnh');
    return { cloudName, apiKey, apiSecret, folder: (process.env.CLOUDINARY_FOLDER?.trim() || 'hanvui').replace(/^\/|\/$/g, '') };
  }

  /** `path` là phần sau thư mục gốc, ví dụ "avatars/abc". Trả publicId đầy đủ (có thư mục gốc). */
  async upload(buf: Buffer, path: string): Promise<UploadedImage> {
    const c = this.config();
    const publicId = `${c.folder}/${path}`;
    const timestamp = Math.floor(Date.now() / 1000);
    const signed = { public_id: publicId, timestamp, overwrite: 'false' };

    const form = new FormData();
    form.set('file', new Blob([new Uint8Array(buf)]));
    form.set('api_key', c.apiKey);
    form.set('signature', signParams(signed, c.apiSecret));
    for (const [k, v] of Object.entries(signed)) form.set(k, String(v));

    const res = await this.call(`https://api.cloudinary.com/v1_1/${c.cloudName}/image/upload`, form);
    return {
      publicId: res.public_id as string,
      bytes: Number(res.bytes ?? buf.length),
      width: typeof res.width === 'number' ? res.width : null,
      height: typeof res.height === 'number' ? res.height : null,
      format: typeof res.format === 'string' ? res.format : null,
    };
  }

  /** Xóa ảnh. Lỗi chỉ ghi log: ảnh mồ côi không nên làm hỏng việc đổi ảnh của người dùng. */
  async destroy(publicId: string): Promise<void> {
    try {
      const c = this.config();
      const signed = { public_id: publicId, timestamp: Math.floor(Date.now() / 1000), invalidate: 'true' };
      const form = new FormData();
      form.set('api_key', c.apiKey);
      form.set('signature', signParams(signed, c.apiSecret));
      for (const [k, v] of Object.entries(signed)) form.set(k, String(v));
      await this.call(`https://api.cloudinary.com/v1_1/${c.cloudName}/image/destroy`, form);
    } catch (e) {
      this.log.warn(`Không xóa được ảnh ${publicId}: ${(e as Error).message}`);
    }
  }

  private async call(url: string, form: FormData): Promise<Record<string, unknown>> {
    let res: Response;
    try {
      res = await fetch(url, { method: 'POST', body: form, signal: AbortSignal.timeout(20_000) });
    } catch (e) {
      this.log.error(`Gọi Cloudinary thất bại: ${(e as Error).message}`);
      throw new BadGatewayException('Dịch vụ ảnh đang bận, thử lại sau');
    }
    const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) {
      // Không trả nguyên văn lỗi của Cloudinary cho khách (có thể lộ cấu hình).
      this.log.error(`Cloudinary ${res.status}: ${JSON.stringify(body).slice(0, 300)}`);
      throw new BadGatewayException('Không tải được ảnh lên, thử lại sau');
    }
    return body;
  }
}
