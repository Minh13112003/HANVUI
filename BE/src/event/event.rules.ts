// Luật sự kiện (rule.md mục 5) dưới dạng hàm thuần, không đụng database.

export const CHAPTERS = 4;
export const SLOTS_PER_CHAPTER = 12;
export const TOTAL_KEYS = CHAPTERS * SLOTS_PER_CHAPTER; // 48
export const HINT_COST = 1;

/** Điểm khi đoán đúng theo số gợi ý đã mở (0 = chưa mở gợi ý nào: không được đoán). */
export const SCORE_BY_HINTS = [0, 230, 200, 150] as const;
export const EARLY_BONUS = 30;

/** Huy chương theo % tổng số từ khóa, làm tròn lên: Đồng, Bạc, Vàng, Ngọc. */
export const MEDAL_RATIOS = [0.1, 0.3, 0.6, 0.9] as const;
export const MEDAL_NAMES = ['Đồng', 'Bạc', 'Vàng', 'Ngọc'] as const;

export const medalNeed = (ratio: number, total = TOTAL_KEYS) => Math.ceil(total * ratio - 1e-9);
export const medalThresholds = (total = TOTAL_KEYS) => MEDAL_RATIOS.map((r) => medalNeed(r, total));

/** 0 = chưa đạt, 1..4 = Đồng..Ngọc. */
export function medalFor(solved: number, total = TOTAL_KEYS): number {
  let m = 0;
  medalThresholds(total).forEach((need, i) => {
    if (solved >= need) m = i + 1;
  });
  return m;
}

// ───────────── Lịch (ngày 1-based trong tháng) ─────────────

/** Chương (1..4) của ngày; null nếu là ngày dự trữ (29-31). */
export const chapterOfDay = (day: number): number | null => (day <= 28 ? Math.floor((day - 1) / 7) + 1 : null);
export const isReserveDay = (day: number) => day >= 29;
export const isMonthEndBonusDay = (day: number) => day >= 26 && day <= 28;

/** Số ô đã mở của chương `chapter` vào ngày `day`: 6/9/12 trong tuần, đủ 12 khi tuần qua, 0 khi chưa tới. */
export function cellsOpen(chapter: number, day: number): number {
  const cur = chapterOfDay(day);
  if (cur === null || chapter < cur) return SLOTS_PER_CHAPTER;
  if (chapter > cur) return 0;
  const d = (day - 1) % 7; // 0..6
  return [6, 9, 12][Math.min(d, 2)];
}

/** Ngày (1-based trong tháng) mà ô vị trí `pos` (0..11) của chương mở. */
export const unlockDay = (chapter: number, pos: number) =>
  (chapter - 1) * 7 + (pos < 6 ? 1 : pos < 9 ? 2 : 3);

/** Số hồi đã mở khi giải `solvedInChapter` ô của chương (3 ô mỗi hồi). */
export const hoiOpened = (solvedInChapter: number) => Math.min(4, Math.floor(solvedInChapter / 3));

// ───────────── Đoán sai ─────────────

export const LOCK_MS = 15 * 60_000;
const PENALTY_TIERS = [20, 30, 40];

export interface WrongOutcome {
  wrong: number;
  left: number;
  /** Điểm phạt cộng thêm vào khoản chờ trừ. */
  addPenalty: number;
  lockMs: number;
}

/** Xử lý một lần đoán sai. `wrong` là số lần sai TRƯỚC lần này. */
export function onWrongGuess(wrong: number): WrongOutcome {
  const w = wrong + 1;
  const left = w % 3 === 0 ? 3 : 3 - (w % 3); // đủ nhóm 3: trả lại 3 lượt đoán
  let addPenalty = 0;
  let lockMs = 0;
  if (w <= 9) {
    if (w % 3 === 0) addPenalty = PENALTY_TIERS[w / 3 - 1];
  } else if ((w - 9) % 3 === 0) {
    lockMs = LOCK_MS; // từ lần sai thứ 10, mỗi 3 lần sai khóa 15 phút (không trừ thêm)
  }
  return { wrong: w, left, addPenalty, lockMs };
}

/** Điểm nhận được khi đoán đúng. `penalty` là điểm phạt đang chờ trừ. */
export function pointsFor(hintsOpened: number, early: boolean, penalty: number): number {
  const base = SCORE_BY_HINTS[Math.min(Math.max(hintsOpened, 0), 3)];
  return Math.max(0, base + (early ? EARLY_BONUS : 0) - penalty);
}

// ───────────── Nhiệm vụ, lượt ─────────────

export const DAILY = {
  login: 1,
  lessonsNeeded: 2,
  lessons: 2,
  onlineSec: 30 * 60,
  online: 1,
} as const;

/** Bit nhiệm vụ ngày đã nhận. */
export const BIT = { login: 1, lessons: 2, online: 4, practice: 8 } as const;

export interface WeeklyTask {
  key: 'login' | 'online' | 'lessons';
  marks: [number, number, number];
  rewards: [number, number, number];
}
export const WEEKLY: WeeklyTask[] = [
  { key: 'login', marks: [3, 5, 7], rewards: [2, 3, 2] },
  { key: 'online', marks: [7200, 10800, 14400], rewards: [2, 3, 2] },
  { key: 'lessons', marks: [6, 10, 14], rewards: [2, 3, 2] },
];

/** Số lượt thưởng mới (chưa nhận) của nhiệm vụ tuần, và bit mốc mới. Mỗi nhiệm vụ 3 bit. */
export function weeklyClaim(
  progress: Record<WeeklyTask['key'], number>,
  claimedBits: number,
): { tokens: number; bits: number } {
  let tokens = 0;
  let bits = claimedBits;
  WEEKLY.forEach((t, ti) => {
    t.marks.forEach((mark, mi) => {
      const bit = 1 << (ti * 3 + mi);
      if (progress[t.key] >= mark && !(bits & bit)) {
        bits |= bit;
        tokens += t.rewards[mi];
      }
    });
  });
  return { tokens, bits };
}

export const ABSENCE_PER_DAY = 2;
export const ABSENCE_MAX_DAYS = 6;

/** Bù ngày vắng khi đăng nhập lại: 2 × min(6, số ngày vắng). Ngày vắng = hiệu ngày trừ 1. */
export function absenceBonus(lastLoginDay: number, today: number): number {
  const missed = Math.max(0, today - lastLoginDay - 1);
  return ABSENCE_PER_DAY * Math.min(ABSENCE_MAX_DAYS, missed);
}

export const MONTH_END_LOGIN = 3;
export const RESERVE_LOGIN = 3;

/** Gói theo kịp (một lần): vào ngày 8-14 → 12, 15-21 → 24, 22-28 → 12, còn lại 0. */
export function catchUpPack(joinDay: number): number {
  if (joinDay >= 8 && joinDay <= 14) return 12;
  if (joinDay >= 15 && joinDay <= 21) return 24;
  if (joinDay >= 22 && joinDay <= 28) return 12;
  return 0;
}

/** Tuần (0..3) của ngày, hoặc 3 cho ngày dự trữ (tiến độ tuần 4 giữ nguyên, không có tuần 5). */
export const weekIndex = (day: number) => Math.min(3, Math.floor((day - 1) / 7));

export const VIP_ITEM_DAYS = 90; // hạn mở vật phẩm VIP 3 ngày (số chính thức quyết sau)
export const VIP_GRANT_DAYS = 3;
