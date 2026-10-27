'use client';
// Đọc để máy chấm (kỹ năng Nói): dùng nhận dạng giọng nói CÓ SẴN của trình duyệt (miễn phí) để chép câu người học đọc ra chữ,
// rồi máy chủ so với câu mẫu theo pinyin (POST speak/compare): đúng · đồng âm (máy chọn chữ khác cùng âm, vẫn tính đúng)
// · sai thanh · sai âm · thiếu · thừa. Máy không hỗ trợ (Firefox, một số iPhone) thì báo và dùng ghi âm tự nghe lại.
import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';

type Verdict = 'ok' | 'homophone' | 'tone' | 'sound' | 'missing' | 'extra';
interface Syl {
  zh: string;
  py: string;
  heard: string;
  heardPy: string;
  verdict: Verdict;
}
interface Result {
  score: number;
  syllables: Syl[];
  counts: Record<Verdict, number>;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
type Rec = any;
const getSR = (): (new () => Rec) | null => {
  if (typeof window === 'undefined') return null;
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
};

const COLOR: Record<Verdict, string> = {
  ok: 'var(--good)',
  homophone: 'var(--good)',
  tone: '#c27c0e',
  sound: 'var(--bad)',
  missing: 'var(--muted)',
  extra: 'var(--muted)',
};

const ERR: Record<string, string> = {
  'not-allowed': 'Bạn chưa cho phép dùng micro. Bật quyền micro cho trang này rồi thử lại.',
  'service-not-allowed': 'Trình duyệt chặn nhận dạng giọng nói. Thử Chrome hoặc Edge.',
  'no-speech': 'Máy chưa nghe thấy gì. Đọc to và rõ hơn một chút nhé.',
  network: 'Nhận dạng giọng nói cần mạng. Kiểm tra kết nối rồi thử lại.',
  'language-not-supported': 'Trình duyệt này chưa nhận dạng được tiếng Trung.',
  'audio-capture': 'Không tìm thấy micro.',
};

export default function SpeechCheck({ target }: { target: string }) {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [err, setErr] = useState('');
  const rec = useRef<Rec>(null);

  useEffect(() => setSupported(!!getSR()), []);
  useEffect(() => {
    setHeard('');
    setResult(null);
    setErr('');
    return () => rec.current?.abort?.();
  }, [target]);

  const grade = async (alts: string[]) => {
    // So từng cách nghe (tối đa 3) và lấy kết quả tốt nhất: nhận dạng hay đoán lệch chữ đồng âm.
    let best: Result | null = null;
    let bestText = alts[0] ?? '';
    for (const a of alts.slice(0, 3)) {
      try {
        const r = await api<Result>('/speak/compare', { method: 'POST', body: { target, heard: a } });
        if (!best || r.score > best.score) {
          best = r;
          bestText = a;
        }
      } catch {
        /* bỏ qua cách nghe lỗi */
      }
    }
    setHeard(bestText);
    setResult(best);
  };

  const startListen = () => {
    const SR = getSR();
    if (!SR) return;
    setErr('');
    setResult(null);
    setHeard('');
    const r = new SR();
    r.lang = 'zh-CN';
    r.interimResults = true;
    r.maxAlternatives = 3;
    r.continuous = false;
    r.onresult = (e: any) => {
      const last = e.results[e.results.length - 1];
      const text = Array.from(e.results as ArrayLike<any>)
        .map((x: any) => x[0].transcript)
        .join('');
      setHeard(text);
      if (last.isFinal) {
        const alts = Array.from({ length: last.length }, (_, k) => (last[k].transcript as string) ?? '');
        const prefix = Array.from(e.results as ArrayLike<any>)
          .slice(0, -1)
          .map((x: any) => x[0].transcript)
          .join('');
        grade(alts.map((a) => prefix + a));
      }
    };
    r.onerror = (e: any) => setErr(ERR[e.error] ?? 'Không nhận dạng được (' + e.error + '). Thử lại nhé.');
    r.onend = () => setListening(false);
    rec.current = r;
    try {
      r.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  };

  if (supported === null) return null;
  if (!supported) {
    return (
      <div className="card stack">
        <b>Đọc để máy chấm</b>
        <p className="muted" style={{ fontSize: 13 }}>
          Trình duyệt này chưa có nhận dạng giọng nói. Hãy mở app bằng Chrome hoặc Edge (máy tính, Android) để dùng tính năng
          này. Bạn vẫn có thể ghi âm và tự nghe lại ở bên dưới.
        </p>
      </div>
    );
  }

  return (
    <div className="card stack">
      <div className="row between">
        <b>Đọc để máy chấm</b>
        {result ? <span className="pill">{result.score} điểm</span> : null}
      </div>
      <p className="muted" style={{ fontSize: 13 }}>
        Bấm nút, đọc: <b className="han">{target}</b>
      </p>
      <button className={'mic' + (listening ? ' rec' : '')} onClick={listening ? () => rec.current?.stop() : startListen}>
        {listening ? <span className="pulse" /> : null}
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 4a3 3 0 0 1 3 3v4a3 3 0 0 1-6 0V7a3 3 0 0 1 3-3zM5 11a7 7 0 0 0 14 0M12 18v3" />
        </svg>
        {listening ? 'Đang nghe… đọc xong máy tự dừng' : 'Đọc để máy chấm'}
      </button>
      {err ? <div className="alert">{err}</div> : null}
      {heard ? (
        <p style={{ fontSize: 14 }}>
          Máy nghe được: <b className="han">{heard}</b>
        </p>
      ) : null}

      {result ? (
        <>
          <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
            {result.syllables.map((s, k) => (
              <span
                key={k}
                title={s.verdict}
                style={{ border: `2px solid ${COLOR[s.verdict]}`, borderRadius: 10, padding: '4px 8px', textAlign: 'center', minWidth: 44, opacity: s.verdict === 'extra' ? 0.7 : 1 }}
              >
                <span className="han" style={{ fontSize: 22, display: 'block' }}>
                  {s.zh || s.heard}
                </span>
                <small style={{ display: 'block' }}>{s.py || s.heardPy}</small>
                <small style={{ display: 'block', color: COLOR[s.verdict], fontWeight: 700 }}>
                  {s.verdict === 'ok'
                    ? '✓'
                    : s.verdict === 'homophone'
                      ? '✓ đồng âm'
                      : s.verdict === 'tone'
                        ? 'bạn: ' + s.heardPy
                        : s.verdict === 'sound'
                          ? 'bạn: ' + s.heardPy
                          : s.verdict === 'missing'
                            ? 'thiếu'
                            : 'thừa'}
                </small>
              </span>
            ))}
          </div>
          <small className="muted">
            Viền xanh: đúng · vàng: sai thanh điệu · đỏ: sai âm · xám: thiếu/thừa. "Đồng âm" là bạn đọc đúng nhưng máy chọn chữ
            khác cùng cách đọc.
          </small>
        </>
      ) : null}
      <small className="muted" style={{ fontSize: 11 }}>
        Nhận dạng do trình duyệt thực hiện (Chrome gửi âm thanh tới dịch vụ của Google). HanVui không lưu giọng nói của bạn.
        Máy đôi khi tự sửa lỗi thanh điệu nhẹ theo ngữ cảnh, đọc từng từ ngắn sẽ được chấm chặt hơn.
      </small>
    </div>
  );
}
