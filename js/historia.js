/* ============================================================
   HISTORIA.JS  —  Este es el único archivo que necesitas tocar
   para escribir tu novela. El motor (motor.js) hace el resto.
   ============================================================ */

/* --- 1) PERSONAJES ---------------------------------------------
   La clave ("aiko") es la que usás en los diálogos y también para
   mostrar su sprite.
     nombre  : cómo aparece en la caja de texto
     color   : color de ese nombre
     carpeta : dónde están sus sprites (solo si tiene)
     poses   : lista de sprites, para precargarlos al inicio
     retrato : qué pose usar en el panel "Personajes" del menú
     perfil  : su ficha en ese panel (si no ponés perfil, no aparece)
     oculto  : true = la ficha queda tapada hasta que aparece en la historia

   Dos claves especiales:
     narrador -> sin nombre. Es la voz interna del protagonista.
     yo       -> el protagonista cuando habla en voz alta. Su nombre
                 lo escribe el jugador al empezar, no lo pongas acá.
----------------------------------------------------------------- */
const PERSONAJES = {
  narrador: { nombre: "",   color: "#cfd6e6" },
  yo:       { nombre: "Yo", color: "#9ad0ff" },

  aiko: {
    nombre: "Aiko",
    color: "#ff9ec4",
    carpeta: "assets/img/personajes/aiko/",
    poses: [
      "normal-feliz", "normal-triste", "normal-enojada",
      "pensando-feliz", "pensando-avergonzada",
      "enojo-seria",
    ],
    retrato: "normal-feliz",
    perfil: "Va a tu mismo curso hace un año y medio y nunca cruzaste una " +
            "palabra con ella. Toma el mismo subte que vos todas las mañanas. " +
            "Se dio cuenta mucho antes que vos.",
  },

  /* --- El grupo del fondo del aula --- */
  alvaro: {
    nombre: "Álvaro", color: "#8fd6ff", oculto: true,
    carpeta: "assets/img/personajes/alvaro/",
    poses: ["normal", "pensando", "enojado", "triste", "orgulloso"],
    retrato: "normal",
    chibi: "assets/img/personajes/chibis/alvaro.png",
    chibiSalto: "assets/img/personajes/chibis/alvaro-chibbi-saltando.png",
    perfil: "El que habla más fuerte y decide a dónde van todos. " +
            "",
  },
  pato: {
    nombre: "Pato", color: "#c9b6ff", oculto: true,
    carpeta: "assets/img/personajes/pato/",
    poses: ["normal", "pensando", "enojado", "triste", "orgulloso"],
    retrato: "normal",
    chibi: "assets/img/personajes/chibis/pato.png",
    chibiSalto: "assets/img/personajes/chibis/pato-saltando.png",
    perfil: "Habla poco y cuando habla es para bajar a alguien un " +
            "renglón. No lo hace en serio.",
  },
  mauri: {
    nombre: "Mauri", color: "#ffd08a", oculto: true,
    carpeta: "assets/img/personajes/mauri/",
    poses: ["normal", "pensando", "enojado", "triste", "orgulloso"],
    retrato: "normal",
    chibi: "assets/img/personajes/chibis/mauri.png",
    chibiSalto: "assets/img/personajes/chibis/mauri-saltando.png",
    perfil: "Persona tranquila. Muy responsable y servicial. " +
            ".",
  },
  lucas: {
    nombre: "Lucas", color: "#8fe3b0", oculto: true,
    carpeta: "assets/img/personajes/lucas/",
    poses: ["normal", "pensando", "enojado", "triste", "orgulloso"],
    retrato: "normal",
    chibi: "assets/img/personajes/chibis/lucas.png",
    chibiSalto: "assets/img/personajes/chibis/lucas-saltando.png",
    perfil: "Siempre parece recién despertado. Se queda hasta las cuatro " +
            "de la mañana jugando y llega igual que vos: justo.",
  },
  iara: {
    nombre: "Iara", color: "#7fc9a8", oculto: true,
    carpeta: "assets/img/personajes/iara/",
    poses: ["normal", "pensando", "enojada", "triste", "orgullosa"],
    retrato: "normal",
    chibi: "assets/img/personajes/chibis/iara.png",
    chibiSalto: "assets/img/personajes/chibis/iara-saltando.png",
    // Todavía no aparece en el guion: escribile el perfil cuando la sumes.
    perfil: "Anteojos, pelo largo, campera del instituto. Aparece en el Acto 2.",
  },

  franco: {
    nombre: "Franco", color: "#ffa8a8", oculto: true,
    carpeta: "assets/img/personajes/franco/",
    poses: ["normal", "pensando", "enojado", "triste", "orgulloso"],
    retrato: "normal",
    chibi: "assets/img/personajes/chibis/franco.png",
    chibiSalto: "assets/img/personajes/chibis/franco-saltando.png",
    perfil: "Sabe de todo un poco y le gusta que se note, pero cuando " +
            "hay que entregar algo es el único que lo tiene hecho.",
  },
};

/* --- 2) FONDOS Y MÚSICA ----------------------------------------
   Alias cortos para no repetir rutas largas en el guion.
----------------------------------------------------------------- */
/* Un fondo puede ser una ruta suelta, o un objeto si querés controlar cómo se
   encuadra: { src: "...", ajuste: "auto" | "cover" | "contain", posicion: "top center" }

   Por defecto ("auto") el motor llena la pantalla, pero si para eso tuviera que
   recortar demasiado muestra la foto entera y rellena los costados con una copia
   desenfocada. Las fotos verticales (como aula.jpeg) entran solas en ese caso. */
const FONDOS = {
  // El amanecer es un cielo: recortarlo no se nota y queda mejor a pantalla llena.
  amanecer:    { src: "assets/img/amanecer.jpeg", ajuste: "cover" },
  "camino-al-subte": "assets/img/camino-al-subte.jpeg",
  "cartel-subte":    "assets/img/cartel-subte.jpg",
  subte:       "assets/img/subte.jpeg",
  "vagon-subte":     "assets/img/vagon-subte.jpg",
  entrada:     "assets/img/entrada.jpg",
  patio:       "assets/img/patio.jpg",
  aula:        "assets/img/aula.jpeg",
  computacion: "assets/img/computacion.webp",
};

const MUSICA = {
  tema:    "assets/audio/tema-principal.mp3",   // suena en el menú
  ohayou:  "assets/audio/ohayou.mp3",           // la mañana, hasta el aula
  alegre:  "assets/audio/okay-everyone.mp3",    // del aula en adelante
};

/* --- 3) EL GUION ------------------------------------------------
   La historia son "escenas". Cada escena es una lista de pasos.

   Pasos disponibles:
     { fondo: "aula" }                     cambia el fondo
     { musica: "tema" }                    cambia la música (null la apaga)
     { texto: "Llovía." }                  monólogo interno (sin nombre)
     { quien: "yo",   texto: "Hola." }     el protagonista habla en voz alta
     { quien: "aiko", texto: "¡Hola!" }    Aiko habla
     { aiko: "normal-feliz" }              muestra su sprite con esa expresión
     { aiko: "normal-feliz", donde: "izquierda" }   izquierda / centro / derecha
     { aiko: null }                        la saca de pantalla
     { esperar: 800 }                      pausa en milisegundos
     { opciones: [ {texto:"...", ir:"escena"} ] }   una decisión
     { ir: "otra_escena" }                 salta a otra escena
     { fin: true }                         termina la partida

   Para recordar lo que hizo el jugador:
     { recordar: "hablaste" }               deja anotada una bandera
     { si:   "hablaste", texto: "..." }     el paso solo ocurre si está puesta
     { sino: "hablaste", texto: "..." }     el paso solo ocurre si NO está puesta

   En cualquier texto podés escribir {nombre} y el motor lo cambia
   por el nombre que eligió el jugador.

   Los pasos se combinan en una sola línea:
     { aiko: "normal-feliz", quien: "aiko", texto: "¡Buen día!" }
----------------------------------------------------------------- */
const HISTORIA = {

  /* =========================================================
     ACTO 1 — El camino de la mañana
     amanecer -> subte -> entrada -> patio -> aula -> computación
     ========================================================= */

  /* ---------- 1. AMANECER ---------- */
  inicio: [
    { fondo: "amanecer", musica: "ohayou" },

    { texto: "El despertador sonó a las seis y diez, como todos los días." },
    { texto: "Y como todos los días lo apagué antes del segundo pitido y me quedé mirando el techo un rato más." },
    { texto: "No porque tuviera sueño. Ya no. Es que el techo es la única cosa que no me pide nada." },
    { esperar: 600 },

    { texto: "Salí cuando el cielo todavía no había decidido de qué color quería ser." },
    { texto: "Naranja arriba, azul abajo, y esa franja del medio que no tiene nombre." },
    { fondo: "camino-al-subte" },
    { texto: "Once minutos hasta la estación. Los conté una vez, hace como un año, y desde entonces no puedo dejar de contarlos." },
    { esperar: 400 },

    { texto: "A esta hora la ciudad está prestada." },
    { texto: "Como si alguien me la dejara usar un rato antes de que llegue la gente de verdad." },
    { quien: "yo", texto: "...así está mejor, posta." },
    { texto: "Lo dije en voz alta. A nadie. Eso también lo hago todos los días." },
    { esperar: 500 },

    { fondo: "cartel-subte" },
    { texto: "Bajé las escaleras de la estación con la tarjeta ya en la mano y la cabeza en cualquier lado." },
    { ir: "subte" },
  ],

  /* ---------- 2. SUBTE ---------- */
  subte: [
    { fondo: "subte" },
    { texto: "El andén a las seis y media es otro planeta." },
    { texto: "Cuatro personas contadas, el eco de los parlantes y ese olor a freno caliente que ya ni registro." },
    { texto: "Siempre me paro en el mismo lugar: sobre la línea amarilla, tercer cartel, mirando el piso." },
    { esperar: 500 },

    { texto: "Y hoy, en mi lugar, había alguien." },
    { aiko: "pensando-feliz", donde: "centro" },
    { esperar: 700 },

    { texto: "Una piba del colegio. El mismo uniforme que yo, la mochila colgando de un hombro." },
    { texto: "Estaba mirando las vías con un dedo apoyado en la mejilla, como quien está resolviendo algo importante." },
    { texto: "La conozco de vista. Aiko. Va a mi mismo curso y nunca cruzamos una palabra." },
    { esperar: 400 },
     { aiko: null },
    { fondo: "cartel-subte" },
    { texto: "El cartel decía que el tren llegaba en tres minutos." },

    { fondo: "subte" },
    { aiko: "pensando-feliz", donde: "centro" },
    { texto: "Cuatro minutos para decidir." },

    {
      opciones: [
        { texto: "Hablarle",        ir: "subte_hablar" },
        { texto: "Seguir de largo", ir: "subte_de_largo" },
      ]
    },
  ],

  /* ---------- 2a. Le hablás ---------- */
  subte_hablar: [
    { recordar: "hablaste" },
    { texto: "Abrí la boca antes de tener pensado qué decir. Un clásico." },
    { quien: "yo", texto: "Eh... buenas." },
    { esperar: 500 },

    { aiko: "normal-feliz" },
    { texto: "Se dio vuelta despacio, sin sobresaltarse, como si me viniera escuchando desde la escalera." },
    { quien: "aiko", texto: "Buenas." },
    { quien: "aiko", texto: "Llegaste tarde." },
    { esperar: 400 },

    { texto: "Me quedé duro." },
    { quien: "yo", texto: "¿Cómo que llegué tarde?" },

    { aiko: "pensando-feliz" },
    { quien: "aiko", texto: "Vos caés siempre entre y veinticinco y y media. Hoy son menos veinte." },
    { quien: "aiko", texto: "Llegaste cinco minutos tarde, chabón." },
    { esperar: 500 },

    { texto: "No supe qué hacer con esa información." },
    { texto: "Alguien había estado midiendo mis once minutos sin que yo me enterara." },
    { quien: "yo", texto: "¿Y vos cómo sabés eso?" },

    { aiko: "pensando-avergonzada" },
    { quien: "aiko", texto: "Porque yo tomo este mismo subte todos los días, boludo." },
    { quien: "aiko", texto: "Hace como seis meses." },
    { esperar: 400 },
    { quien: "aiko", texto: "Te sentás siempre en el mismo asiento, el del fondo a la derecha, y no levantás la vista del piso ni una vez." },

    { texto: "Tenía razón. Miro el piso. Once minutos y siete estaciones mirando el piso." },
    { quien: "yo", texto: "...ni idea tenía." },

    { aiko: "normal-feliz" },
    { quien: "aiko", texto: "Ya sé. Por eso te lo digo." },
    { esperar: 600 },

    { texto: "Entró el tren. Ese golpe de aire que te despeina y el chirrido que te obliga a callarte tres segundos." },
    { fondo: "vagon-subte" },
    { texto: "Subimos. El vagón estaba casi vacío, así que nos sentamos en el fondo a la derecha." },
    { texto: "En mi asiento. Bueno, en los dos asientos." },
    { esperar: 500 },

    { quien: "aiko", texto: "Soy Aiko, por las dudas." },
    { quien: "yo", texto: "Sé quién sos. Soy {nombre}." },
    { aiko: "normal-feliz" },
    { quien: "aiko", texto: "Obvio que sé cómo te llamás, {nombre}. Estamos en el mismo curso hace un año y medio." },
    { quien: "yo", texto: "Cierto." },
    { esperar: 400 },
    { texto: "Un año y medio. Dicho en voz alta sonaba bastante peor." },

    { aiko: "pensando-feliz" },
    { quien: "aiko", texto: "¿Te puedo preguntar una cosa?" },
    { quien: "yo", texto: "Depende." },
    { quien: "aiko", texto: "¿Por qué salís tan temprano si el cole abre siete y media?" },
    { esperar: 600 },

    { texto: "Ahí estaba. La pregunta que nadie me había hecho, porque nadie había mirado lo suficiente." },
    { texto: "Podría haber dicho cualquier cosa. Que duermo mal. Que me gusta caminar." },
    { texto: "Pero eran menos veinte, el vagón iba vacío y ella venía contando mis minutos hace seis meses." },
    { quien: "yo", texto: "Porque a esta hora no hay que hablar con nadie." },
    { esperar: 500 },

    { aiko: "normal-triste" },
    { texto: "Se quedó callada. Ahí pensé que la había mandado." },
    { quien: "aiko", texto: "Sí." },
    { quien: "aiko", texto: "Por eso lo tomo yo también." },
    { esperar: 700 },

    { texto: "Y no dijimos nada por seis estaciones." },
    { texto: "Fue el silencio menos incómodo que me tocó en mucho tiempo... Hasta que se me ocurrio romper el hielo con una pregunta" },
    {quien: "yo", texto: "Aiko, ¿porque te llamas asi siendo negra?"},
    { texto: "Eso sono peor de lo que imagine, va a pensar que soy racista" },
    { aiko: "pensando-feliz" },
    { quien: "aiko", texto: "Porque mi viejo es peruano." },
    { quien: "aiko", texto: "Mi vieja es de aca, vinimos a vivir a la Zavaleta hace muchos años. ¿Por que preguntas?" },
    {quien:"yo", texto: "Por nada en especifico"},
    { esperar: 500 },

  
    { aiko: "normal-feliz" },
    { quien: "aiko", texto: "Bueno, {nombre}. Bajamos." },
    { ir: "entrada" },

  ],

  /* ---------- 2b. Seguís de largo ---------- */
  subte_de_largo: [
    { texto: "No dije nada." },
    { texto: "Bajé un poco más la cabeza y caminé hasta el otro extremo del andén, como si mi lugar fuera ese desde siempre." },
    { esperar: 500 },

    { aiko: "normal-triste" },
    { texto: "Alcancé a ver que se daba vuelta." },
    { texto: "No dijo nada. Levantó un poco la mano, a la altura del pecho, y la volvió a bajar." },
    { esperar: 700 },
    { aiko: null },
    { fondo: "cartel-subte" },
    { texto: "Miré el cartel. Dos minutos." },
    { esperar: 500 },

    { texto: "Y me puse a hacer la cuenta, porque es lo único que sé hacer." },
    { texto: "El gesto de la mano habrá durado, calculo, medio segundo." },
    { texto: "Medio segundo en el que alguien decidió saludarme y después decidió que mejor no." },
    { esperar: 400 },

    { quien: "yo", texto: "...era un saludo, boludo." },
    { texto: "A nadie. Como todos los días." },
    { esperar: 600 },

    { fondo: "vagon-subte" },
    { texto: "Entró el tren. Subí al vagón de adelante, que es el que nunca uso." },
    { texto: "Me quedé parado al lado de la puerta aunque había treinta asientos vacíos." },
    { esperar: 500 },

    { texto: "Me dije las cosas que uno se dice." },
    { texto: "Que no me estaba saludando a mí. Que capaz se estaba estirando. Que igual no íbamos a tener de qué hablar." },
    { texto: "Que si volvía ahora iba a ser peor, más raro, más forzado." },
    { esperar: 500 },
    { texto: "Y esa última me la creí, porque era la única que me servía." },
    { esperar: 700 },

    { texto: "Siete estaciones mirando el piso. Récord personal, y eso que el récord ya era mío." },
    { texto: "Sé cómo se llama, igual. Aiko." },
    { texto: "Va a mi mismo curso hace un año y medio." },
    { texto: "Y hoy fue la primera vez que noté que existe." },
    { ir: "entrada" },
  ],

  /* ---------- 3. ENTRADA ---------- */
  entrada: [
    { fondo: "entrada" },
    { aiko: null },
    { texto: "Salimos a la superficie y de golpe volvió a existir el resto del mundo." },
    { texto: "Bocinas, kioscos abriendo, pibes con la camisa afuera cruzando la calle sin mirar." },
    { texto: "La ciudad dejó de ser prestada." },
    { esperar: 500 },

    /* --- variante: veniste hablando con ella --- */
    { si: "hablaste", aiko: "normal-feliz", donde: "derecha" },
    { si: "hablaste", texto: "Caminamos las tres cuadras hasta el colegio hablando de nada." },
    { si: "hablaste", texto: "De un profesor. De una prueba. De que la máquina de café del segundo piso se come las monedas desde marzo." },
    { si: "hablaste", texto: "Nada importante. Ese es exactamente el punto." },
    { si: "hablaste", texto: "Hacía mucho que no tenía una conversación sobre nada." },
    { si: "hablaste", esperar: 400 },
    { si: "hablaste", aiko: "pensando-feliz" },
    { si: "hablaste", quien: "aiko", texto: "Che, {nombre}." },
    { si: "hablaste", quien: "yo", texto: "¿Qué?" },
    { si: "hablaste", aiko: "normal-feliz" },
    { si: "hablaste", quien: "aiko", texto: "Mañana no llegues cinco minutos tarde." },
    { si: "hablaste", esperar: 600 },
    { si: "hablaste", aiko: null },
    { si: "hablaste", texto: "Y se metió adentro antes de que se me ocurriera una respuesta." },
    { si: "hablaste", texto: "Me quedé parado en la puerta con la mochila colgando, pensando una cosa bastante tonta:" },
    { si: "hablaste", texto: "que mañana salgo seis y diez en punto." },

    /* --- variante: seguiste de largo --- */
    { sino: "hablaste", texto: "Llegué al colegio veinte minutos antes que todo el mundo, como siempre." },
    { sino: "hablaste", texto: "Me senté en el escalón de siempre y saqué el teléfono para no mirar nada en particular." },
    { sino: "hablaste", esperar: 500 },
    { sino: "hablaste", aiko: "normal-triste", donde: "derecha" },
    { sino: "hablaste", texto: "La vi cruzar el portón un rato después." },
    { sino: "hablaste", texto: "Pasó a tres metros." },
    { sino: "hablaste", texto: "No miró para este lado." },
    { sino: "hablaste", esperar: 700 },
    { sino: "hablaste", aiko: null },
    { sino: "hablaste", texto: "Y ahí entendí una cosa que no me gustó nada." },
    { sino: "hablaste", texto: "Que no me estaba ignorando." },
    { sino: "hablaste", texto: "Que me estaba devolviendo, clavado, exactamente lo que le di en el andén." },
    { sino: "hablaste", esperar: 500 },
    { sino: "hablaste", quien: "yo", texto: "...mañana me paro en la línea amarilla." },
    { sino: "hablaste", texto: "A nadie. Pero esta vez, por lo menos, era una promesa." },

    { ir: "patio" },
  ],

  /* ---------- 4. PATIO ---------- */
  patio: [
    { fondo: "patio" },
    { esperar: 400 },
    { texto: "Faltaba media hora para el timbre, así que hice lo de siempre: el patio, el rincón de la sombra, la espalda contra la pared." },
    { texto: "Desde ahí se ve todo y no te ve nadie. Es mi lugar favorito del colegio y eso dice bastante de mí." },
    { esperar: 500 },

    { texto: "El patio a las siete y cuarto se llena de golpe." },
    { texto: "Los de quinto contra el paredón, las de tercero en ronda, alguien pateando una pelota de tenis contra el arco pintado." },
    { esperar: 400 },

    { si: "hablaste", texto: "La busqué sin querer buscarla, que es la peor forma de buscar a alguien." },
    { si: "hablaste", aiko: "normal-feliz", donde: "izquierda" },
    { si: "hablaste", texto: "Estaba del otro lado, cerca de los bancos, hablando con unos pibes que se reían fuerte." },
    { si: "hablaste", texto: "Me vio. Levantó la mano." },
    { si: "hablaste", esperar: 500 },
    { si: "hablaste", texto: "Un saludo completo esta vez, de arriba a abajo, sin arrepentirse a la mitad." },
    { si: "hablaste", quien: "yo", texto: "...ah." },
    { si: "hablaste", texto: "Levanté la mía como pude. Debe haber quedado horrible." },
    { si: "hablaste", aiko: null },

    { sino: "hablaste", texto: "La vi del otro lado, cerca de los bancos, hablando con unos pibes que se reían fuerte." },
    { sino: "hablaste", aiko: "normal-feliz", donde: "izquierda" },
    { sino: "hablaste", texto: "Se la veía cómoda. Como si el patio fuera de ella." },
    { sino: "hablaste", texto: "Pensé en cruzar." },
    { sino: "hablaste", esperar: 500 },
    { sino: "hablaste", texto: "Calculé la distancia, calculé cuántos me iban a mirar, y me quedé donde estaba." },
    { sino: "hablaste", quien: "yo", texto: "...mañana." },
    { sino: "hablaste", texto: "Es más fácil decir mañana." },
    { sino: "hablaste", aiko: null },

    { esperar: 600 },
    { texto: "Sonó el timbre." },
    { ir: "aula" },
  ],

  /* ---------- 5. AULA ---------- */
  aula: [
    { fondo: "aula", musica: "alegre" },
    { texto: "Segundo piso, aula 12. Mi banco es el anteúltimo de la fila de la ventana." },
    { texto: "No lo elegí por la ventana. Lo elegí porque desde ahí nadie te habla." },
    { esperar: 500 },

    { texto: "El profesor de historia todavía no había llegado, así que el aula era un quilombo prolijo." },
    { texto: "Y en el fondo, contra la pared, estaba el grupo de siempre." },
    { texto: "Cinco tipos, un banco solo, y un volumen que no corresponde a las siete y media de la mañana." },
    { esperar: 600 },

    { aiko: "normal-feliz", donde: "centro" },
    { texto: "Aiko apareció al lado de mi banco sin que la viera venir." },
    { si: "hablaste",  quien: "aiko", texto: "Che, {nombre}. Vení." },
    { sino: "hablaste", quien: "aiko", texto: "Che. Vos." },
    { quien: "yo", texto: "¿Yo?" },
    { aiko: "pensando-feliz" },
    { quien: "aiko", texto: "No, el de atrás tuyo. Obvio que vos." },
    { esperar: 400 },

    { si: "hablaste", texto: "No esperó respuesta. Ya venía caminando para el fondo y yo ya venía atrás, que es más o menos como funciona ella." },
    { sino: "hablaste", texto: "Me quedé un segundo de más. Después agarré la mochila y la seguí, más por no hacer papelón que por ganas." },
    { esperar: 500 },

    { aiko: "normal-feliz", donde: "izquierda" },
    { quien: "aiko", texto: "Bueno, manga de animales. Este es {nombre}." },
    { quien: "aiko", texto: "Está en esta división desde primero y ustedes ni saben cómo se llama." },
    { esperar: 500 },

    { alvaro: "normal", donde: "centro" },
    { quien: "alvaro", texto: "Que dices, {nombre}, el de la ventana." },
    { aiko: null ,alvaro: "orgulloso" },
    { quien: "alvaro", texto: "Álvaro. Todo bien, chabón." },
    { texto: "Me dio la mano como si nos conociéramos de antes. No sé cómo hace eso." },
    { esperar: 400 },

    { alvaro: null, pato: "normal", donde: "centro" },
    { quien: "pato", texto: "Que onda." },
    { quien: "pato", texto: "Sos el que se sienta atrás y no habla nunca." },
    { quien: "yo", texto: "Ese." },
    { pato: "orgulloso" },
    { quien: "pato", texto: "Buen laburo. Yo lo intento y no me sale." },
    { texto: "Lo dijo sin mover un músculo de la cara. Me cayó bien al toque." },
    { esperar: 500 },

    { pato: null, mauri: "normal", donde: "centro" },
    { quien: "mauri", texto: "*no mueve ni un musculo*" },
    { quien: "mauri", texto: "Soy Mauri, mucho gusto. Che, ¿te viste Blue Lock?" },
    { quien: "yo", texto: "Mi manga favorito.." },
    { mauri: "orgulloso" },
    { quien: "mauri", texto: "*extiende la mano y la estrecha con la mia* Me caes bien.. " },
    { quien: "yo", texto: "No se como hice para caerle bien en menos de 3 dialogos" },
    { mauri: "normal" },
    { quien: "mauri", texto: "..." },
    { esperar: 400 },

    { mauri: null, lucas: "normal", donde: "centro" },
    { quien: "lucas", texto: "Soy Lucas." },
    { texto: "Levantó dos dedos sin despegar la cabeza del banco." },
    { quien: "lucas", texto: "¿Vos también te levantás temprano por gusto o porque no dormís?" },
    { quien: "yo", texto: "Un poco y un poco." },
    { lucas: "pensando", donde: "izquierda" },
    { quien: "lucas", texto: "Ah, sos un sigma, igual que Franco." },
    /* Los dos hablan entre ellos: Aiko sale para que entren los dos en pantalla. */
    { franco: "orgulloso", donde: "centro" },
    { quien: "franco", texto: "Thats right my nigga (hablaba en ingles nada que ver)" },
    { lucas: "triste" },
    {quien: "lucas", texto: "*me mira con una expresion de cansancio*"},
    { quien: "lucas", texto: "Dejalo, Franco es medio especial a veces..." },
    { esperar: 500 },

    { lucas: null, franco: null },
    { aiko: "normal-feliz", donde: "izquierda" },
    { quien: "aiko", texto: "Tambien esta Iara, lastima que el creador de este juego no le alcanzo el presupuesto para agregarla como personaje." },
    { quien: "yo", texto: "(¿Aiko acaba de romper la 4ta pared?)" },
    { esperar: 500 },

    { franco: "normal", donde: "derecha" },
    { quien: "franco", texto: "Banda" },
    { quien: "franco", texto: "¿Ustedes hicieron el trabajo práctico de computación?" },
    { quien: "yo", texto: "¿El de qué?" },
    { franco: "orgulloso" },
    { quien: "franco", texto: "El que hay que entregar hoy. En parejas." },
    { esperar: 600 },

    { texto: "Silencio en el banco del fondo. Cinco caras dándose vuelta al mismo tiempo." },
    { aiko: null, alvaro: "normal", donde: "centro" },
    { quien: "alvaro", texto: "¿Hoy?" },
    { quien: "franco", texto: "Hoy." },
    { alvaro: "enojado" },
    { quien: "alvaro", texto: "Franco, sos un boton de mierda." },
    { franco: "orgulloso" },
    { quien: "franco", texto: "Yo lo tengo hecho." },
    { alvaro: null, pato: "normal", donde: "centro" },
    { quien: "pato", texto: "Peor todavía." },
    { esperar: 600 },

    { texto: "Y ahí, en el medio del despelote, me di cuenta de algo raro." },
    { texto: "Que hacía tres minutos que estaba parado en un grupo, hablando, sin buscar la salida con la mirada." },
    { texto: "Ni una vez." },
    { esperar: 500 },

    { texto: "Sonó el timbre de nuevo. Última hora antes del recreo largo: computación." },
    { aiko: null, pato: null, franco: null },
    { ir: "computacion" },
  ],

  /* ---------- 6. SALA DE COMPUTACIÓN ---------- */
  computacion: [
    { fondo: "computacion" },
    { texto: "La sala de computación está en el subsuelo y tiene el aire clavado en dieciocho grados desde 2011." },
    { texto: "Veinte máquinas, catorce que andan, y una fila de ventiladores haciendo un ruido que no deja pensar." },
    { esperar: 500 },

    { texto: "Me senté en la última máquina de la fila del fondo. Costumbre." },
    { texto: "El profesor escribió tres palabras en el pizarrón y se fue a tomar un café." },
    { alvaro: "orgulloso", donde: "izquierda" },
    { quien: "alvaro", texto: "Les dije que era hoy." },
    { alvaro: null, mauri: "pensando", donde: "izquierda" },
    { quien: "mauri", texto: "Franco, ¿trajiste las formulas?" },
    { esperar: 500 },

    { texto: "El trabajo era en parejas y yo ya estaba haciendo la cuenta de siempre." },
    { texto: "Impares en el curso. Alguien queda solo. Ese alguien tiene nombre y apellido y soy yo." },
    { texto: "No me molesta. Laburo mejor solo y no le tengo que explicar a nadie por qué hago las cosas de una manera rara." },
    { esperar: 400 },
    { texto: "Eso es lo que me digo, por lo menos." },
    { esperar: 700 },

    { mauri: null, aiko: "normal-feliz", donde: "derecha" },
    { texto: "Arrastró una silla desde dos máquinas más allá y la puso al lado de la mía." },
    { texto: "Sin preguntar. Sin fijarse si había otro lugar." },
    { quien: "aiko", texto: "Bueno. Vos y yo." },
    { quien: "yo", texto: "¿Eh?" },
    { aiko: "pensando-feliz" },
    { quien: "aiko", texto: "El trabajo, {nombre}. Vos y yo." },
    { esperar: 400 },

    { si: "hablaste", quien: "yo", texto: "Dale." },
    { si: "hablaste", texto: "Salió solo. Ni lo pensé." },
    { sino: "hablaste", quien: "yo", texto: "...¿por qué yo?" },
    { sino: "hablaste", aiko: "normal-feliz", donde: "derecha" },
    { sino: "hablaste", quien: "aiko", texto: "Porque a la mañana pasaste de largo y me quedé con las ganas de decirte algo." },
    { sino: "hablaste", quien: "yo", texto: "..." },
    { sino: "hablaste", quien: "aiko", texto: "Tranquilo, no te lo voy a cobrar. Te lo digo ahora y listo." },
    { esperar: 600 },

    { texto: "Laburamos cuarenta minutos. Ella hablaba, yo tipeaba." },
    { texto: "Resultó que piensa mucho más rápido de lo que yo escribo, cosa que me dio bronca y me causó gracia en partes iguales." },
    { esperar: 400 },
    { texto: "En algún momento me di cuenta de que no había mirado el reloj ni una vez." },
    { texto: "Y yo miro el reloj." },
    { esperar: 600 },

    { aiko: "pensando-avergonzada" },
    { texto: "Faltaban diez minutos para el timbre cuando dejó de tipear y se quedó mirando la pantalla." },
    { quien: "aiko", texto: "Che." },
    { quien: "yo", texto: "Qué." },
    { quien: "aiko", texto: "Esto no lo terminamos hoy ni en pedo." },
    { texto: "Miré la pantalla. Tenía razón. Íbamos por la mitad de la mitad." },
    { quien: "yo", texto: "No." },
    { esperar: 500 },

    { texto: "Siguió mirando la pantalla un rato más de lo necesario." },
    { quien: "aiko", texto: "¿Puedo ir a tu casa a terminarlo?" },
    { esperar: 900 },

    { texto: "El ventilador seguía haciendo ruido." },
    { texto: "Franco discutía con Mauri por una fórmula, tres máquinas más allá." },
    { texto: "Y yo me quedé mirando el cursor titilando en la pantalla, sin decir nada, durante lo que después calculé que fueron cuatro segundos." },
    { esperar: 700 },
    { texto: "Cuatro segundos son un montón cuando alguien te está esperando." },
    { ir: "fin_acto_1" },
  ],

  /* ---------- CIERRE ---------- */
  fin_acto_1: [
    { esperar: 800 },
    { aiko: null },
    { fondo: "amanecer" },
    { esperar: 700 },
    { texto: "FIN DEL ACTO 1" },
    { si: "hablaste",   texto: "Le hablaste en el andén.\n\nDiste el primer paso para vencer tu miedo de hablar con las mujeres." },
    { sino: "hablaste", texto: "Pasaste de largo en el andén y ella igual te vino a buscar.\n\nSos la maquina" },
    { texto: "Se continúa cuando Franco deje de ser un vago" },
    { ir: "respuesta_aiko" },
  ],

  /* ================= ACTO 2 ================= */

  /* ---------- Le contestás ---------- */
  respuesta_aiko: [
    { fondo: "computacion" },
    { texto: "Me quede recalculando...\n ¿Mi casa?... Es en serio?.." },
    { si:"hablaste", texto: "Entiendo que este sea el primer dia que me anime en dirigirle la palabra pero...\n\ ¿No es demasiado?" },
    {sino:"hablaste", texto:"¡¿Que clase de chica me solicita esto el primer dia que hablamos?! \n\ Ni siquiera tuve que acercarme"},
    {texto: "¡ES UNA LOCURA!"},
    {texto: "O acaso, ¿ella es asi y siempre y estoy dandole vueltas al pedo?"},
    { esperar: 400 },

    {aiko: "normal-triste"},
    { quien: "aiko", texto: "Che... {nombre}" },
    { texto: "Es verdad, todavia esta alli esperando mi respuesta. \n\ ¿Cuanto me colgue?... Debo parecer un lelo" },
    {aiko: "normal-feliz"},
    { quien: "aiko", texto: "Que onda, ¿al final vas a venir a mi casa?" },
    {texto: "¿que?"},
    { quien: "aiko", texto: "Si bo, esto no lo terminamos mas. Podes venir a mi casa y lo terminamos." },
    { quien: "aiko", texto: "Siempre y cuando puedas y quieras. No tengo drama" },
    {texto: "Habia jurado que ella me pidio venir a mi casa, no a la de ella..."},
    {texto: "Eso cambia las cosas"},

    {
      opciones: [
        { texto: "Si, no tengo drama",        ir: "aceptar_invitacion" },
        { texto: "Perdon, tengo cosas para hacer", ir: "rechazar_invitacion" },
      ]
    },
  ],
  /* ---------- 2a. Aceptás la invitación ---------- */
  aceptar_invitacion: [
    { recordar: "aceptaste_invitacion" },
    { aiko: "normal-feliz", donde: "derecha" },

    { quien: "yo", texto: "Sí, dale. No tengo drama." },
    { texto: "Lo dije rápido, antes de que la parte de mi cabeza que arruina todo llegara a opinar." },
    { esperar: 500 },

    { aiko: "pensando-feliz" },
    { quien: "aiko", texto: "Uh. Mirá vos." },
    { quien: "yo", texto: "¿Qué?" },
    { quien: "aiko", texto: "Nada. Pensé que ibas a inventar algo." },
    { esperar: 400 },

    { si: "hablaste", texto: "Y podría haberlo hecho. Pero hoy ya me había salido bien una vez, allá en el andén." },
    { si: "hablaste", texto: "Capaz eso funciona así. Capaz una vez te habilita la siguiente." },
    { sino: "hablaste", texto: "Tenía razón, igual." },
    { sino: "hablaste", texto: "Esta misma mañana me había inventado seis excusas para no cruzar diez metros de andén." },
    { sino: "hablaste", texto: "Seis. Las conté mientras el tren arrancaba." },
    { esperar: 500 },

    { aiko: "normal-feliz" },
    { quien: "aiko", texto: "Bueno. ¿Mañana después de clase te sirve?" },
    { quien: "yo", texto: "Sí." },
    { quien: "aiko", texto: "Vivo en Zavaleta. ¿Sabés llegar?" },
    { quien: "yo", texto: "...más o menos." },
    { esperar: 400 },

    { aiko: "pensando-feliz" },
    { quien: "aiko", texto: "Te paso la ubicación igual. Pero bajás en mi misma estación, eh." },
    { esperar: 600 },
    { texto: "Su misma estación." },
    { texto: "Seis meses bajando en la misma estación, a la misma hora, en el mismo vagón." },
    { texto: "Y yo mirando el piso." },
    { esperar: 500 },

    /* Los del fondo escuchan. Siempre escuchan. */
    { mauri: "orgulloso", donde: "izquierda" },
    { quien: "mauri", texto: "¡EEEEH! ¿ESCUCHARON?" },
    { aiko: "normal-enojada" },
    { quien: "aiko", texto: "Mauri, te juro por lo que más quieras." },
    { mauri: "pensando" },
    { quien: "mauri", texto: "Yo no dije nada. Estoy laburando." },
    { quien: "mauri", texto: "*no estaba laburando*" },
    { esperar: 400 },

    { mauri: null, aiko: null,franco: "orgulloso", donde: "izquierda" },
    { quien: "franco", texto: "Che, {nombre}." },
    { quien: "yo", texto: "Qué." },
    { quien: "franco", texto: "Si necesitás las fórmulas te las paso." },
    { quien: "yo", texto: "...gracias." },
    { franco: "normal" },
    { quien: "franco", texto: "De nada. Igual ya las tenés, te las mandé hace media hora." },
    { texto: "Miré el teléfono. Era verdad." },
    { texto: "Un mensaje de alguien que hasta esta mañana no sabía que existía." },
    { texto: "Leo los mensajes, las formular en png, se ve que es su letra... La de un doctor se comprende mas que esta aberracidad." },
    { texto: "Pero el ultimo mensaje era otro... " },
    {texto: "Franco_Escuela: A Aiko le gusta comer de las facturas de los Moyano, son sus favoritas. Y no seas tan timido, ella es lo contrario a lo que seguro pensas, es re gauchita"},
    {texto: "..."},
    {texto: "Mire a Franco con dudas. ¿Sabia que iba a ir a su casa?"},
    {franco: "orgulloso" ,donde: "centro"},
    {quien: "franco", texto: "Te pase exactamente las 3 'formulas'..."},
    {quien: "franco", texto: "jeje"},
    {texto: "en realidad habiamos visto solo dos formulas del excel, esa tercera no intuyo que sea algo relacionado con las clases viendo ese menasje"},
    {texto: "¿Esta tratando de ayudarme?"},
    { esperar: 600 },

    { franco: null },
    { aiko: "normal-feliz", donde: "derecha" },
    { texto: "Aiko volvió a la pantalla como si nada de todo esto hubiera pasado." },
    { texto: "Yo me quedé un rato largo con una sensación rara en el pecho, tratando de identificarla." },
    { esperar: 500 },
    { texto: "Tardé en darme cuenta de que era entusiasmo." },
    { texto: "Hacía tanto que no lo sentía que no lo reconocí de entrada." },
    { ir: "fin_de_clase" },
  ],

  /* ---------- 2b. Rechazás la invitación ---------- */
  rechazar_invitacion: [
    { recordar: "rechazaste_invitacion" },
    { aiko: "normal-feliz", donde: "centro" },

    { quien: "yo", texto: "Perdón, tengo cosas para hacer." },
    { esperar: 700 },
    { texto: "No tenía nada para hacer." },
    { texto: "Lo dije igual, con la voz de alguien que tiene la agenda llena, que es una voz que practiqué mucho." },
    { esperar: 500 },

    { aiko: "normal-triste" },
    { texto: "Se le movió algo en la cara. Un cuarto de segundo." },
    { texto: "Después lo tapó, que es exactamente lo que hago yo." },
    { esperar: 400 },

    { aiko: "normal-feliz" },
    { quien: "aiko", texto: "Ah, joya. Tranquilo." },
    { quien: "aiko", texto: "Lo terminamos en el recreo largo mañana, no pasa nada." },
    { esperar: 500 },

    { texto: "Y ahí ya estaba haciendo la cuenta." },
    { texto: "Diez segundos desde que dije que no. Doce. Quince." },
    { texto: "Quince segundos y ya me quería morir." },
    { esperar: 600 },

    { si: "hablaste", texto: "Lo peor era que hoy a la mañana lo había hecho bien." },
    { si: "hablaste", texto: "Una vez. Una sola vez en todo el día, y parece que con eso se me acabó la cuota." },
    { sino: "hablaste", texto: "Dos veces en el mismo día." },
    { sino: "hablaste", texto: "En el andén y acá. Récord personal, y eso que el récord ya era mío." },
    { esperar: 500 },

    { aiko: "pensando-feliz" },
    { quien: "aiko", texto: "Che, {nombre}." },
    { quien: "yo", texto: "¿Qué?" },
    { quien: "aiko", texto: "No hace falta que pongas esa cara. Era una propuesta, no un examen." },
    { esperar: 400 },
    { quien: "yo", texto: "No estoy poniendo ninguna cara." },
    { aiko: "pensando-feliz" },
    { quien: "aiko", texto: "Estás poniendo una cara." },
    { esperar: 600 },

    { texto: "Me toqué la cara sin querer. Un movimiento tonto, de reflejo." },
    { texto: "Ella se rió con la nariz, sin abrir la boca. Un ruido chiquito." },
    { texto: "No fue burla. Eso fue lo que más me descolocó." },
    { esperar: 500 },

    /* Los del fondo, que escuchan todo. */
    {aiko:null},
    { mauri: "pensando", donde: "izquierda" },
    { quien: "mauri", texto: "Che, ¿escucharon algo?" },
    { mauri: null, pato: "normal", donde: "izquierda" },
    { quien: "pato", texto: "No." },
    { quien: "pato", texto: "Y vos tampoco." },
    { esperar: 400 },
    { texto: "Gracias, Pato." },
    { texto: "En serio." },
    { esperar: 500 },

    { pato: null },
    { aiko: "normal-feliz", donde: "derecha" },
    { texto: "Aiko volvió a la pantalla y siguió tipeando como si nada." },
    { texto: "Yo me quedé mirando el cursor otra vez." },
    { esperar: 400 },
    { quien: "yo", texto: "...Aiko." },
    { aiko: "pensando-feliz" },
    { quien: "aiko", texto: "¿Mmm?" },
    { esperar: 700 },
    { texto: "Y no me salió nada." },
    { texto: "Se me quedó atravesado en algún lado entre la cabeza y la boca, como siempre." },
    { quien: "yo", texto: "Nada. Después te digo." },
    { esperar: 500 },
    { aiko: "normal-feliz" },
    { quien: "aiko", texto: "Dale. Después me decís." },
    { texto: "Lo dijo sin dudar, como si fuera obvio que iba a haber un después." },
    { ir: "fin_de_clase" },
  ],

  /* ---------- 2c. Termina la clase ---------- */
  fin_de_clase: [
    { esperar: 500 },
    { texto: "El profesor volvió del café justo cuando faltaban tres minutos, que es su especialidad." },
    { texto: "Pasó por las filas mirando pantallas sin mirarlas, dijo dos cosas sobre el formato de entrega y se paró al lado de la puerta." },
    { esperar: 400 },

    {aiko: null, alvaro: "pensando", donde: "izquierda" },
    { quien: "alvaro", texto: "Profe, ¿para cuándo era?" },
    { texto: "El profesor no contestó." },
    { alvaro: "triste" },
    { quien: "alvaro", texto: "Profe." },
    { texto: "Nada." },
    { alvaro: null, franco: "orgulloso", donde: "centro" },
    { quien: "franco", texto: "Era para hoy." },
    {alvaro: "enojado", donde: "derecha" },
    { quien: "alvaro", texto: "Franco te juro que un día de estos..." },
    { esperar: 500 },

    { franco: null, alvaro: null },
    { texto: "Sonó el timbre." },
    { texto: "Ese ruido que en este colegio no suena, más bien raspa." },
    { esperar: 600 },

    { aiko: "normal-feliz", donde: "centro" },
    { texto: "Guardamos el archivo tres veces, porque estas máquinas son de 2011 y uno aprende." },
    { texto: "Ella cerró todo, se colgó la mochila de un hombro y esperó." },
    { esperar: 400 },

    /* La despedida cambia según lo que contestaste. */
    { si: "aceptaste_invitacion", aiko: "pensando-feliz" },
    { si: "aceptaste_invitacion", quien: "aiko", texto: "Entonces mañana." },
    { si: "aceptaste_invitacion", quien: "yo", texto: "Mañana." },
    { si: "aceptaste_invitacion", texto: "Y quedó ahí, dicho dos veces, como si hiciera falta confirmarlo." },
    { si: "aceptaste_invitacion", texto: "Capaz hacía falta." },

    { si: "rechazaste_invitacion", aiko: "pensando-feliz" },
    { si: "rechazaste_invitacion", quien: "aiko", texto: "Recreo largo, mañana. No te me hagas el ocupado." },
    { si: "rechazaste_invitacion", quien: "yo", texto: "No." },
    { si: "rechazaste_invitacion", texto: "Y me di cuenta de que no me estaba dando una segunda chance." },
    { si: "rechazaste_invitacion", texto: "Me estaba avisando que la primera seguía abierta." },
    { esperar: 700 },

    { texto: "Salimos de la sala con el resto del curso, todos en el mismo embudo de la puerta." },
    { texto: "El pasillo del subsuelo huele a humedad y a alcohol en gel desde hace años." },
    { esperar: 400 },

    { mauri: "orgulloso", donde: "izquierda" },
    { quien: "mauri", texto: "¡BANDA! Recreo largo. Cancha." },
    { mauri: null, lucas: "triste", donde: "izquierda" },
    { quien: "lucas", texto: "Yo tengo sueño." },
    { quien: "mauri", texto: "Lucas tenés sueño desde marzo." },
    { quien: "lucas", texto: "Y voy a seguir teniendo." },
    { esperar: 500 },

    { lucas: null },
    { texto: "Subimos las escaleras en manada, con ese ruido de treinta pares de zapatillas que hace temblar el pasamanos." },
    { texto: "Aiko iba adelante, hablando con alguien que no alcancé a ver." },
    { esperar: 400 },

    { si: "aceptaste_invitacion", texto: "Y yo iba atrás, como siempre." },
    { si: "aceptaste_invitacion", texto: "Pero por primera vez en mucho tiempo, atrás de algo. No solamente atrás." },

    { si: "rechazaste_invitacion", texto: "Y yo iba atrás, como siempre." },
    { si: "rechazaste_invitacion", texto: "Repasando la frase que no me salió, buscándole una versión que sirviera para mañana." },
    { si: "rechazaste_invitacion", texto: "Nunca encuentro esa versión. Pero la sigo buscando, que ya es algo." },
    { aiko: null },
    { texto: "Siento dos manos enormes agarrarme"},
    {texto: "Franco iba atras mio, agarrando mis hombros como si fuese una salida en trencito de primaria." },
    { texto: "A parecer le caigo bien... Pero me disgusta su personalidad infantil." },
    { esperar: 600 },


    { texto: "Salimos al patio." },
    { texto: "Once y veinte de la mañana, sol de frente, el griterío de siempre." },
    { esperar: 500 },
    { texto: "Y por una vez no busqué el rincón de la sombra." },
    { ir: "por_escribir" },
  ],

  /* ---------- Hasta acá está escrito ---------- */
  por_escribir: [
    { esperar: 800 },
    { fondo: "patio" },
    { esperar: 600 },
    { texto: "CONTINUARÁ" },
    { si: "aceptaste_invitacion",  texto: "Mañana vas a la casa de Aiko." },
    { si: "rechazaste_invitacion", texto: "Mañana la ves en el recreo largo. Ella insistió; vos todavía no dijiste nada." },
    { texto: "Seguí escribiendo desde acá en js/historia.js." },
    { fin: true },
  ],
};
