const CACHE_NAME = "counter-cache-v4";
const urlsToCache = [
  "/counter/",
  "/counter/index.html",
  "/counter/manifest.json",
  "/counter/icons/icon-192x192.png",
  "/counter/icons/icon-512x512.png"
];

// Installera service workern och cacha alla filer
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Aktivera service workern direkt och rensa gamla cachar
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Hantera fetch: returnera cache om offline, fallback till index.html
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Returnera från cache om vi har filen
      if (response) return response;

      // Annars returnera index.html som fallback
      return caches.match("/counter/index.html");
    })
  );
});
