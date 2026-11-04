// Chấm luyện dịch (hàm thuần, có test). Dịch không có một đáp án duy nhất, nên:
// - Trung → Việt: chấm THEO CỤM. Mỗi cụm có vài nghĩa được nhận; câu dịch chứa một nghĩa của cụm (bất kể vị trí, vì tiếng Việt
//   đảo trật tự khác tiếng Trung) là đạt cụm đó. Đạt hết cụm = "đúng ý"; từ 60% = "gần đúng". Người học xem bản tham khảo
//   rồi có thể tự đánh dấu "tôi dịch đúng ý" (khi dùng từ đồng nghĩa mà máy chưa biết).
// - Việt → Trung: đúng nguyên câu (bỏ dấu câu, khoảng trắng) hoặc một cách viết khác được nhận mới đúng; không thì chỉ ra cụm
//   tiếng Trung nào chưa có trong câu trả lời.
import { normVi } from '../vocab-test/grade.js';

export interface Chunk {
  zh: string;
  vi: string[];
}

const HAN_ONLY = (s: string) => [...s.normalize('NFC')].filter((c) => /\p{Script=Han}/u.test(c)).join('');

/** Câu tiếng Việt chứa cụm `opt` (khớp theo nguyên từ, không khớp nửa từ: "anh" không khớp trong "thanh"). */
function containsPhrase(answer: string, opt: string): boolean {
  return (' ' + answer + ' ').includes(' ' + opt + ' ');
}

export function gradeZh2Vi(answer: string, chunks: Chunk[]) {
  const a = normVi(answer).replace(/[,;，、]/g, ' ').replace(/\s+/g, ' ');
  const results = chunks.map((c) => {
    if (!c.vi.length || c.vi.includes('-')) return { zh: c.zh, ok: true, optional: true, expect: c.vi.filter((v) => v !== '-') };
    const ok = c.vi.some((v) => containsPhrase(a, normVi(v)));
    return { zh: c.zh, ok, optional: false, expect: c.vi };
  });
  const graded = results.filter((r) => !r.optional);
  const hit = graded.filter((r) => r.ok).length;
  const pct = graded.length ? Math.round((hit / graded.length) * 100) : 100;
  return { pct, verdict: !a ? 'empty' : pct === 100 ? 'ok' : pct >= 60 ? 'close' : 'wrong', chunks: results } as const;
}

export function gradeVi2Zh(answer: string, zh: string, alt: string[], chunks: Chunk[]) {
  const a = HAN_ONLY(answer);
  const exact = !!a && [zh, ...alt].some((x) => HAN_ONLY(x) === a);
  const results = chunks.map((c) => ({ zh: c.zh, ok: exact || a.includes(HAN_ONLY(c.zh)) }));
  const hit = results.filter((r) => r.ok).length;
  const pct = exact ? 100 : Math.round((hit / Math.max(results.length, 1)) * 100);
  return { pct, verdict: !a ? 'empty' : exact ? 'ok' : pct >= 60 ? 'close' : 'wrong', exact, chunks: results } as const;
}

/** Đọc cụm viết gọn "我=tôi|mình / 比他=hơn anh ấy" thành mảng. */
export function parseChunks(s: string): Chunk[] {
  return s.split(' / ').map((part) => {
    const eq = part.indexOf('=');
    const zh = part.slice(0, eq).trim();
    const vi = part
      .slice(eq + 1)
      .split('|')
      .map((x) => x.trim())
      .filter(Boolean);
    return { zh, vi };
  });
}

export const hanOnly = HAN_ONLY;

// ── Mục Luyện dịch: chấm theo cụm ý VÀ thứ tự soạn sẵn, không dùng AI (rule.md mục 8) ──

export type SentenceVerdict = 'empty' | 'ok' | 'near' | 'order' | 'missing';
export interface SentenceKey {
  accept: string[][];
  optional: number[];
  filler: string[];
  orders: number[][];
}
export interface SentenceGrade {
  verdict: SentenceVerdict;
  missing: number[];
  extra: string[];
}

const viWords = (s: string) =>
  s
    .normalize('NFC')
    .toLowerCase()
    .replace(/[\p{P}\p{S}]/gu, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

/** Trung → Việt: tìm từng cụm (ưu tiên cách dịch dài nhất), rồi so thứ tự. Giữ nguyên dấu tiếng Việt. */
export function gradeSentenceVi(answer: string, key: SentenceKey): SentenceGrade {
  const w = viWords(answer);
  if (!w.length) return { verdict: 'empty', missing: [], extra: [] };
  const options = key.accept
    .flatMap((list, id) => list.map((o) => ({ id, o: viWords(o) })))
    .filter((x) => x.o.length)
    .sort((a, b) => b.o.length - a.o.length);
  const used = new Set<number>();
  const seq: number[] = [];
  const extra: string[] = [];
  for (let i = 0; i < w.length; ) {
    const hit = options.find(({ id, o }) => !used.has(id) && o.every((x, k) => w[i + k] === x));
    if (hit) {
      used.add(hit.id);
      seq.push(hit.id);
      i += hit.o.length;
      continue;
    }
    if (!key.filler.includes(w[i])) extra.push(w[i]);
    i++;
  }
  const missing = key.accept.map((_, id) => id).filter((id) => !used.has(id) && !key.optional.includes(id));
  if (missing.length) return { verdict: 'missing', missing, extra };
  const sig = (a: number[]) => a.filter((id) => !key.optional.includes(id)).join(',');
  if (!key.orders.some((o) => sig(o) === sig(seq))) return { verdict: 'order', missing, extra };
  return { verdict: extra.length ? 'near' : 'ok', missing, extra };
}

/** Việt → Trung: đúng nguyên câu hoặc cách viết khác được nhận mới đạt; không thì chỉ từ còn thiếu hoặc báo sai thứ tự. */
export function gradeSentenceZh(answer: string, zh: string, alt: string[], tokens: string[]): SentenceGrade {
  const a = HAN_ONLY(answer);
  if (!a) return { verdict: 'empty', missing: [], extra: [] };
  if ([zh, ...alt].some((x) => HAN_ONLY(x) === a)) return { verdict: 'ok', missing: [], extra: [] };
  let rest = a;
  const missing: number[] = [];
  tokens
    .map((t, id) => ({ t: HAN_ONLY(t), id }))
    .sort((x, y) => y.t.length - x.t.length)
    .forEach(({ t, id }) => {
      const at = rest.indexOf(t);
      if (at < 0) missing.push(id);
      else rest = rest.slice(0, at) + ' ' + rest.slice(at + t.length);
    });
  const extra = [...rest].filter((c) => c !== ' ');
  return { verdict: missing.length ? 'missing' : 'order', missing: missing.sort((x, y) => x - y), extra };
}

/** Tự kiểm một câu soạn sẵn; trả danh sách lỗi (rỗng là đạt). Dùng khi nạp và trong test. */
export function sentenceErrors(s: SentenceKey & { zh: string; vi: string; alt: string[]; tokens: { zh: string }[]; natural: { vi: string; at: number }[] }): string[] {
  const errors: string[] = [];
  const n = s.tokens.length;
  if (HAN_ONLY(s.tokens.map((t) => t.zh).join('')) !== HAN_ONLY(s.zh)) errors.push('các từ ghép lại khác câu');
  if (s.accept.length !== n) errors.push('số danh sách cách dịch khác số từ');
  const ats = s.natural.map((x) => x.at);
  if (new Set(ats).size !== ats.length || ats.some((a) => !Number.isInteger(a) || a < 0 || a >= n)) errors.push('câu tự nhiên trỏ sai vị trí');
  s.accept.forEach((list, i) => {
    if (!list.length && !s.optional.includes(i)) errors.push(`từ ${s.tokens[i]?.zh} bắt buộc mà không có cách dịch`);
    if (!ats.includes(i) && !s.optional.includes(i)) errors.push(`từ ${s.tokens[i]?.zh} bắt buộc mà không có trong câu tự nhiên`);
  });
  const required = s.accept.map((_, i) => i).filter((i) => !s.optional.includes(i));
  for (const o of s.orders) {
    const kept = o.filter((i) => !s.optional.includes(i));
    if ([...kept].sort((a, b) => a - b).join() !== required.join()) errors.push(`thứ tự ${o.join(' ')} không đủ từ bắt buộc`);
  }
  const self = gradeSentenceVi(s.vi, s);
  if (self.verdict !== 'ok') errors.push(`bản tham khảo chấm ra ${self.verdict} (thừa: ${self.extra.join(', ')}; thiếu: ${self.missing.join(', ')})`);
  if (gradeSentenceZh(s.zh, s.zh, s.alt, s.tokens.map((t) => t.zh)).verdict !== 'ok') errors.push('câu tiếng Trung chấm không đạt');
  return errors;
}
