import { describe, expect, it } from 'vitest';
import { compareSpeech } from './compare.js';

describe('so câu đọc với câu mẫu', () => {
  it('đọc đúng hết', () => {
    const r = compareSpeech('我想喝咖啡。', '我想喝咖啡');
    expect(r.score).toBe(100);
    expect(r.syllables.every((s) => s.verdict === 'ok')).toBe(true);
  });

  it('máy chọn chữ đồng âm vẫn tính đúng', () => {
    const r = compareSpeech('咖啡', '咖非');
    expect(r.syllables[1].verdict).toBe('homophone');
    expect(r.score).toBe(100);
  });

  it('cùng âm khác thanh là sai thanh điệu (nửa điểm), khác âm là sai âm', () => {
    const tone = compareSpeech('妈', '马');
    expect(tone.syllables[0].verdict).toBe('tone');
    expect(tone.score).toBe(50);
    const sound = compareSpeech('茶', '书');
    expect(sound.syllables[0].verdict).toBe('sound');
    expect(sound.score).toBe(0);
  });

  it('thiếu và thừa âm tiết', () => {
    const miss = compareSpeech('我喜欢你', '我喜你');
    expect(miss.counts.missing).toBe(1);
    expect(miss.score).toBe(75);
    const extra = compareSpeech('你好', '你好吗');
    expect(extra.counts.extra).toBe(1);
    expect(extra.score).toBe(100);
  });
});
