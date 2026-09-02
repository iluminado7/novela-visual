/*
 * revisar_guion.js — revisa que el guion no tenga errores antes de jugarlo.
 *
 * Uso (desde la carpeta del proyecto):
 *     node herramientas/revisar_guion.js
 *
 * Comprueba que:
 *   - todos los "ir:" apunten a escenas que existen
 *   - todos los fondos, músicas y personajes usados estén definidos
 *   - todos los sprites que pide el guion existan como archivo
 *   - no haya escenas inalcanzables (escritas pero a las que nunca se llega)
 */

const fs = require("fs");
const path = require("path");

const RAIZ = path.resolve(__dirname, "..");
// Por defecto revisa el guion del juego, pero se le puede pasar otro archivo:
//     node herramientas/revisar_guion.js js/seguimiento.js
const GUION = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(RAIZ, "js", "historia.js");

const { HISTORIA, FONDOS, MUSICA, PERSONAJES } = new Function(
  fs.readFileSync(GUION, "utf8") +
  "\nreturn { HISTORIA, FONDOS, MUSICA, PERSONAJES };"
)();

let errores = 0;
const ok = (cond, msg) => { if (!cond) { console.log("  X  " + msg); errores++; } };
const existe = (rel) => fs.existsSync(path.join(RAIZ, rel));

const escenas = Object.keys(HISTORIA);
const POSICIONES = ["izquierda", "centro", "derecha"];

/* --- 1) Cada paso de cada escena --- */
for (const [nombre, pasos] of Object.entries(HISTORIA)) {
  if (!Array.isArray(pasos)) { ok(false, `la escena "${nombre}" no es una lista de pasos`); continue; }

  pasos.forEach((p, i) => {
    const donde = `${nombre}[${i}]`;

    if ("ir" in p) {
      ok(escenas.includes(p.ir), `${donde}: ir -> "${p.ir}" no existe`);
      // Una escena que se manda a si misma vuelve a leer el mismo paso y
      // salta otra vez: cuelga el navegador. Casi siempre es un copiar y
      // pegar del nombre equivocado.
      ok(p.ir !== nombre,
         `${donde}: ir -> "${p.ir}" es la misma escena. Eso es un bucle infinito ` +
         `y cuelga el juego.`);
    }
    if ("fondo" in p && p.fondo != null)
      ok(FONDOS[p.fondo], `${donde}: fondo "${p.fondo}" no está en FONDOS`);
    if ("musica" in p && p.musica != null)
      ok(MUSICA[p.musica], `${donde}: música "${p.musica}" no está en MUSICA`);
    if ("quien" in p)
      ok(PERSONAJES[p.quien], `${donde}: personaje "${p.quien}" no está en PERSONAJES`);
    if ("donde" in p)
      ok(POSICIONES.includes(p.donde), `${donde}: posición "${p.donde}" inválida (usá ${POSICIONES.join(" / ")})`);

    (p.opciones || []).forEach((o, j) => {
      const cual = `${donde}.opciones[${j}] ("${o.texto}")`;
      ok(escenas.includes(o.ir), `${cual}: ir -> "${o.ir}" no existe`);
      // Las opciones pueden llevar sus propias condiciones.
      if ("siAfinidad" in o) {
        ok(PERSONAJES[o.siAfinidad], `${cual}: siAfinidad de "${o.siAfinidad}", que no está en PERSONAJES`);
        ok(o.min != null || o.max != null, `${cual}: siAfinidad sin "min" ni "max"`);
      }
    });

    // Sprites: cualquier clave que sea un personaje con carpeta propia.
    for (const clave of Object.keys(p)) {
      if (clave === "quien") continue;
      const per = PERSONAJES[clave];
      if (per && per.carpeta && p[clave] != null) {
        // Error facil de cometer: escribir "null" entre comillas (texto) en vez
        // de null (el valor). Con comillas el motor busca un sprite llamado asi.
        if (String(p[clave]) === "null") {
          ok(false, `${donde}: ${clave}: "null" está entre comillas. Para sacarlo ` +
                    `de pantalla va sin comillas: { ${clave}: null }`);
          continue;
        }
        const rel = per.carpeta + p[clave] + ".png";
        ok(existe(rel), `${donde}: falta el sprite ${rel}`);
      }
    }
  });
}

/* --- 1c) La afinidad: que apunte a personajes reales y este bien formada --- */
const mueven = new Set(), consultada = new Map();
for (const [nombre, pasos] of Object.entries(HISTORIA))
  (pasos || []).forEach((p, i) => {
    const donde = `${nombre}[${i}]`;
    if ("afinidad" in p) {
      if (typeof p.afinidad !== "object" || p.afinidad === null)
        ok(false, `${donde}: "afinidad" tiene que ser un objeto, ej { alvaro: 1 }`);
      else for (const [clave, delta] of Object.entries(p.afinidad)) {
        ok(PERSONAJES[clave], `${donde}: afinidad con "${clave}", que no está en PERSONAJES`);
        ok(typeof delta === "number", `${donde}: afinidad."${clave}" tiene que ser un número`);
        mueven.add(clave);
      }
    }
    if ("siAfinidad" in p) {
      ok(PERSONAJES[p.siAfinidad],
         `${donde}: siAfinidad de "${p.siAfinidad}", que no está en PERSONAJES`);
      ok(p.min != null || p.max != null,
         `${donde}: siAfinidad sin "min" ni "max": nunca va a filtrar nada`);
      if (!consultada.has(p.siAfinidad)) consultada.set(p.siAfinidad, donde);
    }
  });
for (const [clave, donde] of consultada)
  if (!mueven.has(clave))
    console.log(`  !  ${donde}: se consulta la afinidad de "${clave}", pero ningún paso se la mueve`);

/* --- 1b) Las banderas: toda la que se consulta tiene que ponerse en algun lado --- */
const puestas = new Set(), consultadas = new Map();
for (const [nombre, pasos] of Object.entries(HISTORIA))
  (pasos || []).forEach((p, i) => {
    if ("recordar" in p) puestas.add(p.recordar);
    for (const clave of ["si", "sino"])
      if (clave in p && !consultadas.has(p[clave])) consultadas.set(p[clave], `${nombre}[${i}]`);
    // Las opciones también pueden consultar banderas.
    (p.opciones || []).forEach((o) => {
      for (const clave of ["si", "sino"])
        if (clave in o && !consultadas.has(o[clave]))
          consultadas.set(o[clave], `${nombre}[${i}].opciones`);
    });
  });
for (const [bandera, donde] of consultadas)
  ok(puestas.has(bandera),
     `${donde}: consulta la bandera "${bandera}" pero ningún paso hace { recordar: "${bandera}" }`);
[...puestas].filter((b) => !consultadas.has(b)).forEach((b) =>
  console.log(`  !  la bandera "${b}" se anota con { recordar } pero nunca se consulta`));

/* --- 2) Los assets declarados arriba del guion --- */
for (const [alias, f] of Object.entries(FONDOS)) {
  // Un fondo puede ser "ruta.jpg" o { src: "ruta.jpg", ajuste: "contain" }.
  const ruta = (typeof f === "string") ? f : f && f.src;
  ok(ruta, `FONDOS."${alias}" no tiene ruta (falta el "src")`);
  if (ruta) ok(existe(ruta), `FONDOS."${alias}" apunta a ${ruta}, que no existe`);
  if (f && f.ajuste)
    ok(["auto", "cover", "contain"].includes(f.ajuste),
       `FONDOS."${alias}": ajuste "${f.ajuste}" invalido (auto / cover / contain)`);
}
for (const [alias, ruta] of Object.entries(MUSICA))
  ok(existe(ruta), `MUSICA."${alias}" apunta a ${ruta}, que no existe`);
for (const [clave, per] of Object.entries(PERSONAJES)) {
  if (per.chibi)
    ok(existe(per.chibi), `${clave}: el chibi ${per.chibi} no existe`);
  if (per.chibiSalto)
    ok(existe(per.chibiSalto), `${clave}: el chibi saltando ${per.chibiSalto} no existe`);
  if (per.chibiSalto && !per.chibi)
    ok(false, `${clave}: tiene chibiSalto pero le falta chibi (la pose quieta)`);
}
for (const [clave, per] of Object.entries(PERSONAJES))
  (per.poses || []).forEach((pose) =>
    ok(existe(per.carpeta + pose + ".png"),
       `${clave}: la pose "${pose}" está declarada pero falta ${per.carpeta}${pose}.png`));

/* --- 3) Escenas a las que nunca se llega --- */
const alcanzadas = new Set(["inicio"]);
for (let cambio = true; cambio; ) {
  cambio = false;
  for (const n of [...alcanzadas])
    for (const p of HISTORIA[n] || []) {
      const destinos = [...(p.ir ? [p.ir] : []), ...(p.opciones || []).map((o) => o.ir)];
      for (const d of destinos)
        if (HISTORIA[d] && !alcanzadas.has(d)) { alcanzadas.add(d); cambio = true; }
    }
}
escenas.filter((e) => !alcanzadas.has(e)).forEach((e) =>
  console.log(`  !  la escena "${e}" existe pero no se llega a ella desde "inicio"`));

/* --- Resumen --- */
const pasos = Object.values(HISTORIA).flat().length;
const lineas = Object.values(HISTORIA).flat().filter((p) => "texto" in p).length;
console.log(errores
  ? `\n${errores} problema(s) para corregir.`
  : `\nTodo correcto: ${escenas.length} escenas, ${pasos} pasos, ${lineas} líneas de texto.`);

process.exit(errores ? 1 : 0);
