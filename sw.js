const CACHE_NAME = 'jagdamba-v3.0';
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
    ).then(() => {
      console.log('[SW] Claiming clients');
      return self.clients.claim();
    }).then(() => {
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          console.log('[SW] Reloading client:', client.url);
          client.postMessage({ type: 'FORCE_RELOAD' });
        });
      });
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(response => {
        const clonedResponse = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clonedResponse));
        return response;
      })
      .catch(() => caches.match(e.request))
      .catch(() => caches.match('/index.html'))
  );
});
