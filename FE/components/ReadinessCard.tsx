'use client';
// Thẻ "Sẵn sàng thi lên cấp?" (chỉ để tham khảo, không khóa đề): điểm kiểm tra bộ từ HSK của cấp, % hội thoại và
// % bài đọc cấp đó đã hoàn thành, so với mức gợi ý (từ vựng 80%, hội thoại 70%, bài đọc 70%). Dùng ở Kiểm tra và Làm đề.
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export interface Readiness {
  level: number;
  vocab: { best: { pct: number; count: number; full: boolean; at: string } | null; need: number };
  dialogs: { done: number; total: number; pct: number; need: number };
  readings: { done: number; total: number; pct: number; need: number };
  checks: { vocab: boolean; dialogs: boolean; readings: boolean };
  ready: boolean;
}
export interface VocabOverview {
  currentLevel: number;
  notebook: number;
  minCount: number;
  sets: { level: number; total: number; best: Readiness['vocab']['best'] }[];
  readiness: Readiness[];
}

function Row({ ok, label, value, need, hint }: { ok: boolean; label: string; value: string; need: string; hint?: string }) {
  return (
    <div className="row between" style={{ gap: 10, alignItems: 'flex-start' }}>
      <span aria-hidden="true" style={{ fontWeight: 800, color: ok ? 'var(--good)' : 'var(--muted)', width: 18 }}>
        {ok ? '✓' : '○'}
      </span>
      <span className="grow">
        <b style={{ fontSize: 14 }}>{label}</b>
        {hint ? (
          <small className="muted" style={{ display: 'block' }}>
            {hint}
          </small>
        ) : null}
      </span>
      <span style={{ textAlign: 'right' }}>
        <b style={{ color: ok ? 'var(--good)' : undefined }}>{value}</b>
        <small className="muted" style={{ display: 'block' }}>
          cần {need}
        </small>
      </span>
    </div>
  );
}

/** `data` truyền sẵn thì dùng luôn; không thì tự tải và lấy cấp hiện tại của người học (hoặc `level`). */
export default function ReadinessCard({ data, level, showTestLink }: { data?: Readiness | null; level?: number; showTestLink?: boolean }) {
  const [own, setOwn] = useState<Readiness | null>(null);
  const [beyond, setBeyond] = useState(false);
  useEffect(() => {
    if (data !== undefined) return;
    api<VocabOverview>('/vocab-test')
      .then((o) => {
        const lv = level ?? o.currentLevel;
        const r = o.readiness.find((x) => x.level === lv) ?? null;
        setBeyond(!r);
        setOwn(r);
      })
      .catch(() => {});
  }, [data, level]);
  const r = data ?? own;
  if (beyond && !r) {
    return (
      <section className="card stack">
        <b>Gợi ý trước khi thi</b>
        <p className="muted" style={{ fontSize: 13 }}>
          Bộ từ kiểm tra hiện có tới HSK 3. Từ HSK 4 trở lên chưa có số liệu gợi ý.
        </p>
      </section>
    );
  }
  if (!r) return null;
  const v = r.vocab.best;
  return (
    <section className="card stack" style={{ gap: 10 }}>
      <div className="row between">
        <b>Sẵn sàng thi lên HSK {r.level + 1}?</b>
        <span className="pill" style={r.ready ? { background: 'var(--goodbg)', color: 'var(--good)' } : undefined}>
          {r.ready ? 'Có vẻ sẵn sàng' : 'Chưa đủ gợi ý'}
        </span>
      </div>
      <Row
        ok={r.checks.vocab}
        label={`Kiểm tra bộ từ HSK ${r.level}`}
        value={v ? v.pct + '%' : 'chưa làm'}
        need={r.vocab.need + '%'}
        hint={v ? (v.full ? 'điểm cao nhất khi làm toàn bộ bộ từ' : `điểm cao nhất (bài ${v.count} câu; làm toàn bộ để chính xác hơn)`) : 'tối thiểu 20 câu'}
      />
      <Row ok={r.checks.dialogs} label={`Hội thoại HSK ${r.level} đã học`} value={`${r.dialogs.done}/${r.dialogs.total} · ${r.dialogs.pct}%`} need={r.dialogs.need + '%'} hint="trả lời hết câu hỏi của bài" />
      {r.readings.total ? (
        <Row ok={r.checks.readings} label={`Bài đọc HSK ${r.level} đã đọc`} value={`${r.readings.done}/${r.readings.total} · ${r.readings.pct}%`} need={r.readings.need + '%'} />
      ) : null}
      <p className="muted" style={{ fontSize: 12 }}>
        Chỉ để tham khảo: chưa đủ các mức trên bạn vẫn làm đề lên cấp được. Đạt đề HSK {r.level} khi đang ở đúng HSK {r.level} thì lên HSK {r.level + 1}.
      </p>
      {showTestLink ? (
        <Link className="btn sm" href="/so-tay/kiem-tra" style={{ textAlign: 'center' }}>
          Kiểm tra từ vựng
        </Link>
      ) : null}
    </section>
  );
}
