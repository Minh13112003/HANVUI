'use client';
// Kỹ năng Đọc (rule.md mục 3.5): bài đọc theo cấp HSK. Chữ Hán hiện ngay; trả lời xong mới có pinyin, bản dịch và nghĩa
// từng từ (trước đó chạm từ chỉ để lưu). Bài đã hoàn thành mở lại là ôn tập: pinyin và dịch làm mờ, bấm hoặc làm xong mới mở. Bài cấp cao hơn cấp người học bị khóa. Bài đọc không có âm thanh.
import Link from 'next/link';
import { Fragment, useCallback, useEffect, useState } from 'react';
import LessonQuiz from '@/components/LessonQuiz';
import SaveWordSheet from '@/components/SaveWordSheet';
import Shell from '@/components/Shell';
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
  const [review, setReview] = useState(false);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (!user) return;
    Promise.all([1, 2, 3, 4].map((n) => api<LessonCard[]>('/lessons?level=' + n + '&kind=READING')))
      .then((r) => setCards(r.flat()))
      .catch(() => setCards([]));
  }, [user]);

  const load = useCallback(async (id: string) => {
    setErr('');
    setLesson(null);
    setReview(false);
    setOpened(false);
    setShowPy(true);
    setShowVi(false);
    setOpen(id);
    requestAnimationFrame(() =>
      document.getElementById('read-' + id)?.scrollIntoView({ block: 'start', behavior: 'smooth' }),
    );
    try {
      const l = await api<Lesson>('/lessons/' + id);
      setLesson(l);
      setReview(l.progress.allDone && l.questions.length > 0);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Không mở được bài');
    }
  }, []);

  const open2 = () => {
    setOpened(true);
    setShowPy(true);
    setShowVi(true);
  };

  const submit = async (answers: number[]) => {
    if (!lesson) throw new Error('Chưa mở bài');
    const r = await api<AnswerResult>('/lessons/' + lesson.id + '/answers', { method: 'POST', body: { answers, listenedPct: 0 } });
    if (review) {
      open2();
      setLesson({ ...lesson, progress: { ...lesson.progress, correct: r.correct } });
    }
    else setLesson(await api<Lesson>('/lessons/' + lesson.id));
    setCards((cs) => cs?.map((c) => (c.id === lesson.id ? { ...c, status: 'done' } : c)) ?? cs);
    return r;
  };

  const toggle = (id: string) => {
    if (open === id) {
      setOpen('');
      setLesson(null);
      return;
    }
    load(id);
  };

  const answered = !!lesson?.progress.allDone;
  const blurred = answered && review && !opened; // ôn tập: pinyin và dịch làm mờ
  const canLook = answered && !blurred;
  const py = blurred || (canLook && showPy);
  const vi = blurred || (canLook && showVi);

  const reader = lesson ? (
          <>
            <div className={'card reader stack' + (blurred ? ' rv-blur' : '')}>
              <div className="row between">
                <div>
                  <h2 className="han">{lesson.situation}</h2>
                  <small className="muted">
                    {lesson.title} · HSK {lesson.level}
                  </small>
                </div>
              </div>
              {answered && lesson.questions.length ? (
                <div className="donebar">
                  <b>
                    ✓ Đã hoàn thành · Đúng {lesson.progress.correct}/{lesson.questions.length} câu
                  </b>
                  {blurred ? <span>Bạn đang ôn lại. Làm xong, kết quả mới sẽ ghi đè kết quả cũ.</span> : null}
                </div>
              ) : null}
              {!answered ? (
                <p className="lockmsg">Trả lời xong câu hỏi mới xem được pinyin và bản dịch. Chạm một từ để lưu vào Sổ tay.</p>
              ) : blurred ? (
                <button type="button" className="btn sm" onClick={open2}>
                  Bấm để mở pinyin và bản dịch
                </button>
              ) : (
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
              )}
              {lesson.lines.map((l) => (
                <div className="sent" key={l.idx}>
                  <div className="tkrow">
                    {(l.tokens ?? []).map((t, ti) =>
                      t.x ? (
                        <span className="punc" key={ti}>
                          {t.t}
                        </span>
                      ) : (
                        <button
                          className="tk"
                          key={ti}
                          onClick={() => openSheet(canLook ? <WordSheet word={{ zh: t.t, pinyin: t.p, vi: t.v }} lessonId={lesson.id} /> : <SaveWordSheet zh={t.t} lessonId={lesson.id} />)}
                        >
                          {py ? <span className="tkp">{t.p}</span> : null}
                          <span className="tkz han">{t.t}</span>
                        </button>
                      ),
                    )}
                  </div>
                  {vi ? <p className="tr muted">{l.vi}</p> : null}
                </div>
              ))}
            </div>

            <LessonQuiz key={lesson.id} questions={lesson.questions} review={review} title="Câu hỏi hiểu bài" submitLabel="Kiểm tra" submit={submit} />

            {canLook ? <SuggestWords lessonId={lesson.id} /> : null}
          </>
  ) : null;

  return (
    <Shell title="Đọc">
      <div className="stack">
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
