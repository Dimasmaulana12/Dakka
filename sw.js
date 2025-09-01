// Service Worker for DMAZ TOOLS PWA
const CACHE_NAME = 'dmaz-tools-v2.0';
const STATIC_CACHE_NAME = 'dmaz-static-v2.0';
const DYNAMIC_CACHE_NAME = 'dmaz-dynamic-v2.0';

const STATIC_FILES = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

const DYNAMIC_FILES = [
    'https://generativelanguage.googleapis.com/',
    'https://api.ferdev.my.id/',
    'https://tikwm.com/'
];

// Install event
self.addEventListener('install', function(event) {
    console.log('SW: Install event');
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then(function(cache) {
                console.log('SW: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                return self.skipWaiting();
            })
    );
});

// Activate event
self.addEventListener('activate', function(event) {
    console.log('SW: Activate event');
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
                        console.log('SW: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

// Fetch event
self.addEventListener('fetch', function(event) {
    const requestUrl = new URL(event.request.url);
    
    // Handle API requests (don't cache)
    if (requestUrl.href.includes('generativelanguage.googleapis.com') || 
        requestUrl.href.includes('api.ferdev.my.id') ||
        requestUrl.href.includes('tikwm.com')) {
        event.respondWith(
            fetch(event.request).catch(() => {
                return new Response('{"error": "Network unavailable"}', {
                    status: 503,
                    headers: { 'Content-Type': 'application/json' }
                });
            })
        );
        return;
    }
    
    // Handle static files
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Return cached version if available
                if (response) {
                    return response;
                }
                
                // Clone the request for fetch
                const fetchRequest = event.request.clone();
                
                return fetch(fetchRequest).then(function(response) {
                    // Check if valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // Clone the response for caching
                    const responseToCache = response.clone();
                    
                    // Determine which cache to use
                    const cacheKey = requestUrl.href.includes(self.location.origin) ? 
                        STATIC_CACHE_NAME : DYNAMIC_CACHE_NAME;
                    
                    caches.open(cacheKey).then(function(cache) {
                        cache.put(event.request, responseToCache);
                    });
                    
                    return response;
                }).catch(function() {
                    // Return offline page or fallback
                    if (event.request.destination === 'document') {
                        return caches.match('/index.html');
                    }
                });
            })
    );
});

// Background sync for chat history
self.addEventListener('sync', function(event) {
    if (event.tag === 'background-sync-chat') {
        event.waitUntil(syncChatHistory());
    }
});

// Push notification handler
self.addEventListener('push', function(event) {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/icon-192x192.png',
            badge: '/icon-72x72.png',
            data: data.data || {},
            actions: [
                {
                    action: 'open',
                    title: 'Open DMAZ TOOLS'
                },
                {
                    action: 'close',
                    title: 'Close'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title || 'DMAZ TOOLS', options)
        );
    }
});

// Notification click handler
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Helper functions
async function syncChatHistory() {
    try {
        // Implement chat history sync logic here
        console.log('SW: Syncing chat history');
        return Promise.resolve();
    } catch (error) {
        console.error('SW: Chat sync failed:', error);
        return Promise.reject(error);
    }
}

// Message handler for communication with main thread
self.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
