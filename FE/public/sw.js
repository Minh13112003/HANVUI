// Service worker đơn giản: giữ vỏ app để mở được khi mạng yếu, và lưu lại âm thanh, dữ liệu nét chữ.
// KHÔNG bao giờ lưu kết quả API (/api/v1): lượt, điểm, nhiệm vụ phải lấy từ máy chủ.
const SHELL = 'hanvui-shell-v1';
const MEDIA = 'hanvui-media-v1';
const KEEP = [SHELL, MEDIA];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(['/', '/manifest.webmanifest', '/icon.svg'])).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => !KEEP.includes(k)).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

const isMedia = (url) =>
  /\.(mp3|m4a|ogg|wav)$/i.test(url.pathname) || /hanzi-writer-data/.test(url.href) || /\/audio\//.test(url.pathname);

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.pathname.startsWith('/api/')) return; // luôn lấy từ máy chủ

  if (isMedia(url)) {
    e.respondWith(
      caches.open(MEDIA).then(async (c) => {
        const hit = await c.match(req);
        if (hit) return hit;
        const res = await fetch(req);
        if (res.ok && (res.type === 'basic' || res.type === 'cors')) c.put(req, res.clone());
        return res;
      }),
    );
    return;
  }

  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).catch(() => caches.match('/').then((r) => r ?? Response.error())));
    return;
  }

  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.open(SHELL).then(async (c) => {
        const hit = await c.match(req);
        const net = fetch(req)
          .then((res) => {
            if (res.ok) c.put(req, res.clone());
            return res;
          })
          .catch(() => hit ?? Response.error());
        return hit ?? net;
      }),
    );
  }
});
