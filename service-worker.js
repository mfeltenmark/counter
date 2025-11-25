const CACHE_NAME = "counter-cache-v3";

// Bas-resurser (appshell + viktiga grejer)
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./offline.html",

  // Externa resurser (cachas första gången du är online)
  "https://cdn.tailwindcss.com",
  "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js",
  "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap"
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

// Fetch-handler
self.addEventListener("fetch", event => {
  // Navigeringar (HTML-sidor)
  if (event.request.mode === "navigate") {
    event.respondWith(
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
          caches.match("./index.html")
            .then(resp => resp || caches.match("./offline.html"))
        )
    );
    return;
  }

  // Övriga GET-requests (CSS, JS, fonter, etc)
  if (event.request.method === "GET") {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) {
          return cached;
        }

        return fetch(event.request)
          .then(response => {
            // Lägg nya (framförallt externa) resurser i cache
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, copy);
            });
            return response;
          })
          .catch(() => {
            // Om helt offline och resurs saknas
            if (event.request.destination === "document") {
              return caches.match("./offline.html");
            }
          });
      })
    );
  }
});
