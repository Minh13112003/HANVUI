// Khuôn dữ liệu nội dung chương 2-4 (soạn 19/10/2026, CHƯA QUA DUYỆT: người biết tiếng Trung cần kiểm chữ,
// bản dịch và độ phù hợp cấp độ trước khi công khai). Pinyin KHÔNG gõ tay: sinh bằng pinyin-pro lúc nạp.

/** [vai, chữ Hán, nghĩa tiếng Việt] */
export type Line = [who: string, zh: string, vi: string];

/** Câu hỏi nghe hiểu: q = [tiếng Trung, tiếng Việt], o = các lựa chọn [Trung, Việt], a = chỉ số đáp án đúng. */
export interface Q {
  q: [string, string];
  o: [string, string][];
  a: number;
}

export interface Level {
  title: string;
  situation: string;
  /** Tên vai hiển thị, ví dụ { A: 'Khách', B: 'Nhân viên' } */
  who: Record<string, string>;
  /** Giọng theo vai: g = giới tính, r = khoảng giọng (1 trầm, 2 vừa, 3 cao). Hai vai không trùng cả g lẫn r. */
  cast: Record<string, { g: 'm' | 'f'; r: 1 | 2 | 3 }>;
  lines: Line[];
  qs: Q[];
}

export interface Key {
  zh: string;
  vi: string;
  pos: string;
  /** Gợi ý chung (luôn hiện, rất mơ hồ). */
  g: [string, string];
  /** Gợi ý 2: bối cảnh chung chung. */
  h2: [string, string];
  /** Gợi ý 3: câu hỏi trực tiếp mà đáp án là từ khóa. */
  h3: [string, string];
}

export type Word = [zh: string, vi: string, pos: string];

export interface Base {
  /** Mã bài HSK 1; bản HSK 2 là `${id}2`. */
  id: string;
  /** Chủ đề tình huống của bài (tên tiếng Việt, khớp bảng chủ đề). */
  topics: string[];
  tags: string[];
  /** Chủ đề của gợi ý 1: tên tiếng Việt để lọc, và dạng tiếng Trung/Việt để hiện. */
  clue: { name: string; zh: string; vi: string };
  keys: [Key, Key, Key];
  words: Word[];
  lv1: Level;
  lv2: Level;
}

export interface Hoi {
  title: [zh: string, vi: string];
  lines: [zh: string, vi: string][];
  q: Q;
}

export interface Chapter {
  idx: number;
  title: string;
  /** Từ vựng của phần truyện (để chạm xem nghĩa). */
  words: Word[];
  bases: Base[];
  hoi: Hoi[];
}
