'use client';
// Thanh tab nổi 5 mục, vệt chọn trượt theo tab (biến --ti), như bản demo 11.
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/', label: 'Trang chủ', d: 'M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z' },
  { href: '/hoc', label: 'Học', d: 'M4 6h7a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM20 6h-7a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h7z' },
  { href: '/so-tay', label: 'Sổ tay', d: 'M6 3h11a2 2 0 0 1 2 2v16H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM9 3v18' },
  { href: '/su-kien', label: 'Sự kiện', d: 'M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-3-5.3 3 1.1-6L3.4 9.4l6-.8z' },
  { href: '/them', label: 'Tài khoản', d: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20a8 8 0 0 1 16 0z' },
] as const;

export default function TabBar({ eventDot = false, accountDot = false }: { eventDot?: boolean; accountDot?: boolean }) {
  const path = usePathname();
  const idx = TABS.reduce((best, t, i) => {
    if (t.href === '/') return path === '/' ? 0 : best;
    return path.startsWith(t.href) ? i : best;
  }, 0);

  return (
    <nav className="tabs" aria-label="Điều hướng chính">
      <div style={{ ['--ti' as string]: idx }}>
        {TABS.map((t, i) => (
          <Link key={t.href} href={t.href} className={i === idx ? 'on' : ''} aria-current={i === idx ? 'page' : undefined}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={t.d} />
            </svg>
            {t.label}
            {(t.href === '/su-kien' && eventDot) || (t.href === '/them' && accountDot) ? <span className="dot" /> : null}
          </Link>
        ))}
      </div>
    </nav>
  );
}
