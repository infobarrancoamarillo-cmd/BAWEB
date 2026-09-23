/* ==========================================================================
   BARRANCO AMARILLO — V6 · loader.js

   Anillos concéntricos en WebGL con el símbolo dibujándose trazo a trazo
   encima. Shader adaptado de "Shader Lines" de @designali-in (21st.dev,
   id 5698): se conservan la geometría de anillos, el mosaico y el desfase
   de los tres acumuladores. Fuera Three.js —eran 570 KB para pintar un
   cuadrado— y los canales RGB del original pasan a ser una sola intensidad
   sobre una rampa de la paleta de marca.

   Este archivo se carga BLOQUEANDO desde el <head>. Es a propósito: el
   overlay tiene que existir antes del primer pintado. Pesa ~9 KB y es
   local, así que el coste es menor que ver la página un instante antes de
   que el loader la tape.

   El `d` del símbolo vive AQUÍ y en ningún otro sitio. Las nueve páginas no
   llevan ni una línea del loader: lo monta este archivo entero. Sale de
   assets/ba-simbolo.svg; si ese archivo cambia, hay que regenerar esta
   constante.
   ========================================================================== */
(function(){
"use strict";

var D = "M536.3 0.6C480.1 5.5 428.9 36.2 397.3 84C394.6 88.1 391.4 93.3 390.2 95.4L388.1 99.3L392 101.3C394.2 102.4 405.4 108.2 416.9 114.2L437.8 125.1L462.5 133.3L487.2 141.6L517.3 208.1C533.8 244.6 547.5 274.5 547.7 274.5C548 274.4 550.6 269.3 553.5 263.2C556.8 256.2 559.4 251.6 560.2 251C561 250.5 571.4 244.5 583.4 237.6L605.1 225.2L618.1 224.7L631.1 224.2L648.2 218.5L665.3 212.7L697.3 231.6C714.9 242 729.4 250.5 729.5 250.3C730 249.9 732.7 240 734.2 233.3C737.7 217.5 738.2 212.3 738.2 191.2C738.2 170.1 737.6 164.1 734.1 148.2C717.3 72.7 656.1 14.3 581.3 2.4C566.8 0.1 550.2 -0.6 536.3 0.6ZM279.8 108C274.6 109.3 269.6 113.3 267.5 118C266.8 119.4 251.2 185.7 232.8 265.3C214.3 344.8 199.1 410.3 199 410.7C198.8 411.2 216.8 411.4 287.6 411.4L376.5 411.4L376.5 259.4L376.5 107.5L329 107.6C302.9 107.6 280.7 107.8 279.8 108ZM390.8 115.5C392.1 120.3 471.8 410.8 471.8 411.1C471.8 411.3 489 411.4 509.9 411.4C547.3 411.4 548 411.4 547.7 410.3C547.2 408.9 432.4 134.7 432.2 134.5C431.9 134.3 390.4 112.7 390.1 112.7C390 112.7 390.3 114 390.8 115.5ZM222 136C205.6 139.4 191.2 142.5 189.9 142.9C186.2 144 182.2 147.7 180.2 151.8C178.8 154.6 128.2 299.5 94.1 398.2L89.5 411.4L138.7 411.4L188 411.4L220.5 271.5C238.3 194.6 253.1 131.2 253.2 130.6C253.4 130 253.2 129.6 252.7 129.6C252.2 129.7 238.4 132.5 222 136ZM447.6 144C448.7 146.4 474.3 207.6 504.6 279.9L559.7 411.4L578.5 411.4L597.2 411.4L593.1 402.2C590.8 397.2 564.3 338.6 534.2 271.9L479.5 150.8L463 145.2C454 142.1 446.4 139.5 446.1 139.5C445.9 139.5 446.6 141.5 447.6 144ZM387 277.6L387 411.4L423.9 411.4L460.9 411.4L460.5 409.8C459.6 406.2 388.1 146.6 387.6 145.3C387.3 144.4 387.1 200.3 387 277.6ZM131.3 194.8C118.1 198.3 106.1 201.7 104.7 202.3C99.2 204.9 100.7 202 49.3 310L1.2 411.1L39.6 411.3C60.8 411.3 78.1 411.3 78.2 411.2C78.3 411.1 95.8 361.4 117 300.7C138.3 240 155.8 189.8 156 189.3C156.3 188.7 156.2 188.3 155.9 188.3C155.7 188.4 144.6 191.3 131.3 194.8ZM646.4 230.5C641.3 232.3 636.8 234 636.5 234.4C636.1 234.7 626.1 266.5 614.2 304.9L592.5 374.8L600.6 392.5C605 402.3 608.7 410.4 608.9 410.5C609.1 410.6 618.9 373.7 630.7 328.4C642.5 283.1 653.3 241.8 654.6 236.6C656.2 230.5 656.8 227.2 656.4 227.2C656 227.2 651.5 228.7 646.4 230.5ZM644.2 318.6C631.1 368.8 620.3 410.3 620.1 410.7C619.9 411.2 629.1 411.4 664.8 411.4L709.8 411.4L718.1 336.6C722.6 295.5 726.2 261.7 725.9 261.4C725.4 260.9 669.4 227.8 668.5 227.4C668.2 227.3 657.6 266.8 644.2 318.6ZM615.4 235.9L609.9 236.2L590 280C579 304.1 570 324 570 324.3C570 325 585.1 358.6 585.7 359.3C586 359.6 586.4 358.9 586.8 357.8C587.1 356.8 595.7 329.2 605.7 296.5C615.8 263.8 624.2 236.7 624.4 236.2C624.7 235.5 624.3 235.4 622.8 235.4C621.7 235.5 618.4 235.7 615.4 235.9ZM580.7 251.8L567.3 259.4L560.4 273.7C553.9 287.3 553.6 288 554.3 289.8C555.6 293.3 563.3 310 563.8 310.3C564.3 310.6 594.6 244.7 594.3 244.3C594.2 244.2 588 247.5 580.7 251.8ZM756.9 259.2C746.1 261.4 737.1 263.2 737 263.3C736.9 263.5 720.5 409.3 720.5 410.7C720.5 411.2 731 411.4 771 411.4L821.4 411.4L800.1 333.4C781.4 264.6 778.7 255.4 777.7 255.3C777.1 255.2 767.7 257 756.9 259.2ZM790.4 257.6C790.6 258.3 800.1 293.2 811.6 335.1L832.4 411.4L858.4 411.4L884.4 411.4L883.6 409.5C855.7 343.6 825.2 272.1 824.1 270C822.4 266.9 819.8 264.4 816.5 262.7C814.7 261.8 792.6 256.3 790.7 256.3C790.4 256.3 790.2 256.8 790.4 257.6ZM842.8 287.6C843 288.1 855 316.1 869.4 349.9L895.7 411.4L947.6 411.4C996.8 411.4 999.4 411.3 998.9 410.4C998.6 409.8 979.8 386.1 957.2 357.7C926 318.5 915.4 305.6 913.2 304.1C909.2 301.3 906 300.5 872.6 293.2C848.7 288 842.6 286.9 842.8 287.6ZM982.9 302.1C977.2 304.7 974.7 310.9 977.3 316.4C981.4 325.2 993.7 325.2 997.7 316.4C1001.9 307.3 992.1 297.8 982.9 302.1ZM992.9 304.9C998.1 308.7 997.4 317.1 991.5 319.9C988.8 321.2 984.5 320.8 982.1 319.1C977 315.4 977.6 307.1 983.3 304.3C985.8 302.9 990.5 303.3 992.9 304.9ZM983.7 312C983.7 317.5 983.8 317.8 984.9 317.8C986 317.8 986.1 317.5 986.1 313.2C986.1 308.6 986.1 308.5 987.5 308.5C989.3 308.5 989.5 310.5 987.8 311.5C987.2 311.8 986.6 312.3 986.6 312.6C986.6 312.9 987.2 313.2 987.8 313.2C988.8 313.2 989 313.6 989 315.5C989 317.4 989.2 317.8 990.1 317.8C991.1 317.8 991.2 317.4 991.2 312.8C991.2 310 990.9 307.3 990.6 306.9C990.2 306.5 988.7 306.2 986.9 306.2L983.7 306.2L983.7 312Z";

/* --------------------------------------------------------------------------
   Salidas tempranas. Las dos dejan la web entrando directa, sin overlay.
   -------------------------------------------------------------------------- */
try{
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
}catch(e){}

try{
  if(sessionStorage.getItem("ba-loader") === "1") return;
  sessionStorage.setItem("ba-loader", "1");
}catch(e){ /* modo privado sin storage: el loader se ve, que es el mal menor */ }

/* --------------------------------------------------------------------------
   El overlay. Se cuelga de <html> porque en el <head> todavía no hay <body>,
   y esperar a que lo haya dejaría ver la página un momento sin tapar.
   -------------------------------------------------------------------------- */
var ov = document.createElement("div");
ov.id = "ba-loader";
ov.setAttribute("data-loader", "");
ov.setAttribute("aria-hidden", "true");   // decoración pura, no se lee

/* Dos paths con la misma `d`: uno se dibuja como contorno y el otro entra
   como relleno. Es el mecanismo, no un descuido. */
ov.innerHTML =
  '<canvas id="ba-loader-cv"></canvas>' +
  '<div class="ba-loader-mark">' +
    '<svg viewBox="0 0 1000 414.3" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
      '<path class="ba-mark-line" pathLength="1" fill="none" stroke="#F1C741" ' +
            'stroke-width="1.8" stroke-linejoin="round" vector-effect="non-scaling-stroke" d="' + D + '"/>' +
      '<path class="ba-mark-fill" fill="#F1C741" fill-rule="evenodd" d="' + D + '"/>' +
    '</svg>' +
  '</div>';

document.documentElement.appendChild(ov);

/* ==========================================================================
   SHADER
   ========================================================================== */
var VERT = [
  "attribute vec2 p;",
  "void main(){ gl_Position = vec4(p, 0.0, 1.0); }"
].join("\n");

var FRAG = [
  "precision highp float;",
  "uniform vec2  res;",
  "uniform float time;",
  "uniform float dim;",
  "",
  "float rnd(in float x){ return fract(sin(x)*1e4); }",
  "",
  "void main(){",
  "  vec2 uv = (gl_FragCoord.xy*2.0 - res.xy) / min(res.x, res.y);",
  "",
  "  // mosaico: cuantiza uv en bloques, es lo que da el aspecto de trama",
  "  vec2 mo = vec2(4.0, 2.0);",
  "  vec2 ss = vec2(256.0, 256.0);",
  "  uv.x = floor(uv.x*ss.x/mo.x) / (ss.x/mo.x);",
  "  uv.y = floor(uv.y*ss.y/mo.y) / (ss.y/mo.y);",
  "",
  "  float t  = time*0.06 + rnd(uv.x)*0.4;",
  "  float lw = 0.0008;",
  "  float Lg = length(uv);",
  "",
  "  // tres acumuladores desfasados en el tiempo",
  "  vec3 acc = vec3(0.0);",
  "  for(int j=0; j<3; j++){",
  "    for(int i=0; i<5; i++){",
  "      acc[j] += lw*float(i*i) / abs(fract(t - 0.01*float(j) + float(i)*0.01)*1.0 - Lg);",
  "    }",
  "  }",
  "",
  "  // paleta Barranco Amarillo",
  "  vec3 AMAR = vec3(0.945, 0.780, 0.255);",
  "  vec3 NARA = vec3(0.898, 0.392, 0.145);",
  "  vec3 TINT = vec3(0.969, 0.961, 0.949);",
  "  vec3 NEGR = vec3(0.071, 0.063, 0.063);",
  "",
  "  float e = clamp((acc.r + acc.g + acc.b)/3.0, 0.0, 2.0);",
  "",
  "  // bolsa central: abre hueco para el logo",
  "  float pocket = mix(1.0, smoothstep(0.02, 0.42, Lg), dim);",
  "  e *= pocket;",
  "",
  "  vec3 c = mix(NEGR, NARA, smoothstep(0.00, 0.30, e));",
  "  c = mix(c, AMAR, smoothstep(0.26, 0.72, e));",
  "  c = mix(c, TINT, smoothstep(0.90, 1.50, e));",
  "",
  "  gl_FragColor = vec4(c, 1.0);",
  "}"
].join("\n");

var cv = ov.querySelector("#ba-loader-cv");
var gl = null, raf = 0, tiempo = 0, uRes = null, uTime = null;

function compilar(tipo, fuente){
  var s = gl.createShader(tipo);
  gl.shaderSource(s, fuente);
  gl.compileShader(s);
  if(!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
  return s;
}

/* Este archivo se ejecuta desde el <head>, donde todavía no hay layout:
   innerWidth puede valer 0 y el canvas se quedaría en 1x1 estirado a
   pantalla completa —un solo píxel negro— con todo lo demás aparentemente
   bien. Por eso se mide el propio canvas, se sale sin tocar nada si aún no
   tiene tamaño, y se recomprueba en cada frame. */
function medir(){
  // Sin tope, una pantalla 3x renderiza 9 veces los píxeles que hacen falta
  // y los fps se van al suelo.
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var w = cv.clientWidth  || window.innerWidth  || 0;
  var h = cv.clientHeight || window.innerHeight || 0;
  if(!w || !h) return false;

  var bw = Math.round(w * dpr), bh = Math.round(h * dpr);
  if(cv.width === bw && cv.height === bh) return true;

  cv.width  = bw;
  cv.height = bh;
  if(gl){
    gl.viewport(0, 0, bw, bh);
    gl.uniform2f(uRes, bw, bh);
  }
  return true;
}

function arrancarShader(){
  try{
    gl = cv.getContext("webgl", { antialias:false, alpha:false, depth:false, stencil:false })
      || cv.getContext("experimental-webgl");
  }catch(e){ gl = null; }

  // Sin WebGL el overlay se queda en negro plano y el símbolo se dibuja
  // igual: el dibujado es CSS y no depende de esto.
  if(!gl){ ov.classList.add("sin-webgl"); return; }

  try{
    var prog = gl.createProgram();
    gl.attachShader(prog, compilar(gl.VERTEX_SHADER,   VERT));
    gl.attachShader(prog, compilar(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if(!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    uRes  = gl.getUniformLocation(prog, "res");
    uTime = gl.getUniformLocation(prog, "time");
    gl.uniform1f(gl.getUniformLocation(prog, "dim"), 0.55);

    medir();
    window.addEventListener("resize", medir);

    (function pintar(){
      raf = requestAnimationFrame(pintar);
      if(document.hidden) return;   // nadie lo ve: ni un frame ni batería
      if(!medir()) return;          // todavía sin layout: nada que pintar
      tiempo += 0.05;
      gl.uniform1f(uTime, tiempo);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    })();
  }catch(e){
    gl = null;
    ov.classList.add("sin-webgl");
  }
}

/* ==========================================================================
   SECUENCIA
   0 ms     el shader ya pinta, el símbolo invisible
   250 ms   empieza el contorno, 1.250 ms
   1.420 ms entra el relleno, 520 ms  (solapa 80 ms con el contorno: es
            deliberado, sin el solape hay un salto seco)
   2.200 ms el overlay se funde, 550 ms
   2.750 ms fuera del DOM
   ========================================================================== */
var salidaT = 0, limpiezaT = 0, terminado = false;

function limpiar(){
  cancelAnimationFrame(raf);
  window.removeEventListener("resize", medir);
  if(gl){
    // Un contexto WebGL vivo de fondo ocupa memoria para nada.
    var ext = gl.getExtension("WEBGL_lose_context");
    if(ext) ext.loseContext();
    gl = null;
  }
  if(ov.parentNode) ov.parentNode.removeChild(ov);
}

function salir(){
  if(terminado) return;
  terminado = true;
  clearTimeout(salidaT);
  quitarAtajos();
  ov.classList.add("is-out");
  clearTimeout(limpiezaT);
  limpiezaT = setTimeout(limpiar, 550);
}

var EVENTOS = ["click", "keydown", "wheel", "touchstart"];
function quitarAtajos(){
  for(var i = 0; i < EVENTOS.length; i++){
    window.removeEventListener(EVENTOS[i], salir, true);
  }
}
for(var i = 0; i < EVENTOS.length; i++){
  window.addEventListener(EVENTOS[i], salir, true);
}

arrancarShader();
// Fuerza el reflow para que las animaciones del símbolo arranquen desde su
// estado inicial y no se las salte el navegador.
void ov.offsetWidth;
ov.classList.add("is-playing");
salidaT = setTimeout(salir, 2200);

})();
