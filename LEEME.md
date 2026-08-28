# Once Minutos

Novela visual en HTML + CSS + JavaScript. Funciona en celular, tablet y PC,
sin instalar nada.

**Acto 1 — El camino de la mañana.** El jugador escribe su nombre al empezar y
la historia se narra en primera persona, con monólogo interno y diálogo
rioplatense. El recorrido es:

`amanecer → subte → entrada → patio → aula → computación`

En el andén del subte se cruza con Aiko y decide **hablarle** o **seguir de
largo**. Esa decisión queda anotada y cambia el texto en las cuatro escenas
siguientes. En el aula Aiko lo presenta al grupo del fondo (Álvaro, Pato,
Mauri, Lucas y Franco) y el acto cierra en la sala de computación, cuando ella
le pregunta si puede ir a su casa a terminar el trabajo.

La música acompaña: tema principal en el menú, la pista de la mañana al
empezar a jugar, y la tercera a partir del aula.

## Cómo jugarla

Doble clic en `index.html`. Listo.

Si querés probarla en el celular (estando en la misma red WiFi), levantá un
servidor local desde esta carpeta:

```
python -m http.server 8000
```

Y en el celular entrá a `http://LA-IP-DE-TU-PC:8000`
(la IP la ves con `ipconfig`).

> El servidor local también evita que el navegador bloquee la música por
> políticas de archivos locales, así que es la forma recomendada de probar.

## Estructura

```
index.html                    la página (casi no hay que tocarla)
css/estilo.css                todo el diseño responsive
js/motor.js                   el motor del juego (no hace falta tocarlo)
js/historia.js                >>> ACÁ ESCRIBÍS TU NOVELA <<<

assets/img/                   fondos
assets/img/personajes/aiko/   sprites ya armados y listos para usar
assets/img/personajes/Idle|Thinking|Angry/   las capas originales
assets/audio/                 música

herramientas/armar_sprites.py    arma los sprites desde las capas
herramientas/revisar_guion.js    revisa que el guion no tenga errores
herramientas/probar_juego.js     juega la historia entera sin abrir el navegador
```

## Cómo escribir la historia

> **Para escribir el guion, la guía completa está en [GUION.md](GUION.md):**
> decisiones, caminos que se separan y se juntan, banderas, cambios de
> escenario y de sprites, personajes nuevos y errores comunes.
> Lo que sigue acá es el resumen.

Todo pasa en `js/historia.js`. Una escena es una lista de pasos:

```js
mi_escena: [
  { fondo: "aula", musica: "tema" },
  { texto: "Empezaba a llover." },
  { aiko: "pensando-avergonzada" },
  { quien: "aiko", texto: "¿Trajiste paraguas, {nombre}?" },
  { quien: "yo",   texto: "No." },
  {
    opciones: [
      { texto: "Compartir el paraguas", ir: "escena_paraguas" },
      { texto: "Correr bajo la lluvia",  ir: "escena_lluvia" },
    ]
  },
],
```

### Las tres voces

| Cómo se escribe | Quién habla |
|---|---|
| `{ texto: "..." }` | Monólogo interno del protagonista. Sin nombre en la caja. |
| `{ quien: "yo", texto: "..." }` | El protagonista en voz alta. Muestra el nombre que eligió el jugador. |
| `{ quien: "aiko", texto: "..." }` | Aiko. |

En cualquier texto (también en las opciones) podés escribir `{nombre}` y el
motor lo reemplaza por el nombre que escribió el jugador. Si lo deja vacío,
se usa `Kaito`.

### Pasos disponibles

| Paso | Qué hace |
|---|---|
| `{ fondo: "aula" }` | Cambia el fondo (crossfade automático) |
| `{ musica: "tema" }` | Cambia la música. `null` la apaga |
| `{ texto: "..." }` | Monólogo interno |
| `{ quien: "aiko", texto: "..." }` | Diálogo de un personaje |
| `{ aiko: "normal-feliz" }` | Muestra a Aiko con esa expresión |
| `{ aiko: "normal-feliz", donde: "izquierda" }` | Posición: `izquierda`, `centro` o `derecha` |
| `{ aiko: null }` | La saca de pantalla |
| `{ esperar: 800 }` | Pausa en milisegundos |
| `{ opciones: [...] }` | Una decisión |
| `{ ir: "otra_escena" }` | Salta a otra escena |
| `{ fin: true }` | Termina la partida |

### Recordar decisiones

El motor puede anotar lo que hizo el jugador y usarlo más adelante:

| Paso | Qué hace |
|---|---|
| `{ recordar: "hablaste" }` | Deja anotada una bandera |
| `{ si: "hablaste", texto: "..." }` | El paso solo ocurre si la bandera está puesta |
| `{ sino: "hablaste", texto: "..." }` | El paso solo ocurre si NO está puesta |

`si` y `sino` funcionan en cualquier paso, no solo en los de texto:
`{ si: "hablaste", ir: "otra_escena" }` o `{ sino: "hablaste", aiko: null }`.
Las banderas se guardan con la partida.

Los pasos se combinan en una sola línea:
`{ fondo: "patio", aiko: "normal-feliz", quien: "aiko", texto: "¡Mirá!" }`.

Si hay dos personajes en pantalla, el motor oscurece automáticamente al que no
está hablando.

### Sprites de Aiko

Ya están armados y listos en `assets/img/personajes/aiko/`:

| Nombre | Pose y expresión |
|---|---|
| `normal-feliz` | de pie, sonriendo |
| `normal-triste` | de pie, triste |
| `normal-enojada` | de pie, enojada |
| `pensando-feliz` | dedo en la mejilla, contenta |
| `pensando-avergonzada` | dedo en la mejilla, avergonzada |
| `enojo-seria` | postura tensa, boca cerrada |

Todos con el uniforme escolar completo.

### Agregar otra ropa u otro personaje

Los sprites originales vienen en capas sueltas (`Body` + `Clothes` + `Faces`)
en PNG de 2160x3840. Cargar eso en el navegador es carísimo, sobre todo en
celular, así que `herramientas/armar_sprites.py` las combina en una sola imagen
recortada y reducida a 1400px de alto.

Para agregar, por ejemplo, el vestido casual: abrí el script, sumá la
combinación de capas al diccionario `ATUENDOS` y corré:

```
python herramientas/armar_sprites.py
```

Después basta con declarar las poses nuevas en `PERSONAJES.aiko.poses`, dentro
de `historia.js`, y ya las podés usar.

Para un personaje nuevo, agregalo a `PERSONAJES` con su propia `carpeta` y su
lista de `poses`. El motor lo maneja solo.

### Cómo se encuadran los fondos

Las fotos no tienen todas la misma forma que la pantalla, así que el motor
decide solo: llena la pantalla si el recorte es razonable, y si tuviera que
recortar más de la mitad muestra la foto entera y rellena los costados con una
copia desenfocada de la misma foto (nada de barras negras).

Si querés mandarlo a mano, en vez de la ruta suelta poné un objeto:

```js
const FONDOS = {
  aula:     "assets/img/aula.jpeg",                                  // automático
  amanecer: { src: "assets/img/amanecer.jpeg", ajuste: "cover" },     // siempre llena
  afiche:   { src: "assets/img/afiche.jpg",    ajuste: "contain" },   // siempre entera
  calle:    { src: "assets/img/calle.jpg",     posicion: "top center" },
};
```

`ajuste` puede ser `auto` (por defecto), `cover` o `contain`. `posicion` es la
parte de la foto que se prioriza al recortar (`top center`, `bottom left`, etc).

El encuadre se recalcula al rotar el celular o cambiar el tamaño de la ventana.

### Los chibis de la portada

El menú principal muestra abajo una tira con el elenco. Al pasarles el mouse o
tocarlos, cambian a la pose de salto y pegan el brinco.

Se arma sola desde `PERSONAJES`, en `js/historia.js`:

```js
  mauri: {
    chibi:      "assets/img/personajes/chibis/mauri.png",           // pose quieta
    chibiSalto: "assets/img/personajes/chibis/mauri-saltando.png",  // pose de salto
  },
```

Aparece en la tira todo el que tenga `chibi`. Si además tiene `chibiSalto`,
salta; si no, se queda quieto. Las dos imágenes se precargan, así que el cambio
es instantáneo.

En pantallas muy angostas (menos de 380px) la tira se oculta, para no tapar los
botones del menú.

### Menú dentro de la partida

El botón **Menú** de la barra de arriba abre, sin salir de la partida, las
mismas opciones que el menú principal: guardar, cargar, personajes, opciones,
acerca de, y volver al menú principal.

- Abrirlo frena el modo AUTO y el salteo, para que no siga avanzando de fondo.
- **Esc** lo abre y lo cierra. Tocar afuera de la solapa también lo cierra.
- "Menú principal" pide un segundo toque, porque se pierde lo no guardado.

### Puntos de guardado

El jugador tiene **6 ranuras** más un **autoguardado** que se actualiza en cada
línea de diálogo.

- **Guardar** (barra de arriba) abre las ranuras para elegir dónde guardar.
- **Cargar** (barra de arriba) y **Continuar** (menú) abren las ranuras para elegir
  cuál seguir. Ahí también aparece el autoguardado, que no se puede pisar a mano.
- Cada ranura muestra una miniatura del escenario, el nombre del jugador, en qué
  escena quedó, la fecha y la última línea que leyó.
- Pisar o borrar una partida pide un segundo toque, para no perderla sin querer.
- La `×` de cada ranura la borra. "Borrar la partida guardada", en Opciones, las
  borra todas.

Para cambiar cuántas ranuras hay, tocá `RANURAS` arriba de `js/motor.js`.

### Fichas del panel "Personajes"

En el menú hay un panel que arma las fichas solo, a partir de `PERSONAJES`.
Un personaje aparece ahí si le ponés `perfil`. Si además le ponés
`oculto: true`, su ficha queda tapada con un `???` hasta que habla por primera
vez en la historia.

La foto de la ficha sale, en este orden:

1. `chibi`, si lo tiene: `chibi: "assets/img/personajes/chibis/mauri.png"`.
   Se muestra entero, sin recortar. Sirve incluso para personajes que todavía
   no tienen sprites de cuerpo entero.
2. Si no, el sprite que diga `retrato` (o la primera pose), recortado de arriba.
3. Si no tiene ninguno, un recuadro con la inicial.

### Revisar el guion antes de jugarlo

```
node herramientas/revisar_guion.js
```

Avisa si algún `ir:` apunta a una escena que no existe, si usás un fondo,
música, personaje o sprite que no está definido, si consultás una bandera que
nunca se anota, o si escribiste una escena a la que nunca se llega.

### Jugarlo entero sin abrir el navegador

```
node herramientas/probar_juego.js
```

Recorre todas las ramas simulando un navegador y avisa si algo se colgó, si
quedó un `{nombre}` sin reemplazar, si la música no cambia donde corresponde o
si el guardado perdió algo. Conviene correrlo después de tocar el motor.

## Lo que ya trae

- Diseño responsive real (celular vertical, celular horizontal, tablet, monitor)
- Menú con panel de personajes (se desbloquean jugando), opciones y "acerca de"
- Opciones: volumen y velocidad del texto, guardadas en el navegador
- Pantalla de nombre al empezar, con el nombre usado en toda la historia
- Decisiones que se recuerdan y cambian el texto de las escenas siguientes
- Efecto máquina de escribir; un toque completa la línea, otro avanza
- Modo AUTO y modo saltar (`>>`)
- **6 ranuras de guardado** más autoguardado, con miniatura del escenario,
  fecha y la última línea de cada partida
- Crossfade entre fondos, sprites posicionables y precarga de todas las imágenes
- Música con botón de silencio
- Botón de pantalla completa
- Respeta el notch y la barra de gestos del celular
- Teclado en PC: `Espacio` / `Enter` / `→` avanzan, `Esc` sale de pantalla completa

## Próximos pasos sugeridos

1. Escribir el Acto 2 en `historia.js`. Empieza con la respuesta del
   protagonista a la pregunta de Aiko, y la bandera `hablaste` sigue
   disponible para diferenciar las dos ramas.
2. Hace falta un fondo nuevo: la casa del protagonista.
3. El grupo del fondo (Álvaro, Pato, Mauri, Lucas, Franco) todavía no tiene
   sprites. Funcionan bien solo con voz, pero si conseguís sprites basta con
   agregarles `carpeta` y `poses` en `PERSONAJES`.
4. Cuando quieras publicarla: subí la carpeta entera a itch.io (como "HTML"),
   a GitHub Pages o a Netlify. No hace falta compilar nada.

> Nota: la música incluida es del OST de Doki Doki Literature Club. Sirve
> perfecto para probar, pero si vas a publicar la novela conviene reemplazarla
> por música propia o libre de derechos.
