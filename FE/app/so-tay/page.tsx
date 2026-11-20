'use client';
// Sổ tay: một danh sách duy nhất, xem theo ngày hoặc theo chủ đề (rule.md mục 3.7).
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import Tips from '@/components/Tips';
import WordSheet from '@/components/WordSheet';
import { api } from '@/lib/api';
import { play } from '@/lib/audio';
import { useAuth } from '@/lib/auth';
import { dayLabel } from '@/lib/text';
import { useUi } from '@/lib/ui';
import type { Notebook, UserWord } from '@/lib/types';

export default function NotebookPage() {
  const { user } = useAuth();
  const { openSheet, toast } = useUi();
  const router = useRouter();
  const [view, setView] = useState<'day' | 'topic'>('day');
  const [q, setQ] = useState('');
  const [data, setData] = useState<Notebook | null>(null);

  const load = (v = view, query = q) => {
    const p = new URLSearchParams({ view: v });
    if (query.trim()) p.set('q', query.trim());
    api<Notebook>('/notebook?' + p.toString())
      .then(setData)
      .catch(() => setData(null));
  };

  useEffect(() => {
    if (!user) return;
    const t = setTimeout(() => load(view, q), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, view, q]);

  const review = (words: UserWord[]) => {
    sessionStorage.setItem('hv.review', JSON.stringify(words));
    router.push('/so-tay/kiem-tra');
  };

  const remove = async (w: UserWord) => {
    try {
      await api('/notebook/' + w.id, { method: 'DELETE' });
      toast('Đã bỏ "' + w.zh + '" khỏi sổ tay');
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Không bỏ được');
    }
  };

  return (
    <Shell title="Sổ tay">
      <div className="stack nb">
        <div className="nb-top">
          <Link className="btn primary nb-act" href="/so-tay/kiem-tra">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="4" y="4" width="16" height="16" rx="3" />
              <path d="m8 12 3 3 5-6" />
            </svg>
            Kiểm tra
          </Link>
          <Link className="btn nb-act" href="/so-tay/viet-nho">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 20h4L19 9l-4-4L4 16v4zM13 7l4 4" />
            </svg>
            Viết từ trí nhớ
          </Link>
        </div>

        <div className="nb-bar">
          <div className="seg pillseg" role="tablist" aria-label="Cách xem">
            <button className={view === 'day' ? 'on' : ''} role="tab" aria-selected={view === 'day'} onClick={() => setView('day')}>
              Theo ngày
            </button>
            <button className={view === 'topic' ? 'on' : ''} role="tab" aria-selected={view === 'topic'} onClick={() => setView('topic')}>
              Theo chủ đề
            </button>
          </div>
          <span className="chip-total">{data?.total ?? '…'} từ lưu</span>
        </div>

        <div className="search">
          <svg className="srch" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m16.5 16.5 4 4" />
          </svg>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm từ vựng, pinyin…" aria-label="Tìm từ" />
        </div>

        {data?.groups.map((g) => (
          <section className="ngroup" key={g.key}>
            <div className="nghead">
              <h2 className="nh-t">{view === 'day' ? dayLabel(g.key) : g.key}</h2>
              <span className="pill">{g.count} từ</span>
              <span className="grow" />
              <button className="nh-btn" onClick={() => review(g.words)}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="m10 8.5 5 3.5-5 3.5z" />
                </svg>
                Ôn nhóm này
              </button>
            </div>
            <div className="nlist">
              {g.words.map((w) => (
                <div className="nrow" key={w.id}>
                  <button className="nmain" onClick={() => openSheet(<WordSheet word={w} lessonId={w.sourceLessonId ?? undefined} />)}>
                    <span className="nlv">{w.hsk2 ? 'H' + w.hsk2 : '—'}</span>
                    <span className="grow">
                      <span className="nline">
                        <span className="nzh han">{w.zh}</span>
                        <span className="py">{w.pinyin || '—'}</span>
                      </span>
                      <span className="nvi">{w.vi || 'AI sẽ điền nghĩa'}</span>
                    </span>
                  </button>
                  <button className="icon-btn nspk" aria-label={'Nghe ' + w.zh} onClick={() => play(w.zh, null, {})}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M4 9v6h3l5 4V5L7 9H4zM16 8.5a4 4 0 0 1 0 7" />
                    </svg>
                  </button>
                  <button className="icon-btn nstar" aria-label={'Bỏ ' + w.zh} onClick={() => remove(w)}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="m12 3.5 2.7 5.5 6 .9-4.4 4.2 1 6-5.3-2.8-5.3 2.8 1-6L3.3 9.9l6-.9z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))}

        {data && data.total === 0 ? (
          <div className="card empty center">
            <p className="muted">Chưa có từ nào.</p>
            <Link className="btn primary sm" href="/hoc/nghe">
              Đi học một bài
            </Link>
          </div>
        ) : null}

        <Tips
          screen="notebook"
          tips={[
            { sel: '.pillseg', title: 'Hai cách xem', text: 'Theo ngày để ôn ngay trong ngày, theo chủ đề để ôn theo ngữ cảnh.' },
            { title: 'Ôn nhóm này', text: 'Mỗi nhóm có nút ôn riêng: làm bài kiểm tra chỉ với các từ trong nhóm.' },
          ]}
        />
      </div>
    </Shell>
  );
}
