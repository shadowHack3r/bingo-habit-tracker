// Install Service Worker and Cache Files
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("habit-tracker").then(cache => {
      return cache.addAll([
        "/bingo-habit-tracker/",
        "/bingo-habit-tracker/index.html",
        "/bingo-habit-tracker/bingo.css",
        "/bingo-habit-tracker/bingo.js",
        "/bingo-habit-tracker/manifest.json",
        "/bingo-habit-tracker/icon-192.png",
        "/bingo-habit-tracker/icon-512.png"
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
