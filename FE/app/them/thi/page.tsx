'use client';
// Làm đề nâng cấp (rule.md mục 4): chọn cấp → làm đề (nghe, đọc, viết, có đồng hồ) → nộp → xem điểm.
// Đạt đề của đúng cấp hiện tại thì lên cấp kế (BE tự cập nhật, FE tải lại hồ sơ).
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  type: 'judge' | 'choice' | 'order';
  statement?: string;
  prompt?: string;
  options?: string[];
  words?: string[];
  audio?: { who: string; key: string }[] | null;
  script?: { who: string; zh: string }[];
}
interface Started {
  attemptId: number;
  endsAt: string;
  exam: { title: string; level: number; durationMin: number; maxScore: number; passScore: number; pointsPerQuestion: number; sections: { name: string; kind: string; questions: Q[] }[] };
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
  sections: { name: string; correct: number; total: number }[];
}
type Ans = number | string[] | null;

const mmss = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
};

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
  const done = useMemo(() => Object.values(answers).filter((a) => a !== null && a !== undefined && !(Array.isArray(a) && a.length === 0)).length, [answers]);

  const listen = (q: Q) => {
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
                <span>{s.name}</span>
                <b>
                  {s.correct}/{s.total}
                </b>
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
    return (
      <Shell title={'Đề HSK ' + run.exam.level}>
        <div className="stack">
          <div className="card row between sticky" style={{ top: 8 }}>
            <b>{run.exam.title}</b>
            <span className="pill" aria-live="off">
              ⏱ {mmss(left)}
            </span>
          </div>
          <small className="muted">
            Đã trả lời {done}/{total} câu. Mỗi câu {run.exam.pointsPerQuestion.toFixed(1)} điểm; đạt từ {run.exam.passScore}/{run.exam.maxScore}.
          </small>
          {err ? <div className="alert">{err}</div> : null}

          {run.exam.sections.map((s) => (
            <section className="stack" key={s.name}>
              <h2>{s.name}</h2>
              {s.questions.map((q) => {
                n++;
                const a = answers[q.id];
                return (
                  <div className="card stack" key={q.id}>
                    <b>Câu {n}</b>
                    {q.audio?.length || q.script?.length ? (
                      <button className="btn sm" onClick={() => listen(q)}>
                        ▶ Nghe
                      </button>
                    ) : null}
                    {q.statement ? <div className="han" style={{ fontSize: 20 }}>{q.statement}</div> : null}
                    {q.prompt ? <div className="han" style={{ fontSize: 18 }}>{q.prompt}</div> : null}

                    {q.type === 'judge' ? (
                      <div className="optgrid">
                        {['Đúng', 'Sai'].map((t, i) => (
                          <button key={t} className="opt" style={a === i ? { borderColor: 'var(--accent)' } : undefined} onClick={() => setAnswers({ ...answers, [q.id]: i })}>
                            {t}
                          </button>
                        ))}
                      </div>
                    ) : null}

                    {q.type === 'choice' ? (
                      <div className="optgrid">
                        {(q.options ?? []).map((o, i) => (
                          <button key={i} className="opt" style={a === i ? { borderColor: 'var(--accent)' } : undefined} onClick={() => setAnswers({ ...answers, [q.id]: i })}>
                            <span className="han">{o}</span>
                          </button>
                        ))}
                      </div>
                    ) : null}

                    {q.type === 'order' ? (
                      <>
                        <div className="ansrow">
                          {((a as string[]) ?? []).map((p, i) => (
                            <button key={i} className="tile wide on" onClick={() => setAnswers({ ...answers, [q.id]: ((a as string[]) ?? []).filter((_, k) => k !== i) })}>
                              {p}
                            </button>
                          ))}
                        </div>
                        <div className="tiles">
                          {(q.words ?? []).map((w, i) => {
                            const picked = (a as string[]) ?? [];
                            const used = picked.filter((x) => x === w).length >= (q.words ?? []).filter((x) => x === w).length;
                            return (
                              <button key={i} className="tile wide" disabled={used} onClick={() => setAnswers({ ...answers, [q.id]: [...picked, w] })}>
                                {w}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    ) : null}
                  </div>
                );
              })}
            </section>
          ))}

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
