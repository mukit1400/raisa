export default function generateServiceWorker() {
  return `
    // This service worker can be customized as needed
    self.addEventListener('install', (event) => {
      event.waitUntil(
        caches.open('bengali-chat-v1').then((cache) => {
          return cache.addAll([
            '/',
            '/index.html',
            '/icons/icon-192x192.png',
            '/icons/icon-512x512.png',
            // Add other assets you want to cache
          ]);
        })
      );
    });

    self.addEventListener('fetch', (event) => {
      event.respondWith(
        caches.match(event.request).then((response) => {
          // Return cached response if found
          if (response) {
            return response;
          }

          // Clone the request because it's a one-time use stream
          const fetchRequest = event.request.clone();

          return fetch(fetchRequest).then((response) => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response because it's a one-time use stream
            const responseToCache = response.clone();

            caches.open('bengali-chat-v1').then((cache) => {
              cache.put(event.request, responseToCache);
            });

            return response;
          }).catch(() => {
            // If fetch fails (offline), try to return a fallback
            if (event.request.url.indexOf('/api/') !== -1) {
              return new Response(JSON.stringify({
                content: "I'm currently offline. Please check your internet connection and try again.",
                role: "assistant",
                isError: true
              }), {
                headers: { 'Content-Type': 'application/json' }
              });
            }
          });
        })
      );
    });

    self.addEventListener('activate', (event) => {
      const cacheWhitelist = ['bengali-chat-v1'];
      event.waitUntil(
        caches.keys().then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => {
              if (cacheWhitelist.indexOf(cacheName) === -1) {
                return caches.delete(cacheName);
              }
            })
          );
        })
      );
    });
  `
}
