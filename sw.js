// Install Service Worker and Cache Files
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("habit-tracker").then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./bingo.css",
        "./bingo.js",
        "./manifest.json",
        "./icon-192.png",
        "./icon-512.png"
      ]);
    })
  );
});

// Serve Files from Cache
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
