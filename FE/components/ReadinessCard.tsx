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

function Row({ ok, label, pct, value, need }: { ok: boolean; label: string; pct: number; value: string; need: string }) {
  return (
    <div className="rd-row">
      <div className="row between">
        <span className="rd-l">{label}</span>
        <b className={'rd-v' + (ok ? ' ok' : '')}>{value}</b>
      </div>
      <div className="rd-bar" title={'cần ' + need}>
        <i style={{ width: Math.min(pct, 100) + '%' }} className={ok ? 'ok' : ''} />
        <u style={{ left: need }} aria-hidden="true" />
      </div>
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
    <section className="card rd-card">
      <div className="row between" style={{ gap: 8 }}>
        <b className="rd-t">Mức sẵn sàng</b>
        <span className={'pill rd-pill' + (r.ready ? ' ok' : '')}>
          HSK {r.level} → {r.level + 1}
        </span>
      </div>
      <Row ok={r.checks.vocab} label="Từ vựng" pct={v ? v.pct : 0} value={v ? v.pct + '%' : 'chưa làm'} need={r.vocab.need + '%'} />
      <Row ok={r.checks.dialogs} label="Hội thoại" pct={r.dialogs.pct} value={r.dialogs.pct + '%'} need={r.dialogs.need + '%'} />
      {r.readings.total ? <Row ok={r.checks.readings} label="Bài đọc" pct={r.readings.pct} value={r.readings.pct + '%'} need={r.readings.need + '%'} /> : null}
      {showTestLink ? (
        <Link className="btn sm" href="/so-tay/kiem-tra" style={{ textAlign: 'center' }}>
          Kiểm tra từ vựng
        </Link>
      ) : null}
    </section>
  );
}
