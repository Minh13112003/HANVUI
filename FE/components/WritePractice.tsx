'use client';
// Bài tập viết tự chấm (rule.md mục 3.5): sắp xếp câu, điền chữ, chọn câu đúng nghĩa. Đề và đáp án lấy từ máy chủ.
import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { WritingBatch, WritingCheck, WritingItem } from '@/lib/types';

type Kind = 'ORDER' | 'FILL' | 'CHOOSE' | 'WRONG';

const TITLE: Record<Kind, string> = {
  ORDER: 'Sắp xếp thành câu đúng',
  FILL: 'Điền chữ còn thiếu',
  CHOOSE: 'Chọn câu tiếng Trung đúng nghĩa',
  WRONG: 'Tìm câu SAI ngữ pháp',
};

/** Làm một bộ bài: lấy ngẫu nhiên theo dạng (`kind`) hoặc dùng sẵn danh sách `items` (bài luyện của một điểm ngữ pháp). */
export default function WritePractice({ kind, items, onFinish }: { kind?: Kind; items?: WritingItem[]; onFinish?: () => void }) {
  const [batch, setBatch] = useState<WritingBatch | null>(null);
  const [n, setN] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const [res, setRes] = useState<WritingCheck | null>(null);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    setBatch(null);
    setN(0);
    setScore(0);
    setPicked([]);
    setRes(null);
    setErr('');
    try {
      if (items) setBatch({ items, lockedCount: 0, level: 0 });
      else setBatch(await api<WritingBatch>('/writing?type=' + kind + '&count=8'));
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Không tải được bài tập');
    }
  }, [kind, items]);
  useEffect(() => {
    load();
  }, [load]);

  const item: WritingItem | undefined = batch?.items[n];

  const check = async (answer: string | string[]) => {
    if (!item || res) return;
    try {
      const r = await api<WritingCheck>('/writing/check', { method: 'POST', body: { itemId: item.id, answer } });
      setRes(r);
      if (r.correct) setScore((s) => s + 1);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Không chấm được');
    }
  };
  const next = () => {
    setN((v) => v + 1);
    setPicked([]);
    setRes(null);
  };

  if (err) return <div className="alert">{err}</div>;
  if (!batch) return <p className="muted">Đang tải…</p>;
  if (!batch.items.length) return <p className="muted">Chưa có bài tập ở cấp của bạn.</p>;
  if (!item) {
    return (
      <div className="card stack">
        <h2>
          Xong! Đúng {score}/{batch.items.length} câu
        </h2>
        <button className="btn primary" onClick={load}>
          {items ? 'Làm lại' : 'Làm bộ khác'}
        </button>
        {onFinish ? (
          <button className="btn" onClick={onFinish}>
            Về danh sách ngữ pháp
          </button>
        ) : null}
        {batch.lockedCount ? <p className="muted">Còn {batch.lockedCount} bài khóa ở cấp cao hơn, lên cấp để mở.</p> : null}
      </div>
    );
  }

  const verdict = res ? (
    <div className="alert" style={{ borderColor: res.correct ? 'var(--good)' : 'var(--bad)', background: res.correct ? 'var(--goodbg)' : 'var(--badbg)' }}>
      {item.type === 'WRONG'
        ? res.correct
          ? 'Đúng rồi, đây là câu sai ngữ pháp.'
          : 'Chưa đúng. Câu sai là: ' + res.sentence
        : res.correct
          ? 'Đúng rồi.'
          : 'Chưa đúng. Đáp án: ' + res.sentence}
    </div>
  ) : null;

  return (
    <div className="card stack">
      <div className="row between">
        <b>{TITLE[item.type]}</b>
        <span className="pill">
          {n + 1}/{batch.items.length} · HSK {item.level}
        </span>
      </div>
      <p className="muted">{item.vi}</p>

      {item.type === 'ORDER' && item.tiles ? (
        <>
          <div className="ansrow">
            {picked.map((p, i) => (
              <button key={i} className="tile wide on" disabled={!!res} onClick={() => setPicked(picked.filter((_, k) => k !== i))}>
                {p}
              </button>
            ))}
          </div>
          <div className="tiles">
            {item.tiles.map((p, i) => {
              const used = picked.filter((x) => x === p).length >= item.tiles!.filter((x) => x === p).length;
              return (
                <button key={i} className="tile wide" disabled={used || !!res} onClick={() => setPicked([...picked, p])}>
                  {p}
                </button>
              );
            })}
          </div>
          {verdict}
          {!res ? (
            <button className="btn primary" disabled={picked.length !== item.tiles.length} onClick={() => check(picked)}>
              Kiểm tra
            </button>
          ) : null}
        </>
      ) : null}

      {item.type === 'FILL' && item.parts && item.options ? (
        <>
          <div className="tkrow" style={{ fontSize: 26 }}>
            {item.parts.map((z, i) => (
              <span key={i} className="han" style={{ fontSize: 26 }}>
                {z || (
                  <span style={{ display: 'inline-block', minWidth: 34, borderBottom: '2px dashed var(--line)', color: 'var(--accent)' }}>
                    {res ? res.answer : picked[0] ?? '　'}
                  </span>
                )}
              </span>
            ))}
          </div>
          <div className="tiles">
            {item.options.map((o) => (
              <button key={o} className={'tile' + (picked[0] === o ? ' on' : '')} disabled={!!res} onClick={() => { setPicked([o]); check(o); }}>
                {o}
              </button>
            ))}
          </div>
          {verdict}
        </>
      ) : null}

      {(item.type === 'CHOOSE' || item.type === 'WRONG') && item.options ? (
        <>
          <div className="optgrid">
            {item.options.map((o) => (
              <button
                key={o}
                className={'opt' + (res ? (o === res.answer ? ' ok' : picked[0] === o ? ' no' : '') : '')}
                disabled={!!res}
                onClick={() => { setPicked([o]); check(o); }}
              >
                <span className="han">{o}</span>
              </button>
            ))}
          </div>
          {verdict}
        </>
      ) : null}

      {res ? (
        <button className="btn primary" onClick={next}>
          {n + 1 < batch.items.length ? 'Câu tiếp theo' : 'Xem kết quả'}
        </button>
      ) : null}
    </div>
  );
}
