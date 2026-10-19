'use client';
// Kỹ năng Đọc (bản mẫu, rule.md mục 3.5): bài đọc ngắn theo cấp, chạm từng từ để xem nghĩa và lưu,
// có câu hỏi hiểu bài. Truyện sự kiện cũng là bài đọc.
import Link from 'next/link';
import { useState } from 'react';
import Shell from '@/components/Shell';
import SkillNav from '@/components/SkillNav';
import WordSheet from '@/components/WordSheet';
import { play } from '@/lib/audio';
import { READS } from '@/lib/sample';
import { useUi } from '@/lib/ui';

export default function ReadPage() {
  const { openSheet } = useUi();
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<number[]>(() => new Array(READS[0].q?.length ?? 0).fill(-1));
  const [checked, setChecked] = useState(false);
  const text = READS[i];
  const full = text.sents.map((s) => s.t.map((t) => t[0]).join('')).join('');

  return (
    <Shell title="Đọc">
      <div className="stack">
        <SkillNav />
        <div className="row between">
          <h1>Bài đọc</h1>
          <span className="tag demo">bản mẫu</span>
        </div>

        <div className="seg">
          {READS.map((r, k) => (
            <button
              key={r.id}
              className={k === i ? 'on' : ''}
              onClick={() => {
                setI(k);
                setPicks(new Array(r.q?.length ?? 0).fill(-1));
                setChecked(false);
              }}
            >
              {r.title[1]}
            </button>
          ))}
        </div>

        <div className="card reader stack">
          <div className="row between">
            <div>
              <h2 className="han">{text.title[0]}</h2>
              <small className="muted">
                {text.title[1]} · {text.src} · {text.lvl}
              </small>
            </div>
            <button className="icon-btn" aria-label="Nghe cả bài" onClick={() => play(full, null, {})}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M4 9v6h3l5 4V5L7 9H4zM16 8.5a4 4 0 0 1 0 7" />
              </svg>
            </button>
          </div>

          {text.sents.map((s, si) => (
            <div className="sent" key={si}>
              <div className="tkrow">
                {s.t.map((t, ti) =>
                  t.length === 1 ? (
                    <span className="punc" key={ti}>
                      {t[0]}
                    </span>
                  ) : (
                    <button
                      className="tk"
                      key={ti}
                      onClick={() => openSheet(<WordSheet word={{ zh: t[0], pinyin: t[1], vi: t[2] }} />)}
                    >
                      <span className="tkp">{t[1]}</span>
                      <span className="tkz han">{t[0]}</span>
                    </button>
                  ),
                )}
              </div>
              <p className="tr muted">{s.vi}</p>
            </div>
          ))}
        </div>

        {text.q?.length ? (
          <div className="card stack">
            <h2>Câu hỏi hiểu bài</h2>
            {text.q.map((q, qi) => (
              <div className="q" key={qi}>
                <div className="hq">
                  {q.q[0]}
                  <span className="t2">{q.q[1]}</span>
                </div>
                <div className="optgrid">
                  {q.o.map((o, oi) => (
                    <button
                      key={oi}
                      className={'opt' + (checked ? (oi === q.a ? ' ok' : picks[qi] === oi ? ' no' : '') : '')}
                      onClick={() => setPicks((p) => p.map((x, k) => (k === qi ? oi : x)))}
                      style={!checked && picks[qi] === oi ? { borderColor: 'var(--accent)' } : undefined}
                    >
                      <span className="han">{o[0]}</span>
                      <span className="t2">{o[1]}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button className="btn primary" onClick={() => setChecked(true)}>
              Kiểm tra
            </button>
          </div>
        ) : null}

        <Link href="/su-kien" className="card row between">
          <span>
            <b>Truyện sự kiện</b>
            <small className="muted" style={{ display: 'block' }}>
              Các hồi đã mở nằm ở mục Sự kiện
            </small>
          </span>
          <span className="chev">›</span>
        </Link>

        <p className="note">
          Bản thật: bài đọc theo cấp HSK và tin ngắn biên tập lại từ báo (AI viết, người biết tiếng Trung duyệt).
        </p>
      </div>
    </Shell>
  );
}
