import { createHash } from 'node:crypto';

/** Thứ tự ô riêng của từng người: xáo theo mã người dùng (rule.md 5.3). Cùng người, cùng tháng thì luôn cùng thứ tự. */
export function orderSlots<T extends { id: number }>(userId: string, month: string, slots: T[]): T[] {
  const key = (id: number) => createHash('sha256').update(`${userId}|${month}|${id}`).digest('hex');
  return [...slots].sort((a, b) => (key(a.id) < key(b.id) ? -1 : 1));
}
