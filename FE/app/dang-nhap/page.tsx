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

  const [show, setShow] = useState(false);
  const up = mode === 'up';

  return (
    <div className="app lg">
      <main id="view" className="enter">
        <div className="stack">
          <div className="lg-hero">
            <span className="lg-logo" aria-hidden="true">
              <i>汉</i>
              <u />
            </span>
            <h1 className="lg-title">
              Hanvui <span>汉语</span>
            </h1>
            <p className="lg-tag">Học tiếng Trung vừa học vừa chơi</p>
          </div>

          <form className="lg-card stack" onSubmit={go}>
            <div className="seg pillseg" role="tablist">
              <button type="button" className={!up ? 'on' : ''} role="tab" aria-selected={!up} onClick={() => setMode('in')}>
                Đăng nhập
              </button>
              <button type="button" className={up ? 'on' : ''} role="tab" aria-selected={up} onClick={() => setMode('up')}>
                Đăng ký
              </button>
            </div>
            {up ? (
              <label className="field">
                Tên hiển thị
                <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={40} autoComplete="nickname" placeholder="ví dụ: Minh" />
              </label>
            ) : null}
            <label className="field">
              Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="ví dụ: ban@hanvui.vn" />
            </label>
            <label className="field">
              Mật khẩu {up ? '(tối thiểu 8 ký tự)' : ''}
              <span className="lg-pw">
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  maxLength={72}
                  autoComplete={up ? 'new-password' : 'current-password'}
                />
                <button type="button" aria-label={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} onClick={() => setShow(!show)}>
                  {show ? 'Ẩn' : 'Hiện'}
                </button>
              </span>
            </label>
            {err ? (
              <div className="alert" style={{ borderColor: 'var(--bad)', background: 'var(--badbg)' }}>
                {err}
              </div>
            ) : null}
            <button className="btn primary lg-go" disabled={busy}>
              {busy ? 'Đang xử lý…' : up ? 'Tạo tài khoản →' : 'Đăng nhập →'}
            </button>
            <p className="lg-sw">
              {up ? 'Đã có tài khoản? ' : 'Chưa có tài khoản? '}
              <button type="button" onClick={() => setMode(up ? 'in' : 'up')}>
                {up ? 'Đăng nhập' : 'Đăng ký ngay miễn phí'}
              </button>
            </p>
          </form>
          <p className="lg-foot">♡ Học tiếng Trung nhẹ nhàng như ngắm biển xanh</p>
        </div>
      </main>
    </div>
  );
}
