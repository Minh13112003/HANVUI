// Phần thuần của chấm phát âm (rule.md 3.5, có test): đọc file WAV, đọc kết quả Azure, gộp điểm.
//
// Vì sao chấm hai lớp (đã thử bằng giọng Azure đọc sai thanh, 02/11/2026): khi có từ mẫu, Azure ép kết quả về từ mẫu nên gần
// như không trừ lỗi thanh (老师 đọc lāo shǐ vẫn 94, 卖 chấm theo 买 được 74 còn đọc đúng chỉ 64). Nhận dạng thường không kèm từ
// mẫu thì nghe ra 捞屎, 卖, nên so pinyin với câu mẫu (compareSpeech) sẽ bắt được thanh. Hai lớp bù cho nhau.
import { compareSpeech, type Syl, type Verdict } from './compare.js';

/** Âm thanh gửi lên phải là WAV PCM 16 bit, 16 kHz, một kênh (định dạng Azure nhận). */
export const WAV_RATE = 16000;
export const MAX_SECONDS = 15;
export const MAX_WAV_BYTES = 44 + WAV_RATE * 2 * MAX_SECONDS + 1024;
export const MIN_SECONDS = 0.15;
export const MAX_TARGET_CHARS = 40;

const HAN = /\p{Script=Han}/gu;
export const hanCount = (s: string) => s.match(HAN)?.length ?? 0;

/** Trả số giây âm thanh của file WAV; sai định dạng thì trả chuỗi lỗi để báo người học. */
export function wavSeconds(buf: Buffer): number | string {
  const bad = 'File ghi âm không đúng định dạng. Hãy ghi âm lại.';
  if (buf.length < 44 || buf.toString('latin1', 0, 4) !== 'RIFF' || buf.toString('latin1', 8, 12) !== 'WAVE') return bad;
  let at = 12;
  let fmtOk = false;
  while (at + 8 <= buf.length) {
    const id = buf.toString('latin1', at, at + 4);
    const size = buf.readUInt32LE(at + 4);
    const body = at + 8;
    if (id === 'fmt ' && body + 16 <= buf.length) {
      fmtOk = buf.readUInt16LE(body) === 1 && buf.readUInt16LE(body + 2) === 1 && buf.readUInt32LE(body + 4) === WAV_RATE && buf.readUInt16LE(body + 14) === 16;
    }
    if (id === 'data') {
      if (!fmtOk) return bad;
      return Math.min(size, buf.length - body) / (WAV_RATE * 2);
    }
    at = body + size + (size % 2);
  }
  return bad;
}

interface AzureWord {
  Word?: string;
  AccuracyScore?: number;
  ErrorType?: string;
  Phonemes?: { AccuracyScore?: number }[];
}
export interface AzureResult {
  RecognitionStatus?: string;
  DisplayText?: string;
  NBest?: { AccuracyScore?: number; Words?: AzureWord[] }[];
}

/** Điểm tổng (0-100) và điểm từng chữ Hán từ kết quả chấm có từ mẫu; không nghe thấy gì thì trả null. */
export function readAssessment(r: AzureResult): { accuracy: number; chars: { zh: string; accuracy: number }[] } | null {
  const best = r.NBest?.[0];
  if (r.RecognitionStatus !== 'Success' || typeof best?.AccuracyScore !== 'number') return null;
  const chars: { zh: string; accuracy: number }[] = [];
  for (const w of best.Words ?? []) {
    [...(w.Word ?? '').matchAll(HAN)].forEach(([zh], i) => {
      const own = w.Phonemes?.[i]?.AccuracyScore;
      chars.push({ zh, accuracy: Math.round(own ?? w.AccuracyScore ?? 0) });
    });
  }
  return { accuracy: Math.round(best.AccuracyScore), chars };
}

export type Rating = 'good' | 'fair' | 'poor';
/** Mốc đề xuất, đặt theo giọng máy; cần chỉnh lại sau khi thử với giọng người thật. */
export const rate = (score: number): Rating => (score >= 80 ? 'good' : score >= 60 ? 'fair' : 'poor');

const WRONG: Verdict[] = ['tone', 'sound', 'missing', 'extra'];
/** Có lỗi đã nghe ra thì không được xếp "Chuẩn", dù điểm trung bình cao. */
const CAP_IF_WRONG = 79;

export interface AssessSyllable extends Syl {
  accuracy: number | null;
}

/** Gộp hai lớp: nửa điểm Azure, nửa điểm so pinyin. `heard` là null khi lớp nhận dạng thường lỗi: chỉ còn điểm Azure. */
export function combine(target: string, a: NonNullable<ReturnType<typeof readAssessment>>, heard: string | null) {
  if (heard === null) {
    const syllables = a.chars.map((c) => ({ zh: c.zh, py: '', heard: '', heardPy: '', verdict: 'ok' as Verdict, accuracy: c.accuracy }));
    return { score: a.accuracy, rating: rate(a.accuracy), accuracy: a.accuracy, toneChecked: false, heard: '', syllables };
  }
  const cmp = compareSpeech(target, heard);
  // Điểm từng chữ chỉ khớp được khi Azure trả đúng số chữ của câu mẫu.
  const aligned = a.chars.length === hanCount(target);
  let at = 0;
  const syllables: AssessSyllable[] = cmp.syllables.map((s) => {
    if (!s.zh) return { ...s, accuracy: null };
    const accuracy = aligned ? a.chars[at].accuracy : null;
    at++;
    return { ...s, accuracy };
  });
  const mixed = Math.round((a.accuracy + cmp.score) / 2);
  const score = cmp.syllables.some((s) => WRONG.includes(s.verdict)) ? Math.min(mixed, CAP_IF_WRONG) : mixed;
  return { score, rating: rate(score), accuracy: a.accuracy, toneChecked: true, heard, syllables };
}
