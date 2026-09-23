/* ==========================================================================
   BARRANCO AMARILLO — V6 · base.js
   Nav, revelados y favicon. Nada de esto es necesario para leer la
   web: el JS solo añade movimiento.
   ========================================================================== */
(function(){
"use strict";

/* La clase `js` es la que activa los estados iniciales ocultos del CSS. Si
   este archivo no se ejecuta, no hay nada oculto que revelar. */
document.documentElement.classList.add("js");

var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* El loader vive en su propio archivo (assets/js/loader.js) y se carga desde
   el <head>: tiene que existir antes del primer pintado. */

/* ==========================================================================
   NAV
   ========================================================================== */
(function nav(){
  var btn      = document.querySelector(".nav-menu-btn");
  var overlay  = document.getElementById("nav-overlay");
  var cerrar   = document.querySelector(".nav-cerrar");

  if(btn && overlay){
    var abrir = function(v){
      overlay.classList.toggle("abierto", v);
      btn.setAttribute("aria-expanded", String(v));
      document.body.style.overflow = v ? "hidden" : "";
      if(v){ var a = overlay.querySelector("a"); if(a) a.focus(); }
      else btn.focus();
    };
    btn.addEventListener("click", function(){ abrir(!overlay.classList.contains("abierto")); });
    if(cerrar) cerrar.addEventListener("click", function(){ abrir(false); });
    document.addEventListener("keydown", function(e){
      if(e.key === "Escape" && overlay.classList.contains("abierto")) abrir(false);
    });
  }

  /* OUR NETWORK */
  var rBtn   = document.querySelector(".nav-region-btn");
  var rPanel = document.getElementById("nav-region-panel");
  if(rBtn && rPanel){
    var toggle = function(v){
      rPanel.hidden = !v;
      rBtn.setAttribute("aria-expanded", String(v));
    };
    rBtn.addEventListener("click", function(e){
      e.stopPropagation();
      toggle(rPanel.hidden);
    });
    document.addEventListener("click", function(e){
      if(!rPanel.hidden && !rPanel.contains(e.target)) toggle(false);
    });
    document.addEventListener("keydown", function(e){
      if(e.key === "Escape" && !rPanel.hidden){ toggle(false); rBtn.focus(); }
    });
  }

  /* Sobre el reproductor de portada el nav es transparente; en cuanto se
     baja de él, recupera el fondo. */
  var barra = document.querySelector(".nav--sobre-video");
  if(barra){
    var umbral = function(){
      barra.classList.toggle("nav--sobre-video", window.scrollY < window.innerHeight * 0.85);
    };
    window.addEventListener("scroll", umbral, { passive:true });
  }
})();

/* ==========================================================================
   REVELADOS
   ========================================================================== */
var io = ("IntersectionObserver" in window)
  ? new IntersectionObserver(function(entradas, obs){
      entradas.forEach(function(e){
        if(!e.isIntersecting) return;
        e.target.classList.add("visible");
        obs.unobserve(e.target);
      });
    }, { threshold:0.3, rootMargin:"0px 0px -8% 0px" })
  : null;

/* Trocea la frase en palabras. El HTML lleva la frase entera y continua:
   esto la parte al cargar, no viene escrita en spans desde el servidor. */
function trocear(el){
  if(el.dataset.troceada) return;
  el.dataset.troceada = "1";
  var i = 0;
  (function recorrer(nodo){
    Array.prototype.slice.call(nodo.childNodes).forEach(function(hijo){
      if(hijo.nodeType === 3){
        var partes = hijo.textContent.split(/(\s+)/);
        var frag = document.createDocumentFragment();
        partes.forEach(function(p){
          if(!p) return;
          if(/^\s+$/.test(p)){ frag.appendChild(document.createTextNode(p)); return; }
          var mask = document.createElement("span");
          mask.className = "pal";
          var inner = document.createElement("i");
          inner.textContent = p;
          inner.style.setProperty("--d", (i++ * 45) + "ms");
          mask.appendChild(inner);
          frag.appendChild(mask);
        });
        hijo.parentNode.replaceChild(frag, hijo);
      } else if(hijo.nodeType === 1 && hijo.tagName !== "BR" &&
                !hijo.classList.contains("pendiente")){
        // Los marcadores de pendiente no se trocean: llevan su propio
        // recuadro y las máscaras por palabra lo descuadran.
        recorrer(hijo);
      }
    });
  })(el);
}

function activarRevelados(raiz){
  (raiz || document).querySelectorAll(".revelar-frase").forEach(function(el){
    if(!reduceMotion) trocear(el);
    if(io && !reduceMotion) io.observe(el); else el.classList.add("visible");
  });
  (raiz || document).querySelectorAll(".revelar").forEach(function(el){
    if(io && !reduceMotion) io.observe(el); else el.classList.add("visible");
  });
}
activarRevelados(document);
window.BA = window.BA || {};
window.BA.activarRevelados = activarRevelados;
window.BA.reduceMotion = reduceMotion;

/* ==========================================================================
   FAVICON ANIMADO — mecanismo Stink: fotogramas numerados que un intervalo
   intercambia en el <link rel="icon">.
   Desactivado hasta que existan los fotogramas dibujados para 32×32 px.
   Para activarlo: poner FAVICON_ANIMADO en true y FAVICON_FOTOGRAMAS en el
   número de carpetas que haya en assets/favicon/.
   ========================================================================== */
var FAVICON_ANIMADO     = false;
var FAVICON_FOTOGRAMAS  = 0;

(function favicon(){
  if(!FAVICON_ANIMADO || FAVICON_FOTOGRAMAS < 2) return;
  var link = document.querySelector('link[rel="icon"]');
  if(!link) return;

  var n = 0, timer = null;
  function paso(){
    n = (n % FAVICON_FOTOGRAMAS) + 1;
    link.href = "/assets/favicon/" + (n < 10 ? "0" + n : n) + "/favicon-32x32.png";
  }
  function arrancar(){ if(!timer) timer = setInterval(paso, 120); }
  function parar(){ clearInterval(timer); timer = null; }

  // Con la pestaña oculta no se anima: no tiene sentido gastar batería.
  document.addEventListener("visibilitychange", function(){
    document.hidden ? parar() : arrancar();
  });
  if(!document.hidden) arrancar();
})();

})();
