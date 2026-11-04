'use client';
// Phần nội dung làm mờ khi ôn tập: thấy có nội dung nhưng chưa đọc được, bấm vào mới mở (rule.md mục 3.2).
import type { ReactNode } from 'react';

export default function RevealBlur({ open, onOpen, label, children }: { open: boolean; onOpen: () => void; label: string; children: ReactNode }) {
  if (open) return <>{children}</>;
  return (
    <div className="rv-wrap">
      <div className="rv-body stack" aria-hidden="true" inert>
        {children}
      </div>
      <button type="button" className="rv-cover" onClick={onOpen}>
        <span>{label}</span>
      </button>
    </div>
  );
}
