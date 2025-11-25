const CACHE_NAME = 'jagdamba-v6.4';
const urlsToCache = [
  '/',
  '/index.html',
  '/pages/about.html',
  '/pages/gallery.html',
  '/pages/contact.html',
  '/sections/progress.html',
  '/css/main.css',
  '/css/hero.css',
  '/css/home.css',
  '/css/modern-ui.css',
  '/css/footer.css',
  '/css/about.css',
  '/css/gallery.css',
  '/css/contact.css',
  '/css/progress.css',
  '/js/main.js',
  '/js/hero.js',
  '/js/home.js',
  '/js/footer.js',
  '/js/about.js',
  '/js/gallery.js',
  '/js/contact.js',
  '/js/progress.js',
  '/images/logo.png',
  '/images/favicon.ico'
];

self.addEventListener('install', e => {
  console.log('[SW] Installing new version:', CACHE_NAME);
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  console.log('[SW] Activating new version:', CACHE_NAME);
  e.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Cache-first strategy for faster loading
  e.respondWith(
    caches.match(e.request)
      .then(cached => {
        if (cached) return cached;
        
        return fetch(e.request)
          .then(response => {
            // Only cache successful responses
            if (response && response.status === 200) {
              const clonedResponse = response.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(e.request, clonedResponse));
            }
            return response;
          })
          .catch(() => {
            // Fallback to index.html for navigation requests
            if (e.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
          });
      })
  );
});
