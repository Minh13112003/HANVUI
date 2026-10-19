// Tạo giọng đọc: Azure Speech (có hợp đồng, dùng cho bản thật) hoặc edge-tts (tạm, không chính thức).
// Chọn bằng TTS_PROVIDER=azure|edge; để trống thì dùng Azure nếu đã có AZURE_SPEECH_KEY, không thì edge-tts.
// Azure có bộ đếm ký tự theo tháng (file .azure-usage.json) và tự dừng khi chạm AZURE_SPEECH_MONTHLY_LIMIT
// (mặc định 400000, thấp hơn hạn mức Free 500.000) để không bao giờ vượt gói miễn phí.
import { spawn } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';

const KEY = process.env.AZURE_SPEECH_KEY?.trim();
const REGION = process.env.AZURE_SPEECH_REGION?.trim();
export const PROVIDER: 'azure' | 'edge-tts' = (() => {
  const want = process.env.TTS_PROVIDER?.trim().toLowerCase();
  if (want === 'edge' || want === 'edge-tts') return 'edge-tts';
  if (want === 'azure' || KEY) return 'azure';
  return 'edge-tts';
})();

/** Azure Free: 20 yêu cầu mỗi 60 giây → đợi ~3,2 giây giữa các lần gọi. */
export const PAUSE_MS = PROVIDER === 'azure' ? 3200 : 350;

const LIMIT = Number(process.env.AZURE_SPEECH_MONTHLY_LIMIT?.trim() || 400000);
const USAGE_FILE = new URL('../../.azure-usage.json', import.meta.url);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Ký tự tính phí của Azure: mỗi chữ Hán tính 2, ký tự khác tính 1. */
export const billable = (s: string) => [...s].reduce((n, c) => n + (/[一-鿿]/.test(c) ? 2 : 1), 0);
const month = () => new Date().toISOString().slice(0, 7);

function readUsage(): Record<string, number> {
  try {
    return existsSync(USAGE_FILE) ? JSON.parse(readFileSync(USAGE_FILE, 'utf8')) : {};
  } catch {
    return {};
  }
}
export const usedThisMonth = () => readUsage()[month()] ?? 0;
function addUsage(n: number) {
  const u = readUsage();
  u[month()] = (u[month()] ?? 0) + n;
  writeFileSync(USAGE_FILE, JSON.stringify(u, null, 2));
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function azure(text: string, voice: string, pitch: string, out: string) {
  if (!KEY || !REGION) throw new Error('Thiếu AZURE_SPEECH_KEY hoặc AZURE_SPEECH_REGION trong .env');
  const inner = pitch === '+0Hz' ? esc(text) : `<prosody pitch="${pitch}">${esc(text)}</prosody>`;
  const ssml = `<speak version="1.0" xml:lang="zh-CN" xmlns="http://www.w3.org/2001/10/synthesis"><voice name="${voice}">${inner}</voice></speak>`;
  const cost = billable(text) + (pitch === '+0Hz' ? 0 : 36); // thẻ prosody cũng bị tính
  if (usedThisMonth() + cost > LIMIT) {
    throw new Error(`Đã chạm giới hạn an toàn ${LIMIT} ký tự trong tháng ${month()} (đã dùng ${usedThisMonth()}). Dừng để không vượt gói Free.`);
  }
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(`https://${REGION}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': KEY,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
        'User-Agent': 'hanvui-tts',
      },
      body: ssml,
    });
    if (res.ok) {
      await writeFile(out, Buffer.from(await res.arrayBuffer()));
      addUsage(cost);
      return;
    }
    if (res.status === 429 && attempt < 4) {
      await sleep(20_000); // vượt 20 yêu cầu/phút: đợi rồi thử lại
      continue;
    }
    // 401/403: sai khóa hoặc hết hạn mức; không thử lại để khỏi tốn thêm.
    throw new Error(`Azure TTS lỗi ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
}

async function edge(text: string, voice: string, pitch: string, out: string) {
  const args = ['-m', 'edge_tts', '--voice', voice, '--text', text, '--write-media', out];
  if (pitch !== '+0Hz') args.push('--pitch', pitch);
  await new Promise<void>((resolve, reject) => {
    const p = spawn('python', args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let err = '';
    p.stderr.on('data', (d) => (err += String(d)));
    p.on('error', reject);
    p.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`edge-tts lỗi (${code}): ${err.trim().slice(0, 300)}`))));
  });
}

/** Tạo file MP3 cho một câu. `pitch` dạng "+12Hz" / "-12Hz" / "+0Hz". */
export const synth = (text: string, voice: string, pitch: string, out: string) =>
  PROVIDER === 'azure' ? azure(text, voice, pitch, out) : edge(text, voice, pitch, out);

/** Dùng trong mã băm để đổi nhà cung cấp là tự sinh lại. */
export const hashOf = (createHash: typeof import('node:crypto').createHash, zh: string, voice: string, pitch: string) =>
  createHash('sha256').update(`${PROVIDER}|${voice}|${pitch}|${zh}`).digest('hex').slice(0, 12);
