// Huckebein-Kaffeekasse – Service Worker v7
// Neue HTML-Versionen und config.json werden zuerst direkt vom Server geladen.
// Der Cache dient als Rückfallebene bei fehlender Internetverbindung.

const CACHE_NAME = "huckebein-kaffeekasse-v7";
const APP_FILES = ["./", "./index.html", "./config.json", "./manifest.json", "./icon.png"];
const APP_URL = new URL("./index.html", self.registration.scope).href;
const ROOT_URL = self.registration.scope;
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

async function networkFirst(request, canonicalCacheKey, fallbacks = []) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const freshRequest = new Request(request, { cache: "no-cache" });
    const response = await fetch(freshRequest);
    if (response && response.ok) {
      await cache.put(canonicalCacheKey || request, response.clone());
    }
    return response;
  } catch (error) {
    const candidates = [request, canonicalCacheKey, ...fallbacks].filter(Boolean);
    for (const key of candidates) {
      const cached = await cache.match(key);
      if (cached) return cached;
    }
    return new Response(
      "Die Kaffeekasse ist momentan nicht erreichbar. Bitte Internetverbindung prüfen.",
      { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }
}

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Die Konfiguration wird bei jedem Abruf frisch angefordert.
  if (url.pathname.endsWith("/config.json")) {
    event.respondWith(networkFirst(request, CONFIG_URL));
    return;
  }

  // Navigation und index.html: neue App-Versionen dürfen nicht durch
  // eine veraltete Cache-Kopie blockiert werden.
  if (request.mode === "navigate" || url.pathname.endsWith("/index.html")) {
    event.respondWith(networkFirst(request, APP_URL, [ROOT_URL]));
    return;
  }

  // Andere Dateien bleiben cache-first und damit offline verfügbar.
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
