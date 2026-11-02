'use client';
// Soạn bài (quản trị): nhập tay hoặc dán JSON → xem trước (máy sinh pinyin, tách từ, nghĩa, nhãn) → lưu → tạo âm thanh → đăng.
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import AdminGate from '@/components/AdminGate';
import { aiBrief, blankForm, blankQuestion, fromJson, linesToText, parseText, toDraft, type LessonDetail, type LessonForm, type Preview, type QuestionForm, type RoleForm, type Tok } from '@/lib/admin-lesson';
import { api } from '@/lib/api';
import { audioUrl } from '@/lib/audio';
import { useAuth } from '@/lib/auth';
import { useUi } from '@/lib/ui';

const AREA: React.CSSProperties = { font: 'inherit', fontSize: 15, color: 'var(--fg)', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, padding: '9px 10px', width: '100%', minWidth: 0 };
const NEXT_WHO = 'ABCDEFGH';

export default function LessonEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'moi';
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useUi();
  const [form, setForm] = useState<LessonForm>(blankForm);
  const [topics, setTopics] = useState<{ id: string; name: string }[]>([]);
  const [json, setJson] = useState('');
  /** Tách từ, pinyin, nghĩa đã có hoặc đã sửa, theo chữ của câu. */
  const [edited, setEdited] = useState<Record<string, Tok[]>>({});
  const [preview, setPreview] = useState<Preview | null>(null);
  const [picked, setPicked] = useState<{ line: number; tok: number } | null>(null);
  const [detail, setDetail] = useState<LessonDetail | null>(null);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const stopAudio = useRef(false);
  const admin = user?.role === 'ADMIN';

  const fail = useCallback((e: unknown, fallback: string) => toast(e instanceof Error ? e.message : fallback), [toast]);

  const load = useCallback(async () => {
    const d = await api<LessonDetail>('/admin/lessons/' + id);
    setDetail(d);
    setForm({ kind: d.kind, title: d.title, situation: d.situation, level: d.level, topics: d.topics, tags: d.tags.join(', '), roles: d.roles, text: linesToText(d.lines, d.kind), questions: d.questions });
    setEdited(Object.fromEntries(d.lines.map((l) => [l.zh, l.tokens])));
    setPreview(null);
    setDirty(false);
  }, [id]);

  useEffect(() => {
    if (!admin) return;
    api<{ id: string; name: string }[]>('/topics?kind=SITUATION')
      .then(setTopics)
      .catch((e) => fail(e, 'Không tải được chủ đề'));
    if (!isNew) load().catch((e) => fail(e, 'Không tải được bài'));
  }, [admin, isNew, load, fail]);

  const change = (patch: Partial<LessonForm>) => {
    setForm((f) => ({ ...f, ...patch }));
    setDirty(true);
  };
  const setRole = (i: number, patch: Partial<RoleForm>) =>
    // Đổi giới tính hoặc khoảng giọng thì bỏ giọng cũ để máy chọn lại.
    change({ roles: form.roles.map((r, k) => (k === i ? { ...r, ...patch, ...(patch.gender || patch.pitchRange ? { voiceId: undefined } : {}) } : r)) });
  const setQuestion = (i: number, patch: Partial<QuestionForm>) => change({ questions: form.questions.map((q, k) => (k === i ? { ...q, ...patch } : q)) });
  const setOption = (i: number, o: number, patch: { zh?: string; vi?: string }) =>
    setQuestion(i, { options: form.questions[i].options.map((x, k) => (k === o ? { ...x, ...patch } : x)) });

  const applyJson = () => {
    try {
      setForm(fromJson(json));
      setEdited({});
      setPreview(null);
      setDirty(true);
      toast('Đã điền vào form, bạn bấm Xem trước nhé');
    } catch {
      toast('JSON không đúng định dạng');
    }
  };

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(aiBrief(topics));
      toast('Đã sao chép đề bài cho AI');
    } catch {
      toast('Trình duyệt không cho sao chép');
    }
  };

  const runPreview = async () => {
    setBusy(true);
    try {
      const p = await api<Preview>('/admin/lessons/preview', { method: 'POST', body: toDraft(form, edited) });
      setPreview(p);
      setEdited(Object.fromEntries(p.lines.map((l) => [l.zh, l.tokens])));
      setPicked(null);
    } catch (e) {
      fail(e, 'Không xem trước được');
    } finally {
      setBusy(false);
    }
  };

  /** Sửa pinyin hoặc nghĩa của một từ tại đúng vị trí đó. */
  const editToken = (line: number, tok: number, patch: Partial<Tok>) => {
    if (!preview) return;
    const lines = preview.lines.map((l, i) => (i === line ? { ...l, tokens: l.tokens.map((t, k) => (k === tok ? { ...t, ...patch } : t)) } : l));
    setPreview({ ...preview, lines });
    setEdited(Object.fromEntries(lines.map((l) => [l.zh, l.tokens])));
    setDirty(true);
  };

  /** Điền nghĩa cho một từ chưa có nghĩa: áp dụng mọi chỗ từ đó xuất hiện. */
  const fillMeaning = (zh: string, v: string) => {
    if (!preview) return;
    const lines = preview.lines.map((l) => ({ ...l, tokens: l.tokens.map((t) => (t.t === zh && !t.x ? { ...t, v } : t)) }));
    setPreview({ ...preview, lines });
    setEdited(Object.fromEntries(lines.map((l) => [l.zh, l.tokens])));
    setDirty(true);
  };

  const save = async () => {
    setBusy(true);
    try {
      const body = toDraft(form, edited);
      if (isNew) {
        const r = await api<{ id: string }>('/admin/lessons', { method: 'POST', body });
        toast('Đã lưu bài, chưa hiện cho người học');
        setDirty(false);
        router.replace('/admin/bai/' + r.id);
      } else {
        await api('/admin/lessons/' + id, { method: 'PUT', body });
        await load();
        toast('Đã lưu');
      }
    } catch (e) {
      fail(e, 'Không lưu được');
    } finally {
      setBusy(false);
    }
  };

  const makeAudio = async () => {
    if (!detail) return;
    stopAudio.current = false;
    const total = detail.lines.length;
    setProgress({ done: total - detail.audioPending, total });
    try {
      for (;;) {
        const r = await api<{ total: number; remaining: number }>(`/admin/lessons/${id}/audio`, { method: 'POST' });
        setProgress({ done: r.total - r.remaining, total: r.total });
        if (!r.remaining || stopAudio.current) break;
      }
    } catch (e) {
      fail(e, 'Không tạo được âm thanh');
    } finally {
      setProgress(null);
      await load().catch(() => {});
    }
  };

  const flag = async (name: 'published' | 'reviewed', value: boolean) => {
    if (!detail) return;
    if (name === 'published' && value) {
      const warn = [
        !detail.reviewed ? '• Bài CHƯA QUA DUYỆT.' : '',
        detail.audioPending ? `• Còn ${detail.audioPending} câu chưa có âm thanh, người học sẽ nghe giọng trình duyệt.` : '',
        detail.missing.length ? `• Còn ${detail.missing.length} từ chưa có nghĩa.` : '',
      ].filter(Boolean);
      if (warn.length && !window.confirm(`Bạn vẫn muốn đăng bài này?\n\n${warn.join('\n')}`)) return;
    }
    try {
      await api(`/admin/lessons/${id}/${name}`, { method: 'PATCH', body: { value } });
      await load();
    } catch (e) {
      fail(e, 'Không cập nhật được');
    }
  };

  const whos = form.roles.map((r) => r.who);
  const lineCount = parseText(form.text, form.kind).length;
  const unknownMeaning = preview ? new Set(preview.lines.flatMap((l) => l.tokens.filter((t) => !t.x && !t.v).map((t) => t.t))) : new Set<string>();

  return (
    <AdminGate title={isNew ? 'Thêm bài' : 'Sửa bài'}>
      <div className="stack">
        {detail ? (
          <div className="row" style={{ flexWrap: 'wrap', gap: 6 }}>
            <span className="pill">Mã bài: {detail.id}</span>
            <span className="pill">{detail.published ? 'Đang hiện' : 'Đang ẩn'}</span>
            <span className={'pill' + (detail.reviewed ? '' : ' hot')}>{detail.reviewed ? 'Đã duyệt' : 'CHƯA QUA DUYỆT'}</span>
          </div>
        ) : null}
        {detail?.keywords.length ? (
          <div className="alert">Bài này chứa từ khóa sự kiện: {detail.keywords.join(', ')}. Không được xóa các từ này khỏi lời thoại và không ẩn được bài. Đừng chia sẻ nội dung trang này cho người chơi.</div>
        ) : null}

        <section className="card stack">
          <span className="eyebrow2">Nhờ AI soạn rồi dán vào (không bắt buộc)</span>
          <button className="btn sm" disabled={!topics.length} onClick={copyBrief}>
            Sao chép đề bài cho AI
          </button>
          <textarea style={AREA} rows={4} value={json} onChange={(e) => setJson(e.target.value)} placeholder="Dán JSON AI trả về vào đây" aria-label="JSON bài học" />
          <button className="btn sm" disabled={!json.trim()} onClick={applyJson}>
            Điền vào form
          </button>
        </section>

        <section className="card stack">
          <span className="eyebrow2">1. Thông tin</span>
          <div className="seg" role="tablist" aria-label="Loại bài">
            {(['DIALOG', 'READING'] as const).map((k) => (
              <button key={k} className={form.kind === k ? 'on' : ''} disabled={!isNew} onClick={() => change({ kind: k })}>
                {k === 'DIALOG' ? 'Hội thoại' : 'Bài đọc'}
              </button>
            ))}
          </div>
          <label className="field">
            Tên bài
            <input value={form.title} onChange={(e) => change({ title: e.target.value })} />
          </label>
          <label className="field">
            Bối cảnh (nơi chốn, nhân vật)
            <input value={form.situation} onChange={(e) => change({ situation: e.target.value })} />
          </label>
          <label className="field">
            Cấp HSK
            <select value={form.level} onChange={(e) => change({ level: Number(e.target.value) })}>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  HSK {n}
                </option>
              ))}
            </select>
          </label>
          <div className="stack" style={{ gap: 6 }}>
            <small className="muted">Chủ đề (chọn từ 1 đến 3, chủ đề chọn đầu tiên là chủ đề chính)</small>
            <div className="row" style={{ flexWrap: 'wrap', gap: 6 }}>
              {topics.map((t) => {
                const on = form.topics.includes(t.id);
                return (
                  <button key={t.id} className={'chip' + (on ? ' on' : '')} aria-pressed={on} onClick={() => change({ topics: on ? form.topics.filter((x) => x !== t.id) : [...form.topics, t.id] })}>
                    {t.name}
                  </button>
                );
              })}
            </div>
          </div>
          <label className="field">
            Từ khóa bối cảnh để tìm bài (cách nhau bằng dấu phẩy)
            <input value={form.tags} onChange={(e) => change({ tags: e.target.value })} />
          </label>
        </section>

        {form.kind === 'DIALOG' ? (
          <section className="card stack">
            <span className="eyebrow2">Vai và giọng</span>
            {form.roles.map((r, i) => (
              <div key={i} className="row" style={{ flexWrap: 'wrap', gap: 6 }}>
                <span className="pill">{r.who}</span>
                <label className="field grow" style={{ minWidth: 120 }}>
                  <input value={r.label} placeholder="Tên vai, ví dụ Lễ tân" aria-label={`Tên vai ${r.who}`} onChange={(e) => setRole(i, { label: e.target.value })} />
                </label>
                <label className="field">
                  <select value={r.gender} aria-label={`Giới tính vai ${r.who}`} onChange={(e) => setRole(i, { gender: e.target.value as 'm' | 'f' })}>
                    <option value="f">Nữ</option>
                    <option value="m">Nam</option>
                  </select>
                </label>
                <label className="field">
                  <select value={r.pitchRange} aria-label={`Khoảng giọng vai ${r.who}`} onChange={(e) => setRole(i, { pitchRange: Number(e.target.value) })}>
                    <option value={1}>Trầm</option>
                    <option value={2}>Vừa</option>
                    <option value={3}>Cao</option>
                  </select>
                </label>
                <button className="btn sm ghost" disabled={form.roles.length <= 1} aria-label={`Bỏ vai ${r.who}`} onClick={() => change({ roles: form.roles.filter((_, k) => k !== i) })}>
                  ✕
                </button>
              </div>
            ))}
            <button
              className="btn sm"
              disabled={form.roles.length >= NEXT_WHO.length}
              onClick={() => change({ roles: [...form.roles, { who: [...NEXT_WHO].find((c) => !whos.includes(c)) ?? 'Z', label: '', gender: 'f', pitchRange: 3 }] })}
            >
              + Thêm vai
            </button>
          </section>
        ) : null}

        <section className="card stack">
          <span className="eyebrow2">2. Nội dung ({lineCount} câu)</span>
          <small className="muted">
            Mỗi dòng một câu, chữ Hán và bản dịch cách nhau bằng dấu |. {form.kind === 'DIALOG' ? 'Ví dụ: A: 你好。 | Xin chào.' : 'Ví dụ: 今天很热。 | Hôm nay rất nóng.'}
          </small>
          <textarea style={{ ...AREA, fontFamily: 'var(--font-han), inherit' }} rows={10} value={form.text} onChange={(e) => change({ text: e.target.value })} aria-label="Nội dung bài" />
        </section>

        <section className="card stack">
          <span className="eyebrow2">3. Câu hỏi</span>
          {form.questions.map((q, i) => (
            <div key={i} className="stack" style={{ gap: 6, borderTop: i ? '1px solid var(--line)' : undefined, paddingTop: i ? 10 : 0 }}>
              <div className="row between">
                <b>Câu {i + 1}</b>
                <button className="btn sm ghost" disabled={form.questions.length <= 1} onClick={() => change({ questions: form.questions.filter((_, k) => k !== i) })}>
                  Bỏ câu này
                </button>
              </div>
              <label className="field">
                Câu hỏi tiếng Trung
                <input value={q.prompt} onChange={(e) => setQuestion(i, { prompt: e.target.value })} />
              </label>
              <label className="field">
                Bản dịch câu hỏi
                <input value={q.promptVi} onChange={(e) => setQuestion(i, { promptVi: e.target.value })} />
              </label>
              {q.options.map((o, k) => (
                <div key={k} className="row" style={{ gap: 6 }}>
                  <input type="radio" name={`dung-${i}`} checked={q.answer === k} aria-label={`Đáp án ${k + 1} đúng`} onChange={() => setQuestion(i, { answer: k })} />
                  <label className="field grow">
                    <input value={o.zh} placeholder="Đáp án tiếng Trung" aria-label={`Đáp án ${k + 1} tiếng Trung`} onChange={(e) => setOption(i, k, { zh: e.target.value })} />
                  </label>
                  <label className="field grow">
                    <input value={o.vi} placeholder="Bản dịch" aria-label={`Đáp án ${k + 1} bản dịch`} onChange={(e) => setOption(i, k, { vi: e.target.value })} />
                  </label>
                </div>
              ))}
              <small className="muted">Chấm tròn đánh dấu đáp án đúng.</small>
            </div>
          ))}
          <button className="btn sm" onClick={() => change({ questions: [...form.questions, blankQuestion()] })}>
            + Thêm câu hỏi
          </button>
        </section>

        <section className="card stack">
          <span className="eyebrow2">4. Xem trước và lưu</span>
          <button className="btn" disabled={busy} onClick={runPreview}>
            Xem trước (sinh pinyin, tách từ, nghĩa)
          </button>
          {preview ? (
            <>
              {preview.errors.length ? (
                <div className="alert stack" style={{ gap: 4 }}>
                  <b>Cần sửa trước khi lưu:</b>
                  {preview.errors.map((e) => (
                    <span key={e}>• {e}</span>
                  ))}
                </div>
              ) : null}
              <small className="muted">
                Nhãn tự tính: HSK {preview.labels.hskShown} hiển thị · từ khó nhất 2.0 cấp {preview.labels.hsk2 ?? '?'} | 3.0 cấp {preview.labels.hsk3 ?? '?'}. Chạm một từ để sửa pinyin hoặc nghĩa; từ có viền đỏ là chưa có nghĩa.
              </small>
              {preview.lines.map((l, i) => (
                <div key={i} className="stack" style={{ gap: 4 }}>
                  <div className="row" style={{ flexWrap: 'wrap', gap: 4, alignItems: 'flex-end' }}>
                    {form.kind === 'DIALOG' ? <span className="pill">{l.who}</span> : null}
                    {l.tokens.map((t, k) =>
                      t.x ? (
                        <span key={k} className="han">
                          {t.t}
                        </span>
                      ) : (
                        <button
                          key={k}
                          className="btn sm ghost"
                          style={{ display: 'grid', justifyItems: 'center', padding: '2px 6px', minHeight: 0, borderColor: t.v ? 'var(--line)' : 'var(--seal)' }}
                          aria-pressed={picked?.line === i && picked.tok === k}
                          onClick={() => setPicked(picked?.line === i && picked.tok === k ? null : { line: i, tok: k })}
                        >
                          <small className="muted" style={{ fontWeight: 400 }}>
                            {t.p}
                          </small>
                          <span className="han">{t.t}</span>
                        </button>
                      ),
                    )}
                  </div>
                  {picked?.line === i && l.tokens[picked.tok] ? (
                    <div className="row" style={{ gap: 6 }}>
                      <label className="field grow">
                        Pinyin của {l.tokens[picked.tok].t}
                        <input value={l.tokens[picked.tok].p ?? ''} onChange={(e) => editToken(i, picked.tok, { p: e.target.value })} />
                      </label>
                      <label className="field grow">
                        Nghĩa
                        <input value={l.tokens[picked.tok].v ?? ''} onChange={(e) => editToken(i, picked.tok, { v: e.target.value })} />
                      </label>
                    </div>
                  ) : null}
                  <small className="muted">{l.vi}</small>
                </div>
              ))}
              {preview.missing.length ? (
                <div className="stack" style={{ gap: 6 }}>
                  <b>Từ chưa có nghĩa ({unknownMeaning.size} còn lại)</b>
                  <small className="muted">Điền một lần, áp dụng cho mọi chỗ trong bài. Khi lưu, từ này được thêm vào từ điển.</small>
                  {preview.missing.map((w) => (
                    <label key={w.zh} className="field">
                      {w.zh} ({w.pinyin})
                      <input
                        value={preview.lines.flatMap((l) => l.tokens).find((t) => t.t === w.zh && !t.x)?.v ?? ''}
                        onChange={(e) => fillMeaning(w.zh, e.target.value)}
                      />
                    </label>
                  ))}
                </div>
              ) : null}
            </>
          ) : null}
          <button className="btn primary" disabled={busy || (!isNew && !dirty)} onClick={save}>
            {isNew ? 'Lưu bài (chưa hiện cho người học)' : dirty ? 'Lưu thay đổi' : 'Chưa có thay đổi'}
          </button>
          {!isNew && detail?.published && dirty ? <small className="muted">Bài đang hiện: lưu xong người học thấy ngay nội dung mới. Sửa nội dung sẽ đưa bài về trạng thái chưa duyệt.</small> : null}
        </section>

        {detail ? (
          <>
            {detail.kind === 'DIALOG' ? (
              <section className="card stack">
                <span className="eyebrow2">5. Âm thanh</span>
                <small className="muted">
                  Còn {detail.audioPending}/{detail.lines.length} câu chưa có file. Mỗi câu mất khoảng 3 giây; câu không đổi thì giữ file cũ. Ký tự Azure tháng này: {detail.usage.used.toLocaleString('vi-VN')}/{detail.usage.limit.toLocaleString('vi-VN')}.
                </small>
                {progress ? (
                  <>
                    <div>
                      Đang tạo {progress.done}/{progress.total} câu…
                    </div>
                    <button className="btn sm" onClick={() => (stopAudio.current = true)}>
                      Dừng sau câu này
                    </button>
                  </>
                ) : (
                  <button className="btn" disabled={dirty || !detail.audioPending} onClick={makeAudio}>
                    {dirty ? 'Lưu thay đổi trước đã' : detail.audioPending ? 'Tạo âm thanh' : 'Đã đủ âm thanh'}
                  </button>
                )}
                {detail.lines.map((l, i) => {
                  const src = audioUrl(l.audioKey);
                  return src ? (
                    <div key={i} className="stack" style={{ gap: 2 }}>
                      <small className="han">
                        {l.who}: {l.zh}
                      </small>
                      <audio controls preload="none" src={src} style={{ width: '100%' }} />
                    </div>
                  ) : null;
                })}
              </section>
            ) : null}

            <section className="card stack">
              <span className="eyebrow2">6. Duyệt và đăng</span>
              <button className="btn" onClick={() => flag('reviewed', !detail.reviewed)}>
                {detail.reviewed ? 'Bỏ đánh dấu đã duyệt' : 'Đánh dấu đã duyệt'}
              </button>
              <button className={'btn' + (detail.published ? '' : ' primary')} disabled={dirty || (detail.published && detail.keywords.length > 0)} onClick={() => flag('published', !detail.published)}>
                {detail.published ? 'Ẩn bài' : 'Đăng bài'}
              </button>
              <small className="muted">Ẩn bài không xóa dữ liệu: tiến độ của người học vẫn còn, đăng lại lúc nào cũng được.</small>
            </section>
          </>
        ) : isNew ? (
          <small className="muted">Lưu xong mới tạo được âm thanh và đăng bài.</small>
        ) : null}
      </div>
    </AdminGate>
  );
}
