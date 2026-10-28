'use client';
// Làm đề nâng cấp (rule.md mục 4): chọn cấp → làm đề (nghe, đọc, viết, có đồng hồ) → nộp → xem điểm.
// Đạt đề của đúng cấp hiện tại thì lên cấp kế (BE tự cập nhật, FE tải lại hồ sơ).
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReadinessCard from '@/components/ReadinessCard';
import Shell from '@/components/Shell';
import { api, authApi } from '@/lib/api';
import { play, stopAll } from '@/lib/audio';
import { useAuth } from '@/lib/auth';
import { useUi } from '@/lib/ui';

interface ExamList {
  note: string | null;
  currentLevel: number;
  maxLevel: number;
  levels: { level: number; exams: number; durationMin: number; maxScore: number; passScore: number; attempts: number; bestScore: number | null; passed: boolean }[];
}
interface Q {
  id: string;
  type: 'judge' | 'choice' | 'match' | 'order' | 'fill';
  pic?: string;
  text?: string;
  statement?: string;
  prompt?: string;
  options?: string[];
  pics?: boolean;
  pinyin?: string;
  py?: Record<string, string>;
  words?: string[];
  audio?: { who: string; key: string }[] | null;
  script?: { who: string; zh: string }[];
}
interface Part {
  title: string;
  guide: string;
  count: number;
  bank?: string[];
  pics?: boolean;
  bankPy?: string[];
}
interface Section {
  name: string;
  kind: string;
  max: number;
  pointsPerQuestion: number;
  parts: Part[];
  questions: Q[];
}
interface Started {
  attemptId: number;
  endsAt: string;
  exam: { title: string; level: number; durationMin: number; maxScore: number; passScore: number; sections: Section[] };
}
interface Result {
  score: number;
  maxScore: number;
  passScore: number;
  passed: boolean;
  leveledUp: boolean;
  newLevel: number;
  correct: number;
  total: number;
  sections: { name: string; correct: number; total: number; score?: number; max?: number }[];
}
type Ans = number | string | string[] | null;

/** Như đề thật: mỗi câu nghe được phát tối đa 2 lần. */
const MAX_PLAYS = 2;
const ABC = 'ABCDEF';

const mmss = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
};

const answered = (a: Ans | undefined) => a !== null && a !== undefined && a !== '' && !(Array.isArray(a) && a.length === 0);

/** Chữ Hán kèm pinyin phía trên (đề HSK 1-2 in pinyin như đề thật). */
function Zh({ t, py, size = 18 }: { t: string; py?: string; size?: number }) {
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column' }}>
      {py ? (
        <small className="muted" style={{ fontSize: 12, lineHeight: 1.3 }}>
          {py}
        </small>
      ) : null}
      <span className="han" style={{ fontSize: size, lineHeight: 1.45 }}>
        {t}
      </span>
    </span>
  );
}

const Pic = ({ e, size = 52 }: { e: string; size?: number }) => (
  <span role="img" aria-label="hình" style={{ fontSize: size, lineHeight: 1.1 }}>
    {e}
  </span>
);

export default function ExamPage() {
  const { user, setUser } = useAuth();
  const { toast } = useUi();
  const [list, setList] = useState<ExamList | null>(null);
  const [run, setRun] = useState<Started | null>(null);
  const [answers, setAnswers] = useState<Record<string, Ans>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [now, setNow] = useState(Date.now());
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [plays, setPlays] = useState<Record<string, number>>({});
  const [showPy, setShowPy] = useState(true);
  const sent = useRef(false);

  const load = useCallback(() => {
    api<ExamList>('/exams')
      .then(setList)
      .catch(() => setErr('Không tải được danh sách đề'));
  }, []);
  useEffect(() => {
    if (user) load();
  }, [user, load]);

  const start = async (level: number) => {
    setBusy(true);
    setErr('');
    try {
      const r = await api<Started>('/exams/start', { method: 'POST', body: { level } });
      sent.current = false;
      setAnswers({});
      setPlays({});
      setResult(null);
      setRun(r);
      window.scrollTo({ top: 0 });
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Không bắt đầu được');
    } finally {
      setBusy(false);
    }
  };

  const submit = useCallback(async () => {
    if (!run || sent.current) return;
    sent.current = true;
    stopAll();
    setBusy(true);
    try {
      const r = await api<Result>('/exams/attempts/' + run.attemptId + '/submit', { method: 'POST', body: { answers } });
      setResult(r);
      setRun(null);
      if (r.leveledUp) setUser(await authApi.me());
      load();
      window.scrollTo({ top: 0 });
    } catch (e) {
      sent.current = false;
      setErr(e instanceof Error ? e.message : 'Không nộp được bài');
    } finally {
      setBusy(false);
    }
  }, [run, answers, setUser, load]);

  // Đồng hồ: hết giờ thì tự nộp.
  useEffect(() => {
    if (!run) return;
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [run]);
  const left = run ? new Date(run.endsAt).getTime() - now : 0;
  useEffect(() => {
    if (run && left <= 0) {
      toast('Hết giờ, đang nộp bài');
      submit();
    }
  }, [run, left, submit, toast]);

  const total = useMemo(() => run?.exam.sections.reduce((n, s) => n + s.questions.length, 0) ?? 0, [run]);
  const done = useMemo(() => Object.values(answers).filter(answered).length, [answers]);
  const set = (id: string, a: Ans) => setAnswers((cur) => ({ ...cur, [id]: a }));

  const listen = (q: Q) => {
    if ((plays[q.id] ?? 0) >= MAX_PLAYS) return;
    setPlays((cur) => ({ ...cur, [q.id]: (cur[q.id] ?? 0) + 1 }));
    const parts = q.audio?.length ? q.audio.map((a) => ({ text: '', key: a.key })) : (q.script ?? []).map((s) => ({ text: s.zh, key: null as string | null }));
    const next = (i: number) => {
      if (i >= parts.length) return;
      play(parts[i].text, parts[i].key, { onEnd: () => next(i + 1) });
    };
    stopAll();
    next(0);
  };

  if (!user) return <Shell title="Làm đề nâng cấp">{null}</Shell>;

  // ── Kết quả ──
  if (result) {
    return (
      <Shell title="Kết quả">
        <div className="stack">
          <div className="card stack center" style={{ textAlign: 'center' }}>
            <span className="pill" style={{ margin: '0 auto' }}>
              {result.passed ? 'ĐẠT' : 'CHƯA ĐẠT'}
            </span>
            <div className="hnum2" style={{ fontSize: 44 }}>
              {result.score}/{result.maxScore}
            </div>
            <small className="muted">
              Đúng {result.correct}/{result.total} câu · điểm đạt {result.passScore}
            </small>
            {result.leveledUp ? (
              <div className="alert" style={{ borderColor: 'var(--good)', background: 'var(--goodbg)' }}>
                🎉 Chúc mừng! Bạn đã lên cấp {result.newLevel}. Các bài khóa của cấp này đã được mở.
              </div>
            ) : result.passed ? (
              <small className="muted">Bạn đã đạt đề này. Cấp hiện tại của bạn không đổi (chỉ đề đúng cấp hiện tại mới giúp lên cấp).</small>
            ) : (
              <small className="muted">Chưa đạt. Bạn có thể làm lại, hệ thống sẽ chọn một đề khác.</small>
            )}
          </div>
          <div className="card stack">
            <h2>Theo phần</h2>
            {result.sections.map((s) => (
              <div className="row between" key={s.name}>
                <span>
                  {s.name} <small className="muted">· đúng {s.correct}/{s.total} câu</small>
                </span>
                <b>{s.max ? `${s.score}/${s.max}` : `${s.correct}/${s.total}`}</b>
              </div>
            ))}
          </div>
          <button className="btn primary" onClick={() => setResult(null)}>
            Về danh sách đề
          </button>
        </div>
      </Shell>
    );
  }

  // ── Đang làm đề ──
  if (run) {
    let n = 0;
    const hasPy = run.exam.sections.some((s) => s.questions.some((q) => q.py));
    const pyOf = (q: Q, s?: string) => (showPy && s ? q.py?.[s] : undefined);
    const on = (yes: boolean) => (yes ? { borderColor: 'var(--accent)', boxShadow: '0 0 0 2px var(--accent) inset' } : undefined);

    const renderQ = (q: Q, part: Part) => {
      n++;
      const a = answers[q.id];
      const used = plays[q.id] ?? 0;
      const audible = Boolean(q.audio?.length || q.script?.length);
      return (
        <div className="card stack" key={q.id}>
          <div className="row between">
            <b>Câu {n}</b>
            {audible ? (
              <button className="btn sm" disabled={used >= MAX_PLAYS} onClick={() => listen(q)}>
                {used >= MAX_PLAYS ? 'Đã nghe 2 lần' : `▶ Nghe (còn ${MAX_PLAYS - used} lần)`}
              </button>
            ) : null}
          </div>
          {q.pic ? (
            <div style={{ textAlign: 'center' }}>
              <Pic e={q.pic} size={64} />
            </div>
          ) : null}
          {q.text && q.type !== 'fill' ? <Zh t={q.text} py={pyOf(q, q.text)} size={q.text.length > 40 ? 17 : 20} /> : null}
          {q.statement ? <Zh t={'★ ' + q.statement} py={pyOf(q, q.statement)} /> : null}
          {q.prompt ? <Zh t={q.prompt} py={pyOf(q, q.prompt)} /> : null}

          {q.type === 'judge' ? (
            <div className="row" style={{ gap: 8 }}>
              {(q.statement ? ['✓ 对', '✗ 错'] : ['✓', '✗']).map((t, i) => (
                <button key={t} className="opt" style={{ textAlign: 'center', fontSize: 20, ...on(a === i) }} onClick={() => set(q.id, i)}>
                  {t}
                </button>
              ))}
            </div>
          ) : null}

          {q.type === 'choice' && q.pics ? (
            <div className="row" style={{ gap: 8 }}>
              {(q.options ?? []).map((o, i) => (
                <button key={i} className="opt" style={{ textAlign: 'center', ...on(a === i) }} onClick={() => set(q.id, i)}>
                  <Pic e={o} size={40} />
                  <div className="muted">{ABC[i]}</div>
                </button>
              ))}
            </div>
          ) : null}

          {q.type === 'choice' && !q.pics ? (
            <div className="optgrid">
              {(q.options ?? []).map((o, i) => (
                <button key={i} className="opt" style={on(a === i)} onClick={() => set(q.id, i)}>
                  <span className="row" style={{ gap: 10, alignItems: 'center' }}>
                    <b className="muted">{ABC[i]}</b>
                    <Zh t={o} py={pyOf(q, o)} />
                  </span>
                </button>
              ))}
            </div>
          ) : null}

          {q.type === 'match' ? (
            <div className="tiles" role="radiogroup" aria-label={'Chọn đáp án câu ' + n}>
              {(part.bank ?? []).map((_, i) => (
                <button key={i} role="radio" aria-checked={a === i} className={'tile' + (a === i ? ' on' : '')} style={{ fontFamily: 'inherit', fontSize: 20 }} onClick={() => set(q.id, i)}>
                  {ABC[i]}
                </button>
              ))}
            </div>
          ) : null}

          {q.type === 'fill' ? (
            <>
              <div className="han" style={{ fontSize: 20, lineHeight: 1.6 }}>
                {(q.text ?? '').split('（　）').map((piece, i, arr) => (
                  <span key={i}>
                    {piece}
                    {i < arr.length - 1 ? (
                      <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', margin: '0 4px', verticalAlign: 'bottom' }}>
                        <small className="muted" style={{ fontSize: 13, fontFamily: 'inherit', fontWeight: 400 }}>
                          {q.pinyin}
                        </small>
                        <span style={{ borderBottom: '2px solid var(--accent)', minWidth: 32, textAlign: 'center' }}>{typeof a === 'string' && a ? a : ' '}</span>
                      </span>
                    ) : null}
                  </span>
                ))}
              </div>
              <label className="field" style={{ margin: 0, maxWidth: 180 }}>
                <input
                  className="han"
                  style={{ fontSize: 22 }}
                  lang="zh-CN"
                  maxLength={4}
                  placeholder="Viết chữ Hán"
                  aria-label={'Chữ Hán cho pinyin ' + q.pinyin}
                  value={typeof a === 'string' ? a : ''}
                  onChange={(e) => set(q.id, e.target.value)}
                />
              </label>
            </>
          ) : null}

          {q.type === 'order' ? (
            <>
              <div className="ansrow">
                {((a as string[]) ?? []).map((p, i) => (
                  <button key={i} className="tile wide on" onClick={() => set(q.id, ((a as string[]) ?? []).filter((_, k) => k !== i))}>
                    {p}
                  </button>
                ))}
              </div>
              <div className="tiles">
                {(q.words ?? []).map((wd, i) => {
                  const picked = (a as string[]) ?? [];
                  const full = picked.filter((x) => x === wd).length >= (q.words ?? []).filter((x) => x === wd).length;
                  return (
                    <button key={i} className="tile wide" disabled={full} onClick={() => set(q.id, [...picked, wd])}>
                      {wd}
                    </button>
                  );
                })}
              </div>
            </>
          ) : null}
        </div>
      );
    };

    return (
      <Shell title={'Đề HSK ' + run.exam.level}>
        <div className="stack">
          <div className="card row between sticky" style={{ top: 8, zIndex: 5 }}>
            <b>{run.exam.title}</b>
            <span className="pill" aria-live="off">
              ⏱ {mmss(left)}
            </span>
          </div>
          <small className="muted">
            Đã trả lời {done}/{total} câu · đạt từ {run.exam.passScore}/{run.exam.maxScore} điểm. Mỗi câu nghe được phát tối đa {MAX_PLAYS} lần như đề thật.
          </small>
          {hasPy ? (
            <label className="row" style={{ gap: 8 }}>
              <input type="checkbox" checked={showPy} onChange={(e) => setShowPy(e.target.checked)} />
              <span>Hiện pinyin (đề HSK 1–2 thật có in pinyin)</span>
            </label>
          ) : null}
          {err ? <div className="alert">{err}</div> : null}

          {run.exam.sections.map((s) => {
            let from = 0;
            return (
              <section className="stack" key={s.name}>
                <div className="row between">
                  <h2>{s.name}</h2>
                  <span className="pill">
                    {s.questions.length} câu · {s.max} điểm
                  </span>
                </div>
                {s.parts.map((p, pi) => {
                  const qs = s.questions.slice(from, from + p.count);
                  from += p.count;
                  return (
                    <div className="stack" key={pi}>
                      {p.title || p.guide ? (
                        <div className="card stack" style={{ background: 'var(--surface2)' }}>
                          {p.title ? <b className="han">{p.title}</b> : null}
                          {p.guide ? <small>{p.guide}</small> : null}
                          {p.bank ? (
                            <div className="optgrid" style={p.pics ? { gridTemplateColumns: 'repeat(3, 1fr)' } : undefined}>
                              {p.bank.map((b, i) => (
                                <div key={i} className="row" style={{ gap: 8, alignItems: 'center', justifyContent: p.pics ? 'center' : undefined }}>
                                  <b className="muted">{ABC[i]}</b>
                                  {p.pics ? <Pic e={b} size={40} /> : <Zh t={b} py={showPy ? p.bankPy?.[i] : undefined} size={17} />}
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                      {qs.map((q) => renderQ(q, p))}
                    </div>
                  );
                })}
              </section>
            );
          })}

          <button className="btn primary" disabled={busy} onClick={submit}>
            Nộp bài ({done}/{total})
          </button>
        </div>
      </Shell>
    );
  }

  // ── Danh sách ──
  return (
    <Shell title="Làm đề nâng cấp">
      <div className="stack">
        <h1>Làm đề nâng cấp</h1>
        <p className="muted">
          Đề giống đề HSK thật: nghe, đọc, viết, có đồng hồ. Mỗi lần hệ thống chọn ngẫu nhiên một đề của cấp bạn chọn. Đạt đề của <b>đúng cấp hiện tại</b> thì lên cấp kế.
        </p>
        {list?.note ? <div className="alert">{list.note}</div> : null}
        {err ? <div className="alert">{err}</div> : null}
        {!list ? <p className="muted">Đang tải…</p> : null}
        {list ? <ReadinessCard level={list.currentLevel} showTestLink /> : null}
        {list?.levels.map((l) => {
          const mine = l.level === list.currentLevel;
          return (
            <div className="card stack" key={l.level} style={mine ? { borderColor: 'var(--accent)' } : undefined}>
              <div className="row between">
                <h2>Đề HSK {l.level}</h2>
                <span className="pill">{mine ? 'Cấp của bạn' : l.level < list.currentLevel ? 'Đã qua' : 'Cấp cao hơn'}</span>
              </div>
              <small className="muted">
                {l.exams} đề · {l.durationMin} phút · đạt {l.passScore}/{l.maxScore} · thi để lên cấp {l.level + 1}
              </small>
              <small className="muted">
                Đã thi {l.attempts} lần{l.bestScore !== null ? ` · điểm cao nhất ${l.bestScore}` : ''}
                {l.passed ? ' · ✓ đã đạt' : ''}
              </small>
              <button className={'btn' + (mine ? ' primary' : '')} disabled={busy} onClick={() => start(l.level)}>
                {mine ? `Làm đề lên cấp ${l.level + 1}` : 'Làm thử đề này'}
              </button>
            </div>
          );
        })}
      </div>
    </Shell>
  );
}
