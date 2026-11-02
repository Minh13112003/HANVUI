import { vnDay, type VnDay } from '../common/time.js';

/**
 * Tháng của truyện đang được giữ chạy qua nhiều tháng (EVENT_PINNED_MONTH, ví dụ "2026-10"), null nếu chạy theo tháng dương lịch.
 * Đóng sự kiện: xóa biến rồi khởi động lại BE, truyện tự vào kho lưu trữ. Đọc lúc gọi để kiểm thử đổi được, như config/demo.ts.
 */
export function pinnedMonth(): string | null {
  const m = process.env.EVENT_PINNED_MONTH?.trim();
  return m && /^\d{4}-\d{2}$/.test(m) ? m : null;
}

export interface EventDay extends VnDay {
  /** Tháng dương lịch thật. Nhiệm vụ tuần và ngày đăng nhập đếm lại khi tháng này đổi, kể cả khi đang giữ truyện. */
  cycle: string;
}

/** Ngày theo sự kiện: `monthKey` là khóa của sự kiện (truyện và tiến độ), ngày trong tháng vẫn là ngày thật. */
export function eventDay(at: Date): EventDay {
  const d = vnDay(at);
  return { ...d, cycle: d.monthKey, monthKey: pinnedMonth() ?? d.monthKey };
}
