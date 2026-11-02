// Cắt khoảng lặng trong bản ghi trước khi gửi đi chấm phát âm (rule.md 3.5): Azure tính tiền theo thời lượng âm thanh nên bớt
// giây nào đỡ giây đó. Hàm thuần, không đụng tới trình duyệt.
//
// Cách làm: chia âm thanh thành khung 20 ms, đo độ to từng khung, lấy mức ồn nền của chính bản ghi (khung yên tĩnh nhất) để đặt
// ngưỡng, nên phòng ồn hay phòng yên đều chạy được. Giữ một đoạn đệm quanh tiếng nói vì phụ âm đầu và đuôi thanh điệu rất nhỏ,
// cắt sát sẽ làm sai điểm. Khoảng lặng dài giữa câu chỉ rút ngắn chứ không bỏ hẳn, để các từ không dính vào nhau.

const FRAME_MS = 20;
/** Giữ lại trước và sau tiếng nói. */
const PAD_MS = 160;
/** Khoảng lặng giữa câu dài hơn mức này mới rút ngắn, và rút còn đúng mức này. */
const MAX_GAP_MS = 300;
/** Tiếng nói phải kéo dài từng này mới tính, để bỏ tiếng bấm nút hay tiếng cạch. */
const MIN_RUN_MS = 60;
/** Tổng tiếng nói ít hơn mức này coi như chưa đọc gì. */
const MIN_SPEECH_MS = 120;
const FADE_MS = 5;
/** Độ to tối thiểu được coi là tiếng nói, phòng khi bản ghi gần như im lặng hoàn toàn. */
const MIN_THRESHOLD = 0.006;

export interface Trimmed {
  samples: Float32Array;
  /** Số giây của bản ghi gốc và sau khi cắt. */
  before: number;
  after: number;
}

/** Trả bản ghi đã cắt, hoặc null nếu không có tiếng nói (khỏi tốn lượt gửi đi). */
export function trimSilence(input: Float32Array, rate: number): Trimmed | null {
  const frame = Math.max(1, Math.round((rate * FRAME_MS) / 1000));
  const frames = Math.floor(input.length / frame);
  if (!frames) return null;

  const rms = new Float32Array(frames);
  for (let f = 0; f < frames; f++) {
    let sum = 0;
    for (let i = f * frame; i < (f + 1) * frame; i++) sum += input[i] * input[i];
    rms[f] = Math.sqrt(sum / frame);
  }

  const sorted = [...rms].sort((a, b) => a - b);
  const floor = sorted[Math.floor(frames * 0.1)];
  const peak = sorted[frames - 1];
  const threshold = Math.max(MIN_THRESHOLD, floor * 3, peak * 0.06);

  // Các đoạn có tiếng nói, bỏ đoạn quá ngắn.
  const minRun = Math.ceil(MIN_RUN_MS / FRAME_MS);
  const runs: [number, number][] = [];
  let start = -1;
  for (let f = 0; f <= frames; f++) {
    const loud = f < frames && rms[f] >= threshold;
    if (loud && start < 0) start = f;
    if (!loud && start >= 0) {
      if (f - start >= minRun) runs.push([start, f]);
      start = -1;
    }
  }
  const speech = runs.reduce((n, [a, b]) => n + b - a, 0) * FRAME_MS;
  if (speech < MIN_SPEECH_MS) return null;

  // Thêm đệm rồi gộp các đoạn; khoảng lặng còn lại dài quá thì để cắt ở bước ghép.
  const pad = Math.round(PAD_MS / FRAME_MS);
  const maxGap = Math.round(MAX_GAP_MS / FRAME_MS);
  const keep: [number, number][] = [];
  for (const [a, b] of runs) {
    const from = Math.max(0, a - pad);
    const to = Math.min(frames, b + pad);
    const last = keep[keep.length - 1];
    if (last && from - last[1] <= maxGap) last[1] = to;
    else keep.push([from, to]);
  }

  // Ghép lại, giữa các đoạn chèn một khoảng im lặng ngắn, vuốt nhỏ hai đầu để khỏi có tiếng "tách".
  const fade = Math.round((rate * FADE_MS) / 1000);
  const gap = Math.round((rate * MAX_GAP_MS) / 1000);
  const total = keep.reduce((n, [a, b]) => n + (b - a) * frame, 0) + (keep.length - 1) * gap;
  const out = new Float32Array(total);
  let at = 0;
  keep.forEach(([a, b], k) => {
    const piece = input.subarray(a * frame, b * frame);
    out.set(piece, at);
    for (let i = 0; i < Math.min(fade, piece.length); i++) {
      const g = i / fade;
      out[at + i] *= g;
      out[at + piece.length - 1 - i] *= g;
    }
    at += piece.length;
    if (k < keep.length - 1) at += gap; // để nguyên số 0: im lặng hoàn toàn
  });
  return { samples: out, before: input.length / rate, after: out.length / rate };
}

/** Đóng gói thành WAV PCM 16 bit, một kênh. */
export function encodeWav(samples: Float32Array, rate: number): Blob {
  const data = samples.length * 2;
  const buf = new ArrayBuffer(44 + data);
  const v = new DataView(buf);
  const text = (at: number, s: string) => [...s].forEach((c, i) => v.setUint8(at + i, c.charCodeAt(0)));
  text(0, 'RIFF');
  v.setUint32(4, 36 + data, true);
  text(8, 'WAVE');
  text(12, 'fmt ');
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true); // PCM
  v.setUint16(22, 1, true); // một kênh
  v.setUint32(24, rate, true);
  v.setUint32(28, rate * 2, true);
  v.setUint16(32, 2, true);
  v.setUint16(34, 16, true);
  text(36, 'data');
  v.setUint32(40, data, true);
  samples.forEach((s, i) => v.setInt16(44 + i * 2, Math.max(-1, Math.min(1, s)) * 0x7fff, true));
  return new Blob([buf], { type: 'audio/wav' });
}
