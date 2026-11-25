'use client';
// Tài khoản: hồ sơ, chuẩn và cấp HSK, làm đề lên cấp, nhập mã quà, giao diện, túi đồ, luật sự kiện, hướng dẫn.
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import RewardDialog, { type RewardInfo } from '@/components/RewardDialog';
import Shell from '@/components/Shell';
import { api, authApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { levelName, standardName } from '@/lib/text';
import { useUi } from '@/lib/ui';
import type { EventState, InventoryItem, MailCounts } from '@/lib/types';

type Theme = 'auto' | 'light' | 'dark';
/** Quy đổi gần đúng HSK 3.0 → 2.0 (xem BE/src/common/hsk.ts). */
const HSK3_TO_HSK2 = [2, 3, 4, 5, 6, 6, 6, 6, 6];

export default function MorePage() {
  const { user, setUser, signOut } = useAuth();
  const { toast } = useUi();
  const router = useRouter();
  const [theme, setTheme] = useState<Theme>('auto');
  const [busy, setBusy] = useState(false);
  const [code, setCode] = useState('');
  const [redeeming, setRedeeming] = useState(false);
  const [reward, setReward] = useState<RewardInfo | null>(null);
  const [mail, setMail] = useState<MailCounts | null>(null);
  const [ev, setEv] = useState<EventState | null>(null);
  const [bag, setBag] = useState<number | null>(null);
  const [codeOpen, setCodeOpen] = useState(false);

  useEffect(() => {
    api<MailCounts>('/mailbox/counts')
      .then(setMail)
      .catch(() => {});
    api<EventState>('/event')
      .then(setEv)
      .catch(() => {});
    api<InventoryItem[]>('/event/inventory')
      .then((l) => setBag(l.filter((i) => !i.openedAt).length))
      .catch(() => {});
  }, []);

  useEffect(() => {
    try {
      setTheme((localStorage.getItem('hv.theme') as Theme) || 'auto');
    } catch {
      /* trình duyệt chặn lưu: giữ mặc định */
    }
  }, []);

  const applyTheme = (t: Theme) => {
    setTheme(t);
    try {
      localStorage.setItem('hv.theme', t);
    } catch {
      /* vẫn đổi được trong phiên này */
    }
    if (t === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', t);
  };

  const levels = user?.hskStandard === 'HSK3' ? 9 : 6;
  const std = user?.hskStandard === 'HSK3' ? 'HSK3' : 'HSK2';
  const levelLabel = `${standardName(std)} · ${levelName(std, user?.hskLevel ?? 1)}`;

  const redeem = async () => {
    setRedeeming(true);
    try {
      const r = await api<{ tokens: number }>('/redeem', { method: 'POST', body: { code } });
      setReward({ source: 'Mã quà ' + code.replace(/\s+/g, '').toUpperCase(), tokens: r.tokens });
      setCode('');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Không nhận được quà');
    } finally {
      setRedeeming(false);
    }
  };

  const patch = async (body: { hskStandard?: string; hskLevel?: number }) => {
    setBusy(true);
    try {
      setUser(await authApi.patchMe(body));
      toast('Đã cập nhật');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Không cập nhật được');
    } finally {
      setBusy(false);
    }
  };

  const next = (user?.hskLevel ?? 1) + 1;
  const initial = (user?.displayName || '?').trim().charAt(0).toUpperCase();

  return (
    <Shell title="Tài khoản">
      <div className="stack acc">
        <section className="card acc-prof">
          <div className="acc-top">
            <span className="acc-av" aria-hidden="true">
              {initial}
            </span>
            <div className="grow" style={{ minWidth: 0 }}>
              <h1 className="acc-name">{user?.displayName}</h1>
              <div className="acc-sub">
                <span className="acc-lv">{levelLabel}</span>
                <small className="muted">{user?.email}</small>
              </div>
            </div>
          </div>
          <div className="acc-stats">
            <span>
              <b>
                <span aria-hidden="true">🔥</span> {ev?.week?.login ?? 0}
              </b>
              <small>Chuỗi ngày</small>
            </span>
            <span>
              <b>
                <span aria-hidden="true">💡</span> {ev?.tokens ?? 0}
              </b>
              <small>Gợi ý</small>
            </span>
            <span>
              <b>
                <span aria-hidden="true">⭐</span> {ev?.points ?? 0}
              </b>
              <small>Điểm sao</small>
            </span>
          </div>
        </section>

        <section className="card acc-set">
          <div className="row between">
            <h2>Cài đặt học tập</h2>
            <span className="acc-ico" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="m2 9 10-5 10 5-10 5zM6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5" />
              </svg>
            </span>
          </div>
          <div className="acc-row">
            <span className="acc-l">Chuẩn HSK</span>
            <div className="seg pillseg acc-seg" role="tablist" aria-label="Chuẩn HSK">
              <button className={user?.hskStandard === 'HSK2' ? 'on' : ''} role="tab" aria-selected={user?.hskStandard === 'HSK2'} disabled={busy} onClick={() => patch({ hskStandard: 'HSK2' })}>
                HSK 2.0
              </button>
              <button className={user?.hskStandard === 'HSK3' ? 'on' : ''} role="tab" aria-selected={user?.hskStandard === 'HSK3'} disabled={busy} onClick={() => patch({ hskStandard: 'HSK3' })}>
                HSK 3.0
              </button>
            </div>
          </div>
          <div className="acc-row">
            <span className="acc-l">
              Cấp hiện tại
              <small className="muted" style={{ display: 'block' }}>
                {user?.hskStandard === 'HSK3' ? `≈ ${levelName('HSK2', HSK3_TO_HSK2[Math.min(user.hskLevel, 9) - 1])} (HSK 2.0)` : levelName(std, user?.hskLevel ?? 1)}
              </small>
            </span>
            <span className="acc-step">
              <button aria-label="Hạ cấp" disabled={busy || (user?.hskLevel ?? 1) <= 1} onClick={() => patch({ hskLevel: (user?.hskLevel ?? 1) - 1 })}>
                −
              </button>
              <b>{levelName(std, user?.hskLevel ?? 1)}</b>
              <button aria-label="Lên cấp" disabled={busy || (user?.hskLevel ?? 1) >= levels} onClick={() => patch({ hskLevel: (user?.hskLevel ?? 1) + 1 })}>
                +
              </button>
            </span>
          </div>
        </section>

        <section className="card acc-theme">
          <div className="row" style={{ gap: 10, alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>Giao diện</h2>
            <span className="acc-badge">Biển & Trời</span>
          </div>
          <div className="seg pillseg acc-modes" role="radiogroup" aria-label="Giao diện">
            {(
              [
                { id: 'light', name: 'Sáng', d: 'M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z' },
                { id: 'dark', name: 'Tối', d: 'M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z' },
                { id: 'auto', name: 'Theo máy', d: 'M4 5h16v11H4zM9 20h6M12 16v4' },
              ] as { id: Theme; name: string; d: string }[]
            ).map((t) => (
              <button key={t.id} role="radio" aria-checked={theme === t.id} className={theme === t.id ? 'on' : ''} onClick={() => applyTheme(t.id)}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d={t.d} />
                </svg>
                {t.name}
              </button>
            ))}
          </div>
          <div className="acc-prev" aria-hidden="true">
            <span className="day">
              <small>Bản Ngày</small>
              <span>
                <i>hǎi</i>
                <b className="han">海</b>
              </span>
            </span>
            <span className="night">
              <small>Bản Đêm</small>
              <span>
                <i>hǎi</i>
                <b className="han">海</b>
              </span>
            </span>
          </div>
        </section>

        <div className="card acc-menu">
          <Link className="acc-m" href="/them/hop-thu">
            <span className="acc-mi" data-c="blue">
              <svg viewBox="0 0 24 24">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
            </span>
            <span className="grow">Hộp thư</span>
            {mail?.unread ? <span className="badge-n">{mail.unread}</span> : null}
            <span className="chev">›</span>
          </Link>
          <Link className="acc-m" href="/them/tui-do">
            <span className="acc-mi" data-c="gold">
              <svg viewBox="0 0 24 24">
                <rect x="4" y="6" width="16" height="14" rx="2" />
                <path d="M4 10h16M10 14h4" />
              </svg>
            </span>
            <span className="grow">Túi đồ</span>
            {bag !== null ? <span className="acc-r">{bag} vật phẩm</span> : null}
            <span className="chev">›</span>
          </Link>
          <Link className="acc-m" href="/them/thi">
            <span className="acc-mi" data-c="blue">
              <svg viewBox="0 0 24 24">
                <path d="M8 3h8v6a4 4 0 0 1-8 0zM12 13v4M8 21h8" />
              </svg>
            </span>
            <span className="grow">Làm đề lên cấp</span>
            <span className="acc-tag">HSK {next > levels ? levels : next}</span>
            <span className="chev">›</span>
          </Link>
          <button className="acc-m" onClick={() => setCodeOpen((o) => !o)} aria-expanded={codeOpen}>
            <span className="acc-mi" data-c="sky">
              <svg viewBox="0 0 24 24">
                <path d="M3 9h18v4H3zM5 13v8h14v-8M12 9v12M12 9c-1.5-3-5-4-5-1.5S10 9 12 9zM12 9c1.5-3 5-4 5-1.5S14 9 12 9z" />
              </svg>
            </span>
            <span className="grow">Mã quà</span>
            <span className="acc-r link">Nhập mã</span>
            <span className="chev">{codeOpen ? '⌄' : '›'}</span>
          </button>
          {codeOpen ? (
            <div className="acc-code">
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Nhập mã, ví dụ ABC123" autoCapitalize="characters" autoComplete="off" aria-label="Mã quà" />
              <button className="btn primary" disabled={redeeming || !code.trim()} onClick={redeem}>
                Nhận
              </button>
            </div>
          ) : null}
          <Link className="acc-m" href="/lo-trinh">
            <span className="acc-mi" data-c="slate">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path d="m15.5 8.5-2 5-5 2 2-5z" />
              </svg>
            </span>
            <span className="grow">Lộ trình học</span>
            <span className="chev">›</span>
          </Link>
          <Link className="acc-m" href="/them/huong-dan">
            <span className="acc-mi" data-c="slate">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01" />
              </svg>
            </span>
            <span className="grow">Hướng dẫn</span>
            <span className="chev">›</span>
          </Link>
          <Link className="acc-m" href="/su-kien/luat">
            <span className="acc-mi" data-c="slate">
              <svg viewBox="0 0 24 24">
                <path d="M14 4 20 10l-3 3-6-6zM11 7 4 14l6 6 7-7M3 21h8" />
              </svg>
            </span>
            <span className="grow">Luật sự kiện</span>
            <span className="chev">›</span>
          </Link>
          <Link className="acc-m" href="/su-kien/xep-hang">
            <span className="acc-mi" data-c="gold">
              <svg viewBox="0 0 24 24">
                <path d="M5 20V10M12 20V4M19 20v-7" />
              </svg>
            </span>
            <span className="grow">Bảng xếp hạng</span>
            <span className="chev">›</span>
          </Link>
          {user?.role === 'ADMIN' ? (
            <Link className="acc-m" href="/admin">
              <span className="acc-mi" data-c="slate">
                <svg viewBox="0 0 24 24">
                  <path d="M12 3 4 6v6c0 4.5 3.2 8 8 9 4.8-1 8-4.5 8-9V6z" />
                </svg>
              </span>
              <span className="grow">Quản trị bài học</span>
              <span className="chev">›</span>
            </Link>
          ) : null}
        </div>

        <button
          className="acc-out"
          onClick={async () => {
            await signOut();
            router.replace('/dang-nhap');
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 4H5v16h4M16 8l4 4-4 4M20 12H9" />
          </svg>
          Đăng xuất tài khoản
        </button>
        <p className="acc-ver">Hanvui · Biển & Trời</p>
      </div>
      <RewardDialog info={reward} onClose={() => setReward(null)} />
    </Shell>
  );
}
