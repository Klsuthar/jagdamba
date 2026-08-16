const CACHE_VERSION = 'jagdamba-v13';
const IMAGE_CACHE_NAME = 'jagdamba-images-v1';
const STATIC_CACHE_NAME = `jagdamba-static-${CACHE_VERSION}`;

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          // Keep IMAGE_CACHE_NAME persistent across versions so gallery images stay cached forever
          if (key !== IMAGE_CACHE_NAME && key !== STATIC_CACHE_NAME) {
            console.log('[SW] Cleaning old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Image Cache-First handler
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // 1. Permanent Cache-First strategy for images (/images/** and image extensions)
  const isImage =
    e.request.destination === 'image' ||
    url.pathname.startsWith('/images/') ||
    /\.(png|jpg|jpeg|webp|svg|gif|ico)$/i.test(url.pathname);

  if (isImage && e.request.method === 'GET') {
    e.respondWith(
      caches.open(IMAGE_CACHE_NAME).then((cache) => {
        return cache.match(e.request).then((cachedResponse) => {
          if (cachedResponse) {
            // Serve instantly from persistent cache without re-downloading!
            return cachedResponse;
          }

          // First download -> Cache cloned response permanently
          return fetch(e.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                cache.put(e.request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => cachedResponse);
        });
      })
    );
    return;
  }

  // 2. Default: network-first for scripts, HTML, and data JSON
  e.respondWith(fetch(e.request));
});
