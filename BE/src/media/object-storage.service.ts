import { DeleteObjectsCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { BadGatewayException, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';

/** Kho file Cloudflare R2 (giao thức S3). Cùng bucket và cùng biến S3_* với script tạo âm thanh. */
@Injectable()
export class ObjectStorage {
  private readonly log = new Logger(ObjectStorage.name);
  private client?: S3Client;

  private cfg() {
    const endpoint = process.env.S3_ENDPOINT?.trim();
    const bucket = process.env.S3_BUCKET?.trim();
    const accessKeyId = process.env.S3_ACCESS_KEY?.trim();
    const secretAccessKey = process.env.S3_SECRET_KEY?.trim();
    if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) {
      throw new ServiceUnavailableException('Chưa cấu hình kho lưu ảnh');
    }
    this.client ??= new S3Client({
      region: process.env.S3_REGION?.trim() || 'auto',
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
    });
    return { client: this.client, bucket };
  }

  /** Khóa file có mã ngẫu nhiên và không bao giờ ghi đè, nên cho trình duyệt giữ bản sao 1 năm. */
  async put(key: string, body: Buffer, contentType: string): Promise<void> {
    const { client, bucket } = this.cfg();
    try {
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: body,
          ContentType: contentType,
          CacheControl: 'public, max-age=31536000, immutable',
        }),
      );
    } catch (e) {
      this.log.error(`Ghi ${key} lên R2 thất bại: ${(e as Error).message}`);
      throw new BadGatewayException('Không lưu được ảnh, thử lại sau');
    }
  }

  /** Xóa nhiều file. File không tồn tại thì bỏ qua. Lỗi chỉ ghi log: ảnh mồ côi không nên làm hỏng việc đổi ảnh. */
  async deleteMany(keys: string[]): Promise<void> {
    if (!keys.length) return;
    try {
      const { client, bucket } = this.cfg();
      await client.send(new DeleteObjectsCommand({ Bucket: bucket, Delete: { Objects: keys.map((Key) => ({ Key })), Quiet: true } }));
    } catch (e) {
      this.log.warn(`Không xóa được ${keys.length} file ảnh: ${(e as Error).message}`);
    }
  }
}
