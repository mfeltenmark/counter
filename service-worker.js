const CACHE_NAME = "counter-cache-v2"; // bumpa version vid nya releaser

// Bas-resurser som ska finnas offline
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./offline.html",
  "https://cdn.tailwindcss.com",
  "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js"
];

// Installera service workern och cacha viktiga filer
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

// Aktivera service workern och rensa gamla cachar
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

// Fetch-handler: appshell + cache-first för statiska resurser
self.addEventListener("fetch", event => {
  // Hantera sidnavigeringar (HTML)
  if (event.request.mode === "navigate") {
    event.respondWith(
      // Försök nätet först
      fetch(event.request)
        .then(response => {
          // Uppdatera index.html i cache med senaste versionen
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put("./index.html", copy);
          });
          return response;
        })
        .catch(() =>
          // Om offline: försök index.html från cache,
          // annars visa offline.html
          caches.match("./index.html")
            .then(resp => resp || caches.match("./offline.html"))
        )
    );
    return;
  }

  // Övriga GET-requests: cache-first, fallback nätet
  if (event.request.method === "GET") {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) {
          return cached;
        }

        return fetch(event.request)
          .then(response => {
            // Lägg nya resurser i cache (t.ex. CDN scripts)
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, copy);
            });
            return response;
          })
          .catch(() => {
            // Vid total offline och resurs saknas:
            // om det är ett dokument → visa offline-sidan
            if (event.request.destination === "document") {
              return caches.match("./offline.html");
            }
          });
      })
    );
  }
});
