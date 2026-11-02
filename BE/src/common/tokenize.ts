// Pinyin và tách từ cho lời thoại. Dùng chung cho script nạp nội dung và trang quản trị.
import { pinyin } from 'pinyin-pro';

export interface Tok {
  t: string;
  p?: string;
  v?: string;
  x?: boolean;
}

export const slug = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Giọng theo giới tính + khoảng giọng (1 trầm, 2 vừa, 3 cao). */
export const VOICE: Record<string, string> = {
  m1: 'zh-CN-YunjianNeural',
  m2: 'zh-CN-YunyangNeural',
  m3: 'zh-CN-YunxiNeural',
  f1: 'zh-CN-XiaoxiaoNeural',
  f2: 'zh-CN-XiaoxiaoNeural',
  f3: 'zh-CN-XiaoyiNeural',
};

const isHan = (c: string) => /[一-鿿]/.test(c);

const PUNCT: Record<string, string> = { '，': ',', '。': '.', '？': '?', '！': '!', '：': ':', '；': ';', '、': ',', '（': '(', '）': ')' };

/**
 * Tách từ bằng khớp dài nhất với từ điển (từ HSK + từ đã có + từ mới của chương); chữ không tra được thì đứng riêng.
 * (Đã thử bộ tách từ ICU của Node nhưng kết quả nhiễu, ví dụ "我想", "上站".)
 */
export function makeTokenizer(vocab: Set<string>, vi: Map<string, string>) {
  return function tokenize(zh: string): { tokens: Tok[]; pinyin: string } {
    const chars = [...zh];
    // pinyin-pro cho đúng một phần tử mỗi ký tự (kể cả dấu câu), xử lý sẵn biến điệu (不/一) và chữ đa âm.
    const syl = pinyin(zh, { toneType: 'symbol', type: 'array' }) as string[];
    if (syl.length !== chars.length) throw new Error(`pinyin lệch độ dài cho: ${zh}`);

    const tokens: Tok[] = [];
    for (let i = 0; i < chars.length; ) {
      if (!isHan(chars[i])) {
        tokens.push({ t: chars[i], x: true });
        i++;
        continue;
      }
      let len = 0;
      for (let n = Math.min(4, chars.length - i); n >= 2; n--) {
        if (vocab.has(chars.slice(i, i + n).join(''))) {
          len = n;
          break;
        }
      }
      if (!len) len = 1;
      const t = chars.slice(i, i + len).join('');
      tokens.push({ t, p: erhua(t, syl.slice(i, i + len).join('')), v: vi.get(t) });
      i += len;
    }
    return { tokens, pinyin: renderPinyin(tokens) };
  };
}

/** Từ có đuôi 儿 (哪儿, 点儿...) ghi "r" như các bài cũ; trừ những từ mà 儿 là một âm riêng (女儿...). */
const REAL_ER = /女儿|婴儿|孤儿|男儿|儿女|儿童/;
function erhua(word: string, py: string): string {
  if ([...word].length > 1 && word.endsWith('儿') && !REAL_ER.test(word)) return py.replace(/ér$|er$/, 'r');
  return py;
}

/** Pinyin của cả câu: nhóm theo từ, dấu câu đổi sang dạng thường, viết hoa đầu câu (giống các bài cũ). */
export function renderPinyin(tokens: Tok[]): string {
  let out = '';
  let cap = true;
  for (const t of tokens) {
    if (t.x) {
      if (t.t === '“') {
        out += (out && !out.endsWith(' ') ? ' ' : '') + '“';
        cap = true;
        continue;
      }
      const p = PUNCT[t.t] ?? t.t;
      out += p;
      if ('.?!'.includes(p)) cap = true;
      continue;
    }
    let s = t.p ?? '';
    if (cap) {
      s = s.charAt(0).toUpperCase() + s.slice(1);
      cap = false;
    }
    out += (out && !out.endsWith('“') && !out.endsWith(' ') ? ' ' : '') + s;
  }
  return out;
}
