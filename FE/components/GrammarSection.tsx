'use client';
// Mục Ngữ pháp trong kỹ năng Viết (rule.md 3.5): danh sách điểm ngữ pháp theo cấp HSK, mỗi điểm có công thức,
// giải thích, so sánh, lỗi hay gặp, ví dụ có pinyin và nghe, rồi bài luyện tự chấm. Điểm cấp cao hơn cấp người học bị khóa.
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { play } from '@/lib/audio';
import type { GrammarDetail, GrammarList, GrammarListItem } from '@/lib/types';
import GrammarDiagram from './GrammarDiagram';
import TranslatePractice from './TranslatePractice';
import { Pinyin } from './WordSheet';
import WritePractice from './WritePractice';

/** Độ phù hợp của một điểm ngữ pháp với cấp người học. */
const FIT: Record<GrammarListItem['fit'], string> = {
  review: 'Ôn lại',
  match: 'Đúng cấp của bạn',
  next: 'Cấp kế',
  far: 'Còn xa',
};

const HAN = /[一-鿿]+/g;

/** Tô sáng các chữ Hán của công thức (từ ngữ pháp chính) trong một chuỗi. */
function Hl({ text, keys }: { text: string; keys: string[] }) {
  if (!keys.length) return <>{text}</>;
  const re = new RegExp('(' + keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'g');
  return (
    <>
      {text.split(re).map((s, i) =>
        keys.includes(s) ? (
          <mark className="gx-hl" key={i}>
            {s}
          </mark>
        ) : (
          <Fragment key={i}>{s}</Fragment>
        ),
      )}
    </>
  );
}

/** Tách "✗ sai → ✓ đúng" thành từng dòng đỏ/xanh; không có dấu thì giữ nguyên một dòng. */
function Mistakes({ text }: { text: string }) {
  const parts = text.split(/\s*(?=[✗✓])/).filter(Boolean);
  return (
    <div className="stack" style={{ gap: 6 }}>
      {parts.map((s, i) => {
        const bad = s.startsWith('✗');
        const good = s.startsWith('✓');
        const body = s.replace(/^[✗✓]\s*/, '').replace(/→\s*$/, '').trim();
        return (
          <div key={i} className={'gx-row' + (bad ? ' gx-bad' : good ? ' gx-good' : '')}>
            <b aria-label={bad ? 'Sai' : good ? 'Đúng' : undefined}>{bad ? '✗' : good ? '✓' : '•'}</b>
            <span className="han">{body}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function GrammarSection() {
  const [showAll, setShowAll] = useState(false);
  const [cat, setCat] = useState('');
  const [list, setList] = useState<GrammarList | null>(null);
  const [open, setOpen] = useState('');
  const [detail, setDetail] = useState<GrammarDetail | null>(null);
  const [practice, setPractice] = useState(false);
  const [err, setErr] = useState('');

  const loadList = useCallback(() => {
    api<GrammarList>('/grammar')
      .then(setList)
      .catch(() => setErr('Không tải được danh sách ngữ pháp'));
  }, []);
  useEffect(loadList, [loadList]);

  const openPoint = async (slug: string) => {
    setErr('');
    setDetail(null);
    setPractice(false);
    setOpen(slug);
    try {
      setDetail(await api<GrammarDetail>('/grammar/' + slug));
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Không mở được');
    }
  };

  const back = () => {
    setOpen('');
    setDetail(null);
    setPractice(false);
    loadList();
  };

  const visible = useMemo(
    () => (list?.points ?? []).filter((p) => (showAll || p.level <= list!.level) && (!cat || p.category === cat)),
    [list, showAll, cat],
  );
  const cats = useMemo(() => {
    const s = new Set<string>();
    for (const p of list?.points ?? []) if (showAll || p.level <= list!.level) s.add(p.category);
    return [...s];
  }, [list, showAll]);
  const groups = useMemo(() => {
    const m = new Map<number, GrammarListItem[]>();
    for (const p of visible) m.set(p.level, [...(m.get(p.level) ?? []), p]);
    return [...m.entries()].sort((a, b) => a[0] - b[0]);
  }, [visible]);

  if (err && !open) return <div className="alert">{err}</div>;
  if (!list) return <p className="muted">Đang tải…</p>;

  if (open) {
    const keys = detail ? [...new Set(detail.pattern.match(HAN) ?? [])].sort((a, b) => b.length - a.length) : [];
    return (
      <div className="stack">
        <button className="btn sm" onClick={back}>
          ‹ Danh sách ngữ pháp
        </button>
        {err ? <div className="alert">{err}</div> : null}
        {!detail && !err ? <p className="muted">Đang tải…</p> : null}
        {detail ? (
          <>
            <div className="card stack gx-hero" data-lv={detail.level}>
              <div className="row between">
                <span className="pill">HSK {detail.level}</span>
                <span className="tag">{detail.category}</span>
              </div>
              <h2>{detail.title}</h2>
              <small className="muted">Công thức</small>
              <div className="gx-formula han">
                <Hl text={detail.pattern} keys={keys} />
              </div>
              {detail.visual?.rows.length ? <GrammarDiagram rows={detail.visual.rows} /> : null}
            </div>

            <div className="card stack">
              <h3 className="gx-h">📘 Cách dùng</h3>
              <p>{detail.explain}</p>
              <h3 className="gx-h">🔁 So sánh</h3>
              <p className="muted">{detail.compare}</p>
            </div>

            <div className="card stack">
              <h3 className="gx-h">⚠️ Lỗi hay gặp</h3>
              <Mistakes text={detail.mistake} />
            </div>

            <div className="card stack">
              <h3 className="gx-h">💬 Ví dụ</h3>
              {detail.examples.map((e, i) => (
                <div className="sent gx-ex" key={i}>
                  <div className="row between" style={{ gap: 10 }}>
                    {detail.visual?.icons[i] ? (
                      <span aria-hidden="true" style={{ fontSize: 34, lineHeight: 1, alignSelf: 'center' }}>
                        {detail.visual.icons[i]}
                      </span>
                    ) : null}
                    <div className="grow">
                      <div className="han" style={{ fontSize: 22 }}>
                        <Hl text={e.zh} keys={keys} />
                      </div>
                      <Pinyin text={e.pinyin} />
                      <div className="muted">{e.vi}</div>
                    </div>
                    <button className="icon-btn" aria-label="Nghe câu ví dụ" onClick={() => play(e.zh, null, {})}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M4 9v6h3l5 4V5L7 9H4zM16 8.5a4 4 0 0 1 0 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {practice ? (
              <WritePractice items={detail.practice} onFinish={back} />
            ) : (
              <button className="btn primary" onClick={() => setPractice(true)}>
                ✍️ Luyện tập ({detail.practice.length} câu: sắp xếp · điền · chọn · tìm câu sai)
              </button>
            )}

            <TranslatePractice slug={detail.slug} />
          </>
        ) : null}
      </div>
    );
  }

  const here = list.levels.find((l) => l.level === list.level);
  const rec = list.points.filter((p) => p.recommended);

  const card = (p: GrammarListItem) =>
    p.locked ? (
      <div key={p.slug} className="lcard gx-card" data-fit={p.fit} style={{ opacity: 0.6 }} aria-disabled="true">
        <span className="lg2 han">🔒</span>
        <span className="grow">
          <b>{p.title}</b>
          <small className="lsub muted">mở khi lên HSK {p.level}</small>
        </span>
        <span className="gx-fit" data-fit={p.fit}>
          {FIT[p.fit]}
        </span>
      </div>
    ) : (
      <button key={p.slug} className="lcard gx-card" data-lv={p.level} data-fit={p.fit} style={{ textAlign: 'left', width: '100%' }} onClick={() => openPoint(p.slug)}>
        <span className="lg2 han">{p.mastered ? '✓' : (p.icon ?? '语')}</span>
        <span className="grow">
          <b>{p.title}</b>
          <small className="lsub muted han">{p.pattern}</small>
          <span className="bar" aria-hidden="true" style={{ marginTop: 6 }}>
            <i style={{ width: `${p.practice.total ? (100 * p.practice.correct) / p.practice.total : 0}%` }} />
          </span>
        </span>
        <span className="lr">
          <span className="gx-fit" data-fit={p.fit}>
            {p.mastered ? 'Đã thuộc' : FIT[p.fit]}
          </span>
          <small className="muted">
            {p.practice.correct}/{p.practice.total}
          </small>
        </span>
      </button>
    );

  return (
    <div className="stack">
      <div className="card stack gx-hero">
        <div className="row between">
          <b>Ngữ pháp HSK {list.level}</b>
          <span className="pill">
            {here?.mastered ?? 0}/{here?.total ?? 0} đã thuộc
          </span>
        </div>
        <div className="bar" aria-hidden="true">
          <i style={{ width: `${here?.total ? (100 * here.mastered) / here.total : 0}%` }} />
        </div>
        <small className="muted">
          {list.readyForExam
            ? 'Bạn đã thuộc hết ngữ pháp của cấp này. Có thể thi đề lên cấp.'
            : 'Mỗi điểm: công thức, cách dùng, ví dụ rồi luyện 5 dạng bài. "Đã thuộc" là làm đúng hết bài luyện.'}
        </small>
      </div>

      {rec.length ? (
        <section className="stack" style={{ gap: 6 }}>
          <h2>⭐ Nên học tiếp</h2>
          {rec.map(card)}
        </section>
      ) : null}

      <div className="seg">
        <button className={!showAll ? 'on' : ''} onClick={() => { setShowAll(false); setCat(''); }}>
          Phù hợp với tôi
        </button>
        <button className={showAll ? 'on' : ''} onClick={() => { setShowAll(true); setCat(''); }}>
          Tất cả cấp
        </button>
      </div>

      <div className="chips" role="group" aria-label="Lọc theo nhóm">
        <button className={'chip' + (!cat ? ' on' : '')} onClick={() => setCat('')}>
          Tất cả
        </button>
        {cats.map((c) => (
          <button key={c} className={'chip' + (cat === c ? ' on' : '')} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>

      {groups.map(([level, pts]) => (
        <section className="stack" key={level} style={{ gap: 6 }}>
          <div className="row between">
            <h2>HSK {level}</h2>
            <span className="tag">{level < list.level ? 'Ôn lại' : level === list.level ? 'Cấp của bạn' : level === list.level + 1 ? 'Cấp kế' : 'Còn xa'}</span>
          </div>
          {pts.map(card)}
        </section>
      ))}
      {!groups.length ? <p className="muted">Không có điểm ngữ pháp nào trong nhóm này.</p> : null}
    </div>
  );
}
