const CACHE_NAME = "counter-cache-v3";
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "/counter/icons/icon-192x192.png",
  "/counter/icons/icon-512x512.png",
];

self.addEventListener("install", event => {
  console.log('[SW v3] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
      .catch(err => console.error("[SW] Cache failed:", err))
  );
});

self.addEventListener("activate", event => {
  console.log('[SW v3] Activating...');
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  // HTML: Network-first (alltid försök hämta nytt)
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Övriga: Cache-first
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});