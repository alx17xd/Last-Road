const CACHE_NAME = "lastroad-v1";

// Archivos que se cachearán
const FILES_TO_CACHE = [
  "/Last-Road-main/index.html",
  "/Last-Road-main/scores.html",
  "/Last-Road-main/manifest.json",
  "/Last-Road-main/icons/iconsicon-192.png.jpg",
  "/Last-Road-main/icons/icons/icon-512-maskable.png",
  "/Last-Road-main/icons/play.png",
  "/Last-Road-main/icons/trophy.png",
  "/Last-Road-main/screenshots/cap1.jpg",
  "/Last-Road-main/screenshots/cap2.jpg",
  "/Last-Road-main/screenshots/cap3.png",
  "/Last-Road-main/screenshots/cap4.png",
  "/Last-Road-main/screenshots/cap5.jpg"
];

// Instalación del service worker y cache inicial
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Activación del service worker y limpieza de caches antiguas
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Estrategia de fetch: cache primero, luego red, fallback offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cached) => cached || fetch(event.request).catch(() => caches.match("/Last-Road-main/index.html")))
  );
});

// Sincronización en segundo plano (ejemplo: enviar puntuaciones)
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-scores") {
    event.waitUntil(syncScores());
  }
});

async function syncScores() {
  // Aquí puedes implementar envío de puntuaciones al servidor
  console.log("Sincronizando puntuaciones en segundo plano...");
}

// Notificaciones push
self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};
  const title = data.title || "Last Road";
  const options = {
    body: data.body || "¡Nuevo contenido disponible!",
    icon: "/Last-Road-main/icons/iconsicon-192.png.jpg"
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
