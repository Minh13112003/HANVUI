'use client';
// Giữ người dùng đang đăng nhập, điểm danh mỗi ngày và báo "đang thao tác" để tính giờ online.
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { authApi, checkin, ping, setSignedOutHandler, tokens } from './api';
import type { User } from './types';

interface Ctx {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (u: User) => void;
  reload: () => Promise<void>;
}

const AuthCtx = createContext<Ctx | null>(null);

export function useAuth() {
  const c = useContext(AuthCtx);
  if (!c) throw new Error('useAuth phải nằm trong AuthProvider');
  return c;
}

/** BE chỉ tính online khi người học đang thao tác; quá 2 phút không thao tác thì ngừng cộng. */
const PING_MS = 60_000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const active = useRef(Date.now());
  const checkedIn = useRef(false);

  useEffect(() => {
    setSignedOutHandler(() => setUser(null));
    return () => setSignedOutHandler(null);
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!tokens.access && !tokens.refresh) {
        setLoading(false);
        return;
      }
      try {
        const me = await authApi.me();
        if (alive) setUser(me);
      } catch {
        tokens.clear();
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Điểm danh một lần mỗi ngày (BE tự bỏ qua nếu đã điểm danh).
  useEffect(() => {
    if (!user || checkedIn.current) return;
    checkedIn.current = true;
    const key = 'hv.checkin.' + new Date().toISOString().slice(0, 10);
    if (localStorage.getItem(key)) return;
    checkin()
      .then((r) => {
        localStorage.setItem(key, String(r.granted));
        if (r.granted > 0) {
          window.dispatchEvent(new CustomEvent('hv:toast', { detail: 'Điểm danh: +' + r.granted + ' lượt gợi ý' }));
        }
      })
      .catch(() => {});
  }, [user]);

  // Báo đang thao tác.
  useEffect(() => {
    if (!user) return;
    const touch = () => (active.current = Date.now());
    const evs: (keyof WindowEventMap)[] = ['pointerdown', 'keydown', 'scroll', 'touchstart'];
    evs.forEach((e) => window.addEventListener(e, touch, { passive: true }));
    const t = setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      if (Date.now() - active.current > PING_MS) return;
      ping().catch(() => {});
    }, PING_MS);
    return () => {
      evs.forEach((e) => window.removeEventListener(e, touch));
      clearInterval(t);
    };
  }, [user]);

  const signIn = useCallback(async (email: string, password: string) => {
    setUser(await authApi.login(email, password));
  }, []);
  const signUp = useCallback(async (email: string, password: string, name: string) => {
    setUser(await authApi.register(email, password, name));
  }, []);
  const signOut = useCallback(async () => {
    await authApi.logout();
    checkedIn.current = false;
    setUser(null);
  }, []);
  const reload = useCallback(async () => {
    setUser(await authApi.me());
  }, []);

  return (
    <AuthCtx.Provider value={{ user, loading, signIn, signUp, signOut, setUser, reload }}>{children}</AuthCtx.Provider>
  );
}
