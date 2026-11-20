'use client';
// Tiến độ Lộ trình cho người mới, dùng chung cho trang /lo-trinh và thẻ ở Trang chủ.
// Bước có số liệu ở máy chủ tự tính; bước còn lại lấy từ phần tự đánh dấu lưu trên trình duyệt (lib/beginner.ts).
import { useEffect, useMemo, useState } from 'react';
import type { VocabOverview } from '@/components/ReadinessCard';
import { api } from '@/lib/api';
import { STAGES, loadPath, type PathState, type Step } from '@/lib/beginner';
import type { GrammarList, Notebook } from '@/lib/types';

export interface Prog {
  done: boolean;
  /** Thanh tiến độ (0–100) và chữ hiển thị, chỉ có khi tự tính được. */
  pct?: number;
  label?: string;
}

export function usePathProgress(userId: string | undefined) {
  const [path, setPath] = useState<PathState>({ done: {}, score: {} });
  const [ov, setOv] = useState<VocabOverview | null>(null);
  const [gr, setGr] = useState<GrammarList | null>(null);
  const [saved, setSaved] = useState<number | null>(null);

  useEffect(() => {
    if (!userId) return;
    setPath(loadPath(userId));
    api<VocabOverview>('/vocab-test').then(setOv).catch(() => {});
    api<GrammarList>('/grammar').then(setGr).catch(() => {});
    api<Notebook>('/notebook?view=day')
      .then((n) => setSaved(n.total))
      .catch(() => {});
  }, [userId]);

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
  return { path, setPath, prog, all, states, doneCount, nextIdx, next, loaded: ov !== null };
}
