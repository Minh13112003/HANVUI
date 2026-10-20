'use client';
// Khung báo nhận quà (thư có quà, nhận tất cả, mã quà). Hiện giữa màn hình, bấm nút hoặc nền tối để đóng.
import { useEffect, useState } from 'react';
import { Confetti } from './Bits';

export interface RewardInfo {
  /** Nguồn quà, ví dụ "Thư: Thư chúc mừng 20/10" hoặc "Mã quà HV999LUOT". */
  source: string;
  tokens?: number;
  /** Số vật phẩm VIP 3 ngày (vào Túi đồ). */
  vip?: number;
}

export default function RewardDialog({ info, onClose }: { info: RewardInfo | null; onClose: () => void }) {
  const [burst, setBurst] = useState(0);
  useEffect(() => {
    if (info) setBurst((b) => b + 1);
  }, [info]);
  useEffect(() => {
    if (!info) return;
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [info, onClose]);

  if (!info) return <Confetti burst={burst} />;
  return (
    <div className="rwd-back" onClick={onClose}>
      <Confetti burst={burst} />
      <div className="rwd" role="dialog" aria-modal="true" aria-labelledby="rwd-t" onClick={(e) => e.stopPropagation()}>
        <div className="rwd-ico" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9h18v4H3zM5 13v8h14v-8M12 9v12M12 9c-1.5-3-5-4-5-1.5S10 9 12 9zM12 9c1.5-3 5-4 5-1.5S14 9 12 9z" />
          </svg>
        </div>
        <h2 id="rwd-t">Nhận quà thành công</h2>
        <small className="muted">{info.source}</small>
        <div className="rwd-list">
          {info.tokens ? (
            <div className="rwd-item">
              <b>+{info.tokens}</b>
              <span>lượt gợi ý sự kiện</span>
            </div>
          ) : null}
          {info.vip ? (
            <div className="rwd-item">
              <b>+{info.vip}</b>
              <span>VIP 3 ngày · đã vào Túi đồ, bấm mở để dùng</span>
            </div>
          ) : null}
        </div>
        <button className="btn primary" onClick={onClose} autoFocus>
          Tuyệt vời
        </button>
      </div>
    </div>
  );
}
