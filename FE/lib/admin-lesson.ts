// Dữ liệu và tiện ích của trang soạn bài (quản trị).
export interface Tok {
  t: string;
  p?: string;
  v?: string;
  x?: boolean;
}
export interface RoleForm {
  who: string;
  label: string;
  gender: 'm' | 'f';
  pitchRange: number;
  voiceId?: string | null;
}
export interface QuestionForm {
  kind?: string | null;
  prompt: string;
  promptVi: string;
  options: { zh: string; vi: string }[];
  answer: number;
}
export interface LessonForm {
  kind: 'DIALOG' | 'READING';
  title: string;
  situation: string;
  level: number;
  topics: string[];
  tags: string;
  roles: RoleForm[];
  /** Mỗi dòng một câu: "A: 你好。 | Xin chào." (bài đọc không có "A:"). */
  text: string;
  questions: QuestionForm[];
}
export interface PreviewLine {
  who: string;
  zh: string;
  vi: string;
  pinyin: string;
  tokens: Tok[];
}
export interface Preview {
  errors: string[];
  lines: PreviewLine[];
  missing: { zh: string; pinyin: string }[];
  labels: { hsk2: number | null; hsk3: number | null; hskShown: number };
}
export interface LessonDetail {
  id: string;
  kind: 'DIALOG' | 'READING';
  title: string;
  situation: string;
  level: number;
  tags: string[];
  topics: string[];
  roles: RoleForm[];
  lines: (PreviewLine & { audioKey: string | null })[];
  questions: QuestionForm[];
  published: boolean;
  reviewed: boolean;
  keywords: string[];
  missing: { zh: string; pinyin: string }[];
  audioPending: number;
  usage: { used: number; limit: number };
}

export const blankQuestion = (): QuestionForm => ({
  prompt: '',
  promptVi: '',
  options: [
    { zh: '', vi: '' },
    { zh: '', vi: '' },
    { zh: '', vi: '' },
  ],
  answer: 0,
});

export const blankForm = (): LessonForm => ({
  kind: 'DIALOG',
  title: '',
  situation: '',
  level: 1,
  topics: [],
  tags: '',
  roles: [
    { who: 'A', label: '', gender: 'f', pitchRange: 2 },
    { who: 'B', label: '', gender: 'm', pitchRange: 2 },
  ],
  text: '',
  questions: [blankQuestion()],
});

export const linesToText = (lines: { who?: string; zh: string; vi: string }[], kind: LessonForm['kind']) =>
  lines.map((l) => (kind === 'DIALOG' ? `${l.who ?? ''}: ` : '') + `${l.zh} | ${l.vi}`).join('\n');

/** Đọc ô nội dung thành từng câu. Dòng trống bỏ qua; thiếu phần nào thì để BE báo lỗi đúng số câu. */
export function parseText(text: string, kind: LessonForm['kind']) {
  return text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const m = kind === 'DIALOG' ? /^([A-Za-z])\s*[:：]\s*(.*)$/.exec(s) : null;
      const rest = m ? m[2] : s;
      const cut = rest.search(/[|｜]/);
      return { who: m ? m[1].toUpperCase() : '', zh: (cut < 0 ? rest : rest.slice(0, cut)).trim(), vi: cut < 0 ? '' : rest.slice(cut + 1).trim() };
    });
}

export function toDraft(f: LessonForm, edited: Record<string, Tok[]>) {
  return {
    kind: f.kind,
    title: f.title,
    situation: f.situation,
    level: f.level,
    topics: f.topics,
    tags: f.tags.split(',').map((s) => s.trim()).filter(Boolean),
    roles: f.kind === 'DIALOG' ? f.roles : [],
    lines: parseText(f.text, f.kind).map((l) => ({ ...l, ...(edited[l.zh] ? { tokens: edited[l.zh] } : {}) })),
    questions: f.questions,
  };
}

/** Đọc JSON dán vào (bỏ qua khung ``` nếu AI thêm). Ném lỗi nếu không phải JSON. */
export function fromJson(raw: string): LessonForm {
  const s = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/```$/, '').trim();
  const j = JSON.parse(s) as Partial<Omit<LessonForm, 'tags'>> & { tags?: string[] | string; lines?: { who?: string; zh: string; vi: string }[] };
  const kind = j.kind === 'READING' ? 'READING' : 'DIALOG';
  return {
    kind,
    title: j.title ?? '',
    situation: j.situation ?? '',
    level: Number(j.level) || 1,
    topics: Array.isArray(j.topics) ? j.topics : [],
    tags: Array.isArray(j.tags) ? j.tags.join(', ') : (j.tags ?? ''),
    roles: Array.isArray(j.roles) ? j.roles : [],
    text: linesToText(Array.isArray(j.lines) ? j.lines : [], kind),
    questions: Array.isArray(j.questions) ? j.questions : [],
  };
}

/** Đề bài đưa cho AI soạn nội dung; kết quả dán lại vào ô JSON. */
export const aiBrief = (topics: { id: string; name: string }[]) => `Bạn là giáo viên tiếng Trung cho người Việt. Hãy soạn MỘT bài học cho app HanVui, trả về DUY NHẤT một khối JSON đúng mẫu dưới đây.

Yêu cầu của tôi: <ghi cấp HSK, chủ đề, tình huống bạn muốn>

Quy tắc:
- kind là "DIALOG" (hội thoại) hoặc "READING" (bài đọc). Bài đọc bỏ roles và who.
- Câu tiếng Trung dùng chữ giản thể, tự nhiên như người bản xứ nói, đúng trình độ của cấp HSK đã chọn. Bản dịch tiếng Việt tự nhiên, không dịch từng chữ.
- HSK 1 khoảng 4-6 câu ngắn, HSK 2 khoảng 9-10 câu, HSK 3 khoảng 12 câu. Bài đọc dài 13-15 câu.
- Mỗi vai: who là một chữ cái, gender là "m" hoặc "f", pitchRange là 1 (trầm), 2 (vừa) hoặc 3 (cao). Hai vai không được trùng cả gender lẫn pitchRange.
- 2 đến 4 câu hỏi hiểu bài bằng tiếng Trung, mỗi câu 3 đáp án, answer là vị trí đáp án đúng tính từ 0. Xáo đều vị trí đáp án đúng.
- KHÔNG ghi pinyin: app tự sinh.
- topics chọn 1 đến 3 mã trong danh sách: ${topics.map((t) => `${t.id} (${t.name})`).join(', ')}.

Mẫu:
{
  "kind": "DIALOG",
  "title": "Tên bài bằng tiếng Việt",
  "situation": "Bối cảnh ngắn: nơi chốn, nhân vật",
  "level": 1,
  "topics": ["${topics[0]?.id ?? 'ma-chu-de'}"],
  "tags": ["từ khóa bối cảnh"],
  "roles": [
    { "who": "A", "label": "Khách", "gender": "f", "pitchRange": 2 },
    { "who": "B", "label": "Nhân viên", "gender": "m", "pitchRange": 2 }
  ],
  "lines": [
    { "who": "A", "zh": "你好！", "vi": "Xin chào!" },
    { "who": "B", "zh": "你好，你要什么？", "vi": "Chào bạn, bạn muốn gì?" }
  ],
  "questions": [
    {
      "prompt": "他们在说什么？",
      "promptVi": "Họ đang nói về điều gì?",
      "options": [{ "zh": "买东西", "vi": "Mua đồ" }, { "zh": "看书", "vi": "Đọc sách" }, { "zh": "睡觉", "vi": "Đi ngủ" }],
      "answer": 0
    }
  ]
}`;
