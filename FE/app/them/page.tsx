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
import type { MailCounts } from '@/lib/types';

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

  useEffect(() => {
    api<MailCounts>('/mailbox/counts')
      .then(setMail)
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

  return (
    <Shell title="Tài khoản">
      <div className="stack">
        <section className="surf" data-g="jade">
          <span className="wm" aria-hidden="true">
            我
          </span>
          <div className="row between">
            <div className="grow">
              <span className="eyebrow">Tài khoản</span>
              <div className="hnum2" style={{ fontSize: 22 }}>
                {user?.displayName}
              </div>
              <span className="hsub">{user?.email}</span>
            </div>
            <span className="hpill">{user?.isVip ? 'VIP' : 'Thường'}</span>
          </div>
          <span className="hsub">
            {levelLabel}
          </span>
        </section>

        <Link className="card row" href="/them/hop-thu" style={{ gap: 12 }}>
          <span className="mail-av han" data-s="ADMIN" aria-hidden="true">
            信
          </span>
          <span className="grow">
            <b>Hộp thư</b>
            {mail?.unclaimed ? (
              <small className="muted" style={{ display: 'block' }}>
                {mail.unclaimed} 🎁
              </small>
            ) : null}
          </span>
          {mail?.unread ? (
            <span className="badge-n" aria-label={`${mail.unread} thư chưa đọc`}>
              {mail.unread}
            </span>
          ) : null}
          <span className="chev">›</span>
        </Link>

        {user?.role === 'ADMIN' ? (
          <Link className="card row" href="/admin" style={{ gap: 12 }}>
            <span className="mail-av han" data-s="ADMIN" aria-hidden="true">
              管
            </span>
            <span className="grow">
              <b>Quản trị bài học</b>
            </span>
            <span className="chev">›</span>
          </Link>
        ) : null}

        <section className="card stack">

          <div>
            <span className="eyebrow2">Chuẩn HSK</span>
            <div className="seg" role="tablist" aria-label="Chuẩn HSK">
              <button
                className={user?.hskStandard === 'HSK2' ? 'on' : ''}
                role="tab"
                aria-selected={user?.hskStandard === 'HSK2'}
                disabled={busy}
                onClick={() => patch({ hskStandard: 'HSK2' })}
              >
                HSK 2.0 <small>HSK 1–6</small>
              </button>
              <button
                className={user?.hskStandard === 'HSK3' ? 'on' : ''}
                role="tab"
                aria-selected={user?.hskStandard === 'HSK3'}
                disabled={busy}
                onClick={() => patch({ hskStandard: 'HSK3' })}
              >
                HSK 3.0 <small>Sơ · Trung · Cao</small>
              </button>
            </div>
          </div>

          <div className="stack" style={{ gap: 6 }}>
            <span className="eyebrow2">Đổi cấp nhanh</span>
            <div className="row" style={{ gap: 8 }}>
              <button className="btn sm" disabled={busy || (user?.hskLevel ?? 1) <= 1} onClick={() => patch({ hskLevel: (user?.hskLevel ?? 1) - 1 })}>
                ▼ Hạ cấp
              </button>
              <span className="pill grow" style={{ textAlign: 'center' }}>
                {levelLabel}
                {user?.hskStandard === 'HSK3' ? ` ≈ ${levelName('HSK2', HSK3_TO_HSK2[Math.min(user.hskLevel, 9) - 1])} (HSK 2.0)` : ''}
              </span>
              <button className="btn primary sm" disabled={busy || (user?.hskLevel ?? 1) >= levels} onClick={() => patch({ hskLevel: (user?.hskLevel ?? 1) + 1 })}>
                ▲ Lên cấp
              </button>
            </div>
          </div>

          <label className="field">
            Cấp hiện tại
            <select value={user?.hskLevel ?? 1} disabled={busy} onChange={(e) => patch({ hskLevel: Number(e.target.value) })}>
              {Array.from({ length: levels }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {levelName(user?.hskStandard === 'HSK3' ? 'HSK3' : 'HSK2', n)}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section className="card stack">
          <span className="eyebrow2">Làm đề nâng cấp HSK</span>
          <Link className="btn primary" href="/them/thi" style={{ textAlign: 'center' }}>
            Làm đề lên cấp
          </Link>
        </section>

        <section className="card stack">
          <span className="eyebrow2">Nhập mã quà</span>
          <div className="row" style={{ gap: 8 }}>
            <label className="field grow" style={{ margin: 0 }}>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Nhập mã, ví dụ ABC123"
                autoCapitalize="characters"
                autoComplete="off"
                aria-label="Mã quà"
              />
            </label>
            <button className="btn primary" disabled={redeeming || !code.trim()} onClick={redeem}>
              Nhận
            </button>
          </div>
        </section>

        <section className="card stack">
          <span style={{ fontWeight: 600 }}>Giao diện</span>
          <div role="radiogroup" aria-label="Giao diện" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
            {(
              [
                { id: 'light', name: 'Sáng', bg: '#EEF8FF', fg: '#0B2A4A' },
                { id: 'dark', name: 'Tối', bg: '#0A1A2B', fg: '#E6F1FF' },
                { id: 'auto', name: 'Theo máy', bg: 'linear-gradient(90deg, #EEF8FF 50%, #0A1A2B 50%)', fg: '#3B6EA8' },
              ] as { id: Theme; name: string; bg: string; fg: string }[]
            ).map((t) => {
              const on = theme === t.id;
              return (
                <button
                  key={t.id}
                  role="radio"
                  aria-checked={on}
                  onClick={() => applyTheme(t.id)}
                  style={{ display: 'grid', gap: 8, padding: 10, borderRadius: 16, background: 'var(--surface)', border: on ? '2px solid var(--accent)' : '2px solid var(--line)', minWidth: 0 }}
                >
                  <span aria-hidden="true" style={{ display: 'grid', placeItems: 'center', height: 44, borderRadius: 10, border: '1px solid var(--line)', background: t.bg, color: t.fg, fontWeight: 800 }}>
                    汉
                  </span>
                  <b style={{ fontSize: 13 }}>
                    {t.name}
                    {on ? <span style={{ color: 'var(--accent)' }}> ✓</span> : null}
                  </b>
                </button>
              );
            })}
          </div>
        </section>

        <div className="menu">
          <Link className="mrow2" href="/them/tui-do">
            <span className="grow">Túi đồ</span>
            <span className="chev">›</span>
          </Link>
          <Link className="mrow2" href="/su-kien/luat">
            <span className="grow">Luật sự kiện</span>
            <span className="chev">›</span>
          </Link>
          <Link className="mrow2" href="/lo-trinh">
            <span className="grow">Lộ trình cho người mới</span>
            <span className="chev">›</span>
          </Link>
          <Link className="mrow2" href="/them/huong-dan">
            <span className="grow">Hướng dẫn</span>
            <span className="chev">›</span>
          </Link>
          <Link className="mrow2" href="/su-kien/xep-hang">
            <span className="grow">Bảng xếp hạng</span>
            <span className="chev">›</span>
          </Link>
        </div>

        <button
          className="btn"
          onClick={async () => {
            await signOut();
            router.replace('/dang-nhap');
          }}
        >
          Đăng xuất
        </button>
      </div>
      <RewardDialog info={reward} onClose={() => setReward(null)} />
    </Shell>
  );
}
