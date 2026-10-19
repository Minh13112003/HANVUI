'use client';
// Nội dung bảng trượt khi chạm một từ: nghĩa, cách đọc (nghe thường/chậm, pinyin tô màu theo thanh điệu),
// cách viết từng nét và nút lưu vào Sổ tay.
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { play, stopAll } from '@/lib/audio';
import { hskLabel, pinyinChunks, toneOf } from '@/lib/text';
import { useUi } from '@/lib/ui';
import Stroke from './Stroke';

export interface WordLike {
  zh: string;
  pinyin?: string;
  vi?: string;
  pos?: string | null;
  example?: { zh: string; pinyin: string; vi: string } | null;
  hsk2?: number | null;
  hsk3?: number | null;
  isPhrase?: boolean;
}

/** Pinyin tô màu theo thanh điệu (1 đỏ, 2 cam, 3 xanh lá, 4 xanh dương). */
export function Pinyin({ text }: { text: string }) {
  return (
    <span className="pyl">
      {pinyinChunks(text).map((s, i) => (
        <span key={i} className={'tn tone' + (toneOf(s) || '')}>
          {s}{' '}
        </span>
      ))}
    </span>
  );
}

export default function WordSheet({ word, lessonId }: { word: WordLike; lessonId?: string }) {
  const { toast, closeSheet } = useUi();
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<number | null>(null);
  const [audioKey, setAudioKey] = useState<string | null>(null);
  const [info, setInfo] = useState<{ pinyin: string | null; vi: string | null; pos: string | null; hsk2: number | null; hsk3: number | null; example: WordLike['example'] } | null>(null);

  // Tra từ để biết đã lưu vào Sổ tay chưa (hiện nút Lưu hay Bỏ), có file âm thanh riêng và bổ sung nghĩa/ví dụ còn thiếu.
  useEffect(() => {
    let alive = true;
    api<{ savedId: number | null; audioKey: string | null; pinyin: string | null; vi: string | null; pos: string | null; hsk2: number | null; hsk3: number | null; example: WordLike['example'] }>(
      '/words/lookup?zh=' + encodeURIComponent(word.zh),
    )
      .then((r) => {
        if (!alive) return;
        setSavedId(r.savedId);
        setAudioKey(r.audioKey);
        setInfo(r);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [word.zh]);

  const shown = { ...word, pinyin: word.pinyin ?? info?.pinyin ?? undefined, vi: word.vi || info?.vi || undefined, pos: word.pos ?? info?.pos, hsk2: word.hsk2 ?? info?.hsk2, hsk3: word.hsk3 ?? info?.hsk3, example: word.example ?? info?.example };

  const unsave = async () => {
    if (savedId == null) return;
    setSaving(true);
    try {
      await api('/notebook/' + savedId, { method: 'DELETE' });
      setSavedId(null);
      toast('Đã bỏ "' + word.zh + '" khỏi Sổ tay');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Không bỏ được');
    } finally {
      setSaving(false);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      const row = await api<{ id: number }>('/notebook', {
        method: 'POST',
        body: { zh: word.zh, pinyin: word.pinyin, vi: word.vi, isPhrase: word.isPhrase, lessonId },
      });
      setSavedId(row.id);
      toast('Đã lưu "' + word.zh + '" vào Sổ tay');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Không lưu được');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="row between">
        <div className="grow">
          <div className="han" style={{ fontSize: 40, lineHeight: 1.1 }}>
            {word.zh}
          </div>
          {shown.pinyin ? <Pinyin text={shown.pinyin} /> : null}
        </div>
        <div className="col2">
          <button className="icon-btn" aria-label="Nghe" onClick={() => play(word.zh, audioKey, {})}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 9v6h3l5 4V5L7 9H4zM16 8.5a4 4 0 0 1 0 7" />
            </svg>
          </button>
          <button className="icon-btn" aria-label="Nghe chậm" onClick={() => play(word.zh, audioKey, { slow: true })}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 9v6h3l5 4V5L7 9H4z" />
              <text x="16" y="16" fontSize="9" fill="currentColor" stroke="none">
                ½
              </text>
            </svg>
          </button>
        </div>
      </div>

      <div className="row wrap" style={{ gap: 6 }}>
        {shown.vi ? <b>{shown.vi}</b> : <span className="muted">AI sẽ điền nghĩa</span>}
        {shown.pos ? <span className="pos">{shown.pos}</span> : null}
        <span className="pill">{hskLabel(shown.hsk2, shown.hsk3)}</span>
      </div>

      {shown.example ? (
        <div className="note">
          <div className="han" style={{ fontSize: 20 }}>
            {shown.example.zh}
          </div>
          <div className="py">{shown.example.pinyin}</div>
          <div>{shown.example.vi}</div>
          <button className="btn sm" style={{ marginTop: 8 }} onClick={() => play(shown.example!.zh, null, {})}>
            Nghe câu ví dụ
          </button>
        </div>
      ) : null}

      <Stroke word={word.zh} />

      <div className="row" style={{ gap: 8 }}>
        {savedId != null ? (
          <button className="btn grow" disabled={saving} onClick={unsave} style={{ color: 'var(--bad)' }}>
            Bỏ khỏi Sổ tay
          </button>
        ) : (
          <button className="btn primary grow" disabled={saving} onClick={save}>
            Lưu vào Sổ tay
          </button>
        )}
        <button
          className="btn"
          onClick={() => {
            stopAll();
            closeSheet();
          }}
        >
          Đóng
        </button>
      </div>
    </>
  );
}
