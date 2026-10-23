'use client';
// Kiểm tra từ vựng tự luận (rule.md mục 3.3, đổi 23/10/2026): 3 cách — Hán → Việt, Việt → Hán, nghe → viết cả chữ Hán
// và nghĩa (mỗi phần nửa điểm) — hoặc trộn. Nguồn: Sổ tay (hoặc nhóm đang ôn) hay bộ từ HSK 1-3 (tối thiểu 20 câu, tối đa
// cả bộ). Chấm cứng ở máy chủ: chữ Hán phải đúng (không nhận pinyin), nghĩa phải khớp một nghĩa trong bảng từ.
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReadinessCard, { type Readiness, type VocabOverview } from '@/components/ReadinessCard';
import Shell from '@/components/Shell';
import WordSheet from '@/components/WordSheet';
import { api } from '@/lib/api';
import { play } from '@/lib/audio';
import { useAuth } from '@/lib/auth';
import { useUi } from '@/lib/ui';
import type { UserWord } from '@/lib/types';

type Mode = 'zh2vi' | 'vi2zh' | 'audio';
type ModeChoice = Mode | 'mix';
type Source = { kind: 'hsk'; level: number } | { kind: 'notebook' } | { kind: 'group'; ids: number[] };

interface Question {
  i: number;
  mode: Mode;
  zh?: string;
  pinyin?: string;
  vi?: string;
  pos?: string | null;
}
interface Started {
  id: number;
  source: 'hsk' | 'notebook';
  level: number | null;
  setSize: number;
  questions: Question[];
}
interface Detail {
  i: number;
  mode: Mode;
  zh: string;
  pinyin: string;
  vi: string;
  also: string[];
  yourZh: string;
  yourVi: string;
  zhOk: boolean | null;
  viOk: boolean | null;
  accepted: string | null;
  score: number;
}
interface Result {
  score: number;
  total: number;
  pct: number;
  full: boolean;
  level: number | null;
  detail: Detail[];
  readiness: Readiness | null;
}
type Ans = { zh: string; vi: string };

const MODES: { v: ModeChoice; label: string; hint: string }[] = [
  { v: 'zh2vi', label: 'Hán → Việt', hint: 'Cho chữ Hán, bạn viết nghĩa tiếng Việt (một nghĩa là đủ).' },
  { v: 'vi2zh', label: 'Việt → Hán', hint: 'Cho nghĩa tiếng Việt, bạn gõ chữ Hán (không nhận pinyin).' },
  { v: 'audio', label: 'Nghe → viết', hint: 'Nghe rồi viết cả chữ Hán và nghĩa tiếng Việt; mỗi phần nửa điểm.' },
  { v: 'mix', label: 'Trộn', hint: 'Trộn đều cả ba cách.' },
];

const verdict = (pct: number) =>
  pct >= 90 ? 'Xuất sắc! Bạn nắm rất chắc bộ từ này.' : pct >= 80 ? 'Tốt! Đã đạt mức gợi ý 80%.' : pct >= 60 ? 'Khá, ôn thêm các từ sai rồi làm lại nhé.' : 'Cần ôn thêm. Xem lại các từ sai bên dưới.';

export default function QuizPage() {
  const { user } = useAuth();
  const { openSheet, toast } = useUi();
  const [ov, setOv] = useState<VocabOverview | null>(null);
  const [src, setSrc] = useState<Source | null>(null);
  const [mode, setMode] = useState<ModeChoice>('mix');
  const [count, setCount] = useState(20);
  const [run, setRun] = useState<Started | null>(null);
  const [ans, setAns] = useState<Ans[]>([]);
  const [at, setAt] = useState(0);
  const [showPy, setShowPy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const firstInput = useRef<HTMLInputElement>(null);

  const loadOverview = useCallback(() => {
    api<VocabOverview>('/vocab-test')
      .then((o) => {
        setOv(o);
        setSrc((s) => s ?? { kind: 'hsk', level: Math.min(Math.max(o.currentLevel, 1), 3) });
      })
      .catch(() => toast('Không tải được bộ từ'));
  }, [toast]);

  useEffect(() => {
    if (!user) return;
    // "Ôn nhóm này" ở Sổ tay gửi sang danh sách từ của nhóm.
    try {
      const saved = sessionStorage.getItem('hv.review');
      if (saved) {
        sessionStorage.removeItem('hv.review');
        const ids = (JSON.parse(saved) as UserWord[]).map((w) => w.id);
        if (ids.length) {
          setSrc({ kind: 'group', ids });
          setCount(ids.length);
        }
      }
    } catch {
      /* bỏ qua */
    }
    loadOverview();
  }, [user, loadOverview]);

  const size = !src || !ov ? 0 : src.kind === 'hsk' ? (ov.sets.find((s) => s.level === src.level)?.total ?? 0) : src.kind === 'group' ? src.ids.length : ov.notebook;
  const min = src?.kind === 'hsk' ? (ov?.minCount ?? 20) : 1;

  // Đổi nguồn thì đưa số câu về khoảng hợp lệ.
  useEffect(() => {
    if (!size) return;
    setCount((c) => Math.min(Math.max(c, Math.min(min, size)), size));
  }, [size, min]);

  const q = run?.questions[at];
  useEffect(() => {
    if (q?.mode === 'audio' && q.zh) play(q.zh, null, {});
    setShowPy(false);
    requestAnimationFrame(() => firstInput.current?.focus());
  }, [q]);

  const start = async () => {
    if (!src) return;
    setBusy(true);
    try {
      const body = src.kind === 'hsk' ? { source: 'hsk', level: src.level, count, mode } : { source: 'notebook', ids: src.kind === 'group' ? src.ids : undefined, count, mode };
      const r = await api<Started>('/vocab-test/start', { method: 'POST', body });
      setRun(r);
      setAns(r.questions.map(() => ({ zh: '', vi: '' })));
      setAt(0);
      setResult(null);
      window.scrollTo({ top: 0 });
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Không bắt đầu được');
    } finally {
      setBusy(false);
    }
  };

  const submit = async () => {
    if (!run) return;
    const empty = run.questions.filter((qq, k) => (qq.mode === 'zh2vi' ? !ans[k].vi.trim() : qq.mode === 'vi2zh' ? !ans[k].zh.trim() : !ans[k].zh.trim() && !ans[k].vi.trim())).length;
    if (empty && !window.confirm(`Còn ${empty} câu chưa trả lời (tính là sai). Nộp bài?`)) return;
    setBusy(true);
    try {
      const r = await api<Result>('/vocab-test/' + run.id + '/submit', { method: 'POST', body: { answers: ans } });
      setResult(r);
      setRun(null);
      loadOverview();
      window.scrollTo({ top: 0 });
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Không nộp được');
    } finally {
      setBusy(false);
    }
  };

  const setA = (patch: Partial<Ans>) => setAns((a) => a.map((x, k) => (k === at ? { ...x, ...patch } : x)));
  const next = () => (run && at < run.questions.length - 1 ? setAt(at + 1) : submit());

  // ── Kết quả ──
  if (result) {
    const wrong = result.detail.filter((d) => d.score < 1);
    return (
      <Shell title="Kiểm tra">
        <div className="stack">
          <div className="card center stack">
            <span className="eyebrow2">{result.level ? `Bộ từ HSK ${result.level}` : 'Sổ tay'}</span>
            <h1 style={{ fontSize: 40 }}>{result.pct}%</h1>
            <b>
              {result.score.toLocaleString('vi-VN')}/{result.total} điểm
            </b>
            <p className="muted">{verdict(result.pct)}</p>
            {result.level && !result.full ? <small className="muted">Bạn làm {result.total} câu trong bộ. Làm toàn bộ để biết chính xác mức của mình.</small> : null}
            <div className="row" style={{ gap: 8, justifyContent: 'center' }}>
              <button className="btn primary" disabled={busy} onClick={start}>
                Làm lại ({count} câu)
              </button>
              <button className="btn" onClick={() => setResult(null)}>
                Đổi bài
              </button>
            </div>
          </div>

          {result.readiness ? <ReadinessCard data={result.readiness} /> : null}

          {wrong.length ? (
            <div className="card stack">
              <h2>Câu sai và chưa đủ điểm ({wrong.length})</h2>
              {wrong.map((d) => (
                <button
                  key={d.i}
                  className="keyc"
                  onClick={() => openSheet(<WordSheet word={{ zh: d.zh, pinyin: d.pinyin, vi: d.vi }} />)}
                  style={{ textAlign: 'left', display: 'grid', gap: 4 }}
                >
                  <span className="row between">
                    <span>
                      <b className="han" style={{ fontSize: 22 }}>
                        {d.zh}
                      </b>{' '}
                      <span className="py">{d.pinyin}</span>
                    </span>
                    <small className="muted">
                      Câu {d.i + 1} · {d.score} điểm
                    </small>
                  </span>
                  <small>
                    Nghĩa: <b>{d.vi}</b>
                    {d.also.length ? <span className="muted"> · cũng nhận: {d.also.join(', ')}</span> : null}
                  </small>
                  {d.zhOk !== null ? (
                    <small style={{ color: d.zhOk ? 'var(--good)' : 'var(--bad)' }}>
                      {d.zhOk ? '✓' : '✗'} Chữ Hán bạn gõ: <span className="han">{d.yourZh || '(bỏ trống)'}</span>
                      {d.accepted ? ' (cùng nghĩa, được tính đúng)' : ''}
                    </small>
                  ) : null}
                  {d.viOk !== null ? (
                    <small style={{ color: d.viOk ? 'var(--good)' : 'var(--bad)' }}>
                      {d.viOk ? '✓' : '✗'} Nghĩa bạn ghi: {d.yourVi || '(bỏ trống)'}
                    </small>
                  ) : null}
                </button>
              ))}
            </div>
          ) : (
            <div className="alert" style={{ borderColor: 'var(--good)', background: 'var(--goodbg)' }}>
              Bạn đúng hết, không có từ nào cần ôn.
            </div>
          )}
          <Link className="btn" href="/so-tay" style={{ textAlign: 'center' }}>
            Về Sổ tay
          </Link>
        </div>
      </Shell>
    );
  }

  // ── Đang làm ──
  if (run && q) {
    const a = ans[at];
    const total = run.questions.length;
    const answered = ans.filter((x) => x.zh.trim() || x.vi.trim()).length;
    const onKey = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
        e.preventDefault();
        next();
      }
    };
    return (
      <Shell title="Kiểm tra">
        <div className="stack">
          <div className="row between">
            <span className="eyebrow2">
              Câu {at + 1}/{total}
            </span>
            <span className="pill">đã trả lời {answered}</span>
          </div>
          <div className="bar">
            <i style={{ width: ((at + 1) / total) * 100 + '%' }} />
          </div>

          <div className="card prompt">
            {q.mode === 'zh2vi' ? (
              <>
                <span className="eyebrow2">Từ này nghĩa là gì?</span>
                <span className="han">{q.zh}</span>
                {showPy ? (
                  <span className="py">{q.pinyin}</span>
                ) : (
                  <button className="btn sm" onClick={() => setShowPy(true)}>
                    Hiện pinyin
                  </button>
                )}
              </>
            ) : q.mode === 'vi2zh' ? (
              <>
                <span className="eyebrow2">Gõ chữ Hán của từ này</span>
                <span className="vi">{q.vi}</span>
                {q.pos ? <small className="muted">{q.pos}</small> : null}
              </>
            ) : (
              <>
                <span className="eyebrow2">Nghe rồi viết chữ Hán và nghĩa</span>
                <button className="icon-btn bigspk" aria-label="Nghe lại" onClick={() => q.zh && play(q.zh, null, {})}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M4 9v6h3l5 4V5L7 9H4zM16 8.5a4 4 0 0 1 0 7" />
                  </svg>
                </button>
                <button className="btn sm" onClick={() => q.zh && play(q.zh, null, { slow: true })}>
                  Nghe chậm
                </button>
              </>
            )}
          </div>

          {q.mode !== 'zh2vi' ? (
            <label className="field">
              Chữ Hán (không nhận pinyin)
              <input ref={firstInput} className="hanin" value={a.zh} onChange={(e) => setA({ zh: e.target.value })} onKeyDown={onKey} autoComplete="off" placeholder="ví dụ: 咖啡" />
            </label>
          ) : null}
          {q.mode !== 'vi2zh' ? (
            <label className="field">
              Nghĩa tiếng Việt (một nghĩa là đủ)
              <input
                ref={q.mode === 'zh2vi' ? firstInput : undefined}
                value={a.vi}
                onChange={(e) => setA({ vi: e.target.value })}
                onKeyDown={onKey}
                autoComplete="off"
                placeholder="ví dụ: cà phê"
              />
            </label>
          ) : null}

          <div className="row" style={{ gap: 8 }}>
            <button className="btn" disabled={at === 0} onClick={() => setAt(at - 1)}>
              ‹ Câu trước
            </button>
            <button className="btn primary grow" disabled={busy} onClick={next}>
              {at < total - 1 ? 'Câu tiếp ›' : 'Nộp bài'}
            </button>
          </div>
          {at < total - 1 ? (
            <button className="btn ghost sm" disabled={busy} onClick={submit}>
              Nộp bài ngay
            </button>
          ) : null}
          <p className="muted" style={{ fontSize: 12 }}>
            Bấm Enter để sang câu tiếp. Nghĩa tiếng Việt cần đúng dấu; hoa/thường và dấu câu không tính.
          </p>
        </div>
      </Shell>
    );
  }

  // ── Chọn bài ──
  const srcKey = (s: Source | null) => (!s ? '' : s.kind === 'hsk' ? 'hsk' + s.level : s.kind);
  return (
    <Shell title="Kiểm tra">
      <div className="stack">
        <h1>Kiểm tra từ vựng</h1>
        {!ov ? <p className="muted">Đang tải…</p> : null}
        {ov ? <ReadinessCard data={ov.readiness.find((r) => r.level === ov.currentLevel) ?? null} /> : null}

        {ov ? (
          <section className="card stack">
            <span className="eyebrow2">1. Chọn bộ từ</span>
            <div className="stack" style={{ gap: 8 }}>
              {src?.kind === 'group' ? (
                <button className="opt ok" style={{ textAlign: 'left' }}>
                  <b>Nhóm đang ôn</b> <small className="muted">· {src.ids.length} từ từ Sổ tay</small>
                </button>
              ) : null}
              {ov.sets.map((s) => (
                <button
                  key={s.level}
                  className={'opt' + (srcKey(src) === 'hsk' + s.level ? ' ok' : '')}
                  onClick={() => setSrc({ kind: 'hsk', level: s.level })}
                  style={{ textAlign: 'left' }}
                >
                  <span className="row between" style={{ gap: 8 }}>
                    <span>
                      <b>Bộ từ HSK {s.level}</b> <small className="muted">· {s.total} từ</small>
                      {s.level === ov.currentLevel ? <small className="muted"> · cấp của bạn</small> : null}
                    </span>
                    <small className={s.best ? 'py' : 'muted'} style={{ fontWeight: 700 }}>
                      {s.best ? `cao nhất ${s.best.pct}%` : 'chưa làm'}
                    </small>
                  </span>
                </button>
              ))}
              <button
                className={'opt' + (srcKey(src) === 'notebook' ? ' ok' : '')}
                disabled={!ov.notebook}
                onClick={() => setSrc({ kind: 'notebook' })}
                style={{ textAlign: 'left' }}
              >
                <b>Sổ tay của tôi</b> <small className="muted">· {ov.notebook} từ có nghĩa</small>
              </button>
            </div>
          </section>
        ) : null}

        {ov ? (
          <section className="card stack">
            <span className="eyebrow2">2. Cách kiểm tra</span>
            <div className="seg" role="tablist" aria-label="Cách kiểm tra">
              {MODES.map((m) => (
                <button key={m.v} role="tab" aria-selected={mode === m.v} className={mode === m.v ? 'on' : ''} onClick={() => setMode(m.v)}>
                  {m.label}
                </button>
              ))}
            </div>
            <p className="muted" style={{ fontSize: 13 }}>
              {MODES.find((m) => m.v === mode)?.hint}
            </p>
          </section>
        ) : null}

        {ov && size ? (
          <section className="card stack">
            <span className="eyebrow2">3. Số câu</span>
            <div className="row" style={{ gap: 8 }}>
              <label className="field grow" style={{ margin: 0 }}>
                <input
                  type="number"
                  inputMode="numeric"
                  min={Math.min(min, size)}
                  max={size}
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value) || 0)}
                  onBlur={() => setCount((c) => Math.min(Math.max(c, Math.min(min, size)), size))}
                  aria-label="Số câu"
                />
              </label>
              {[20, 50].filter((n) => n < size && n >= Math.min(min, size)).map((n) => (
                <button key={n} className="chip" onClick={() => setCount(n)}>
                  {n}
                </button>
              ))}
              <button className="chip" onClick={() => setCount(size)}>
                Toàn bộ ({size})
              </button>
            </div>
            <small className="muted">
              {src?.kind === 'hsk' ? `Tối thiểu ${min} câu, tối đa cả bộ (${size} từ).` : `Từ 1 đến ${size} câu.`} Từ được chọn ngẫu nhiên.
            </small>
            <button className="btn primary" disabled={busy || count < Math.min(min, size) || count > size} onClick={start}>
              Bắt đầu {count} câu
            </button>
          </section>
        ) : null}
      </div>
    </Shell>
  );
}
