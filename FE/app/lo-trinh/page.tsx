'use client';
// Lộ trình cho người mới (rule.md mục 6): Nhập môn → HSK 1 → HSK 2. Mỗi bước nói rõ bấm gì và có nút "Làm ngay" tới đúng
// chức năng. Bước có số liệu ở máy chủ (sổ tay, hội thoại, bài đọc, ngữ pháp, kiểm tra bộ từ, cấp đã thi đạt) tự tính;
// bước còn lại người học tự đánh dấu, lưu trên trình duyệt (lib/beginner.ts). Dừng ở mốc thi đạt HSK 2.
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Ring } from '@/components/Bits';
import Shell from '@/components/Shell';
import type { VocabOverview } from '@/components/ReadinessCard';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { STAGES, loadPath, savePath, type PathState, type Step } from '@/lib/beginner';
import { useUi } from '@/lib/ui';
import type { GrammarList, Notebook } from '@/lib/types';

interface Prog {
  done: boolean;
  /** Thanh tiến độ (0–100) và chữ hiển thị, chỉ có khi tự tính được. */
  pct?: number;
  label?: string;
}

export default function PathPage() {
  const { user } = useAuth();
  const { toast } = useUi();
  const [path, setPath] = useState<PathState>({ done: {}, score: {} });
  const [ov, setOv] = useState<VocabOverview | null>(null);
  const [gr, setGr] = useState<GrammarList | null>(null);
  const [saved, setSaved] = useState<number | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setPath(loadPath(user.id));
    api<VocabOverview>('/vocab-test').then(setOv).catch(() => {});
    api<GrammarList>('/grammar').then(setGr).catch(() => {});
    api<Notebook>('/notebook?view=day')
      .then((n) => setSaved(n.total))
      .catch(() => {});
  }, [user]);

  const prog = (s: Step): Prog => {
    const manual = !!path.done[s.id];
    const a = s.auto;
    if (!a) return { done: manual };
    if (a.kind === 'intro') {
      const score = path.score[s.id.replace(/^intro-/, '')];
      return { done: manual, label: score !== undefined ? `luyện ${score}%` : undefined };
    }
    if (a.kind === 'notebook') {
      const v = saved ?? 0;
      return { done: manual || v >= a.need, pct: Math.min(100, (v / a.need) * 100), label: `${v}/${a.need} từ` };
    }
    if (a.kind === 'exam') {
      const passed = (ov?.currentLevel ?? 0) > a.level;
      return { done: manual || passed, label: passed ? 'đã đạt' : undefined };
    }
    if (a.kind === 'grammar') {
      const lv = gr?.levels.find((x) => x.level === a.level);
      if (!lv) return { done: manual };
      const need = Math.ceil(lv.total * 0.8);
      return { done: manual || lv.mastered >= need, pct: Math.min(100, (lv.mastered / need) * 100), label: `thuộc ${lv.mastered}/${lv.total} điểm (cần ${need})` };
    }
    const r = ov?.readiness.find((x) => x.level === a.level);
    if (!r) return { done: manual };
    if (a.kind === 'vocab') {
      const best = r.vocab.best?.pct ?? 0;
      return { done: manual || r.checks.vocab, pct: Math.min(100, (best / r.vocab.need) * 100), label: r.vocab.best ? `cao nhất ${best}% (cần ${r.vocab.need}%)` : `chưa làm (cần ${r.vocab.need}%)` };
    }
    const d = a.kind === 'dialogs' ? r.dialogs : r.readings;
    return {
      done: manual || (a.kind === 'dialogs' ? r.checks.dialogs : r.checks.readings),
      pct: Math.min(100, (d.pct / d.need) * 100),
      label: `${d.done}/${d.total} bài (cần ${d.need}%)`,
    };
  };

  const all = useMemo(() => STAGES.flatMap((st) => st.steps.map((s) => ({ st, s }))), []);
  const states = all.map(({ s }) => prog(s));
  const doneCount = states.filter((p) => p.done).length;
  const nextIdx = states.findIndex((p) => !p.done);
  const next = nextIdx >= 0 ? all[nextIdx] : null;
  const finished = !next;

  // Giai đoạn đang học mở sẵn; người học bấm tiêu đề để mở giai đoạn khác.
  const curStage = open ?? next?.st.id ?? STAGES[STAGES.length - 1].id;

  const toggleManual = (s: Step) => {
    if (!user) return;
    const p = loadPath(user.id);
    if (p.done[s.id]) delete p.done[s.id];
    else p.done[s.id] = new Date().toISOString().slice(0, 10);
    savePath(user.id, p);
    setPath(p);
    toast(p.done[s.id] ? 'Đã đánh dấu xong' : 'Đã bỏ đánh dấu');
  };

  const reset = () => {
    if (!user || !window.confirm('Xóa các bước đã tự đánh dấu và điểm bài nhập môn trên máy này?')) return;
    const p = { done: {}, score: {} };
    savePath(user.id, p);
    setPath(p);
    toast('Đã làm lại lộ trình từ đầu');
  };

  return (
    <Shell title="Lộ trình">
      <div className="stack">
        <section className="surf" data-g="night">
          <span className="wm" aria-hidden="true">
            路
          </span>
          <span className="eyebrow">Lộ trình cho người mới</span>
          <div className="row" style={{ gap: 14, alignItems: 'center' }}>
            <Ring done={doneCount} total={all.length} />
            <div className="grow">
              <div className="hnum2" style={{ fontSize: 20 }}>
                Từ số 0 đến HSK 2
              </div>
              <span className="hsub">
                Nhập môn → HSK 1 → HSK 2 · {doneCount}/{all.length} bước. Cứ làm theo bước đang sáng, bấm "Làm ngay" là tới đúng chỗ.
              </span>
            </div>
          </div>
        </section>

        {next ? (
          <section className="card stack" style={{ gap: 10, borderLeft: '4px solid var(--accent)' }}>
            <span className="eyebrow2">Bước tiếp theo · {next.st.title}</span>
            <b style={{ fontSize: 18 }}>{next.s.title}</b>
            <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.55 }}>
              {next.s.how.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ol>
            {states[nextIdx].label ? <small className="muted">Hiện tại: {states[nextIdx].label}</small> : null}
            {next.s.href ? (
              <Link className="btn primary" href={next.s.href} style={{ textAlign: 'center' }}>
                Làm ngay · {next.s.cta} →
              </Link>
            ) : null}
          </section>
        ) : (
          <section className="card stack center">
            <h2 style={{ margin: 0 }}>🎉 Bạn đã đi hết lộ trình HSK 2</h2>
            <p className="muted" style={{ margin: 0 }}>
              Bạn đã có nền tảng 300 từ và ngữ pháp cơ bản. Tiếp theo: học bài HSK 3 trong Nghe, Đọc, Ngữ pháp và tham gia sự kiện tháng để ôn từ.
            </p>
            <Link className="btn primary" href="/hoc/nghe">
              Học tiếp HSK 3
            </Link>
          </section>
        )}

        {STAGES.map((st, si) => {
          const steps = st.steps.map((s) => ({ s, p: prog(s) }));
          const n = steps.filter((x) => x.p.done).length;
          const isOpen = curStage === st.id;
          return (
            <section key={st.id} className="card stack" style={{ gap: 10 }}>
              <button
                className="row"
                onClick={() => setOpen(isOpen ? '' : st.id)}
                style={{ gap: 12, background: 'none', border: 0, padding: 0, textAlign: 'left', cursor: 'pointer', color: 'inherit' }}
                aria-expanded={isOpen}
              >
                <span className="han" style={{ fontSize: 30, lineHeight: 1, width: 36, textAlign: 'center' }} aria-hidden="true">
                  {st.zh}
                </span>
                <span className="grow">
                  <span className="eyebrow2">
                    Giai đoạn {si + 1} · {st.time}
                  </span>
                  <b style={{ display: 'block' }}>{st.title}</b>
                </span>
                <span className={'pill' + (n === st.steps.length ? ' ok' : '')}>
                  {n}/{st.steps.length}
                </span>
                <span className="chev">{isOpen ? '▾' : '›'}</span>
              </button>

              {isOpen ? (
                <>
                  <div className="card" style={{ background: 'var(--bg)', padding: 12 }}>
                    <b style={{ fontSize: 13 }}>Mỗi ngày nên làm</b>
                    <ul style={{ margin: '6px 0 0', paddingLeft: 18, fontSize: 13, lineHeight: 1.5 }}>
                      {st.daily.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                    {st.id === 'hsk2' ? (
                      <small className="muted" style={{ display: 'block', marginTop: 6 }}>
                        Bài HSK 2 mở khi bạn thi đạt đề HSK 1.
                      </small>
                    ) : null}
                  </div>

                  {steps.map(({ s, p }) => {
                    const isNext = next?.s.id === s.id;
                    return (
                      <details key={s.id} className="card" open={isNext} style={isNext ? { borderColor: 'var(--accent)' } : undefined}>
                        <summary className="row" style={{ gap: 10, cursor: 'pointer', listStyle: 'none' }}>
                          <span
                            aria-label={p.done ? 'đã xong' : 'chưa xong'}
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: 11,
                              display: 'grid',
                              placeItems: 'center',
                              flex: 'none',
                              fontSize: 13,
                              fontWeight: 800,
                              background: p.done ? 'var(--good)' : 'transparent',
                              color: p.done ? '#fff' : 'var(--muted)',
                              border: p.done ? 0 : '2px solid var(--line)',
                            }}
                          >
                            {p.done ? '✓' : ''}
                          </span>
                          <span className="grow">
                            <b style={{ fontSize: 14, textDecoration: p.done ? 'line-through' : undefined, opacity: p.done ? 0.7 : 1 }}>{s.title}</b>
                            {p.label ? (
                              <small className="muted" style={{ display: 'block' }}>
                                {p.label}
                              </small>
                            ) : null}
                          </span>
                          {isNext ? <span className="tag">đang học</span> : null}
                        </summary>
                        <div className="stack" style={{ gap: 8, marginTop: 10 }}>
                          {p.pct !== undefined ? (
                            <div className="tbar">
                              <i style={{ width: p.pct + '%' }} />
                            </div>
                          ) : null}
                          <ol style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 1.55 }}>
                            {s.how.map((h) => (
                              <li key={h}>{h}</li>
                            ))}
                          </ol>
                          <div className="row" style={{ gap: 8 }}>
                            {s.href ? (
                              <Link className="btn primary sm grow" href={s.href} style={{ textAlign: 'center' }}>
                                {s.cta ?? 'Làm ngay'} →
                              </Link>
                            ) : null}
                            {s.auto?.kind !== 'intro' && (path.done[s.id] || !p.done) ? (
                              <button className="btn sm" onClick={() => toggleManual(s)}>
                                {path.done[s.id] ? 'Bỏ đánh dấu' : 'Đánh dấu xong'}
                              </button>
                            ) : null}
                          </div>
                          {s.auto && s.auto.kind !== 'intro' ? (
                            <small className="muted">Bước này tự đánh dấu khi đạt mức trên; bạn cũng có thể tự đánh dấu.</small>
                          ) : null}
                        </div>
                      </details>
                    );
                  })}
                </>
              ) : null}
            </section>
          );
        })}

        <p className="note">
          Thời gian mỗi giai đoạn là ước lượng khi học 30 phút mỗi ngày. Các bước tự đánh dấu và điểm bài nhập môn lưu trên trình duyệt
          của máy này (đổi máy hoặc xóa dữ liệu trình duyệt thì mất phần tự đánh dấu; phần tự tính vẫn còn).
        </p>
        {finished ? null : (
          <button className="btn sm" onClick={reset}>
            Làm lại lộ trình từ đầu
          </button>
        )}
      </div>
    </Shell>
  );
}
