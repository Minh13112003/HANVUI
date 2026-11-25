'use client';
// Danh sách hội thoại theo chủ đề, có ô tìm kiếm (chỉ tìm tên bài, chủ đề, bối cảnh — KHÔNG tìm nội dung
// câu thoại, rule.md mục 3.2) và nút chọn cấp HSK 1 / 2 / 3.
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import Tips from '@/components/Tips';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { clueColor, hasClueColor } from '@/lib/clue';
import { lessonLabel, levelName } from '@/lib/text';
import type { EventState, LessonCard, Topic } from '@/lib/types';

const LEVELS = [
  { n: 1, name: 'HSK 1', note: '150 từ' },
  { n: 2, name: 'HSK 2', note: '300 từ' },
  { n: 3, name: 'HSK 3', note: '600 từ' },
  { n: 4, name: 'HSK 4', note: '1200 từ' },
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
  // Ô đã mở từ 2 gợi ý: gợi ý 2 chỉ tới một bài, bài đó mang màu của ô (kèm số "Ô n").
  const clueByLesson = new Map<string, { pos: number; color: string }[]>();
  for (const c of clues) {
    if (!hasClueColor(c.hintsOpened) || !c.hint2Lesson) continue;
    const id = c.hint2Lesson.id;
    clueByLesson.set(id, [...(clueByLesson.get(id) ?? []), { pos: c.pos, color: clueColor(c.pos) }]);
  }

  return (
    <Shell title="Nghe">
      <div className="stack">

        <div
          className="lvlseg"
          data-lv={level}
          style={{ ['--x' as string]: level - 1, ['--n' as string]: LEVELS.length }}
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
              <div
                key={c.slotId}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && c.clueTopicId && setTopic(c.clueTopicId)}
                className="clueRow"
                onClick={() => c.clueTopicId && setTopic(c.clueTopicId)}
                title="Lọc theo chủ đề của gợi ý"
              >
                <span className="cl1" style={hasClueColor(c.hintsOpened) ? { background: clueColor(c.pos), color: '#fff', borderRadius: 8, padding: '2px 8px', fontWeight: 800 } : undefined}>
                  Ô {c.pos + 1}
                </span>
                <span className="grow">
                  {c.hint1?.vi}
                  {c.hint2 ? ' · ' + c.hint2.vi : ''}
                  {c.hint2Lesson ? (
                    <Link href={'/hoc/nghe/' + c.hint2Lesson.id} onClick={(e) => e.stopPropagation()} style={{ display: 'block', fontWeight: 700, marginTop: 4 }}>
                      📖 Bài: {c.hint2Lesson.title} ›
                    </Link>
                  ) : null}
                </span>
                <span className="chev">›</span>
              </div>
            ))}
          </div>
        ) : null}

        {rows === null ? <p className="muted">Đang tải…</p> : null}
        {rows ? (
          <div className="sec-h">
            <h2>Bài học giao tiếp</h2>
            <span className="pill">{rows.length} bài</span>
          </div>
        ) : null}
        {rows?.map((l) =>
          l.locked ? (
            <div key={l.id} className="lc2 locked" data-lv={l.level}>
              <div className="lc2-top">
                <span className="lc2-ic han" aria-hidden="true">
                  🔒
                </span>
                <div className="grow">
                  <span className="lc2-tag">HSK {l.unlockLevel}</span>
                  <b className="lc2-t">{l.title}</b>
                  <small className="muted">{l.situation}</small>
                </div>
              </div>
              <div className="lc2-lock">
                <span>🔒 Thi đạt đề lên HSK {l.unlockLevel} để mở khóa</span>
                <Link className="btn sm" href="/them/thi">
                  Làm đề vượt cấp →
                </Link>
              </div>
            </div>
          ) : (
            <Link
              key={l.id}
              href={'/hoc/nghe/' + l.id}
              className={'lc2' + (l.status === 'started' ? ' cur' : '') + (l.status === 'done' ? ' done' : '')}
              data-lv={l.level}
              style={clueByLesson.has(l.id) ? { boxShadow: `inset 0 0 0 3px ${clueByLesson.get(l.id)![0].color}, var(--shadow)` } : undefined}
            >
              <div className="lc2-top">
                <span className="lc2-ic han" aria-hidden="true">
                  {l.topics?.[0]?.glyph ?? '听'}
                </span>
                <div className="grow">
                  <span className="lc2-meta">
                    <span className="lc2-tag">{lessonLabel(l.levelShown ?? l.level)}</span>
                    {clueByLesson.get(l.id)?.map((k) => (
                      <em key={k.pos} className="lc2-clue" style={{ background: k.color }}>
                        Gợi ý của Ô {k.pos + 1}
                      </em>
                    ))}
                  </span>
                  <b className="lc2-t">{l.title}</b>
                  <small className="muted">
                    {l.topics?.[0]?.name ? l.topics?.[0].name + ' · ' : ''}
                    {l.situation}
                  </small>
                </div>
              </div>
              <div className="lc2-foot">
                {l.status === 'done' ? (
                  <span className="lc2-ok">✓ Đã hoàn thành</span>
                ) : l.status === 'started' ? (
                  <>
                    <span className="lc2-st">Đang học</span>
                    <span className="lc2-go">Học tiếp ▷</span>
                  </>
                ) : (
                  <>
                    <span className="lc2-st">{l.lines} câu</span>
                    <span className="lc2-go soft">Bắt đầu ▷</span>
                  </>
                )}
              </div>
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
