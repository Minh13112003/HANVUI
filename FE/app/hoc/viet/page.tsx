'use client';
// Kỹ năng Viết (rule.md mục 3.5): tập viết từng nét (đã có), sắp xếp câu và điền chữ — đều chấm tự động được.
import { useEffect, useMemo, useState } from 'react';
import Shell from '@/components/Shell';
import SkillNav from '@/components/SkillNav';
import Stroke from '@/components/Stroke';
import { api } from '@/lib/api';
import { shuffle } from '@/lib/text';
import { useAuth } from '@/lib/auth';
import type { Notebook, Topic, Word } from '@/lib/types';

type Mode = 'stroke' | 'order' | 'fill';

// Câu mẫu để sắp xếp và điền chữ (bản mẫu; bản thật lấy từ bài đã học).
const ORDER = [
  { parts: ['我', '想', '喝', '咖啡'], vi: 'Tôi muốn uống cà phê.' },
  { parts: ['这个', '多少', '钱'], vi: 'Cái này bao nhiêu tiền?' },
  { parts: ['他', '每天', '坐', '地铁', '上班'], vi: 'Anh ấy đi làm bằng tàu điện ngầm mỗi ngày.' },
];
const FILL = [
  { zh: ['我', '', '茶'], answer: '喝', options: ['喝', '吃', '买'], vi: 'Tôi uống trà.' },
  { zh: ['明天', '', '雨'], answer: '下', options: ['下', '上', '出'], vi: 'Mai trời mưa.' },
  { zh: ['请', '', '一下', '这个', '文件'], answer: '看', options: ['看', '听', '说'], vi: 'Xin xem qua tài liệu này.' },
];

export default function WritePage() {
  const { user } = useAuth();
  const [mode, setMode] = useState<Mode>('stroke');
  const [words, setWords] = useState<string[]>([]);
  const [pick, setPick] = useState<string>('');

  // Chữ để tập viết: ưu tiên từ trong Sổ tay, chưa có thì lấy chủ đề đầu tiên.
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const nb = await api<Notebook>('/notebook?view=day');
        const mine = nb.groups.flatMap((g) => g.words.map((w) => w.zh));
        if (mine.length) {
          setWords(mine.slice(0, 24));
          setPick(mine[0]);
          return;
        }
        const ts = await api<Topic[]>('/topics?kind=VOCAB');
        if (!ts[0]) return;
        const d = await api<{ words: Word[] }>('/topics/' + ts[0].id + '/words');
        setWords(d.words.map((w) => w.zh).slice(0, 24));
        setPick(d.words[0]?.zh ?? '');
      } catch {
        /* để trống */
      }
    })();
  }, [user]);

  return (
    <Shell title="Viết">
      <div className="stack">
        <SkillNav />
        <div className="row between">
          <h1>Viết</h1>
          <span className="tag demo">sắp xếp câu và điền chữ: bản mẫu</span>
        </div>

        <div className="seg">
          <button className={mode === 'stroke' ? 'on' : ''} onClick={() => setMode('stroke')}>
            Tập viết nét
          </button>
          <button className={mode === 'order' ? 'on' : ''} onClick={() => setMode('order')}>
            Sắp xếp câu
          </button>
          <button className={mode === 'fill' ? 'on' : ''} onClick={() => setMode('fill')}>
            Điền chữ
          </button>
        </div>

        {mode === 'stroke' ? (
          <>
            <div className="chips">
              {words.map((w) => (
                <button key={w} className={'chip han' + (pick === w ? ' on' : '')} onClick={() => setPick(w)}>
                  {w}
                </button>
              ))}
            </div>
            {pick ? (
              <div className="card">
                <Stroke word={pick} />
              </div>
            ) : (
              <p className="muted">Chưa có từ nào. Hãy lưu từ ở bài hội thoại hoặc bảng từ vựng.</p>
            )}
          </>
        ) : null}

        {mode === 'order' ? <OrderGame /> : null}
        {mode === 'fill' ? <FillGame /> : null}
      </div>
    </Shell>
  );
}

function OrderGame() {
  const [n, setN] = useState(0);
  const q = ORDER[n % ORDER.length];
  const bank = useMemo(() => shuffle(q.parts), [q]);
  const [picked, setPicked] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const ok = picked.join('') === q.parts.join('');

  const next = () => {
    setN(n + 1);
    setPicked([]);
    setChecked(false);
  };

  return (
    <div className="card stack">
      <b>Sắp xếp thành câu đúng</b>
      <p className="muted">{q.vi}</p>
      <div className="ansrow">
        {picked.map((p, i) => (
          <button key={i} className="tile wide on" onClick={() => setPicked(picked.filter((_, k) => k !== i))}>
            {p}
          </button>
        ))}
      </div>
      <div className="tiles">
        {bank.map((p, i) => (
          <button key={i} className="tile wide" disabled={picked.includes(p)} onClick={() => setPicked([...picked, p])}>
            {p}
          </button>
        ))}
      </div>
      {checked ? (
        <div className="alert" style={{ borderColor: ok ? 'var(--good)' : 'var(--bad)', background: ok ? 'var(--goodbg)' : 'var(--badbg)' }}>
          {ok ? 'Đúng rồi.' : 'Chưa đúng. Câu đúng: ' + q.parts.join('')}
        </div>
      ) : null}
      <div className="row" style={{ gap: 8 }}>
        <button className="btn primary grow" disabled={picked.length !== q.parts.length} onClick={() => setChecked(true)}>
          Kiểm tra
        </button>
        <button className="btn" onClick={next}>
          Câu khác
        </button>
      </div>
    </div>
  );
}

function FillGame() {
  const [n, setN] = useState(0);
  const q = FILL[n % FILL.length];
  const [pick, setPick] = useState<string | null>(null);

  return (
    <div className="card stack">
      <b>Điền chữ còn thiếu</b>
      <p className="muted">{q.vi}</p>
      <div className="tkrow" style={{ fontSize: 26 }}>
        {q.zh.map((z, i) => (
          <span key={i} className="han" style={{ fontSize: 26 }}>
            {z || (
              <span
                style={{
                  display: 'inline-block',
                  minWidth: 34,
                  borderBottom: '2px dashed var(--line)',
                  color: pick ? 'var(--accent)' : 'transparent',
                }}
              >
                {pick ?? '　'}
              </span>
            )}
          </span>
        ))}
      </div>
      <div className="tiles">
        {q.options.map((o) => (
          <button key={o} className={'tile' + (pick === o ? ' on' : '')} onClick={() => setPick(o)}>
            {o}
          </button>
        ))}
      </div>
      {pick ? (
        <div
          className="alert"
          style={{
            borderColor: pick === q.answer ? 'var(--good)' : 'var(--bad)',
            background: pick === q.answer ? 'var(--goodbg)' : 'var(--badbg)',
          }}
        >
          {pick === q.answer ? 'Đúng rồi.' : 'Chưa đúng, chữ đúng là ' + q.answer + '.'}
        </div>
      ) : null}
      <button
        className="btn"
        onClick={() => {
          setN(n + 1);
          setPick(null);
        }}
      >
        Câu khác
      </button>
    </div>
  );
}
