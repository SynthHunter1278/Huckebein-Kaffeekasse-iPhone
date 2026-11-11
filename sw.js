const CACHE_NAME = "huckebein-kaffeekasse-v4";
const APP_FILES = ["./", "./index.html", "./config.json", "./manifest.json", "./icon.png"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // config.json immer zuerst direkt vom Server holen. Nur offline wird der Cache genutzt.
  if (url.pathname.endsWith("/config.json")) {
    event.respondWith((async () => {
      try {
        const freshRequest = new Request(request, { cache: "no-store" });
        const response = await fetch(freshRequest);
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put("./config.json", response.clone());
        }
        return response;
      } catch (error) {
        const cached = await caches.match("./config.json");
        return cached || Response.error();
      }
    })());
    return;
  }

  // Die übrigen App-Dateien bleiben offline verfügbar.
  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      }
      return response;
    }))
  );
});
