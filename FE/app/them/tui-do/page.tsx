'use client';
// Túi đồ: vật phẩm thưởng (VIP 3 ngày ở mốc Ngọc). Bấm mở thì kích hoạt và đếm ngược (rule.md mục 5.10).
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useUi } from '@/lib/ui';
import type { InventoryItem } from '@/lib/types';

const d = (s: string) => new Date(s).toLocaleDateString('vi-VN');

export default function BagPage() {
  const { user, reload } = useAuth();
  const { toast } = useUi();
  const [items, setItems] = useState<InventoryItem[] | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () =>
    api<InventoryItem[]>('/event/inventory')
      .then(setItems)
      .catch(() => setItems([]));

  useEffect(() => {
    if (!user) return;
    load();
  }, [user]);

  const open = async (it: InventoryItem) => {
    setBusy(true);
    try {
      const r = await api<{ vipUntil: string }>('/event/inventory/' + it.id + '/open', { method: 'POST' });
      toast('VIP có hiệu lực tới ' + d(r.vipUntil));
      await reload();
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Không mở được');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell title="Túi đồ">
      <div className="stack">
        <div className="sec-h">
          <h1>Túi đồ</h1>
          {items ? <span className="pill">{items.length} vật phẩm</span> : null}
        </div>

        {items?.map((it) => {
          const expired = !it.openedAt && new Date(it.expiresAt) < new Date();
          return (
            <div className={'bagitem' + (it.openedAt || expired ? ' used' : '')} key={it.id}>
              <span className="bag-ic" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="9" r="5" />
                  <path d="m9 13-1 7 4-2 4 2-1-7M12 6.5l.8 1.6 1.7.2-1.2 1.2.3 1.7-1.6-.8-1.6.8.3-1.7-1.2-1.2 1.7-.2z" />
                </svg>
              </span>
              <span className="grow">
                <b>{it.kind === 'VIP_3D' ? 'Thẻ VIP 3 ngày' : it.kind}</b>
                <small className="muted" style={{ display: 'block' }}>
                  Nhận {d(it.receivedAt)}
                  {it.source ? ' · ' + it.source : ''}
                  {it.openedAt ? ' · đã mở ' + d(it.openedAt) : expired ? ' · đã hết hạn' : ' · mở trước ' + d(it.expiresAt)}
                </small>
              </span>
              <button className="btn primary sm" disabled={busy || !!it.openedAt || expired} onClick={() => open(it)}>
                {it.openedAt ? 'Đã mở' : expired ? 'Hết hạn' : 'Mở'}
              </button>
            </div>
          );
        })}

        {items && !items.length ? (
          <div className="card empty center">
            <p className="muted">Túi đồ trống. Giải 90% số từ khóa của sự kiện (mốc Ngọc) để nhận thẻ VIP 3 ngày.</p>
            <Link className="btn primary sm" href="/su-kien">
              Xem sự kiện
            </Link>
          </div>
        ) : null}

        {items === null ? <p className="muted">Đang tải…</p> : null}
      </div>
    </Shell>
  );
}
