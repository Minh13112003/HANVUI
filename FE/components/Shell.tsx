'use client';
// Vỏ app: con dấu 汉, tên app, số từ đã lưu, và thanh tab. Chưa đăng nhập thì đưa về màn đăng nhập.
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import type { EventState, Notebook } from '@/lib/types';
import TabBar from './TabBar';

export default function Shell({ children, title }: { children: React.ReactNode; title?: string }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [saved, setSaved] = useState<number | null>(null);
  const [dot, setDot] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/dang-nhap');
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    api<Notebook>('/notebook?view=day')
      .then((n) => setSaved(n.total))
      .catch(() => {});
    api<EventState>('/event')
      .then((e) => setDot(!!e.active && !e.optedOut && (e.tokens ?? 0) > 0))
      .catch(() => {});
  }, [user]);

  if (loading || !user) {
    return (
      <div className="app">
        <p className="muted" style={{ paddingTop: 40, textAlign: 'center' }}>
          Đang tải…
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="app">
        <header className="top">
          <Link href="/" className="brand">
            <span className="seal" aria-hidden="true">
              汉
            </span>
            <div>
              <b>HanVui</b>
              <small>{title ?? 'Học tiếng Trung mỗi ngày'}</small>
            </div>
          </Link>
          <Link href="/so-tay" className="pill">
            {saved === null ? '…' : saved + ' từ đã lưu'}
          </Link>
        </header>
        <main id="view" className="enter">
          {children}
        </main>
      </div>
      <TabBar eventDot={dot} />
    </>
  );
}
