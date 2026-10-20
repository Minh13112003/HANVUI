'use client';
// Bảng hướng dẫn nút "?" của kỹ năng Viết. Chỉ hiện khi người dùng tự bấm "?", không tự bật để không làm phiền người đã quen.
import { useUi } from '@/lib/ui';

const ITEMS: { name: string; text: string }[] = [
  { name: 'Tập viết nét', text: 'Chọn một từ (ưu tiên từ trong Sổ tay). "Xem cách viết" cho thấy thứ tự nét; "Tập viết" để bạn tự viết bằng ngón tay. Quên nét tiếp theo thì bấm nút gợi ý: lần 1 chớp sáng nét, lần 2 chạy thử nét, lần 3 hiện cả chữ giây lát.' },
  { name: 'Ngữ pháp', text: 'Học từng điểm ngữ pháp theo cấp: công thức, giải thích, so sánh với tiếng Việt/tiếng Anh, lỗi hay gặp, ví dụ có pinyin và nghe, rồi luyện tập. Điểm thuộc cấp cao hơn cấp của bạn bị khóa. Có các nhóm như câu điều kiện, mệnh đề quan hệ, câu ước muốn, câu tường thuật.' },
  { name: 'Sắp xếp câu', text: 'Chạm các mảnh theo đúng thứ tự để thành câu; chạm lại mảnh trong hàng trả lời để bỏ ra. Bấm "Kiểm tra" khi đã xếp đủ.' },
  { name: 'Điền chữ', text: 'Chọn chữ còn thiếu trong câu. Chọn xong máy chấm ngay và hiện đáp án.' },
  { name: 'Chọn câu', text: 'Đọc câu tiếng Việt rồi chọn câu tiếng Trung đúng nghĩa.' },
  { name: 'Mẹo', text: 'Mỗi bộ có 8 câu, ưu tiên câu bạn chưa làm hoặc làm sai. Bài khóa ở cấp cao hơn sẽ mở khi bạn lên cấp.' },
];

export function WriteHelpButton() {
  const { openSheet } = useUi();
  return (
    <button className="icon-btn" aria-label="Hướng dẫn kỹ năng Viết" onClick={() => openSheet(<WriteHelp />)} style={{ fontWeight: 800 }}>
      ?
    </button>
  );
}

export default function WriteHelp() {
  const { closeSheet } = useUi();
  return (
    <div className="stack">
      <h2>Cách dùng kỹ năng Viết</h2>
      {ITEMS.map((it) => (
        <div key={it.name}>
          <b>{it.name}</b>
          <p className="muted">{it.text}</p>
        </div>
      ))}
      <button className="btn primary" onClick={closeSheet}>
        Đã hiểu
      </button>
    </div>
  );
}
