/* ==========================================================================
   Bloque de descripción: barrido amarillo de «Barranco Amarillo» y ruido de
   vídeo analógico de fondo. Todo opcional: sin JS el texto se lee igual.
   ========================================================================== */
(function(){
"use strict";

var seccion = document.querySelector(".descripcion");
if(!seccion) return;
var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---- Barrido del subrayado: solo la primera vez ---- */
var marca = seccion.querySelector(".ba-mark");
if(marca){
  if(reduce || !("IntersectionObserver" in window)){
    marca.classList.add("is-on");
  } else {
    new IntersectionObserver(function(entradas, obs){
      entradas.forEach(function(e){
        if(e.isIntersecting){ marca.classList.add("is-on"); obs.disconnect(); }
      });
    }, { threshold:0.6 }).observe(marca);
  }
}

/* ---- Ruido analógico ---- */
var canvas = seccion.querySelector(".descripcion-ruido");
if(!canvas) return;
var ctx = canvas.getContext("2d");
if(!ctx) return;

var ESCALA = 3;          // el canvas es 1/3 del tamaño real: grano gordo
var FPS = 24, PASO = 1000 / FPS;
var OPACIDAD = 0.12;
var w = 0, h = 0, datos = null, px = null;
var semilla = (Math.random() * 0xffffffff) >>> 0 || 1;

// xorshift32: más barato que Math.random() por píxel y sin asignaciones.
function rnd(){
  semilla ^= semilla << 13; semilla >>>= 0;
  semilla ^= semilla >>> 17;
  semilla ^= semilla << 5;  semilla >>>= 0;
  return semilla;
}

function medir(){
  var nw = Math.max(1, Math.ceil(seccion.clientWidth  / ESCALA));
  var nh = Math.max(1, Math.ceil(seccion.clientHeight / ESCALA));
  if(nw === w && nh === h) return;
  w = canvas.width = nw; h = canvas.height = nh;
  datos = ctx.createImageData(w, h);       // un único ImageData
  px = new Uint32Array(datos.data.buffer);
}

// Banda de tracking
var banda = { activa:false, t0:0, alto:0, dx:0 };
var proxima = 0;
function programar(ahora){ proxima = ahora + 5000 + Math.random() * 5000; }

function pintar(ahora, conBanda){
  var y0 = -1, y1 = -1;
  if(conBanda){
    if(!banda.activa && ahora >= proxima){
      banda.activa = true; banda.t0 = ahora;
      banda.alto = Math.round(h * (0.06 + Math.random() * 0.06));
      banda.dx = 2 + Math.floor(Math.random() * 5);
    }
    if(banda.activa){
      var k = (ahora - banda.t0) / 1200;
      if(k >= 1){ banda.activa = false; programar(ahora); }
      else { y0 = Math.round(-banda.alto + k * (h + banda.alto)); y1 = y0 + banda.alto; }
    }
  }
  for(var y = 0; y < h; y++){
    var enBanda = y >= y0 && y < y1, fila = y * w;
    for(var x = 0; x < w; x++){
      var v;
      if(enBanda){
        // más brillante (+40 %) y arrastrado horizontalmente unos píxeles
        if(y > 0 && (rnd() & 1)) v = px[fila - w + ((x + banda.dx) % w)] & 255;
        else v = rnd() & 255;
        v = Math.min(255, (v * 1.4) | 0);
      } else v = rnd() & 255;
      px[fila + x] = 0xff000000 | (v << 16) | (v << 8) | v;
    }
  }
  ctx.putImageData(datos, 0, 0);
}

medir();
if(window.ResizeObserver) new ResizeObserver(medir).observe(seccion);
else window.addEventListener("resize", medir);

if(reduce){
  // Un solo fotograma estático: sin banda ni parpadeo.
  canvas.style.opacity = OPACIDAD;
  pintar(0, false);
  return;
}

var visible = false, raf = 0, ultimo = 0;
function bucle(ahora){
  raf = requestAnimationFrame(bucle);
  if(ahora - ultimo < PASO) return;
  ultimo = ahora;
  pintar(ahora, true);
  canvas.style.opacity = (OPACIDAD + (Math.random() - 0.5) * 0.04).toFixed(3);
}
function actualizar(){
  var debe = visible && !document.hidden;
  if(debe && !raf){ programar(performance.now()); raf = requestAnimationFrame(bucle); }
  else if(!debe && raf){ cancelAnimationFrame(raf); raf = 0; }
}
new IntersectionObserver(function(e){ visible = e[0].isIntersecting; actualizar(); }).observe(seccion);
document.addEventListener("visibilitychange", actualizar);
})();
