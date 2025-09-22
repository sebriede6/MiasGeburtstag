// Service Worker für Mias Geburtstagskarte
const CACHE_NAME = 'birthday-card-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    // Keine MP3, favicon, manifest mehr cachen
    'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Fredoka+One&display=swap'
];

// Installation

self.addEventListener('install', function(event) {
    self.skipWaiting(); // Sofort aktivieren
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Cache geöffnet');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(name) {
                    return name !== CACHE_NAME;
                }).map(function(name) {
                    return caches.delete(name);
                })
            );
        })
    );
    self.clients.claim(); // Sofort übernehmen
});

// Fetch Events
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    return response;
                }
                return fetch(event.request).catch(() => new Response('', {status: 404}));
            })
    );
});
