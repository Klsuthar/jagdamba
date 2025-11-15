const CACHE_NAME = 'jagdamba-v2.9';
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
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(response => response || fetch(e.request))
      .catch(() => caches.match('/index.html'))
  );
});
