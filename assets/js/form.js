/* ==========================================================================
   BARRANCO AMARILLO — V6 · form.js
   Un solo componente de formulario para /contact/ y /real-estate/.

   BACKEND: el mismo que ya usa la v5 en producción. La RLS del proyecto de
   Supabase solo permite a `anon` insertar en `leads` y leer la vista
   `v_portfolio_publico`; la service_role key no aparece nunca aquí. La anon
   key es pública por diseño: viaja en el navegador.
   El payload es exactamente el que ya escribe la v5, para que el panel de
   BAOPS siga leyendo estos leads sin ningún cambio.
   ========================================================================== */
(function(){
"use strict";

var SUPABASE_URL  = "https://xyhjwoipcrnpvwugblqb.supabase.co";
var SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5aGp3b2lwY3JucHZ3dWdibHFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5NTYxNDQsImV4cCI6MjEwMTUzMjE0NH0._I_pCwqwUrYAGhdl6hyjXcGHvd9l1TjGAS85Y9SINLU";

function enviarLead(datos){
  var params = new URLSearchParams(location.search);
  return fetch(SUPABASE_URL + "/rest/v1/leads", {
    method: "POST",
    headers: {
      "apikey": SUPABASE_ANON,
      "Authorization": "Bearer " + SUPABASE_ANON,
      "Content-Type": "application/json",
      "Prefer": "return=minimal"
    },
    body: JSON.stringify({
      nombre: datos.nombre,
      email: datos.email || null,
      telefono: null,
      tipo_proyecto: datos.tipo || null,
      mensaje: datos.mensaje || null,
      franja_preferida: null,
      origen: datos.origen || "formulario_contacto",
      pagina_origen: location.pathname,
      referrer: document.referrer || null,
      utm_source: params.get("utm_source")
    })
  }).then(function(r){ return r.ok; }).catch(function(){ return false; });
}

document.querySelectorAll("form[data-lead]").forEach(function(form){
  var aviso  = form.querySelector(".form-aviso");
  var boton  = form.querySelector("button[type=submit]");
  var textos = {
    enviando: form.dataset.enviando || "Sending…",
    ok:       form.dataset.ok       || "Thanks. We'll get back to you.",
    error:    form.dataset.error    || "Something went wrong. Write to us by email instead."
  };

  form.addEventListener("submit", function(e){
    e.preventDefault();

    var invalido = false;
    form.querySelectorAll("[required]").forEach(function(campo){
      var ok = campo.type === "checkbox" ? campo.checked : campo.checkValidity();
      campo.closest(".campo").classList.toggle("invalido", !ok);
      if(!ok && !invalido){ campo.focus(); invalido = true; }
    });
    if(invalido) return;

    // Honeypot: el campo trampa relleno es un bot. Se le contesta que sí y
    // no se envía nada.
    if(form.querySelector(".botcheck") && form.querySelector(".botcheck").checked){
      aviso.textContent = textos.ok;
      form.reset();
      return;
    }

    var d = new FormData(form);
    aviso.textContent = textos.enviando;
    boton.disabled = true;

    enviarLead({
      nombre:  d.get("nombre"),
      email:   d.get("email"),
      tipo:    d.get("tipo"),
      mensaje: d.get("mensaje"),
      origen:  form.dataset.origen
    }).then(function(ok){
      aviso.textContent = ok ? textos.ok : textos.error;
      boton.disabled = false;
      if(ok) form.reset();
    });
  });
});

})();
