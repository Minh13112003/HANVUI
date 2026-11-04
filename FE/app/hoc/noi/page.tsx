'use client';
// Kỹ năng Nói (rule.md mục 3.5): đọc theo mẫu — nghe mẫu, nghe chậm; một nút ghi âm duy nhất để chấm và nghe lại (PronCheck).
// Azure chưa cài hoặc hết lượt thì đổi sang nhận dạng giọng nói của trình duyệt (SpeechCheck).
import { useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import PronCheck from '@/components/PronCheck';
import SpeechCheck from '@/components/SpeechCheck';
import { Pinyin } from '@/components/WordSheet';
import { api } from '@/lib/api';
import { play, stopAll } from '@/lib/audio';
import { useAuth } from '@/lib/auth';
import { pinyinChunks, toneOf } from '@/lib/text';
import type { Topic, Word } from '@/lib/types';

export default function SpeakPage() {
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [tid, setTid] = useState('');
  const [words, setWords] = useState<Word[]>([]);
  const [i, setI] = useState(0);
  const [readWhat, setReadWhat] = useState<'word' | 'sentence'>('word');

  useEffect(() => {
    if (!user) return;
    Promise.all([api<Topic[]>('/topics?kind=VOCAB'), api<Topic[]>('/core-topics').catch(() => [] as Topic[])])
      .then(([t, core]) => {
        const all = [...t, ...core.map((c) => ({ ...c, id: 'core:' + c.id }))];
        setTopics(all);
        if (all[0]) setTid(all[0].id);
      })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!tid) return;
    api<{ words: Word[] }>(tid.startsWith('core:') ? '/core-topics/' + tid.slice(5) + '/speak' : '/topics/' + tid + '/words')
      .then((d) => {
        setWords(d.words);
        setI(0);
      })
      .catch(() => {});
  }, [tid]);

  const w = words[i];
  const sample = w?.example?.zh || w?.zh || '';
  const target = readWhat === 'sentence' && w?.example ? w.example.zh : w?.zh || '';

  return (
    <Shell title="Nói">
      <div className="stack">
        <div className="row between">
          <h1>Đọc theo mẫu</h1>
        </div>

        <div className="chips">
          {topics.map((t) => (
            <button key={t.id} className={'chip' + (tid === t.id ? ' on' : '')} onClick={() => setTid(t.id)}>
              {t.name}
            </button>
          ))}
        </div>

        {w ? (
          <>
            <div className="card center stack">
              <span className="eyebrow2">
                Từ {i + 1}/{words.length}
              </span>
              <div className="han" style={{ fontSize: 46, lineHeight: 1.1 }}>
                {w.zh}
              </div>
              <Pinyin text={w.pinyin} />
              <b>{w.vi}</b>
              <div className="syls">
                {pinyinChunks(w.pinyin).map((s, k) => (
                  <span key={k} className="sy">
                    {s} <small className="muted">thanh {toneOf(s) || 'nhẹ'}</small>
                  </span>
                ))}
              </div>
              <div className="row" style={{ gap: 8 }}>
                <button className="btn primary sm" onClick={() => play(sample, null, {})}>
                  Nghe mẫu
                </button>
                <button className="btn sm" onClick={() => play(sample, null, { slow: true })}>
                  Nghe chậm
                </button>
                <button className="btn sm" onClick={stopAll}>
                  Dừng
                </button>
              </div>
              {w.example ? (
                <p className="muted" style={{ fontSize: 13 }}>
                  Câu mẫu: <span className="han">{w.example.zh}</span> — {w.example.vi}
                </p>
              ) : null}
            </div>

            <div className="seg" role="tablist" aria-label="Đọc gì">
              <button role="tab" aria-selected={readWhat === 'word'} className={readWhat === 'word' ? 'on' : ''} onClick={() => setReadWhat('word')}>
                Đọc từ
              </button>
              <button role="tab" aria-selected={readWhat === 'sentence'} className={readWhat === 'sentence' ? 'on' : ''} disabled={!w.example} onClick={() => setReadWhat('sentence')}>
                Đọc câu mẫu
              </button>
            </div>
            <PronCheck target={target} fallback={<SpeechCheck target={target} />} />

            <div className="row between">
              <button className="btn sm" disabled={i === 0} onClick={() => setI(i - 1)}>
                ◀ Từ trước
              </button>
              <div className="legend tones">
                <span>
                  <i className="tone1">ā</i>1
                </span>
                <span>
                  <i className="tone2">á</i>2
                </span>
                <span>
                  <i className="tone3">ǎ</i>3
                </span>
                <span>
                  <i className="tone4">à</i>4
                </span>
              </div>
              <button className="btn sm" disabled={i >= words.length - 1} onClick={() => setI(i + 1)}>
                Từ sau ▶
              </button>
            </div>
          </>
        ) : (
          <p className="muted">Đang tải từ…</p>
        )}
      </div>
    </Shell>
  );
}
