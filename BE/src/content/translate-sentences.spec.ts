import { describe, expect, it } from 'vitest';
import { SENTENCES } from '../../prisma/seed/content/translate-sentences.js';
import { gradeSentenceVi, gradeSentenceZh, sentenceErrors } from './translate.grade.js';

const find = (zh: string) => SENTENCES.find((s) => s.zh === zh)!;
const vi = (zh: string, a: string) => gradeSentenceVi(a, find(zh));

describe('mục Luyện dịch', () => {
  it('mọi câu soạn sẵn đều hợp lệ', () => {
    expect(SENTENCES.length).toBeGreaterThanOrEqual(24);
    expect(SENTENCES.flatMap((s) => sentenceErrors(s).map((e) => `${s.zh}: ${e}`))).toEqual([]);
  });

  it('Trung → Việt: nhận nhiều cách dịch, bắt sai thứ tự và thiếu ý', () => {
    const q = '哥哥比我高。';
    expect(vi(q, 'Anh trai cao hơn tôi.').verdict).toBe('ok');
    expect(vi(q, 'Anh cao hơn mình').verdict).toBe('ok');
    expect(vi(q, 'Anh trai hơn tôi cao').verdict).toBe('order');
    expect(vi(q, 'Tôi cao hơn anh trai').verdict).toBe('missing');
    const r = vi(q, 'Tôi anh trai cao');
    expect(r.verdict).toBe('missing');
    expect(r.missing).toEqual([1]);
    expect(r.extra).toEqual(['tôi']);
    expect(vi(q, 'anh trai cao hon toi').verdict).toBe('missing'); // phải đúng dấu
    expect(vi(q, 'Anh trai cao hơn tôi nhiều').verdict).toBe('near');
    expect(vi(q, ' ').verdict).toBe('empty');
  });

  it('từ không bắt buộc và từ đệm không làm sai câu', () => {
    const q = '这是妈妈昨天给我买的新衣服。';
    expect(vi(q, 'Đây là quần áo mới mẹ mua cho tôi hôm qua').verdict).toBe('ok');
    expect(vi(q, 'Đây là bộ quần áo mới mà hôm qua mẹ đã mua cho tôi').verdict).toBe('ok');
    expect(vi(q, 'Đây là mẹ hôm qua cho tôi mua mới quần áo').verdict).toBe('order');
  });

  it('Việt → Trung: đúng nguyên câu hoặc cách viết khác; sai thứ tự; thiếu từ', () => {
    const s = find('哥哥比我高。');
    const t = s.tokens.map((x) => x.zh);
    expect(gradeSentenceZh('哥哥比我高', s.zh, s.alt, t).verdict).toBe('ok');
    expect(gradeSentenceZh('我哥哥比我高', s.zh, s.alt, t).verdict).toBe('ok');
    expect(gradeSentenceZh('比我哥哥高', s.zh, s.alt, t).verdict).toBe('order');
    const m = gradeSentenceZh('哥哥高', s.zh, s.alt, t);
    expect(m.verdict).toBe('missing');
    expect(m.missing).toEqual([1]);
  });
});
