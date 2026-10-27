'use client';
// Phần giúp NHỚ CHỮ và NGHĨA trong bảng từ (đánh vào điểm yếu "đọc được mà không nhớ mặt chữ, không nắm nghĩa"):
// • Nhớ chữ: tách từng chữ thành bộ phận (bộ chỉ nghĩa / bộ chỉ âm) + câu chuyện nhớ.
// • Cụm từ: mẫu cụm từ hay đi kèm + câu ví dụ có pinyin, nghĩa, nút nghe.
// • Phân biệt: các nhóm từ dễ nhầm có chứa từ này (会/能/可以…).
import { useState } from 'react';
import { play } from '@/lib/audio';
import { Pinyin } from './WordSheet';

export interface CharPart {
  ch: string;
  pinyin: string;
  vi: string | null;
  role: 'semantic' | 'phonetic' | null;
}
export interface CharInfo {
  ch: string;
  pinyin: string;
  vi: string | null;
  kind: string | null;
  parts: CharPart[];
}
export interface Insight {
  mnemonic: string | null;
  colloc: { p: string; ex: { zh: string; pinyin: string; vi: string }[] }[] | null;
  chars: CharInfo[];
  compare: { slug: string; title: string; words: string[]; explain: string; uses: { zh: string; when: string; ex: string; exVi: string; exPinyin: string }[]; trap: { wrong: string; right: string; why: string } | null }[];
}

const KIND: Record<string, string> = {
  pictographic: 'chữ tượng hình (vẽ lại sự vật)',
  ideographic: 'chữ hội ý (ghép ý các bộ phận)',
  pictophonetic: 'chữ hình thanh (một phần chỉ nghĩa, một phần chỉ âm)',
};

function Speak({ text }: { text: string }) {
  return (
    <button className="icon-btn" aria-label="Nghe" onClick={() => play(text, null, {})} style={{ width: 32, height: 32 }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M4 9v6h3l5 4V5L7 9H4zM16 8.5a4 4 0 0 1 0 7" />
      </svg>
    </button>
  );
}

export default function WordInsight({ data }: { data: Insight }) {
  const tabs = [
    { k: 'nho', label: 'Nhớ chữ', show: data.chars.some((c) => c.parts.length) || !!data.mnemonic },
    { k: 'cum', label: 'Cụm từ & ví dụ', show: !!data.colloc?.length },
    { k: 'pb', label: 'Phân biệt', show: data.compare.length > 0 },
  ].filter((t) => t.show);
  const [tab, setTab] = useState(tabs[0]?.k ?? '');
  if (!tabs.length) return null;

  return (
    <div className="stack" style={{ gap: 10 }}>
      <div className="seg" role="tablist" aria-label="Tìm hiểu từ">
        {tabs.map((t) => (
          <button key={t.k} role="tab" aria-selected={tab === t.k} className={tab === t.k ? 'on' : ''} onClick={() => setTab(t.k)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'nho' ? (
        <div className="stack" style={{ gap: 10 }}>
          {data.mnemonic ? (
            <div className="note">
              <b>💡 Cách nhớ</b>
              <p style={{ marginTop: 4 }}>{data.mnemonic}</p>
            </div>
          ) : null}
          {data.chars
            .filter((c) => c.parts.length)
            .map((c) => (
              <div key={c.ch} className="keyc" style={{ display: 'grid', gap: 6 }}>
                <div className="row" style={{ gap: 10 }}>
                  <span className="han" style={{ fontSize: 34, lineHeight: 1 }}>
                    {c.ch}
                  </span>
                  <span className="grow">
                    <span className="py">{c.pinyin}</span>
                    {c.vi ? <b style={{ display: 'block' }}>{c.vi}</b> : null}
                    {c.kind ? <small className="muted">{KIND[c.kind] ?? ''}</small> : null}
                  </span>
                </div>
                <div className="row" style={{ gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span className="han" style={{ fontSize: 18 }}>
                    {c.ch} =
                  </span>
                  {c.parts.map((p, i) => (
                    <span key={i} className="row" style={{ gap: 6, alignItems: 'center' }}>
                      {i ? <b className="muted">+</b> : null}
                      <span
                        style={{
                          border: `2px solid ${p.role === 'semantic' ? '#1f9d6b' : p.role === 'phonetic' ? '#2f6fe0' : 'var(--line)'}`,
                          borderRadius: 10,
                          padding: '2px 8px',
                          textAlign: 'center',
                        }}
                      >
                        <span className="han" style={{ fontSize: 20 }}>
                          {p.ch}
                        </span>
                        <small style={{ display: 'block' }}>
                          {p.vi ?? p.pinyin}
                          {p.role === 'semantic' ? ' · chỉ nghĩa' : p.role === 'phonetic' ? ` · chỉ âm ${p.pinyin}` : ''}
                        </small>
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          <small className="muted" style={{ fontSize: 11 }}>
            Viền xanh lá: bộ phận gợi NGHĨA · viền xanh dương: bộ phận gợi CÁCH ĐỌC. Dữ liệu tách chữ: Make Me a Hanzi (LGPL);
            câu chuyện nhớ do AI soạn, chưa qua duyệt.
          </small>
        </div>
      ) : null}

      {tab === 'cum' && data.colloc ? (
        <div className="stack" style={{ gap: 10 }}>
          {data.colloc.map((c, i) => (
            <div key={i} className="stack" style={{ gap: 8 }}>
              <div className="gx-formula han" style={{ fontSize: 16 }}>
                ① {c.p}
              </div>
              {c.ex.map((e, k) => (
                <div key={k} className="row between" style={{ gap: 8 }}>
                  <div className="grow">
                    <div className="han" style={{ fontSize: 18 }}>
                      {e.zh}
                    </div>
                    <Pinyin text={e.pinyin} />
                    <div className="muted">{e.vi}</div>
                  </div>
                  <Speak text={e.zh} />
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : null}

      {tab === 'pb' ? (
        <div className="stack" style={{ gap: 12 }}>
          {data.compare.map((g) => (
            <div key={g.slug} className="keyc" style={{ display: 'grid', gap: 8 }}>
              <b>{g.title}</b>
              <small className="muted">{g.explain}</small>
              {g.uses.map((u) => (
                <div key={u.zh} style={{ display: 'grid', gap: 2 }}>
                  <span>
                    <b className="han" style={{ fontSize: 18 }}>
                      {u.zh}
                    </b>{' '}
                    — {u.when}
                  </span>
                  <span className="row" style={{ gap: 6 }}>
                    <span className="han">{u.ex}</span>
                    <small className="muted">{u.exVi}</small>
                    <Speak text={u.ex} />
                  </span>
                </div>
              ))}
              {g.trap ? (
                <div className="stack" style={{ gap: 4 }}>
                  <div className="gx-row gx-bad">
                    <b>✗</b>
                    <span className="han">{g.trap.wrong}</span>
                  </div>
                  <div className="gx-row gx-good">
                    <b>✓</b>
                    <span className="han">{g.trap.right}</span>
                  </div>
                  <small className="muted">{g.trap.why}</small>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
