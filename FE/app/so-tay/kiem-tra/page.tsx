'use client';
// Kiểm tra từ vựng: 8 câu ngẫu nhiên, kiểu Việt→Hán, Hán→Việt, nghe→Hán (rule.md mục 3.3).
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import Shell from '@/components/Shell';
import WordSheet from '@/components/WordSheet';
import { api } from '@/lib/api';
import { play } from '@/lib/audio';
import { useAuth } from '@/lib/auth';
import { shuffle } from '@/lib/text';
import { useUi } from '@/lib/ui';
import type { Notebook, UserWord } from '@/lib/types';

type Kind = 'vi2zh' | 'zh2vi' | 'audio2zh';

interface Q {
  kind: Kind;
  word: UserWord;
  options: UserWord[];
}

const QUESTIONS = 8;

function build(pool: UserWord[]): Q[] {
  const usable = pool.filter((w) => w.vi);
  const src = usable.length >= 3 ? usable : pool;
  return shuffle(src)
    .slice(0, QUESTIONS)
    .map((word, i) => {
      const others = shuffle(src.filter((w) => w.id !== word.id)).slice(0, 2);
      const kind: Kind = i % 3 === 0 ? 'vi2zh' : i % 3 === 1 ? 'zh2vi' : 'audio2zh';
      return { kind, word, options: shuffle([word, ...others]) };
    });
}

export default function QuizPage() {
  const { user } = useAuth();
  const { openSheet } = useUi();
  const [pool, setPool] = useState<UserWord[] | null>(null);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [wrong, setWrong] = useState<UserWord[]>([]);
  const [ok, setOk] = useState(0);

  useEffect(() => {
    if (!user) return;
    const saved = sessionStorage.getItem('hv.review');
    if (saved) {
      sessionStorage.removeItem('hv.review');
      setPool(JSON.parse(saved) as UserWord[]);
      return;
    }
    api<Notebook>('/notebook?view=day')
      .then((n) => setPool(n.groups.flatMap((g) => g.words)))
      .catch(() => setPool([]));
  }, [user]);

  const qs = useMemo(() => (pool ? build(pool) : []), [pool]);
  const q = qs[i];
  const done = !!qs.length && i >= qs.length;

  useEffect(() => {
    if (q?.kind === 'audio2zh') play(q.word.zh, null, {});
  }, [q]);

  if (!pool) return <Shell title="Kiểm tra"><p className="muted">Đang tải…</p></Shell>;

  if (pool.length < 3) {
    return (
      <Shell title="Kiểm tra">
        <div className="card empty center stack">
          <p className="muted">Cần ít nhất 3 từ trong Sổ tay để làm bài kiểm tra.</p>
          <Link className="btn primary sm" href="/hoc/nghe">
            Đi học một bài
          </Link>
        </div>
      </Shell>
    );
  }

  if (done) {
    return (
      <Shell title="Kiểm tra">
        <div className="stack">
          <div className="card center stack">
            <h1>
              Đúng {ok}/{qs.length}
            </h1>
            <p className="muted">{ok === qs.length ? 'Tuyệt vời!' : 'Ôn lại các từ dưới đây rồi làm lại.'}</p>
            <button
              className="btn primary"
              onClick={() => {
                setI(0);
                setOk(0);
                setWrong([]);
                setPicked(null);
                setPool([...pool]);
              }}
            >
              Làm lại 8 câu
            </button>
          </div>
          {wrong.length ? (
            <div className="card stack">
              <h2>Từ cần ôn</h2>
              {wrong.map((w) => (
                <button key={w.id} className="row between" onClick={() => openSheet(<WordSheet word={w} />)} style={{ background: 'none', border: 0, padding: '6px 0', textAlign: 'left' }}>
                  <span className="grow">
                    <b className="han" style={{ fontSize: 22 }}>
                      {w.zh}
                    </b>{' '}
                    <span className="py">{w.pinyin}</span>
                    <small className="muted" style={{ display: 'block' }}>
                      {w.vi}
                    </small>
                  </span>
                  <span className="chev">›</span>
                </button>
              ))}
            </div>
          ) : null}
          <Link className="btn" href="/so-tay" style={{ textAlign: 'center' }}>
            Về Sổ tay
          </Link>
        </div>
      </Shell>
    );
  }

  const answer = (oi: number) => {
    if (picked !== null) return;
    setPicked(oi);
    const right = q.options[oi].id === q.word.id;
    if (right) setOk(ok + 1);
    else setWrong([...wrong, q.word]);
    setTimeout(() => {
      setPicked(null);
      setI(i + 1);
    }, 900);
  };

  return (
    <Shell title="Kiểm tra">
      <div className="stack">
        <div className="row between">
          <span className="eyebrow2">
            Câu {i + 1}/{qs.length}
          </span>
          <span className="pill">{ok} đúng</span>
        </div>
        <div className="bar">
          <i style={{ width: ((i + 1) / qs.length) * 100 + '%' }} />
        </div>

        <div className="card prompt">
          {q.kind === 'vi2zh' ? (
            <>
              <span className="eyebrow2">Chọn chữ Hán đúng</span>
              <span className="vi">{q.word.vi}</span>
            </>
          ) : q.kind === 'zh2vi' ? (
            <>
              <span className="eyebrow2">Từ này nghĩa là gì?</span>
              <span className="han">{q.word.zh}</span>
            </>
          ) : (
            <>
              <span className="eyebrow2">Nghe rồi chọn chữ Hán</span>
              <button className="icon-btn bigspk" aria-label="Nghe lại" onClick={() => play(q.word.zh, null, {})}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M4 9v6h3l5 4V5L7 9H4zM16 8.5a4 4 0 0 1 0 7" />
                </svg>
              </button>
              <button className="btn sm" onClick={() => play(q.word.zh, null, { slow: true })}>
                Nghe chậm
              </button>
            </>
          )}
        </div>

        <div className="optgrid">
          {q.options.map((o, oi) => {
            const right = o.id === q.word.id;
            const cls = picked === null ? '' : right ? ' ok' : picked === oi ? ' no' : '';
            return (
              <button key={o.id} className={'opt' + cls} onClick={() => answer(oi)}>
                {q.kind === 'zh2vi' ? <b>{o.vi || '(chưa có nghĩa)'}</b> : <span className="han">{o.zh}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}
