'use client';
// Học → Từ vựng: danh sách chủ đề từ vựng (rule.md mục 3.1).
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import SkillNav from '@/components/SkillNav';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import type { Topic } from '@/lib/types';

export default function VocabTopicsPage() {
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[] | null>(null);

  useEffect(() => {
    if (!user) return;
    api<Topic[]>('/topics?kind=VOCAB')
      .then(setTopics)
      .catch(() => setTopics([]));
  }, [user]);

  return (
    <Shell title="Học">
      <div className="stack">
        <SkillNav />
        <section className="surf" data-g="rose">
          <span className="wm" aria-hidden="true">
            词
          </span>
          <span className="eyebrow">Từ vựng</span>
          <div className="hnum2" style={{ fontSize: 22 }}>
            {topics?.length ?? '…'} chủ đề
          </div>
          <span className="hsub">
            Chạm một từ để xem cách viết từng nét, nghe cách đọc (thường và chậm) rồi lưu vào Sổ tay.
          </span>
        </section>

        {topics === null ? <p className="muted">Đang tải…</p> : null}
        {topics?.map((t) => (
          <Link key={t.id} href={'/hoc/tu-vung/' + t.id} className="topic">
            <span className="big han">{t.glyph ?? '汉'}</span>
            <span className="grow">
              <b>{t.name}</b>
              <small style={{ display: 'block' }}>Bảng từ, che nghĩa, nghe và tập viết</small>
            </span>
            <span className="chev">›</span>
          </Link>
        ))}
        {topics?.length === 0 ? (
          <div className="card empty">
            <p className="muted">Chưa có chủ đề nào. Chạy `pnpm db:seed` ở BE để nạp nội dung mẫu.</p>
          </div>
        ) : null}

        <Link href="/so-tay" className="card row between">
          <span>
            <b>Từ của tôi</b>
            <small className="muted" style={{ display: 'block' }}>
              Các từ bạn đã lưu nằm trong Sổ tay
            </small>
          </span>
          <span className="chev">›</span>
        </Link>
      </div>
    </Shell>
  );
}
