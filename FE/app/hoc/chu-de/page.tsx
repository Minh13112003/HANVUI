'use client';
// Học → Từ vựng chuyên ngành: danh sách chủ đề, mỗi chủ đề có sổ từ cốt lõi (rule.md mục 8).
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';

interface CoreTopic {
  id: string;
  name: string;
  glyph: string;
  intro: string;
  total: number;
  saved: number;
}

export default function CoreTopicsPage() {
  const { user } = useAuth();
  const [topics, setTopics] = useState<CoreTopic[] | null>(null);

  useEffect(() => {
    if (!user) return;
    api<CoreTopic[]>('/core-topics')
      .then(setTopics)
      .catch(() => setTopics([]));
  }, [user]);

  return (
    <Shell title="Từ vựng chuyên ngành">
      <div className="stack">
        <h1>Từ vựng chuyên ngành</h1>
        {topics === null ? <p className="muted">Đang tải…</p> : null}
        {topics?.map((t) => (
          <Link key={t.id} href={'/hoc/chu-de/' + t.id} className="topic">
            <span className="big han">{t.glyph}</span>
            <span className="grow">
              <b>{t.name}</b>
              <small style={{ display: 'block' }}>{t.intro}</small>
              <small className="muted" style={{ display: 'block' }}>
                Đã lưu {t.saved}/{t.total} từ
              </small>
            </span>
            <span className="chev">›</span>
          </Link>
        ))}
        {topics?.length === 0 ? (
          <div className="card empty">
            <p className="muted">Chưa có chủ đề nào.</p>
          </div>
        ) : null}
      </div>
    </Shell>
  );
}
