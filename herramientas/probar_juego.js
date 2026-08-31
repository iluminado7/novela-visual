/*
 * probar_juego.js — juega la historia entera sin abrir el navegador.
 *
 * Uso (desde la carpeta del proyecto):
 *     node herramientas/probar_juego.js
 *
 * Simula un navegador minimo (DOM, Audio, localStorage) y corre motor.js
 * de verdad, recorriendo todas las ramas. Sirve para saber si rompiste algo
 * antes de ponerte a probar a mano.
 *
 * Comprueba: que ninguna rama se cuelgue, el recorrido de fondos, que la
 * musica cambie donde corresponde, que {nombre} se reemplace siempre, que
 * los sprites existan, que las banderas no se pisen entre ramas, y que el
 * guardado, los ajustes y el panel de personajes funcionen.
 */
const fs = require("fs"), path = require("path");
const RAIZ = path.resolve(__dirname, "..");

let nodos = {};
let pistas = [];
const almacen = {};
global.localStorage = {
  getItem: k => (k in almacen ? almacen[k] : null),
  setItem: (k, v) => { almacen[k] = String(v); },
  removeItem: k => { delete almacen[k]; },
};
global.location = { reload: () => { console.log("    [reload]"); } };

// setTimeout inmediato para que la simulacion no dependa del reloj real
const _st = global.setTimeout;
let pendientes = 0;
global.setTimeout = (f, ms) => { pendientes++; return _st(() => { pendientes--; f(); }, 0); };


function crearNodo(id) {
  const n = {
    id, tagName: "DIV", value: "", textContent: "", innerHTML: "",
    style: { cssText: "" }, dataset: {}, disabled: false, hijos: [],
    _cls: new Set(), _ev: {},
    classList: {
      add: (...c) => c.forEach(x => n._cls.add(x)),
      remove: (...c) => c.forEach(x => n._cls.delete(x)),
      toggle: (c, f) => { if (f === undefined) f = !n._cls.has(c); f ? n._cls.add(c) : n._cls.delete(c); },
      contains: c => n._cls.has(c),
    },
    get className() { return [...n._cls].join(" "); },
    set className(v) { n._cls = new Set(String(v).split(/\s+/).filter(Boolean)); },
    addEventListener: (t, f) => { (n._ev[t] = n._ev[t] || []).push(f); },
    click: () => (n._ev.click || []).forEach(f => f({ stopPropagation() {}, preventDefault() {} })),
    appendChild: c => { n.hijos.push(c); return c; },
    remove: () => {},
    querySelectorAll: (sel) => {
      if (!sel || sel === "img") return n.hijos.filter(h => h.tagName === "IMG");
      if (sel.startsWith(".")) return n.hijos.filter(h => h.classList.contains(sel.slice(1)));
      return n.hijos.filter(h => h.tagName === sel.toUpperCase());
    },
    querySelector: sel => n.hijos.find(h => h.classList.contains(sel.replace(".", ""))) || null,
    focus: () => { document.activeElement = n; },
    removeAttribute: () => {},
    setAttribute: (k, v) => { n[k] = v; },
    getAttribute: (k) => n[k],
  };
  return n;
}
const paneles = () => ["panelPersonajes","panelOpciones","panelAcerca","panelPartidas"]
  .map(i => nodos[i]);

function montar(){
nodos = {};
["fondoA","fondoB","sprites","dialogo","nombre","texto","flecha","opciones","menu",
 "nombreJugador","campoNombre","avanzar","juego","btnAuto","btnSaltar","btnGuardar",
 "btnCargar","btnAudio","btnPantalla","btnEmpezar","btnContinuar","btnConfirmarNombre",
 "menuFondo","listaPersonajes","ctrlVolumen","valVolumen","ctrlVelocidad","valVelocidad",
 "btnBorrar","panelPersonajes","panelOpciones","panelAcerca",
 "panelPartidas","listaPartidas","tituloPartidas","cerrarPartidas",
 "menuJuego","btnMenu","btnSeguir","btnGuardarMenu","btnCargarMenu","btnAlMenu",
 "tiraChibis"]
  .forEach(id => nodos[id] = crearNodo(id));

// Las capas de fondo llevan adentro .relleno (borroso) y .frente (la imagen).
for (const id of ["fondoA", "fondoB"]) {
  for (const clase of ["relleno", "frente"]) {
    const capa = crearNodo(null);
    capa.className = clase;
    nodos[id].hijos.push(capa);
  }
}

nodos.menuJuego.classList.add("oculto");

// Boton falso con data-panel: el motor le engancha el click para abrir el panel.
nodos.__btnPanel = crearNodo(null);
nodos.__btnPanel.dataset.panel = "panelPersonajes";

// innerHTML="" debe vaciar los hijos (el motor lo usa para redibujar sprites)
for (const n of Object.values(nodos)) {
  Object.defineProperty(n, "innerHTML", {
    get() { return ""; }, set(v) { if (v === "") n.hijos.length = 0; },
  });
}

global.document = {
  getElementById: id => nodos[id] || (nodos[id] = crearNodo(id)),
  createElement: t => { const n = crearNodo(null); n.tagName = t.toUpperCase(); return n; },
  querySelector: sel => (document.querySelectorAll(sel)[0] || null),
  querySelectorAll: sel => {
    if (sel.includes("[data-panel]")) return [nodos.__btnPanel];
    if (sel.includes(".volver"))      return [];
    if (sel.startsWith(".panel:not")) return paneles().filter(n => !n.classList.contains("oculto"));
    if (sel.startsWith(".panel"))     return paneles();
    return [];
  },
  addEventListener: () => {}, activeElement: null, fullscreenElement: null,
  documentElement: { requestFullscreen: () => Promise.resolve() },
};
global.window = {
  innerWidth: 1280, innerHeight: 720,
  addEventListener: () => {},
};
global.Image = class {
  set src(v){ this._src = v; }            // no disparamos onload: no hay imagenes reales
  get src(){ return this._src; }
};
global.Audio = class {
  constructor(){ this.volume = 1; this._src = ""; }
  set src(v){ this._src = v; pistas.push(v); }
  get src(){ return this._src; }
  play(){ return Promise.resolve(); } pause(){} removeAttribute(){ this._src = ""; }
};
// --- cargar el juego ---
new Function(
  fs.readFileSync(path.join(RAIZ, "js/historia.js"), "utf8") +
  "\nglobal.HISTORIA=HISTORIA; global.FONDOS=FONDOS; global.MUSICA=MUSICA; global.PERSONAJES=PERSONAJES;"
)();
new Function(fs.readFileSync(path.join(RAIZ, "js/motor.js"), "utf8"))();
nodos.__musicaMenu = pistas[pistas.length - 1] || null;
}

// --- jugar ---
const esperar = () => new Promise(r => _st(r, 30));

async function jugar(nombreJugador, elegir) {
  montar();   // motor limpio para cada partida, como recargar la pagina
  console.log(`\n=== Partida como "${nombreJugador}" (elige ${JSON.stringify(elegir)}) ===`);
  const vistas = [], sprites = new Set(), fondos = [];
  pistas = [];
  const musicaEnMenu = nodos.__musicaMenu;
  nodos.btnEmpezar.click();
  await esperar();
  if (!nodos.nombreJugador.classList.contains("oculto") === false)
    throw new Error("la pantalla de nombre no se mostro");
  nodos.campoNombre.value = nombreJugador;
  nodos.btnConfirmarNombre.click();
  await esperar();

  let guardias = 0, ultimo = null, decisiones = 0;
  const TOPE = 6000;   // muy por encima de los pasos que tiene la historia
  while (guardias++ < TOPE) {
    if (nodos.dialogo.classList.contains("oculto") === false && nodos.texto.textContent !== ultimo) {
      ultimo = nodos.texto.textContent;
      vistas.push((nodos.nombre.textContent ? nodos.nombre.textContent + ": " : "") + ultimo);
    }
    nodos.sprites.hijos.forEach(h => sprites.add(h._src || h.src));
    for (const c of [nodos.fondoA, nodos.fondoB]){
      const bg = c.querySelector(".frente").style.backgroundImage;
      if (bg && c.classList.contains("visible") && fondos[fondos.length-1] !== bg) fondos.push(bg);
    }

    if (!nodos.opciones.classList.contains("oculto") && nodos.opciones.hijos.length) {
      const ops = nodos.opciones.hijos;
      const etiquetas = ops.map(o => o.textContent);
      if (etiquetas[0] === "Volver al menu") { console.log("  -> Fin alcanzado."); break; }
      const cual = Math.min(Array.isArray(elegir) ? (elegir[decisiones++] ?? 0) : elegir,
                            ops.length - 1);
      console.log(`  -> Opciones: ${etiquetas.join(" | ")}  => elijo "${etiquetas[cual]}"`);
      ops[cual].click();
      await esperar();
      continue;
    }
    nodos.avanzar.click();
    await esperar();
  }
  if (guardias >= TOPE)
    throw new Error(`la historia no termino en ${TOPE} pasos: hay un bucle, o subi TOPE`);
  return { vistas, sprites: [...sprites], fondos, pistas: [...pistas], musicaEnMenu };
}

const SALTO = String.fromCharCode(10);
const corto = r => r.replace(/^url\("|"\)$/g, "").replace("assets/", "");

(async () => {
  const errores = [];

  // Las cuatro combinaciones de las dos decisiones, mas el nombre vacio.
  // 5 decisiones ya: probamos recorridos representativos en vez de todas las
  // combinaciones. Primero siempre la 1a opcion, despues siempre la ultima, y
  // despues mezclas que tocan los extremos de afinidad.
  // Las 7 decisiones, en el orden en que aparecen:
  //   1 andén · 2 invitación · 3 chiste de Álvaro · 4 foto de Pato
  //   5 alfajor · 6 manga de Iara · 7 Mauri
  for (const [n, e] of [
        // el que se lleva bien con todos
        ["Fede",      [0, 0, 1, 0, 0, 0, 0]],
        // el que se lleva mal con todos: pasa de largo, rechaza, bardea y miente
        ["Ana Lucia", [1, 1, 2, 2, 2, 1, 1]],
        // mezcla: le miente a Iara pero se acerca a Mauri
        ["Rocio",     [0, 1, 0, 1, 1, 1, 0]],
        // el mejor camino posible con Aiko: acepta, le escribe, lleva facturas,
        // le dice la verdad en el vagon y le respeta el espacio con el padre.
        // Es la unica combinacion que llega a la escena del cuarto.
        ["Nico",      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]],
        // Afinidad media con Aiko y respetarle el espacio: tiene que saltear
        // la escena del cuarto sin colgarse.
        ["Vale",      [1, 0, 0, 0, 2, 1, 1, 1, 1, 2, 1]],
        // Rechaza la invitacion y despues le sigue TODOS los coqueteos
        // del recreo: es el mejor final posible de esa rama.
        ["Juli",      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0]],
        // Rechaza y se hace el boludo en los tres: la rama fria.
        ["Bruno",     [0, 1, 0, 0, 0, 0, 0, 1, 1, 1]],
        // mezcla al revés: banca a Álvaro, ignora a Pato y a Mauri
        ["Tomi",      [1, 0, 1, 2, 0, 0, 1]],
        ["",          [0, 0, 0, 0, 0, 0, 0]]]) {
    const r = await jugar(n, e);
    console.log(`     ${r.vistas.length} lineas`);
    console.log(`     sprites: ${r.sprites.map(corto).sort().join(", ")}`);
    console.log(`     fondos:  ${r.fondos.map(corto).join(" -> ")}`);
    console.log(`     musica:  ${["menu: " + corto(r.musicaEnMenu || "-"), ...r.pistas.map(p => "juego: " + corto(p))].join(" -> ")}`);

    const texto = r.vistas.join(SALTO);
    const esperado = n.trim() || "Kaito";
    if (texto.includes("{nombre}")) errores.push(`quedo un {nombre} sin resolver con "${n}"`);
    if (!texto.includes(esperado)) errores.push(`el nombre "${esperado}" no aparece`);

    // Recorrido de fondos pedido: amanecer -> subte -> entrada -> patio -> aula -> computacion
    const pedido = ["amanecer","subte","entrada","patio","aula","computacion"];
    const vistos = r.fondos.map(corto);
    let k = 0;
    for (const f of vistos) if (f.includes(pedido[k])) k++;
    if (k < pedido.length)
      console.log(`     (la rama no pasa por ${pedido.slice(k).join(", ")})`);

    // Musica: menu = tema principal; al empezar = ohayou; en el aula = okay-everyone
    if (!(r.musicaEnMenu || "").includes("tema-principal"))
      errores.push("el menu no arranca con el tema principal");
    if (!(r.pistas[0] || "").includes("ohayou"))
      errores.push("al empezar el juego no suena la pista 2 (ohayou)");
    if (!(r.pistas[1] || "").includes("okay-everyone"))
      errores.push("al llegar al aula no suena la pista 3 (okay-everyone)");

    // Los cinco del fondo tienen que presentarse
    for (const quien of ["Alvaro","Álvaro","Pato","Mauri","Lucas","Franco"])
      if (quien !== "Alvaro" && !texto.includes(quien + ":"))
        errores.push(`${quien} nunca habla en el aula`);

    // Cierre: Aiko pide ir a la casa
    if (!texto.includes("¿Puedo ir a tu casa a terminarlo?"))
      errores.push("el acto no cierra con Aiko pidiendo ir a la casa");

    if (n === "Nico") {
      const af = (JSON.parse(almacen["novela-visual-save-auto"] || "{}").afinidad) || {};
      if (!texto.includes("Veinte cent"))
        errores.push("con afinidad alta y respetarle el espacio no se llego al cuarto");
    }
    for (const sp of r.sprites)
      if (!fs.existsSync(path.join(RAIZ, sp))) errores.push(`sprite inexistente: ${sp}`);

    // Las dos ramas tienen que dar textos distintos
    if (e[0] === 1 && texto.includes("Llegaste cinco minutos tarde"))
      errores.push("la rama 'seguir de largo' esta mostrando texto de la rama 'hablarle'");
    if (e[0] === 0 && texto.includes("era un saludo, boludo"))
      errores.push("la rama 'hablarle' esta mostrando texto de la rama 'seguir de largo'");

    // --- Menu de la partida ---
    nodos.btnAuto.click();               // lo dejamos en AUTO a proposito
    await esperar();
    nodos.btnMenu.click();
    await esperar();
    if (nodos.menuJuego.classList.contains("oculto"))
      errores.push("el boton Menu no abrio el menu de la partida");
    if (nodos.btnAuto.classList.contains("activo"))
      errores.push("abrir el menu no freno el modo AUTO");
    nodos.btnSeguir.click();
    await esperar();
    if (!nodos.menuJuego.classList.contains("oculto"))
      errores.push("\"Seguir jugando\" no cerro el menu");

    nodos.btnGuardar.click();            // abre el panel de ranuras
    await esperar();
    const ranuras = nodos.listaPartidas.hijos;
    if (!ranuras.length) errores.push("el panel de guardado no mostro ninguna ranura");
    ranuras[0].click();                  // guarda en la ranura 1
    await esperar();
    const g = JSON.parse(almacen["novela-visual-save-0"] || "null");
    if (!g) errores.push("btnGuardar no escribio nada");
    else {
      if (g.nombreJugador !== esperado) errores.push(`el guardado perdio el nombre (${g.nombreJugador})`);
      const af = g.afinidad || {};
      const resumen = Object.entries(af).map(([k, v]) => `${k} ${v > 0 ? "+" : ""}${v}`).join(", ");
      console.log(`     afinidad: ${resumen || "(nadie sumo todavia)"}`);
      if (e[0] === 0 && !g.banderas.hablaste) errores.push("el guardado perdio la bandera 'hablaste'");
      if (e[0] === 1 && g.banderas.hablaste)  errores.push("la bandera 'hablaste' quedo puesta sin haber hablado");
    }
    for (let i = 0; i < 6; i++) delete almacen["novela-visual-save-" + i];
    delete almacen["novela-visual-save-auto"];
  }

  // --- El menu: paneles, personajes desbloqueados y ajustes ---
  console.log(SALTO+"=== Menu ===");
  montar();
  const conocidos = JSON.parse(almacen["novela-visual-conocidos"] || "[]");
  console.log(`  personajes desbloqueados al jugar: ${conocidos.join(", ") || "(ninguno)"}`);
  for (const q of ["aiko","alvaro","pato","mauri","lucas","franco"])
    if (!conocidos.includes(q)) errores.push(`"${q}" no quedo desbloqueado en el panel Personajes`);

  // Abrir el panel de personajes arma las fichas: revisamos que retrato usa cada una.
  // La tira de chibis del menu principal
  const chibis = nodos.tiraChibis.hijos;
  console.log(`  chibis en la portada: ${chibis.length}`);
  for (const c of chibis) {
    const imgs = c.hijos.filter(h => h.tagName === "IMG");
    const salta = imgs.length > 1;
    for (const im of imgs) {
      const src = im._src || im.src;
      if (!fs.existsSync(path.join(RAIZ, src)))
        errores.push(`chibi inexistente en la portada: ${src}`);
    }
    console.log(`    ${String(c.title).padEnd(8)} ${salta ? "salta" : "SIN pose de salto"}`);
  }

  nodos.__btnPanel.click();   // el motor arma las fichas al abrir el panel
  const fichas = nodos.listaPersonajes.hijos;
  console.log(`  fichas armadas: ${fichas.length}`);
  for (const f of fichas) {
    const buscar = (n, tag) => n.hijos.reduce((r, h) =>
      r || (h.tagName === tag ? h : buscar(h, tag)), null);
    const img = buscar(f, "IMG");
    const nombre = (buscar(f, "H4") || {}).textContent;
    const src = img ? (img._src || img.src) : "(sin foto)";
    console.log(`    ${String(nombre).padEnd(9)} ${img ? img.className.padEnd(6) : "      "} ${src}`);
    if (img && !fs.existsSync(path.join(RAIZ, src)))
      errores.push(`la ficha de ${nombre} apunta a ${src}, que no existe`);
  }

  nodos.panelPersonajes.classList.add("oculto");
  // abrir el panel dispara el armado de las fichas

  nodos.ctrlVolumen.value = "20";
  (nodos.ctrlVolumen._ev.input || []).forEach(f => f({ target: { value: "20" } }));
  if (JSON.parse(almacen["novela-visual-ajustes"]).volumen !== 0.2)
    errores.push("el volumen no se guardo");
  console.log(`  volumen guardado: ${nodos.valVolumen.textContent}`);

  (nodos.ctrlVelocidad._ev.input || []).forEach(f => f({ target: { value: "4" } }));
  if (JSON.parse(almacen["novela-visual-ajustes"]).velocidad !== 4)
    errores.push("la velocidad de texto no se guardo");
  console.log(`  velocidad guardada: ${nodos.valVelocidad.textContent}`);

  nodos.btnBorrar.click();
  await esperar();
  if (almacen["novela-visual-conocidos"]) errores.push("borrar partida no limpio los personajes conocidos");
  if (!nodos.btnContinuar.disabled) errores.push("tras borrar, 'Continuar' quedo habilitado");
  console.log("  borrar partida: ok");

  console.log(SALTO+"---------------------------------------");
  if (errores.length) { errores.forEach(e => console.log("  X  " + e)); process.exit(1); }
  console.log("Todo OK.");
})().catch(e => { console.error("FALLO:", e.message, e.stack); process.exit(1); });
