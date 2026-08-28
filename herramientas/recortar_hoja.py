#!/usr/bin/env python3
"""
recortar_hoja.py — parte una hoja de expresiones en sprites sueltos con fondo
transparente.

Los personajes generados con IA suelen venir como UNA sola imagen con varias
poses en fila y fondo liso. Este script las separa, les saca el fondo y las
deja listas para usar en historia.js.

Uso:
    python herramientas/recortar_hoja.py

Configurá las hojas en HOJAS, abajo.

Cómo saca el fondo
------------------
Lo fácil sería borrar todos los píxeles del color del fondo, pero no sirve
cuando el personaje está vestido de negro sobre fondo oscuro: el color de la
ropa y el del fondo se pisan, y quedan agujeros.

Así que en vez de mirar el color, mira la CONECTIVIDAD: solo borra el fondo que
llega desde el borde de la imagen. El truco es que el contorno del dibujo tiene
huecos de un par de píxeles por donde el fondo se filtra adentro. Para taparlos:

  1. engrosa el contorno (dilatación) hasta cerrar los huecos,
  2. rellena el fondo desde el borde,
  3. adelgaza de vuelta la silueta lo mismo que la engrosó,
  4. repite con varios grosores y une los resultados: lo que una pasada pierde
     por una fuga, otra lo recupera,
  5. tapa los huecos interiores que hayan quedado,
  6. se queda solo con la silueta más grande, para descartar restos del panel
     de al lado.

Si la hoja ya viene con fondo transparente, o con un fondo de color bien
distinto al personaje (verde o magenta), esto es innecesario: poné
    "fondo": None
y el script solo corta y recorta.
"""

from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter

try:
    import numpy as np
except ImportError:
    raise SystemExit("Falta numpy. Instalalo con:  python -m pip install numpy")

RAIZ = Path(__file__).resolve().parent.parent
PERSONAJES = RAIZ / "assets" / "img" / "personajes"

# --------------------------------------------------------------------------
# Hojas a procesar.
#   origen  : la imagen con todas las poses en fila
#   destino : carpeta donde van los sprites (uno por pose)
#   poses   : nombre de cada panel, de izquierda a derecha
#   titulo  : píxeles a recortar arriba (la franja con los títulos)
#   fondo   : color del fondo, o None si ya es transparente / bien contrastado
#   croma   : color del fondo cuando es plano y NO aparece en el personaje
#             (verde (0,255,0) o magenta). Es el mejor caso: recorte exacto,
#             bordes suaves y no se pierden globitos ni destellos.
#   detectar: True encuentra las figuras solas, en vez de cortar la hoja en
#             partes iguales. Sirve cuando estan pegadas o mal espaciadas.
#   pasadas : (opcional) reemplaza PASADAS. En hojas chicas conviene bajar los
#             grosores, si no se comen el detalle.
# --------------------------------------------------------------------------
HOJAS = [
    {
        "origen":  PERSONAJES / "personajes nuevos cap 2" / "Franco" / "expressions.png",
        "destino": PERSONAJES / "franco",
        "poses":   ["normal", "pensando", "enojado", "triste", "orgulloso"],
        "titulo":  78,
        "fondo":   (15, 15, 15),
    },
    {
        "origen":  PERSONAJES / "alvaro" / "alvaro.png",
        "destino": PERSONAJES / "alvaro",
        "poses":   ["normal", "pensando", "enojado", "triste", "orgulloso"],
        "titulo":  78,
        "fondo":   (15, 15, 15),
    },
    {
        # Estas dos vinieron con fondo verde: recorte exacto y sin perder nada.
        "origen":  PERSONAJES / "lucas" / "lucas.png",
        "destino": PERSONAJES / "lucas",
        "poses":   ["normal", "pensando", "enojado", "triste", "orgulloso"],
        "titulo":  78,
        "croma":   (0, 255, 0),
    },
    {
        "origen":  PERSONAJES / "pato" / "pato.png",
        "destino": PERSONAJES / "pato",
        "poses":   ["normal", "pensando", "enojado", "triste", "orgulloso"],
        "titulo":  78,
        "croma":   (0, 255, 0),
    },
    {
        "origen":  PERSONAJES / "mauri" / "mauri.png",
        "destino": PERSONAJES / "mauri",
        "poses":   ["normal", "pensando", "enojado", "triste", "orgulloso"],
        "titulo":  78,
        "fondo":   (15, 15, 15),
        # Con las pasadas de siempre se le escapaba parte del pantalon.
        "pasadas": [(8, 5), (10, 7), (12, 9), (14, 11)],
    },
    {
        "origen":  PERSONAJES / "iara" / "iara.png",
        "destino": PERSONAJES / "iara",
        "poses":   ["normal", "pensando", "enojada", "triste", "orgullosa"],
        "titulo":  78,
        "fondo":   (15, 15, 15),
        # Su campera y su pelo dejan huecos mas grandes que los de Franco: con
        # las pasadas de siempre se le escapaba una pierna en tres poses.
        "pasadas": [(8, 5), (10, 7), (12, 9), (14, 11)],
    },
    {
        "origen":  PERSONAJES / "chibis" / "franco-chibbi.png",
        "destino": PERSONAJES / "chibis",
        "poses":   ["franco", "franco-saltando"],
        "croma":   (0, 255, 0),
    },
    {
        "origen":  PERSONAJES / "chibis" / "lucas-chibi.png",
        "destino": PERSONAJES / "chibis",
        "poses":   ["lucas", "lucas-saltando"],
        "croma":   (0, 255, 0),
    },
    {
        "origen":  PERSONAJES / "chibis" / "pato-chibbi.png",
        "destino": PERSONAJES / "chibis",
        "poses":   ["pato", "pato-saltando"],
        "croma":   (0, 255, 0),
    },
    {
        # Los chibis nuevos vienen de a dos por archivo (parado y saltando),
        # sobre verde. Se separan igual que las hojas de expresiones.
        "origen":  PERSONAJES / "chibis" / "iara-chibbi.png",
        "destino": PERSONAJES / "chibis",
        "poses":   ["iara", "iara-saltando"],
        "croma":   (0, 255, 0),
    },
    {
        # Los chibis vienen los seis pegados en una tira chica (571x200), sin
        # separacion limpia entre uno y otro, asi que hay que detectarlos.
        # Al ser tan chica, los grosores grandes se le comerian el detalle.
        "origen":   PERSONAJES / "chibbi" / "elenco.png",
        "destino":  PERSONAJES / "chibis",
        "poses":    ["alvaro", "lucas", "pato", "mauri", "franco", "iara"],
        "titulo":   6,          # la linea del borde de arriba
        "fondo":    (21, 20, 18),
        "detectar": True,
        "pasadas":  [(10, 3), (12, 5), (16, 5)],
    },
]

# Pasadas de (tolerancia, grosor). Más grosor cierra huecos más grandes, pero
# redondea los detalles finos; por eso se combinan varias.
# Va de tolerancia alta con kernel chico (respeta el detalle) a tolerancia baja
# con kernel grande (cierra los huecos grandes). Mas de 11 de grosor no conviene:
# empieza a hacer de puente con la figura de al lado y se la trae.
PASADAS = [(10, 5), (12, 7), (12, 9), (14, 9), (14, 11)]


def quitar_croma(panel, color, umbral_bajo=40, umbral_alto=120):
    """Saca un fondo de color plano (verde o magenta) por color, no por
    conectividad. Es lo ideal cuando el fondo no aparece en el personaje:
    el recorte sale exacto, los bordes quedan suaves y no se pierden las
    cosas sueltas del dibujo (globitos, marcas de enojo, destellos).

    Devuelve la imagen RGBA ya sin fondo y sin el halo de color en los bordes.
    """
    a = np.asarray(panel).astype(np.int16)
    r, g, b = a[:, :, 0], a[:, :, 1], a[:, :, 2]

    # Cuanto "tira" cada pixel al color del fondo. Para un verde puro es
    # cuanto se pasa el verde por encima del rojo y el azul.
    canal = int(np.argmax(color))
    otros = [i for i in range(3) if i != canal]
    tira = a[:, :, canal] - np.maximum(a[:, :, otros[0]], a[:, :, otros[1]])

    # Borde suave: opaco por debajo del umbral bajo, transparente por encima
    # del alto, y un degrade en el medio (para el antialias del dibujo).
    alfa = np.clip((umbral_alto - tira) / (umbral_alto - umbral_bajo), 0, 1)

    # Quitar el halo: donde el color del fondo sobresale, se lo baja al nivel
    # de los otros canales. Si no, queda un contorno verde alrededor.
    limpio = a.copy()
    exceso = tira > 0
    limpio[:, :, canal] = np.where(
        exceso, np.maximum(a[:, :, otros[0]], a[:, :, otros[1]]), a[:, :, canal])

    rgba = np.dstack([limpio.astype(np.uint8), (alfa * 255).astype(np.uint8)])
    return Image.fromarray(rgba, "RGBA")


def limpiar_sueltos(sprite):
    """Saca los restos de la figura de al lado que entraron en el corte,
    pero conserva lo que es parte del dibujo.

    Los distingue por donde estan: los globitos, los destellos y las marcas
    de enojo van siempre arriba, a la altura de la cabeza. Lo que se cuela
    del vecino son pies y brazos, que caen de la mitad para abajo."""
    a = np.asarray(sprite)
    mascara = a[:, :, 3] > 8
    h, w = mascara.shape
    visto = np.zeros((h, w), bool)
    grupos = []
    for y0 in range(h):
        for x0 in range(w):
            if not mascara[y0, x0] or visto[y0, x0]:
                continue
            grupo, cola = [], deque([(y0, x0)])
            visto[y0, x0] = True
            while cola:
                y, x = cola.popleft()
                grupo.append((y, x))
                for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    ny, nx = y + dy, x + dx
                    if 0 <= ny < h and 0 <= nx < w and mascara[ny, nx] and not visto[ny, nx]:
                        visto[ny, nx] = True
                        cola.append((ny, nx))
            grupos.append(grupo)
    if not grupos:
        return sprite

    mayor = max(range(len(grupos)), key=lambda i: len(grupos[i]))
    limpia = np.zeros((h, w), bool)
    for i, grupo in enumerate(grupos):
        arriba_del_todo = max(y for y, _ in grupo) < h * 0.40
        if i == mayor or arriba_del_todo:
            yy, xx = zip(*grupo)
            limpia[list(yy), list(xx)] = True

    b = a.copy()
    b[:, :, 3] = np.where(limpia, a[:, :, 3], 0)
    return Image.fromarray(b, "RGBA")


def _rellenar_desde_borde(muro):
    """Marca todo lo alcanzable desde el borde sin cruzar 'muro'."""
    h, w = muro.shape
    fuera = np.zeros((h, w), bool)
    cola = deque()

    def sembrar(y, x):
        if not muro[y, x] and not fuera[y, x]:
            fuera[y, x] = True
            cola.append((y, x))

    for x in range(w):
        sembrar(0, x); sembrar(h - 1, x)
    for y in range(h):
        sembrar(y, 0); sembrar(y, w - 1)
    while cola:
        y, x = cola.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w:
                sembrar(ny, nx)
    return fuera


def _dilatar(mascara, grosor):
    m = Image.fromarray((mascara * 255).astype(np.uint8))
    return np.asarray(m.filter(ImageFilter.MaxFilter(grosor))) > 127


def _erosionar(mascara, grosor):
    m = Image.fromarray((mascara * 255).astype(np.uint8))
    return np.asarray(m.filter(ImageFilter.MinFilter(grosor))) > 127


def _mayor_silueta(mascara):
    """Se queda con la region conectada mas grande (descarta restos sueltos)."""
    h, w = mascara.shape
    visto = np.zeros((h, w), bool)
    mejor, mejor_tam = None, 0
    for y0 in range(h):
        for x0 in range(w):
            if not mascara[y0, x0] or visto[y0, x0]:
                continue
            grupo, cola = [], deque([(y0, x0)])
            visto[y0, x0] = True
            while cola:
                y, x = cola.popleft()
                grupo.append((y, x))
                for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    ny, nx = y + dy, x + dx
                    if 0 <= ny < h and 0 <= nx < w and mascara[ny, nx] and not visto[ny, nx]:
                        visto[ny, nx] = True
                        cola.append((ny, nx))
            if len(grupo) > mejor_tam:
                mejor, mejor_tam = grupo, len(grupo)
    limpia = np.zeros((h, w), bool)
    if mejor:
        ys, xs = zip(*mejor)
        limpia[list(ys), list(xs)] = True
    return limpia


def _componentes(mascara, alto_minimo):
    """Separa la mascara en figuras sueltas y las devuelve ordenadas de
    izquierda a derecha. Descarta las mas bajas que 'alto_minimo' (bordes,
    manchitas, restos)."""
    h, w = mascara.shape
    visto = np.zeros((h, w), bool)
    figuras = []
    for y0 in range(h):
        for x0 in range(w):
            if not mascara[y0, x0] or visto[y0, x0]:
                continue
            grupo, cola = [], deque([(y0, x0)])
            visto[y0, x0] = True
            while cola:
                y, x = cola.popleft()
                grupo.append((y, x))
                for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    ny, nx = y + dy, x + dx
                    if 0 <= ny < h and 0 <= nx < w and mascara[ny, nx] and not visto[ny, nx]:
                        visto[ny, nx] = True
                        cola.append((ny, nx))
            ys = [p[0] for p in grupo]
            if max(ys) - min(ys) + 1 < alto_minimo:
                continue
            m = np.zeros((h, w), bool)
            yy, xx = zip(*grupo)
            m[list(yy), list(xx)] = True
            figuras.append((sum(p[1] for p in grupo) / len(grupo), m))
    figuras.sort(key=lambda f: f[0])
    return [m for _, m in figuras]


def _tapar_huecos(silueta, limite):
    """Rellena los huecos encerrados dentro de la silueta, pero solo los mas
    chicos que 'limite' pixeles.

    El limite importa: cuando dos figuras de la hoja se tocan, el fondo que
    queda ENTRE las dos tambien queda encerrado, y taparlo mete una mancha
    enorme pegada al sprite. Los huecos de verdad (un ojo, el aro de una
    manga) son chicos; ese no."""
    h, w = silueta.shape
    encerrado = ~silueta & ~_rellenar_desde_borde(silueta)
    visto = np.zeros((h, w), bool)
    for y0 in range(h):
        for x0 in range(w):
            if not encerrado[y0, x0] or visto[y0, x0]:
                continue
            grupo, cola = [], deque([(y0, x0)])
            visto[y0, x0] = True
            while cola:
                y, x = cola.popleft()
                grupo.append((y, x))
                for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    ny, nx = y + dy, x + dx
                    if 0 <= ny < h and 0 <= nx < w and encerrado[ny, nx] and not visto[ny, nx]:
                        visto[ny, nx] = True
                        cola.append((ny, nx))
            if len(grupo) <= limite:
                yy, xx = zip(*grupo)
                silueta[list(yy), list(xx)] = True
    return silueta


def _silueta_hoja(img, color_fondo, pasadas):
    a = np.asarray(img).astype(np.int16)
    ref = np.array(color_fondo, dtype=np.int16)
    silueta = np.zeros(a.shape[:2], bool)
    for tol, grosor in pasadas:
        contorno = _dilatar(np.abs(a - ref).max(axis=2) > tol, grosor)
        silueta |= _erosionar(~_rellenar_desde_borde(contorno), grosor)
    # 1.5% de la hoja: de sobra para cualquier hueco real del dibujo, y muy
    # por debajo del espacio que queda entre dos figuras que se tocan.
    return _tapar_huecos(silueta, limite=int(silueta.size * 0.015))


def separar_fondo(panel, color_fondo):
    a = np.asarray(panel).astype(np.int16)
    ref = np.array(color_fondo, dtype=np.int16)

    silueta = np.zeros(a.shape[:2], bool)
    for tol, grosor in PASADAS:
        contorno = _dilatar(np.abs(a - ref).max(axis=2) > tol, grosor)
        silueta |= _erosionar(~_rellenar_desde_borde(contorno), grosor)

    silueta = ~_rellenar_desde_borde(silueta)   # tapar huecos interiores
    return _mayor_silueta(silueta)


def procesar(hoja):
    origen = hoja["origen"]
    if not origen.exists():
        print(f"  ! no encuentro {origen.relative_to(RAIZ)}")
        return 0

    img = Image.open(origen).convert("RGB")
    W, H = img.size
    poses = hoja["poses"]
    destino = hoja["destino"]
    destino.mkdir(parents=True, exist_ok=True)

    pasadas = hoja.get("pasadas", PASADAS)
    recorte = hoja.get("titulo", 0)
    print(f"  {origen.name}  ({W}x{H}, {len(poses)} figuras)")

    def guardar(sprite, nombre):
        salida = destino / f"{nombre}.png"
        if salida.resolve() == origen.resolve():
            # Pisar la hoja original la arruina: la segunda pasada le devolveria
            # el fondo y ya no habria forma de recortarla de nuevo.
            print(f"  ! {nombre}: el destino es el mismo archivo de origen. Lo salteo.")
            print(f"    Ponele otro nombre a la pose, o mové la hoja a otra carpeta.")
            return 0
        caja = sprite.getbbox()
        if not caja:
            print(f"  ! {nombre}: quedo vacio, revisa el color de fondo")
            return 0
        sprite = sprite.crop(caja)
        sprite.save(salida, optimize=True)
        kb = salida.stat().st_size // 1024
        print(f"  {salida.relative_to(RAIZ)}  ({sprite.width}x{sprite.height}, {kb} KB)")
        return 1

    # ---- modo A: encontrar las figuras solas ----
    if hoja.get("detectar"):
        hojita = img.crop((0, recorte, W, H))
        if hoja.get("fondo"):
            mascara = _silueta_hoja(hojita, hoja["fondo"], pasadas)
        else:
            mascara = np.asarray(Image.open(origen).convert("RGBA"))[recorte:, :, 3] > 8

        figuras = _componentes(mascara, alto_minimo=hojita.height * 0.4)
        if len(figuras) != len(poses):
            print(f"  ! encontre {len(figuras)} figuras y me diste {len(poses)} nombres:")
            print(f"    {', '.join(poses)}")
            if len(figuras) < len(poses):
                return 0
        base = np.asarray(hojita.convert("RGB"))
        return sum(guardar(Image.fromarray(
                       np.dstack([base, (m * 255).astype(np.uint8)]), "RGBA"), nombre)
                   for m, nombre in zip(figuras, poses))

    # ---- modo B: cortar la hoja en tantas partes como poses ----
    #
    # No se corta en partes iguales: las figuras muchas veces se tocan o se
    # pasan de su lugar, y un corte recto arrastra un pedazo de la de al lado
    # que despues queda flotando al costado del sprite.
    # En vez de eso se busca, cerca de cada division, la columna con menos
    # pixeles de dibujo: el punto donde las dos figuras estan mas separadas.
    hojita = img.crop((0, recorte, W, H))
    n = len(poses)
    croma = hoja.get("croma")

    if croma:
        # Con fondo croma alcanza con mirar el color: no hace falta nada de
        # dilatar ni rellenar, y las cosas sueltas del dibujo se conservan.
        limpia = quitar_croma(hojita, croma)
        mascara = np.asarray(limpia)[:, :, 3] > 8
    elif hoja.get("fondo"):
        limpia = None
        mascara = _silueta_hoja(hojita, hoja["fondo"], pasadas)
    else:
        limpia, mascara = None, None

    if mascara is not None:
        perfil = mascara.sum(axis=0)
        cortes = [0]
        for i in range(1, n):
            centro = round(i * W / n)
            radio = round(W / n * 0.30)
            desde, hasta = max(1, centro - radio), min(W - 1, centro + radio)
            cortes.append(desde + int(np.argmin(perfil[desde:hasta])))
        cortes.append(W)
        cruce = max(int(perfil[min(c, W - 1)]) for c in cortes)
        print("  (corte limpio: las figuras no se tocan)" if cruce == 0 else
              f"  (las figuras se tocan: el mejor corte cruza {cruce} px de dibujo)")
    else:
        cortes = [round(i * W / n) for i in range(n + 1)]

    hechos = 0
    for i, pose in enumerate(poses):
        caja = (cortes[i], 0, cortes[i + 1], hojita.height)
        if croma:
            sprite = limpia.crop(caja)
            # Con una sola figura no hay vecino que se cuele, y filtrar de mas
            # le comeria los destellos y la sombra.
            if n > 1:
                sprite = limpiar_sueltos(sprite)
        elif mascara is not None:
            alfa = _mayor_silueta(mascara[:, cortes[i]:cortes[i + 1]])
            sprite = Image.fromarray(
                np.dstack([np.asarray(hojita.crop(caja)), (alfa * 255).astype(np.uint8)]), "RGBA")
        else:
            sprite = hojita.crop(caja).convert("RGBA")
        hechos += guardar(sprite, pose)
    return hechos



def main():
    total = sum(procesar(h) for h in HOJAS)
    print(f"\nListo: {total} sprites.")


if __name__ == "__main__":
    main()
