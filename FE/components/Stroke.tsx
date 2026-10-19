'use client';
// Cách viết từng nét và tập viết bằng ngón tay (rule.md mục 3.1).
// Dữ liệu nét lấy từ hanzi-writer (nguồn mở), tải theo từng chữ từ CDN.
import { useCallback, useEffect, useRef, useState } from 'react';

interface CharData {
  strokes: string[];
  medians: number[][][];
}

// Khung 1024×1024 của hanzi-writer, trục Y ngược nên phải lật lại khi vẽ.
const SIZE = 1024;
const FLIP = 'translate(0, ' + SIZE + ') scale(1, -1)';
const toScreen = (p: number[]) => [p[0], SIZE - p[1]] as const;

async function loadChar(ch: string): Promise<CharData> {
  const mod = await import('hanzi-writer');
  const HanziWriter = mod.default;
  return (await HanziWriter.loadCharacterData(ch)) as unknown as CharData;
}

/** Mũi tên hướng viết ở cuối đường nét đứt. */
function arrow(median: number[][]) {
  if (median.length < 2) return null;
  const [x2, y2] = toScreen(median[median.length - 1]);
  const [x1, y1] = toScreen(median[Math.max(0, median.length - 2)]);
  const a = Math.atan2(y2 - y1, x2 - x1);
  const w = 26;
  const pts = [
    [x2, y2],
    [x2 - w * Math.cos(a - 0.45), y2 - w * Math.sin(a - 0.45)],
    [x2 - w * Math.cos(a + 0.45), y2 - w * Math.sin(a + 0.45)],
  ];
  return <polygon className="s-arrow" points={pts.map((p) => p.join(',')).join(' ')} />;
}

export default function Stroke({ word }: { word: string }) {
  const chars = [...word].filter((c) => /[一-鿿]/.test(c));
  const [ci, setCi] = useState(0);
  const char = chars[ci] ?? '';
  const [mode, setMode] = useState<'view' | 'practice'>('view');
  const [data, setData] = useState<CharData | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [cur, setCur] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState<{ ok: number; miss: number } | null>(null);
  const box = useRef<HTMLDivElement | null>(null);
  const writer = useRef<{ quiz: (o: unknown) => void; cancelQuiz?: () => void } | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    setData(null);
    setErr(null);
    setCur(0);
    setPlaying(false);
    if (!char) return;
    let alive = true;
    loadChar(char)
      .then((d) => alive && setData(d))
      .catch(() => alive && setErr('Chưa có dữ liệu nét cho chữ này.'));
    return () => {
      alive = false;
    };
  }, [char]);

  // Chạy cả chữ: hiện lần lượt từng nét.
  useEffect(() => {
    if (!playing || !data) return;
    if (cur >= data.strokes.length) {
      setPlaying(false);
      return;
    }
    timer.current = window.setTimeout(() => setCur((c) => c + 1), 620);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [playing, cur, data]);

  // Tập viết: để hanzi-writer nhận nét vẽ bằng ngón tay.
  const startQuiz = useCallback(async () => {
    if (!box.current || !char) return;
    const mod = await import('hanzi-writer');
    const HanziWriter = mod.default;
    box.current.innerHTML = '';
    setDone(null);
    const w = HanziWriter.create(box.current, char, {
      width: 320,
      height: 320,
      padding: 8,
      showCharacter: false,
      showOutline: true,
      showHintAfterMisses: 2,
      highlightOnComplete: true,
      strokeColor: getComputedStyle(document.body).getPropertyValue('--fg').trim() || '#15211F',
      outlineColor: getComputedStyle(document.body).getPropertyValue('--line').trim() || '#D2DCD9',
      drawingColor: getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#0E7466',
      drawingWidth: 28,
    });
    writer.current = w as unknown as { quiz: (o: unknown) => void; cancelQuiz?: () => void };
    w.quiz({
      onComplete: (res: { totalMistakes: number }) =>
        setDone({ ok: 1, miss: res.totalMistakes }),
    });
  }, [char]);

  useEffect(() => {
    if (mode !== 'practice') {
      writer.current?.cancelQuiz?.();
      writer.current = null;
      return;
    }
    startQuiz();
  }, [mode, startQuiz]);

  const n = data?.strokes.length ?? 0;
  const shown = Math.min(cur, n);

  return (
    <div className="stack">
      {chars.length > 1 ? (
        <div className="chgrid" role="group" aria-label="Chọn chữ">
          {chars.map((c, i) => (
            <button key={c + i} className="chbtn" aria-pressed={i === ci} onClick={() => setCi(i)} style={i === ci ? { borderColor: 'var(--accent)' } : undefined}>
              <span className="han">{c}</span>
              <span className="py">chữ {i + 1}</span>
            </button>
          ))}
        </div>
      ) : null}

      <div className="seg" role="tablist" aria-label="Chế độ">
        <button className={mode === 'view' ? 'on' : ''} role="tab" aria-selected={mode === 'view'} onClick={() => setMode('view')}>
          Xem cách viết
        </button>
        <button className={mode === 'practice' ? 'on' : ''} role="tab" aria-selected={mode === 'practice'} onClick={() => setMode('practice')}>
          Tập viết
        </button>
      </div>

      <div className="board">
        {mode === 'practice' ? (
          <div className="bw">
            <div ref={box} />
          </div>
        ) : (
          <div className="bw">
            <svg viewBox={'0 0 ' + SIZE + ' ' + SIZE} role="img" aria-label={'Cách viết chữ ' + char}>
              <rect className="sbx" x="4" y="4" width={SIZE - 8} height={SIZE - 8} rx="16" />
              <path className="sg" d={'M0 ' + SIZE / 2 + 'H' + SIZE + 'M' + SIZE / 2 + ' 0V' + SIZE} />
              <path className="sg" d={'M0 0L' + SIZE + ' ' + SIZE + 'M' + SIZE + ' 0L0 ' + SIZE} />
              <g transform={FLIP}>
                {data?.strokes.map((d, i) => (
                  <path key={i} className={i < shown ? 's-done' : 's-ghost'} d={d} />
                ))}
              </g>
              {data && shown < n ? (
                <>
                  <polyline
                    className="s-guide"
                    points={data.medians[shown].map((p) => toScreen(p).join(',')).join(' ')}
                  />
                  {arrow(data.medians[shown])}
                  <circle className="s-dot big" cx={toScreen(data.medians[shown][0])[0]} cy={toScreen(data.medians[shown][0])[1]} r="30" />
                  <text
                    className="s-num"
                    x={toScreen(data.medians[shown][0])[0]}
                    y={toScreen(data.medians[shown][0])[1] + 15}
                    textAnchor="middle"
                  >
                    {shown + 1}
                  </text>
                </>
              ) : null}
            </svg>
          </div>
        )}
      </div>

      {err ? <p className="muted">{err}</p> : null}

      {mode === 'view' ? (
        <>
          <div className="row between">
            <div className="row" style={{ gap: 6 }}>
              <button className="btn sm" disabled={!data || shown === 0} onClick={() => { setPlaying(false); setCur((c) => Math.max(0, c - 1)); }}>
                ◀ Nét trước
              </button>
              <button className="btn sm" disabled={!data || shown >= n} onClick={() => { setPlaying(false); setCur((c) => c + 1); }}>
                Nét sau ▶
              </button>
            </div>
            <span className="pill">{data ? shown + '/' + n + ' nét' : '…'}</span>
          </div>
          <div className="row" style={{ gap: 6 }}>
            <button
              className="btn primary sm grow"
              disabled={!data}
              onClick={() => {
                setCur(0);
                setPlaying(true);
              }}
            >
              Chạy cả chữ
            </button>
            <button className="btn sm" disabled={!data} onClick={() => { setPlaying(false); setCur(n); }}>
              Hiện cả chữ
            </button>
          </div>
          <details className="card">
            <summary>Quy tắc thứ tự nét</summary>
            <ul>
              <li>Ngang trước, dọc sau (十).</li>
              <li>Phẩy trái trước, phẩy phải sau (八).</li>
              <li>Trên trước, dưới sau (三).</li>
              <li>Ngoài trước, trong sau; đóng khung thì bịt cửa cuối cùng (国).</li>
              <li>Giữa trước, hai bên sau (小).</li>
            </ul>
          </details>
          <p className="muted" style={{ fontSize: 13 }}>
            Chấm đỏ là chỗ đặt bút, đường nét đứt và mũi tên chỉ hướng đi, số là thứ tự nét.
          </p>
        </>
      ) : (
        <>
          <div className="row between">
            <span className="muted" style={{ fontSize: 13 }}>
              Dùng ngón tay (hoặc chuột) viết theo thứ tự nét.
            </span>
            <button className="btn sm" onClick={startQuiz}>
              Viết lại
            </button>
          </div>
          {done ? (
            <div className="alert" style={{ borderColor: 'var(--good)', background: 'var(--goodbg)' }}>
              Viết xong chữ {char}. Số lần sai: {done.miss}.
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
