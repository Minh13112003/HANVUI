// Cấp HSK của từ và nhãn cấp của bài (rule.md mục 2). Dữ liệu cấp từ là BẢN CỘNG ĐỒNG (prisma/seed/hsk/README.md), cần người duyệt.
import { readFileSync } from 'node:fs';

let cache: Record<string, [number, number]> | null = null;

/** { từ: [cấp HSK 2.0, cấp HSK 3.0] }, 0 = không có trong chuẩn đó. Đọc từ file ở lần đầu cần tới. */
function levels(): Record<string, [number, number]> {
  // src/common và dist/common cùng độ sâu nên đường dẫn này đúng cả khi chạy thật.
  cache ??= JSON.parse(readFileSync(new URL('../../prisma/seed/hsk/hsk-levels.json', import.meta.url), 'utf8')) as Record<string, [number, number]>;
  return cache;
}

export const hskWords = () => Object.keys(levels());

const isHan = (ch: string) => /[一-鿿]/.test(ch);

/**
 * Cấp của một từ. Tra đúng từ trước; từ ghép không có trong danh sách (ví dụ 你好, 旅行者) thì tách thành
 * các phần dài nhất có trong danh sách và lấy cấp cao nhất — chỉ nhận khi mọi phần đều tra được.
 */
export function levelsOf(zh: string): { hsk2: number | null; hsk3: number | null; exact: boolean } {
  const LEVELS = levels();
  const direct = LEVELS[zh];
  if (direct) return { hsk2: direct[0] || null, hsk3: direct[1] || null, exact: true };

  const ch = [...zh].filter(isHan);
  if (!ch.length) return { hsk2: null, hsk3: null, exact: false };
  let a = 0;
  let b = 0;
  for (let i = 0; i < ch.length; ) {
    let hit: [number, number] | null = null;
    let len = 1;
    for (let n = Math.min(4, ch.length - i); n >= 1; n--) {
      const part = ch.slice(i, i + n).join('');
      if (LEVELS[part]) {
        hit = LEVELS[part];
        len = n;
        break;
      }
    }
    if (!hit) return { hsk2: null, hsk3: null, exact: false }; // còn phần chưa tra được thì không gán
    a = Math.max(a, hit[0]);
    b = Math.max(b, hit[1]);
    i += len;
  }
  return { hsk2: a || null, hsk3: b || null, exact: false };
}

/**
 * Nhãn của bài từ các từ trong bài: hsk2/hsk3 = cấp cao nhất (chỉ số tham khảo); hskShown = cấp hiển thị, giữ cấp đã soạn,
 * chỉ nâng khi HƠN 70% từ (tra được) thuộc cấp cao hơn, khi đó lấy cấp trung vị của nhóm từ cao hơn.
 */
export function lessonLabels(level: number, words: Iterable<string>) {
  let a = 0;
  let b = 0;
  let miss = 0;
  const seen = new Set(words);
  const lv2: number[] = [];
  for (const t of seen) {
    const l = levelsOf(t);
    if (l.hsk2 === null && l.hsk3 === null) {
      miss++;
      continue;
    }
    if (l.hsk2) lv2.push(l.hsk2);
    a = Math.max(a, l.hsk2 ?? 0);
    b = Math.max(b, l.hsk3 ?? 0);
  }
  const higher = lv2.filter((v) => v > level).sort((x, y) => x - y);
  const hskShown = lv2.length && higher.length / lv2.length > 0.7 ? higher[Math.floor(higher.length / 2)] : level;
  return { hsk2: a || null, hsk3: b || null, hskShown, words: seen.size, higher: higher.length, known: lv2.length, miss };
}
