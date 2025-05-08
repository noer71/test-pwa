const CACHE_NAME = 'my-pwa-cache-v3';
const GH_PAGES_PATH = '/test-pwa';
const urlsToCache = [
  `${GH_PAGES_PATH}/`, // Cache the start URL path
  `${GH_PAGES_PATH}/index.html`, // Explicitly cache index.html path
  `${GH_PAGES_PATH}/page1.html`, // Explicitly cache page1.html path
  `${GH_PAGES_PATH}/manifest.json`, // Explicitly cache manifest path
  'https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic',
  'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css',
  'https://cdnjs.cloudflare.com/ajax/libs/milligram/1.4.1/milligram.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
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

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Delete old caches
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});