'use client';
// Luyện dịch Trung ↔ Việt cho một điểm ngữ pháp. Chấm theo cụm ở máy chủ (dịch không có một đáp án duy nhất); sau khi nộp
// hiện bản dịch tự nhiên và bản dịch sát chữ để người học thấy vì sao dịch từng chữ nghe không xuôi, và cho tự đánh dấu
// "tôi dịch đúng ý" khi dùng cách nói khác mà máy chưa biết. Việt → Trung có chế độ ghép thẻ (dễ) và tự gõ (khó).
import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { play } from '@/lib/audio';
import { useUi } from '@/lib/ui';
import { Pinyin } from './WordSheet';

type Dir = 'zh2vi' | 'vi2zh';
interface Item {
  id: number;
  direction: Dir;
  prompt: string;
  tiles: string[] | null;
  done: { correct: boolean; self: boolean } | null;
}
interface Checked {
  pct: number;
  verdict: 'ok' | 'close' | 'wrong';
  correct: boolean;
  chunks: { zh: string; ok: boolean; optional?: boolean; expect?: string[] }[];
  reference: { zh: string; pinyin: string; vi: string; literal: string; chunks: { zh: string; vi: string[] }[] };
}

const VERDICT = { ok: 'Đúng ý ✓', close: 'Gần đúng', wrong: 'Chưa đúng' } as const;

export default function TranslatePractice({ slug }: { slug: string }) {
  const { toast } = useUi();
  const [dir, setDir] = useState<Dir>('zh2vi');
  const [typing, setTyping] = useState(false);
  const [items, setItems] = useState<Item[] | null>(null);
  const [at, setAt] = useState(0);
  const [text, setText] = useState('');
  const [picked, setPicked] = useState<number[]>([]);
  const [res, setRes] = useState<Checked | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    setItems(null);
    api<Item[]>(`/translate/grammar/${slug}?direction=${dir}`)
      .then((r) => {
        setItems(r);
        setAt(0);
        setText('');
        setPicked([]);
        setRes(null);
      })
      .catch((e) => toast(e instanceof Error ? e.message : 'Không tải được câu luyện dịch'));
  }, [slug, dir, toast]);
  useEffect(load, [load]);

  const it = items?.[at];
  const tileMode = dir === 'vi2zh' && !typing;
  const answer = tileMode && it?.tiles ? picked.map((k) => it.tiles![k]).join('') : text;

  const check = async () => {
    if (!it || !answer.trim()) return;
    setBusy(true);
    try {
      setRes(await api<Checked>('/translate/check', { method: 'POST', body: { itemId: it.id, direction: dir, answer } }));
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Không chấm được');
    } finally {
      setBusy(false);
    }
  };

  const selfMark = async () => {
    if (!it) return;
    try {
      await api('/translate/self', { method: 'POST', body: { itemId: it.id, direction: dir } });
      setRes((r) => (r ? { ...r, correct: true, verdict: 'ok' } : r));
      toast('Đã ghi nhận bạn dịch đúng ý');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Không ghi nhận được');
    }
  };

  const next = () => {
    setRes(null);
    setText('');
    setPicked([]);
    setAt((a) => a + 1);
  };

  return (
    <div className="card stack">
      <h3 className="gx-h">🔁 Luyện dịch câu</h3>
      <div className="seg" role="tablist" aria-label="Chiều dịch">
        <button role="tab" aria-selected={dir === 'zh2vi'} className={dir === 'zh2vi' ? 'on' : ''} onClick={() => setDir('zh2vi')}>
          Trung → Việt
        </button>
        <button role="tab" aria-selected={dir === 'vi2zh'} className={dir === 'vi2zh' ? 'on' : ''} onClick={() => setDir('vi2zh')}>
          Việt → Trung
        </button>
      </div>
      {dir === 'vi2zh' ? (
        <div className="chips">
          <button className={'chip' + (!typing ? ' on' : '')} onClick={() => { setTyping(false); setText(''); }}>
            Ghép thẻ (dễ)
          </button>
          <button className={'chip' + (typing ? ' on' : '')} onClick={() => { setTyping(true); setPicked([]); }}>
            Tự gõ chữ Hán (khó)
          </button>
        </div>
      ) : null}
      <p className="muted" style={{ fontSize: 12 }}>
        Dịch theo ý, không cần từng chữ. Máy chấm theo cụm ý; tiếng Việt cần đúng dấu.
      </p>

      {!items ? <p className="muted">Đang tải…</p> : null}
      {items && !it ? (
        <div className="stack">
          <p>Bạn đã làm hết {items.length} câu của chiều này.</p>
          <button className="btn sm" onClick={load}>
            Làm lại
          </button>
        </div>
      ) : null}

      {it ? (
        <div className="stack">
          <div className="row between">
            <span className="eyebrow2">
              Câu {at + 1}/{items!.length}
            </span>
            {it.done?.correct ? <small className="py">đã đúng trước đây</small> : null}
          </div>
          <div className="card prompt" style={{ padding: 14 }}>
            {dir === 'zh2vi' ? (
              <div className="row" style={{ gap: 8, justifyContent: 'center' }}>
                <span className="han" style={{ fontSize: 24 }}>
                  {it.prompt}
                </span>
                <button className="icon-btn" aria-label="Nghe câu" onClick={() => play(it.prompt, null, {})}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M4 9v6h3l5 4V5L7 9H4zM16 8.5a4 4 0 0 1 0 7" />
                  </svg>
                </button>
              </div>
            ) : (
              <b style={{ fontSize: 18 }}>{it.prompt}</b>
            )}
          </div>

          {tileMode && it.tiles ? (
            <>
              <div className="ansrow" aria-label="Câu đang ghép">
                {!picked.length ? (
                  <span className="muted" style={{ fontSize: 13, paddingInline: 6 }}>
                    Chạm các thẻ theo đúng thứ tự
                  </span>
                ) : null}
                {picked.map((k, j) => (
                  <button key={j} className="tile on" disabled={!!res} onClick={() => setPicked(picked.filter((_, x) => x !== j))}>
                    {it.tiles![k]}
                  </button>
                ))}
              </div>
              <div className="tiles">
                {it.tiles.map((t, k) => (
                  <button key={k} className="tile" disabled={picked.includes(k) || !!res} onClick={() => setPicked([...picked, k])}>
                    {t}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <label className="field">
              {dir === 'zh2vi' ? 'Câu dịch tiếng Việt' : 'Gõ câu tiếng Trung (chữ Hán)'}
              <input
                className={dir === 'vi2zh' ? 'hanin' : undefined}
                value={text}
                disabled={!!res}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && !res && check()}
                autoComplete="off"
              />
            </label>
          )}

          {!res ? (
            <button className="btn primary" disabled={busy || !answer.trim()} onClick={check}>
              Kiểm tra
            </button>
          ) : (
            <div className="stack">
              <div className="alert" style={res.correct ? { borderColor: 'var(--good)', background: 'var(--goodbg)' } : undefined}>
                <b>{res.correct ? VERDICT.ok : VERDICT[res.verdict]}</b> · đủ {res.pct}% ý
              </div>
              <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
                {res.chunks
                  .filter((c) => !c.optional)
                  .map((c, k) => (
                    <span key={k} style={{ border: `2px solid ${c.ok ? 'var(--good)' : 'var(--bad)'}`, borderRadius: 10, padding: '4px 8px' }}>
                      <span className="han">{c.zh}</span>
                      {!c.ok && c.expect?.length ? <small className="muted"> → {c.expect.slice(0, 2).join(' / ')}</small> : null}
                      {!c.ok && dir === 'vi2zh' ? <small className="muted"> (còn thiếu)</small> : null}
                    </span>
                  ))}
              </div>
              <div className="keyc" style={{ display: 'grid', gap: 4 }}>
                <small className="muted">Câu gốc</small>
                <span className="han" style={{ fontSize: 20 }}>
                  {res.reference.zh}
                </span>
                <Pinyin text={res.reference.pinyin} />
                <small className="muted" style={{ marginTop: 6 }}>
                  Dịch tự nhiên (nên viết thế này)
                </small>
                <b>{res.reference.vi}</b>
                <small className="muted" style={{ marginTop: 6 }}>
                  Dịch sát chữ (để hiểu cấu trúc, không nên nói thế này)
                </small>
                <span style={{ fontStyle: 'italic' }}>{res.reference.literal}</span>
              </div>
              {!res.correct ? (
                <button className="btn sm" onClick={selfMark}>
                  So với bản tham khảo, tôi dịch đúng ý
                </button>
              ) : null}
              <button className="btn primary" onClick={next}>
                {at < items!.length - 1 ? 'Câu tiếp ›' : 'Xong'}
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
