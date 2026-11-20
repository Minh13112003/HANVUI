'use client';
// Kỹ năng Viết (rule.md mục 3.5): tập viết từng nét (đã có), sắp xếp câu và điền chữ — đều chấm tự động được.
import { useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import GrammarSection from '@/components/GrammarSection';
import Stroke from '@/components/Stroke';
import { WriteHelpButton } from '@/components/WriteHelp';
import WritePractice from '@/components/WritePractice';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import type { Notebook, Topic, Word } from '@/lib/types';

type Mode = 'stroke' | 'grammar' | 'order' | 'fill' | 'choose';

export default function WritePage() {
  const { user } = useAuth();
  const [mode, setMode] = useState<Mode | null>(null);
  const [words, setWords] = useState<string[]>([]);
  const [pick, setPick] = useState<string>('');

  // Mở thẳng một tab từ liên kết (ví dụ Lộ trình → /hoc/viet?tab=grammar).
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('tab');
    if (t && ['stroke', 'grammar', 'order', 'fill', 'choose'].includes(t)) setMode(t as Mode);
  }, []);

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

  const TABS: { m: Mode; label: string; tag: string; zh: string; art: string }[] = [
    { m: 'stroke', label: 'Tập viết nét', tag: 'Cơ bản', zh: '笔画', art: '永' },
    { m: 'grammar', label: 'Ngữ pháp', tag: 'HSK 1-4', zh: '语法', art: '法' },
    { m: 'order', label: 'Sắp xếp câu', tag: 'HSK 2-3', zh: '连词', art: '我 · 喜欢' },
    { m: 'fill', label: 'Điền chữ', tag: 'Trắc nghiệm', zh: '填空', art: '看 ?' },
    { m: 'choose', label: 'Chọn câu đúng', tag: 'Ngữ pháp', zh: '正误', art: '对 · 错' },
  ];

  return (
    <Shell title="Viết">
      <div className="stack wv">
        {mode === null ? (
          <>
            <div className="row between">
              <span className="muted" style={{ fontWeight: 700 }}>Chọn cách luyện</span>
              <WriteHelpButton />
            </div>
            <div className="wv-grid">
              {TABS.map((t) => (
                <button key={t.m} className="wv-card" onClick={() => setMode(t.m)}>
                  <span className="row between">
                    <span className="wv-tag">{t.tag}</span>
                    <span className="wv-zh han">{t.zh}</span>
                  </span>
                  <span className="wv-art han">{t.art}</span>
                  <b>{t.label}</b>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="wv-pills" role="tablist" aria-label="Cách luyện viết">
            <button className="wv-back" onClick={() => setMode(null)} aria-label="Tất cả">
              ‹
            </button>
            {TABS.map((t) => (
              <button key={t.m} role="tab" aria-selected={mode === t.m} className={'wv-pill' + (mode === t.m ? ' on' : '')} onClick={() => setMode(t.m)}>
                {t.label.replace('Tập viết nét', 'Nét').replace(' câu đúng', ' câu')}
              </button>
            ))}
            <WriteHelpButton />
          </div>
        )}

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

        {mode === 'grammar' ? <GrammarSection /> : null}
        {mode === 'order' ? <WritePractice kind="ORDER" /> : null}
        {mode === 'fill' ? <WritePractice kind="FILL" /> : null}
        {mode === 'choose' ? <WritePractice kind="CHOOSE" /> : null}
      </div>
    </Shell>
  );
}
