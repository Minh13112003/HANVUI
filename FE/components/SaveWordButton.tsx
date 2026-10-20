'use client';
// Nút Lưu vào / Bỏ khỏi Sổ tay cho một từ (từ khóa sự kiện đã giải không tự lưu, người học tự chọn).
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useUi } from '@/lib/ui';

export default function SaveWordButton({ zh, lessonId, className = 'btn sm' }: { zh: string; lessonId?: string; className?: string }) {
  const { toast } = useUi();
  const [savedId, setSavedId] = useState<number | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<{ savedId: number | null }>('/words/lookup?zh=' + encodeURIComponent(zh))
      .then((r) => setSavedId(r.savedId))
      .catch(() => setSavedId(null));
  }, [zh]);

  const toggle = async () => {
    setBusy(true);
    try {
      if (savedId != null) {
        await api('/notebook/' + savedId, { method: 'DELETE' });
        setSavedId(null);
        toast('Đã bỏ "' + zh + '" khỏi Sổ tay');
      } else {
        const row = await api<{ id: number }>('/notebook', { method: 'POST', body: { zh, lessonId } });
        setSavedId(row.id);
        toast('Đã lưu "' + zh + '" vào Sổ tay');
      }
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Không lưu được');
    } finally {
      setBusy(false);
    }
  };

  return (
    <button className={className + (savedId != null ? '' : ' primary')} disabled={busy || savedId === undefined} onClick={toggle}>
      {savedId != null ? '✓ Đã lưu · Bỏ khỏi Sổ tay' : '+ Lưu vào Sổ tay'}
    </button>
  );
}
