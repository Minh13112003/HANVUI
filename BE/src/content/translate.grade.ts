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
