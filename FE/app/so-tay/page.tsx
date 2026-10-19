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
import { dayLabel, hskLabel } from '@/lib/text';
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
      <div className="stack">
        <h1>Sổ tay từ vựng</h1>
        <section className="stats">
          <div className="stat" data-g="rose">
            <span className="ic han" aria-hidden="true">
              词
            </span>
            <b className="num">{data?.total ?? '…'}</b>
            <small>tổng số từ</small>
          </div>
          <div className="stat">
            <span className="ic han" aria-hidden="true">
              今
            </span>
            <b className="num">{data?.today ?? '…'}</b>
            <small>lưu hôm nay</small>
          </div>
          <div className="stat" data-g="violet">
            <span className="ic han" aria-hidden="true">
              组
            </span>
            <b className="num">{data?.groups.length ?? '…'}</b>
            <small>{view === 'day' ? 'ngày học' : 'chủ đề'}</small>
          </div>
        </section>

        <div className="seg" role="tablist" aria-label="Cách xem">
          <button className={view === 'day' ? 'on' : ''} role="tab" aria-selected={view === 'day'} onClick={() => setView('day')}>
            Theo ngày
          </button>
          <button className={view === 'topic' ? 'on' : ''} role="tab" aria-selected={view === 'topic'} onClick={() => setView('topic')}>
            Theo chủ đề
          </button>
        </div>

        <div className="search">
          <svg className="srch" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m16.5 16.5 4 4" />
          </svg>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm chữ Hán, pinyin hoặc nghĩa" aria-label="Tìm từ" />
        </div>

        <div className="row" style={{ gap: 8 }}>
          <button className="btn sm grow" disabled={!data?.total} onClick={() => review(data!.groups.flatMap((g) => g.words))}>
            Kiểm tra 8 câu
          </button>
          <Link className="btn sm grow" href="/so-tay/lat-the" style={{ textAlign: 'center' }}>
            Lật thẻ
          </Link>
        </div>

        {data?.groups.map((g) => (
          <section className="ngroup" key={g.key}>
            <div className="nghead">
              <b className="grow">{view === 'day' ? dayLabel(g.key) : g.key}</b>
              <span className="pill">{g.count} từ</span>
              <button className="lnk" onClick={() => review(g.words)}>
                Ôn nhóm này
              </button>
            </div>
            <div className="nlist">
              {g.words.map((w) => (
                <div className="nrow" key={w.id}>
                  <button className="nmain" onClick={() => openSheet(<WordSheet word={w} lessonId={w.sourceLessonId ?? undefined} />)}>
                    <span className="nzh han">{w.zh}</span>
                    <span className="grow">
                      <span className="py">{w.pinyin || '—'}</span>
                      <b style={{ display: 'block' }}>{w.vi || 'AI sẽ điền nghĩa'}</b>
                      <small className="nsrc">
                        {w.isPhrase ? 'cụm từ · ' : ''}
                        {hskLabel(w.hsk2, w.hsk3)}
                        {w.sourceLessonId ? ' · từ bài ' + w.sourceLessonId : ''}
                      </small>
                    </span>
                  </button>
                  <button className="icon-btn" aria-label={'Nghe ' + w.zh} onClick={() => play(w.zh, null, {})}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M4 9v6h3l5 4V5L7 9H4zM16 8.5a4 4 0 0 1 0 7" />
                    </svg>
                  </button>
                  <button className="icon-btn" aria-label={'Bỏ ' + w.zh} onClick={() => remove(w)} style={{ color: 'var(--bad)' }}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))}

        {data && data.total === 0 ? (
          <div className="card empty center">
            <p className="muted">
              Chưa có từ nào. Vào một bài hội thoại, bật "Chế độ lưu từ" ở phần lời thoại rồi chạm từ để lưu.
            </p>
            <Link className="btn primary sm" href="/hoc/nghe">
              Đi học một bài
            </Link>
          </div>
        ) : null}

        <p className="note">Ôn tập ngắt quãng (từ sai hiện lại sớm) sẽ thêm sau — rule.md mục 3.8.</p>
        <Tips
          screen="notebook"
          tips={[
            { sel: '.seg', title: 'Hai cách xem', text: 'Theo ngày để ôn ngay trong ngày, theo chủ đề để ôn theo ngữ cảnh.' },
            { title: 'Ôn nhóm này', text: 'Mỗi nhóm có nút ôn riêng: làm bài kiểm tra chỉ với các từ trong nhóm.' },
          ]}
        />
      </div>
    </Shell>
  );
}
