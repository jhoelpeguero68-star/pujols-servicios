// Service Worker for PUJOLS Servicios PWA
const CACHE_NAME = 'pujols-servicios-v33';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './css/layout.css',
  './css/components.css',
  './css/print.css',
  './js/store.js',
  './js/google-sync.js',
  './js/app.js',
  './js/modules/auth.js',
  './js/modules/dashboard.js',
  './js/modules/clientes.js',
  './js/modules/equipos.js',
  './js/modules/servicios.js',
  './js/modules/facturacion.js',
  './js/modules/finanzas.js',
  './js/modules/recordatorios.js',
  './js/modules/configuracion.js',
  './assets/logo.jpg',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/favicon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).catch(err => {
      console.warn('Cache install warning:', err);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Eliminando cache antiguo:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estrategia Network-First con fallback seguro y soporte para query-params (?v=X)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // NO interceptar APIs externas de Google (Sheets, Drive, Auth)
  try {
    const url = new URL(event.request.url);
    if (url.origin !== self.location.origin) {
      return; // Dejar que el navegador maneje la peticiÃ³n de red normal
    }
  } catch (e) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // En caso de fallo o modo offline, buscar en cachÃ© ignorando parÃ¡metros de versiÃ³n (?v=X)
        return caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html')) {
            return caches.match('./index.html', { ignoreSearch: true });
          }
        });
      })
  );
});
