'use client';
// Danh sách hội thoại theo chủ đề, có ô tìm kiếm (chỉ tìm tên bài, chủ đề, bối cảnh — KHÔNG tìm nội dung
// câu thoại, rule.md mục 3.2) và nút chọn cấp HSK 1 / 2 / 3.
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import Tips from '@/components/Tips';
import SkillNav from '@/components/SkillNav';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { hskLabel } from '@/lib/text';
import type { EventState, LessonCard, Topic } from '@/lib/types';

const LEVELS = [
  { n: 1, name: 'HSK 1', note: 'câu ngắn' },
  { n: 2, name: 'HSK 2', note: 'dài hơn' },
  { n: 3, name: 'HSK 3', note: 'nhiều từ' },
];

export default function ListenListPage() {
  const { user } = useAuth();
  const [level, setLevel] = useState(1);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topic, setTopic] = useState<string>('');
  const [q, setQ] = useState('');
  const [rows, setRows] = useState<LessonCard[] | null>(null);
  const [ev, setEv] = useState<EventState | null>(null);

  useEffect(() => {
    const saved = Number(localStorage.getItem('hv.level') || 1);
    if (saved >= 1 && saved <= 3) setLevel(saved);
  }, []);

  useEffect(() => {
    if (!user) return;
    api<Topic[]>('/topics?kind=SITUATION')
      .then(setTopics)
      .catch(() => {});
    api<EventState>('/event')
      .then(setEv)
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const t = setTimeout(() => {
      const p = new URLSearchParams({ level: String(level) });
      if (topic) p.set('topic', topic);
      if (q.trim()) p.set('q', q.trim());
      api<LessonCard[]>('/lessons?' + p.toString())
        .then(setRows)
        .catch(() => setRows([]));
    }, 250);
    return () => clearTimeout(t);
  }, [user, level, topic, q]);

  const clues = (ev?.chapters ?? []).flatMap((c) =>
    c.cells.filter((x) => x.status === 'open' && (x.hintsOpened ?? 0) >= 1 && x.hint1),
  );

  return (
    <Shell title="Nghe">
      <div className="stack">
        <SkillNav />

        <div
          className="lvlseg"
          data-lv={level}
          style={{ ['--x' as string]: level - 1, ['--n' as string]: 3 }}
          role="tablist"
          aria-label="Cấp HSK"
        >
          <span className="lvlpill" aria-hidden="true" />
          {LEVELS.map((l) => (
            <button
              key={l.n}
              className={level === l.n ? 'on' : ''}
              role="tab"
              aria-selected={level === l.n}
              onClick={() => {
                setLevel(l.n);
                localStorage.setItem('hv.level', String(l.n));
              }}
            >
              <b>{l.name}</b>
              <small>{l.note}</small>
            </button>
          ))}
        </div>

        <div className="search">
          <svg className="srch" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m16.5 16.5 4 4" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm theo tên bài, chủ đề, bối cảnh"
            aria-label="Tìm bài học"
          />
        </div>

        <div className="chips">
          <button className={'chip' + (topic === '' ? ' on' : '')} onClick={() => setTopic('')}>
            Tất cả
          </button>
          {topics
            .filter((t) => t.id !== 'truyen')
            .map((t) => (
              <button key={t.id} className={'chip' + (topic === t.id ? ' on' : '')} onClick={() => setTopic(t.id)}>
                {t.name}
              </button>
            ))}
        </div>

        {clues.length ? (
          <div className="card stack">
            <div className="row between">
              <h2>Manh mối bạn đang theo dõi</h2>
              <span className="pill">{clues.length} ô</span>
            </div>
            {clues.map((c) => (
              <button
                key={c.slotId}
                className="clueRow"
                onClick={() => c.clueTopicId && setTopic(c.clueTopicId)}
                title="Lọc theo chủ đề của gợi ý"
              >
                <span className="cl1">Ô {c.pos + 1}</span>
                <span className="grow">
                  {c.hint1?.vi}
                  {c.hint2 ? ' · ' + c.hint2.vi : ''}
                </span>
                <span className="chev">›</span>
              </button>
            ))}
          </div>
        ) : null}

        {rows === null ? <p className="muted">Đang tải…</p> : null}
        {rows?.some((l) => l.locked) ? (
          <div className="alert" role="note">
            🔒 Bài có khóa thuộc cấp cao hơn cấp hiện tại của bạn (HSK {user?.hskLevel ?? 1}). Làm đề nâng cấp ở mục Học
            → Thi, đạt điểm thì cấp tăng và bài được mở khóa.
          </div>
        ) : null}
        {rows?.map((l) =>
          l.locked ? (
            <button
              key={l.id}
              type="button"
              className="lcard"
              data-lv={l.level}
              style={{ opacity: 0.6, textAlign: 'left', width: '100%' }}
              aria-disabled="true"
              onClick={() => window.alert(`Bài này thuộc HSK ${l.unlockLevel}. Hãy thi đạt đề lên cấp HSK ${l.unlockLevel} để mở khóa.`)}
            >
              <span className="lg2 han">🔒</span>
              <span className="grow">
                <b>{l.title}</b>
                <small className="lsub muted">Khóa · mở khi lên HSK {l.unlockLevel}</small>
                <span className="tags">
                  {l.topics.map((t) => (
                    <em key={t.id} className="tp">
                      {t.name}
                    </em>
                  ))}
                </span>
              </span>
              <span className="lr">
                <span className="pill">HSK {l.unlockLevel}</span>
                <small className="muted" style={{ fontWeight: 700 }}>Khóa</small>
              </span>
            </button>
          ) : (
          <Link
            key={l.id}
            href={'/hoc/nghe/' + l.id}
            className="lcard"
            data-lv={l.level}
            data-done={l.status === 'done' ? '1' : undefined}
          >
            <span className="lg2 han">{l.topics[0]?.name?.[0] ?? '听'}</span>
            <span className="grow">
              <b>{l.title}</b>
              <small className="lsub muted">
                {l.situation} · {l.lines} câu
              </small>
              <span className="tags">
                {l.topics.map((t) => (
                  <em key={t.id} className="tp">
                    {t.name}
                  </em>
                ))}
                {l.tags.slice(0, 2).map((t) => (
                  <em key={t}>{t}</em>
                ))}
              </span>
            </span>
            <span className="lr">
              <span className="pill">{hskLabel(l.hsk2, l.hsk3)}</span>
              <small className={l.status === 'done' ? 'py' : 'muted'} style={{ fontWeight: 700 }}>
                {l.status === 'done' ? '✓ đã học' : l.status === 'started' ? 'đang học' : 'mới'}
              </small>
            </span>
          </Link>
          ),
        )}
        {rows?.length === 0 ? (
          <div className="card empty">
            <p className="muted">
              Không có bài nào ở cấp này. Thử cấp khác hoặc bỏ bớt từ khóa tìm kiếm. (Tìm kiếm không nhìn nội dung câu
              thoại, nên không dùng được để dò từ khóa sự kiện.)
            </p>
          </div>
        ) : null}
        <Tips
          screen="listen"
          tips={[
            { sel: '.lvlseg', title: 'Chọn cấp', text: 'Mỗi chủ đề có bản HSK 1, HSK 2 và HSK 3. App nhớ lựa chọn của bạn.' },
            { sel: '.search', title: 'Tìm bài', text: 'Chỉ tìm theo tên bài, chủ đề và bối cảnh — không tìm nội dung câu thoại.' },
            { title: 'Luồng một bài', text: 'Nghe trước, trả lời câu hỏi, rồi mới xem lời thoại.' },
          ]}
        />
      </div>
    </Shell>
  );
}
