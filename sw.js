const CACHE_NAME = 'my-pwa-cache-v5.2';
const GH_PAGES_PATH = '/test-pwa';
const urlsToCache = [
  `${GH_PAGES_PATH}/`,
  `${GH_PAGES_PATH}/index.html`,
  `${GH_PAGES_PATH}/page1.html`,
  `${GH_PAGES_PATH}/manifest.json`,
  'https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic',
  'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css',
  'https://cdnjs.cloudflare.com/ajax/libs/milligram/1.4.1/milligram.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => {
        // Immediately move this SW into activate phase
        return self.skipWaiting();
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // No cache hit - fetch from network
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(
        names.map(name => {
          if (name !== CACHE_NAME) return caches.delete(name);
        })
      )
    )
    .then(() => {
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
});

// at the bottom of sw.js
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
