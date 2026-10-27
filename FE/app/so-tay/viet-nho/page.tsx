'use client';
// Viết chữ TỪ TRÍ NHỚ (kiểu Skritter, rule.md 3.1, thêm 27/10/2026): app chỉ cho nghĩa tiếng Việt và âm thanh (pinyin bấm
// mới hiện), người học tự viết từng chữ trên khung TRỐNG (không có nét mờ). Sai 3 nét liền thì máy gợi ý nét kế tiếp;
// "Xem cách viết" cho chạy mẫu (tính là chưa nhớ). Chấm nét bằng hanzi-writer ngay trên máy, không gửi gì lên máy chủ.
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import Shell from '@/components/Shell';
import WordSheet from '@/components/WordSheet';
import { api } from '@/lib/api';
import { play } from '@/lib/audio';
import { useAuth } from '@/lib/auth';
import { useUi } from '@/lib/ui';

interface W {
  zh: string;
  pinyin: string;
  vi: string;
}
type Src = { kind: 'hsk'; level: number } | { kind: 'notebook' };
interface Score {
  zh: string;
  mistakes: number;
  revealed: boolean;
}

interface Writer {
  quiz: (o: unknown) => void;
  cancelQuiz?: () => void;
  animateCharacter?: (o?: unknown) => void;
}

export default function WriteFromMemory() {
  const { user } = useAuth();
  const { toast, openSheet } = useUi();
  const [src, setSrc] = useState<Src>({ kind: 'hsk', level: 1 });
  const [count, setCount] = useState(10);
  const [words, setWords] = useState<W[] | null>(null);
  const [wi, setWi] = useState(0);
  const [ci, setCi] = useState(0);
  const [showPy, setShowPy] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [charDone, setCharDone] = useState(false);
  const [scores, setScores] = useState<Score[]>([]);
  const box = useRef<HTMLDivElement | null>(null);
  const writer = useRef<Writer | null>(null);

  useEffect(() => {
    if (user) setSrc({ kind: 'hsk', level: Math.min(Math.max(user.hskStandard === 'HSK3' ? 2 : user.hskLevel, 1), 3) });
  }, [user]);

  const w = words?.[wi];
  const chars = w ? [...w.zh].filter((c) => /\p{Script=Han}/u.test(c)) : [];
  const ch = chars[ci];

  const start = async () => {
    try {
      const q = src.kind === 'hsk' ? `source=hsk&level=${src.level}&count=${count}` : `source=notebook&count=${count}`;
      const r = await api<W[]>('/vocab-test/write-words?' + q);
      if (!r.length) {
        toast('Không có từ nào để luyện');
        return;
      }
      setWords(r);
      setWi(0);
      setCi(0);
      setScores([]);
      setMistakes(0);
      setRevealed(false);
      setShowPy(false);
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Không tải được từ');
    }
  };

  const mountChar = useCallback(async () => {
    if (!box.current || !ch) return;
    const mod = await import('hanzi-writer');
    box.current.innerHTML = '';
    setCharDone(false);
    const css = (v: string, d: string) => getComputedStyle(document.body).getPropertyValue(v).trim() || d;
    const hw = mod.default.create(box.current, ch, {
      width: 280,
      height: 280,
      padding: 8,
      showCharacter: false,
      showOutline: false, // trí nhớ: không có nét mờ
      showHintAfterMisses: 3,
      highlightOnComplete: true,
      strokeColor: css('--fg', '#15211F'),
      outlineColor: css('--line', '#D2DCD9'),
      drawingColor: css('--accent', '#0E7466'),
      drawingWidth: 26,
    });
    writer.current = hw as unknown as Writer;
    hw.quiz({
      onMistake: () => setMistakes((m) => m + 1),
      onComplete: () => setCharDone(true),
    });
  }, [ch]);

  useEffect(() => {
    mountChar();
    return () => writer.current?.cancelQuiz?.();
  }, [mountChar, wi]);

  useEffect(() => {
    if (w) play(w.zh, null, {});
  }, [w]);

  const reveal = () => {
    setRevealed(true);
    writer.current?.cancelQuiz?.();
    writer.current?.animateCharacter?.({ onComplete: () => setCharDone(true) });
  };

  const nextStep = () => {
    if (!w) return;
    if (ci < chars.length - 1) {
      setCi(ci + 1);
      return;
    }
    setScores((s) => [...s, { zh: w.zh, mistakes, revealed }]);
    setWi(wi + 1);
    setCi(0);
    setMistakes(0);
    setRevealed(false);
    setShowPy(false);
  };

  // ── Kết quả ──
  if (words && !w) {
    const good = scores.filter((s) => !s.revealed && s.mistakes <= 2);
    const weak = scores.filter((s) => s.revealed || s.mistakes > 2);
    return (
      <Shell title="Viết từ trí nhớ">
        <div className="stack">
          <div className="card center stack">
            <h1>
              {good.length}/{scores.length}
            </h1>
            <p className="muted">từ viết được từ trí nhớ (sai tối đa 2 nét, không xem mẫu)</p>
            <button className="btn primary" onClick={start}>
              Luyện tiếp {count} từ
            </button>
          </div>
          {weak.length ? (
            <div className="card stack">
              <h2>Cần ôn ({weak.length})</h2>
              {weak.map((s) => (
                <button key={s.zh} className="row between" onClick={() => openSheet(<WordSheet word={{ zh: s.zh }} />)} style={{ background: 'none', border: 0, padding: '6px 0', textAlign: 'left' }}>
                  <span className="han" style={{ fontSize: 24 }}>
                    {s.zh}
                  </span>
                  <small className="muted">{s.revealed ? 'đã xem mẫu' : `sai ${s.mistakes} nét`} ›</small>
                </button>
              ))}
              <small className="muted">Chạm một từ để xem cách nhớ chữ và tập viết lại.</small>
            </div>
          ) : null}
          <Link className="btn" href="/so-tay" style={{ textAlign: 'center' }}>
            Về Sổ tay
          </Link>
        </div>
      </Shell>
    );
  }

  // ── Đang viết ──
  if (w) {
    return (
      <Shell title="Viết từ trí nhớ">
        <div className="stack">
          <div className="row between">
            <span className="eyebrow2">
              Từ {wi + 1}/{words!.length}
              {chars.length > 1 ? ` · chữ ${ci + 1}/${chars.length}` : ''}
            </span>
            <span className="pill">sai {mistakes} nét</span>
          </div>
          <div className="card prompt" style={{ padding: 14 }}>
            <span className="eyebrow2">Viết chữ Hán của từ</span>
            <b style={{ fontSize: 20 }}>{w.vi}</b>
            <div className="row" style={{ gap: 8, justifyContent: 'center' }}>
              <button className="btn sm" onClick={() => play(w.zh, null, {})}>
                🔊 Nghe
              </button>
              {showPy ? (
                <span className="py">{w.pinyin}</span>
              ) : (
                <button className="btn sm" onClick={() => setShowPy(true)}>
                  Hiện pinyin
                </button>
              )}
            </div>
            {chars.length > 1 ? (
              <div className="row" style={{ gap: 6, justifyContent: 'center' }}>
                {chars.map((c, k) => (
                  <span key={k} className="han" style={{ fontSize: 22, minWidth: 28, borderBottom: '2px solid var(--line)', textAlign: 'center' }}>
                    {k < ci ? c : k === ci ? '?' : '·'}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <div style={{ display: 'grid', placeItems: 'center' }}>
            <div ref={box} className="card" style={{ width: 296, height: 296, padding: 8, touchAction: 'none' }} aria-label="Khung viết chữ" />
          </div>
          {charDone ? (
            <button className="btn primary" onClick={nextStep}>
              {ci < chars.length - 1 ? 'Chữ tiếp theo ›' : 'Từ tiếp theo ›'}
            </button>
          ) : (
            <button className="btn" onClick={reveal}>
              Không nhớ, xem cách viết
            </button>
          )}
          <p className="muted" style={{ fontSize: 12 }}>
            Viết từng nét bằng ngón tay theo đúng thứ tự. Sai 3 lần một nét thì máy chớp sáng nét đó để gợi ý.
          </p>
        </div>
      </Shell>
    );
  }

  // ── Chọn bài ──
  return (
    <Shell title="Viết từ trí nhớ">
      <div className="stack">
        <h1>Viết chữ từ trí nhớ</h1>
        <p className="muted">
          Đọc được nhưng không nhớ mặt chữ? App chỉ cho nghĩa và âm thanh, bạn tự viết lại chữ trên khung trống. Đây là cách
          luyện nhớ chữ hiệu quả nhất.
        </p>
        <section className="card stack">
          <span className="eyebrow2">Bộ từ</span>
          <div className="chips">
            {[1, 2, 3].map((l) => (
              <button key={l} className={'chip' + (src.kind === 'hsk' && src.level === l ? ' on' : '')} onClick={() => setSrc({ kind: 'hsk', level: l })}>
                HSK {l}
              </button>
            ))}
            <button className={'chip' + (src.kind === 'notebook' ? ' on' : '')} onClick={() => setSrc({ kind: 'notebook' })}>
              Sổ tay của tôi
            </button>
          </div>
          <span className="eyebrow2">Số từ</span>
          <div className="chips">
            {[5, 10, 20].map((n) => (
              <button key={n} className={'chip' + (count === n ? ' on' : '')} onClick={() => setCount(n)}>
                {n} từ
              </button>
            ))}
          </div>
          <button className="btn primary" onClick={start}>
            Bắt đầu
          </button>
        </section>
      </div>
    </Shell>
  );
}
