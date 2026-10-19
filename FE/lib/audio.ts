// Phát âm thanh. Có file trên Cloudflare R2 (NEXT_PUBLIC_AUDIO_BASE) thì phát file; chưa có thì đọc bằng
// giọng trình duyệt theo giới tính và khoảng giọng của vai (rule.md mục 3.2 và mục 8).
import type { Line, Role } from './types';

export const AUDIO_BASE = (process.env.NEXT_PUBLIC_AUDIO_BASE || '').replace(/\/$/, '');

export const audioUrl = (key?: string | null) => (AUDIO_BASE && key ? AUDIO_BASE + '/' + key : null);

/** Tốc độ chậm: giữ cao độ, không sinh file riêng (rule.md mục 8). */
export const SLOW_RATE = 0.65;

let el: HTMLAudioElement | null = null;
let stopTimer: number | null = null;

function element() {
  if (!el) {
    el = new Audio();
    el.preload = 'auto';
  }
  return el;
}

export function stopAll() {
  if (el) {
    el.pause();
    el.currentTime = 0;
  }
  if (stopTimer) {
    clearTimeout(stopTimer);
    stopTimer = null;
  }
  if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
}

let voices: SpeechSynthesisVoice[] = [];
function zhVoices() {
  if (typeof speechSynthesis === 'undefined') return [];
  if (!voices.length) voices = speechSynthesis.getVoices();
  return voices.filter((v) => /^zh(-|_)?(CN|Hans)?/i.test(v.lang) || /Chinese/i.test(v.name));
}

if (typeof speechSynthesis !== 'undefined') {
  speechSynthesis.addEventListener('voiceschanged', () => {
    voices = speechSynthesis.getVoices();
  });
}

const FEMALE = /(female|xiaoxiao|xiaoyi|huihui|yaoyao|nữ|woman|girl)/i;
const MALE = /(male|yunjian|yunyang|yunxi|kangkang|nam|man|boy)/i;

/** Chọn giọng gần nhất với vai; máy chỉ có một giọng thì đổi cao độ để phân biệt. */
function pickVoice(gender?: string) {
  const list = zhVoices();
  if (!list.length) return null;
  const want = gender === 'f' ? FEMALE : gender === 'm' ? MALE : null;
  if (want) {
    const hit = list.find((v) => want.test(v.name));
    if (hit) return hit;
  }
  return list[0];
}

/** Cao độ theo khoảng giọng của vai: 1 trầm, 2 vừa, 3 cao. */
const pitchOf = (gender?: string, range?: number) => {
  const base = gender === 'f' ? 1.15 : 0.9;
  const d = range === 1 ? -0.18 : range === 3 ? 0.18 : 0;
  return Math.min(2, Math.max(0.3, base + d));
};

export function speak(text: string, opts: { gender?: string; pitchRange?: number; rate?: number } = {}) {
  if (typeof speechSynthesis === 'undefined' || !text) return;
  stopAll();
  const u = new SpeechSynthesisUtterance(text);
  const v = pickVoice(opts.gender);
  if (v) u.voice = v;
  u.lang = v?.lang || 'zh-CN';
  u.rate = opts.rate ?? 1;
  u.pitch = pitchOf(opts.gender, opts.pitchRange);
  speechSynthesis.speak(u);
}

export interface PlayOpts {
  slow?: boolean;
  gender?: string;
  pitchRange?: number;
  onEnd?: () => void;
}

// Bảng chữ → khóa file âm thanh của từ vựng (nạp một lần). Nhờ đó mọi nút nghe một từ tự dùng file Azure trên R2.
let wordKeys: Record<string, string> = {};
let wordKeysLoaded = false;
export function loadWordAudio(fetcher: () => Promise<Record<string, string>>) {
  if (wordKeysLoaded) return;
  wordKeysLoaded = true;
  fetcher()
    .then((m) => {
      wordKeys = m;
    })
    .catch(() => {
      wordKeysLoaded = false;
    });
}

/** Phát một đoạn chữ Hán: ưu tiên file, không có thì giọng trình duyệt. Trả về hàm dừng. */
export function play(text: string, key: string | null | undefined, o: PlayOpts = {}) {
  const url = audioUrl(key ?? wordKeys[text]);
  const rate = o.slow ? SLOW_RATE : 1;
  if (url) {
    const a = element();
    stopAll();
    a.src = url;
    a.playbackRate = rate;
    // Giữ cao độ khi chạy chậm (Safari dùng tên riêng).
    type Pres = { preservesPitch?: boolean; webkitPreservesPitch?: boolean };
    const p = a as HTMLAudioElement & Pres;
    p.preservesPitch = true;
    p.webkitPreservesPitch = true;
    a.onended = () => o.onEnd?.();
    a.play().catch(() => {
      speak(text, { ...o, rate });
      o.onEnd?.();
    });
    return stopAll;
  }
  speak(text, { ...o, rate });
  if (o.onEnd) {
    // Giọng trình duyệt không có sự kiện đáng tin trên mọi máy: ước lượng theo số chữ.
    const ms = Math.max(900, [...text].length * (o.slow ? 420 : 260));
    stopTimer = window.setTimeout(() => o.onEnd?.(), ms);
  }
  return stopAll;
}

/** Phát lần lượt các câu của một bài. */
export function playAll(lines: Line[], roles: Role[], opts: { slow?: boolean; onLine?: (i: number) => void } = {}) {
  let i = 0;
  let cancelled = false;
  const roleOf = (who: string) => roles.find((r) => r.who === who);
  const step = () => {
    if (cancelled || i >= lines.length) {
      if (!cancelled) opts.onLine?.(-1);
      return;
    }
    const l = lines[i];
    const r = roleOf(l.who);
    opts.onLine?.(i);
    play(l.zh ?? '', l.audioKey, {
      slow: opts.slow,
      gender: r?.gender,
      pitchRange: r?.pitchRange,
      onEnd: () => {
        i++;
        window.setTimeout(step, 260);
      },
    });
  };
  step();
  return () => {
    cancelled = true;
    stopAll();
    opts.onLine?.(-1);
  };
}
