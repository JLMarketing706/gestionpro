// A more robust service worker to ensure reliability and proper caching.
// Versioning the cache is crucial for updates.
const CACHE_NAME = 'gestion-pro-v2'; 

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  // External assets that are stable
  'https://cdn.tailwindcss.com',
  // NOTE: app assets like index.tsx are handled by the fetch event
];

// Install event: cache core assets and take control immediately.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching core assets');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Activate new worker immediately
  );
});

// Activate event: clean up old caches.
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of open pages
  );
});

// Fetch event: serve from cache first (cache-first strategy).
self.addEventListener('fetch', (event) => {
  // We only handle GET requests.
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // If a cached response is found, return it.
        if (cachedResponse) {
          return cachedResponse;
        }

        // If not in cache, fetch from the network.
        return fetch(event.request).then(
          (networkResponse) => {
            // Check if we received a valid response to cache.
            // We don't cache opaque responses (type 'opaque') which are for cross-origin requests made with 'no-cors'.
            // Also, we don't cache chrome extension files.
            if (
              !networkResponse || 
              networkResponse.status !== 200 || 
              networkResponse.type === 'opaque' ||
              event.request.url.startsWith('chrome-extension://')
            ) {
              return networkResponse;
            }

            // Clone the response because it's a stream and can only be consumed once.
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        ).catch(error => {
            // Handle fetch errors, e.g., user is offline.
            // You could return a custom offline fallback page here if you had one cached.
            console.error('Service Worker: Fetch failed.', error);
            // Let the browser handle the error.
            throw error;
        });
      })
  );
});