// This is a basic service worker
// It doesn't do much, but it's required for a PWA

self.addEventListener('install', event => {
  console.log('Service worker installing...');
  // Add a call to skipWaiting here
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service worker activating...');
});

self.addEventListener('fetch', event => {
  // console.log('Fetching:', event.request.url);
});
