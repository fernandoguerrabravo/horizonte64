// Service worker mínimo: permite instalar Batallón Atacama como app.
// No guarda nada en caché; el juego siempre se descarga del sitio.
self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", function () {});
