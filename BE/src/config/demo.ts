// Cờ riêng cho BẢN DEMO. Khi phát hành thật: đặt EVENT_OPEN_ALL=false và DEMO_STARTER_TOKENS=0 (hoặc xóa hai dòng
// trong .env, mặc định là tắt); muốn gỡ hẳn khỏi mã thì xóa file này và các chỗ gọi `demo.` (tìm "demo.").
// Đọc lúc gọi (không đọc một lần) để kiểm thử đổi được.
export const demo = {
  /** Mở sẵn mọi ô từ khóa của mọi chương, không khóa theo ngày/tuần. Các luật còn lại giữ nguyên. */
  get openAll(): boolean {
    return process.env.EVENT_OPEN_ALL?.trim() === 'true';
  },
  /** Số lượt gợi ý tặng khi tạo tài khoản (cả lượt sự kiện lẫn lượt kho lưu trữ). 0 = không tặng. */
  get starterTokens(): number {
    const n = Math.floor(Number(process.env.DEMO_STARTER_TOKENS ?? 0));
    return Number.isFinite(n) && n > 0 ? n : 0;
  },
};
