'use client';
// Một bài hội thoại: Nghe → Trả lời → Xem lời thoại (rule.md mục 3.2). Lời thoại khóa tới khi trả lời xong
// hoặc bấm bỏ qua. Lưu từ bằng "Chế độ lưu từ", chọn nhiều từ trong cùng câu thì lưu cả cụm.
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Confetti } from '@/components/Bits';
import { api } from '@/lib/api';
import { AUDIO_BASE, play, playAll, stopAll } from '@/lib/audio';
import { useAuth } from '@/lib/auth';
import { lessonLabel } from '@/lib/text';
import { useUi } from '@/lib/ui';
import type { AnswerResult, Lesson, Token } from '@/lib/types';
import GuessSheet from './GuessSheet';
import SuggestWords from './SuggestWords';
import WordSheet from './WordSheet';

const SpeakerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M4 9v6h3l5 4V5L7 9H4zM16 8.5a4 4 0 0 1 0 7" />
  </svg>
);

function Switch({ on, set, label }: { on: boolean; set: (v: boolean) => void; label: string }) {
  return (
    <span className="sw">
      <button className={on ? 'on' : ''} role="switch" aria-checked={on} aria-label={label} onClick={() => set(!on)} />
      {label}
    </span>
  );
}

export default function LessonView({ id }: { id: string }) {
  const { user } = useAuth();
  const { toast, openSheet } = useUi();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [picks, setPicks] = useState<number[]>([]);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [cur, setCur] = useState(-1);
  const [slow, setSlow] = useState(false);
  const [showPy, setShowPy] = useState(true);
  const [showVi, setShowVi] = useState(false);
  const [saveMode, setSaveMode] = useState(false);
  const [sel, setSel] = useState<{ line: number; idx: number[] } | null>(null);
  const [missionDone, setMissionDone] = useState(false);
  const [burst, setBurst] = useState(0);
  const [playedN, setPlayedN] = useState(0);
  const [playingAll, setPlayingAll] = useState(false);
  const played = useRef<Set<number>>(new Set());
  const stop = useRef<null | (() => void)>(null);
  const mark = (i: number) => {
    played.current.add(i);
    setPlayedN(played.current.size);
  };

  const load = useCallback(async () => {
    try {
      const l = await api<Lesson>('/lessons/' + id);
      setLesson(l);
      setPicks(new Array(l.questions.length).fill(-1));
      if (l.kind === 'STORY' && (user?.hskLevel ?? 1) <= 2) setShowVi(true);
      // Truyện không có câu hỏi: mở lời thoại ngay để đọc.
      if (!l.progress.transcript && l.questions.length === 0) {
        await api('/lessons/' + id + '/answers', { method: 'POST', body: { answers: [], listenedPct: 0 } });
        setLesson(await api<Lesson>('/lessons/' + id));
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Không mở được bài');
    }
  }, [id, user?.hskLevel]);

  useEffect(() => {
    load();
    return () => stopAll();
  }, [load]);

  const unlocked = !!lesson?.progress.transcript;
  const total = lesson?.lines.length ?? 0;
  const hasAudio = !!AUDIO_BASE && !!lesson?.lines.some((l) => l.audioKey);
  const canSpeak = unlocked || hasAudio; // chưa mở lời thoại và chưa có file thì không có gì để phát
  const listenedPct = total ? Math.round((playedN / total) * 100) : 0;

  const roleOf = (who: string) => lesson?.roles.find((r) => r.who === who);

  const playWhole = () => {
    if (!lesson) return;
    if (stop.current) {
      stop.current();
      stop.current = null;
      setCur(-1);
      setPlayingAll(false);
      return;
    }
    setPlayingAll(true);
    stop.current = playAll(lesson.lines, lesson.roles, {
      slow,
      onLine: (i) => {
        setCur(i);
        if (i >= 0) mark(i);
        if (i < 0) {
          stop.current = null;
          setPlayingAll(false);
        }
      },
    });
  };

  const playOne = (i: number) => {
    const l = lesson?.lines[i];
    if (!l) return;
    const r = roleOf(l.who);
    mark(i);
    setCur(i);
    play(l.zh ?? '', l.audioKey, { slow, gender: r?.gender, pitchRange: r?.pitchRange, onEnd: () => setCur(-1) });
  };

  const submit = async () => {
    if (!lesson) return;
    try {
      const r = await api<AnswerResult>('/lessons/' + id + '/answers', {
        method: 'POST',
        body: { answers: picks, listenedPct },
      });
      setResult(r);
      if (r.correct === r.total) setBurst((b) => b + 1);
      if (r.mission?.granted) toast('Nhiệm vụ ngày: +' + r.mission.granted + ' lượt gợi ý');
      if (r.mission?.counted) setMissionDone(true);
      setLesson(await api<Lesson>('/lessons/' + id));
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Không nộp được');
    }
  };

  const skip = async () => {
    await api('/lessons/' + id + '/skip', { method: 'POST' });
    toast('Bài này không tính vào nhiệm vụ hôm nay');
    setLesson(await api<Lesson>('/lessons/' + id));
  };

  /** Đã nghe đủ sau khi mở lời thoại thì vẫn tính nhiệm vụ (gửi lại cùng đáp án). */
  const claimMission = async () => {
    const r = await api<AnswerResult>('/lessons/' + id + '/answers', {
      method: 'POST',
      body: { answers: result ? result.results.map((x) => x.picked) : picks, listenedPct: 100 },
    });
    setMissionDone(true);
    toast(r.mission?.granted ? 'Nhiệm vụ ngày: +' + r.mission.granted + ' lượt' : 'Đã tính bài này vào nhiệm vụ');
  };

  const text = useMemo(() => (lesson?.lines ?? []).map((l) => l.zh ?? '').join(''), [lesson]);

  const selWord = useMemo(() => {
    if (!sel || !lesson) return null;
    const toks = (lesson.lines[sel.line]?.tokens ?? []) as Token[];
    const idx = [...sel.idx].sort((a, b) => a - b);
    const parts = idx.map((i) => toks[i]).filter(Boolean);
    if (!parts.length) return null;
    return {
      zh: parts.map((t) => t.t).join(''),
      pinyin: parts.map((t) => t.p ?? '').filter(Boolean).join(' '),
      vi: parts.length === 1 ? (parts[0].v ?? '') : '',
      isPhrase: parts.length > 1 || [...parts[0].t].length > 2,
    };
  }, [sel, lesson]);

  const saveSel = async () => {
    if (!selWord) return;
    try {
      await api('/notebook', { method: 'POST', body: { ...selWord, lessonId: id } });
      toast('Đã lưu "' + selWord.zh + '"' + (selWord.vi ? '' : ' · AI sẽ điền nghĩa'));
      setSel(null);
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Không lưu được');
    }
  };

  if (err) return <div className="card">{err}</div>;
  if (!lesson) return <p className="muted">Đang tải bài…</p>;

  const answered = !!result || lesson.progress.allDone;
  const step = unlocked ? 2 : playedN ? 1 : 0;
  const twinLevel = lesson.twinId ? (lesson.twinId.endsWith('3') ? 3 : lesson.twinId.endsWith('2') ? 2 : 1) : 0;

  return (
    <div className="stack lesson">
      <Confetti burst={burst} />
      <div className="row between">
        <div className="grow">
          <h1>{lesson.title}</h1>
          <p className="muted" style={{ fontSize: 13 }}>
            {lesson.situation} · {lesson.lines.length} câu
          </p>
        </div>
        <div className="lr">
          <span className="pill">{lessonLabel(lesson.levelShown ?? lesson.level)}</span>
          {lesson.twinId ? (
            <Link className="twin" href={'/hoc/nghe/' + lesson.twinId}>
              Bản HSK {twinLevel} →
            </Link>
          ) : null}
        </div>
      </div>

      {lesson.kind === 'STORY' ? (
        <div className="alert">
          Bạn có thể đọc nội dung bằng tiếng Việt, nhưng chữ trong truyện thuộc HSK 3 (2.0). Hãy cân nhắc khi học nội
          dung này.
        </div>
      ) : null}

      <ol className="steps">
        {['Nghe', 'Trả lời', 'Xem lời thoại'].map((s, i) => (
          <li key={s} className={i === step ? 'cur' : i < step ? 'done' : ''}>
            <b>{i + 1}</b>
            {s}
          </li>
        ))}
      </ol>

      {lesson.roles.length ? (
        <div className="cast">
          {lesson.roles.map((r) => (
            <button
              key={r.who}
              className={'castc' + (r.gender === 'f' ? ' f' : '')}
              onClick={() => play(r.label, null, { gender: r.gender, pitchRange: r.pitchRange })}
            >
              <i />
              <b>{r.label}</b>· {r.gender === 'f' ? 'nữ' : 'nam'}, giọng {r.pitchRange === 1 ? 'trầm' : r.pitchRange === 3 ? 'cao' : 'vừa'}
            </button>
          ))}
        </div>
      ) : null}

      <div className={'card player sticky' + (cur >= 0 ? ' playing' : '')}>
        <div className="row">
          <button className="icon-btn bigspk" aria-label="Nghe cả bài" onClick={playWhole} disabled={!canSpeak}>
            {playingAll ? <span style={{ fontSize: 18 }}>■</span> : <SpeakerIcon />}
          </button>
          <div className="grow">
            <div className="wave" aria-hidden="true">
              {Array.from({ length: 22 }).map((_, i) => (
                <i key={i} />
              ))}
            </div>
            <small className="muted">
              {canSpeak ? (cur >= 0 ? 'Đang phát câu ' + (cur + 1) : 'Đã nghe ' + listenedPct + '%') : 'Chưa có âm thanh'}
            </small>
          </div>
          <Switch on={slow} set={setSlow} label="Chậm" />
        </div>
      </div>

      {lesson.questions.length ? (
        <div className="card stack">
          <div className="row between">
            <h2>Trả lời câu hỏi</h2>
            <span className="pill">{answered ? 'Đã trả lời' : picks.filter((p) => p >= 0).length + '/' + lesson.questions.length}</span>
          </div>
          {lesson.questions.map((q, qi) => {
            const r = result?.results[qi];
            const vi = r?.promptVi ?? q.promptVi;
            const optVi = r?.optionsVi ?? q.optionsVi;
            return (
              <div className="q" key={q.idx}>
                <div className="hq">
                  {q.prompt}
                  {vi && (showVi || answered) ? <span className="t2">{vi}</span> : null}
                </div>
                <div className="optgrid">
                  {q.options.map((o, oi) => {
                    const cls = r ? (oi === r.answer ? ' ok' : oi === r.picked ? ' no' : '') : picks[qi] === oi ? ' sel' : '';
                    return (
                      <button
                        key={oi}
                        className={'opt' + cls}
                        style={picks[qi] === oi && !r ? { borderColor: 'var(--accent)' } : undefined}
                        disabled={answered}
                        onClick={() => setPicks(picks.map((p, i) => (i === qi ? oi : p)))}
                      >
                        <span className="han">{o}</span>
                        {optVi && (showVi || answered) ? <span className="t2">{optVi[oi]}</span> : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {!answered ? (
            <>
              <Switch on={showVi} set={setShowVi} label="Dịch câu hỏi" />
              {!lesson.questions[0]?.promptVi && showVi ? (
                <p className="muted" style={{ fontSize: 12 }}>
                  Bản dịch hiện sau khi trả lời (để nghe hiểu trước).
                </p>
              ) : null}
              <button className="btn primary" disabled={picks.some((p) => p < 0)} onClick={submit}>
                Nộp đáp án
              </button>
            </>
          ) : (
            <b>
              Đúng {result?.correct ?? lesson.progress.correct}/{lesson.questions.length} câu
            </b>
          )}
        </div>
      ) : null}

      <div className="card stack">
        <div className="row between">
          <h2>Lời thoại</h2>
          {unlocked ? (
            <div className="row" style={{ gap: 10 }}>
              <Switch on={showPy} set={setShowPy} label="Pinyin" />
              <Switch on={showVi} set={setShowVi} label="Dịch" />
            </div>
          ) : null}
        </div>

        {!unlocked ? (
          <>
            <div className="lockmsg">Nghe trước, trả lời câu hỏi rồi mới xem lời thoại.</div>
            <button className="btn ghost sm" onClick={skip}>
              Bỏ qua, xem lời thoại (không tính nhiệm vụ)
            </button>
          </>
        ) : (
          <>
            <button className={'savebtn' + (saveMode ? ' on' : '')} onClick={() => { setSaveMode(!saveMode); setSel(null); }}>
              <span className="dotsw" />
              <span className="grow">
                <b>Chế độ lưu từ</b>
                <small>{saveMode ? 'Chạm từ để chọn; chạm thêm từ khác trong cùng câu để lưu cả cụm.' : 'Bật để chọn từ trong lời thoại.'}</small>
              </span>
            </button>

            {lesson.lines.map((l, i) => (
              <div className={'line' + (cur === i ? ' cur' : '')} key={l.idx}>
                <div className="row between">
                  <span className="who">{roleOf(l.who)?.label ?? l.who}</span>
                  <button className="lnk" onClick={() => playOne(i)}>
                    Nghe câu
                  </button>
                </div>
                {saveMode && l.tokens ? (
                  <div className="tokl">
                    {(l.tokens as Token[]).map((t, ti) =>
                      t.x ? (
                        <span className="punc2" key={ti}>
                          {t.t}
                        </span>
                      ) : (
                        <button
                          key={ti}
                          className={'wtok' + (sel?.line === i && sel.idx.includes(ti) ? ' on' : '')}
                          onClick={() =>
                            setSel((s) => {
                              if (!s || s.line !== i) return { line: i, idx: [ti] };
                              return s.idx.includes(ti)
                                ? { line: i, idx: s.idx.filter((x) => x !== ti) }
                                : { line: i, idx: [...s.idx, ti] };
                            })
                          }
                        >
                          {t.t}
                        </button>
                      ),
                    )}
                  </div>
                ) : (
                  <div className="zh">{l.zh}</div>
                )}
                {showPy && l.pinyin ? <div className="py">{l.pinyin}</div> : null}
                {showVi && l.vi ? <div className="tr">{l.vi}</div> : null}
              </div>
            ))}

            {saveMode ? (
              <div className={'selbar' + (selWord ? '' : ' idle')}>
                {selWord ? (
                  <>
                    <div className="grow">
                      <b className="han" style={{ fontSize: 20 }}>
                        {selWord.zh}
                      </b>
                      <div className="py">{selWord.pinyin || '—'}</div>
                      <small className="muted">{selWord.vi || 'AI sẽ điền nghĩa'}</small>
                    </div>
                    <button className="btn sm" onClick={() => setSel(null)}>
                      Bỏ chọn
                    </button>
                    <button className="btn primary sm" onClick={saveSel}>
                      Lưu
                    </button>
                  </>
                ) : (
                  'Chạm một từ trong lời thoại để chọn.'
                )}
              </div>
            ) : null}

            {!saveMode && lesson.lines.some((l) => l.tokens) ? (
              <p className="muted" style={{ fontSize: 12 }}>
                Chạm "Chế độ lưu từ" rồi chọn từ — không cần bôi đen.
              </p>
            ) : null}

            {!missionDone && listenedPct >= 80 ? (
              <button className="btn sm" onClick={claimMission}>
                Tôi đã nghe đủ bài này, tính vào nhiệm vụ
              </button>
            ) : null}
          </>
        )}
      </div>

      {unlocked && lesson.kind === 'DIALOG' ? <SuggestWords lessonId={id} /> : null}

      {unlocked ? (
        <div className="card stack">
          <h2>Tra nghĩa từng từ</h2>
          <div className="tokl">
            {Array.from(new Map((lesson.lines.flatMap((l) => (l.tokens ?? []) as Token[])).filter((t) => !t.x).map((t) => [t.t, t])).values()).map(
              (t) => (
                <button key={t.t} className="wtok" onClick={() => openSheet(<WordSheet word={{ zh: t.t, pinyin: t.p, vi: t.v }} lessonId={id} />)}>
                  {t.t}
                </button>
              ),
            )}
          </div>
        </div>
      ) : null}

      <button className="fab" onClick={() => openSheet(<GuessSheet lessonId={id} text={text} />)}>
        <svg className="keyic" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 7a4 4 0 1 0-3.9 5L7 16v3h3l1-1h2v-2h2l1.5-1.5A4 4 0 0 0 15 7z" />
        </svg>
        Nhập từ khóa
      </button>
    </div>
  );
}
