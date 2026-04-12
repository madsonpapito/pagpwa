self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : { title: 'GanhouBet', body: 'Confira as novidades!' };
  const options = {
    body: data.body,
    icon: '/touro.png',
    badge: '/touro.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' }
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});

// Cache basic assets
const CACHE_NAME = 'ganhou-bet-v1';
const assets = ['/', '/touro.png', '/manifest.json'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(assets))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
