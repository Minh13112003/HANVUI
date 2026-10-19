'use client';
// Nội dung bảng trượt khi chạm một từ: nghĩa, cách đọc (nghe thường/chậm, pinyin tô màu theo thanh điệu),
// cách viết từng nét và nút lưu vào Sổ tay.
import { useState } from 'react';
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
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await api('/notebook', {
        method: 'POST',
        body: { zh: word.zh, pinyin: word.pinyin, vi: word.vi, isPhrase: word.isPhrase, lessonId },
      });
      setSaved(true);
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
          {word.pinyin ? <Pinyin text={word.pinyin} /> : null}
        </div>
        <div className="col2">
          <button className="icon-btn" aria-label="Nghe" onClick={() => play(word.zh, null, {})}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 9v6h3l5 4V5L7 9H4zM16 8.5a4 4 0 0 1 0 7" />
            </svg>
          </button>
          <button className="icon-btn" aria-label="Nghe chậm" onClick={() => play(word.zh, null, { slow: true })}>
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
        {word.vi ? <b>{word.vi}</b> : <span className="muted">AI sẽ điền nghĩa</span>}
        {word.pos ? <span className="pos">{word.pos}</span> : null}
        <span className="pill">{hskLabel(word.hsk2, word.hsk3)}</span>
      </div>

      {word.example ? (
        <div className="note">
          <div className="han" style={{ fontSize: 20 }}>
            {word.example.zh}
          </div>
          <div className="py">{word.example.pinyin}</div>
          <div>{word.example.vi}</div>
          <button className="btn sm" style={{ marginTop: 8 }} onClick={() => play(word.example!.zh, null, {})}>
            Nghe câu ví dụ
          </button>
        </div>
      ) : null}

      <Stroke word={word.zh} />

      <div className="row" style={{ gap: 8 }}>
        <button className="btn primary grow" disabled={saving || saved} onClick={save}>
          {saved ? 'Đã lưu vào Sổ tay' : 'Lưu vào Sổ tay'}
        </button>
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
