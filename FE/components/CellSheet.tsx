'use client';
// Bảng gợi ý của một ô từ khóa: mở tuần tự, mỗi gợi ý 1 lượt (rule.md mục 5.4).
import Link from 'next/link';
import { useState } from 'react';
import { api } from '@/lib/api';
import { useUi } from '@/lib/ui';
import { clueColor, hasClueColor } from '@/lib/clue';
import SaveWordButton from './SaveWordButton';
import type { Cell, HintResult } from '@/lib/types';

const NAMES = ['Gợi ý 1 — chủ đề từ vựng', 'Gợi ý 2 — bối cảnh, tình huống', 'Gợi ý 3 — câu hỏi có đáp án là từ khóa'];

export default function CellSheet({
  cell,
  tokens,
  onChange,
}: {
  cell: Cell;
  tokens: number;
  onChange: () => void;
}) {
  const { toast, closeSheet } = useUi();
  const [busy, setBusy] = useState(false);
  const [left, setLeft] = useState(tokens);
  const [local, setLocal] = useState<Cell>(cell);
  const [showVi, setShowVi] = useState(false); // bản dịch tiếng Việt: mặc định ẩn, bật bằng "Dịch gợi ý"

  const hints = [local.hint1, local.hint2, local.hint3];
  const opened = local.hintsOpened ?? 0;

  const openNext = async () => {
    setBusy(true);
    try {
      const r = await api<HintResult>('/event/slots/' + local.slotId + '/hint', { method: 'POST' });
      setLocal((c) => {
        const next = { ...c, hintsOpened: r.hintNo };
        if (r.hintNo === 1) next.hint1 = r.hint;
        if (r.hintNo === 2) {
          next.hint2 = r.hint;
          next.hint2Lesson = r.hint2Lesson;
        }
        if (r.hintNo === 3) next.hint3 = r.hint;
        return next;
      });
      if (typeof r.tokens === 'number') setLeft(r.tokens);
      onChange();
      toast('Đã mở gợi ý ' + r.hintNo + ' (−1 lượt)');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Không mở được gợi ý');
    } finally {
      setBusy(false);
    }
  };

  if (local.status === 'locked') {
    return (
      <>
        <h2>Ô {local.pos + 1}</h2>
        <div className="lockmsg">Mở vào ngày {local.unlockDay} của tháng.</div>
        <p className="muted" style={{ fontSize: 13 }}>
          Mỗi tuần mở dần: ngày 1 có 6 ô, ngày 2 thêm 3 ô, ngày 3 thêm 3 ô.
        </p>
      </>
    );
  }

  const color = hasClueColor(opened) ? clueColor(local.pos) : undefined;
  const solved = local.status === 'solved';
  const stripe = color ? { borderLeft: `6px solid ${color}` } : undefined;
  const chip = color ? (
    <span style={{ background: color, color: '#fff', borderRadius: 8, padding: '2px 8px', fontSize: 13, fontWeight: 800, marginRight: 8, verticalAlign: 'middle' }}>Ô {local.pos + 1}</span>
  ) : null;
  const lessonLink = local.hint2Lesson ? (
    <Link
      className="btn sm"
      href={'/hoc/nghe/' + local.hint2Lesson.id}
      onClick={closeSheet}
      style={{ marginTop: 8, textAlign: 'left', ...(color ? { background: color, borderColor: color, color: '#fff' } : {}) }}
    >
      Nghe bài: {local.hint2Lesson.title} (HSK {local.hint2Lesson.level}) ›
    </Link>
  ) : null;

  return (
    <>
      {solved ? (
        <>
          <div className="row between">
            <h2>
              {chip}{color ? '' : 'Ô ' + (local.pos + 1)} — đã giải
            </h2>
            <span className="pill">+{local.points} điểm</span>
          </div>
          <div className="card row" style={{ gap: 14, padding: '10px 14px' }}>
            <div className="han" style={{ fontSize: 34, lineHeight: 1.1 }}>
              {local.word?.zh}
            </div>
            <div className="grow">
              <div className="py">{local.word?.pinyin}</div>
              <b>{local.word?.vi}</b>
            </div>
          </div>
          {local.word ? <SaveWordButton zh={local.word.zh} lessonId={local.hint2Lesson?.id} /> : null}
          <b style={{ fontSize: 14 }}>Các gợi ý bạn đã mở ({opened + 1}/4, gồm gợi ý chung)</b>
        </>
      ) : (
        <div className="row between">
          <h2>
            {chip}{color ? '' : 'Ô ' + (local.pos + 1)}
          </h2>
          <span className="pill">{left} lượt · đã mở {opened}/3</span>
        </div>
      )}

      <div className="keyc" style={stripe}>
        <b>Gợi ý chung</b>
        <p className="han" style={{ fontSize: 17 }}>
          {local.hintGeneral?.zh}
        </p>
        {showVi ? <small className="muted">{local.hintGeneral?.vi}</small> : null}
      </div>

      {NAMES.map((name, i) => {
        const h = hints[i];
        if (opened > i && h) {
          return (
            <div className="keyc ok" key={i} style={stripe}>
              <b>{name}</b>
              <p className="han" style={{ fontSize: 17 }}>
                {h.zh}
              </p>
              {showVi ? <small className="muted">{h.vi}</small> : null}
              {i === 1 ? lessonLink : null}
            </div>
          );
        }
        if (solved) return null;
        if (opened === i) {
          return (
            <button className="keyc" key={i} disabled={busy || left < 1} onClick={openNext} style={{ textAlign: 'left' }}>
              <b>{name}</b>
              <p className="muted">{left < 1 ? 'Không đủ lượt gợi ý' : 'Mở — tốn 1 lượt'}</p>
            </button>
          );
        }
        return (
          <div className="keyc" key={i} style={{ opacity: 0.5 }}>
            <b>{name}</b>
            <p className="muted">Phải mở gợi ý trước đã</p>
          </div>
        );
      })}

      <div className="row between">
        <span className="sw">
          <button className={showVi ? 'on' : ''} role="switch" aria-checked={showVi} aria-label="Dịch gợi ý" onClick={() => setShowVi(!showVi)} />
          Dịch gợi ý
        </span>
        {solved ? null : (
          <span className="scorehint">
            {opened <= 1 ? '230' : opened === 2 ? '200' : '150'} điểm nếu đoán đúng bây giờ
          </span>
        )}
      </div>

      {solved ? null : (
        <p className="muted" style={{ fontSize: 12 }}>
          {opened === 0
            ? 'Phải mở gợi ý 1 của ô này mới đoán được ô này.'
            : opened >= 2
              ? 'Màu của ô này cũng đánh dấu bài được chỉ ở gợi ý 2 trong danh sách bài. Nghe bài rồi bấm "Nhập từ khóa" ở cuối bài để đoán.'
              : 'Học một bài hội thoại rồi bấm "Nhập từ khóa" ở cuối bài để đoán.'}
        </p>
      )}
    </>
  );
}
