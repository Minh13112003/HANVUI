// Kiểm tra bài do quản trị viên nhập (form hoặc dán JSON). Hàm thuần: gom hết lỗi bằng tiếng Việt để sửa một lần.
import type { Tok } from '../common/tokenize.js';

export interface DraftRole {
  who: string;
  label: string;
  gender: 'm' | 'f';
  pitchRange: 1 | 2 | 3;
  voiceId?: string;
}
export interface DraftLine {
  who: string;
  zh: string;
  vi: string;
  tokens?: Tok[];
}
export interface DraftQuestion {
  kind?: string;
  prompt: string;
  promptVi: string;
  options: { zh: string; vi: string }[];
  answer: number;
}
export interface LessonDraft {
  kind: 'DIALOG' | 'READING';
  title: string;
  situation: string;
  level: number;
  topics: string[];
  tags: string[];
  roles: DraftRole[];
  lines: DraftLine[];
  questions: DraftQuestion[];
}

export const READER = 'N';
const MAX_LINES = 60;
const MAX_QUESTIONS = 10;
const HAN = /[一-鿿]/;

const text = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
const asList = (v: unknown): Record<string, unknown>[] => (Array.isArray(v) ? v.filter((x): x is Record<string, unknown> => !!x && typeof x === 'object') : []);

function readTokens(v: unknown, zh: string, where: string, errors: string[]): Tok[] | undefined {
  if (v === undefined || v === null) return undefined;
  const list = asList(v);
  const tokens: Tok[] = list.map((t) => ({
    t: typeof t.t === 'string' ? t.t : '',
    ...(t.x ? { x: true } : { p: text(t.p), ...(text(t.v) ? { v: text(t.v) } : {}) }),
  }));
  if (tokens.map((t) => t.t).join('') !== zh) {
    errors.push(`${where}: phần tách từ không khớp với chữ của câu, hãy bấm Xem trước lại`);
    return undefined;
  }
  return tokens;
}

export function parseDraft(raw: unknown): { draft: LessonDraft; errors: string[] } {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const errors: string[] = [];

  const kind = r.kind === 'READING' ? 'READING' : 'DIALOG';
  if (r.kind !== undefined && r.kind !== 'READING' && r.kind !== 'DIALOG') errors.push('Loại bài chỉ có DIALOG hoặc READING');
  const title = text(r.title);
  if (!title || title.length > 100) errors.push('Tên bài phải có từ 1 đến 100 ký tự');
  const situation = text(r.situation);
  if (!situation || situation.length > 300) errors.push('Bối cảnh phải có từ 1 đến 300 ký tự');
  const level = Number(r.level);
  if (!Number.isInteger(level) || level < 1 || level > 6) errors.push('Cấp HSK phải từ 1 đến 6');
  const topics = Array.isArray(r.topics) ? [...new Set(r.topics.map(text).filter(Boolean))] : [];
  if (!topics.length || topics.length > 3) errors.push('Chọn từ 1 đến 3 chủ đề');
  const tags = Array.isArray(r.tags) ? r.tags.map(text).filter(Boolean).slice(0, 10) : [];

  const roles: DraftRole[] = [];
  if (kind === 'DIALOG') {
    for (const [i, x] of asList(r.roles).entries()) {
      const who = text(x.who).toUpperCase();
      const label = text(x.label);
      const pitchRange = Number(x.pitchRange);
      const at = `Vai ${who || i + 1}`;
      if (!/^[A-Z]$/.test(who)) errors.push(`${at}: mã vai phải là một chữ cái, ví dụ A`);
      if (!label || label.length > 40) errors.push(`${at}: thiếu tên vai`);
      if (x.gender !== 'm' && x.gender !== 'f') errors.push(`${at}: giới tính phải là m hoặc f`);
      if (pitchRange !== 1 && pitchRange !== 2 && pitchRange !== 3) errors.push(`${at}: khoảng giọng phải là 1 (trầm), 2 (vừa) hoặc 3 (cao)`);
      const voiceId = text(x.voiceId);
      if (voiceId && !/^zh-CN-[A-Za-z]+Neural$/.test(voiceId)) errors.push(`${at}: mã giọng không hợp lệ`);
      roles.push({ who, label, gender: x.gender as 'm' | 'f', pitchRange: pitchRange as 1 | 2 | 3, ...(voiceId ? { voiceId } : {}) });
    }
    if (!roles.length) errors.push('Hội thoại cần ít nhất một vai');
    if (new Set(roles.map((x) => x.who)).size !== roles.length) errors.push('Hai vai bị trùng mã');
    // rule.md 3.2: hai vai trong cùng một bài không trùng cả giới tính lẫn khoảng giọng.
    if (new Set(roles.map((x) => x.gender + x.pitchRange)).size !== roles.length) errors.push('Hai vai bị trùng cả giới tính lẫn khoảng giọng');
  }

  const whos = new Set(roles.map((x) => x.who));
  const lines = asList(r.lines).map((x, i): DraftLine => {
    const who = kind === 'READING' ? READER : text(x.who).toUpperCase();
    const zh = text(x.zh);
    const vi = text(x.vi);
    const at = `Câu ${i + 1}`;
    if (!HAN.test(zh) || zh.length > 200) errors.push(`${at}: phải có chữ Hán và không quá 200 ký tự`);
    if (!vi) errors.push(`${at}: thiếu bản dịch`);
    if (kind === 'DIALOG' && !whos.has(who)) errors.push(`${at}: vai "${who}" chưa được khai báo`);
    return { who, zh, vi, tokens: readTokens(x.tokens, zh, at, errors) };
  });
  if (!lines.length || lines.length > MAX_LINES) errors.push(`Bài phải có từ 1 đến ${MAX_LINES} câu`);

  const questions = asList(r.questions).map((x, i): DraftQuestion => {
    const at = `Câu hỏi ${i + 1}`;
    const prompt = text(x.prompt);
    const promptVi = text(x.promptVi);
    const answer = Number(x.answer);
    const options = asList(x.options).map((o) => ({ zh: text(o.zh), vi: text(o.vi) }));
    if (!HAN.test(prompt)) errors.push(`${at}: câu hỏi phải bằng tiếng Trung`);
    if (!promptVi) errors.push(`${at}: thiếu bản dịch câu hỏi`);
    if (options.length < 2 || options.length > 4) errors.push(`${at}: phải có từ 2 đến 4 đáp án`);
    if (options.some((o) => !o.zh || !o.vi)) errors.push(`${at}: đáp án phải có cả tiếng Trung và bản dịch`);
    if (new Set(options.map((o) => o.zh)).size !== options.length) errors.push(`${at}: hai đáp án bị trùng`);
    if (!Number.isInteger(answer) || answer < 0 || answer >= options.length) errors.push(`${at}: đáp án đúng nằm ngoài danh sách`);
    return { kind: text(x.kind) || undefined, prompt, promptVi, options, answer };
  });
  if (!questions.length || questions.length > MAX_QUESTIONS) errors.push(`Bài phải có từ 1 đến ${MAX_QUESTIONS} câu hỏi`);

  return { draft: { kind, title, situation, level, topics, tags, roles, lines, questions }, errors };
}

/** Giọng và cao độ của từng vai. Hai vai dùng cùng một giọng thì đổi cao độ để phân biệt, giống scripts/tts-upload.ts. */
export function voicePlan(roles: { who: string; gender: string; pitchRange: number; voiceId?: string | null }[], voiceOf: (key: string) => string) {
  const voices = roles.map((r) => r.voiceId || voiceOf(r.gender + r.pitchRange));
  const count = new Map<string, number>();
  voices.forEach((v) => count.set(v, (count.get(v) ?? 0) + 1));
  return new Map(
    roles.map((r, i) => {
      const voice = voices[i];
      const pitch = (count.get(voice) ?? 0) > 1 ? (r.pitchRange === 1 ? '-12Hz' : r.pitchRange === 3 ? '+12Hz' : '+0Hz') : '+0Hz';
      return [r.who, { voice, pitch }] as const;
    }),
  );
}
