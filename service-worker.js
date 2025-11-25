const CACHE_NAME = "counter-cache-v2";

const urlsToCache = [
  "./",             // roten
  "./index.html",
  "./manifest.json",
  "./styles.css",
  "./offline.html"
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
        .catch(() =>
          // Om nätet är nere: försök index från cache, annars offline.html
          caches.match("./index.html")
            .then(resp => resp || caches.match("./offline.html"))
        )
    );
    return;
  }

  // Övriga requests: cache-first
  if (event.request.method === "GET") {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});
