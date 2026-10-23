import { describe, expect, it } from 'vitest';
import { hasPlainMeaning, meaningsOf, normZh, shareMeaning, viCorrect, zhCorrect } from './grade.js';

describe('chấm kiểm tra từ vựng', () => {
  it('nghĩa tiếng Việt: khớp một nghĩa, bỏ hoa/thường, dấu câu, ngoặc và "cái" ở đầu', () => {
    expect(viCorrect('Giờ', 'chút, giờ, chấm')).toBe(true);
    expect(viCorrect('  chấm. ', 'chút, giờ, chấm')).toBe(true);
    expect(viCorrect('cốc', 'cái cốc')).toBe(true);
    expect(viCorrect('cái bàn', 'bàn')).toBe(true);
    expect(viCorrect('một', 'một (cái, người)')).toBe(true);
    expect(viCorrect('trên', 'trên; lên')).toBe(true);
  });

  it('nghĩa tiếng Việt chấm cứng: sai dấu hoặc đồng nghĩa không có trong bảng là sai', () => {
    expect(viCorrect('gio', 'chút, giờ, chấm')).toBe(false);
    expect(viCorrect('ông ấy', 'anh ấy')).toBe(false);
    expect(viCorrect('ông ấy', 'anh ấy', ['ông ấy'])).toBe(true);
    expect(viCorrect('', 'anh ấy')).toBe(false);
  });

  it('Unicode tổ hợp (NFD) vẫn khớp', () => {
    expect(viCorrect('giờ'.normalize('NFD'), 'giờ')).toBe(true);
  });

  it('tiếng Trung chỉ nhận chữ Hán, phải đúng', () => {
    expect(zhCorrect('咖啡', '咖啡')).toBe(true);
    expect(zhCorrect(' 咖啡。', '咖啡')).toBe(true);
    expect(zhCorrect('kafei', '咖啡')).toBe(false);
    expect(zhCorrect('kāfēi', '咖啡')).toBe(false);
    expect(zhCorrect('咖', '咖啡')).toBe(false);
    expect(normZh('ni好')).toBeNull();
  });

  it('trợ từ không có nghĩa viết ra được; đồng nghĩa giữa hai từ', () => {
    expect(hasPlainMeaning('(trợ từ hoàn thành)')).toBe(false);
    expect(hasPlainMeaning('rất')).toBe(true);
    expect(meaningsOf('(trợ từ nghi vấn)').size).toBe(0);
    expect(shareMeaning('có thể (khả năng)', [], 'có thể, được', [])).toBe(true);
    expect(shareMeaning('ăn', [], 'uống', [])).toBe(false);
  });
});
