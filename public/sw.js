// This service worker can be customized as needed
const CACHE_NAME = "bengali-chat-v1"

// Add URLs of resources you want to cache
const urlsToCache = [
  "/",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/apple-touch-icon.png",
  "/icons/favicon-16x16.png",
  "/icons/favicon-32x32.png",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    }),
  )
})

self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return
  }

  // For API requests, try network first, then fallback to offline message
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({
            content: "I'm currently offline. Please check your internet connection and try again.",
            role: "assistant",
            isError: true,
          }),
          {
            headers: { "Content-Type": "application/json" },
          },
        )
      }),
    )
    return
  }

  // For other requests, try cache first, then network
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if found
      if (response) {
        return response
      }

      // If not in cache, fetch from network
      return fetch(event.request)
        .then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }

          // Clone the response because it's a one-time use stream
          const responseToCache = response.clone()

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
        .catch(() => {
          // If it's a page navigation, return the offline page
          if (event.request.mode === "navigate") {
            return caches.match("/offline")
          }

          // Otherwise just fail
          return new Response("Offline content not available")
        })
    }),
  )
})

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})
