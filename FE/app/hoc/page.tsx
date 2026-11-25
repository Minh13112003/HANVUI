'use client';
// Học → Từ vựng: danh sách chủ đề từ vựng (rule.md mục 3.1).
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import SkillNav from '@/components/SkillNav';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import type { EventState, Topic } from '@/lib/types';

export default function VocabTopicsPage() {
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[] | null>(null);
  const [ev, setEv] = useState<EventState | null>(null);

  useEffect(() => {
    if (!user) return;
    api<Topic[]>('/topics?kind=VOCAB')
      .then(setTopics)
      .catch(() => setTopics([]));
    api<EventState>('/event')
      .then(setEv)
      .catch(() => {});
  }, [user]);

  return (
    <Shell title="Học">
      <div className="stack">
        <SkillNav />
        {ev?.active && !ev.optedOut ? (
          <Link href="/su-kien" className="surf mission">
            <span className="wm" aria-hidden="true">
              谜
            </span>
            <div className="row between">
              <span className="eyebrow">Nhiệm vụ thám tử</span>
              <span className="hpill">
                {ev.solved}/{ev.totalKeys} từ khóa
              </span>
            </div>
            <div className="evt" style={{ fontSize: 21, fontWeight: 800 }}>
              {ev.story?.title}
            </div>
            <div className="hbar">
              <i style={{ width: ((ev.solved ?? 0) / (ev.totalKeys ?? 48)) * 100 + '%' }} />
            </div>
            <span className="mission-go">Tiếp tục phá án →</span>
          </Link>
        ) : null}

        <div className="sec-h">
          <h2>Từ vựng</h2>
          <span className="pill">{topics?.length ?? '…'} chủ đề</span>
        </div>

        <Link href="/hoc/chu-de" className="topic">
          <span className="big han">专</span>
          <span className="grow">
            <b>Từ vựng chuyên ngành</b>
          </span>
          <span className="chev">›</span>
        </Link>

        {topics === null ? <p className="muted">Đang tải…</p> : null}
        {topics?.map((t) => (
          <Link key={t.id} href={'/hoc/tu-vung/' + t.id} className="topic">
            <span className="big han">{t.glyph ?? '汉'}</span>
            <span className="grow">
              <b>{t.name}</b>
            </span>
            <span className="chev">›</span>
          </Link>
        ))}
        {topics?.length === 0 ? (
          <div className="card empty">
            <p className="muted">Chưa có chủ đề.</p>
          </div>
        ) : null}

        <Link href="/so-tay" className="card row between">
          <span>
            <b>Từ của tôi</b>
          </span>
          <span className="chev">›</span>
        </Link>
      </div>
    </Shell>
  );
}
