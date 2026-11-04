'use client';
// Sơ đồ mũi tên của mục Luyện dịch: chữ Hán + nghĩa từng từ ở một tầng, câu tự nhiên ở tầng kia, mũi tên chỉ từ đi về đâu.
// Mũi tên cắt nhau nghĩa là từ đó đổi vị trí khi dịch. Từ không có trong câu tự nhiên (như 得) thì không có mũi tên.
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

export interface DiagramData {
  tokens: { zh: string; py: string; vi: string }[];
  natural: { vi: string; at: number }[];
}
interface Arrow {
  d: string;
  head: string;
  moved: boolean;
}

export default function TranslateDiagram({ data, dir }: { data: DiagramData; dir: 'zh2vi' | 'vi2zh' }) {
  const box = useRef<HTMLDivElement>(null);
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [sel, setSel] = useState<number | null>(null);
  const { natural } = data;

  const draw = useCallback(() => {
    const el = box.current;
    if (!el) return;
    const b = el.getBoundingClientRect();
    if (!b.width) return;
    const zh = el.querySelectorAll<HTMLElement>('[data-zh]');
    const vi = el.querySelectorAll<HTMLElement>('[data-vi]');
    setSize({ w: b.width, h: b.height });
    setArrows(
      natural.map(({ at }, i) => {
        const [top, bot] = dir === 'zh2vi' ? [zh[at], vi[i]] : [vi[i], zh[at]];
        const t = top.getBoundingClientRect();
        const u = bot.getBoundingClientRect();
        const x1 = t.left + t.width / 2 - b.left;
        const y1 = t.bottom - b.top + 1;
        const x2 = u.left + u.width / 2 - b.left;
        const y2 = u.top - b.top - 7;
        const my = (y1 + y2) / 2;
        return {
          d: `M${x1} ${y1}C${x1} ${my} ${x2} ${my} ${x2} ${y2}`,
          head: `M${x2 - 5} ${y2}L${x2 + 5} ${y2}L${x2} ${y2 + 7}Z`,
          moved: natural.some((o, k) => (i < k && at > o.at) || (i > k && at < o.at)),
        };
      }),
    );
  }, [natural, dir]);

  useLayoutEffect(() => {
    draw();
    const el = box.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(draw);
    ro.observe(el);
    document.fonts?.ready.then(draw).catch(() => {});
    return () => ro.disconnect();
  }, [draw]);

  useLayoutEffect(() => setSel(null), [data]);

  const pick = (i: number) => setSel((s) => (s === i ? null : i));
  const zhRow = (
    <div className="dg-tier">
      {data.tokens.map((t, k) => {
        const i = natural.findIndex((n) => n.at === k);
        return (
          <button key={k} type="button" data-zh={k} className={'dg-cell' + (sel !== null && sel === i ? ' on' : '') + (i < 0 ? ' free' : '')} disabled={i < 0} onClick={() => pick(i)}>
            <small>{t.py}</small>
            <span className="han">{t.zh}</span>
            <span className="dg-lit">{t.vi}</span>
          </button>
        );
      })}
    </div>
  );
  const viRow = (
    <div className="dg-tier">
      {natural.map((n, i) => (
        <button key={i} type="button" data-vi={i} className={'dg-cell vi' + (sel === i ? ' on' : '')} onClick={() => pick(i)}>
          {n.vi}
        </button>
      ))}
    </div>
  );

  return (
    <div className="dg-scroll">
      <div ref={box} className={'dg-box' + (sel !== null ? ' lit' : '')}>
        <svg aria-hidden="true" viewBox={`0 0 ${size.w} ${size.h}`}>
          {arrows.map((a, i) => (
            <g key={i} className={(a.moved ? 'moved' : '') + (sel === i ? ' on' : '')}>
              <path className="dg-line" d={a.d} />
              <path className="dg-head" d={a.head} />
            </g>
          ))}
        </svg>
        {dir === 'zh2vi' ? zhRow : viRow}
        <div className={'dg-gap' + (data.tokens.length > 4 ? ' tall' : '')} />
        {dir === 'zh2vi' ? viRow : zhRow}
      </div>
    </div>
  );
}
