'use client';
// Câu hỏi của một bài (Nghe, Đọc). Làm lần đầu: chọn hết rồi nộp. Bài đã hoàn thành: mở lại là ôn tập (rule.md mục 3.2),
// đáp án làm mờ ngay dưới câu hỏi, bấm mới mở; chọn xong câu nào thì câu đó tự mở; làm hết thì lưu đè kết quả cũ.
import { useState } from 'react';
import { useUi } from '@/lib/ui';
import type { AnswerResult, Question } from '@/lib/types';
import RevealBlur from './RevealBlur';

interface Props {
  questions: Question[];
  review: boolean;
  title: string;
  submitLabel: string;
  submit: (answers: number[]) => Promise<AnswerResult>;
}

export default function LessonQuiz({ questions, review, title, submitLabel, submit }: Props) {
  const { toast } = useUi();
  const [picks, setPicks] = useState<number[]>(() => new Array(questions.length).fill(-1));
  const [peek, setPeek] = useState<number[]>([]);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [busy, setBusy] = useState(false);

  const send = async (answers: number[]) => {
    setBusy(true);
    try {
      setResult(await submit(answers));
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Không lưu được kết quả');
    } finally {
      setBusy(false);
    }
  };

  const pick = (qi: number, oi: number) => {
    const next = picks.map((p, i) => (i === qi ? oi : p));
    setPicks(next);
    if (review && next.every((p) => p >= 0)) void send(next);
  };

  const label = (q: Question, oi: number | null | undefined) => {
    if (oi == null || !q.options[oi]) return null;
    const vi = q.optionsVi?.[oi];
    return (
      <>
        <span className="han">{q.options[oi]}</span>
        {vi ? ` (${vi})` : ''}
      </>
    );
  };

  const count = picks.filter((p) => p >= 0).length;
  const allPicked = count === questions.length;

  return (
    <div className="card stack">
      <div className="row between">
        <h2>{title}</h2>
        <span className="pill">{result ? 'Đã trả lời' : (review ? 'Ôn tập ' : '') + count + '/' + questions.length}</span>
      </div>

      {questions.map((q, qi) => {
        const r = result?.results[qi];
        const answer = r?.answer ?? (review ? q.answer : undefined);
        const picked = picks[qi];
        const settled = !!r || (review && picked >= 0);
        const promptVi = r?.promptVi ?? (settled ? q.promptVi : undefined);
        const optVi = r?.optionsVi ?? (settled ? q.optionsVi : undefined);
        return (
          <div className="q" key={q.idx}>
            <div className="hq">
              {q.prompt}
              {promptVi ? <span className="t2">{promptVi}</span> : null}
            </div>
            <div className="optgrid">
              {q.options.map((o, oi) => {
                const cls = settled ? (oi === answer ? ' ok' : oi === picked ? ' no' : '') : picked === oi ? ' sel' : '';
                return (
                  <button
                    key={oi}
                    className={'opt' + cls}
                    style={!settled && picked === oi ? { borderColor: 'var(--accent)' } : undefined}
                    disabled={settled || busy}
                    onClick={() => pick(qi, oi)}
                  >
                    <span className="han">{o}</span>
                    {optVi ? <span className="t2">{optVi[oi]}</span> : null}
                  </button>
                );
              })}
            </div>
            {review ? (
              <RevealBlur open={settled || peek.includes(qi)} onOpen={() => setPeek([...peek, qi])} label="Bấm để xem đáp án">
                <div className="rv-answer">
                  {!settled && q.promptVi ? <div className="muted">{q.promptVi}</div> : null}
                  <div>Lần trước bạn chọn: {label(q, q.lastPicked) ?? 'chưa có'}</div>
                  <div>
                    <b>Đáp án: </b>
                    {label(q, q.answer)}
                  </div>
                </div>
              </RevealBlur>
            ) : null}
          </div>
        );
      })}

      {result ? (
        <div className="alert" style={{ borderColor: 'var(--good)', background: 'var(--goodbg)', color: 'var(--fg)' }}>
          <b>
            Đúng {result.correct}/{result.total} câu
          </b>
          {review ? '. Đã lưu kết quả mới.' : ''}
        </div>
      ) : review ? (
        allPicked ? (
          <button className="btn primary" disabled={busy} onClick={() => send(picks)}>
            {busy ? 'Đang lưu…' : 'Lưu lại kết quả'}
          </button>
        ) : null
      ) : (
        <button className="btn primary" disabled={!allPicked || busy} onClick={() => send(picks)}>
          {submitLabel}
        </button>
      )}
    </div>
  );
}
