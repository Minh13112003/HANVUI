import { describe, expect, it } from 'vitest';
import { gradeVi2Zh, gradeZh2Vi, parseChunks } from './translate.grade.js';

const bi = parseChunks('哥哥=anh trai|anh / 比我=hơn tôi|hơn mình|so với tôi / 高=cao');

describe('chấm luyện dịch', () => {
  it('Trung → Việt: chấm theo cụm, không bắt đúng thứ tự', () => {
    expect(gradeZh2Vi('Anh trai cao hơn tôi.', bi).verdict).toBe('ok');
    expect(gradeZh2Vi('anh trai so với tôi cao', bi).verdict).toBe('ok'); // dịch sát chữ vẫn đủ ý
    const r = gradeZh2Vi('Anh trai cao.', bi);
    expect(r.verdict).toBe('close');
    expect(r.chunks.find((c) => c.zh === '比我')!.ok).toBe(false);
    expect(gradeZh2Vi('', bi).verdict).toBe('empty');
  });

  it('khớp nguyên từ, không khớp nửa từ; cụm "-" không bắt buộc', () => {
    const c = parseChunks('他=anh / 很=rất|- / 忙=bận');
    expect(gradeZh2Vi('thanh bận', c).chunks[0].ok).toBe(false);
    expect(gradeZh2Vi('anh bận', c).verdict).toBe('ok');
  });

  it('Việt → Trung: đúng nguyên câu hoặc cách viết khác; không thì chỉ cụm thiếu', () => {
    expect(gradeVi2Zh('哥哥比我高。', '哥哥比我高。', [], bi).verdict).toBe('ok');
    expect(gradeVi2Zh('我哥哥比我高', '哥哥比我高。', ['我哥哥比我高'], bi).exact).toBe(true);
    const r = gradeVi2Zh('哥哥高', '哥哥比我高。', [], bi);
    expect(r.exact).toBe(false);
    expect(r.chunks.filter((x) => !x.ok).map((x) => x.zh)).toEqual(['比我']);
  });
});
