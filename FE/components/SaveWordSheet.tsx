'use client';
// Bài đọc chưa trả lời xong: chạm từ chỉ để lưu, chưa hiện pinyin và nghĩa (rule.md mục 3.5).
import { useState } from 'react';
import { api } from '@/lib/api';
import { useUi } from '@/lib/ui';

export default function SaveWordSheet({ zh, lessonId }: { zh: string; lessonId: string }) {
  const { toast } = useUi();
  const [saved, setSaved] = useState(false);
  const save = async () => {
    try {
      await api('/notebook', { method: 'POST', body: { zh, lessonId } });
      setSaved(true);
      toast('Đã lưu "' + zh + '"');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Không lưu được');
    }
  };
  return (
    <div className="stack">
      <div className="han" style={{ fontSize: 40, fontWeight: 700, textAlign: 'center' }}>
        {zh}
      </div>
      <p className="muted" style={{ fontSize: 13, textAlign: 'center' }}>
        Trả lời xong câu hỏi của bài sẽ xem được pinyin và nghĩa.
      </p>
      <button className="btn primary" disabled={saved} onClick={save}>
        {saved ? 'Đã lưu vào Sổ tay' : 'Lưu vào Sổ tay'}
      </button>
    </div>
  );
}
