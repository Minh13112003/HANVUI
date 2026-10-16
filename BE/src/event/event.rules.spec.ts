import {
  absenceBonus,
  catchUpPack,
  cellsOpen,
  hoiOpened,
  medalFor,
  medalThresholds,
  onWrongGuess,
  pointsFor,
  unlockDay,
  weeklyClaim,
} from './event.rules.js';

describe('luật sự kiện', () => {
  it('mốc huy chương của truyện 48 từ khóa là 5, 15, 29, 44', () => {
    expect(medalThresholds()).toEqual([5, 15, 29, 44]);
    expect(medalFor(4)).toBe(0);
    expect(medalFor(5)).toBe(1);
    expect(medalFor(29)).toBe(3);
    expect(medalFor(44)).toBe(4);
  });

  it('khóa ô theo ngày 6/3/3 trong tuần, tuần qua thì mở đủ', () => {
    expect(cellsOpen(1, 1)).toBe(6);
    expect(cellsOpen(1, 2)).toBe(9);
    expect(cellsOpen(1, 3)).toBe(12);
    expect(cellsOpen(1, 7)).toBe(12);
    expect(cellsOpen(2, 7)).toBe(0); // chương sau chưa tới
    expect(cellsOpen(2, 8)).toBe(6);
    expect(cellsOpen(1, 30)).toBe(12); // ngày dự trữ
    expect(unlockDay(2, 0)).toBe(8);
    expect(unlockDay(2, 8)).toBe(9);
    expect(unlockDay(2, 11)).toBe(10);
  });

  it('hồi mở khi đủ 3, 6, 9, 12 ô', () => {
    expect([0, 2, 3, 6, 11, 12].map(hoiOpened)).toEqual([0, 0, 1, 2, 3, 4]);
  });

  it('đoán sai: trừ 20/30/40 mỗi 3 lần, từ lần 10 khóa 15 phút mỗi 3 lần', () => {
    let wrong = 0;
    const penalties: number[] = [];
    const locks: number[] = [];
    for (let i = 1; i <= 15; i++) {
      const o = onWrongGuess(wrong);
      wrong = o.wrong;
      if (o.addPenalty) penalties.push(i);
      if (o.lockMs) locks.push(i);
    }
    expect(penalties).toEqual([3, 6, 9]);
    expect(locks).toEqual([12, 15]);
    expect([onWrongGuess(2).addPenalty, onWrongGuess(5).addPenalty, onWrongGuess(8).addPenalty]).toEqual([20, 30, 40]);
    expect([onWrongGuess(0).left, onWrongGuess(1).left, onWrongGuess(2).left]).toEqual([2, 1, 3]);
  });

  it('điểm: 230/200/150, +30 tìm sớm, trừ phạt, tối thiểu 0', () => {
    expect(pointsFor(1, false, 0)).toBe(230);
    expect(pointsFor(2, true, 0)).toBe(230);
    expect(pointsFor(3, false, 0)).toBe(150);
    expect(pointsFor(3, true, 90)).toBe(90);
    expect(pointsFor(3, false, 200)).toBe(0);
  });

  it('bù ngày vắng: +2 mỗi ngày, tối đa 12', () => {
    expect(absenceBonus(10, 11)).toBe(0);
    expect(absenceBonus(10, 12)).toBe(2);
    expect(absenceBonus(10, 14)).toBe(6);
    expect(absenceBonus(1, 30)).toBe(12);
  });

  it('gói theo kịp theo ngày tham gia', () => {
    expect([1, 7, 8, 14, 15, 21, 22, 28, 29].map(catchUpPack)).toEqual([0, 0, 12, 12, 24, 24, 12, 12, 0]);
  });

  it('nhiệm vụ tuần: mỗi mốc chỉ nhận một lần, tối đa 21 lượt', () => {
    const full = weeklyClaim({ login: 7, online: 14400, lessons: 14 }, 0);
    expect(full.tokens).toBe(21);
    expect(weeklyClaim({ login: 7, online: 14400, lessons: 14 }, full.bits).tokens).toBe(0);
    expect(weeklyClaim({ login: 3, online: 0, lessons: 6 }, 0).tokens).toBe(4);
  });
});
