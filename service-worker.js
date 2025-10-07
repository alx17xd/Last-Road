const CACHE_NAME = 'last-road-cache-v1';
const urlsToCache = [
  '/Last-Road-main/index.html',
  '/Last-Road-main/game.html',
  '/Last-Road-main/scores.html',
  '/Last-Road-main/icons/icon-192.png',
  '/Last-Road-main/icons/icon-512.png',
  '/Last-Road-main/icons/icon-512-maskable.png',
  '/Last-Road-main/icons/play.png',
  '/Last-Road-main/icons/trophy.png',
  '/Last-Road-main/screenshots/cap1.jpg',
  '/Last-Road-main/screenshots/cap2.jpg',
  '/Last-Road-main/screenshots/cap3.png',
  '/Last-Road-main/screenshots/cap4.png',
  '/Last-Road-main/screenshots/cap5.jpg',
  '/Last-Road-main/style.css', // si tienes CSS
  '/Last-Road-main/app.js'     // si tienes JS
];

// Instalación del service worker y cacheo de archivos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activación y limpieza de cachés antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
      );
    })
  );
});

// Intercepción de solicitudes y respuesta desde caché
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

// Opción: sincronización en segundo plano y notificaciones push
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.text() : '¡Last Road te recuerda jugar!';
  const options = {
    body: data,
    icon: '/Last-Road-main/icons/icon-192.png'
  };
  event.waitUntil(
    self.registration.showNotification('Last Road', options)
  );
});

// Función ejemplo para sincronización
async function syncData() {
  // Aquí puedes refrescar datos remotos si los necesitas
  console.log('Sincronización en segundo plano realizada.');
}
