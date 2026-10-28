// Bộ khung soạn đề nâng cấp theo định dạng HSK 2.0 thật (rule.md mục 4).
// Mỗi đề gồm các phần (Nghe, Đọc, Viết), mỗi phần chia "bộ phận" (第一部分, 第二部分…) như đề thật.
// Hình trong đề dùng emoji (không vướng bản quyền, rõ ở cả nền sáng và tối).
//
// Vai trong câu nghe: A = nữ, B = nam, N = người dẫn đọc câu hỏi (giọng do scripts/exam-audio.ts chọn).
// Câu hỏi "男的/女的" dựa theo vai A/B. Như đề thật, câu hỏi của câu nghe được ĐỌC ở cuối đoạn ("问：…"),
// không in ra màn hình; script nạp đề tự thêm dòng của người dẫn.

export interface Line {
  who: 'A' | 'B' | 'N';
  zh: string;
}

export type Q =
  | { type: 'judge'; script?: Line[]; pic?: string; text?: string; statement?: string; answer: 0 | 1 } // 0 = đúng, 1 = sai
  | { type: 'choice'; script?: Line[]; text?: string; prompt?: string; options: string[]; pics?: boolean; answer: number }
  | { type: 'match'; script?: Line[]; text?: string; answer: number }
  | { type: 'order'; words: string[]; answer: string[] }
  | { type: 'fill'; text: string; pinyin: string; answer: string[] };

export interface Part {
  title: string;
  guide: string;
  /** Ngân hàng lựa chọn A–F dùng chung cho các câu `match` của bộ phận. */
  bank?: string[];
  pics?: boolean;
  questions: Q[];
}

export interface Section {
  name: string;
  kind: 'listening' | 'reading' | 'writing';
  max: number;
  parts: Part[];
}

export interface Exam {
  level: number;
  idx: number;
  title: string;
  durationMin: number;
  maxScore: number;
  passScore: number;
  sections: Section[];
}

// ───────────── Lời thoại ─────────────

/** Một người nói (nữ). */
export const one = (zh: string): Line[] => [{ who: 'A', zh }];
/** Một người nói (nam). */
export const oneM = (zh: string): Line[] => [{ who: 'B', zh }];
/** Hội thoại nữ nói trước, luân phiên. */
export const w = (...lines: string[]): Line[] => lines.map((zh, i) => ({ who: i % 2 ? 'B' : 'A', zh }));
/** Hội thoại nam nói trước, luân phiên. */
export const m = (...lines: string[]): Line[] => lines.map((zh, i) => ({ who: i % 2 ? 'A' : 'B', zh }));

// ───────────── Dạng câu ─────────────

/** Đúng/sai: nghe (hoặc đọc chữ) rồi so với hình. */
export const picJudge = (script: Line[] | null, pic: string, ok: boolean, text?: string): Q => ({
  type: 'judge', ...(script ? { script } : {}), pic, ...(text ? { text } : {}), answer: ok ? 0 : 1,
});
/** Đúng/sai: nghe đoạn (hoặc đọc đoạn `text`) rồi xét câu ★. */
export const starJudge = (src: Line[] | string, statement: string, ok: boolean): Q => ({
  type: 'judge', ...(typeof src === 'string' ? { text: src } : { script: src }), statement, answer: ok ? 0 : 1,
});
/** Nghe rồi chọn 1 trong 3 hình. */
export const picChoice = (script: Line[], pics: [string, string, string], answer: number): Q => ({
  type: 'choice', script, options: pics, pics: true, answer,
});
/** Chọn 1 trong 3 đáp án chữ (nghe `script` hoặc đọc `text`). */
export const choice = (src: Line[] | string | null, prompt: string, options: [string, string, string], answer: number): Q => ({
  type: 'choice',
  ...(src === null ? {} : typeof src === 'string' ? { text: src } : { script: src }),
  prompt, options, answer,
});
/** Chọn trong ngân hàng A–F của bộ phận (nghe `script` hoặc đọc `text`). */
export const match = (src: Line[] | string, answer: number): Q => ({
  type: 'match', ...(typeof src === 'string' ? { text: src } : { script: src }), answer,
});
/** Sắp xếp từ thành câu; liệt kê mọi cách đúng. */
export const order = (words: string[], ...answer: string[]): Q => ({ type: 'order', words, answer });
/** Điền chữ Hán theo pinyin vào chỗ trống "（ ）". */
export const fill = (text: string, pinyin: string, ...answer: string[]): Q => ({ type: 'fill', text, pinyin, answer });
