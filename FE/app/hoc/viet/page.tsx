'use client';
// Kỹ năng Viết (rule.md mục 3.5): tập viết từng nét (đã có), sắp xếp câu và điền chữ — đều chấm tự động được.
import { useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import SkillNav from '@/components/SkillNav';
import Stroke from '@/components/Stroke';
import WritePractice from '@/components/WritePractice';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import type { Notebook, Topic, Word } from '@/lib/types';

type Mode = 'stroke' | 'order' | 'fill' | 'choose';

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
          <span className="tag">tự chấm</span>
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
          <button className={mode === 'choose' ? 'on' : ''} onClick={() => setMode('choose')}>
            Chọn câu
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

        {mode === 'order' ? <WritePractice kind="ORDER" /> : null}
        {mode === 'fill' ? <WritePractice kind="FILL" /> : null}
        {mode === 'choose' ? <WritePractice kind="CHOOSE" /> : null}
      </div>
    </Shell>
  );
}
