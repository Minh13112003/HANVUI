'use client';
// Học → Dịch: người học dịch trước, chấm xong mới hiện mũi tên và bản dịch; mỗi câu có nút Hiện/Ẩn dịch (rule.md mục 8).
// Chấm ở máy chủ theo cụm ý và thứ tự soạn sẵn, không dùng AI.
import { useCallback, useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import TranslateDiagram, { type DiagramData } from '@/components/TranslateDiagram';
import { api } from '@/lib/api';
import { play } from '@/lib/audio';
import { useAuth } from '@/lib/auth';
import { useUi } from '@/lib/ui';

type Dir = 'zh2vi' | 'vi2zh';
interface Item {
  id: number;
  title: string;
  prompt: string;
  pinyin: string | null;
  tiles: string[] | null;
  correct: boolean;
}
interface List {
  level: number;
  locked: boolean;
  levels: { level: number; total: number; correct: number; locked: boolean }[];
  items: Item[];
}
interface Reference extends DiagramData {
  zh: string;
  vi: string;
  note: string;
}
interface Checked {
  verdict: 'ok' | 'near' | 'order' | 'missing';
  correct: boolean;
  extra: string[];
  missing: { zh: string; vi: string }[];
  reference: Reference;
}

const LOOK = {
  ok: { label: 'Đúng ý', color: 'var(--good)', bg: 'var(--goodbg)' },
  near: { label: 'Gần đúng', color: '#c27c0e', bg: 'var(--surface2)' },
  order: { label: 'Đủ từ, sai thứ tự', color: '#c27c0e', bg: 'var(--surface2)' },
  missing: { label: 'Còn thiếu ý', color: 'var(--bad)', bg: 'var(--badbg)' },
} as const;

function detail(r: Checked, dir: Dir) {
  const extra = r.extra.length ? ` Từ không khớp: ${r.extra.join(dir === 'vi2zh' ? '' : ', ')}.` : '';
  if (r.verdict === 'missing') return `Thiếu: ${r.missing.map((m) => (m.vi.startsWith('(') ? m.zh : `${m.zh} (${m.vi})`)).join(', ')}.${extra}`;
  if (r.verdict === 'order') return (dir === 'zh2vi' ? 'Bạn đã có đủ ý, nhưng câu chưa xuôi theo tiếng Việt.' : 'Bạn đã có đủ từ, nhưng thứ tự chưa đúng.') + extra;
  if (r.verdict === 'near') return `Đủ ý và đúng thứ tự.${extra}`;
  return '';
}

export default function TranslatePage() {
  const { user } = useAuth();
  const { toast } = useUi();
  const [dir, setDir] = useState<Dir>('zh2vi');
  const [level, setLevel] = useState<number | null>(null);
  const [data, setData] = useState<List | null>(null);
  const [at, setAt] = useState(0);
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState('');
  const [picked, setPicked] = useState<number[]>([]);
  const [res, setRes] = useState<Checked | null>(null);
  const [ref, setRef] = useState<Reference | null>(null);
  const [shown, setShown] = useState(false);
  const [busy, setBusy] = useState(false);

  const clear = () => {
    setText('');
    setPicked([]);
    setRes(null);
    setRef(null);
    setShown(false);
  };

  const load = useCallback(() => {
    setData(null);
    api<List>(`/translate/sentences?direction=${dir}${level ? `&level=${level}` : ''}`)
      .then((r) => {
        setData(r);
        setLevel(r.level);
        setAt(0);
        clear();
      })
      .catch((e) => toast(e instanceof Error ? e.message : 'Không tải được câu dịch'));
  }, [dir, level, toast]);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  const it = data?.items[at];
  const tileMode = dir === 'vi2zh' && !typing;
  const answer = tileMode && it?.tiles ? picked.map((k) => it.tiles![k]).join('') : text;
  const stat = data?.levels.find((l) => l.level === data.level);

  const go = (n: number) => {
    setAt(n);
    clear();
  };

  const toggle = async () => {
    if (shown) return setShown(false);
    if (!it) return;
    if (!ref) {
      try {
        setRef(await api<Reference>(`/translate/sentences/${it.id}/reveal`));
      } catch (e) {
        return toast(e instanceof Error ? e.message : 'Không tải được bản dịch');
      }
    }
    setShown(true);
  };

  const check = async () => {
    if (!it || !answer.trim() || busy) return;
    setBusy(true);
    try {
      const r = await api<Checked>('/translate/sentences/check', { method: 'POST', body: { sentenceId: it.id, direction: dir, answer } });
      setRes(r);
      setRef(r.reference);
      setShown(true);
      if (r.correct && !it.correct) {
        setData((d) =>
          d && {
            ...d,
            items: d.items.map((x) => (x.id === it.id ? { ...x, correct: true } : x)),
            levels: d.levels.map((l) => (l.level === d.level ? { ...l, correct: l.correct + 1 } : l)),
          },
        );
      }
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Không chấm được');
    } finally {
      setBusy(false);
    }
  };

  const look = res ? LOOK[res.verdict] : null;

  return (
    <Shell title="Dịch">
      <div className="stack">
        <div className="seg" role="tablist" aria-label="Chiều dịch">
          <button role="tab" aria-selected={dir === 'zh2vi'} className={dir === 'zh2vi' ? 'on' : ''} onClick={() => setDir('zh2vi')}>
            Trung → Việt
          </button>
          <button role="tab" aria-selected={dir === 'vi2zh'} className={dir === 'vi2zh' ? 'on' : ''} onClick={() => setDir('vi2zh')}>
            Việt → Trung
          </button>
        </div>
        <div className="chips">
          {data?.levels.map((l) => (
            <button key={l.level} className={'chip' + (l.level === data.level ? ' on' : '')} onClick={() => setLevel(l.level)}>
              HSK {l.level}
              {l.locked ? ' · Khóa' : ''}
            </button>
          ))}
        </div>

        {!data ? <p className="muted">Đang tải…</p> : null}
        {data?.locked ? (
          <div className="card empty">
            <p className="muted">Câu dịch HSK {data.level} đang khóa. Thi đạt đề lên cấp HSK {data.level} để mở.</p>
          </div>
        ) : null}

        {it ? (
          <section className="card stack">
            <div className="row between">
              <span className="eyebrow2">
                Câu {at + 1}/{data!.items.length}
              </span>
              <small className="muted">
                {it.correct ? 'Đã đúng · ' : ''}
                Đúng {stat?.correct ?? 0}/{stat?.total ?? 0} câu
              </small>
            </div>
            <div className="row between wrap" style={{ gap: 10 }}>
              <div className="grow">
                {dir === 'zh2vi' ? (
                  <>
                    <div className="row" style={{ gap: 8 }}>
                      <span className="han" style={{ fontSize: 24, fontWeight: 700 }}>
                        {it.prompt}
                      </span>
                      <button className="icon-btn" aria-label="Nghe câu" onClick={() => play(it.prompt, null, {})}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                          <path d="M4 9v6h3l5 4V5L7 9H4zM16 8.5a4 4 0 0 1 0 7" />
                        </svg>
                      </button>
                    </div>
                    <small className="muted">{it.pinyin}</small>
                  </>
                ) : (
                  <b style={{ fontSize: 18 }}>{it.prompt}</b>
                )}
              </div>
              <button className="btn sm" aria-expanded={shown} onClick={toggle}>
                {shown ? 'Ẩn dịch' : 'Hiện dịch'}
              </button>
            </div>

            {dir === 'vi2zh' ? (
              <div className="chips">
                <button className={'chip' + (!typing ? ' on' : '')} onClick={() => { setTyping(false); setText(''); setRes(null); }}>
                  Ghép thẻ
                </button>
                <button className={'chip' + (typing ? ' on' : '')} onClick={() => { setTyping(true); setPicked([]); setRes(null); }}>
                  Tự gõ chữ Hán
                </button>
              </div>
            ) : null}

            {tileMode && it.tiles ? (
              <>
                <div className="ansrow dg-tiles" aria-label="Câu đang ghép">
                  {!picked.length ? (
                    <span className="muted" style={{ fontSize: 13, paddingInline: 6 }}>
                      Chạm các thẻ theo đúng thứ tự
                    </span>
                  ) : null}
                  {picked.map((k, j) => (
                    <button key={j} className="tile on" onClick={() => setPicked(picked.filter((_, x) => x !== j))}>
                      {it.tiles![k]}
                    </button>
                  ))}
                </div>
                <div className="tiles dg-tiles">
                  {it.tiles.map((t, k) => (
                    <button key={k} className="tile" disabled={picked.includes(k)} onClick={() => setPicked([...picked, k])}>
                      {t}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <label className="field">
                {dir === 'zh2vi' ? 'Bản dịch của bạn (tiếng Việt có dấu)' : 'Gõ câu tiếng Trung (chữ Hán)'}
                <input
                  className={dir === 'vi2zh' ? 'hanin' : undefined}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && check()}
                  autoComplete="off"
                />
              </label>
            )}
            <button className="btn primary" disabled={busy || !answer.trim()} onClick={check}>
              {busy ? 'Đang chấm…' : 'Chấm'}
            </button>

            {shown && res && look ? (
              <div className="alert stack" style={{ gap: 3, borderColor: look.color, background: look.bg, color: 'var(--fg)' }}>
                <b style={{ color: look.color }}>{look.label}</b>
                {detail(res, dir) ? <span style={{ fontWeight: 500 }}>{detail(res, dir)}</span> : null}
              </div>
            ) : null}

            {shown && ref ? (
              <div className="stack">
                <TranslateDiagram data={ref} dir={dir} />
                <p style={{ fontWeight: 600 }}>{dir === 'zh2vi' ? ref.vi : ref.zh}</p>
                <small className="muted">{ref.note}</small>
              </div>
            ) : null}

            <div className="row between">
              <button className="btn ghost sm" disabled={at === 0} onClick={() => go(at - 1)}>
                ‹ Câu trước
              </button>
              <button className="btn sm" disabled={at + 1 >= data!.items.length} onClick={() => go(at + 1)}>
                Câu tiếp ›
              </button>
            </div>
          </section>
        ) : null}
        <small className="muted">Nội dung đang soạn thử, chưa qua duyệt. Máy chỉ nhận các cách dịch đã soạn, nên hãy đối chiếu với bản tham khảo nếu bạn dùng cách nói khác.</small>
      </div>
    </Shell>
  );
}
