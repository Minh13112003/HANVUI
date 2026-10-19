// Tạo âm thanh cho câu nghe của đề nâng cấp rồi tải lên Cloudflare R2, ghi khóa file vào Exam.sections.
// Mỗi câu thoại là một file riêng (vai A giọng nữ, vai B giọng nam), FE phát lần lượt.
//
//   pnpm audio:exams            làm mọi đề, bỏ qua câu đã có file
//   pnpm audio:exams --force    làm lại tất cả
//
// Dùng cùng nhà cung cấp và bộ đếm quota như tts-upload.ts (scripts/lib/tts.ts).
import '../src/config/dotenv.js';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { PrismaPg } from '@prisma/adapter-pg';
import type { StoredSection } from '../src/exam/exam.service.js';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PAUSE_MS, PROVIDER, hashOf as hashWith, synth } from './lib/tts.js';

const VOICE: Record<string, string> = { A: 'zh-CN-XiaoxiaoNeural', B: 'zh-CN-YunyangNeural' };

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
const hashOf = (zh: string, voice: string) => hashWith(createHash, zh, voice, '+0Hz');

const force = process.argv.includes('--force');
const dir = await mkdtemp(join(tmpdir(), 'hanvui-exam-tts-'));
let made = 0;
let skipped = 0;
let bytes = 0;

try {
  const exams = await prisma.exam.findMany({ orderBy: { id: 'asc' } });
  for (const exam of exams) {
    const sections = exam.sections as unknown as StoredSection[];
    let changed = false;
    console.log(`\n${exam.id} — ${exam.title}`);
    for (const s of sections) {
      for (const q of s.questions) {
        if (!q.script?.length) continue;
        const next: { who: string; key: string }[] = [];
        for (const [n, line] of q.script.entries()) {
          const voice = VOICE[line.who] ?? VOICE.A;
          const hash = hashOf(line.zh, voice);
          const key = `audio/exams/${exam.id}/${q.id}-${n}-${voice}-${hash}.mp3`;
          if (!force && q.audio?.[n]?.key === key) {
            next.push(q.audio[n]);
            skipped++;
            continue;
          }
          const tmp = join(dir, 'line.mp3');
          await synth(line.zh, voice, '+0Hz', tmp);
          const body = await readFile(tmp);
          await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: body, ContentType: 'audio/mpeg', CacheControl: 'public, max-age=31536000, immutable' }));
          next.push({ who: line.who, key });
          made++;
          bytes += body.length;
          changed = true;
          console.log(`  ✓ ${q.id} câu ${n + 1} · ${voice} · ${(body.length / 1024).toFixed(0)} KB`);
          await sleep(PAUSE_MS);
        }
        q.audio = next;
      }
    }
    if (changed) await prisma.exam.update({ where: { id: exam.id }, data: { sections: sections as object[] } });
  }
  console.log(`\n[${PROVIDER}] Xong: tạo mới ${made} file (${(bytes / 1024 / 1024).toFixed(2)} MB), bỏ qua ${skipped} câu đã có.`);
} finally {
  await rm(dir, { recursive: true, force: true });
  await prisma.$disconnect();
}
