'use client';
// Một bài nhập môn của Lộ trình cho người mới (pinyin, thanh điệu, nét, bộ thủ…): bấm từng ô để nghe, chạm chữ để xem
// cách viết, phần luyện cuối bài tự chấm ngay trên máy. Điểm cao nhất lưu trên trình duyệt (lib/beginner.ts).
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Confetti } from '@/components/Bits';
import Shell from '@/components/Shell';
import Stroke from '@/components/Stroke';
import { play } from '@/lib/audio';
import { useAuth } from '@/lib/auth';
import { INTRO, PASS, hasQuiz, introBySlug, loadPath, savePath, type Block, type QuizQ, type Sound } from '@/lib/beginner';

function SoundGrid({ title, items }: { title?: string; items: Sound[] }) {
  return (
    <section className="card stack" style={{ gap: 10 }}>
      {title ? <b style={{ fontSize: 14 }}>{title}</b> : null}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
        {items.map((s) => (
          <button
            key={s.zh + s.py}
            onClick={() => play(s.zh, null, {})}
            className="card"
            style={{ textAlign: 'left', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 2, cursor: 'pointer' }}
            aria-label={'Nghe ' + s.zh}
          >
            <span className="row between" style={{ gap: 6 }}>
              <span className="han" style={{ fontSize: 24 }}>
                {s.zh}
              </span>
              <span aria-hidden="true">🔊</span>
            </span>
            <span className="py">{s.py}</span>
            {s.vi ? <small style={{ fontWeight: 600 }}>{s.vi}</small> : null}
            {s.note ? <small className="muted">{s.note}</small> : null}
          </button>
        ))}
      </div>
    </section>
  );
}

function StrokeBlock({ title, items }: { title?: string; items: Sound[] }) {
  const [pick, setPick] = useState(0);
  const cur = items[pick];
  return (
    <section className="card stack" style={{ gap: 10 }}>
      {title ? <b style={{ fontSize: 14 }}>{title}</b> : null}
      <div className="chips">
        {items.map((s, i) => (
          <button key={s.zh + i} className={'chip' + (pick === i ? ' on' : '')} onClick={() => setPick(i)}>
            <span className="han">{s.zh}</span> · {s.py}
          </button>
        ))}
      </div>
      <p style={{ margin: 0 }}>
        <b>{cur.py}</b> — {cur.vi}
      </p>
      <Stroke key={cur.zh + pick} word={cur.zh} />
    </section>
  );
}

function Quiz({ title, qs, onDone }: { title: string; qs: QuizQ[]; onDone: (pct: number) => void }) {
  const [i, setI] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [right, setRight] = useState(0);
  const [finished, setFinished] = useState(false);
  const q = qs[i];

  // Câu chỉ nghe: tự phát khi chuyển sang câu mới (câu đầu chờ người học bấm, để mở trang không tự kêu).
  useEffect(() => {
    if (i > 0 && q?.say && !q.show && !finished) play(q.say, null, {});
  }, [i, q, finished]);

  const answer = (k: number) => {
    if (chosen !== null) return;
    setChosen(k);
    if (k === q.a) setRight((r) => r + 1);
  };

  const next = () => {
    if (i < qs.length - 1) {
      setI(i + 1);
      setChosen(null);
      return;
    }
    setFinished(true);
    onDone(Math.round((right / qs.length) * 100));
  };

  const restart = () => {
    setI(0);
    setChosen(null);
    setRight(0);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((right / qs.length) * 100);
    return (
      <section className="card stack center">
        <b>{title}</b>
        <h1 style={{ margin: 0 }}>
          {right}/{qs.length}
        </h1>
        <p className="muted" style={{ margin: 0 }}>
          {pct >= PASS ? 'Đạt! Bài này đã được đánh dấu xong.' : `Cần đúng từ ${PASS}%. Nghe lại các ô phía trên rồi làm lại nhé.`}
        </p>
        <button className="btn sm" onClick={restart}>
          Làm lại
        </button>
      </section>
    );
  }

  return (
    <section className="card stack" style={{ gap: 12 }}>
      <div className="row between">
        <b>{title}</b>
        <span className="pill">
          {i + 1}/{qs.length}
        </span>
      </div>
      <div className="row" style={{ gap: 10, justifyContent: 'center', alignItems: 'center' }}>
        {q.show ? (
          <span className={/\p{Script=Han}/u.test(q.show) ? 'han' : ''} style={{ fontSize: 34, fontWeight: 700 }}>
            {q.show}
          </span>
        ) : null}
        {q.say ? (
          <button className="btn sm" onClick={() => play(q.say!, null, {})}>
            🔊 Nghe{q.show ? '' : ' lại'}
          </button>
        ) : null}
      </div>
      <div className="stack" style={{ gap: 8 }}>
        {q.opts.map((o, k) => {
          const state = chosen === null ? '' : k === q.a ? 'ok' : k === chosen ? 'bad' : '';
          return (
            <button
              key={o}
              className="btn"
              onClick={() => answer(k)}
              style={{
                textAlign: 'left',
                ...(state === 'ok' ? { background: 'var(--goodbg)', color: 'var(--good)', borderColor: 'var(--good)' } : {}),
                ...(state === 'bad' ? { color: 'var(--bad)', borderColor: 'var(--bad)' } : {}),
              }}
            >
              {/\p{Script=Han}/u.test(o) ? <span className="han">{o}</span> : o}
              {state === 'ok' ? ' ✓' : state === 'bad' ? ' ✗' : ''}
            </button>
          );
        })}
      </div>
      {chosen !== null ? (
        <>
          {q.why ? (
            <p className="muted" style={{ margin: 0 }}>
              {q.why}
            </p>
          ) : null}
          <button className="btn primary" onClick={next}>
            {i < qs.length - 1 ? 'Câu tiếp ›' : 'Xem kết quả'}
          </button>
        </>
      ) : null}
    </section>
  );
}

function BlockView({ b, onQuiz }: { b: Block; onQuiz: (pct: number) => void }) {
  if (b.k === 'text') return <p style={{ margin: 0, lineHeight: 1.6 }}>{b.t}</p>;
  if (b.k === 'tip')
    return (
      <p className="card" style={{ margin: 0, borderLeft: '4px solid var(--accent)', lineHeight: 1.55 }}>
        💡 {b.t}
      </p>
    );
  if (b.k === 'sounds') return <SoundGrid title={b.title} items={b.items} />;
  if (b.k === 'strokes') return <StrokeBlock title={b.title} items={b.items} />;
  return <Quiz title={b.title} qs={b.qs} onDone={onQuiz} />;
}

export default function IntroLessonPage() {
  const { bai } = useParams<{ bai: string }>();
  const { user } = useAuth();
  const lesson = introBySlug(bai);
  const idx = INTRO.findIndex((l) => l.slug === bai);
  const nextLesson = INTRO[idx + 1];
  const [done, setDone] = useState(false);
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    if (!user || !lesson) return;
    setDone(!!loadPath(user.id).done['intro-' + lesson.slug]);
  }, [user, lesson]);

  if (!lesson) {
    return (
      <Shell title="Lộ trình">
        <div className="card empty center">
          <p className="muted">Không tìm thấy bài này.</p>
          <Link className="btn sm" href="/lo-trinh">
            Về lộ trình
          </Link>
        </div>
      </Shell>
    );
  }

  const markDone = (pct?: number) => {
    if (!user) return;
    const s = loadPath(user.id);
    if (pct !== undefined) s.score[lesson.slug] = Math.max(s.score[lesson.slug] ?? 0, pct);
    if (pct === undefined || pct >= PASS) {
      s.done['intro-' + lesson.slug] = s.done['intro-' + lesson.slug] ?? new Date().toISOString().slice(0, 10);
      if (!done) setBurst((n) => n + 1);
      setDone(true);
    }
    savePath(user.id, s);
  };

  return (
    <Shell title="Lộ trình">
      <div className="stack">
        <Confetti burst={burst} />
        <div className="row" style={{ gap: 12, alignItems: 'center' }}>
          <span className="han" style={{ fontSize: 40, lineHeight: 1 }} aria-hidden="true">
            {lesson.zh}
          </span>
          <div className="grow">
            <span className="eyebrow2">
              Nhập môn · bài {idx + 1}/{INTRO.length} · khoảng {lesson.mins} phút
            </span>
            <h1 style={{ margin: 0 }}>{lesson.title}</h1>
          </div>
          {done ? <span className="pill ok">✓ Xong</span> : null}
        </div>

        {lesson.blocks.map((b, k) => (
          <BlockView key={k} b={b} onQuiz={(pct) => markDone(pct)} />
        ))}

        {!hasQuiz(lesson) && !done ? (
          <button className="btn primary" onClick={() => markDone()}>
            Tôi đã học xong bài này
          </button>
        ) : null}

        {nextLesson ? (
          <Link className={'btn' + (done ? ' primary' : '')} href={'/lo-trinh/' + nextLesson.slug} style={{ textAlign: 'center' }}>
            Bài tiếp: {nextLesson.title} ›
          </Link>
        ) : (
          <Link className={'btn' + (done ? ' primary' : '')} href="/lo-trinh" style={{ textAlign: 'center' }}>
            Xong nhập môn — sang HSK 1 ›
          </Link>
        )}
        <Link className="btn sm" href="/lo-trinh" style={{ textAlign: 'center' }}>
          Về lộ trình
        </Link>
      </div>
    </Shell>
  );
}
