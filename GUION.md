# Cómo escribir el guion

Todo se escribe en [`js/historia.js`](js/historia.js). No hace falta tocar
ningún otro archivo.

Antes de nada, la regla de oro:

```
node herramientas/revisar_guion.js
```

Corré eso cada tanto mientras escribís. Te avisa si escribiste mal el nombre de
un fondo, si mandaste a una escena que no existe, si pediste un sprite que no
está, o si dejaste una escena a la que nunca se llega. Es mucho más rápido que
descubrirlo abriendo el juego.

---

## 1. La estructura

La historia es un objeto con **escenas**. Cada escena es una lista de **pasos**
que se ejecutan en orden, de arriba hacia abajo.

```js
const HISTORIA = {

  mi_escena: [
    { fondo: "aula" },
    { texto: "Empezaba a llover." },
    { quien: "aiko", texto: "¿Trajiste paraguas?" },
    { ir: "otra_escena" },
  ],

  otra_escena: [
    ...
  ],

};
```

El juego siempre arranca en la escena que se llama **`inicio`**.

Los nombres de escena los inventás vos. Usá minúsculas y guión bajo
(`patio_lluvia`, `casa_noche`) — es solo una convención, pero te va a ordenar.

---

## 2. Los pasos

### Texto

| Cómo se escribe | Quién habla |
|---|---|
| `{ texto: "..." }` | Monólogo interno. Sin nombre en la caja. |
| `{ quien: "yo", texto: "..." }` | El protagonista en voz alta. |
| `{ quien: "aiko", texto: "..." }` | Cualquier personaje, por su clave. |

En cualquier texto podés poner `{nombre}` y el motor lo cambia por el nombre
que escribió el jugador:

```js
{ quien: "aiko", texto: "Che, {nombre}, ¿vos entendiste algo?" },
```

Para un salto de línea dentro del mismo diálogo, usá `\n`:

```js
{ texto: "FIN DEL ACTO 2\n\nContinúa en el Acto 3." },
```

### Escenario

| Paso | Qué hace |
|---|---|
| `{ fondo: "aula" }` | Cambia el fondo, con transición suave |
| `{ musica: "alegre" }` | Cambia la música |
| `{ musica: null }` | Corta la música |
| `{ esperar: 800 }` | Pausa, con la caja de texto oculta |

### Movimiento

| Paso | Qué hace |
|---|---|
| `{ ir: "otra_escena" }` | Salta a otra escena |
| `{ fin: true }` | Termina la partida |

---

## 3. Cambiar de escenario

Un `{ fondo: ... }` suelto no espera clic: cambia y sigue al paso siguiente.
Por eso lo normal es ponerlo justo antes del texto que ocurre ahí:

```js
{ texto: "Salí de casa." },
{ fondo: "camino-al-subte" },
{ texto: "Once minutos hasta la estación." },
```

También se puede combinar en un solo paso, si preferís:

```js
{ fondo: "camino-al-subte", texto: "Once minutos hasta la estación." },
```

Las dos formas hacen lo mismo. La primera se lee mejor cuando el cambio de
fondo es un momento en sí; la segunda cuando es solo el decorado de esa línea.

### Agregar un fondo nuevo

Poné la imagen en `assets/img/` y agregala arriba del todo, en `FONDOS`:

```js
const FONDOS = {
  aula:  "assets/img/aula.jpeg",
  plaza: "assets/img/plaza.jpg",     // <- nuevo
};
```

Si el nombre tiene guiones, va entre comillas, y también al usarlo:

```js
"casa-noche": "assets/img/casa-noche.jpg",
```
```js
{ fondo: "casa-noche" },
```

El motor decide solo cómo encuadrar cada foto. Si alguna te queda mal, mirá la
sección "Cómo se encuadran los fondos" del [LEEME.md](LEEME.md).

---

## 4. Mostrar y cambiar sprites

Cada personaje con sprites se maneja **por su clave**, como si fuera un
interruptor:

```js
{ aiko: "normal-feliz" },     // aparece (o cambia de expresión)
{ aiko: null },               // desaparece
```

### Dónde aparece

```js
{ aiko: "normal-feliz", donde: "izquierda" },   // izquierda / centro / derecha
```

La posición **se recuerda**: si después cambiás solo la expresión, se queda
donde estaba.

```js
{ aiko: "normal-feliz", donde: "derecha" },
{ quien: "aiko", texto: "Hola." },
{ aiko: "normal-triste" },                      // sigue a la derecha
{ quien: "aiko", texto: "...ah." },
```

### Cambiar varios a la vez

Un mismo paso puede sacar a uno y poner a otro. Es lo que conviene cuando
cambia el que habla:

```js
{ alvaro: null, pato: "normal", donde: "derecha" },
{ quien: "pato", texto: "Que onda." },
```

### Cuántos a la vez

**Dos, como mucho.** Hay tres posiciones, pero en un celular vertical tres
figuras se pisan entre sí. La receta que uso en el Acto 1:

- El que está en la conversación todo el tiempo va a `izquierda`.
- El que habla en ese momento va a `derecha`.
- Si dos personajes hablan **entre ellos**, sacá al tercero y usá
  `centro` + `derecha`.

Cuando hay dos en pantalla, el motor **oscurece solo** al que no está hablando.
No tenés que hacer nada.

### Expresiones disponibles

| Personaje | Poses |
|---|---|
| `aiko` | `normal-feliz`, `normal-triste`, `normal-enojada`, `pensando-feliz`, `pensando-avergonzada`, `enojo-seria` |
| `alvaro`, `pato`, `mauri`, `lucas`, `franco` | `normal`, `pensando`, `enojado`, `triste`, `orgulloso` |
| `iara` | `normal`, `pensando`, `enojada`, `triste`, `orgullosa` |

### Combinar todo en un paso

```js
{ fondo: "patio", aiko: "normal-feliz", donde: "izquierda",
  quien: "aiko", texto: "¡Mirá lo que te traje!" },
```

---

## 5. Decisiones

### Una decisión común

```js
{
  opciones: [
    { texto: "Acompañarla",  ir: "escena_a" },
    { texto: "Ir al aula",   ir: "escena_b" },
  ]
},
```

Cada opción es un botón. `texto` es lo que lee el jugador, `ir` es la escena a
la que salta.

Poné la decisión **al final de la escena**: todo lo que escribas después nunca
se va a ejecutar, porque el jugador ya saltó a otro lado.

### Con más de dos opciones

Igual, agregando entradas a la lista. No hay límite:

```js
{
  opciones: [
    { texto: "Contarle la verdad",     ir: "verdad" },
    { texto: "Mentirle",               ir: "mentira" },
    { texto: "Cambiar de tema",        ir: "esquivar" },
    { texto: "Quedarte callado",       ir: "silencio" },
  ]
},
```

Los botones se apilan verticalmente y entran solos en cualquier pantalla. Con
más de cuatro empieza a quedar apretado en celular; si necesitás muchas,
conviene partir la decisión en dos preguntas encadenadas.

En el texto de las opciones también funciona `{nombre}`.

---

## 6. Caminos que se separan y se vuelven a juntar

Este es el patrón más útil de todos: dos ramas distintas que terminan en la
misma escena.

```js
  cruce: [
    { texto: "Faltaban veinte pasos para decidir." },
    {
      opciones: [
        { texto: "Hablarle",        ir: "rama_hablar" },
        { texto: "Seguir de largo", ir: "rama_ignorar" },
      ]
    },
  ],

  rama_hablar: [
    { recordar: "hablaste" },        // <- dejamos anotado lo que hizo
    { quien: "yo", texto: "Eh... buenas." },
    { ir: "colegio" },               // <- las dos van al mismo lado
  ],

  rama_ignorar: [
    { texto: "No dije nada." },
    { ir: "colegio" },
  ],

  colegio: [
    { fondo: "entrada" },
    ...
  ],
```

Así no tenés que escribir dos veces todo lo que viene después.

---

## 7. Recordar lo que eligió el jugador

Para que la decisión siga pesando más adelante, usá **banderas**.

| Paso | Qué hace |
|---|---|
| `{ recordar: "hablaste" }` | Deja anotada la bandera |
| `{ si: "hablaste", ... }` | El paso solo pasa si está anotada |
| `{ sino: "hablaste", ... }` | El paso solo pasa si NO está anotada |

El nombre de la bandera lo inventás vos. Ejemplo:

```js
  colegio: [
    { fondo: "entrada" },
    { texto: "Llegamos justo con el timbre." },

    { si: "hablaste",  texto: "Veníamos hablando de nada. Estuvo bien." },
    { sino: "hablaste", texto: "Llegué solo, como siempre." },
  ],
```

`si` y `sino` funcionan en **cualquier** paso, no solo en los de texto:

```js
{ si: "hablaste", aiko: "normal-feliz", donde: "derecha" },
{ si: "hablaste", ir: "final_bueno" },
{ sino: "hablaste", musica: null },
```

Las banderas se guardan con la partida, así que sobreviven a un
Guardar / Cargar.

> El validador te avisa si consultás una bandera que nunca anotaste en ningún
> lado — o sea, si te equivocaste escribiendo el nombre.

### Un truco: contar cosas

Como las banderas son sí/no, para llevar la cuenta de algo usá varias:

```js
{ recordar: "abriste_1" },      // primera vez que se abre
...
{ recordar: "abriste_2" },      // segunda
...
{ si: "abriste_2", texto: "Era la segunda vez que le contaba algo así." },
```

---

## 8. Personajes nuevos

Agregalo arriba de todo, en `PERSONAJES`:

```js
  profe: {
    nombre: "Profesor",
    color: "#c9b6ff",
  },
```

Con eso ya podés escribir `{ quien: "profe", texto: "..." }`. **No necesita
sprites**: funciona igual, solo que no aparece en pantalla.

Si tiene sprites:

```js
  profe: {
    nombre: "Profesor",
    color: "#c9b6ff",
    carpeta: "assets/img/personajes/profe/",
    poses: ["normal", "enojado"],
    retrato: "normal",
    chibi: "assets/img/personajes/chibis/profe.png",   // opcional
    perfil: "Da historia. Nunca se acuerda de tu nombre.",
    oculto: true,     // su ficha queda tapada hasta que habla
  },
```

`perfil` es lo que se ve en el panel **Personajes** del menú. Si no le ponés
`perfil`, no aparece ahí.

---

## 9. Errores comunes

**La escena no existe.** `{ ir: "aula_2" }` cuando la escena se llama `aula2`.
El validador te lo dice con nombre y apellido.

**Falta una coma.** Cada paso termina en `},`. Si te olvidás una, el juego no
carga y la pantalla queda negra. `node --check js/historia.js` te dice en qué
línea.

**Escribir después de una decisión.** Los pasos que van abajo de un
`{ opciones: ... }` nunca se ejecutan.

**Poner un sprite y no sacarlo nunca.** Si cambiás de escena y el personaje no
tendría que estar, sacalo: `{ aiko: null }`. Si no, se queda pegado en el
fondo nuevo.

**El nombre del fondo con guiones sin comillas.** `camino-al-subte` sin
comillas es un error de sintaxis. Va `"camino-al-subte"`.

---

## 10. Probar sin abrir el navegador

```
node herramientas/revisar_guion.js     # revisa que todo exista y cierre
node herramientas/probar_juego.js      # juega todas las ramas de punta a punta
```

El segundo recorre la historia entera simulando un navegador y te dice si algo
se colgó, si quedó un `{nombre}` sin reemplazar, o si una rama nunca llega al
final. Te muestra además el recorrido de fondos y los sprites que usó cada
rama, así ves de un vistazo si te olvidaste de mostrar a alguien.
