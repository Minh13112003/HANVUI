// Khuôn nội dung HSK 4 theo chủ đề chuyên ngành (soạn 04/11/2026, CHƯA QUA DUYỆT). Pinyin sinh bằng pinyin-pro lúc nạp.

/** [chữ Hán, nghĩa, loại từ, đồng nghĩa "từ=nghĩa;từ=nghĩa" (có thể rỗng), ngữ cảnh dùng, câu ví dụ, dịch câu ví dụ] */
export type CoreWord = [zh: string, vi: string, pos: string, syn: string, usage: string, exZh: string, exVi: string];

/** Câu hỏi nghe: q và qVi chỉ được đọc trong âm thanh và hiện sau khi trả lời; luôn đủ 4 đáp án. */
export interface ListenQ {
  q: string;
  qVi: string;
  o: [zh: string, vi: string][];
  a: number;
}

export interface Hsk4Topic {
  id: string;
  name: string;
  glyph: string;
  intro: string;
  words: CoreWord[];
  dialog: {
    title: string;
    situation: string;
    who: Record<string, string>;
    cast: Record<string, { g: 'm' | 'f'; r: 1 | 2 | 3 }>;
    lines: [who: string, zh: string, vi: string][];
    qs: ListenQ[];
  };
  reading: {
    title: [zh: string, vi: string];
    sents: [zh: string, vi: string][];
    qs: { q: [string, string]; o: [string, string][]; a: number }[];
  };
  writing: (
    | { type: 'ORDER'; vi: string; parts: string[]; alt?: string[] }
    | { type: 'FILL'; vi: string; parts: string[]; answer: string; options: string[] }
    | { type: 'CHOOSE'; vi: string; answer: string; wrong: string[] }
  )[];
  /** Nghĩa của các từ còn lại trong bài: [chữ Hán, nghĩa, loại từ]. */
  extra?: [zh: string, vi: string, pos: string][];
}

/** Giọng đọc câu hỏi cuối bài (người dẫn). */
export const QUESTION_ROLE = 'Q';
export const QUESTION_VOICE = { g: 'm' as const, r: 3 as const };

/** Dựng phần nghe đúng dạng HSK 4: câu hỏi nằm cuối âm thanh, màn hình chỉ ghi số câu và 4 đáp án. */
export function listenLesson(d: Hsk4Topic['dialog']) {
  return {
    lines: [...d.lines, ...d.qs.map((q, i): [string, string, string] => [QUESTION_ROLE, `第${i + 1}题：${q.q}`, `Câu ${i + 1}: ${q.qVi}`])],
    questions: d.qs.map((q, i) => ({ prompt: `Chọn đáp án câu ${i + 1}`, promptVi: `${q.q} (${q.qVi})`, options: q.o.map(([zh, vi]) => ({ zh, vi })), answer: q.a })),
    who: { ...d.who, [QUESTION_ROLE]: 'Người đọc câu hỏi' },
    cast: { ...d.cast, [QUESTION_ROLE]: QUESTION_VOICE },
  };
}

/** Tự kiểm một chủ đề; trả danh sách lỗi (rỗng là đạt). */
export function topicErrors(t: Hsk4Topic): string[] {
  const e: string[] = [];
  const seen = new Set<string>();
  for (const [zh, vi, pos, syn, usage, exZh, exVi] of t.words) {
    if (seen.has(zh)) e.push(`${t.id}: trùng từ ${zh}`);
    seen.add(zh);
    if (!vi || !pos || !usage || !exVi) e.push(`${t.id}: ${zh} thiếu nghĩa, loại từ, ngữ cảnh hoặc dịch ví dụ`);
    if (!exZh.includes(zh)) e.push(`${t.id}: ví dụ của ${zh} không chứa từ đó`);
    for (const s of syn ? syn.split(';') : []) if (!/^[^=]+=[^=]+$/.test(s)) e.push(`${t.id}: đồng nghĩa của ${zh} sai dạng: ${s}`);
  }
  if (t.words.length < 25) e.push(`${t.id}: mới có ${t.words.length} từ core`);
  if (t.dialog.lines.length < 10) e.push(`${t.id}: hội thoại quá ngắn`);
  if (t.dialog.qs.length < 4) e.push(`${t.id}: hội thoại cần ít nhất 4 câu hỏi`);
  for (const q of t.dialog.qs) {
    if (q.o.length !== 4) e.push(`${t.id}: câu nghe "${q.q}" phải có đúng 4 đáp án`);
    if (q.a < 0 || q.a > 3) e.push(`${t.id}: câu nghe "${q.q}" đáp án ngoài phạm vi`);
    if (new Set(q.o.map((x) => x[0])).size !== q.o.length) e.push(`${t.id}: câu nghe "${q.q}" trùng đáp án`);
  }
  if (t.reading.sents.length < 10) e.push(`${t.id}: bài đọc quá ngắn`);
  for (const q of t.reading.qs) {
    if (q.o.length !== 4 || q.a < 0 || q.a > 3) e.push(`${t.id}: câu đọc "${q.q[0]}" phải có 4 đáp án và đáp án trong phạm vi`);
  }
  for (const w of t.writing) {
    if (w.type === 'FILL' && !w.options.includes(w.answer)) e.push(`${t.id}: bài điền "${w.vi}" thiếu đáp án trong lựa chọn`);
    if (w.type === 'FILL' && w.parts.length !== 2) e.push(`${t.id}: bài điền "${w.vi}" phải có 2 phần`);
    if (w.type === 'ORDER' && w.parts.length < 3) e.push(`${t.id}: bài sắp xếp "${w.vi}" quá ít phần`);
  }
  return e;
}
