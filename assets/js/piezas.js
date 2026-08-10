/* ==========================================================================
   BARRANCO AMARILLO — V6 · piezas.js
   data/work.json es la única fuente de piezas de toda la web. Ni la home, ni
   /work/, ni las páginas de submarca llevan una sola pieza escrita a mano.
   ========================================================================== */
(function(){
"use strict";

var BA = window.BA = window.BA || {};
var RUTA = "/data/work.json";
var cache = null;

function cargar(){
  if(cache) return cache;
  cache = fetch(RUTA)
    .then(function(r){ if(!r.ok) throw new Error(r.status); return r.json(); })
    .catch(function(){ return []; });
  return cache;
}
BA.cargarPiezas = cargar;

/* En fase 1 los campos de texto vienen vacíos a propósito: nadie ha
   rellenado work.json todavía. Se marcan como pendientes en lugar de
   dejar huecos que parezcan un fallo. */
function txt(v){ return (v === null || v === undefined || v === "") ? null : String(v); }
function marca(v, etiqueta){
  return txt(v) || '<span class="pendiente">' + etiqueta + '</span>';
}
function esc(s){
  return String(s).replace(/[&<>"']/g, function(c){
    return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c];
  });
}
function slug(s){
  return String(s).toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
}
BA.slug = slug;

/* Caption Somesuch: DIRECTOR para CLIENTE, TÍTULO — una sola frase. */
function captionSomesuch(p){
  return marca(p.director,"director") + " para " + marca(p.cliente,"cliente") +
         ", <em>" + marca(p.titulo,"título") + "</em>";
}

/* Un <video> solo cuando el archivo está declarado. Mientras no existan los
   MP4, se pinta el placeholder y la página no arrastra peticiones rotas. */
function medio(p, opts){
  opts = opts || {};
  if(!txt(p.video_loop)){
    return '<div class="placeholder-video" role="img" aria-label="Vídeo pendiente">' +
           (opts.conMarca ? '<span class="pendiente">vídeo pendiente</span>' : "") +
           "</div>";
  }
  return '<video muted playsinline preload="metadata" ' +
         (opts.loop ? "loop " : "") +
         (txt(p.poster) ? 'poster="' + esc(p.poster) + '" ' : "") +
         'src="' + esc(p.video_loop) + '"></video>';
}

/* ==========================================================================
   REPRODUCTOR DE PORTADA
   Avanza al terminar el vídeo, al clicar un número, al arrastrar y con las
   flechas. El scroll vertical NUNCA lo controla.
   ========================================================================== */
BA.montarReproductor = function(raiz){
  if(!raiz) return;
  cargar().then(function(todas){
    var piezas = todas
      .filter(function(p){ return p.destacada_home; })
      .sort(function(a,b){ return (a.orden_home || 99) - (b.orden_home || 99); })
      .slice(0,6);

    if(!piezas.length){
      raiz.innerHTML = '<div class="placeholder-video">' +
        '<span class="pendiente pendiente-bloque">Reproductor de portada<br>' +
        'Sin piezas destacadas en data/work.json</span></div>';
      return;
    }

    var pista = document.createElement("div");
    pista.className = "reproductor-pista";
    pista.innerHTML = piezas.map(function(p,i){
      return '<div class="reproductor-pieza' + (i===0 ? " activa" : "") + '">' +
             medio(p,{}) + "</div>";
    }).join("");

    var pie = document.createElement("div");
    pie.className = "reproductor-pie";
    pie.innerHTML =
      '<div class="paginador" role="group" aria-label="Piezas destacadas">' +
        piezas.map(function(p,i){
          return '<button type="button" data-i="' + i + '" aria-current="' +
                 (i===0) + '">' + (i+1) + "</button>";
        }).join("") +
      "</div>" +
      '<p class="reproductor-caption" aria-live="polite"></p>';

    raiz.appendChild(pista);
    raiz.appendChild(pie);

    var slides   = pista.querySelectorAll(".reproductor-pieza");
    var botones  = pie.querySelectorAll(".paginador button");
    var caption  = pie.querySelector(".reproductor-caption");
    var actual   = -1;

    function ir(i){
      i = (i + piezas.length) % piezas.length;
      if(i === actual) return;
      if(actual > -1){
        slides[actual].classList.remove("activa");
        var vAnt = slides[actual].querySelector("video");
        if(vAnt) vAnt.pause();
      }
      actual = i;
      slides[i].classList.add("activa");
      botones.forEach(function(b,j){ b.setAttribute("aria-current", String(j===i)); });
      caption.innerHTML = captionSomesuch(piezas[i]);

      var v = slides[i].querySelector("video");
      if(v){
        v.currentTime = 0;
        var pr = v.play();
        if(pr && pr.catch) pr.catch(function(){});
      } else {
        // Sin MP4 todavía: el carrete sigue avanzando solo, para que se vea
        // el mecanismo. Cuando existan los vídeos manda el evento `ended`.
        clearTimeout(ir._t);
        ir._t = setTimeout(function(){ ir(actual + 1); }, 5000);
      }
    }

    slides.forEach(function(s){
      var v = s.querySelector("video");
      if(v) v.addEventListener("ended", function(){ ir(actual + 1); });
    });

    botones.forEach(function(b){
      b.addEventListener("click", function(){ ir(+b.dataset.i); });
    });

    /* Arrastre y swipe horizontales. El eje vertical se deja pasar íntegro:
       si el gesto baja más de lo que se desplaza, es scroll y no se toca. */
    var x0 = null, y0 = null;
    raiz.addEventListener("pointerdown", function(e){ x0 = e.clientX; y0 = e.clientY; });
    raiz.addEventListener("pointerup", function(e){
      if(x0 === null) return;
      var dx = e.clientX - x0, dy = e.clientY - y0;
      x0 = null;
      if(Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) ir(actual + (dx < 0 ? 1 : -1));
    });

    raiz.setAttribute("tabindex","0");
    raiz.addEventListener("keydown", function(e){
      if(e.key === "ArrowRight"){ e.preventDefault(); ir(actual + 1); }
      if(e.key === "ArrowLeft"){  e.preventDefault(); ir(actual - 1); }
    });

    ir(0);
  });
};

/* ==========================================================================
   PARRILLA
   ========================================================================== */
var MEDIDAS = ["pieza--ancha","pieza--media","pieza--desplazada","","pieza--total",
               "pieza--media","pieza--estrecha","pieza--ancha","","pieza--desplazada"];

BA.montarParrilla = function(opts){
  opts = opts || {};
  var raiz = document.getElementById(opts.id || "parrilla");
  if(!raiz) return;

  cargar().then(function(todas){
    var base = todas;
    if(opts.submarca) base = base.filter(function(p){ return p.submarca === opts.submarca; });

    var params   = new URLSearchParams(location.search);
    var director = params.get("director");
    if(director){
      base = base.filter(function(p){ return slug(p.director || "") === director; });
      var aviso = document.getElementById("aviso-director");
      if(aviso){ aviso.hidden = false; aviso.textContent = "Filtrado por director: " + director; }
    }

    var filtro = "all";

    function visibles(){
      return filtro === "all" ? base : base.filter(function(p){ return p.submarca === filtro; });
    }

    function pintar(){
      var lista = visibles();
      // Con menos de tres piezas, una parrilla deja huecos: se pasa a piezas
      // grandes a ancho completo, que con poco material se ven mejor.
      var pocas = lista.length > 0 && lista.length < 3;

      if(!lista.length){
        raiz.innerHTML = '<p class="parrilla-vacia"><span class="pendiente">' +
                         "Sin piezas en esta selección</span></p>";
        return;
      }

      raiz.innerHTML = lista.map(function(p,i){
        var medida = pocas ? "pieza--total" : MEDIDAS[i % MEDIDAS.length];
        return '<article class="pieza ' + medida + ' revelar">' +
          '<button class="pieza-marco" type="button" data-id="' + esc(p.id) + '" ' +
                  'aria-label="Abrir pieza">' + medio(p,{ loop:true, conMarca:true }) + "</button>" +
          '<p class="pieza-caption">' +
            '<span class="cliente">' + marca(p.cliente,"cliente") + "</span>" +
            '<span class="titulo">'  + marca(p.titulo,"título")  + "</span>" +
            '<span class="credito">' + marca(p.director,"director") + " · " +
                                       marca(p.anio,"año") + "</span>" +
          "</p></article>";
      }).join("");

      if(BA.activarRevelados) BA.activarRevelados(raiz);
      observarVideos(raiz);
      raiz.querySelectorAll(".pieza-marco").forEach(function(b){
        b.addEventListener("click", function(){ abrirLightbox(lista, b.dataset.id); });
      });
    }

    var filtros = document.getElementById("filtros");
    if(filtros){
      filtros.addEventListener("click", function(e){
        var b = e.target.closest("button[data-filtro]");
        if(!b) return;
        filtro = b.dataset.filtro;
        filtros.querySelectorAll("button").forEach(function(x){
          x.setAttribute("aria-pressed", String(x === b));
        });
        pintar();
      });
    }

    pintar();
  });
};

/* Nunca más de dos vídeos reproduciéndose a la vez. */
var enCurso = [];
function observarVideos(raiz){
  if(!("IntersectionObserver" in window)) return;
  var obs = new IntersectionObserver(function(entradas){
    entradas.forEach(function(e){
      var v = e.target;
      if(e.isIntersecting){
        if(enCurso.length >= 2){
          var fuera = enCurso.shift();
          if(fuera) fuera.pause();
        }
        var pr = v.play();
        if(pr && pr.catch) pr.catch(function(){});
        enCurso.push(v);
      } else {
        v.pause();
        enCurso = enCurso.filter(function(x){ return x !== v; });
      }
    });
  }, { threshold:0.35 });
  raiz.querySelectorAll(".pieza-marco video").forEach(function(v){ obs.observe(v); });
}

/* ==========================================================================
   LIGHTBOX — la pieza completa, embebida de YouTube. Sin página propia en
   fase 1: con diez piezas no la merece.
   ========================================================================== */
var lb, lbMarco, lbCap, lbLista = [], lbIdx = 0, lbAnterior = null;

function crearLightbox(){
  if(lb) return;
  lb = document.createElement("div");
  lb.className = "lightbox";
  lb.setAttribute("role","dialog");
  lb.setAttribute("aria-modal","true");
  lb.setAttribute("aria-label","Reproductor de vídeo");
  lb.hidden = true;
  lb.innerHTML =
    '<div class="lb-marco">' +
      '<button class="lb-btn lb-cerrar" type="button" aria-label="Cerrar">Cerrar ×</button>' +
      '<button class="lb-btn lb-prev" type="button" aria-label="Pieza anterior">←</button>' +
      '<button class="lb-btn lb-next" type="button" aria-label="Pieza siguiente">→</button>' +
      '<div class="lb-hueco"></div>' +
      '<p class="lb-caption"></p>' +
    "</div>";
  document.body.appendChild(lb);
  lbMarco = lb.querySelector(".lb-hueco");
  lbCap   = lb.querySelector(".lb-caption");

  lb.querySelector(".lb-cerrar").addEventListener("click", cerrarLightbox);
  lb.querySelector(".lb-prev").addEventListener("click", function(){ pintarLightbox(lbIdx - 1); });
  lb.querySelector(".lb-next").addEventListener("click", function(){ pintarLightbox(lbIdx + 1); });
  lb.addEventListener("click", function(e){ if(e.target === lb) cerrarLightbox(); });
  document.addEventListener("keydown", function(e){
    if(lb.hidden) return;
    if(e.key === "Escape") cerrarLightbox();
    if(e.key === "ArrowRight") pintarLightbox(lbIdx + 1);
    if(e.key === "ArrowLeft")  pintarLightbox(lbIdx - 1);
    if(e.key === "Tab"){
      // Foco atrapado dentro del diálogo mientras está abierto.
      var f = lb.querySelectorAll("button");
      var primero = f[0], ultimo = f[f.length-1];
      if(e.shiftKey && document.activeElement === primero){ e.preventDefault(); ultimo.focus(); }
      else if(!e.shiftKey && document.activeElement === ultimo){ e.preventDefault(); primero.focus(); }
    }
  });
}

function idYoutube(url){
  var m = String(url).match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : null;
}

function pintarLightbox(i){
  lbIdx = (i + lbLista.length) % lbLista.length;
  var p  = lbLista[lbIdx];
  var id = txt(p.video_completo) ? idYoutube(p.video_completo) : null;

  lbMarco.innerHTML = id
    ? '<iframe src="https://www.youtube.com/embed/' + esc(id) + '?autoplay=1&rel=0" ' +
      'title="' + esc(txt(p.titulo) || "Pieza") + '" allow="autoplay; fullscreen" allowfullscreen></iframe>'
    : '<div class="lb-vacio"><span class="pendiente pendiente-bloque">' +
      "Vídeo completo pendiente<br>Falta el enlace de YouTube en data/work.json</span></div>";

  lbCap.innerHTML = captionSomesuch(p);
}

function abrirLightbox(lista, id){
  crearLightbox();
  lbLista = lista;
  lbAnterior = document.activeElement;
  lb.hidden = false;
  document.body.style.overflow = "hidden";
  pintarLightbox(lista.findIndex(function(p){ return p.id === id; }));
  lb.querySelector(".lb-cerrar").focus();
}

function cerrarLightbox(){
  lb.hidden = true;
  lbMarco.innerHTML = "";               // corta la reproducción del embed
  document.body.style.overflow = "";
  if(lbAnterior && lbAnterior.focus) lbAnterior.focus();
}

/* ==========================================================================
   DIRECTORES — el roster no lleva nombres escritos a mano en el HTML más
   allá de los tres del brief: aquí solo se cuenta cuántas piezas tiene cada
   uno según work.json.
   ========================================================================== */
BA.contarPorDirector = function(){
  var nodos = document.querySelectorAll("[data-director]");
  if(!nodos.length) return;
  cargar().then(function(todas){
    nodos.forEach(function(n){
      var s = n.dataset.director;
      var n_ = todas.filter(function(p){ return slug(p.director || "") === s; }).length;
      var cuenta = n.querySelector(".cuenta");
      if(cuenta) cuenta.textContent = n_ === 1 ? "1 pieza" : n_ + " piezas";
    });
  });
};

})();
