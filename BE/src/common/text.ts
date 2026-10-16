/** Bỏ dấu tiếng Việt, hạ chữ thường: dùng cho tìm kiếm. */
export const fold = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase();

/** Pinyin bỏ thanh điệu, khoảng trắng, dấu nháy: "kāfēi" / "ka fei" → "kafei" (ü → v). */
export const pinyinKey = (s: string) =>
  s
    .toLowerCase()
    .replace(/[üǖǘǚǜ]/g, 'v')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[\s'’-]/g, '');

const HAN = /[一-鿿]/;
// Đáp án sự kiện chỉ nhận chữ Hán hoặc pinyin (có/không dấu thanh). Chữ có dấu kiểu Việt (ê, ô, ơ, ư, ă, â, đ, ạ, ả, ã...) bị từ chối.
const ANSWER_OK = /^[一-鿿a-zA-ZüÜāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ\s'’-]+$/;

export const isChineseAnswer = (s: string) => ANSWER_OK.test(s);
export const hasHan = (s: string) => HAN.test(s);
