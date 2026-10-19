/**
 * Quy đổi gần đúng cấp HSK 3.0 sang cấp HSK 2.0 theo số từ tích lũy (rule.md mục 2):
 * 3.0·1 (300 từ) ≈ 2.0·2 (300) · 3.0·2 (500) ≈ 2.0·3 (600) · 3.0·3 (1.000) ≈ 2.0·4 (1.200)
 * 3.0·4 (2.000) ≈ 2.0·5 (2.500) · 3.0·5-9 ≈ 2.0·6. Chỉ để khóa/mở bài và chọn đề; người biết tiếng Trung cần duyệt.
 */
export const HSK3_TO_HSK2 = [2, 3, 4, 5, 6, 6, 6, 6, 6];

export const equivHsk2 = (standard: 'HSK2' | 'HSK3', level: number): number =>
  standard === 'HSK3' ? (HSK3_TO_HSK2[Math.min(Math.max(level, 1), 9) - 1] ?? 6) : Math.min(Math.max(level, 1), 6);
