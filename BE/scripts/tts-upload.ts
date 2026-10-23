// Sinh file âm thanh cho câu thoại rồi tải lên Cloudflare R2, và ghi audioKey/audioHash vào DB.
// (rule.md mục 8: tạo sẵn từng file theo câu và theo vai, DB chỉ giữ khóa file, không giữ URL đầy đủ.)
//
//   pnpm audio --check              kiểm tra kết nối R2 rồi thoát
//   pnpm audio cafe                 làm một bài
//   pnpm audio cafe road late3      làm nhiều bài
//   pnpm audio --all                làm mọi bài đã công khai
//   pnpm audio --all --force        làm lại cả những câu đã có file
//
// Nhà cung cấp giọng đọc: Azure Speech nếu đã có AZURE_SPEECH_KEY (hoặc TTS_PROVIDER=azure), không thì edge-tts (tạm).
// Tên nhà cung cấp nằm trong audioHash nên đổi sang Azure là script tự sinh lại, rồi `--prune` dọn file cũ trên R2.
//   pnpm audio --prune              liệt kê file trên R2 không còn ai dùng (chỉ xem)
//   pnpm audio --prune --yes        xóa các file đó
import '../src/config/dotenv.js';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DeleteObjectsCommand, HeadBucketCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PAUSE_MS, PROVIDER, hashOf as hashWith, synth, usedThisMonth } from './lib/tts.js';

const DEFAULT_VOICE = 'zh-CN-XiaoxiaoNeural';

const env = (k: string, fallback?: string) => {
  const v = process.env[k]?.trim();
  if (!v && fallback === undefined) throw new Error(`Thiếu biến môi trường ${k} (xem .env.example)`);
  return v || fallback!;
};

const s3 = new S3Client({
  region: env('S3_REGION', 'auto'),
  endpoint: env('S3_ENDPOINT'),
  credentials: { accessKeyId: env('S3_ACCESS_KEY'), secretAccessKey: env('S3_SECRET_KEY') },
});
const BUCKET = env('S3_BUCKET');
const PUBLIC_URL = env('S3_PUBLIC_URL', '').replace(/\/$/, '');

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: env('DATABASE_URL') }) });

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Khóa file đổi khi nội dung, giọng, cao độ hoặc nhà cung cấp đổi → tự sinh lại. */
const hashOf = (zh: string, voice: string, pitch: string) => hashWith(createHash, zh, voice, pitch);

/** Mọi khóa file âm thanh còn được dùng: câu thoại, từ vựng và câu nghe của đề thi. */
async function usedKeys(): Promise<Set<string>> {
  const lines = await prisma.lessonLine.findMany({ where: { audioKey: { not: null } }, select: { audioKey: true } });
  const used = new Set(lines.map((l) => l.audioKey!));
  for (const w of await prisma.word.findMany({ where: { audioKey: { not: null } }, select: { audioKey: true } })) used.add(w.audioKey!);
  for (const e of await prisma.exam.findMany({ select: { sections: true } })) {
    for (const sec of e.sections as unknown as { questions: { audio?: { key: string }[] }[] }[]) {
      for (const q of sec.questions) q.audio?.forEach((a) => used.add(a.key));
    }
  }
  return used;
}

async function listR2(): Promise<Map<string, number>> {
  const keys = new Map<string, number>();
  let token: string | undefined;
  do {
    const r = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET, Prefix: 'audio/', ContinuationToken: token }));
    (r.Contents ?? []).forEach((o) => keys.set(o.Key!, o.Size ?? 0));
    token = r.IsTruncated ? r.NextContinuationToken : undefined;
  } while (token);
  return keys;
}

/** Dọn file rác: chỉ xóa file KHÔNG còn khóa nào trong DB trỏ tới. Không có --yes thì chỉ liệt kê. */
async function prune(yes: boolean) {
  const used = await usedKeys();
  const keys = await listR2();
  const orphan = [...keys.keys()].filter((k) => !used.has(k));
  const mb = orphan.reduce((s, k) => s + (keys.get(k) ?? 0), 0) / 1024 / 1024;
  console.log(`R2 có ${keys.size} file, DB đang dùng ${used.size}; không ai dùng: ${orphan.length} file (${mb.toFixed(2)} MB).`);
  orphan.slice(0, 8).forEach((k) => console.log('   -', k));
  if (!orphan.length) return;
  if (!yes) {
    console.log('Chỉ xem. Muốn xóa thật: pnpm audio --prune --yes');
    return;
  }
  for (let i = 0; i < orphan.length; i += 1000) {
    await s3.send(new DeleteObjectsCommand({ Bucket: BUCKET, Delete: { Objects: orphan.slice(i, i + 1000).map((Key) => ({ Key })), Quiet: true } }));
  }
  console.log(`✓ Đã xóa ${orphan.length} file không còn dùng.`);
}

async function check() {
  await s3.send(new HeadBucketCommand({ Bucket: BUCKET }));
  console.log('✓ Kết nối R2 được, bucket:', BUCKET);
  const r = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET, MaxKeys: 5, Prefix: 'audio/' }));
  console.log(`✓ Đang có ${r.KeyCount ?? 0} file trong audio/ (hiện tối đa 5):`);
  (r.Contents ?? []).forEach((o) => console.log('   -', o.Key, o.Size, 'byte'));
  console.log(PUBLIC_URL ? '✓ Tên miền công khai: ' + PUBLIC_URL : '! Chưa có S3_PUBLIC_URL: FE sẽ không phát được file');
}

/** Đối chiếu DB với R2: câu nào thiếu file, file nào trên R2 không còn ai dùng, và thử tải vài file thật. */
async function verify() {
  const lines = await prisma.lessonLine.findMany({
    where: { lesson: { published: true, kind: { not: 'READING' } } }, // bài đọc không có âm thanh
    select: { lessonId: true, idx: true, audioKey: true },
    orderBy: [{ lessonId: 'asc' }, { idx: 'asc' }],
  });
  const missing = lines.filter((l) => !l.audioKey);
  console.log(`DB: ${lines.length} câu của bài đã công khai, ${lines.length - missing.length} câu có file.`);
  if (missing.length) {
    console.log('  Thiếu file:');
    missing.forEach((l) => console.log(`   - ${l.lessonId} câu ${l.idx + 1}`));
  }

  // Liệt kê hết R2 (mỗi lượt tối đa 1000 khóa).
  const keys = new Map<string, number>();
  let token: string | undefined;
  do {
    const r = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET, Prefix: 'audio/', ContinuationToken: token }));
    (r.Contents ?? []).forEach((o) => keys.set(o.Key!, o.Size ?? 0));
    token = r.IsTruncated ? r.NextContinuationToken : undefined;
  } while (token);
  const total = [...keys.values()].reduce((s, n) => s + n, 0);
  console.log(`R2: ${keys.size} file trong audio/, tổng ${(total / 1024 / 1024).toFixed(2)} MB.`);

  const used = await usedKeys();
  const notOnR2 = [...used].filter((k) => !keys.has(k));
  const orphan = [...keys.keys()].filter((k) => !used.has(k));
  console.log(notOnR2.length ? `! ${notOnR2.length} khóa trong DB không có trên R2:` : '✓ Mọi khóa trong DB đều có file trên R2.');
  notOnR2.slice(0, 10).forEach((k) => console.log('   -', k));
  console.log(orphan.length ? `! ${orphan.length} file trên R2 không còn ai dùng (xóa được):` : '✓ Không có file rác trên R2.');
  orphan.slice(0, 10).forEach((k) => console.log('   -', k));

  if (!PUBLIC_URL) return;
  const sample = [...used].sort(() => Math.random() - 0.5).slice(0, 5);
  for (const k of sample) {
    const res = await fetch(`${PUBLIC_URL}/${k}`, { method: 'HEAD' });
    console.log(`${res.ok ? '✓' : '✗'} ${res.status} ${res.headers.get('content-type')} ${res.headers.get('content-length')} byte · ${k}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--check')) {
    await check();
    return;
  }
  if (args.includes('--prune')) {
    await prune(args.includes('--yes'));
    return;
  }
  if (args.includes('--verify')) {
    await verify();
    return;
  }

  const force = args.includes('--force');
  const ids = args.filter((a) => !a.startsWith('--'));
  // Bài đọc (READING) không có âm thanh nên luôn bỏ qua.
  const where = args.includes('--all') || !ids.length ? { published: true, kind: { not: 'READING' as const } } : { id: { in: ids }, kind: { not: 'READING' as const } };
  const lessons = await prisma.lesson.findMany({
    where,
    include: { roles: true, lines: { orderBy: { idx: 'asc' } } },
    orderBy: { id: 'asc' },
  });
  if (!lessons.length) throw new Error('Không tìm thấy bài nào. Truyền mã bài hoặc --all.');

  await s3.send(new HeadBucketCommand({ Bucket: BUCKET }));
  const dir = await mkdtemp(join(tmpdir(), 'hanvui-tts-'));
  let made = 0;
  let skipped = 0;
  let bytes = 0;
  const samples: string[] = [];

  try {
    for (const lesson of lessons) {
      // Hai vai dùng cùng một giọng thì đổi cao độ để phân biệt (rule.md mục 3.2).
      const used = new Map<string, number>();
      lesson.roles.forEach((r) => used.set(r.voiceId ?? DEFAULT_VOICE, (used.get(r.voiceId ?? DEFAULT_VOICE) ?? 0) + 1));
      const pitchOf = (voice: string, range: number) =>
        (used.get(voice) ?? 0) > 1 ? (range === 1 ? '-12Hz' : range === 3 ? '+12Hz' : '+0Hz') : '+0Hz';

      console.log(`\n${lesson.id} — ${lesson.title} (${lesson.lines.length} câu)`);
      for (const line of lesson.lines) {
        const role = lesson.roles.find((r) => r.who === line.who);
        const voice = role?.voiceId ?? DEFAULT_VOICE;
        const pitch = pitchOf(voice, role?.pitchRange ?? 2);
        const hash = hashOf(line.zh, voice, pitch);
        if (!force && line.audioHash === hash && line.audioKey) {
          skipped++;
          continue;
        }
        const key = `audio/${lesson.id}/${String(line.idx).padStart(2, '0')}-${voice}-${hash}.mp3`;
        const tmp = join(dir, 'line.mp3');
        await synth(line.zh, voice, pitch, tmp);
        const body = await readFile(tmp);
        await s3.send(
          new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            Body: body,
            ContentType: 'audio/mpeg',
            // Tên file có mã băm nội dung nên cache được một năm (rule.md mục 8).
            CacheControl: 'public, max-age=31536000, immutable',
          }),
        );
        await prisma.lessonLine.update({
          where: { lessonId_idx: { lessonId: lesson.id, idx: line.idx } },
          data: { audioKey: key, audioHash: hash },
        });
        made++;
        bytes += body.length;
        if (samples.length < 3 && PUBLIC_URL) samples.push(`${PUBLIC_URL}/${key}`);
        console.log(`  ✓ câu ${line.idx + 1} · ${voice}${pitch === '+0Hz' ? '' : ' ' + pitch} · ${(body.length / 1024).toFixed(0)} KB`);
        await sleep(PAUSE_MS);
      }
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
  }

  console.log(`\nXong: tạo mới ${made} file (${(bytes / 1024 / 1024).toFixed(2)} MB), bỏ qua ${skipped} câu đã có.`);
  samples.forEach((u) => console.log('Thử nghe:', u));
  if (!PUBLIC_URL) console.log('Nhớ đặt S3_PUBLIC_URL và NEXT_PUBLIC_AUDIO_BASE để FE phát được.');
}

await main().finally(() => prisma.$disconnect());
