'use client';
// Thêm: tài khoản, chuẩn và cấp HSK, VIP, túi đồ, luật sự kiện, hướng dẫn, giao diện sáng/tối.
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import { authApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useUi } from '@/lib/ui';

type Theme = 'auto' | 'light' | 'dark';

export default function MorePage() {
  const { user, setUser, signOut } = useAuth();
  const { toast } = useUi();
  const router = useRouter();
  const [theme, setTheme] = useState<Theme>('auto');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setTheme((localStorage.getItem('hv.theme') as Theme) || 'auto');
  }, []);

  const applyTheme = (t: Theme) => {
    setTheme(t);
    localStorage.setItem('hv.theme', t);
    if (t === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', t);
  };

  const levels = user?.hskStandard === 'HSK3' ? 9 : 6;

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
    <Shell title="Thêm">
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
            {user?.hskStandard === 'HSK3' ? 'HSK 3.0' : 'HSK 2.0'} · cấp {user?.hskLevel}
          </span>
        </section>

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
                HSK 2.0 <small>6 cấp</small>
              </button>
              <button
                className={user?.hskStandard === 'HSK3' ? 'on' : ''}
                role="tab"
                aria-selected={user?.hskStandard === 'HSK3'}
                disabled={busy}
                onClick={() => patch({ hskStandard: 'HSK3' })}
              >
                HSK 3.0 <small>9 cấp</small>
              </button>
            </div>
            <p className="muted" style={{ fontSize: 12, marginTop: 6 }}>
              Đổi chuẩn chỉ đổi cách lọc và nhãn hiển thị. Hai chuẩn không tương ứng 1-1.
            </p>
          </div>

          <label className="field">
            Cấp hiện tại
            <select value={user?.hskLevel ?? 1} disabled={busy} onChange={(e) => patch({ hskLevel: Number(e.target.value) })}>
              {Array.from({ length: levels }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  Cấp {n}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section className="card stack">
          <span className="eyebrow2">Giao diện</span>
          <div className="seg" role="tablist" aria-label="Giao diện">
            {(['auto', 'light', 'dark'] as Theme[]).map((t) => (
              <button key={t} className={theme === t ? 'on' : ''} role="tab" aria-selected={theme === t} onClick={() => applyTheme(t)}>
                {t === 'auto' ? 'Theo máy' : t === 'light' ? 'Sáng' : 'Tối'}
              </button>
            ))}
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
            VIP chỉ mở khóa tính năng giúp học dễ hơn, <b>không có tác dụng trong sự kiện</b> (app không pay-to-win).
            Giá gói và danh sách tính năng chưa chốt.
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
    </Shell>
  );
}
