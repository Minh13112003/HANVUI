'use client';
// Bảng từ vựng của một chủ đề: chữ Hán, pinyin, nghĩa (che được), nút nghe thường và chậm.
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import WordSheet from '@/components/WordSheet';
import { api } from '@/lib/api';
import { play } from '@/lib/audio';
import { useAuth } from '@/lib/auth';
import { hskLabel } from '@/lib/text';
import { useUi } from '@/lib/ui';
import type { Topic, Word } from '@/lib/types';

export default function VocabTablePage() {
  const { topic } = useParams<{ topic: string }>();
  const { user } = useAuth();
  const { openSheet } = useUi();
  const [data, setData] = useState<{ topic: Topic; words: Word[] } | null>(null);
  const [blur, setBlur] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    api<{ topic: Topic; words: Word[] }>('/topics/' + topic + '/words')
      .then(setData)
      .catch((e) => setErr(e instanceof Error ? e.message : 'Không tải được'));
  }, [user, topic]);

  return (
    <Shell title="Từ vựng">
      <div className="stack">
        <div className="row between">
          <div className="grow">
            <h1>
              <span className="bigglyph han">{data?.topic.glyph}</span> {data?.topic.name ?? 'Từ vựng'}
            </h1>
            <p className="muted" style={{ fontSize: 13 }}>
              {data ? data.words.length + ' từ' : 'Đang tải…'}
            </p>
          </div>
          <button className="btn sm" onClick={() => setBlur(!blur)}>
            {blur ? 'Hiện nghĩa' : 'Che nghĩa'}
          </button>
        </div>

        {err ? <div className="card">{err}</div> : null}

        <div className="tbl">
          {data?.words.map((w) => (
            <button key={w.id} className="w" onClick={() => openSheet(<WordSheet word={w} />)}>
              <span>
                <span className="zh han">{w.zh}</span>
                <span className="py" style={{ display: 'block' }}>
                  {w.pinyin}
                </span>
              </span>
              <span className={'vi' + (blur ? ' blur' : '')}>
                {w.vi}
                {w.pos ? <span className="pos">{w.pos}</span> : null}
                <small className="muted" style={{ display: 'block', fontSize: 11 }}>
                  {hskLabel(w.hsk2, w.hsk3)}
                </small>
              </span>
              <span
                className="icon-btn"
                role="button"
                aria-label={'Nghe ' + w.zh}
                onClick={(e) => {
                  e.stopPropagation();
                  play(w.zh, null, {});
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M4 9v6h3l5 4V5L7 9H4zM16 8.5a4 4 0 0 1 0 7" />
                </svg>
              </span>
            </button>
          ))}
        </div>

        <Link href="/so-tay/kiem-tra" className="card row between">
          <span>
            <b>Kiểm tra 8 câu</b>
            <small className="muted" style={{ display: 'block' }}>
              Việt→Hán, Hán→Việt, nghe→Hán
            </small>
          </span>
          <span className="chev">›</span>
        </Link>
      </div>
    </Shell>
  );
}
