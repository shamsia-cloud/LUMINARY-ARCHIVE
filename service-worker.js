const CACHE_NAME = "luminary-archives-v1";

const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",

  "./assets/library-01.webp",
  "./assets/library-02.webp",
  "./assets/library-03.webp",

  "./assets/33_stages_of_war.jpg",
  "./assets/art_of_thinking_clearly.jpg",
  "./assets/art_of_war.jpg",
  "./assets/definitive_book_of_body_language.jpg",
  "./assets/ego_is_the_enemy.jpg",
  "./assets/laws_of_human_nature.jpg",
  "./assets/mastery.jpg",
  "./assets/parapsychology_freud.jpg",
  "./assets/psychology_of_money.jpg",
  "./assets/seduction.jpg",
  "./assets/surrounded_by_psychopaths.jpg",
  "./assets/the_daily_laws.jpg",
  "./assets/the_prince.jpg",
  "./assets/white_nights.jpg"
];

/* Install cache */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );

  self.skipWaiting();
});

/* Activate and remove old caches */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );

  self.clients.claim();
});

/* Serve cached files first, then network */
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type === "opaque"
          ) {
            return networkResponse;
          }

          const responseCopy = networkResponse.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseCopy);
          });

          return networkResponse;
        })
        .catch(() => {
          return caches.match("./index.html");
        });
    })
  );
});