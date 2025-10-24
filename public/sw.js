// PrepFlow Service Worker - Advanced Caching Strategy
// Version 2.0 - Performance Optimized

// Development mode detection
const isDevelopment =
  self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';

const CACHE_NAME = 'prepflow-v2.0';
const STATIC_CACHE = 'prepflow-static-v2.0';
const DYNAMIC_CACHE = 'prepflow-dynamic-v2.0';
const API_CACHE = 'prepflow-api-v2.0';

// Cache strategies
const CACHE_STRATEGIES = {
  // Static assets - Cache First
  STATIC: ['/images/', '/icons/', '/favicon.ico', '/manifest.json'],
  // API calls - Network First with fallback
  API: ['/api/'],
  // Pages - Stale While Revalidate
  PAGES: [
    '/',
    '/webapp/',
    '/webapp/cleaning/',
    '/webapp/temperature/',
    '/webapp/compliance/',
    '/webapp/suppliers/',
    '/webapp/par-levels/',
    '/webapp/order-lists/',
    '/webapp/dish-sections/',
    '/webapp/prep-lists/',
    '/webapp/recipe-sharing/',
    '/webapp/ai-specials/',
    '/privacy-policy/',
    '/terms-of-service/',
  ],
  // Critical resources - Cache First
  CRITICAL: ['/images/dashboard-screenshot.png', '/images/prepflow-logo.png'],
};

// Install event - Cache static assets
self.addEventListener('install', event => {
  console.log('🔧 PrepFlow SW: Installing service worker v2.0');

  if (isDevelopment) {
    console.log('🚧 Development mode: Skipping cache installation');
    self.skipWaiting();
    return;
  }

  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then(cache => {
        return cache.addAll([
          '/',
          '/images/dashboard-screenshot.png',
          '/images/prepflow-logo.png',
          '/images/recipe-screenshot.png',
          '/images/settings-screenshot.png',
          '/images/stocklist-screenshot.png',
          '/manifest.json',
          '/favicon.ico',
        ]);
      }),
      // Cache critical API responses
      caches.open(API_CACHE).then(cache => {
        return cache.addAll([
          '/api/ingredients',
          '/api/recipes',
          '/api/cleaning-areas',
          '/api/cleaning-tasks',
          '/api/temperature-logs',
          '/api/temperature-thresholds',
          '/api/compliance-types',
          '/api/compliance-records',
          '/api/suppliers',
          '/api/supplier-price-lists',
          '/api/par-levels',
          '/api/order-lists',
          '/api/kitchen-sections',
          '/api/prep-lists',
          '/api/recipe-share',
          '/api/ai-specials',
        ]);
      }),
    ]).then(() => {
      console.log('✅ PrepFlow SW: Static assets cached successfully');
      return self.skipWaiting();
    }),
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', event => {
  console.log('🚀 PrepFlow SW: Activating service worker v2.0');

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (
              cacheName !== CACHE_NAME &&
              cacheName !== STATIC_CACHE &&
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== API_CACHE
            ) {
              console.log('🗑️ PrepFlow SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        console.log('✅ PrepFlow SW: Old caches cleaned up');
        return self.clients.claim();
      }),
  );
});

// Fetch event - Advanced caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // In development mode, skip caching for better debugging
  if (isDevelopment) {
    console.log('🚧 Development mode: Bypassing cache for', url.pathname);
    return;
  }

  event.respondWith(handleRequest(request));
});

// Advanced request handling with multiple strategies
async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  try {
    // Strategy 1: Static Assets - Cache First
    if (isStaticAsset(pathname)) {
      return await cacheFirst(request, STATIC_CACHE);
    }

    // Strategy 2: API Calls - Network First with fallback
    if (isApiCall(pathname)) {
      return await networkFirst(request, API_CACHE);
    }

    // Strategy 3: Critical Resources - Cache First
    if (isCriticalResource(pathname)) {
      return await cacheFirst(request, STATIC_CACHE);
    }

    // Strategy 4: Pages - Stale While Revalidate
    if (isPage(pathname)) {
      return await staleWhileRevalidate(request, DYNAMIC_CACHE);
    }

    // Default: Network First
    return await networkFirst(request, DYNAMIC_CACHE);
  } catch (error) {
    console.error('❌ PrepFlow SW: Fetch error:', error);

    // Fallback to cache or offline page
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/') || new Response('Offline', { status: 503 });
    }

    throw error;
  }
}

// Cache First Strategy
async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  const networkResponse = await fetch(request);
  if (networkResponse.ok) {
    try {
      const cache = await caches.open(cacheName);
      await cache.put(request, networkResponse.clone());
    } catch (error) {
      console.warn('Service Worker: Cache put failed:', error);
      // Continue without caching if cache fails
    }
  }

  return networkResponse;
}

// Network First Strategy
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      try {
        const cache = await caches.open(cacheName);
        await cache.put(request, networkResponse.clone());
      } catch (error) {
        console.warn('Service Worker: Cache put failed in networkFirst:', error);
        // Continue without caching if cache fails
      }
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      try {
        cache.put(request, networkResponse.clone());
      } catch (error) {
        console.warn('Service Worker: Cache put failed in staleWhileRevalidate:', error);
        // Continue without caching if cache fails
      }
    }
    return networkResponse;
  });

  return cachedResponse || fetchPromise;
}

// Helper functions
function isStaticAsset(pathname) {
  return CACHE_STRATEGIES.STATIC.some(pattern => pathname.includes(pattern));
}

function isApiCall(pathname) {
  return CACHE_STRATEGIES.API.some(pattern => pathname.startsWith(pattern));
}

function isCriticalResource(pathname) {
  return CACHE_STRATEGIES.CRITICAL.some(pattern => pathname.includes(pattern));
}

function isPage(pathname) {
  return CACHE_STRATEGIES.PAGES.some(pattern => pathname.startsWith(pattern));
}

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('🔄 PrepFlow SW: Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Sync offline data when connection is restored
  try {
    // Sync any pending API calls
    const pendingRequests = await getStoredRequests();
    for (const request of pendingRequests) {
      await fetch(request);
    }
    console.log('✅ PrepFlow SW: Background sync completed');
  } catch (error) {
    console.error('❌ PrepFlow SW: Background sync failed:', error);
  }
}

// Store requests for background sync
async function getStoredRequests() {
  // Implementation for storing and retrieving pending requests
  return [];
}

// Push notifications (future feature)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      vibrate: [100, 50, 100],
      data: data.data,
      actions: data.actions || [],
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();

  event.waitUntil(clients.openWindow(event.notification.data?.url || '/'));
});
