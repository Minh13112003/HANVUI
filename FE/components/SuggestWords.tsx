'use client';
// Gợi ý từ nên lưu sau khi xem lời thoại, kèm tiến độ từ vựng (tương đối) để lên cấp kế.
import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useUi } from '@/lib/ui';

interface Suggest {
  words: { zh: string; pinyin: string; vi: string; hsk2: number | null; why: string }[];
  progress: { level: number; nextLevel: number; isMax: boolean; target: number; have: number; remaining: number; percent: number; note: string };
}

export default function SuggestWords({ lessonId }: { lessonId: string }) {
  const { toast } = useUi();
  const [data, setData] = useState<Suggest | null>(null);

  const load = useCallback(() => {
    api<Suggest>('/lessons/' + lessonId + '/suggest-words').then(setData).catch(() => setData(null));
  }, [lessonId]);
  useEffect(load, [load]);

  const save = async (zh: string) => {
    try {
      await api('/notebook', { method: 'POST', body: { zh, lessonId } });
      toast('Đã lưu "' + zh + '"');
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Không lưu được');
    }
  };

  if (!data) return null;
  const p = data.progress;
  return (
    <div className="card stack">
      <h2>Từ nên lưu từ bài này</h2>
      {data.words.length ? (
        data.words.map((w) => (
          <div key={w.zh} className="row between" style={{ gap: 8 }}>
            <span className="grow">
              <b className="han">{w.zh}</b> <span className="py">{w.pinyin}</span> · {w.vi}
              <small className="muted" style={{ display: 'block' }}>
                {w.hsk2 ? `HSK ${w.hsk2} · ` : ''}
                {w.why}
              </small>
            </span>
            <button className="btn sm" onClick={() => save(w.zh)}>
              Lưu
            </button>
          </div>
        ))
      ) : (
        <p className="muted">Bạn đã lưu hết các từ đáng học của bài này.</p>
      )}
      {!p.isMax ? (
        <>
          <div className="row between">
            <span>
              Lên HSK {p.nextLevel}: đã lưu {p.have}/{p.target} từ
            </span>
            <span className="pill">{p.percent}%</span>
          </div>
          <progress value={p.percent} max={100} style={{ width: '100%' }} aria-label="Tiến độ từ vựng" />
          <small className="muted">Còn khoảng {p.remaining} từ. {p.note}</small>
        </>
      ) : null}
    </div>
  );
}
