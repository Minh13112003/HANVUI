'use client';
// Bật service worker để app mở được khi mạng yếu và nhớ sẵn âm thanh đã nghe.
import { useEffect } from 'react';

export default function SwRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, []);
  return null;
}
