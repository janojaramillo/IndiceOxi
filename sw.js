/* Service worker — Índices de Oxigenación Neonatal
   Estrategia: cache-first para el núcleo de la aplicación, de modo que
   abra instantáneamente y funcione sin conexión. La red solo se usa para
   refrescar en segundo plano cuando hay internet.

   Al publicar una versión nueva, suba el número de CACHE: eso descarta
   el caché anterior y fuerza la actualización en todos los teléfonos. */

const CACHE = "oxigenacion-v3";

const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./apple-touch-icon.png",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./favicon-32.png",
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      // addAll falla entero si un archivo falta; se piden uno por uno
      // para que un icono ausente no impida la instalación.
      .then(c => Promise.all(CORE.map(u => c.add(u).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Navegación: servir index.html desde caché aunque no haya red.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put("./index.html", copy));
          return res;
        })
        .catch(() => caches.match("./index.html").then(r => r || caches.match("./")))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(hit => {
      if (hit) {
        // Refresco silencioso para la próxima apertura.
        fetch(req).then(res => {
          if (res && res.ok) caches.open(CACHE).then(c => c.put(req, res));
        }).catch(() => {});
        return hit;
      }
      return fetch(req).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      });
    })
  );
});
