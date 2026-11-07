self.addEventListener('fetch', function(event) {
  // Sorgt nur dafür, dass die App die iOS-Kriterien erfüllt
  event.respondWith(fetch(event.request));
});