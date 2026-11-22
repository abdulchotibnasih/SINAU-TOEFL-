/* Service worker Simulasi TOEFL iBT
   - File repo (index.html, app.jsx, data-*.js, ikon): ambil versi terbaru dari jaringan dulu,
     pakai salinan cache jika offline atau jaringan lambat (> 4 detik).
   - Library CDN & font (versi terkunci): pakai cache dulu.
   Jika sw.js ini diubah, naikkan angka VERSION agar cache lama dibersihkan. */
const VERSION = "toefl-ibt-v1";
const LOCAL = [
  "./", "index.html", "app.jsx", "data-reading.js", "data-listening.js", "data-speaking-writing.js",
  "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png"
];
const REMOTE = [
  "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4.1.11/dist/index.global.js",
  "https://unpkg.com/react@18.3.1/umd/react.production.min.js",
  "https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js",
  "https://unpkg.com/@babel/standalone@7.26.4/babel.min.js",
  "https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js",
  "https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap"
];
const CDN_HOSTS = ["unpkg.com", "cdn.jsdelivr.net", "fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    await Promise.all(LOCAL.map((u) => cache.add(u).catch(() => {})));
    await Promise.all(REMOTE.map((u) =>
      fetch(new Request(u, { mode: "no-cors" })).then((res) => cache.put(u, res)).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

async function networkFirst(req) {
  const cache = await caches.open(VERSION);
  const cached = (await cache.match(req, { ignoreSearch: true })) ||
    (req.mode === "navigate" ? (await cache.match("./")) || (await cache.match("index.html")) : undefined);
  const net = fetch(req).then((res) => {
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  });
  if (!cached) return net;
  const slow = new Promise((resolve) => setTimeout(() => resolve(cached), 4000));
  return Promise.race([net.catch(() => cached), slow]);
}

async function cacheFirst(req) {
  const cache = await caches.open(VERSION);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
  return res;
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) event.respondWith(networkFirst(req));
  else if (CDN_HOSTS.includes(url.hostname)) event.respondWith(cacheFirst(req));
});
