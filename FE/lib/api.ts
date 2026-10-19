// Gọi API của BE. Access token 15 phút; hết hạn thì tự làm mới bằng refresh token (xoay vòng mỗi lần dùng).
import type { CheckinResult, User } from './types';

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001/api/v1';

const ACCESS = 'hv.access';
const REFRESH = 'hv.refresh';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly body?: unknown,
  ) {
    super(message);
  }
}

export const tokens = {
  get access() {
    return typeof window === 'undefined' ? null : localStorage.getItem(ACCESS);
  },
  get refresh() {
    return typeof window === 'undefined' ? null : localStorage.getItem(REFRESH);
  },
  set(access: string, refresh: string) {
    localStorage.setItem(ACCESS, access);
    localStorage.setItem(REFRESH, refresh);
  },
  clear() {
    localStorage.removeItem(ACCESS);
    localStorage.removeItem(REFRESH);
  },
};

let onSignedOut: (() => void) | null = null;
export const setSignedOutHandler = (fn: (() => void) | null) => {
  onSignedOut = fn;
};

interface Opts {
  method?: string;
  body?: unknown;
  auth?: boolean;
}

async function once<T>(path: string, opts: Opts): Promise<T> {
  const headers: Record<string, string> = {};
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json';
  if (opts.auth !== false && tokens.access) headers.Authorization = 'Bearer ' + tokens.access;

  const res = await fetch(API_BASE + path, {
    method: opts.method ?? 'GET',
    headers,
    body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
  });
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const m = data?.message;
    throw new ApiError(res.status, Array.isArray(m) ? m.join('. ') : (m ?? 'Có lỗi xảy ra'), data);
  }
  return data as T;
}

// Chỉ một yêu cầu làm mới chạy cùng lúc; các yêu cầu khác chờ kết quả đó.
let refreshing: Promise<boolean> | null = null;

async function doRefresh(): Promise<boolean> {
  const refreshToken = tokens.refresh;
  if (!refreshToken) return false;
  try {
    const pair = await once<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
      method: 'POST',
      body: { refreshToken },
      auth: false,
    });
    tokens.set(pair.accessToken, pair.refreshToken);
    return true;
  } catch {
    tokens.clear();
    onSignedOut?.();
    return false;
  }
}

export async function api<T>(path: string, opts: Opts = {}): Promise<T> {
  try {
    return await once<T>(path, opts);
  } catch (e) {
    if (!(e instanceof ApiError) || e.status !== 401 || opts.auth === false) throw e;
    refreshing = refreshing ?? doRefresh().finally(() => (refreshing = null));
    const ok = await refreshing;
    if (!ok) throw e;
    return once<T>(path, opts);
  }
}

type Pair = { user: User; accessToken: string; refreshToken: string };

export const authApi = {
  async register(email: string, password: string, displayName: string) {
    const r = await api<Pair>('/auth/register', { method: 'POST', body: { email, password, displayName }, auth: false });
    tokens.set(r.accessToken, r.refreshToken);
    return r.user;
  },
  async login(email: string, password: string) {
    const r = await api<Pair>('/auth/login', { method: 'POST', body: { email, password }, auth: false });
    tokens.set(r.accessToken, r.refreshToken);
    return r.user;
  },
  me: () => api<User>('/auth/me'),
  patchMe: (body: { hskStandard?: string; hskLevel?: number; displayName?: string }) =>
    api<User>('/auth/me', { method: 'PATCH', body }),
  async logout() {
    const refreshToken = tokens.refresh;
    tokens.clear();
    if (refreshToken) {
      await api<void>('/auth/logout', { method: 'POST', body: { refreshToken }, auth: false }).catch(() => {});
    }
  },
};

export const checkin = () => api<CheckinResult>('/event/checkin', { method: 'POST' });
export const ping = () => api<{ onlineSec: number; granted: number }>('/event/ping', { method: 'POST' });
