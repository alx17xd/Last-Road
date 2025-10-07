const CACHE_NAME = "lastroad-v2";
const OFFLINE_URL = "/Last-Road/offline.html";

const FILES_TO_CACHE = [
  "/Last-Road/",
  "/Last-Road/index.html",
  "/Last-Road/game.html",
  "/Last-Road/scores.html",
  "/Last-Road/offline.html",
  "/Last-Road/manifest.json",
  "/Last-Road/icons/icon-192x192.png",
  "/Last-Road/icons/icon-512x512.png",
  "/Last-Road/screenshots/captura1.png",
  "/Last-Road/screenshots/captura2.png",
  "/Last-Road/screenshots/captura3.png",
  "/Last-Road/screenshots/captura4.png",
  "/Last-Road/screenshots/captura5.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cached) => cached || fetch(event.request).catch(() => caches.match(OFFLINE_URL)))
  );
});
