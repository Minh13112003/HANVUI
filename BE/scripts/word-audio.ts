// Tạo file âm thanh riêng cho từng từ vựng (bảng Word) rồi tải lên Cloudflare R2, ghi audioKey/audioHash vào DB.
//
//   pnpm audio:words            làm mọi từ chưa có file (hoặc đã đổi giọng/nhà cung cấp)
//   pnpm audio:words --force    làm lại tất cả
//   pnpm audio:words 你好 谢谢   chỉ làm các từ này
//
// Dùng chung nhà cung cấp và bộ đếm quota với tts-upload.ts (scripts/lib/tts.ts). Một giọng nữ trung tính cho mọi từ.
import '../src/config/dotenv.js';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PAUSE_MS, PROVIDER, hashOf as hashWith, synth, usedThisMonth } from './lib/tts.js';

const VOICE = 'zh-CN-XiaoxiaoNeural';
const env = (k: string) => {
  const v = process.env[k]?.trim();
  if (!v) throw new Error(`Thiếu biến môi trường ${k} (xem .env.example)`);
  return v;
};
const s3 = new S3Client({
  region: process.env.S3_REGION?.trim() || 'auto',
  endpoint: env('S3_ENDPOINT'),
  credentials: { accessKeyId: env('S3_ACCESS_KEY'), secretAccessKey: env('S3_SECRET_KEY') },
});
const BUCKET = env('S3_BUCKET');
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: env('DATABASE_URL') }) });
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const args = process.argv.slice(2);
const force = args.includes('--force');
const only = args.filter((a) => !a.startsWith('--'));
const dir = await mkdtemp(join(tmpdir(), 'hanvui-word-'));
let made = 0;
let skipped = 0;
let bytes = 0;

try {
  const words = await prisma.word.findMany({ where: only.length ? { zh: { in: only } } : undefined, orderBy: { id: 'asc' } });
  console.log(`${words.length} từ, nhà cung cấp: ${PROVIDER}`);
  for (const w of words) {
    const hash = hashWith(createHash, w.zh, VOICE, '+0Hz');
    if (!force && w.audioHash === hash && w.audioKey) {
      skipped++;
      continue;
    }
    const key = `audio/words/${w.id}-${hash}.mp3`;
    const tmp = join(dir, 'word.mp3');
    await synth(w.zh, VOICE, '+0Hz', tmp);
    const body = await readFile(tmp);
    await s3.send(
      new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: body, ContentType: 'audio/mpeg', CacheControl: 'public, max-age=31536000, immutable' }),
    );
    await prisma.word.update({ where: { id: w.id }, data: { audioKey: key, audioHash: hash } });
    made++;
    bytes += body.length;
    if (made % 25 === 0) console.log(`  ✓ ${made} từ (mới nhất: ${w.zh})`);
    await sleep(PAUSE_MS);
  }
  console.log(`\n[${PROVIDER}] Xong: tạo mới ${made} file (${(bytes / 1024 / 1024).toFixed(2)} MB), bỏ qua ${skipped} từ đã có.`);
  if (PROVIDER === 'azure') console.log(`Ký tự Azure đã dùng tháng này: ${usedThisMonth()}`);
} finally {
  await rm(dir, { recursive: true, force: true });
  await prisma.$disconnect();
}
