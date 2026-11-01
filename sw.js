// Service Worker for PUJOLS Servicios PWA
const CACHE_NAME = 'pujols-servicios-v15';
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

// Estrategia Network-First: Siempre intenta cargar la versión más reciente desde la red
// Si no hay conexión (offline), utiliza la copia en caché como respaldo
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html')) {
            return caches.match('./index.html');
          }
        });
      })
  );
});
