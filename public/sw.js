/**
 * GanhouBet Service Worker v3
 * Força a atualização do cache e melhora a entrega de Push.
 */

const CACHE_NAME = 'ganhou-bet-v3';
const assets = ['/', '/touro.png', '/manifest.json'];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(assets))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('push', function(event) {
  let data = { title: 'GanhouBet', body: 'Confira as novidades!' };
  try {
    data = event.data ? event.data.json() : data;
  } catch (e) {
    console.warn('Push data was not JSON:', event.data.text());
  }

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
  let url = event.notification.data.url || '/';
  const trackingParams = 'utm_source=pwa&utm_medium=push_click&utm_campaign=remarketing_pwa';
  url += (url.includes('?') ? '&' : '?') + trackingParams;

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url === url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

self.addEventListener('fetch', event => {
  // Estratégia Network First para documentos (páginas HTML)
  // Isso garante que mudanças de design sejam vistas imediatamente
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Estratégia Cache First para imagens e assets (performance)
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
