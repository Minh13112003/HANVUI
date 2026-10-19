'use client';
// Ô nhập từ khóa ở cuối mỗi hội thoại (rule.md mục 5.5). Mặc định ghép ô chữ: một bảng 21 chữ lấy từ
// chính bài vừa học, dùng chung cho mọi ô; cũng gõ được chữ Hán hoặc pinyin. Không hiện số ô trống.
import { useEffect, useMemo, useState } from 'react';
import { Confetti } from '@/components/Bits';
import { api } from '@/lib/api';
import { hanChars, shuffle } from '@/lib/text';
import { useUi } from '@/lib/ui';
import type { EventState, GuessResult } from '@/lib/types';

const BOARD = 21;

export default function GuessSheet({ lessonId, text, onSolved }: { lessonId: string; text: string; onSolved?: () => void }) {
  const { toast, closeSheet } = useUi();
  const [state, setState] = useState<EventState | null>(null);
  const [picked, setPicked] = useState<number[]>([]);
  const [typed, setTyped] = useState('');
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<GuessResult | null>(null);
  const [burst, setBurst] = useState(0);

  const tiles = useMemo(() => shuffle(hanChars(text)).slice(0, BOARD), [text]);

  useEffect(() => {
    api<EventState>('/event')
      .then(setState)
      .catch(() => {});
  }, [res]);

  const answer = (typed.trim() || picked.map((i) => tiles[i]).join('')).trim();
  const locked = state?.lockedUntil ? new Date(state.lockedUntil) : null;
  const lockedLeft = locked && locked > new Date() ? Math.ceil((locked.getTime() - Date.now()) / 60000) : 0;

  const guess = async () => {
    if (!answer) return;
    setBusy(true);
    try {
      const r = await api<GuessResult>('/event/guess', { method: 'POST', body: { lessonId, answer } });
      setRes(r);
      setPicked([]);
      setTyped('');
      if (r.correct) {
        setBurst((b) => b + 1);
        onSolved?.();
        toast('Đúng rồi! +' + (r.points ?? 0) + ' điểm');
      }
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Không gửi được');
    } finally {
      setBusy(false);
    }
  };

  const optOut = async () => {
    try {
      await api('/event/opt-out', { method: 'POST', body: { out: true } });
      toast('Đã tắt sự kiện. Bật lại bất cứ lúc nào ở tab Sự kiện.');
      closeSheet();
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Không đổi được');
    }
  };

  // Các gợi ý đã mở của những ô chưa giải, để đối chiếu.
  const openHints = (state?.chapters ?? []).flatMap((c) =>
    c.cells
      .filter((x) => x.status === 'open' && (x.hintsOpened ?? 0) > 0)
      .map((x) => ({ chapter: c.idx, pos: x.pos, hints: [x.hint1, x.hint2, x.hint3].filter(Boolean) as { zh: string; vi: string }[] })),
  );

  return (
    <>
      <Confetti burst={burst} />
      <div className="row between">
        <h2>Nhập từ khóa</h2>
        <span className="pill">{state?.tokens ?? 0} lượt</span>
      </div>

      {res ? (
        res.correct ? (
          <div className="card" style={{ borderColor: 'var(--good)', background: 'var(--goodbg)' }}>
            <div className="row between">
              <div>
                <div className="han" style={{ fontSize: 30 }}>
                  {res.word?.zh}
                </div>
                <div className="py">{res.word?.pinyin}</div>
                <div>{res.word?.vi}</div>
              </div>
              <div className="lr">
                <b>+{res.points} điểm</b>
                <small className="muted">đã giải {res.solved}</small>
              </div>
            </div>
            {res.newMedal ? <p style={{ marginTop: 8 }}>Nhận huy chương {res.newMedal.name}!</p> : null}
            {res.hoiOpened ? <p style={{ marginTop: 8 }}>Mở được hồi {res.hoiOpened} của truyện.</p> : null}
            {res.vipItem ? <p style={{ marginTop: 8 }}>Thẻ VIP 3 ngày đã vào túi đồ.</p> : null}
          </div>
        ) : (
          <div className="card" style={{ borderColor: 'var(--bad)', background: 'var(--badbg)' }}>
            <b>{res.message}</b>
            <p className="muted" style={{ fontSize: 13, marginTop: 4 }}>
              Còn {res.wrongLeft} lần đoán trong nhóm này
              {res.penaltyAdded ? ' · bị trừ ' + res.penaltyAdded + ' điểm ở ô trả lời đúng kế tiếp' : ''}
              {res.lockedUntil ? ' · khóa tới ' + new Date(res.lockedUntil).toLocaleTimeString('vi-VN') : ''}
            </p>
          </div>
        )
      ) : null}

      {lockedLeft > 0 ? (
        <div className="alert">Bạn đang bị khóa đoán {lockedLeft} phút. Hãy học thêm một bài trong lúc chờ.</div>
      ) : null}

      <div className="ansrow" aria-label="Đáp án đang ghép">
        {picked.length === 0 && !typed ? (
          <span className="muted" style={{ fontSize: 13, paddingInline: 6 }}>
            Chạm các chữ bên dưới để ghép từ
          </span>
        ) : null}
        {picked.map((t, k) => (
          <button key={k} className="tile on" onClick={() => setPicked(picked.filter((_, j) => j !== k))}>
            {tiles[t]}
          </button>
        ))}
      </div>

      <div className="tiles">
        {tiles.map((ch, i) => (
          <button key={i} className="tile" disabled={picked.includes(i) || busy} onClick={() => setPicked([...picked, i])}>
            {ch}
          </button>
        ))}
      </div>

      <label className="field">
        Hoặc gõ chữ Hán / pinyin (có dấu hay không đều được)
        <input
          className="hanin"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          placeholder="ví dụ: 咖啡 hoặc kafei"
          autoComplete="off"
        />
      </label>

      <div className="row" style={{ gap: 8 }}>
        <button className="btn primary grow" disabled={!answer || busy || lockedLeft > 0} onClick={guess}>
          Đoán
        </button>
        <button className="btn" onClick={closeSheet}>
          Đóng
        </button>
      </div>

      {openHints.length ? (
        <details className="card">
          <summary>Gợi ý đã mở của các ô chưa giải ({openHints.length})</summary>
          <div className="stack" style={{ marginTop: 10 }}>
            {openHints.map((o) => (
              <div key={o.chapter + '-' + o.pos} className="keyc">
                <b>
                  Chương {o.chapter} · ô {o.pos + 1}
                </b>
                <ul>
                  {o.hints.map((h, i) => (
                    <li key={i}>
                      {h.zh} <span className="muted">— {h.vi}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </details>
      ) : null}

      <p className="muted" style={{ fontSize: 12 }}>
        App không cho biết bài này có từ khóa hay không. Phải mở gợi ý 1 của một ô mới đoán được ô đó.
      </p>
      <button className="btn ghost sm" onClick={optOut}>
        Không tham gia sự kiện
      </button>
    </>
  );
}
