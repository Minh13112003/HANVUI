'use client';
// Kỹ năng Nói (bản mẫu, rule.md mục 3.5): đọc theo mẫu — nghe mẫu, nghe chậm, ghi âm rồi tự đối chiếu.
// Chấm phát âm tự động cần dịch vụ nhận dạng riêng, để giai đoạn sau.
import { useEffect, useRef, useState } from 'react';
import Shell from '@/components/Shell';
import SkillNav from '@/components/SkillNav';
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
  const [rec, setRec] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const chunks = useRef<Blob[]>([]);
  const mr = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    if (!user) return;
    api<Topic[]>('/topics?kind=VOCAB')
      .then((t) => {
        setTopics(t);
        if (t[0]) setTid(t[0].id);
      })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!tid) return;
    api<{ words: Word[] }>('/topics/' + tid + '/words')
      .then((d) => {
        setWords(d.words);
        setI(0);
        setUrl(null);
      })
      .catch(() => {});
  }, [tid]);

  const w = words[i];
  const sample = w?.example?.zh || w?.zh || '';

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks.current = [];
      const m = new MediaRecorder(stream);
      m.ondataavailable = (e) => chunks.current.push(e.data);
      m.onstop = () => {
        setUrl(URL.createObjectURL(new Blob(chunks.current, { type: 'audio/webm' })));
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.current = m;
      m.start();
      setRec(true);
    } catch {
      setRec(false);
    }
  };

  const stop = () => {
    mr.current?.stop();
    setRec(false);
  };

  return (
    <Shell title="Nói">
      <div className="stack">
        <SkillNav />
        <div className="row between">
          <h1>Đọc theo mẫu</h1>
          <span className="tag demo">bản mẫu</span>
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

            <button className={'mic' + (rec ? ' rec' : '')} onClick={rec ? stop : start}>
              {rec ? <span className="pulse" /> : null}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 4a3 3 0 0 1 3 3v4a3 3 0 0 1-6 0V7a3 3 0 0 1 3-3zM5 11a7 7 0 0 0 14 0M12 18v3" />
              </svg>
              {rec ? 'Đang ghi âm — bấm để dừng' : 'Ghi âm giọng của bạn'}
            </button>

            {url ? (
              <div className="card stack">
                <b>Nghe lại và tự đối chiếu</b>
                <audio controls src={url} style={{ width: '100%' }} />
                <div className="row" style={{ gap: 8 }}>
                  <button className="btn sm" onClick={() => play(sample, null, {})}>
                    Nghe mẫu lần nữa
                  </button>
                  <button className="btn sm" onClick={() => setUrl(null)}>
                    Xóa bản ghi
                  </button>
                </div>
                <p className="muted" style={{ fontSize: 12 }}>
                  Bản đầu chỉ nghe mẫu và tự đối chiếu. Chấm phát âm tự động cần dịch vụ nhận dạng phát âm riêng, sẽ làm
                  ở giai đoạn sau (rule.md mục 3.5).
                </p>
              </div>
            ) : null}

            <div className="row between">
              <button className="btn sm" disabled={i === 0} onClick={() => { setI(i - 1); setUrl(null); }}>
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
              <button className="btn sm" disabled={i >= words.length - 1} onClick={() => { setI(i + 1); setUrl(null); }}>
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
