const CACHE_NAME = "counter-cache-v1";
const urlsToCache = [
  "./",           // roten för appen
  "./index.html",
  "./manifest.json"
];

// Installera service workern och cacha alla filer
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
      .catch(err => {
        console.error("Cache addAll failed:", err);
      })
  );
});

// Aktivera service workern direkt och rensa gamla cachar
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch-handler för offline-support
self.addEventListener("fetch", event => {
  // Navigeringsbegäran (sidladdningar)
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  // Övriga requests: cache-first
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
