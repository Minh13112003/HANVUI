'use client';
// Trò chơi lật thẻ: ghép chữ Hán với nghĩa (rule.md mục 3.4).
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import { api } from '@/lib/api';
import { play } from '@/lib/audio';
import { useAuth } from '@/lib/auth';
import { shuffle } from '@/lib/text';
import type { Notebook, UserWord } from '@/lib/types';

interface Card {
  id: number;
  pair: number;
  zh?: string;
  vi?: string;
}

const PAIRS = 6;

const makeCards = (words: UserWord[]): Card[] =>
  shuffle(
    shuffle(words.filter((w) => w.vi))
      .slice(0, PAIRS)
      .flatMap((w, i) => [
        { id: i * 2, pair: i, zh: w.zh },
        { id: i * 2 + 1, pair: i, vi: w.vi },
      ]),
  );

export default function MatchPage() {
  const { user } = useAuth();
  const [words, setWords] = useState<UserWord[] | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [up, setUp] = useState<number[]>([]);
  const [done, setDone] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (!user) return;
    api<Notebook>('/notebook?view=day')
      .then((n) => {
        const all = n.groups.flatMap((g) => g.words);
        setWords(all);
        setCards(makeCards(all));
      })
      .catch(() => setWords([]));
  }, [user]);

  const flip = (i: number) => {
    const c = cards[i];
    if (done.includes(c.pair) || up.includes(i) || up.length === 2) return;
    const next = [...up, i];
    setUp(next);
    if (next.length === 2) {
      setMoves(moves + 1);
      const [a, b] = next.map((k) => cards[k]);
      if (a.pair === b.pair && a.id !== b.id) {
        setDone([...done, a.pair]);
        if (a.zh) play(a.zh, null, {});
        setTimeout(() => setUp([]), 420);
      } else {
        setTimeout(() => setUp([]), 820);
      }
    } else if (c.zh) {
      play(c.zh, null, {});
    }
  };

  const restart = () => {
    if (!words) return;
    setCards(makeCards(words));
    setUp([]);
    setDone([]);
    setMoves(0);
  };

  if (!words) return <Shell title="Lật thẻ"><p className="muted">Đang tải…</p></Shell>;

  if (cards.length < 4) {
    return (
      <Shell title="Lật thẻ">
        <div className="card empty center stack">
          <p className="muted">Cần ít nhất 2 từ có nghĩa trong Sổ tay để chơi lật thẻ.</p>
          <Link className="btn primary sm" href="/hoc">
            Xem bảng từ vựng
          </Link>
        </div>
      </Shell>
    );
  }

  const win = done.length === cards.length / 2;

  return (
    <Shell title="Lật thẻ">
      <div className="stack">
        <div className="row between">
          <div className="grow">
            <h1>Lật thẻ</h1>
            <p className="muted" style={{ fontSize: 13 }}>
              Ghép chữ Hán với nghĩa tiếng Việt.
            </p>
          </div>
          <span className="pill">{moves} lượt</span>
        </div>

        {win ? (
          <div className="alert" style={{ borderColor: 'var(--good)', background: 'var(--goodbg)' }}>
            Xong rồi! {done.length} cặp trong {moves} lượt.
          </div>
        ) : null}

        <div className="cards">
          {cards.map((c, i) => {
            const shown = up.includes(i) || done.includes(c.pair);
            return (
              <button
                key={c.id}
                className={'mc' + (done.includes(c.pair) ? ' done' : shown ? ' up' : '')}
                onClick={() => flip(i)}
                aria-label={shown ? (c.zh ?? c.vi) : 'Thẻ úp'}
              >
                {shown ? c.zh ? <span className="han">{c.zh}</span> : c.vi : '汉'}
              </button>
            );
          })}
        </div>

        <div className="row" style={{ gap: 8 }}>
          <button className="btn primary grow" onClick={restart}>
            Chơi lại
          </button>
          <Link className="btn" href="/so-tay">
            Về Sổ tay
          </Link>
        </div>
      </div>
    </Shell>
  );
}
