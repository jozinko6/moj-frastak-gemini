const CACHE_NAME = 'frastak-pwa-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-512.png'
];

// Install Service Worker and cache essential shell materials
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching App Shell and static assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate & clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Cache-first falling back to Network strategy with Dynamic Caching for CSS and JS
self.addEventListener('fetch', (event) => {
  const req = event.request;
  
  // Only handle HTTP/HTTPS, skip other schemes (e.g. chrome-extension, data:)
  if (!req.url.startsWith('http')) return;

  // Let dev server / API routes handle themselves, or use network first
  if (req.url.includes('/api/') || req.url.includes('hot-update')) {
    event.respondWith(
      fetch(req).catch(() => {
        return new Response(JSON.stringify({ 
          error: "Ste v offline režime. Tieto informácie budú aktualizované po obnovení pripojenia.",
          isOffline: true
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // Handle SPA routing: fall back to index.html for navigation requests
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => {
        return caches.match('/index.html') || caches.match('/');
      })
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached, but optionally update cache in background (Stale-While-Revalidate)
        fetch(req).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(req, networkResponse));
          }
        }).catch(() => {/* Ignore network errors during stale updates */});
        
        return cachedResponse;
      }

      return fetch(req).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // Cache newly fetched assets dynamically (like scripts, styles, fonts)
        const fileExtension = req.url.split('.').pop()?.split('?')[0];
        const cacheableExtensions = ['js', 'css', 'woff2', 'png', 'jpg', 'svg', 'jpeg', 'ico'];
        
        if (cacheableExtensions.includes(fileExtension || '')) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, responseToCache);
          });
        }

        return networkResponse;
      }).catch(() => {
        // If fetch fails and it's a static image, we can return a placeholder or just let it fail
        console.log('[Service Worker] Fetch failed, resource offline:', req.url);
      });
    })
  );
});
