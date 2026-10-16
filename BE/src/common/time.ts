import { Injectable } from '@nestjs/common';

// Ngày nghiệp vụ đổi lúc 00:00 giờ Việt Nam (UTC+7, không có giờ mùa hè).
const VN_OFFSET_MS = 7 * 3600 * 1000;

export interface VnDay {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
  /** "2026-10-16" */
  key: string;
  /** "2026-10" */
  monthKey: string;
  /** Số ngày của tháng (28-31). */
  daysInMonth: number;
}

const pad = (n: number) => String(n).padStart(2, '0');

export function vnDay(at: Date): VnDay {
  const t = new Date(at.getTime() + VN_OFFSET_MS);
  const year = t.getUTCFullYear();
  const month = t.getUTCMonth() + 1;
  const day = t.getUTCDate();
  return {
    year,
    month,
    day,
    key: `${year}-${pad(month)}-${pad(day)}`,
    monthKey: `${year}-${pad(month)}`,
    daysInMonth: new Date(Date.UTC(year, month, 0)).getUTCDate(),
  };
}

/** Thời điểm 00:00 giờ VN của ngày `day` trong tháng "YYYY-MM". */
export function vnStartOf(monthKey: string, day: number): Date {
  const [y, m] = monthKey.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, day) - VN_OFFSET_MS);
}

/** So sánh tháng "YYYY-MM": âm nếu a trước b. */
export const compareMonth = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

/** Đồng hồ dùng chung, thay được trong kiểm thử. */
@Injectable()
export class Clock {
  now(): Date {
    return new Date();
  }
}
