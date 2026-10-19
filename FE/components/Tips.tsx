'use client';
// Chỉ dẫn trên màn hình (rule.md mục 6): lần đầu mở mỗi màn, làm tối màn hình và chỉ lần lượt từng phần.
// Tắt/bật và xem lại ở Thêm → Hướng dẫn.
import { useEffect, useState } from 'react';

export interface Tip {
  /** Phần tử được chiếu sáng; không có thì chỉ hiện lời giải thích. */
  sel?: string;
  title: string;
  text: string;
}

export default function Tips({ screen, tips }: { screen: string; tips: Tip[] }) {
  const [i, setI] = useState(-1);
  const [box, setBox] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (localStorage.getItem('hv.tips') === 'off') return;
    if (localStorage.getItem('hv.seen.' + screen)) return;
    const t = setTimeout(() => setI(0), 700);
    return () => clearTimeout(t);
  }, [screen]);

  useEffect(() => {
    if (i < 0 || i >= tips.length) return;
    const sel = tips[i].sel;
    const el = sel ? document.querySelector(sel) : null;
    if (el) {
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      setTimeout(() => setBox(el.getBoundingClientRect()), 320);
    } else {
      setBox(null);
    }
  }, [i, tips]);

  const close = () => {
    localStorage.setItem('hv.seen.' + screen, '1');
    setI(-1);
  };

  if (i < 0 || i >= tips.length) return null;
  const tip = tips[i];
  const bottom = box && box.top < window.innerHeight / 2;

  return (
    <div id="guide" role="dialog" aria-modal="true" aria-label="Hướng dẫn">
      {box ? (
        <div
          className="gspot"
          style={{ top: box.top - 6, left: box.left - 6, width: box.width + 12, height: box.height + 12 }}
        />
      ) : (
        <div className="scrim" style={{ position: 'fixed', inset: 0 }} />
      )}
      <div className="gbub pop" style={bottom ? { bottom: 24 } : { top: 24 }}>
        <span className="gstep">
          Bước {i + 1}/{tips.length}
        </span>
        <b>{tip.title}</b>
        <p>{tip.text}</p>
        <div className="row between">
          <button className="btn ghost sm" onClick={close}>
            Bỏ qua
          </button>
          <div className="row" style={{ gap: 6 }}>
            {i > 0 ? (
              <button className="btn sm" onClick={() => setI(i - 1)}>
                Trước
              </button>
            ) : null}
            <button className="btn primary sm" onClick={() => (i + 1 >= tips.length ? close() : setI(i + 1))}>
              {i + 1 >= tips.length ? 'Xong' : 'Tiếp'}
            </button>
          </div>
        </div>
        <button
          className="lnk"
          onClick={() => {
            localStorage.setItem('hv.tips', 'off');
            close();
          }}
        >
          Không hiện hướng dẫn nữa
        </button>
      </div>
    </div>
  );
}
