'use client';
// Đăng nhập và đăng ký (email + mật khẩu, rule.md mục 8).
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';

export default function SignInPage() {
  const { user, loading, signIn, signUp } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace('/');
  }, [loading, user, router]);

  const go = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      if (mode === 'in') await signIn(email, password);
      else await signUp(email, password, name);
      router.replace('/');
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Không đăng nhập được');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="app">
      <header className="top">
        <div className="brand">
          <span className="seal" aria-hidden="true">
            汉
          </span>
          <div>
            <b>HanVui</b>
            <small>Học tiếng Trung mỗi ngày</small>
          </div>
        </div>
      </header>

      <main id="view" className="enter">
        <div className="stack">
          <div className="surf" data-g="night">
            <span className="wm" aria-hidden="true">
              学
            </span>
            <span className="eyebrow">Vừa học vừa chơi</span>
            <div className="hnum2">
              12 chủ đề <span>· hội thoại, viết chữ, sự kiện truyện</span>
            </div>
            <p className="hsub">Nghe trước, trả lời, rồi mới xem lời thoại. Mỗi ngày làm nhiệm vụ để có lượt gợi ý.</p>
          </div>

          <div className="seg" role="tablist">
            <button className={mode === 'in' ? 'on' : ''} role="tab" aria-selected={mode === 'in'} onClick={() => setMode('in')}>
              Đăng nhập
            </button>
            <button className={mode === 'up' ? 'on' : ''} role="tab" aria-selected={mode === 'up'} onClick={() => setMode('up')}>
              Đăng ký
            </button>
          </div>

          <form className="card stack" onSubmit={go}>
            {mode === 'up' ? (
              <label className="field">
                Tên hiển thị
                <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={40} autoComplete="nickname" />
              </label>
            ) : null}
            <label className="field">
              Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            </label>
            <label className="field">
              Mật khẩu {mode === 'up' ? '(tối thiểu 8 ký tự)' : ''}
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                maxLength={72}
                autoComplete={mode === 'up' ? 'new-password' : 'current-password'}
              />
            </label>
            {err ? (
              <div className="alert" style={{ borderColor: 'var(--bad)', background: 'var(--badbg)' }}>
                {err}
              </div>
            ) : null}
            <button className="btn primary" disabled={busy}>
              {busy ? 'Đang xử lý…' : mode === 'in' ? 'Đăng nhập' : 'Tạo tài khoản'}
            </button>
          </form>

          <p className="muted" style={{ fontSize: 12 }}>
            Cần máy chủ BE đang chạy tại {process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001/api/v1'}.
          </p>
        </div>
      </main>
    </div>
  );
}
