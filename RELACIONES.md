# Afinidad con los personajes

Cuánto se acercó el jugador a cada uno. Es un número por personaje que sube y
baja con lo que va eligiendo, y que después el guion consulta para cambiar cómo
le hablan.

El jugador **nunca ve el número**. Se tiene que dar cuenta por cómo lo tratan.
Nada de barritas ni de "+1 Álvaro" en pantalla.

Va de **-3 a 10**. El piso es negativo pero cortito a propósito: se puede caer
mal, pero no cavar un pozo del que ya no se sale.

---

## Los dos pasos

### Mover la afinidad

```js
{ afinidad: { alvaro: 1 } },                 // le sumás uno a Álvaro
{ afinidad: { alvaro: 2, pato: -1 } },       // a uno le sumás, al otro le restás
```

Se combina con cualquier otro paso, así que lo normal es colgarlo de una opción:

```js
{
  opciones: [
    { texto: "Seguirle el chiste",  ir: "chiste_si" },
    { texto: "Mirarlo sin reírte",  ir: "chiste_no" },
  ]
},
...
chiste_si: [
  { afinidad: { alvaro: 1 } },
  { quien: "alvaro", texto: "¡Ese! Sabía que me ibas a entender." },
  { ir: "sigue" },
],
```

### Consultar la afinidad

```js
{ siAfinidad: "alvaro", min: 3, texto: "Álvaro me hizo lugar sin que se lo pidiera." },
{ siAfinidad: "pato",   max: 0, texto: "Pato ni levantó la vista." },
{ siAfinidad: "aiko",   min: 6, ir: "escena_especial" },
```

`min` es "de tanto para arriba", `max` es "de tanto para abajo". Se pueden usar
los dos juntos para un tramo: `{ siAfinidad: "pato", min: 1, max: 4 }`.

Funciona en **cualquier** paso, igual que `si` y `sino`: texto, `ir`, sprites,
fondo, música.

Se puede combinar con banderas en el mismo paso — tienen que cumplirse las dos:

```js
{ si: "hablaste", siAfinidad: "aiko", min: 4, texto: "..." },
```

Todo se guarda con la partida.

---

## Umbrales sugeridos

Sirven de referencia; ajustalos a medida que escribas.

| Valor | Qué significa |
|---|---|
| -3 a -1 | Le caés mal. Te contesta corto o directamente no te habla. |
| 0 | Neutro. Es como estás con todos al empezar. |
| 1 a 2 | Te registra. Te saluda, te incluye si estás ahí. |
| 3 a 5 | Te busca. Te hace lugar sin que lo pidas. |
| 6 a 8 | Confía. Te cuenta cosas que no cuenta. |
| 9 a 10 | Ruta abierta. Escenas que solo existen acá. |

---

## Qué le gusta y qué le molesta a cada uno

De `guia-relaciones.txt`, pasado a valores. Los números son un punto de partida
razonable: lo fuerte vale 2, lo normal 1.

### Álvaro
| Acción | Cambio |
|---|---|
| Seguirle un chiste | `{ alvaro: 1 }` |
| Prenderte en un plan | `{ alvaro: 1 }` |
| Bancarlo cuando dice algo de más, aunque esté equivocado | `{ alvaro: 2 }` |
| Dejarlo hablando solo | `{ alvaro: -1 }` |
| Cortarle un chiste a la mitad | `{ alvaro: -1 }` |
| Tratarlo de pesado | `{ alvaro: -2 }` |

### Iara
| Acción | Cambio |
|---|---|
| Compartir sus aficiones (manga, anime, k-pop) | `{ iara: 2 }` |
| Tomarte bien sus chistes, incluso los negros | `{ iara: 1 }` |
| Un gesto de caballerosidad | `{ iara: 1 }` |
| Mentirle | `{ iara: -2 }` |
| Ofrecerle dulces o chocolate | `{ iara: -1 }` |

> Es diabética. Si le ofrecés algo dulce sin saberlo, no debería castigar tanto
> como mentirle: es torpeza, no traición. Y una vez que el jugador se entera,
> ofrecerle igual sí es una falta de respeto y puede pesar más.

### Pato
| Acción | Cambio |
|---|---|
| Seguirle un chiste / entenderle el sarcasmo | `{ pato: 1 }` |
| Respetarle un punto de vista con el que no coincidís | `{ pato: 2 }` |
| Elogiarle una fotografía | `{ pato: 2 }` |
| Meterte en su espacio **con afinidad baja** | `{ pato: -2 }` |
| Meterte en su espacio **con afinidad alta** | `{ pato: 1 }` |
| Mentirle | `{ pato: -2 }` |
| No entenderle un chiste | `{ pato: -1 }` |
| Proponerle un plan con alcohol | `{ pato: -1 }` |

> Ojo con el par del medio: **la misma acción vale distinto según la relación**.
> Eso se escribe con dos pasos condicionados:
> ```js
> { siAfinidad: "pato", max: 2, afinidad: { pato: -2 } },
> { siAfinidad: "pato", min: 3, afinidad: { pato: 1 } },
> ```

### Mauri
| Acción | Cambio |
|---|---|
| Compartir sus aficiones (manga, anime) | `{ mauri: 2 }` |
| Ser paciente cuando se traba | `{ mauri: 2 }` |
| Acercarte vos primero | `{ mauri: 1 }` |
| Mentirle | `{ mauri: -2 }` |
| Presionarlo cuando dijo que no | `{ mauri: -2 }` |
| Proponerle un plan con alcohol | `{ mauri: -1 }` |

> Es el único que **no se acerca solo**. Si el jugador nunca lo busca, se queda
> en cero para siempre — y eso está bien, es el personaje.

### Aiko
| Acción | Cambio |
|---|---|
| Ser honesto, incluso cuando queda feo | `{ aiko: 2 }` |
| Aceptarle un plan | `{ aiko: 2 }` |
| Buscarla vos, sin que ella arranque | `{ aiko: 2 }` |
| Convidarle algo dulce | `{ aiko: 1 }` |
| Mentirle | `{ aiko: -2 }` |
| Rechazarle un plan | `{ aiko: -1 }` |
| Presionarla cuando dijo que no | `{ aiko: -2 }` |

### Franco y Lucas
**No tienen afinidad, a propósito.** Franco ayuda decidas lo que decidas; Lucas
es inmutable. Nunca les pongas `{ afinidad: ... }`: que sean los dos fijos hace
que los otros cuatro se sientan más vivos por contraste.

---

## Tres cosas que salieron de tu lista

### La honestidad es un eje, no un gusto suelto

A **Iara, Pato, Mauri y Aiko** les molesta lo mismo: que les mientas. O sea que
una sola mentira puede costarte con cuatro personajes a la vez. Cuando el
jugador miente delante de varios, movelos a todos juntos:

```js
{ afinidad: { iara: -2, pato: -2, mauri: -2, aiko: -2 } },
```

Es la decisión más cara del juego, y conviene que se note.

### Los dulces son una trampa hermosa

A **Aiko le gustan** las cosas dulces. **Iara es diabética.** Si las dos están
en la misma escena y hay algo dulce de por medio, el jugador no puede quedar
bien con las dos:

```js
{
  opciones: [
    { texto: "Convidarle a Aiko",       ir: "dulce_aiko" },   // { aiko: 1, iara: -1 }
    { texto: "Guardarlo para después",  ir: "dulce_nadie" },  // no mueve nada
  ]
},
```

Es el mejor material que tenés para una escena de las dos juntas.

### Hay gustos compartidos

**Manga y anime** los comparten Iara y Mauri: una sola charla puede sumarle a
los dos. **El alcohol** les molesta a Pato y a Mauri: un plan de joda te resta
con ambos. Aprovechalos para que una decisión pese en varios lados sin que
tengas que escribir escenas separadas.

---

## Revisar que esté bien

```
node herramientas/revisar_guion.js
```

Avisa si le movés la afinidad a alguien que no está en `PERSONAJES`, si el
cambio no es un número, si escribís `siAfinidad` sin `min` ni `max` (no
filtraría nada), o si consultás la afinidad de alguien a quien nunca se la
movés.

```
node herramientas/probar_juego.js
```

Al terminar cada rama te muestra con cuánta afinidad quedó cada personaje, así
ves si los números que pusiste dan lo que esperabas.
