# Horizonte 64 Software — sitio web

Sitio estático (HTML + CSS) del estudio Horizonte 64 Software (basado en el kit de marca de ~/Documents/horizonte64_assets_web), pensado para GitHub Pages.

## Estructura

```
index.html            portada, catálogo de juegos y estudio
css/style.css         estilo synthwave
img/                  logos, portadas y favicon
juegos/<nombre>/      cada juego publicado (build WebGL de Unity)
.nojekyll             evita que GitHub Pages procese el sitio con Jekyll
```

## Agregar un juego

1. Exportar el juego desde Unity como **Web (WebGL)** dentro de `juegos/<nombre>/`.
2. Poner su portada y logo en `img/`.
3. En `index.html`, copiar un bloque `<article class="game">` y cambiar textos, imágenes y link.

## Ver el sitio en local

```bash
python3 -m http.server 8064
```

y abrir http://127.0.0.1:8064
