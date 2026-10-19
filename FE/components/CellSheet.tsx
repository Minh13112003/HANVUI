'use client';
// Bảng gợi ý của một ô từ khóa: mở tuần tự, mỗi gợi ý 1 lượt (rule.md mục 5.4).
import { useState } from 'react';
import { api } from '@/lib/api';
import { useUi } from '@/lib/ui';
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
  const { toast } = useUi();
  const [busy, setBusy] = useState(false);
  const [local, setLocal] = useState<Cell>(cell);
  const [viOnly, setViOnly] = useState(false);

  const hints = [local.hint1, local.hint2, local.hint3];
  const opened = local.hintsOpened ?? 0;

  const openNext = async () => {
    setBusy(true);
    try {
      const r = await api<HintResult>('/event/slots/' + local.slotId + '/hint', { method: 'POST' });
      setLocal((c) => {
        const next = { ...c, hintsOpened: r.hintNo };
        if (r.hintNo === 1) next.hint1 = r.hint;
        if (r.hintNo === 2) next.hint2 = r.hint;
        if (r.hintNo === 3) next.hint3 = r.hint;
        return next;
      });
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

  if (local.status === 'solved') {
    return (
      <>
        <div className="row between">
          <h2>Ô {local.pos + 1} — đã giải</h2>
          <span className="pill">+{local.points} điểm</span>
        </div>
        <div className="card center stack">
          <div className="han" style={{ fontSize: 40 }}>
            {local.word?.zh}
          </div>
          <div className="py">{local.word?.pinyin}</div>
          <b>{local.word?.vi}</b>
        </div>
        <p className="muted" style={{ fontSize: 13 }}>
          Từ khóa đã tự vào Sổ tay của bạn.
        </p>
      </>
    );
  }

  return (
    <>
      <div className="row between">
        <h2>Ô {local.pos + 1}</h2>
        <span className="pill">{tokens} lượt · đã mở {opened}/3</span>
      </div>

      <div className="keyc">
        <b>Gợi ý chung</b>
        <p>{viOnly ? local.hintGeneral?.vi : local.hintGeneral?.zh}</p>
        {!viOnly ? <small className="muted">{local.hintGeneral?.vi}</small> : null}
      </div>

      {NAMES.map((name, i) => {
        const h = hints[i];
        if (opened > i && h) {
          return (
            <div className="keyc ok" key={i}>
              <b>{name}</b>
              <p className="han" style={{ fontSize: 17 }}>
                {viOnly ? h.vi : h.zh}
              </p>
              {!viOnly ? <small className="muted">{h.vi}</small> : null}
            </div>
          );
        }
        if (opened === i) {
          return (
            <button className="keyc" key={i} disabled={busy || tokens < 1} onClick={openNext} style={{ textAlign: 'left' }}>
              <b>{name}</b>
              <p className="muted">{tokens < 1 ? 'Không đủ lượt gợi ý' : 'Mở — tốn 1 lượt'}</p>
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
          <button className={viOnly ? 'on' : ''} role="switch" aria-checked={viOnly} aria-label="Dịch gợi ý" onClick={() => setViOnly(!viOnly)} />
          Dịch gợi ý
        </span>
        <span className="scorehint">
          {opened <= 1 ? '230' : opened === 2 ? '200' : '150'} điểm nếu đoán đúng bây giờ
        </span>
      </div>

      <p className="muted" style={{ fontSize: 12 }}>
        {opened === 0
          ? 'Phải mở gợi ý 1 của ô này mới đoán được ô này.'
          : 'Học một bài hội thoại rồi bấm "Nhập từ khóa" ở cuối bài để đoán.'}
      </p>
    </>
  );
}
