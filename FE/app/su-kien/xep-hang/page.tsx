'use client';
// Bảng xếp hạng chung: điểm → huy chương → ai giải xong sớm hơn (rule.md mục 5.7).
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import type { Leaderboard } from '@/lib/types';

export default function BoardPage() {
  const { user } = useAuth();
  const [lb, setLb] = useState<Leaderboard | null>(null);

  useEffect(() => {
    if (!user) return;
    api<Leaderboard>('/event/leaderboard')
      .then(setLb)
      .catch(() => {});
  }, [user]);

  return (
    <Shell title="Xếp hạng">
      <div className="stack">
        <h1>Bảng xếp hạng {lb?.month}</h1>
        <p className="muted" style={{ fontSize: 13 }}>
          Nhiều điểm hơn xếp trên; bằng điểm thì huy chương cao hơn; vẫn bằng thì ai giải xong sớm hơn.
        </p>

        {lb?.me ? (
          <div className="card row between" style={{ borderColor: 'var(--accent)' }}>
            <span className="grow">
              <b>Bạn — hạng {lb.me.rank}</b>
              <small className="muted" style={{ display: 'block' }}>
                {lb.me.points} điểm · {lb.me.solved} từ khóa{lb.me.medal ? ' · ' + lb.me.medal.name : ''}
              </small>
            </span>
          </div>
        ) : null}

        <div className="nlist">
          {lb?.board.map((r) => (
            <div className="nrow" key={r.rank} style={r.me ? { background: 'var(--goodbg)' } : undefined}>
              <span className="nmain">
                <span className="nzh" style={{ fontSize: 18, fontWeight: 700, minWidth: 40 }}>
                  #{r.rank}
                </span>
                <span className="grow">
                  <b>{r.me ? 'Bạn' : r.name}</b>
                  <small className="nsrc">
                    {r.solved} từ khóa{r.medal ? ' · huy chương ' + r.medal.name : ''}
                  </small>
                </span>
                <span className="pill">{r.points}</span>
              </span>
            </div>
          ))}
        </div>

        {lb && !lb.board.length ? (
          <div className="card empty center">
            <p className="muted">Chưa ai giải được ô nào trong tháng này. Bạn có thể là người đầu tiên.</p>
          </div>
        ) : null}

        <Link className="btn" href="/su-kien" style={{ textAlign: 'center' }}>
          Về Sự kiện
        </Link>
      </div>
    </Shell>
  );
}
