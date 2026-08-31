#!/usr/bin/env python3
"""
armar_sprites.py — arma los sprites del juego a partir de las capas sueltas.

Los sprites originales vienen separados en Body / Clothes / Faces, en PNG de
2160x3840. Cargar 5 capas de ese tamano en el navegador es carisimo (sobre todo
en celular), asi que este script las combina en una sola imagen ya recortada y
reducida, lista para usar.

Uso:
    python herramientas/armar_sprites.py

Entrada : assets/img/personajes/<Pose>/{Body,Clothes,Faces}/*.png
Salida  : assets/img/personajes/aiko/<pose>-<expresion>.png

Si agregas ropa nueva (por ejemplo el vestido casual), sumala a ATUENDOS y
volve a correr el script.
"""

from pathlib import Path
from PIL import Image

RAIZ    = Path(__file__).resolve().parent.parent
CRUDO   = RAIZ / "assets" / "img" / "personajes"
DESTINO = CRUDO / "aiko"

ALTO_FINAL = 1400   # alto en px del sprite final (suficiente para pantallas 4K)

# Orden de apilado: de abajo hacia arriba. La cara va siempre al final.
# Cada entrada es (carpeta, nombre-de-archivo-sin-.png).
ATUENDOS = {
    # pose      atuendo        capas de ropa sobre el cuerpo
    ("Idle",     "uniforme"): ["Saya_IPanties", "Saya_IBra", "Saya_IStocking1",
                               "Saya_ISchoolUni1", "Saya_ISchoolShoes"],
    ("Thinking", "uniforme"): ["Saya_TPanties", "Saya_TBra", "Saya_TStocking",
                               "Saya_TSchoolUni1", "Saya_TSchoolShoes"],
    ("Angry",    "uniforme"): ["Saya_APanties", "Saya_ABra", "Saya_AStockings",
                               "Saya_ASchoolUni", "Saya_ASchoolShoes"],

    # Fuera del colegio: vestido y zapatillas.
    ("Idle",     "casual"):   ["Saya_IPanties", "Saya_IBra",
                               "Saya_ICasualDress", "Saya_ICasualShoes"],
    ("Thinking", "casual"):   ["Saya_TPanties", "Saya_TBra",
                               "Saya_TCasualdress", "Saya_TCasualShoes"],
    ("Angry",    "casual"):   ["Saya_APanties", "Saya_ABra",
                               "Saya_ACasualDress", "Saya_ACasualShoes"],

   #Ropa interior.   
   ("Idle",     "pantie"):   ["Saya_IPanties", "Saya_IBra","Saya_AStockings"],    
   ("Thinking", "pantie"):   ["Saya_TPanties", "Saya_TBra","Saya_AStockings"],                     
   ("Angry", "pantie"):   ["Saya_TPanties", "Saya_TBra","Saya_AStockings"],                     
}

# Cuerpo base de cada pose (la variante que combina con el uniforme "1").
CUERPOS = {
    "Idle":     "Saya_INude1",
    "Thinking": "Saya_TNude1",
    "Angry":    "Saya_ANude",
}

# Caras disponibles por pose -> nombre corto que usaras en historia.js
CARAS = {
    "Idle":     {"Saya_IHappy": "feliz", "Saya_ISad": "triste", "Saya_IAngry": "enojada"},
    "Thinking": {"Saya_THappy": "feliz", "Saya_TEmbarrassed": "avergonzada"},
    "Angry":    {"Saya_ACloseMouth": "seria"},
}

POSE_CORTA = {"Idle": "normal", "Thinking": "pensando", "Angry": "enojo"}


def cargar(pose: str, carpeta: str, nombre: str) -> Image.Image | None:
    ruta = CRUDO / pose / carpeta / f"{nombre}.png"
    if not ruta.exists():
        # Algunos nombres varian de mayusculas entre poses; buscamos sin distinguir.
        for alt in (CRUDO / pose / carpeta).glob("*.png"):
            if alt.stem.lower() == nombre.lower():
                ruta = alt
                break
        else:
            print(f"  ! falta {pose}/{carpeta}/{nombre}.png — se omite esa capa")
            return None
    return Image.open(ruta).convert("RGBA")


def main() -> None:
    DESTINO.mkdir(parents=True, exist_ok=True)
    hechos = 0

    for (pose, atuendo), ropa in ATUENDOS.items():
        base = cargar(pose, "Body", CUERPOS[pose])
        if base is None:
            continue

        # Apilamos la ropa sobre el cuerpo una sola vez por pose.
        vestida = base.copy()
        for prenda in ropa:
            capa = cargar(pose, "Clothes", prenda)
            if capa is not None:
                vestida.alpha_composite(capa)

        # Y sobre eso, cada expresion genera un sprite distinto.
        for archivo_cara, nombre_cara in CARAS[pose].items():
            cara = cargar(pose, "Faces", archivo_cara)
            if cara is None:
                continue
            final = vestida.copy()
            final.alpha_composite(cara)

            final = final.crop(final.getbbox())          # recortar el vacio
            ancho = round(final.width * ALTO_FINAL / final.height)
            final = final.resize((ancho, ALTO_FINAL), Image.LANCZOS)

            # El uniforme no lleva prefijo, para no romper lo que ya usa
            # historia.js. Los demas atuendos si: casual-normal-feliz, etc.
            prefijo = "" if atuendo == "uniforme" else f"{atuendo}-"
            salida = DESTINO / f"{prefijo}{POSE_CORTA[pose]}-{nombre_cara}.png"
            final.save(salida, optimize=True)
            kb = salida.stat().st_size // 1024
            print(f"  {salida.relative_to(RAIZ)}  ({final.width}x{final.height}, {kb} KB)")
            hechos += 1

    print(f"\nListo: {hechos} sprites en {DESTINO.relative_to(RAIZ)}")


if __name__ == "__main__":
    main()
