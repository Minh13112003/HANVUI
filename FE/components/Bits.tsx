'use client';
// Những mảnh nhỏ dùng khắp app: pháo giấy, chuỗi ngày, số đếm lên, vòng tiến độ, huy chương.
import { useEffect, useRef, useState } from 'react';

const PIECES = 26;
const COLORS = ['#0E7466', '#2F6FDB', '#E8A300', '#D9450F', '#6D3BD1', '#C2185B', '#16A890'];

/** Pháo giấy: đổi `burst` (ví dụ tăng số) là bắn một lượt. Tự tắt sau 1,6 giây. */
export function Confetti({ burst }: { burst: number }) {
  const [on, setOn] = useState(false);
  const last = useRef(burst);

  useEffect(() => {
    if (burst === last.current) return;
    last.current = burst;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    setOn(true);
    const t = setTimeout(() => setOn(false), 1600);
    return () => clearTimeout(t);
  }, [burst]);

  if (!on) return null;
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: PIECES }).map((_, i) => (
        <i
          key={i}
          style={{
            left: Math.round((i / PIECES) * 100 + (Math.random() * 6 - 3)) + '%',
            background: COLORS[i % COLORS.length],
            animationDelay: (Math.random() * 0.35).toFixed(2) + 's',
            animationDuration: (1.1 + Math.random() * 0.5).toFixed(2) + 's',
          }}
        />
      ))}
    </div>
  );
}

/** Chuỗi ngày đăng nhập. */
export function Flame({ days }: { days: number }) {
  return (
    <span className="flame" title={'Chuỗi ' + days + ' ngày trong tuần này'}>
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
        <path d="M13 2s1.5 4-1 6.5S8 12 8 15a4 4 0 0 0 8 0c0-1.2-.4-2.2-1-3 2.4.6 4 2.8 4 5.2A7.2 7.2 0 0 1 11.8 24 7.8 7.8 0 0 1 4 16.2C4 9.4 13 8 13 2z" />
      </svg>
      {days} ngày
    </span>
  );
}

/** Số chạy lên cho đẹp; tôn trọng "giảm chuyển động". */
export function CountUp({ value, ms = 650 }: { value: number; ms?: number }) {
  const [n, setN] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    if (value === from.current) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      from.current = value;
      setN(value);
      return;
    }
    const start = performance.now();
    const a = from.current;
    from.current = value;
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      setN(Math.round(a + (value - a) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, ms]);

  return <span className="num">{n.toLocaleString('vi-VN')}</span>;
}

const R = 34;
const C = 2 * Math.PI * R;

/** Vòng tiến độ. */
export function Ring({ done, total, label }: { done: number; total: number; label?: string }) {
  return (
    <div className="ringw">
      <svg viewBox="0 0 84 84" aria-hidden="true">
        <defs>
          <linearGradient id="ringg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#0b6457" />
            <stop offset="1" stopColor="#16a890" />
          </linearGradient>
        </defs>
        <circle cx="42" cy="42" r={R} fill="none" stroke="var(--surface2)" strokeWidth="9" />
        <circle
          cx="42"
          cy="42"
          r={R}
          fill="none"
          stroke="url(#ringg)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - (total ? done / total : 0))}
          transform="rotate(-90 42 42)"
        />
      </svg>
      <span>{label ?? done + '/' + total}</span>
    </div>
  );
}

const GLYPH = ['铜', '银', '金', '玉'];

/** Huy chương mốc: 1 Đồng, 2 Bạc, 3 Vàng, 4 Ngọc. */
export function Medal({ level, got, need }: { level: number; got: boolean; need?: number }) {
  const names = ['Đồng', 'Bạc', 'Vàng', 'Ngọc'];
  return (
    <div className="mdl">
      <span className={'bdg han' + (got ? '' : ' off')} data-m={got ? level : undefined}>
        {GLYPH[level - 1]}
      </span>
      <b>{names[level - 1]}</b>
      {need !== undefined ? <small>{need} từ</small> : null}
    </div>
  );
}
