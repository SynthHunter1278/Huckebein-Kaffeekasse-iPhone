// Huckebein-Kaffeekasse – Service Worker v5
// index.html und config.json werden bevorzugt frisch vom Server geladen.
// Der Cache dient nur als Rückfallebene, wenn keine Verbindung besteht.

const CACHE_NAME = "huckebein-kaffeekasse-v5";
const APP_FILES = ["./", "./index.html", "./config.json", "./manifest.json", "./icon.png"];
const CONFIG_URL = new URL("./config.json", self.registration.scope).href;

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
        keys
          .filter(key => key.startsWith("huckebein-kaffeekasse-") && key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

async function networkFirst(request, cacheKey = request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    // no-cache erzwingt eine Serverprüfung; der Zeitstempel in index.html
    // verhindert zusätzlich, dass eine alte config.json aus dem HTTP-Cache kommt.
    const freshRequest = new Request(request, { cache: "no-cache" });
    const response = await fetch(freshRequest);
    if (response && response.ok) {
      await cache.put(cacheKey, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(cacheKey) || await caches.match(request);
    if (cached) return cached;
    return new Response("Die Kaffeekasse ist momentan nicht erreichbar. Bitte Internetverbindung prüfen.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  }
}

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Konfiguration bei jedem Aufruf direkt vom Server holen.
  // Cache-Fallback gibt es ausschließlich bei fehlender Netzwerkverbindung.
  if (url.pathname.endsWith("/config.json")) {
    event.respondWith(networkFirst(request, CONFIG_URL));
    return;
  }

  // HTML-Seiten ebenfalls network-first: neue App-Versionen dürfen nicht
  // dauerhaft durch eine alte Cache-Kopie blockiert werden.
  if (request.mode === "navigate" || url.pathname.endsWith("/index.html")) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Bilder, Manifest und sonstige Ressourcen bleiben offline verfügbar.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response && response.ok) await cache.put(request, response.clone());
      return response;
    } catch (error) {
      return new Response("Ressource nicht verfügbar.", { status: 503 });
    }
  })());
});
