# Nombres del elenco

`elenco.png` viene con los nombres que puso la IA, que **no** son los del juego.
Esta es la equivalencia. Guiarse por esta tabla, no por la imagen.

| En `elenco.png` | Nombre real | Cómo se lo reconoce | Clave en `historia.js` |
|---|---|---|---|
| Diego  | **Álvaro** | buzo negro con el logo naranja del lobo | `alvaro` |
| Mateo  | **Lucas**  | buzo blanco con capucha puesta | `lucas` |
| Lucas  | **Pato**   | campera negra y roja | `pato` |
| Bruno  | **Mauri**  | campera azul del instituto | `mauri` |
| Pablo  | **Franco** | buzo negro liso | `franco` |
| Sofía  | **Iara**   | anteojos, pelo largo, campera del instituto | `iara` |

Iara ya está en `PERSONAJES` con sus sprites, pero todavía no habla en el
guion, así que su ficha del menú queda tapada. Escribile el `perfil` cuando la
sumes al Acto 2.

## Chibis

`assets/img/personajes/chibbi/elenco.png` ya está separado en
`assets/img/personajes/chibis/`, un PNG transparente por personaje, con estos
mismos nombres: `alvaro`, `lucas`, `pato`, `mauri`, `franco`, `iara`.

Son chiquitos (unos 80x186 px) porque la tira original mide 571x200. Sirven
bien para cosas de tamaño chico —retratos del menú, íconos, marcadores—, no
para mostrarlos en escena como sprites.

## Estado de los sprites

- **Franco**: listo, en `assets/img/personajes/franco/`
  (`normal`, `pensando`, `enojado`, `triste`, `orgulloso`).
- **Iara**: lista, en `assets/img/personajes/iara/`
  (`normal`, `pensando`, `enojada`, `triste`, `orgullosa`).
- **Álvaro**: listo, en `assets/img/personajes/alvaro/`
  (`normal`, `pensando`, `enojado`, `triste`, `orgulloso`).
- **Mauri**: listo, en `assets/img/personajes/mauri/`
  (`normal`, `pensando`, `enojado`, `triste`, `orgulloso`).
- **Faltan Lucas y Pato.** `elenco.png` es una hoja de referencia, no sirve para
  recortar: las caras son bustos chiquitos, no cuerpos enteros.

Para los que faltan hace falta una hoja por personaje, del mismo formato que la
de Franco: cuerpo entero, una pose por expresión, en fila. Después se recortan
con `python herramientas/recortar_hoja.py` (hay que sumar la hoja nueva a la
lista `HOJAS` del script).
