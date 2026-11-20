'use client';
// Bài tập viết tự chấm (rule.md mục 3.5): sắp xếp câu, điền chữ, chọn câu đúng nghĩa. Đề và đáp án lấy từ máy chủ.
import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import TranslateDiagram from './TranslateDiagram';
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
  const [hsk4, setHsk4] = useState(false);

  const load = useCallback(async () => {
    setBatch(null);
    setN(0);
    setScore(0);
    setPicked([]);
    setRes(null);
    setErr('');
    try {
      if (items) setBatch({ items, lockedCount: 0, level: 0 });
      else setBatch(await api<WritingBatch>('/writing?type=' + kind + '&count=8' + (hsk4 ? '&level=4' : '')));
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Không tải được bài tập');
    }
  }, [kind, items, hsk4]);
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
        : res.altUsed
          ? 'Đúng rồi. Cách xếp của bạn cũng đúng ngữ pháp; bên dưới là câu mẫu, nghĩa có thể khác câu của bạn.'
          : res.correct
            ? 'Đúng rồi.'
            : 'Chưa đúng. Đáp án: ' + res.sentence}
    </div>
  ) : null;

  // Sắp xếp câu: làm xong mới có câu đúng, pinyin, nghĩa và sơ đồ mũi tên.
  const reveal =
    res && item.type === 'ORDER' ? (
      <div className="stack">
        <div>
          <div className="han" style={{ fontSize: 22, fontWeight: 700 }}>
            {res.sentence}
          </div>
          {res.pinyin ? <div className="py">{res.pinyin}</div> : null}
          <div style={{ fontWeight: 600 }}>{res.vi}</div>
        </div>
        {res.tokens && res.natural ? <TranslateDiagram data={{ tokens: res.tokens, natural: res.natural }} dir="zh2vi" /> : null}
      </div>
    ) : null;

  // Giải thích đáp án: chỉ có ở bài luyện ngữ pháp; hiện sau khi đã chấm, dù đúng hay sai.
  const pickedOpt = item.type === 'FILL' || item.type === 'CHOOSE' || item.type === 'WRONG' ? picked[0] : undefined;
  const why = res?.why ? (
    <div className="why">
      <b className="why-h">Vì sao?</b>
      {!res.correct && pickedOpt && res.why.no[pickedOpt] ? (
        <p className="why-no">
          <span className="han">✗ {pickedOpt}</span>
          {' — '}
          {res.why.no[pickedOpt]}
        </p>
      ) : null}
      <p className="why-ok">
        <span className="why-tag">✓ Đáp án đúng</span> {res.why.ok}
      </p>
      {Object.entries(res.why.no).filter(([o]) => o !== pickedOpt || res.correct).length ? (
        <div className="why-more">
          <span className="why-tag">Các lựa chọn còn lại</span>
          {Object.entries(res.why.no)
            .filter(([o]) => o !== pickedOpt || res.correct)
            .map(([o, t]) => (
              <p key={o}>
                <span className="han">{o}</span>
                {' — '}
                {t}
              </p>
            ))}
        </div>
      ) : null}
    </div>
  ) : null;

  return (
    <div className="card stack">
      {kind && !items ? (
        <div className="chips">
          <button className={'chip' + (!hsk4 ? ' on' : '')} onClick={() => setHsk4(false)}>
            Theo cấp của bạn
          </button>
          <button className={'chip' + (hsk4 ? ' on' : '')} onClick={() => setHsk4(true)}>
            HSK 4 chuyên ngành
          </button>
        </div>
      ) : null}
      <div className="row between">
        <b>{TITLE[item.type]}</b>
        <span className="pill">
          {n + 1}/{batch.items.length} · HSK {item.level}
        </span>
      </div>
      {item.vi ? <p className="muted">{item.vi}</p> : null}

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
          {reveal}
          {why}
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
          {why}
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
          {why}
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
