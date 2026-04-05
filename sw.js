const CACHE_NAME = 'healthy-pixel-shell-v4';
const SCOPE_URL = new URL(self.registration.scope);
const INDEX_URL = new URL('index.html', SCOPE_URL).toString();
const APP_SHELL = [
  new URL('./', SCOPE_URL).toString(),
  INDEX_URL,
  new URL('manifest.webmanifest', SCOPE_URL).toString(),
  new URL('favicon.svg', SCOPE_URL).toString(),
  new URL('icon-192.png', SCOPE_URL).toString(),
  new URL('icon-512.png', SCOPE_URL).toString()
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);
  const isSameOrigin = requestUrl.origin === SCOPE_URL.origin;

  if (!isSameOrigin) {
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(INDEX_URL, cloned));
          return response;
        })
        .catch(async () => {
          const cachedIndex = await caches.match(INDEX_URL);
          return cachedIndex ?? Response.error();
        })
    );

    return;
  }

  if (requestUrl.pathname.endsWith('/sw.js')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request)
        .then((response) => {
          if (!response.ok) {
            return response;
          }

          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
          return response;
        });
    })
  );
});
