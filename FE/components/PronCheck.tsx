'use client';
// Chấm phát âm thang 100 bằng Azure (rule.md 3.5): ghi âm → đổi sang WAV 16 kHz → cắt khoảng lặng → gửi máy chủ chấm.
// Máy chủ chưa cài Azure hoặc hết lượt hôm nay thì hiện `fallback` ("Đọc để máy chấm" của trình duyệt) thay cho nút ghi âm.
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { ApiError, api } from '@/lib/api';
import { encodeWav, trimSilence } from '@/lib/trim-silence';

const RATE = 16000;

type Verdict = 'ok' | 'homophone' | 'tone' | 'sound' | 'missing' | 'extra';
interface Syl {
  zh: string;
  py: string;
  heard: string;
  heardPy: string;
  verdict: Verdict;
  accuracy: number | null;
}
interface Result {
  noSpeech: boolean;
  score?: number;
  rating?: 'good' | 'fair' | 'poor';
  toneChecked?: boolean;
  syllables?: Syl[];
  left: number;
}
interface Status {
  enabled: boolean;
  dailyLimit: number;
  left: number;
  maxSeconds: number;
}

const RATING = {
  good: { label: 'Chuẩn', color: 'var(--good)' },
  fair: { label: 'Gần đúng', color: '#c27c0e' },
  poor: { label: 'Cần luyện', color: 'var(--bad)' },
};

const NOTE: Partial<Record<Verdict, (s: Syl) => string>> = {
  tone: (s) => 'sai thanh, nghe ra ' + s.heardPy,
  sound: (s) => 'sai âm, nghe ra ' + s.heardPy,
  missing: () => 'chưa đọc',
  extra: () => 'đọc thừa',
};

/** Giải mã bản ghi của trình duyệt (webm, mp4…) rồi đổi sang một kênh 16 kHz. */
async function toMono16k(blob: Blob): Promise<Float32Array> {
  const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new Ctx();
  try {
    const decoded = await ctx.decodeAudioData(await blob.arrayBuffer());
    const off = new OfflineAudioContext(1, Math.ceil(decoded.duration * RATE), RATE);
    const src = off.createBufferSource();
    src.buffer = decoded;
    src.connect(off.destination);
    src.start();
    return (await off.startRendering()).getChannelData(0);
  } finally {
    void ctx.close();
  }
}

export default function PronCheck({ target, fallback }: { target: string; fallback: ReactNode }) {
  const [status, setStatus] = useState<Status | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [replay, setReplay] = useState<string | null>(null);
  const [phase, setPhase] = useState<'idle' | 'rec' | 'busy'>('idle');
  const [result, setResult] = useState<Result | null>(null);
  const [cut, setCut] = useState<{ before: number; after: number } | null>(null);
  const [err, setErr] = useState('');
  const rec = useRef<MediaRecorder | null>(null);
  const timer = useRef(0);

  useEffect(() => {
    api<Status>('/speak/assess')
      .then(setStatus)
      .catch(() => setStatus(null))
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    setResult(null);
    setCut(null);
    setErr('');
    setReplay(null);
  }, [target]);

  // Bản ghi để nghe lại chỉ nằm trên máy; thay bản mới hoặc rời trang thì giải phóng.
  useEffect(() => (replay ? () => URL.revokeObjectURL(replay) : undefined), [replay]);

  // Rời trang hoặc đổi từ khi đang ghi: dừng và bỏ bản ghi.
  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
      const r = rec.current;
      if (r) {
        r.ondataavailable = null;
        r.onstop = null;
        if (r.state !== 'inactive') r.stop();
        r.stream.getTracks().forEach((t) => t.stop());
        rec.current = null;
      }
    },
    [target],
  );

  const grade = async (blob: Blob) => {
    setPhase('busy');
    setReplay(URL.createObjectURL(blob));
    try {
      const trimmed = trimSilence(await toMono16k(blob), RATE);
      if (!trimmed) {
        setErr('Máy chưa nghe thấy tiếng bạn. Đọc to hơn hoặc lại gần micro nhé. Lượt này không bị tính.');
        return;
      }
      setCut({ before: trimmed.before, after: trimmed.after });
      const form = new FormData();
      form.append('target', target);
      form.append('audio', encodeWav(trimmed.samples, RATE), 'speech.wav');
      const r = await api<Result>('/speak/assess', { method: 'POST', form });
      setResult(r);
      setStatus((s) => (s ? { ...s, left: r.left } : s));
      if (r.noSpeech) setErr('Máy không nghe rõ tiếng Trung trong bản ghi. Hãy đọc lại nhé.');
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : 'Không xử lý được bản ghi. Hãy thử lại.');
    } finally {
      setPhase('idle');
    }
  };

  const start = async () => {
    setErr('');
    setResult(null);
    setCut(null);
    setReplay(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
      const r = new MediaRecorder(stream);
      const parts: Blob[] = [];
      r.ondataavailable = (e) => parts.push(e.data);
      r.onstop = () => {
        window.clearTimeout(timer.current);
        stream.getTracks().forEach((t) => t.stop());
        rec.current = null;
        void grade(new Blob(parts, { type: r.mimeType }));
      };
      rec.current = r;
      r.start();
      setPhase('rec');
      // Tự dừng theo độ dài câu, để quên bấm dừng cũng không ghi quá lâu.
      const limit = Math.min(status?.maxSeconds ?? 15, 3 + [...target].length * 0.7);
      timer.current = window.setTimeout(() => rec.current?.stop(), limit * 1000);
    } catch {
      setPhase('idle');
      setErr('Không mở được micro. Bạn hãy cho phép dùng micro cho trang này rồi thử lại.');
    }
  };

  if (!loaded) return null;
  if (!status?.enabled) return <>{fallback}</>;
  const out = status.left <= 0 && phase === 'idle';
  const shown = result && !result.noSpeech && result.rating ? RATING[result.rating] : null;

  return (
    <>
    <div className="card stack">
      <div className="row between">
        <b>Chấm phát âm</b>
        <span className="pill">
          Còn {status.left}/{status.dailyLimit} lượt hôm nay
        </span>
      </div>
      {out ? (
        <p className="muted" style={{ fontSize: 13 }}>
          Bạn đã hết lượt chấm điểm hôm nay. Vẫn có thể luyện bằng phần bên dưới.
        </p>
      ) : (
        <>
          <p className="muted" style={{ fontSize: 13 }}>
            Bấm ghi âm, đọc: <b className="han">{target}</b>
          </p>
          <button className={'mic' + (phase === 'rec' ? ' rec' : '')} disabled={phase === 'busy'} onClick={phase === 'rec' ? () => rec.current?.stop() : start}>
            {phase === 'rec' ? <span className="pulse" /> : null}
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 4a3 3 0 0 1 3 3v4a3 3 0 0 1-6 0V7a3 3 0 0 1 3-3zM5 11a7 7 0 0 0 14 0M12 18v3" />
            </svg>
            {phase === 'rec' ? 'Đọc xong bấm để chấm' : phase === 'busy' ? 'Đang chấm…' : 'Ghi âm để chấm điểm'}
          </button>
        </>
      )}
      {err ? <div className="alert">{err}</div> : null}
      {replay && phase === 'idle' ? (
        <div className="stack">
          <small className="muted">Nghe lại giọng của bạn:</small>
          <audio controls src={replay} style={{ width: '100%' }} />
        </div>
      ) : null}

      {shown ? (
        <>
          <div className="row" style={{ gap: 12, alignItems: 'center' }}>
            <span className="hnum2" style={{ fontSize: 44, color: shown.color }}>
              {result?.score}
            </span>
            <b style={{ color: shown.color }}>{shown.label}</b>
          </div>
          <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
            {result?.syllables?.map((s, k) => {
              const note = NOTE[s.verdict]?.(s);
              return (
                <span key={k} style={{ border: `2px solid ${note ? 'var(--bad)' : 'var(--good)'}`, borderRadius: 10, padding: '4px 8px', textAlign: 'center', minWidth: 44 }}>
                  <span className="han" style={{ fontSize: 22, display: 'block' }}>
                    {s.zh || s.heard}
                  </span>
                  <small style={{ display: 'block' }}>{s.py || s.heardPy}</small>
                  {s.accuracy !== null ? <small style={{ display: 'block' }}>{s.accuracy} điểm</small> : null}
                  {note ? <small style={{ display: 'block', color: 'var(--bad)', fontWeight: 700 }}>{note}</small> : null}
                </span>
              );
            })}
          </div>
          {result?.toneChecked ? null : <small className="muted">Lần này máy chưa kiểm tra được thanh điệu, điểm chỉ tính theo âm.</small>}
          <small className="muted">Điểm dùng để tự luyện, không phải điểm thi. Máy có thể bỏ sót lỗi thanh khi tự đoán theo từ quen thuộc, nên hãy nghe mẫu và so lại.</small>
        </>
      ) : null}

      {cut ? (
        <small className="muted">
          Đã cắt khoảng lặng: {cut.before.toFixed(1)} giây còn {cut.after.toFixed(1)} giây.
        </small>
      ) : null}
      <small className="muted" style={{ fontSize: 11 }}>
        Bản ghi được gửi tới dịch vụ Azure của Microsoft để chấm. HanVui không lưu giọng nói của bạn.
      </small>
    </div>
    {out ? fallback : null}
    </>
  );
}
