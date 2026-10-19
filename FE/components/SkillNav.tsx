'use client';
// Thanh chọn trong mục Học: Từ vựng và bốn kỹ năng (rule.md mục 3.5).
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS = [
  { href: '/hoc', zh: '汉', name: 'Từ vựng' },
  { href: '/hoc/nghe', zh: '听', name: 'Nghe' },
  { href: '/hoc/noi', zh: '说', name: 'Nói' },
  { href: '/hoc/doc', zh: '读', name: 'Đọc' },
  { href: '/hoc/viet', zh: '写', name: 'Viết' },
] as const;

export default function SkillNav() {
  const path = usePathname();
  const active = ITEMS.reduce((best, it) => (path === it.href || path.startsWith(it.href + '/') ? it.href : best), '/hoc');
  return (
    <nav className="seg skn sticky" aria-label="Kỹ năng">
      {ITEMS.map((it) => (
        <Link key={it.href} href={it.href} className={active === it.href ? 'on' : ''}>
          <span className="han">{it.zh}</span>
          <small>{it.name}</small>
        </Link>
      ))}
    </nav>
  );
}
