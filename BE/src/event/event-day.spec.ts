import { afterEach, describe, expect, it } from 'vitest';
import { eventDay, pinnedMonth } from './event-day.js';

const nov5 = new Date('2026-11-05T05:00:00Z');

describe('eventDay', () => {
  const saved = process.env.EVENT_PINNED_MONTH;
  afterEach(() => {
    if (saved === undefined) delete process.env.EVENT_PINNED_MONTH;
    else process.env.EVENT_PINNED_MONTH = saved;
  });

  it('không giữ truyện thì chạy theo tháng thật', () => {
    delete process.env.EVENT_PINNED_MONTH;
    expect(eventDay(nov5)).toMatchObject({ monthKey: '2026-11', cycle: '2026-11', day: 5, key: '2026-11-05' });
  });

  it('giữ truyện thì đổi khóa sự kiện, ngày và tháng thật giữ nguyên', () => {
    process.env.EVENT_PINNED_MONTH = '2026-10';
    expect(eventDay(nov5)).toMatchObject({ monthKey: '2026-10', cycle: '2026-11', day: 5, key: '2026-11-05' });
  });

  it('giá trị sai hoặc trống coi như không giữ', () => {
    for (const v of ['', '  ', '2026-1', 'thang10']) {
      process.env.EVENT_PINNED_MONTH = v;
      expect(pinnedMonth()).toBeNull();
    }
  });
});
