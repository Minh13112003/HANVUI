'use client';
// Sổ từ cốt lõi của một chủ đề: 3 cột chữ Hán, pinyin, nghĩa; lưu từng từ hoặc lưu hết. Chi tiết của từ xem trong Sổ tay.
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useUi } from '@/lib/ui';

interface CoreWord {
  id: number;
  zh: string;
  pinyin: string;
  vi: string;
  saved: boolean;
}
interface CoreDetail {
  id: string;
  name: string;
  intro: string;
  words: CoreWord[];
}

export default function CoreTopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const { toast } = useUi();
  const [data, setData] = useState<CoreDetail | null>(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    api<CoreDetail>('/core-topics/' + id)
      .then(setData)
      .catch((e) => setErr(e instanceof Error ? e.message : 'Không tải được chủ đề'));
  }, [user, id]);

  const save = async (wordIds?: number[]) => {
    setBusy(true);
    try {
      const r = await api<{ added: number }>('/core-topics/' + id + '/save', { method: 'POST', body: wordIds ? { wordIds } : {} });
      setData((d) => d && { ...d, words: d.words.map((w) => (!wordIds || wordIds.includes(w.id) ? { ...w, saved: true } : w)) });
      if (!wordIds) toast('Đã lưu thêm ' + r.added + ' từ vào Sổ tay');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Không lưu được');
    } finally {
      setBusy(false);
    }
  };

  const left = data?.words.filter((w) => !w.saved).length ?? 0;

  return (
    <Shell title={data?.name ?? 'Chủ đề'}>
      <div className="stack">
        {err ? <div className="alert">{err}</div> : null}
        {!data && !err ? <p className="muted">Đang tải…</p> : null}
        {data ? (
          <>
            <div>
              <h1>{data.name}</h1>
              <p className="muted" style={{ fontSize: 13 }}>
                {data.intro}
              </p>
            </div>
            <button className="btn primary" disabled={busy || !left} onClick={() => save()}>
              {left ? `Lưu hết ${left} từ vào Sổ tay` : 'Đã lưu hết vào Sổ tay'}
            </button>
            <div className="card core-table">
              <div className="core-row head">
                <span>Tiếng Trung</span>
                <span>Pinyin</span>
                <span>Nghĩa</span>
                <span />
              </div>
              {data.words.map((w) => (
                <div className="core-row" key={w.id}>
                  <b className="han">{w.zh}</b>
                  <span className="py">{w.pinyin}</span>
                  <span>{w.vi}</span>
                  <button className="core-save" disabled={busy || w.saved} aria-label={(w.saved ? 'Đã lưu ' : 'Lưu ') + w.zh} onClick={() => save([w.id])}>
                    {w.saved ? '✓' : '+'}
                  </button>
                </div>
              ))}
            </div>
            <Link href="/so-tay" className="card row between">
              <span>
                <b>Mở Sổ tay</b>
                <small className="muted" style={{ display: 'block' }}>
                  Từ đã lưu có cách viết, phát âm, từ đồng nghĩa, ví dụ và ngữ cảnh dùng
                </small>
              </span>
              <span className="chev">›</span>
            </Link>
          </>
        ) : null}
      </div>
    </Shell>
  );
}
