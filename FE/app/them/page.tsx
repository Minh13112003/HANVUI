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
type Palette = 'jade' | 'sky';

/** Màu chủ đề (theme-sky.css). Sáng / tối chọn riêng ở ô bên dưới: Trời – Biển sáng = xanh dương, tối = xanh đậm.
 *  Ô xem trước chia đôi: nửa trái bản sáng, nửa phải bản tối (nền + dòng chữ mẫu đúng màu chữ). */
const PALETTES: { id: Palette; name: string; note: string; light: [string, string]; dark: [string, string] }[] = [
  { id: 'jade', name: 'Ngọc bích', note: 'Mặc định', light: ['#EEF2F0', '#15211F'], dark: ['#0D1614', '#E6EFEC'] },
  { id: 'sky', name: 'Trời – Biển', note: 'Sáng: xanh dương · Tối: xanh đậm', light: ['#CDE5FA', '#0A3557'], dark: ['#0A1F3D', '#D9EDFF'] },
];

/** Quy đổi gần đúng HSK 3.0 → 2.0 (xem BE/src/common/hsk.ts). */
const HSK3_TO_HSK2 = [2, 3, 4, 5, 6, 6, 6, 6, 6];

export default function MorePage() {
  const { user, setUser, signOut } = useAuth();
  const { toast } = useUi();
  const router = useRouter();
  const [theme, setTheme] = useState<Theme>('auto');
  const [palette, setPalette] = useState<Palette>('jade');
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
      setPalette(localStorage.getItem('hv.palette') === 'sky' ? 'sky' : 'jade');
    } catch {
      /* trình duyệt chặn lưu: giữ mặc định */
    }
  }, []);

  const applyPalette = (p: Palette) => {
    setPalette(p);
    try {
      localStorage.setItem('hv.palette', p);
    } catch {
      /* vẫn đổi được trong phiên này */
    }
    if (p === 'jade') document.documentElement.removeAttribute('data-palette');
    else document.documentElement.setAttribute('data-palette', p);
  };

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
            <small className="muted" style={{ display: 'block' }}>
              {mail?.unclaimed ? `${mail.unclaimed} thư có quà chưa nhận` : 'Thư từ quản trị viên và hệ thống'}
            </small>
          </span>
          {mail?.unread ? (
            <span className="badge-n" aria-label={`${mail.unread} thư chưa đọc`}>
              {mail.unread}
            </span>
          ) : null}
          <span className="chev">›</span>
        </Link>

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
            <p className="muted" style={{ fontSize: 12, marginTop: 6 }}>
              HSK 2.0 gọi HSK 1–6; HSK 3.0 gọi Sơ cấp 1–3, Trung cấp 1–3, Cao cấp 1–3. Hai chuẩn không tương ứng 1-1. Nội dung hiện soạn đầy đủ tới HSK 3 (HSK 2.0).
            </p>
          </div>

          <div className="stack" style={{ gap: 6 }}>
            <span className="eyebrow2">Thử nhanh cấp (bản demo, không cần thi)</span>
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
            <p className="muted" style={{ fontSize: 12 }}>
              Dùng song song với làm đề thi để thử khóa/mở bài. Bản thật sẽ bỏ nút này, chỉ lên cấp khi thi đạt.
            </p>
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
          <p className="muted" style={{ fontSize: 13 }}>
            Thi thử theo định dạng HSK. Đạt đề của đúng cấp hiện tại ({levelLabel}) thì lên cấp kế.
          </p>
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
          <small className="muted">Nhập đúng mã sẽ nhận quà (lượt gợi ý). Mỗi mã dùng một lần cho mỗi tài khoản.</small>
        </section>

        <section className="card stack">
          <span style={{ fontWeight: 600 }}>Màu chủ đề</span>
          <div role="radiogroup" aria-label="Màu chủ đề" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
            {PALETTES.map((p) => {
              const on = palette === p.id;
              return (
                <button
                  key={p.id}
                  role="radio"
                  aria-checked={on}
                  onClick={() => applyPalette(p.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    padding: 10,
                    borderRadius: 16,
                    textAlign: 'left',
                    background: 'var(--surface)',
                    border: on ? '2px solid var(--accent)' : '2px solid var(--line)',
                    minWidth: 0,
                  }}
                >
                  <span aria-hidden="true" style={{ display: 'flex', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--line)' }}>
                    {[p.light, p.dark].map(([bg, fg], k) => (
                      <span key={k} style={{ flex: 1, padding: '10px 8px', background: bg, color: fg, fontSize: 12, fontWeight: 700 }}>
                        {k ? 'Tối' : 'Sáng'}
                      </span>
                    ))}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                    <b style={{ fontSize: 14 }}>{p.name}</b>
                    {on ? <span style={{ color: 'var(--accent)', fontWeight: 800 }}>✓</span> : null}
                  </span>
                  <small className="muted">{p.note}</small>
                </button>
              );
            })}
          </div>
          <label className="field">
            Sáng / tối{palette === 'sky' ? ' (Trời – Biển: sáng = xanh dương, tối = xanh đậm)' : ''}
            <select value={theme} onChange={(e) => applyTheme(e.target.value as Theme)}>
              <option value="auto">Theo máy</option>
              <option value="light">Sáng</option>
              <option value="dark">Tối</option>
            </select>
          </label>
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
            <span className="grow">Lộ trình cho người mới (tới HSK 2)</span>
            <span className="chev">›</span>
          </Link>
          <Link className="mrow2" href="/them/huong-dan">
            <span className="grow">Hướng dẫn · Cách dùng HanVui trong 5 bước</span>
            <span className="chev">›</span>
          </Link>
          <Link className="mrow2" href="/su-kien/xep-hang">
            <span className="grow">Bảng xếp hạng</span>
            <span className="chev">›</span>
          </Link>
        </div>

        <section className="card stack">
          <b>Gói VIP</b>
          <p className="muted" style={{ fontSize: 13 }}>
            Đang trong quá trình nghiên cứu để bào người dùng, sẽ ra mắt sau.
          </p>
        </section>

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
