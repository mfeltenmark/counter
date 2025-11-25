self.addEventListener("install", (event) => {
  // Force the service worker to become active immediately
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Take control of all pages immediately
  clients.claim();
});
