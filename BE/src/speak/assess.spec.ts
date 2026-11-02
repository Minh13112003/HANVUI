import { describe, expect, it } from 'vitest';
import { WAV_RATE, combine, rate, readAssessment, wavSeconds } from './assess.js';

const wav = (seconds: number, opts: { rate?: number; channels?: number } = {}) => {
  const data = Math.round(seconds * WAV_RATE) * 2;
  const b = Buffer.alloc(44 + data);
  b.write('RIFF', 0, 'latin1');
  b.writeUInt32LE(36 + data, 4);
  b.write('WAVE', 8, 'latin1');
  b.write('fmt ', 12, 'latin1');
  b.writeUInt32LE(16, 16);
  b.writeUInt16LE(1, 20);
  b.writeUInt16LE(opts.channels ?? 1, 22);
  b.writeUInt32LE(opts.rate ?? WAV_RATE, 24);
  b.writeUInt32LE((opts.rate ?? WAV_RATE) * 2, 28);
  b.writeUInt16LE(2, 32);
  b.writeUInt16LE(16, 34);
  b.write('data', 36, 'latin1');
  b.writeUInt32LE(data, 40);
  return b;
};

// Rút gọn từ kết quả thật của Azure khi thử ngày 02/11/2026.
const result = (accuracy: number, words: { Word: string; AccuracyScore: number; ErrorType?: string; Phonemes?: { AccuracyScore: number }[] }[]) => ({
  RecognitionStatus: 'Success',
  NBest: [{ AccuracyScore: accuracy, Words: words }],
});

describe('wavSeconds', () => {
  it('đọc đúng số giây', () => expect(wavSeconds(wav(1.5))).toBeCloseTo(1.5));
  it('từ chối file không phải WAV', () => expect(typeof wavSeconds(Buffer.alloc(100))).toBe('string'));
  it('từ chối sai tần số hoặc nhiều kênh', () => {
    expect(typeof wavSeconds(wav(1, { rate: 44100 }))).toBe('string');
    expect(typeof wavSeconds(wav(1, { channels: 2 }))).toBe('string');
  });
  it('không tin kích thước ghi trong đầu file khi file bị cắt', () => expect(wavSeconds(wav(2).subarray(0, 44 + WAV_RATE * 2))).toBeCloseTo(1));
});

describe('readAssessment', () => {
  it('không nghe thấy gì thì trả null', () => {
    expect(readAssessment({ RecognitionStatus: 'InitialSilenceTimeout' })).toBeNull();
    expect(readAssessment({ RecognitionStatus: 'Success', NBest: [{}] })).toBeNull();
  });
  it('tách điểm từng chữ, chữ bị bỏ sót tính 0', () => {
    const a = readAssessment(result(75, [{ Word: '喝', AccuracyScore: 100, Phonemes: [{ AccuracyScore: 98 }] }, { Word: '咖啡', AccuracyScore: 0, ErrorType: 'Omission', Phonemes: [] }]));
    expect(a).toEqual({ accuracy: 75, chars: [{ zh: '喝', accuracy: 98 }, { zh: '咖', accuracy: 0 }, { zh: '啡', accuracy: 0 }] });
  });
});

describe('combine', () => {
  const laoshi = readAssessment(result(94, [{ Word: '老师', AccuracyScore: 94, Phonemes: [{ AccuracyScore: 100 }, { AccuracyScore: 79 }] }]))!;

  it('đọc đúng: giữ điểm cao, xếp Chuẩn', () => {
    const r = combine('老师', laoshi, '老师。');
    expect(r).toMatchObject({ score: 97, rating: 'good', toneChecked: true });
    expect(r.syllables.map((s) => [s.verdict, s.accuracy])).toEqual([['ok', 100], ['ok', 79]]);
  });

  it('sai thanh: Azure cho 94 nhưng không được xếp Chuẩn', () => {
    const r = combine('老师', laoshi, '捞屎。');
    expect(r.score).toBe(72);
    expect(r.rating).toBe('fair');
    expect(r.syllables.map((s) => s.verdict)).toEqual(['tone', 'tone']);
  });

  it('một chữ đọc đúng mà Azure chấm thấp vẫn được Chuẩn, đọc sai thanh thì không', () => {
    const mai = readAssessment(result(64, [{ Word: '买', AccuracyScore: 64, Phonemes: [{ AccuracyScore: 59 }] }]))!;
    expect(combine('买', mai, '买。')).toMatchObject({ score: 82, rating: 'good' });
    expect(combine('买', mai, '卖。')).toMatchObject({ score: 57, rating: 'poor' });
  });

  it('đọc thừa chữ thì không được Chuẩn', () => {
    const a = readAssessment(result(100, [{ Word: '你好', AccuracyScore: 100 }]))!;
    expect(combine('你好', a, '你好吗。').score).toBe(79);
  });

  it('lớp nhận dạng lỗi: chỉ còn điểm Azure và ghi rõ chưa kiểm thanh', () => {
    expect(combine('老师', laoshi, null)).toMatchObject({ score: 94, toneChecked: false });
  });

  it('thang đánh giá', () => {
    expect([rate(80), rate(79), rate(60), rate(59)]).toEqual(['good', 'fair', 'fair', 'poor']);
  });
});
