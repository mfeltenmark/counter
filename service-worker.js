const CACHE_NAME = "counter-cache-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json"
];

// Installera service workern och cacha alla filer
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Aktivera service workern direkt
self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

// Fetch-handler för offline-support
self.addEventListener("fetch", event => {
  // Om det är en navigeringsbegäran (alltså när användaren skriver URL eller klickar på länkar)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match("./index.html")
        .then(response => response || fetch(event.request))
    );
    return;
  }

  // Annars: försök hämta från cache först, annars från nätverket
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
