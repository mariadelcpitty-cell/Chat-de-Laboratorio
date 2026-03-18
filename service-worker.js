const CACHE_NAME = 'chatlab-ebes-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://i.postimg.cc/Sx09dc4v/logo.jpg'
];

// Evento de instalación: guarda los archivos esenciales en la memoria del dispositivo
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Archivos cacheados exitosamente');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Evento de activación: limpia cachés antiguos si actualizamos la versión
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Limpiando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Evento fetch: intercepta las peticiones de red para que la app funcione fluida
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si el archivo está en caché, lo devuelve. Si no, lo pide a la red.
        return response || fetch(event.request);
      })
  );
});