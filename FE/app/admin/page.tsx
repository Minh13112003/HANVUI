'use client';
// Quản trị bài học (rule.md mục 8): danh sách hội thoại và bài đọc, tìm, lọc, vào sửa hoặc thêm bài mới.
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import AdminGate from '@/components/AdminGate';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useUi } from '@/lib/ui';

interface Row {
  id: string;
  kind: 'DIALOG' | 'READING';
  title: string;
  level: number;
  published: boolean;
  reviewed: boolean;
  topic: string | null;
  lines: number;
  audio: number;
  questions: number;
  hasKeyword: boolean;
}

type Filter = 'all' | 'DIALOG' | 'READING' | 'hidden' | 'unreviewed';
const FILTERS: [Filter, string][] = [
  ['all', 'Tất cả'],
  ['DIALOG', 'Hội thoại'],
  ['READING', 'Bài đọc'],
  ['hidden', 'Đang ẩn'],
  ['unreviewed', 'Chưa duyệt'],
];

export default function AdminPage() {
  const { user } = useAuth();
  const { toast } = useUi();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    if (user?.role !== 'ADMIN') return;
    api<Row[]>('/admin/lessons')
      .then(setRows)
      .catch((e) => toast(e instanceof Error ? e.message : 'Không tải được danh sách bài'));
  }, [user, toast]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (rows ?? []).filter((r) => {
      if (filter === 'DIALOG' || filter === 'READING') {
        if (r.kind !== filter) return false;
      }
      if (filter === 'hidden' && r.published) return false;
      if (filter === 'unreviewed' && r.reviewed) return false;
      return !needle || (r.title + ' ' + r.id + ' ' + (r.topic ?? '')).toLowerCase().includes(needle);
    });
  }, [rows, q, filter]);

  return (
    <AdminGate title="Quản trị bài học">
      <div className="stack">
        <div className="row between">
          <b>Bài học</b>
          <Link className="btn primary sm" href="/admin/bai/moi">
            + Thêm bài
          </Link>
        </div>
        <label className="field">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm theo tên, mã bài, chủ đề" aria-label="Tìm bài" />
        </label>
        <div className="row" style={{ flexWrap: 'wrap', gap: 6 }}>
          {FILTERS.map(([id, name]) => (
            <button key={id} className={'chip' + (filter === id ? ' on' : '')} onClick={() => setFilter(id)}>
              {name}
            </button>
          ))}
        </div>
        {!rows ? <p className="muted">Đang tải…</p> : null}
        {rows && !shown.length ? <p className="muted">Không có bài nào khớp.</p> : null}
        {shown.map((r) => (
          <Link key={r.id} className="card stack" href={'/admin/bai/' + r.id} style={{ gap: 6 }}>
            <div className="row between">
              <b className="grow">{r.title}</b>
              <span className="pill">HSK {r.level}</span>
            </div>
            <small className="muted">
              {r.kind === 'READING' ? 'Bài đọc' : 'Hội thoại'}
              {r.topic ? ' · ' + r.topic : ''} · {r.lines} câu · {r.questions} câu hỏi
              {r.kind === 'DIALOG' ? ` · âm thanh ${r.audio}/${r.lines}` : ''}
            </small>
            <div className="row" style={{ flexWrap: 'wrap', gap: 6 }}>
              <span className="pill">{r.published ? 'Đang hiện' : 'Đang ẩn'}</span>
              <span className={'pill' + (r.reviewed ? '' : ' hot')}>{r.reviewed ? 'Đã duyệt' : 'CHƯA QUA DUYỆT'}</span>
              {r.hasKeyword ? <span className="pill">Có từ khóa sự kiện</span> : null}
            </div>
          </Link>
        ))}
      </div>
    </AdminGate>
  );
}
