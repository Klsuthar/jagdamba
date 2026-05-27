const CACHE_NAME = 'jagdamba-v10.1.0-perf-opt';
const urlsToCache = [
  '/',
  '/index.html',
  '/pwa-info.html',
  '/manifest.json',
  '/site.webmanifest',
  '/pages/about.html',
  '/pages/gallery.html',
  '/pages/contact.html',
  '/sections/progress.html',
  '/components/header.html',
  '/components/footer.html',
  '/components/principal-card.html',
  '/css/main.css',
  '/css/header.css',
  '/css/hero.css',
  '/css/home.css',
  '/css/footer.css',
  '/css/about.css',
  '/css/gallery.css',
  '/css/contact.css',
  '/css/progress.css',
  '/css/animations.css',
  '/css/flip-card.css',
  '/css/principal-card.css',
  '/js/pwa.js',
  '/js/main.js',
  '/js/header.js',
  '/js/hero.js',
  '/js/home.js',
  '/js/footer.js',
  '/js/about.js',
  '/js/gallery.js',
  '/js/contact.js',
  '/js/progress.js',
  '/js/scroll-optimization.js',
  '/js/scroll-animation.js',
  '/json/gallery_events.json',
  '/json/exam_config.json',
  '/json/class1/attendance.json',
  '/json/class1/class1_students.json',
  '/json/class1/half_yearly.json',
  '/json/class1/yearly.json',
  '/json/class2/attendance.json',
  '/json/class2/class2_students.json',
  '/json/class2/half_yearly.json',
  '/json/class2/test1.json',
  '/json/class2/test2.json',
  '/json/class2/test3.json',
  '/json/class2/yearly.json',
  '/json/class3/attendance.json',
  '/json/class3/class3_students.json',
  '/json/class3/half_yearly.json',
  '/json/class3/test1.json',
  '/json/class3/test2.json',
  '/json/class3/test3.json',
  '/json/class3/yearly.json',
  '/images/logo.png',
  '/images/logo.jpg',
  '/images/favicon.ico',
  '/apple-touch-icon.png',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/images/hero-bg.webp',
  '/images/stikers/students.webp',
  '/images/stikers/student_nursary.webp',
  '/images/stikers/student_with_headmaster.webp',
  '/images/stikers/students_120.webp',
  '/images/stikers/teachers_4.webp',
  '/images/stikers/classes_4.webp',
  '/images/stikers/sucess_100.webp',
  '/images/stikers/student_with_teacher.webp',
  '/images/stikers/student.webp',
  '/images/gopalji.jpg',
  '/images/principal.jpg',
  '/images/headmaster.webp',
  '/images/teachers/kanhaiyalal.webp',
  '/images/teachers/pooja.webp',
  '/images/teachers/suman.webp',
  '/images/teachers/renu.webp'
];

self.addEventListener('install', e => {
  console.log('[SW] Installing new version:', CACHE_NAME);
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.all(
        urlsToCache.map(url =>
          fetch(url, { cache: 'no-store' })
            .then(response => {
              if (!response.ok) {
                throw new Error(`Failed to cache ${url}: ${response.status}`);
              }
              return cache.put(url, response);
            })
            .catch(error => {
              console.warn('[SW] Skipping cache entry:', url, error);
            })
        )
      ))
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
