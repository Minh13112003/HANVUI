// Tiện ích chữ: thanh điệu của pinyin, nhãn cấp HSK song song, vài hàm định dạng.

const TONES: Record<string, number> = {};
const marks = ['āēīōūǖ', 'áéíóúǘ', 'ǎěǐǒǔǚ', 'àèìòùǜ'];
marks.forEach((row, i) => [...row].forEach((ch) => (TONES[ch] = i + 1)));

/** Thanh điệu của một âm tiết pinyin: 1-4, hoặc 0 nếu thanh nhẹ. */
export function toneOf(syllable: string): number {
  for (const ch of syllable) if (TONES[ch]) return TONES[ch];
  return 0;
}

/** Tách pinyin theo khoảng trắng, giữ lại dấu câu. */
export const pinyinChunks = (pinyin: string) => pinyin.split(/\s+/).filter(Boolean);

/** Bỏ dấu thanh điệu: "nǐ hǎo" → "ni hao" (dùng khi so sánh đáp án gõ không dấu). */
export function plainPinyin(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-̏]/g, '')
    .replace(/ü/g, 'v')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

/** Nhãn song song hai chuẩn: "2.0·1 | 3.0·2" (rule.md mục 2). */
export function hskLabel(hsk2: number | null | undefined, hsk3: number | null | undefined): string {
  const a = hsk2 ? '2.0·' + hsk2 : '2.0·—';
  const b = hsk3 ? '3.0·' + hsk3 : '3.0·—';
  return a + ' | ' + b;
}

export const hasHan = (s: string) => /[一-鿿]/.test(s);

/** Chữ Hán khác nhau trong một đoạn (bảng ghép chữ cần ít nhất 21 chữ). */
export function hanChars(text: string): string[] {
  const out: string[] = [];
  for (const ch of text) if (/[一-鿿]/.test(ch) && !out.includes(ch)) out.push(ch);
  return out;
}

export function greeting(d = new Date()): string {
  const h = d.getHours();
  if (h < 11) return 'Chào buổi sáng';
  if (h < 13) return 'Chào buổi trưa';
  if (h < 18) return 'Chào buổi chiều';
  return 'Chào buổi tối';
}

export function minutes(sec: number): string {
  const m = Math.floor(sec / 60);
  if (m < 60) return m + ' phút';
  return Math.floor(m / 60) + ' giờ ' + (m % 60 ? (m % 60) + ' phút' : '').trim();
}

/** "2026-10-18" → "Hôm nay" / "Hôm qua" / "Thứ bảy, 18/10" (rule.md mục 3.7). */
export function dayLabel(key: string, today = new Date()): string {
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const [y, m, d] = key.split('-').map(Number);
  if (!y || !m || !d) return key;
  const x = new Date(y, m - 1, d);
  const diff = Math.round((t.getTime() - x.getTime()) / 86400000);
  if (diff === 0) return 'Hôm nay';
  if (diff === 1) return 'Hôm qua';
  const names = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  return names[x.getDay()] + ', ' + d + '/' + m;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const LEVEL_NAMES: Record<number, string> = { 1: 'HSK 1', 2: 'HSK 2', 3: 'HSK 3' };
