/* ============================================================
   MOTOR.JS - el corazon del juego.
   Normalmente NO necesitas tocar este archivo: escribe tu
   historia en historia.js y el motor la interpreta.
   ============================================================ */
(() => {
"use strict";

const $ = (id) => document.getElementById(id);

const el = {
  fondoA: $("fondoA"), fondoB: $("fondoB"),
  sprites: $("sprites"),
  dialogo: $("dialogo"), nombre: $("nombre"), texto: $("texto"), flecha: $("flecha"),
  opciones: $("opciones"),
  menu: $("menu"),
  pantallaNombre: $("nombreJugador"),
  menuFondo: $("menuFondo"),
  listaPersonajes: $("listaPersonajes"),
  campoNombre: $("campoNombre"),
  avanzar: $("avanzar"),
};

const ESPERA_AUTO = 1400;  // ms extra en modo auto
const CLAVE_SAVE  = "novela-visual-save";
const CLAVE_AJUSTES  = "novela-visual-ajustes";
const CLAVE_CONOCIDOS = "novela-visual-conocidos";
const NOMBRE_POR_DEFECTO = "Kaito";

// Musica que suena en el menu, antes de empezar a jugar.
const MUSICA_MENU = "tema";

// Velocidad del texto: de mas lenta a mas rapida (ms por letra).
const VELOCIDADES = [
  { ms: 45, nombre: "Muy lenta" },
  { ms: 32, nombre: "Lenta" },
  { ms: 22, nombre: "Normal" },
  { ms: 12, nombre: "Rapida" },
  { ms: 0,  nombre: "Instantanea" },
];

// Ajustes del jugador (se guardan en el navegador).
const ajustes = { volumen: 0.55, velocidad: 2 };
let VEL_TEXTO = VELOCIDADES[ajustes.velocidad].ms;

/* ---------------- Estado ---------------- */
const estado = {
  escena: null,
  paso: 0,
  fondo: null,
  musica: null,
  nombreJugador: NOMBRE_POR_DEFECTO,
  banderas: {},         // lo que el jugador hizo: { hablaste: true }
  spritesActivos: {},   // { aiko: {pose:"normal-feliz", donde:"centro"} }
  escribiendo: false,
  enOpciones: false,
  auto: false,
  saltar: false,
  audioOn: true,
  terminado: false,
};

let temporizadorTexto = null;
let temporizadorAuto  = null;
let capaActiva = "A";

/* ---------------- Audio ---------------- */
const audio = new Audio();
audio.loop = true;
audio.volume = ajustes.volumen;

function ponerMusica(alias){
  if (estado.musica === alias) return;
  estado.musica = alias || null;
  const ruta = alias ? MUSICA[alias] : null;
  if (!ruta){ audio.pause(); audio.removeAttribute("src"); return; }
  audio.src = ruta;
  audio.volume = ajustes.volumen;
  intentarSonar();
}

/* Los navegadores no dejan sonar musica hasta que el usuario toca algo.
   Probamos igual, y si nos rebotan lo reintentamos en el primer toque. */
let esperandoGesto = false;
function intentarSonar(){
  if (!estado.audioOn || !audio.src) return;
  audio.play().catch(() => {
    if (esperandoGesto) return;
    esperandoGesto = true;
    const reintentar = () => {
      esperandoGesto = false;
      document.removeEventListener("pointerdown", reintentar);
      document.removeEventListener("keydown", reintentar);
      if (estado.audioOn) audio.play().catch(() => {});
    };
    document.addEventListener("pointerdown", reintentar);
    document.addEventListener("keydown", reintentar);
  });
}

/* ---------------- Personajes ya conocidos ---------------- */
/* Se van desbloqueando en el panel "Personajes" a medida que aparecen. */
function leerConocidos(){
  try{ return new Set(JSON.parse(localStorage.getItem(CLAVE_CONOCIDOS) || "[]")); }
  catch(e){ return new Set(); }
}

function conocer(clave){
  if (!clave || clave === "narrador" || clave === "yo") return;
  const set = leerConocidos();
  if (set.has(clave)) return;
  set.add(clave);
  try{ localStorage.setItem(CLAVE_CONOCIDOS, JSON.stringify([...set])); }catch(e){}
}

/* ---------------- Texto con variables ---------------- */
/* Cambia {nombre} por el nombre que escribio el jugador. */
function resolver(txt){
  return String(txt).replace(/\{nombre\}/g, estado.nombreJugador);
}

/* ---------------- Fondos ---------------- */

/* En FONDOS cada entrada puede ser una ruta suelta:
       aula: "assets/img/aula.jpeg"
   o un objeto, si queres controlar como se encuadra:
       aula: { src: "assets/img/aula.jpeg", ajuste: "contain", posicion: "top center" }

   ajuste:
     "auto"    (por defecto) llena la pantalla, pero si para lograrlo tendria
               que recortar demasiado, muestra la foto entera y rellena los
               costados con una copia desenfocada.
     "cover"   llena siempre la pantalla, recortando lo que haga falta.
     "contain" muestra siempre la foto entera. */

// Si al recortar quedaria menos de esta parte de la foto, mejor mostrarla entera.
const MINIMO_VISIBLE = 0.55;

const tamanos = {};   // { alias: proporcion ancho/alto de la imagen }

function datosFondo(alias){
  const f = FONDOS[alias];
  if (!f) return null;
  return (typeof f === "string") ? { src: f } : f;
}

/* Cuanta parte de la foto se ve si la estiramos para llenar la pantalla. */
function porcionVisible(alias){
  const prop = tamanos[alias];
  if (!prop) return 1;                       // todavia no cargo: asumimos que entra
  const pantalla = (window.innerWidth || 1) / (window.innerHeight || 1);
  return Math.min(prop / pantalla, pantalla / prop);
}

function encuadrar(capa, alias){
  const d = datosFondo(alias);
  if (!d) return;
  const ajuste = d.ajuste || "auto";
  const entera = ajuste === "contain" ||
                 (ajuste === "auto" && porcionVisible(alias) < MINIMO_VISIBLE);
  capa.classList.toggle("contenida", entera);
  const frente = capa.querySelector(".frente");
  if (frente && d.posicion) frente.style.backgroundPosition = d.posicion;
}

function ponerFondo(alias){
  const d = datosFondo(alias);
  if (!d || estado.fondo === alias) return;
  estado.fondo = alias;

  const entra = capaActiva === "A" ? el.fondoB : el.fondoA;
  const sale  = capaActiva === "A" ? el.fondoA : el.fondoB;

  const url = 'url("' + d.src + '")';
  entra.querySelector(".frente").style.backgroundImage  = url;
  entra.querySelector(".relleno").style.backgroundImage = url;
  entra.dataset.fondo = alias;
  encuadrar(entra, alias);

  entra.classList.add("visible");
  sale.classList.remove("visible");
  capaActiva = capaActiva === "A" ? "B" : "A";
}

/* Al rotar el celular o cambiar el tamano de la ventana, el encuadre se
   recalcula: lo que en horizontal entraba, en vertical capaz ya no. */
function reencuadrar(){
  [el.fondoA, el.fondoB].forEach((capa) => {
    if (capa.dataset.fondo) encuadrar(capa, capa.dataset.fondo);
  });
}
window.addEventListener("resize", reencuadrar);
window.addEventListener("orientationchange", reencuadrar);

/* ---------------- Sprites ---------------- */
function ponerSprite(clave, pose, donde){
  if (pose == null){
    delete estado.spritesActivos[clave];
  } else {
    const previo = estado.spritesActivos[clave];
    estado.spritesActivos[clave] = {
      pose: pose,
      donde: donde || (previo && previo.donde) || "centro",
    };
  }
  dibujarSprites();
}

function rutaSprite(clave, pose){
  const per = PERSONAJES[clave];
  if (!per || !per.carpeta) return null;
  return per.carpeta + pose + ".png";
}

function dibujarSprites(){
  el.sprites.innerHTML = "";
  for (const [clave, dato] of Object.entries(estado.spritesActivos)){
    const ruta = rutaSprite(clave, dato.pose);
    if (!ruta) continue;
    const n = document.createElement("img");
    n.src = ruta;
    n.className = dato.donde;
    n.dataset.quien = clave;
    n.alt = (PERSONAJES[clave] && PERSONAJES[clave].nombre) || clave;
    el.sprites.appendChild(n);
  }
}

/* Resalta a quien esta hablando y apaga al resto. */
function resaltar(quien){
  const activos = Object.keys(estado.spritesActivos);
  el.sprites.querySelectorAll("img").forEach((n) => {
    n.classList.toggle("apagado", activos.length > 1 && quien && n.dataset.quien !== quien);
  });
}

/* ---------------- Texto (efecto maquina de escribir) ---------------- */
function escribir(txt){
  clearTimeout(temporizadorTexto);
  el.texto.textContent = "";
  el.flecha.classList.remove("mostrar");
  estado.escribiendo = true;

  if (estado.saltar || VEL_TEXTO === 0){ terminarTexto(txt); return; }

  let i = 0;
  (function letra(){
    el.texto.textContent = txt.slice(0, ++i);
    if (i < txt.length) temporizadorTexto = setTimeout(letra, VEL_TEXTO);
    else terminarTexto(txt);
  })();
}

function terminarTexto(txt){
  clearTimeout(temporizadorTexto);
  el.texto.textContent = txt;
  estado.escribiendo = false;
  el.flecha.classList.add("mostrar");
  programarAuto();
}

function programarAuto(){
  clearTimeout(temporizadorAuto);
  if (estado.saltar)    temporizadorAuto = setTimeout(siguiente, 60);
  else if (estado.auto) temporizadorAuto = setTimeout(siguiente, ESPERA_AUTO);
}

/* ---------------- Motor de pasos ---------------- */
function irAEscena(nombre){
  if (!HISTORIA[nombre]){ console.error("No existe la escena:", nombre); return; }
  estado.escena = nombre;
  estado.paso = -1;
  siguiente();
}

function siguiente(){
  clearTimeout(temporizadorAuto);
  if (estado.enOpciones || estado.terminado) return;

  // Si todavia se esta escribiendo, el primer clic completa el texto.
  if (estado.escribiendo){
    terminarTexto(resolver(HISTORIA[estado.escena][estado.paso].texto));
    return;
  }

  el.flecha.classList.remove("mostrar");

  const escena = HISTORIA[estado.escena];
  estado.paso++;

  if (estado.paso >= escena.length){ finalizar(); return; }
  ejecutar(escena[estado.paso]);
}

function ejecutar(p){
  // Pasos condicionales: si no se cumple la condicion, el paso entero se saltea.
  //   { si:   "hablaste", texto: "..." }  -> solo si la bandera esta puesta
  //   { sino: "hablaste", texto: "..." }  -> solo si NO esta puesta
  if (("si"   in p && !estado.banderas[p.si]) ||
      ("sino" in p &&  estado.banderas[p.sino])){
    siguiente();
    return;
  }

  // { recordar: "hablaste" } deja anotado algo para consultarlo mas adelante.
  if ("recordar" in p) estado.banderas[p.recordar] = true;

  // Los pasos "de escenario" se aplican y siguen solos, sin pedir clic.
  if ("fondo"  in p) ponerFondo(p.fondo);
  if ("musica" in p) ponerMusica(p.musica);

  // Sprites: cualquier clave que sea un personaje con carpeta propia.
  // Ej:  { aiko: "normal-feliz" }   o   { aiko: null }   para ocultarla.
  for (const clave of Object.keys(p)){
    if (clave === "quien") continue;
    const per = PERSONAJES[clave];
    if (per && per.carpeta) ponerSprite(clave, p[clave], p.donde);
  }

  if ("esperar" in p){
    el.dialogo.classList.add("oculto");
    setTimeout(siguiente, estado.saltar ? 30 : p.esperar);
    return;
  }

  if ("opciones" in p){ mostrarOpciones(p.opciones); return; }
  if ("fin" in p && p.fin){ finalizar(); return; }

  if ("texto" in p){
    const per = PERSONAJES[p.quien] || PERSONAJES.narrador;
    el.nombre.textContent = resolver(per.nombre || "");
    el.nombre.style.color = per.color || "var(--acento)";
    el.dialogo.classList.remove("oculto");
    resaltar(p.quien);
    conocer(p.quien);
    escribir(resolver(p.texto));
    guardarAuto();
    return;
  }

  if ("ir" in p){ irAEscena(p.ir); return; }

  siguiente();   // era un paso solo visual: continuar
}

function mostrarOpciones(lista){
  estado.enOpciones = true;
  el.dialogo.classList.add("oculto");
  el.opciones.innerHTML = "";
  lista.forEach((op) => {
    const b = document.createElement("button");
    b.className = "opcion";
    b.textContent = resolver(op.texto);
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      estado.enOpciones = false;
      estado.saltar = false;
      $("btnSaltar").classList.remove("activo");
      el.opciones.classList.add("oculto");
      irAEscena(op.ir);
    });
    el.opciones.appendChild(b);
  });
  el.opciones.classList.remove("oculto");
}

function finalizar(){
  estado.terminado = true;
  estado.enOpciones = true;
  estado.auto = false;
  estado.saltar = false;
  el.dialogo.classList.add("oculto");
  el.opciones.innerHTML = "";
  const b = document.createElement("button");
  b.className = "opcion";
  b.textContent = "Volver al menu";
  b.addEventListener("click", (e) => { e.stopPropagation(); location.reload(); });
  el.opciones.appendChild(b);
  el.opciones.classList.remove("oculto");
}

/* ---------------- Guardar / Cargar ---------------- */
function instantanea(){
  return {
    escena: estado.escena, paso: estado.paso,
    fondo: estado.fondo, musica: estado.musica,
    nombreJugador: estado.nombreJugador,
    banderas: estado.banderas,
    sprites: estado.spritesActivos,
  };
}

function guardar(){
  try{
    localStorage.setItem(CLAVE_SAVE, JSON.stringify(instantanea()));
    avisar("Partida guardada");
  }catch(e){ avisar("No se pudo guardar"); }
}

function guardarAuto(){
  try{ localStorage.setItem(CLAVE_SAVE + "-auto", JSON.stringify(instantanea())); }catch(e){}
}

function leerSave(clave){
  try{ return JSON.parse(localStorage.getItem(clave) || "null"); }catch(e){ return null; }
}

function cargar(){
  const d = leerSave(CLAVE_SAVE) || leerSave(CLAVE_SAVE + "-auto");
  if (!d || !HISTORIA[d.escena]){ avisar("No hay partida guardada"); return; }
  estado.terminado = false;
  estado.enOpciones = false;
  estado.escribiendo = false;
  el.opciones.classList.add("oculto");
  estado.nombreJugador = d.nombreJugador || NOMBRE_POR_DEFECTO;
  estado.banderas = d.banderas || {};
  PERSONAJES.yo.nombre = estado.nombreJugador;
  estado.spritesActivos = d.sprites || {};
  dibujarSprites();
  estado.fondo  = null; ponerFondo(d.fondo);
  estado.musica = null; ponerMusica(d.musica);
  estado.escena = d.escena;
  estado.paso   = d.paso - 1;
  el.menu.classList.add("oculto");
  el.pantallaNombre.classList.add("oculto");
  siguiente();
}

function avisar(msg){
  const n = document.createElement("div");
  n.textContent = msg;
  n.style.cssText = "position:absolute;left:50%;top:14%;transform:translateX(-50%);" +
    "background:rgba(13,15,22,.9);border:1px solid rgba(255,255,255,.15);color:#eef1f8;" +
    "padding:.6em 1.2em;border-radius:999px;font-size:14px;z-index:50;pointer-events:none;" +
    "transition:opacity .4s";
  $("juego").appendChild(n);
  setTimeout(() => { n.style.opacity = "0"; setTimeout(() => n.remove(), 400); }, 1300);
}

/* ---------------- Ajustes del jugador ---------------- */
function cargarAjustes(){
  try{
    const d = JSON.parse(localStorage.getItem(CLAVE_AJUSTES) || "null");
    if (d){
      if (typeof d.volumen === "number") ajustes.volumen = Math.min(1, Math.max(0, d.volumen));
      if (typeof d.velocidad === "number" && VELOCIDADES[d.velocidad]) ajustes.velocidad = d.velocidad;
    }
  }catch(e){}
  aplicarAjustes();
}

function guardarAjustes(){
  try{ localStorage.setItem(CLAVE_AJUSTES, JSON.stringify(ajustes)); }catch(e){}
}

function aplicarAjustes(){
  VEL_TEXTO = VELOCIDADES[ajustes.velocidad].ms;
  audio.volume = ajustes.volumen;
  $("ctrlVolumen").value = Math.round(ajustes.volumen * 100);
  $("valVolumen").textContent = Math.round(ajustes.volumen * 100) + "%";
  $("ctrlVelocidad").value = ajustes.velocidad;
  $("valVelocidad").textContent = VELOCIDADES[ajustes.velocidad].nombre;
}

$("ctrlVolumen").addEventListener("input", (e) => {
  ajustes.volumen = Number(e.target.value) / 100;
  aplicarAjustes();
  guardarAjustes();
  if (estado.audioOn) intentarSonar();
});

$("ctrlVelocidad").addEventListener("input", (e) => {
  ajustes.velocidad = Number(e.target.value);
  aplicarAjustes();
  guardarAjustes();
});

$("btnBorrar").addEventListener("click", () => {
  try{
    localStorage.removeItem(CLAVE_SAVE);
    localStorage.removeItem(CLAVE_SAVE + "-auto");
    localStorage.removeItem(CLAVE_CONOCIDOS);
  }catch(e){}
  $("btnContinuar").disabled = true;
  llenarPersonajes();
  avisar("Partida borrada");
});

/* ---------------- Paneles del menu ---------------- */
function abrirPanel(id){
  document.querySelectorAll(".panel").forEach((n) => n.classList.add("oculto"));
  const panel = $(id);
  if (!panel) return;
  if (id === "panelPersonajes") llenarPersonajes();
  panel.classList.remove("oculto");
}

function cerrarPaneles(){
  document.querySelectorAll(".panel").forEach((n) => n.classList.add("oculto"));
}

document.querySelectorAll("[data-panel]").forEach((b) =>
  b.addEventListener("click", () => abrirPanel(b.dataset.panel)));

document.querySelectorAll(".panel .volver").forEach((b) =>
  b.addEventListener("click", cerrarPaneles));

/* Arma las fichas del panel "Personajes" a partir de historia.js.
   Los que tienen "oculto: true" aparecen tapados hasta que los conoces. */
function llenarPersonajes(){
  const conocidos = leerConocidos();
  el.listaPersonajes.innerHTML = "";

  const fichas = Object.entries(PERSONAJES).filter(([, per]) => per.perfil);
  if (!fichas.length){
    el.listaPersonajes.textContent = "Todavia no hay fichas de personaje.";
    return;
  }

  for (const [clave, per] of fichas){
    const visible = !per.oculto || conocidos.has(clave);

    const ficha = document.createElement("div");
    ficha.className = "ficha" + (visible ? "" : " bloqueada");

    // La ficha muestra el chibi si lo tiene; si no, el sprite de cuerpo entero.
    const retrato = per.chibi
      || (per.carpeta && per.poses && per.poses.length
            ? per.carpeta + (per.retrato || per.poses[0]) + ".png"
            : null);

    if (visible && retrato){
      const img = document.createElement("img");
      img.src = retrato;
      if (per.chibi) img.className = "chibi";
      img.alt = per.nombre;
      ficha.appendChild(img);
    } else {
      const hueco = document.createElement("div");
      hueco.className = "sin-foto";
      // Se dibuja como una foto vacia, del mismo tamano que las demas.
      hueco.style.cssText = "width:clamp(58px,11vw,84px);height:clamp(78px,15vw,112px);" +
        "border-radius:10px;background:rgba(0,0,0,.28);flex:none;";
      hueco.textContent = visible ? per.nombre.charAt(0) : "?";
      ficha.appendChild(hueco);
    }

    const datos = document.createElement("div");
    const h = document.createElement("h4");
    h.textContent = visible ? per.nombre : "???";
    h.style.color = per.color || "var(--acento)";
    const desc = document.createElement("p");
    desc.textContent = visible ? per.perfil : "Todavia no lo conoces.";
    datos.appendChild(h);
    datos.appendChild(desc);
    ficha.appendChild(datos);

    el.listaPersonajes.appendChild(ficha);
  }
}

/* ---------------- Controles ---------------- */
function alternar(btn, campo){
  estado[campo] = !estado[campo];
  btn.classList.toggle("activo", estado[campo]);
  if (estado[campo]) programarAuto();
  else clearTimeout(temporizadorAuto);
}

el.avanzar.addEventListener("click", siguiente);

document.addEventListener("keydown", (e) => {
  if (document.activeElement === el.campoNombre) return;
  if (el.menu.classList.contains("oculto") &&
      el.pantallaNombre.classList.contains("oculto") &&
      (e.code === "Space" || e.code === "Enter" || e.code === "ArrowRight")){
    e.preventDefault();
    siguiente();
  }
  if (e.code === "Escape"){
    if (document.querySelector(".panel:not(.oculto)")) cerrarPaneles();
    else if (document.fullscreenElement) document.exitFullscreen();
  }
});

$("btnAuto").addEventListener("click", (e) => { e.stopPropagation(); alternar($("btnAuto"), "auto"); });
$("btnSaltar").addEventListener("click", (e) => { e.stopPropagation(); alternar($("btnSaltar"), "saltar"); });
$("btnGuardar").addEventListener("click", (e) => { e.stopPropagation(); guardar(); });
$("btnCargar").addEventListener("click",  (e) => { e.stopPropagation(); cargar(); });

$("btnAudio").addEventListener("click", (e) => {
  e.stopPropagation();
  estado.audioOn = !estado.audioOn;
  $("btnAudio").classList.toggle("activo", !estado.audioOn);
  if (estado.audioOn && estado.musica) audio.play().catch(() => {});
  else audio.pause();
});

$("btnPantalla").addEventListener("click", (e) => {
  e.stopPropagation();
  if (document.fullscreenElement) document.exitFullscreen();
  else if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(() => {});
  }
});

$("btnEmpezar").addEventListener("click", () => {
  cerrarPaneles();
  el.menu.classList.add("oculto");
  el.pantallaNombre.classList.remove("oculto");
  // El foco automatico abre el teclado en el celular; en PC deja escribir directo.
  setTimeout(() => el.campoNombre.focus(), 350);
});

function confirmarNombre(){
  const escrito = el.campoNombre.value.trim().replace(/\s+/g, " ");
  estado.nombreJugador = escrito || NOMBRE_POR_DEFECTO;
  PERSONAJES.yo.nombre = estado.nombreJugador;
  el.pantallaNombre.classList.add("oculto");
  estado.banderas = {};
  irAEscena("inicio");
}

$("btnConfirmarNombre").addEventListener("click", confirmarNombre);

el.campoNombre.addEventListener("keydown", (e) => {
  if (e.code === "Enter"){ e.preventDefault(); confirmarNombre(); }
  e.stopPropagation();   // que Espacio escriba, no que avance el dialogo
});

$("btnContinuar").addEventListener("click", cargar);

// Deshabilitar "Continuar" si no hay ninguna partida guardada.
if (!leerSave(CLAVE_SAVE) && !leerSave(CLAVE_SAVE + "-auto")){
  $("btnContinuar").disabled = true;
}

// Arranque: ajustes guardados y musica de portada.
cargarAjustes();
ponerMusica(MUSICA_MENU);

// Precargar fondos y sprites para que no parpadeen al aparecer.
Object.keys(FONDOS).forEach((alias) => {
  const d = datosFondo(alias);
  const i = new Image();
  i.onload = () => { tamanos[alias] = i.naturalWidth / i.naturalHeight; reencuadrar(); };
  i.src = d.src;
});
Object.values(PERSONAJES).forEach((per) => {
  (per.poses || []).forEach((pose) => { const i = new Image(); i.src = per.carpeta + pose + ".png"; });
  if (per.chibi) { const i = new Image(); i.src = per.chibi; }
});

// Evitar el zoom por doble toque en iOS.
let ultimoToque = 0;
document.addEventListener("touchend", (e) => {
  const ahora = new Date().getTime();
  if (ahora - ultimoToque < 300) e.preventDefault();
  ultimoToque = ahora;
}, { passive: false });

})();
