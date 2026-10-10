// Olas que llegan a la orilla, suben por la arena y se retiran (portada de Horizonte 64).
// Se dibuja en un <canvas> a 1/4 de la resolución del paisaje (340x192) y se escala pixelado,
// para que la espuma tenga el mismo tamaño de píxel que el dibujo.
(function () {
  var canvas = document.querySelector(".hero-window .orilla");
  if (!canvas || !canvas.getContext) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var W = 340, H = 192, S = 4; // S: escala respecto a la imagen original (1360x768)
  canvas.width = W; canvas.height = H;
  var ctx = canvas.getContext("2d");

  // Orilla trazada sobre paisaje-h64.webp (coordenadas de la imagen original): x donde empieza la arena
  var shore = [
    [505, 1360], [517, 1055], [535, 930], [550, 820], [570, 805], [595, 760], [612, 720],
    [630, 695], [645, 590], [665, 530], [680, 545], [705, 640], [730, 680], [768, 705]
  ];
  var yTop = Math.ceil(shore[0][0] / S), yBot = H - 1;
  var edge = []; // x de la orilla por fila del canvas
  for (var y = yTop; y <= yBot; y++) {
    var iy = y * S, x = shore[shore.length - 1][1];
    for (var i = 0; i < shore.length - 1; i++) {
      var a = shore[i], b = shore[i + 1];
      if (iy >= a[0] && iy <= b[0]) { x = a[1] + (b[1] - a[1]) * (iy - a[0]) / (b[0] - a[0]); break; }
    }
    edge[y] = x / S;
  }

  function hash(x, y) { var n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return n - Math.floor(n); }

  // Alcance de una ola en su ciclo (0..1): se acerca, sube rápido por la arena y se retira lento
  function ola(p) {
    if (p < 0.25) return { approach: 1 - p / 0.25, run: 0 };            // línea de espuma acercándose
    if (p < 0.5)  { var q = (p - 0.25) / 0.25; return { approach: 0, run: Math.sin(q * Math.PI / 2) }; }
    var r = (p - 0.5) / 0.5; return { approach: 0, run: 1 - r * r * (3 - 2 * r), receding: true };
  }

  var start = performance.now();
  var waves = [{ period: 5.2, offset: 0 }, { period: 5.2, offset: 0.5 }];

  function frame(now) {
    var t = (now - start) / 1000;
    ctx.clearRect(0, 0, W, H);

    waves.forEach(function (wv) {
      var p = ((t / wv.period) + wv.offset) % 1;
      var s = ola(p);
      for (var y = yTop; y <= yBot; y++) {
        var x0 = edge[y];
        var depth = (y - yTop) / (yBot - yTop);       // 0 en el horizonte, 1 abajo
        var reach = y * S > 685 ? 3 : 2 + depth * 9;    // cuánto sube por la arena (en las rocas, poco)
        var wob = Math.sin(y * 0.35 + t * 1.3) * 0.8;   // borde irregular

        if (s.approach > 0) {
          // línea de espuma en el agua acercándose a la orilla
          var xa = x0 - s.approach * (6 + depth * 10) + wob;
          for (var k = 0; k < 3; k++) {
            if (hash(Math.floor(xa) + k, y + Math.floor(t * 3)) > 0.35) {
              ctx.fillStyle = "rgba(240, 248, 255," + (0.5 + 0.45 * (1 - s.approach)) + ")";
              ctx.fillRect(Math.floor(xa) + k, y, 1, 1);
            }
          }
          continue;
        }

        var front = x0 + s.run * reach + wob;
        // arena mojada (más oscura) donde llegó el agua
        ctx.fillStyle = s.receding ? "rgba(60, 30, 15, " + (0.15 + 0.3 * s.run) + ")" : "rgba(40, 70, 120, 0.4)";
        ctx.fillRect(Math.floor(x0 - 1), y, Math.max(0, Math.ceil(front - x0 + 1)), 1);
        // agua fina sobre la arena mientras sube
        if (!s.receding) {
          ctx.fillStyle = "rgba(110, 170, 235, 0.5)";
          ctx.fillRect(Math.floor(x0 - 1), y, Math.max(0, Math.ceil(front - x0 - 1)), 1);
        }
        // espuma blanca en el frente de la ola
        var a = s.receding ? 0.25 + 0.5 * s.run : 0.9;
        for (var j = 0; j < 3; j++) {
          if (hash(Math.floor(front) - j, y) > 0.2) {
            ctx.fillStyle = "rgba(245, 248, 255," + a + ")";
            ctx.fillRect(Math.floor(front) - j, y, 1, 1);
          }
        }
        // burbujas que quedan al retirarse
        if (s.receding) {
          for (var bx = Math.floor(x0); bx < Math.floor(x0 + reach); bx++) {
            if (hash(bx, y * 7 + Math.floor(t * 2)) > 0.93) {
              ctx.fillStyle = "rgba(235, 240, 255," + (0.5 * s.run) + ")";
              ctx.fillRect(bx, y, 1, 1);
            }
          }
        }
      }
    });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
