'use client';
// Vỏ app: con dấu 汉, tên app, số từ đã lưu, và thanh tab. Chưa đăng nhập thì đưa về màn đăng nhập.
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { loadWordAudio } from '@/lib/audio';
import { useAuth } from '@/lib/auth';
import type { EventState, Notebook } from '@/lib/types';
import TabBar from './TabBar';

export default function Shell({ children, title }: { children: React.ReactNode; title?: string }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const path = usePathname();
  // Trang gốc của 5 tab không cần nút Quay lại; mọi trang con có (về trang trước, không có lịch sử thì về tab cha).
  const isRoot = ['/', '/hoc', '/so-tay', '/su-kien', '/them'].includes(path);
  const goBack = () => {
    if (/^\/hoc\/(nghe|noi|doc|viet)$/.test(path)) router.push('/hoc');
    else if (window.history.length > 1) router.back();
    else router.push('/' + (path.split('/')[1] ?? ''));
  };
  const [saved, setSaved] = useState<number | null>(null);
  const [dot, setDot] = useState(false);
  const [mailDot, setMailDot] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/dang-nhap');
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    loadWordAudio(() => api<Record<string, string>>('/words/audio'));
    api<Notebook>('/notebook?view=day')
      .then((n) => setSaved(n.total))
      .catch(() => {});
    api<{ unread: number; unclaimed: number }>('/mailbox/counts')
      .then((c) => setMailDot(c.unread + c.unclaimed > 0))
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
          {!isRoot ? (
            <button className="backbtn" onClick={goBack}>
              ‹ Quay lại
            </button>
          ) : null}
          {children}
        </main>
      </div>
      <TabBar eventDot={dot} accountDot={mailDot} />
    </>
  );
}
