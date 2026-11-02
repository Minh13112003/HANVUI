import { describe, expect, it } from 'vitest';
import { VOICE } from '../common/tokenize.js';
import { parseDraft, voicePlan } from './lesson-draft.js';

const good = () => ({
  title: 'Gọi món',
  situation: 'Ở quán ăn',
  level: 1,
  topics: ['an-uong'],
  roles: [
    { who: 'A', label: 'Khách', gender: 'f', pitchRange: 2 },
    { who: 'B', label: 'Phục vụ', gender: 'm', pitchRange: 2 },
  ],
  lines: [
    { who: 'A', zh: '你好。', vi: 'Xin chào.' },
    { who: 'B', zh: '你要什么？', vi: 'Bạn muốn gì?' },
  ],
  questions: [{ prompt: '她在哪儿？', promptVi: 'Cô ấy ở đâu?', options: [{ zh: '饭馆', vi: 'quán ăn' }, { zh: '学校', vi: 'trường' }], answer: 0 }],
});

describe('parseDraft', () => {
  it('bài đúng không có lỗi', () => {
    const { draft, errors } = parseDraft(good());
    expect(errors).toEqual([]);
    expect(draft.kind).toBe('DIALOG');
  });

  it('gom hết lỗi một lần', () => {
    const { errors } = parseDraft({});
    expect(errors.length).toBeGreaterThanOrEqual(5);
  });

  it('không nhận dữ liệu lạ', () => {
    expect(parseDraft(null).errors.length).toBeGreaterThan(0);
    expect(parseDraft('abc').errors.length).toBeGreaterThan(0);
    const d = good();
    expect(parseDraft({ ...d, lines: 'x', questions: [1, null] }).errors.length).toBeGreaterThan(0);
  });

  it('câu dùng vai chưa khai báo thì báo lỗi', () => {
    const d = good();
    d.lines[0].who = 'C';
    expect(parseDraft(d).errors.join()).toContain('vai "C"');
  });

  it('hai vai trùng cả giới tính lẫn khoảng giọng thì báo lỗi', () => {
    const d = good();
    d.roles[1].gender = 'f';
    expect(parseDraft(d).errors.join()).toContain('trùng cả giới tính');
  });

  it('đáp án đúng ngoài danh sách thì báo lỗi', () => {
    const d = good();
    d.questions[0].answer = 5;
    expect(parseDraft(d).errors.join()).toContain('ngoài danh sách');
  });

  it('bài đọc không cần vai, mọi câu thuộc người đọc', () => {
    const { draft, errors } = parseDraft({ ...good(), kind: 'READING', roles: [] });
    expect(errors).toEqual([]);
    expect(draft.lines.every((l) => l.who === 'N')).toBe(true);
  });

  it('phần tách từ phải khớp với chữ của câu', () => {
    const d = good() as ReturnType<typeof good> & { lines: { tokens?: object[] }[] };
    d.lines[0].tokens = [{ t: '你' }];
    expect(parseDraft(d).errors.join()).toContain('tách từ');
    d.lines[0].tokens = [{ t: '你好', p: 'nǐhǎo', v: 'chào' }, { t: '。', x: true }];
    const ok = parseDraft(d);
    expect(ok.errors).toEqual([]);
    expect(ok.draft.lines[0].tokens?.[0]).toEqual({ t: '你好', p: 'nǐhǎo', v: 'chào' });
  });
});

describe('voicePlan', () => {
  const voiceOf = (k: string) => VOICE[k];
  it('hai vai khác giọng giữ nguyên cao độ', () => {
    const p = voicePlan([{ who: 'A', gender: 'f', pitchRange: 3 }, { who: 'B', gender: 'm', pitchRange: 1 }], voiceOf);
    expect(p.get('A')).toEqual({ voice: 'zh-CN-XiaoyiNeural', pitch: '+0Hz' });
    expect(p.get('B')).toEqual({ voice: 'zh-CN-YunjianNeural', pitch: '+0Hz' });
  });
  it('hai vai cùng một giọng thì đổi cao độ', () => {
    const p = voicePlan([{ who: 'A', gender: 'f', pitchRange: 1 }, { who: 'B', gender: 'f', pitchRange: 2 }], voiceOf);
    expect(p.get('A')?.pitch).toBe('-12Hz');
    expect(p.get('B')?.pitch).toBe('+0Hz');
  });
});
