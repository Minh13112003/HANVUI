'use client';
// Thông báo ngắn (toast) và bảng trượt từ dưới lên (sheet) — dùng đúng markup/CSS của bản demo.
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

type Node = React.ReactNode;

interface UiCtx {
  toast: (msg: string) => void;
  openSheet: (node: Node) => void;
  closeSheet: () => void;
}

const Ctx = createContext<UiCtx | null>(null);

export function useUi() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useUi phải nằm trong UiProvider');
  return c;
}

export function UiProvider({ children }: { children: Node }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [sheet, setSheet] = useState<Node>(null);

  const toast = useCallback((m: string) => setMsg(m), []);
  const openSheet = useCallback((n: Node) => setSheet(n), []);
  const closeSheet = useCallback(() => setSheet(null), []);

  useEffect(() => {
    const h = (e: Event) => setMsg(String((e as CustomEvent).detail));
    window.addEventListener('hv:toast', h);
    return () => window.removeEventListener('hv:toast', h);
  }, []);

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 2600);
    return () => clearTimeout(t);
  }, [msg]);

  useEffect(() => {
    if (!sheet) return;
    const h = (e: KeyboardEvent) => e.key === 'Escape' && setSheet(null);
    window.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', h);
      document.body.style.overflow = '';
    };
  }, [sheet]);

  return (
    <Ctx.Provider value={{ toast, openSheet, closeSheet }}>
      {children}
      {sheet ? (
        <div id="sheetWrap">
          <div className="scrim" onClick={closeSheet} />
          <div className="sheet" role="dialog" aria-modal="true">
            {sheet}
          </div>
        </div>
      ) : null}
      {msg ? (
        <div id="toast" role="status">
          {msg}
        </div>
      ) : null}
    </Ctx.Provider>
  );
}
