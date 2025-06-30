// public/sw.js - Advanced Service Worker for Sub-1.4s LCP
const CACHE_NAME = 'portfolio-critical-v2';
const STATIC_CACHE = 'portfolio-static-v2';
const API_CACHE = 'portfolio-api-v2';

const CRITICAL_RESOURCES = [
  '/',
  '/images/profile.jpg',
  'https://raw.githubusercontent.com/powrstack/powrstack-folio/refs/heads/main/public/resume.json'
];

const STATIC_RESOURCES = [
  '/images/favicon/favicon-32x32.png',
  '/images/favicon/apple-touch-icon.png',
  '/_next/static/css/',
  '/_next/static/chunks/'
];

// Install event - aggressive caching for instant loads
self.addEventListener('install', (event) => {
  // Skip cache operations if not available (Cloudflare Workers compatibility)
  if (typeof caches === 'undefined') {
    self.skipWaiting();
    return;
  }
  
  event.waitUntil(
    Promise.all([
      // Cache critical resources immediately
      caches.open(CACHE_NAME).then(cache => 
        cache.addAll(CRITICAL_RESOURCES).catch(() => {})
      ).catch(() => {}),
      // Pre-cache static assets
      caches.open(STATIC_CACHE).then(cache => {
        return Promise.all(
          STATIC_RESOURCES.map(url => 
            fetch(url).then(response => {
              if (response.ok) return cache.put(url, response).catch(() => {});
            }).catch(() => {}) // Ignore failures for optional resources
          )
        );
      }).catch(() => {})
    ])
  );
  self.skipWaiting();
});

// Fetch event - stale-while-revalidate for optimal performance
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip cache operations for Cloudflare Workers compatibility
  if (typeof caches === 'undefined') {
    event.respondWith(fetch(request));
    return;
  }
  
  // Critical resources: Cache-first with network fallback
  if (CRITICAL_RESOURCES.some(resource => request.url.includes(resource))) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
          // Serve cached version immediately, update in background
          fetch(request).then(networkResponse => {
            if (networkResponse.ok && typeof caches !== 'undefined') {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(request, networkResponse.clone()).catch(() => {});
              }).catch(() => {});
            }
          }).catch(() => {}); // Silent fail for background updates
          
          return cachedResponse;
        }
        
        // No cache, fetch from network
        return fetch(request).then(networkResponse => {
          if (networkResponse.ok && typeof caches !== 'undefined') {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseClone).catch(() => {});
            }).catch(() => {});
          }
          return networkResponse;
        });
      }).catch(() => fetch(request))
    );
  }
  
  // Static assets: Cache-first
  else if (request.url.includes('/_next/static/') || request.url.includes('/images/')) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        return cachedResponse || fetch(request).then(networkResponse => {
          if (networkResponse.ok && typeof caches !== 'undefined') {
            const responseClone = networkResponse.clone();
            caches.open(STATIC_CACHE).then(cache => {
              cache.put(request, responseClone).catch(() => {});
            }).catch(() => {});
          }
          return networkResponse;
        });
      }).catch(() => fetch(request))
    );
  }
  
  // API calls: Stale-while-revalidate
  else if (request.url.includes('/api/')) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        const fetchPromise = fetch(request).then(networkResponse => {
          if (networkResponse.ok && typeof caches !== 'undefined') {
            const responseClone = networkResponse.clone();
            caches.open(API_CACHE).then(cache => {
              cache.put(request, responseClone).catch(() => {});
            }).catch(() => {});
          }
          return networkResponse;
        });
        
        return cachedResponse || fetchPromise;
      }).catch(() => fetch(request))
    );
  }
});

// Activate event - clean up old caches aggressively
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old versions of caches
          if (cacheName !== CACHE_NAME && 
              cacheName !== STATIC_CACHE && 
              cacheName !== API_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control immediately
      return self.clients.claim();
    })
  );
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'resume-sync') {
    event.waitUntil(
      fetch('https://raw.githubusercontent.com/powrstack/powrstack-folio/refs/heads/main/public/resume.json')
        .then(response => response.json())
        .then(data => {
          // Update cache with fresh data
          if (typeof caches !== 'undefined') {
            return caches.open(CACHE_NAME).then(cache => {
              return cache.put('/api/resume', new Response(JSON.stringify(data))).catch(() => {});
            }).catch(() => {});
          }
        })
        .catch(() => {}) // Silent fail
    );
  }
});

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    if (typeof caches !== 'undefined') {
      caches.keys().then(cacheNames => {
        let totalSize = 0;
        return Promise.all(
          cacheNames.map(cacheName => 
            caches.open(cacheName).then(cache => cache.keys()).catch(() => [])
          )
        ).then(results => {
          results.forEach(keys => totalSize += keys.length);
          event.ports[0].postMessage({ cacheSize: totalSize });
        }).catch(() => {
          event.ports[0].postMessage({ cacheSize: 0 });
        });
      }).catch(() => {
        event.ports[0].postMessage({ cacheSize: 0 });
      });
    } else {
      event.ports[0].postMessage({ cacheSize: 0 });
    }
  }
});
