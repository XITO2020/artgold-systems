// Service Worker Version
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `tabascoin-${CACHE_VERSION}`;

// Cache configurations
const CACHES = {
  static: `${CACHE_NAME}-static`,
  dynamic: `${CACHE_NAME}-dynamic`,
  images: `${CACHE_NAME}-images`,
  api: `${CACHE_NAME}-api`
};

// Assets to cache
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-512x512.png',
  '/icons/icon-192x192.png',
  '/icons/icon-144x144.png',
  '/icons/icon-96x96.png',
  '/icons/icon-72x72.png',
  '/icons/icon-48x48.png',
  '/stamps/uncanny.png',
  '/flags/gb.svg',
  '/flags/fr.svg',
  '/flags/es.svg',
  // Add other static assets
];

// API routes that should be cached
const API_ROUTES = [
  '/api/token-prices',
  '/api/featured-artworks',
];

// Cache duration in milliseconds
const CACHE_DURATION = {
  static: 30 * 24 * 60 * 60 * 1000, // 30 days
  dynamic: 7 * 24 * 60 * 60 * 1000, // 7 days
  api: 5 * 60 * 1000, // 5 minutes
};

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(CACHES.static).then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Cache offline page
      caches.open(CACHES.static).then((cache) => {
        return cache.add('/offline.html');
      })
    ]).then(() => {
      console.log('Installation complete');
      return self.skipWaiting();
    })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith('tabascoin-') && !Object.values(CACHES).includes(name))
            .map((name) => {
              console.log('Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      }),
      // Claim clients
      self.clients.claim()
    ])
  );
});

// Helper function to check if cache is expired
function isCacheExpired(cachedResponse, maxAge) {
  if (!cachedResponse) return true;
  const dateHeader = cachedResponse.headers.get('date');
  if (!dateHeader) return true;
  const cachedTime = new Date(dateHeader).getTime();
  return Date.now() - cachedTime > maxAge;
}

// Helper function to determine cache strategy based on request
function getCacheStrategy(request) {
  const url = new URL(request.url);

  // API requests
  if (url.pathname.startsWith('/api/')) {
    if (API_ROUTES.includes(url.pathname)) {
      return {
        cacheName: CACHES.api,
        strategy: 'stale-while-revalidate',
        maxAge: CACHE_DURATION.api
      };
    }
    return { strategy: 'network-only' };
  }

  // Image requests
  if (request.destination === 'image') {
    return {
      cacheName: CACHES.images,
      strategy: 'cache-first',
      maxAge: CACHE_DURATION.static
    };
  }

  // Static assets
  if (STATIC_ASSETS.includes(url.pathname)) {
    return {
      cacheName: CACHES.static,
      strategy: 'cache-first',
      maxAge: CACHE_DURATION.static
    };
  }

  // Dynamic content
  return {
    cacheName: CACHES.dynamic,
    strategy: 'network-first',
    maxAge: CACHE_DURATION.dynamic
  };
}

// Fetch event
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  const strategy = getCacheStrategy(event.request);

  switch (strategy.strategy) {
    case 'cache-first':
      event.respondWith(
        caches.open(strategy.cacheName).then((cache) => {
          return cache.match(event.request).then((cachedResponse) => {
            if (cachedResponse && !isCacheExpired(cachedResponse, strategy.maxAge)) {
              return cachedResponse;
            }
            return fetch(event.request).then((networkResponse) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          });
        })
      );
      break;

    case 'network-first':
      event.respondWith(
        fetch(event.request)
          .then((networkResponse) => {
            const clonedResponse = networkResponse.clone();
            caches.open(strategy.cacheName).then((cache) => {
              cache.put(event.request, clonedResponse);
            });
            return networkResponse;
          })
          .catch(() => {
            return caches.match(event.request).then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              if (event.request.mode === 'navigate') {
                return caches.match('/offline.html');
              }
              return null;
            });
          })
      );
      break;

    case 'stale-while-revalidate':
      event.respondWith(
        caches.open(strategy.cacheName).then((cache) => {
          return cache.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request).then((networkResponse) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
            return cachedResponse || fetchPromise;
          });
        })
      );
      break;

    case 'network-only':
    default:
      event.respondWith(fetch(event.request));
      break;
  }
});

// Background sync for offline uploads
self.addEventListener('sync', (event) => {
  if (event.tag === 'upload-artwork') {
    event.waitUntil(uploadPendingArtwork());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {
    title: 'New Update',
    body: 'Check out what\'s new!',
    icon: '/icons/icon-192x192.png'
  };
  
  const options = {
    body: data.body,
    icon: data.icon || '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Open',
      },
      {
        action: 'close',
        title: 'Close',
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      const hadClientOpen = clientList.some((client) => {
        if (client.url === event.notification.data.url) {
          client.focus();
          return true;
        }
        return false;
      });

      if (!hadClientOpen) {
        clients.openWindow(event.notification.data.url);
      }
    })
  );
});

// Periodic sync for content updates
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-content') {
    event.waitUntil(updateContent());
  }
});

// Helper function to update cached content
async function updateContent() {
  const cache = await caches.open(CACHES.dynamic);
  const requests = await cache.keys();
  
  return Promise.all(
    requests.map(async (request) => {
      try {
        const response = await fetch(request);
        await cache.put(request, response);
      } catch (error) {
        console.error('Error updating cached content:', error);
      }
    })
  );
}

// Helper function to upload pending artwork
async function uploadPendingArtwork() {
  const pendingUploads = await getPendingUploads();
  
  return Promise.all(
    pendingUploads.map(async (upload) => {
      try {
        await fetch('/api/artwork/upload', {
          method: 'POST',
          body: upload.data
        });
        await removePendingUpload(upload.id);
      } catch (error) {
        console.error('Error uploading artwork:', error);
      }
    })
  );
}