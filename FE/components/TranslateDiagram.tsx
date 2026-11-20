'use client';
// Sơ đồ mũi tên của mục Luyện dịch: chữ Hán + nghĩa từng từ ở một tầng, câu tự nhiên ở tầng kia, mũi tên chỉ từ đi về đâu.
// Mũi tên cắt nhau nghĩa là từ đó đổi vị trí khi dịch. Từ không có trong câu tự nhiên (như 得) thì không có mũi tên.
// Chạm một lần: sợi chỉ đỏ nối từ với nghĩa. Chạm hai lần liên tiếp: lưu từ vào Sổ tay.
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { useUi } from '@/lib/ui';

export interface DiagramData {
  /** save: phần lõi để lưu khi ô dính trợ từ hay giới từ (老师的 lưu 老师). */
  tokens: { zh: string; py: string; vi: string; save?: string }[];
  natural: { vi: string; at: number }[];
}
const DOUBLE_TAP_MS = 350;

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
  const lastTap = useRef({ cell: '', at: 0 });
  const { toast } = useUi();
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

  const save = async (k: number) => {
    const t = data.tokens[k];
    const zh = t.save ?? t.zh;
    try {
      // Nghĩa trong ngoặc chỉ là ghi chú ngữ pháp, không lưu làm nghĩa của từ.
      await api('/notebook', { method: 'POST', body: { zh, pinyin: t.py, ...(t.vi.startsWith('(') ? {} : { vi: t.vi }) } });
      toast('Đã lưu "' + zh + '" vào Sổ tay');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Không lưu được');
    }
  };
  /** i: mũi tên của ô (âm là ô không có mũi tên), k: từ sẽ lưu nếu chạm hai lần. */
  const tap = (cell: string, i: number, k: number) => {
    const now = Date.now();
    const twice = lastTap.current.cell === cell && now - lastTap.current.at < DOUBLE_TAP_MS;
    lastTap.current = { cell: twice ? '' : cell, at: now };
    if (twice) {
      if (i >= 0) setSel(i);
      save(k);
    } else if (i >= 0) {
      setSel((s) => (s === i ? null : i));
    }
  };
  const zhRow = (
    <div className="dg-tier">
      {data.tokens.map((t, k) => {
        const i = natural.findIndex((n) => n.at === k);
        return (
          <button key={k} type="button" data-zh={k} className={'dg-cell' + (sel !== null && natural[sel]?.at === k ? ' on' : '') + (i < 0 ? ' free' : '')} onClick={() => tap('z' + k, i, k)}>
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
        <button key={i} type="button" data-vi={i} className={'dg-cell vi' + (sel === i ? ' on' : '')} onClick={() => tap('v' + i, i, n.at)}>
          {n.vi}
        </button>
      ))}
    </div>
  );

  return (
    <div>
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
      <small className="muted dg-hint">Chạm một từ để xem sợi chỉ đỏ tới nghĩa, chạm hai lần để lưu vào Sổ tay.</small>
    </div>
  );
}
