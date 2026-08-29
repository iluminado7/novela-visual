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
  menuJuego: $("menuJuego"),
  panelPartidas: $("panelPartidas"),
  listaPartidas: $("listaPartidas"),
  tituloPartidas: $("tituloPartidas"),
  menuFondo: $("menuFondo"),
  listaPersonajes: $("listaPersonajes"),
  tiraChibis: $("tiraChibis"),
  campoNombre: $("campoNombre"),
  avanzar: $("avanzar"),
};

const ESPERA_AUTO = 1400;  // ms extra en modo auto
const CLAVE_SAVE  = "novela-visual-save";
/* Afinidad: cuánto conectó el jugador con cada personaje. Se mueve con los
   pasos { afinidad: {...} } del guion y se consulta con { siAfinidad: ... }.
   El piso es negativo pero cortito: se puede caer mal, pero no cavar un pozo
   del que ya no se sale. */
const AFINIDAD_MIN = -3;
const AFINIDAD_MAX = 10;

const RANURAS     = 6;                      // cuantos puntos de guardado tiene el jugador
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
  afinidad: {},         // cuánto se acercó a cada uno: { alvaro: 3, pato: -1 }
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
      document.removeEventListener("touchend", reintentar);
      // Volvemos a pasar por aca: si el navegador lo rechaza de nuevo,
      // queda esperando el toque siguiente en vez de rendirse.
      intentarSonar();
    };
    document.addEventListener("pointerdown", reintentar);
    document.addEventListener("keydown", reintentar);
    document.addEventListener("touchend", reintentar);
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

/* ---------------- Afinidad ---------------- */
function afinidadDe(clave){
  return estado.afinidad[clave] || 0;
}

function moverAfinidad(cambios){
  for (const [clave, delta] of Object.entries(cambios || {})){
    if (typeof delta !== "number") continue;
    const nueva = afinidadDe(clave) + delta;
    estado.afinidad[clave] = Math.max(AFINIDAD_MIN, Math.min(AFINIDAD_MAX, nueva));
  }
}

/* ¿Se cumple el { siAfinidad } de este paso? */
function cumpleAfinidad(p){
  if (!("siAfinidad" in p)) return true;
  const valor = afinidadDe(p.siAfinidad);
  if (p.min != null && valor < p.min) return false;
  if (p.max != null && valor > p.max) return false;
  return true;
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
      ("sino" in p &&  estado.banderas[p.sino]) ||
      !cumpleAfinidad(p)){
    siguiente();
    return;
  }

  // { recordar: "hablaste" } deja anotado algo para consultarlo mas adelante.
  if ("recordar" in p) estado.banderas[p.recordar] = true;

  // { afinidad: { alvaro: 1, pato: -1 } } mueve la relacion con cada uno.
  if ("afinidad" in p) moverAfinidad(p.afinidad);

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
    // Para mostrar la ranura sin tener que cargar la partida.
    fecha: new Date().toISOString(),
    escena_nombre: estado.escena,
    linea: el.texto.textContent || "",

    escena: estado.escena, paso: estado.paso,
    fondo: estado.fondo, musica: estado.musica,
    nombreJugador: estado.nombreJugador,
    banderas: estado.banderas,
    afinidad: estado.afinidad,
    sprites: estado.spritesActivos,
  };
}

/* Cada ranura es una clave distinta. La "-auto" es el autoguardado. */
function claveRanura(i){
  return i === "auto" ? CLAVE_SAVE + "-auto" : CLAVE_SAVE + "-" + i;
}

function guardarEn(i){
  try{
    localStorage.setItem(claveRanura(i), JSON.stringify(instantanea()));
    avisar("Guardado en la ranura " + (i + 1));
    actualizarContinuar();
    return true;
  }catch(e){
    avisar("No se pudo guardar");
    return false;
  }
}

function borrarRanura(i){
  try{ localStorage.removeItem(claveRanura(i)); }catch(e){}
  actualizarContinuar();
}

function hayAlgunaPartida(){
  if (leerSave(claveRanura("auto"))) return true;
  for (let i = 0; i < RANURAS; i++) if (leerSave(claveRanura(i))) return true;
  return false;
}

function actualizarContinuar(){
  $("btnContinuar").disabled = !hayAlgunaPartida();
}

/* Fecha corta y legible: "14 mar, 19:32" */
function fechaCorta(iso){
  try{
    const d = new Date(iso);
    const meses = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
    const dosCifras = (x) => String(x).padStart(2, "0");
    return `${d.getDate()} ${meses[d.getMonth()]}, ${dosCifras(d.getHours())}:${dosCifras(d.getMinutes())}`;
  }catch(e){ return ""; }
}

function guardarAuto(){
  try{ localStorage.setItem(claveRanura("auto"), JSON.stringify(instantanea())); }catch(e){}
}

function leerSave(clave){
  try{ return JSON.parse(localStorage.getItem(clave) || "null"); }catch(e){ return null; }
}

/* ---------------- Panel de partidas ---------------- */
let modoPartidas = "cargar";   // "cargar" o "guardar"

function abrirPartidas(modo){
  modoPartidas = modo;
  el.tituloPartidas.textContent = modo === "guardar" ? "Guardar partida" : "Cargar partida";
  dibujarRanuras();
  el.panelPartidas.classList.remove("oculto");
}

function cerrarPartidas(){
  el.panelPartidas.classList.add("oculto");
}

function dibujarRanuras(){
  el.listaPartidas.innerHTML = "";
  const guardando = modoPartidas === "guardar";

  // El autoguardado solo se puede cargar, nunca pisar a mano.
  const lista = guardando ? [] : ["auto"];
  for (let i = 0; i < RANURAS; i++) lista.push(i);

  for (const i of lista){
    const d = leerSave(claveRanura(i));
    const auto = i === "auto";
    const vacia = !d;

    const b = document.createElement("button");
    b.className = "ranura" + (vacia ? " vacia" : "");
    // Una ranura vacia no se puede cargar, y el autoguardado no se puede pisar.
    if (vacia && !guardando) b.disabled = true;

    const foto = document.createElement("div");
    foto.className = "ranura-foto";
    const fondo = d && FONDOS[d.fondo];
    if (fondo) foto.style.backgroundImage = 'url("' + (typeof fondo === "string" ? fondo : fondo.src) + '")';
    else { foto.classList.add("sin"); foto.textContent = guardando ? "+" : "—"; }

    const datos = document.createElement("div");
    datos.className = "ranura-datos";

    const titulo = document.createElement("div");
    titulo.className = "ranura-titulo";
    titulo.textContent = auto ? "Autoguardado" : "Ranura " + (i + 1);

    const detalle = document.createElement("div");
    detalle.className = "ranura-detalle";
    detalle.textContent = vacia
      ? (guardando ? "Vacía — tocá para guardar acá" : "Vacía")
      : `${d.nombreJugador || ""} · ${d.escena_nombre || "?"} · ${fechaCorta(d.fecha)}`;

    datos.appendChild(titulo);
    datos.appendChild(detalle);

    if (!vacia && d.linea){
      const linea = document.createElement("div");
      linea.className = "ranura-linea";
      linea.textContent = d.linea;
      datos.appendChild(linea);
    }

    b.appendChild(foto);
    b.appendChild(datos);

    // Pisar o borrar una partida pide un segundo toque, para no perderla sin querer.
    const pedirConfirmacion = (texto, alConfirmar) => {
      if (b.dataset.confirmando === "si"){
        b.dataset.confirmando = "";
        alConfirmar();
        return;
      }
      el.listaPartidas.querySelectorAll(".ranura").forEach((o) => {
        o.dataset.confirmando = ""; o.classList.remove("confirmando");
      });
      b.dataset.confirmando = "si";
      b.classList.add("confirmando");
      titulo.textContent = texto;
      setTimeout(() => {
        if (b.dataset.confirmando !== "si") return;
        b.dataset.confirmando = "";
        b.classList.remove("confirmando");
        titulo.textContent = auto ? "Autoguardado" : "Ranura " + (i + 1);
      }, 3000);
    };

    if (!vacia && !auto){
      const equis = document.createElement("button");
      equis.className = "ranura-borrar";
      equis.textContent = "×";
      equis.title = "Borrar";
      equis.addEventListener("click", (e) => {
        e.stopPropagation();
        pedirConfirmacion("¿Borrar? Tocá de nuevo", () => {
          borrarRanura(i);
          dibujarRanuras();
          avisar("Ranura " + (i + 1) + " borrada");
        });
      });
      b.appendChild(equis);
    }

    b.addEventListener("click", (e) => {
      e.stopPropagation();
      if (guardando){
        if (vacia){ guardarEn(i); cerrarPartidas(); }
        else pedirConfirmacion("¿Pisar? Tocá de nuevo", () => {
          guardarEn(i); cerrarPartidas();
        });
      } else {
        cerrarPartidas();
        cargarDe(i);
      }
    });

    el.listaPartidas.appendChild(b);
  }
}

$("cerrarPartidas").addEventListener("click", (e) => { e.stopPropagation(); cerrarPartidas(); });

function cargarDe(i){
  const d = leerSave(claveRanura(i));
  if (!d || !HISTORIA[d.escena]){ avisar("Esa ranura está vacía"); return; }
  aplicar(d);
}

function cargar(){
  const d = leerSave(claveRanura("auto"));
  if (!d || !HISTORIA[d.escena]){ avisar("No hay partida guardada"); return; }
  aplicar(d);
}

function aplicar(d){
  cerrarMenuJuego();
  estado.terminado = false;
  estado.enOpciones = false;
  estado.escribiendo = false;
  el.opciones.classList.add("oculto");
  estado.nombreJugador = d.nombreJugador || NOMBRE_POR_DEFECTO;
  estado.banderas = d.banderas || {};
  estado.afinidad = d.afinidad || {};
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
    localStorage.removeItem(claveRanura("auto"));
    for (let i = 0; i < RANURAS; i++) localStorage.removeItem(claveRanura(i));
    localStorage.removeItem(CLAVE_SAVE);          // la ranura unica de antes
    localStorage.removeItem(CLAVE_CONOCIDOS);
  }catch(e){}
  actualizarContinuar();
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
    // El protagonista lleva el nombre del jugador, que cambia en cada partida:
    // en la ficha conviene un rótulo fijo.
    h.textContent = visible ? (per.nombreFicha || per.nombre) : "???";
    h.style.color = per.color || "var(--acento)";
    const desc = document.createElement("p");
    desc.textContent = visible ? per.perfil : "Todavia no lo conoces.";
    datos.appendChild(h);
    datos.appendChild(desc);
    ficha.appendChild(datos);

    el.listaPersonajes.appendChild(ficha);
  }
}

/* ---------------- Menú de la partida ---------------- */
/* El botón "Menú" de la barra abre las mismas opciones que el menú principal,
   sin salir de la partida. */

function abrirMenuJuego(){
  // Si venía en AUTO o salteando, lo frenamos: si no, sigue avanzando de fondo.
  ["auto", "saltar"].forEach((campo) => {
    if (!estado[campo]) return;
    estado[campo] = false;
    $(campo === "auto" ? "btnAuto" : "btnSaltar").classList.remove("activo");
  });
  clearTimeout(temporizadorAuto);
  el.menuJuego.classList.remove("oculto");
}

function cerrarMenuJuego(){
  el.menuJuego.classList.add("oculto");
  reiniciarConfirmacion($("btnAlMenu"), "Menú principal");
}

function menuJuegoAbierto(){
  return !el.menuJuego.classList.contains("oculto");
}

/* Pide un segundo toque antes de hacer algo que no tiene vuelta atrás. */
let temporizadorConfirmar = null;
function reiniciarConfirmacion(boton, textoOriginal){
  clearTimeout(temporizadorConfirmar);
  boton.dataset.confirmando = "";
  boton.classList.remove("confirmando");
  boton.textContent = textoOriginal;
}

function conConfirmacion(boton, textoOriginal, textoAviso, alConfirmar){
  if (boton.dataset.confirmando === "si"){
    reiniciarConfirmacion(boton, textoOriginal);
    alConfirmar();
    return;
  }
  boton.dataset.confirmando = "si";
  boton.classList.add("confirmando");
  boton.textContent = textoAviso;
  temporizadorConfirmar = setTimeout(() => reiniciarConfirmacion(boton, textoOriginal), 3500);
}

$("btnMenu").addEventListener("click", (e) => { e.stopPropagation(); abrirMenuJuego(); });
$("btnSeguir").addEventListener("click", (e) => { e.stopPropagation(); cerrarMenuJuego(); });

$("btnGuardarMenu").addEventListener("click", (e) => {
  e.stopPropagation(); cerrarMenuJuego(); abrirPartidas("guardar");
});
$("btnCargarMenu").addEventListener("click", (e) => {
  e.stopPropagation(); cerrarMenuJuego(); abrirPartidas("cargar");
});

$("btnAlMenu").addEventListener("click", (e) => {
  e.stopPropagation();
  conConfirmacion($("btnAlMenu"), "Menú principal", "Se pierde lo no guardado. Tocá de nuevo",
                  () => location.reload());
});

/* Tocar el fondo oscuro cierra el menú. */
el.menuJuego.addEventListener("click", (e) => {
  if (e.target === el.menuJuego) cerrarMenuJuego();
});

/* ---------------- Chibis del menú principal ---------------- */
/* Se arman solos con los personajes que tengan "chibi" en historia.js.
   Al pasarles el mouse o tocarlos, cambian a la pose de salto y brincan. */

const DURACION_SALTO = 450;   // ms; tiene que coincidir con la animación del CSS

function armarTiraChibis(){
  el.tiraChibis.innerHTML = "";

  for (const [clave, per] of Object.entries(PERSONAJES)){
    if (!per.chibi) continue;

    const b = document.createElement("button");
    b.className = "chibi-menu";
    b.setAttribute("aria-label", per.nombre);
    b.title = per.nombre;

    const quieto = document.createElement("img");
    quieto.className = "quieto";
    quieto.src = per.chibi;
    quieto.alt = per.nombre;
    b.appendChild(quieto);

    if (per.chibiSalto){
      const salta = document.createElement("img");
      salta.className = "salta";
      salta.src = per.chibiSalto;
      salta.alt = "";
      b.appendChild(salta);

      let temporizador = null;
      const saltar = () => {
        if (b.classList.contains("saltando")) return;   // que termine el que está en curso
        b.classList.add("saltando");
        clearTimeout(temporizador);
        temporizador = setTimeout(() => b.classList.remove("saltando"), DURACION_SALTO);
      };

      // pointerenter cubre el mouse; pointerdown, el dedo y el clic.
      b.addEventListener("pointerenter", saltar);
      b.addEventListener("pointerdown", saltar);
    }

    el.tiraChibis.appendChild(b);
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
  if (menuJuegoAbierto() || document.querySelector(".panel:not(.oculto)")) return;
  if (el.menu.classList.contains("oculto") &&
      el.pantallaNombre.classList.contains("oculto") &&
      (e.code === "Space" || e.code === "Enter" || e.code === "ArrowRight")){
    e.preventDefault();
    siguiente();
  }
  if (e.code === "Escape"){
    if (!el.panelPartidas.classList.contains("oculto")) cerrarPartidas();
    else if (document.querySelector(".panel:not(.oculto)")) cerrarPaneles();
    else if (menuJuegoAbierto()) cerrarMenuJuego();
    else if (el.menu.classList.contains("oculto")) abrirMenuJuego();
    else if (document.fullscreenElement) document.exitFullscreen();
  }
});

$("btnAuto").addEventListener("click", (e) => { e.stopPropagation(); alternar($("btnAuto"), "auto"); });
$("btnSaltar").addEventListener("click", (e) => { e.stopPropagation(); alternar($("btnSaltar"), "saltar"); });
$("btnGuardar").addEventListener("click", (e) => { e.stopPropagation(); abrirPartidas("guardar"); });
$("btnCargar").addEventListener("click",  (e) => { e.stopPropagation(); abrirPartidas("cargar"); });

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
  cerrarPartidas();
  cerrarMenuJuego();
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
  estado.afinidad = {};
  irAEscena("inicio");
}

$("btnConfirmarNombre").addEventListener("click", confirmarNombre);

el.campoNombre.addEventListener("keydown", (e) => {
  if (e.code === "Enter"){ e.preventDefault(); confirmarNombre(); }
  e.stopPropagation();   // que Espacio escriba, no que avance el dialogo
});

$("btnContinuar").addEventListener("click", () => abrirPartidas("cargar"));

// "Continuar" solo si hay algo guardado en alguna ranura.
actualizarContinuar();

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
  if (per.chibi)      { const i = new Image(); i.src = per.chibi; }
  if (per.chibiSalto) { const i = new Image(); i.src = per.chibiSalto; }
});

armarTiraChibis();

// Evitar el zoom por doble toque en iOS.
let ultimoToque = 0;
document.addEventListener("touchend", (e) => {
  const ahora = new Date().getTime();
  if (ahora - ultimoToque < 300) e.preventDefault();
  ultimoToque = ahora;
}, { passive: false });

})();
