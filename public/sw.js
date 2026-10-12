const CACHE_NAME = 'scripture-journey-v2'
const BASE = ''

// Pages and assets to pre-cache
const PRECACHE_URLS = [
  `${BASE}/`,
  `${BASE}/dashboard`,
  `${BASE}/prophecies`,
  `${BASE}/map`,
  `${BASE}/sources`,
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith('scripture-journey-') && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event

  // Never cache API/auth responses, cross-origin requests, or mutations.
  const url = new URL(request.url)
  if (request.method !== 'GET' || url.origin !== self.location.origin ||
      url.pathname.startsWith('/api/') || url.pathname.startsWith('/auth/')) return

  // Network-first for HTML pages, cache-first for static assets
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok && !response.redirected) {
            const clone = response.clone()
            event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(request, clone)))
          }
          return response
        })
        .catch(async () => (await caches.match(request)) || Response.error())
    )
  } else {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached
        return fetch(request).then((response) => {
          if (response.ok && !response.redirected) {
            const clone = response.clone()
            event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(request, clone)))
          }
          return response
        })
      })
    )
  }
})

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting()
})
