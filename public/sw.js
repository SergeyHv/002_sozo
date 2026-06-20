// Service worker SOZO — даёт оффлайн-чтение после первого визита.
// Стратегия: stale-while-revalidate для своих GET-запросов (мгновенно
// отдаём из кэша, в фоне обновляем). Поднимите версию кэша, чтобы
// сбросить старые файлы после крупного обновления.
const CACHE = "sozo-cache-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(req);
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200) cache.put(req, res.clone());
          return res;
        })
        .catch(() => cached);
      // Сразу отдаём кэш, если он есть; иначе ждём сеть.
      return cached || network;
    })(),
  );
});
