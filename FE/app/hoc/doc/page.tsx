'use client';
// Kỹ năng Đọc (rule.md mục 3.5): bài đọc theo cấp HSK. Chữ hiện ngay (khác hội thoại), chạm từng từ để xem nghĩa
// và lưu, có câu hỏi hiểu bài tự chấm. Bài cấp cao hơn cấp người học bị khóa. Bài đọc không có âm thanh.
import Link from 'next/link';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import SkillNav from '@/components/SkillNav';
import SuggestWords from '@/components/SuggestWords';
import WordSheet from '@/components/WordSheet';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useUi } from '@/lib/ui';
import type { AnswerResult, Lesson, LessonCard } from '@/lib/types';

export default function ReadPage() {
  const { user } = useAuth();
  const { openSheet } = useUi();
  const [cards, setCards] = useState<LessonCard[] | null>(null);
  const [open, setOpen] = useState<string>('');
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [err, setErr] = useState('');
  const [showVi, setShowVi] = useState(false);
  const [showPy, setShowPy] = useState(true);
  const [picks, setPicks] = useState<number[]>([]);
  const [result, setResult] = useState<AnswerResult | null>(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([1, 2, 3].map((n) => api<LessonCard[]>('/lessons?level=' + n + '&kind=READING')))
      .then((r) => setCards(r.flat()))
      .catch(() => setCards([]));
  }, [user]);

  const load = useCallback(async (id: string) => {
    setErr('');
    setLesson(null);
    setResult(null);
    setOpen(id);
    requestAnimationFrame(() =>
      document.getElementById('read-' + id)?.scrollIntoView({ block: 'start', behavior: 'smooth' }),
    );
    try {
      const l = await api<Lesson>('/lessons/' + id);
      setLesson(l);
      setPicks(new Array(l.questions.length).fill(-1));
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Không mở được bài');
    }
  }, []);

  const submit = async () => {
    if (!lesson) return;
    try {
      const r = await api<AnswerResult>('/lessons/' + lesson.id + '/answers', { method: 'POST', body: { answers: picks, listenedPct: 0 } });
      setResult(r);
      setLesson(await api<Lesson>('/lessons/' + lesson.id));
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Không chấm được');
    }
  };

  const toggle = (id: string) => {
    if (open === id) {
      setOpen('');
      setLesson(null);
      setResult(null);
      return;
    }
    load(id);
  };

  const answered = !!result || !!lesson?.progress.allDone;

  const reader = lesson ? (
          <>
            <div className="card reader stack">
              <div className="row between">
                <div>
                  <h2 className="han">{lesson.situation}</h2>
                  <small className="muted">
                    {lesson.title} · HSK {lesson.level}
                  </small>
                </div>
              </div>
              <div className="row" style={{ gap: 12 }}>
                <span className="sw">
                  <button className={showPy ? 'on' : ''} role="switch" aria-checked={showPy} aria-label="Pinyin" onClick={() => setShowPy(!showPy)} />
                  Pinyin
                </span>
                <span className="sw">
                  <button className={showVi ? 'on' : ''} role="switch" aria-checked={showVi} aria-label="Bản dịch" onClick={() => setShowVi(!showVi)} />
                  Bản dịch
                </span>
              </div>
              {lesson.lines.map((l) => (
                <div className="sent" key={l.idx}>
                  <div className="tkrow">
                    {(l.tokens ?? []).map((t, ti) =>
                      t.x ? (
                        <span className="punc" key={ti}>
                          {t.t}
                        </span>
                      ) : (
                        <button className="tk" key={ti} onClick={() => openSheet(<WordSheet word={{ zh: t.t, pinyin: t.p, vi: t.v }} lessonId={lesson.id} />)}>
                          {showPy ? <span className="tkp">{t.p}</span> : null}
                          <span className="tkz han">{t.t}</span>
                        </button>
                      ),
                    )}
                  </div>
                  {showVi ? <p className="tr muted">{l.vi}</p> : null}
                </div>
              ))}
            </div>

            <div className="card stack">
              <h2>Câu hỏi hiểu bài</h2>
              {lesson.questions.map((q, qi) => (
                <div className="q" key={q.idx}>
                  <div className="hq">
                    {q.prompt}
                    {answered && q.promptVi ? <span className="t2">{q.promptVi}</span> : null}
                  </div>
                  <div className="optgrid">
                    {q.options.map((o, oi) => {
                      const r = result?.results[qi];
                      const cls = r ? (oi === r.answer ? ' ok' : r.picked === oi ? ' no' : '') : '';
                      return (
                        <button
                          key={oi}
                          className={'opt' + cls}
                          disabled={!!result}
                          onClick={() => setPicks((p) => p.map((x, k) => (k === qi ? oi : x)))}
                          style={!result && picks[qi] === oi ? { borderColor: 'var(--accent)' } : undefined}
                        >
                          <span className="han">{o}</span>
                          {answered && q.optionsVi ? <span className="t2">{q.optionsVi[oi]}</span> : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              {result ? (
                <div className="alert" style={{ borderColor: 'var(--good)', background: 'var(--goodbg)' }}>
                  Đúng {result.correct}/{result.total} câu.
                </div>
              ) : (
                <button className="btn primary" disabled={picks.some((p) => p < 0)} onClick={submit}>
                  Kiểm tra
                </button>
              )}
            </div>

            <SuggestWords lessonId={lesson.id} />
          </>
  ) : null;

  return (
    <Shell title="Đọc">
      <div className="stack">
        <SkillNav />
        <h1>Bài đọc</h1>

        {!cards ? <p className="muted">Đang tải…</p> : null}
        <div className="stack">
          {cards?.map((c) =>
            c.locked ? (
              <div key={c.id} className="lcard" style={{ opacity: 0.6 }} aria-disabled="true">
                <span className="lg2 han">🔒</span>
                <span className="grow">
                  <b>{c.title}</b>
                  <small className="lsub muted">Khóa · mở khi lên HSK {c.unlockLevel}</small>
                </span>
                <span className="pill">HSK {c.unlockLevel}</span>
              </div>
            ) : (
              <Fragment key={c.id}>
              <button
                id={'read-' + c.id}
                className="lcard"
                data-lv={c.level}
                data-done={c.status === 'done' ? '1' : undefined}
                onClick={() => toggle(c.id)}
                aria-expanded={open === c.id}
                style={{ textAlign: 'left', width: '100%', scrollMarginTop: 72 }}
              >
                <span className="lg2 han">读</span>
                <span className="grow">
                  <b>{c.title}</b>
                  <small className="lsub muted">
                    {c.situation} · {c.lines} câu
                  </small>
                </span>
                <span className="lr">
                  <span className="pill">HSK {c.level}</span>
                  <small className={c.status === 'done' ? 'py' : 'muted'} style={{ fontWeight: 700 }}>
                    {c.status === 'done' ? '✓ đã đọc' : 'mới'}
                  </small>
                  <span className="chev" aria-hidden="true">
                    {open === c.id ? '▾' : '▸'}
                  </span>
                </span>
              </button>
              {open === c.id ? (
                <div className="stack">
                  {err ? <div className="alert">{err}</div> : null}
                  {lesson ? reader : !err ? <p className="muted">Đang mở bài…</p> : null}
                </div>
              ) : null}
              </Fragment>
            ),
          )}
        </div>

        <Link href="/su-kien" className="card row between">
          <span>
            <b>Truyện sự kiện</b>
            <small className="muted" style={{ display: 'block' }}>
              Các hồi đã mở nằm ở mục Sự kiện
            </small>
          </span>
          <span className="chev">›</span>
        </Link>
      </div>
    </Shell>
  );
}
