// This is a basic service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  // Pre-cache assets here if needed
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  // Clean up old caches here
});

self.addEventListener('fetch', (event) => {
  // console.log('Service Worker: Fetching', event.request.url);
  // Basic cache-first strategy (can be improved)
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
