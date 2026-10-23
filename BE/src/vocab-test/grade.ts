// Chấm bài kiểm tra từ vựng (hàm thuần, có test). Chấm cứng theo yêu cầu chủ dự án (23/10/2026):
// - Phần tiếng Trung chỉ nhận CHỮ HÁN (không nhận pinyin), phải đúng từng chữ.
// - Phần tiếng Việt phải khớp MỘT nghĩa trong bảng từ (hoặc danh sách nghĩa chấp nhận thêm ở alt-meanings.ts);
//   chỉ bỏ qua hoa/thường, dấu câu, khoảng trắng thừa và chữ "cái/con/chiếc" ở đầu. Dấu tiếng Việt phải đúng.

const CLASSIFIER = /^(cái|con|chiếc) /;
const HAN = /\p{Script=Han}/u;

/** Chuẩn hóa một câu trả lời/nghĩa tiếng Việt để so sánh. */
export function normVi(s: string): string {
  return s
    .normalize('NFC')
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[.!?。！？"'“”‘’…:]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Tập nghĩa chấp nhận của một từ: tách theo dấu phẩy/chấm phẩy/gạch chéo, bỏ phần trong ngoặc. */
export function meaningsOf(vi: string, alt: readonly string[] = []): Set<string> {
  const out = new Set<string>();
  for (const part of [vi, ...alt]) {
    for (const m of part.replace(/\([^)]*\)/g, '').split(/[,;/，；]/)) {
      const x = normVi(m);
      if (!x) continue;
      out.add(x);
      out.add(x.replace(CLASSIFIER, ''));
    }
  }
  return out;
}

/** Từ không có nghĩa tiếng Việt viết ra được (trợ từ như 了, 吗: nghĩa chỉ nằm trong ngoặc). */
export const hasPlainMeaning = (vi: string) => meaningsOf(vi).size > 0;

export function viCorrect(answer: string, vi: string, alt: readonly string[] = []): boolean {
  const a = normVi(answer);
  if (!a) return false;
  const set = meaningsOf(vi, alt);
  return set.has(a) || set.has(a.replace(CLASSIFIER, ''));
}

/** Chỉ giữ chữ Hán. Trả về null khi câu trả lời có chữ cái/số (pinyin không được nhận). */
export function normZh(answer: string): string | null {
  const s = answer.normalize('NFC');
  if (/[A-Za-z0-9À-ɏ]/.test(s)) return null;
  return [...s].filter((c) => HAN.test(c)).join('');
}

export function zhCorrect(answer: string, zh: string): boolean {
  const a = normZh(answer);
  return !!a && a === normZh(zh);
}

/** Hai từ có chung ít nhất một nghĩa (để nhận từ đồng nghĩa khi đề cho tiếng Việt, ví dụ 会/能 "có thể"). */
export function shareMeaning(viA: string, altA: readonly string[], viB: string, altB: readonly string[]): boolean {
  const a = meaningsOf(viA, altA);
  for (const m of meaningsOf(viB, altB)) if (a.has(m)) return true;
  return false;
}
