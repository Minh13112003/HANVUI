// So câu người học đọc (chữ do nhận dạng giọng nói của trình duyệt chép ra) với câu mẫu, theo từng âm tiết (hàm thuần, có test).
// Nhận dạng giọng nói hay chọn chữ đồng âm (咖非 thay 咖啡), nên so bằng PINYIN chứ không so chữ:
// cùng pinyin cùng thanh = đúng; cùng âm khác thanh = sai thanh điệu; khác âm = sai âm; thiếu/thừa âm tiết.
import { pinyin } from 'pinyin-pro';

export type Verdict = 'ok' | 'homophone' | 'tone' | 'sound' | 'missing' | 'extra';

export interface Syl {
  /** Chữ của câu mẫu (rỗng khi người học đọc thừa). */
  zh: string;
  /** Pinyin đúng của chữ mẫu. */
  py: string;
  /** Chữ máy nghe được (rỗng khi thiếu). */
  heard: string;
  heardPy: string;
  verdict: Verdict;
}

const HAN = /\p{Script=Han}/u;

/** Pinyin có dấu từng chữ Hán của câu (theo ngữ cảnh cả câu để đúng chữ đa âm, biến điệu 不/一). */
function sylls(text: string): { zh: string; py: string }[] {
  const chars = [...text.normalize('NFC')];
  const py = pinyin(text, { toneType: 'symbol', type: 'array' }) as string[];
  const out: { zh: string; py: string }[] = [];
  chars.forEach((c, i) => {
    if (HAN.test(c)) out.push({ zh: c, py: py[i] ?? '' });
  });
  return out;
}

/** Bỏ dấu thanh: "mā" → "ma". */
export const toneless = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ü/g, 'v');

function cmp(a: { zh: string; py: string }, b: { zh: string; py: string }): Verdict {
  if (a.zh === b.zh) return 'ok';
  if (a.py === b.py) return 'homophone';
  if (toneless(a.py) === toneless(b.py)) return 'tone';
  return 'sound';
}

/** Căn hai dãy âm tiết bằng khoảng cách sửa (Levenshtein), ưu tiên ghép những âm tiết giống nhau nhiều nhất. */
export function compareSpeech(target: string, heard: string) {
  const a = sylls(target);
  const b = sylls(heard);
  const cost = (x: { zh: string; py: string }, y: { zh: string; py: string }) => {
    const v = cmp(x, y);
    return v === 'ok' || v === 'homophone' ? 0 : v === 'tone' ? 0.5 : 1;
  };
  const n = a.length;
  const m = b.length;
  const d: number[][] = Array.from({ length: n + 1 }, (_, i) => Array.from({ length: m + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= n; i++)
    for (let j = 1; j <= m; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost(a[i - 1], b[j - 1]));

  const out: Syl[] = [];
  let i = n;
  let j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + cost(a[i - 1], b[j - 1])) {
      out.push({ zh: a[i - 1].zh, py: a[i - 1].py, heard: b[j - 1].zh, heardPy: b[j - 1].py, verdict: cmp(a[i - 1], b[j - 1]) });
      i--;
      j--;
    } else if (i > 0 && d[i][j] === d[i - 1][j] + 1) {
      out.push({ zh: a[i - 1].zh, py: a[i - 1].py, heard: '', heardPy: '', verdict: 'missing' });
      i--;
    } else {
      out.push({ zh: '', py: '', heard: b[j - 1].zh, heardPy: b[j - 1].py, verdict: 'extra' });
      j--;
    }
  }
  out.reverse();
  const good = out.filter((s) => s.verdict === 'ok' || s.verdict === 'homophone').length;
  const half = out.filter((s) => s.verdict === 'tone').length;
  const score = n ? Math.round(((good + half * 0.5) / n) * 100) : 0;
  return { score, syllables: out, counts: count(out) };
}

function count(s: Syl[]) {
  const c: Record<Verdict, number> = { ok: 0, homophone: 0, tone: 0, sound: 0, missing: 0, extra: 0 };
  for (const x of s) c[x.verdict]++;
  return c;
}
