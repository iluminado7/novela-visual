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
  yo: {
    nombre: "Yo",              // en la partida lo reemplaza el nombre del jugador
    nombreFicha: "Vos",        // como aparece en el panel "Personajes"
    color: "#9ad0ff",
    perfil: "Contás los minutos de todo: los once hasta la estación, los " +
            "segundos que tarda alguien en contestarte, las excusas que te " +
            "inventás. Salís cuarenta minutos antes y te sentás donde nadie " +
            "te hable, y te repetís que es porque a esta hora no hay que " +
            "hablar con nadie. Te lo repetís bastante seguido.",
  },

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
    perfil: "El más extrovertido del elenco. Sociable, amiguero, con un chiste " +
            "para cada momento — incluido el momento en que nadie quería un " +
            "chiste. No tiene filtro y no le importa la incomodidad. Te va a " +
            "bancar en la medida en que te acerques vos.",
  },
  pato: {
    nombre: "Pato", color: "#c9b6ff", oculto: true,
    carpeta: "assets/img/personajes/pato/",
    poses: ["normal", "pensando", "enojado", "triste", "orgulloso"],
    retrato: "normal",
    chibi: "assets/img/personajes/chibis/pato.png",
    chibiSalto: "assets/img/personajes/chibis/pato-saltando.png",
    perfil: "Introvertido, con destellos de extrovertido cuando menos lo " +
            "esperás. Habla poco y casi siempre en sarcasmo, así que nunca " +
            "terminás de saber si te está cargando. Es el más difícil de " +
            "todos: se abre o no según cómo te portes.",
  },
  mauri: {
    nombre: "Mauri", color: "#ffd08a", oculto: true,
    carpeta: "assets/img/personajes/mauri/",
    poses: ["normal", "pensando", "enojado", "triste", "orgulloso"],
    retrato: "normal",
    chibi: "assets/img/personajes/chibis/mauri.png",
    chibiSalto: "assets/img/personajes/chibis/mauri-saltando.png",
    perfil: "De los más introvertidos del juego. Buen pibe, de actitud " +
            "tranquila, pero no se va a acercar si no te acercás vos primero. " +
            "Calmado razona bien; sacalo de su molde y se pone nervioso o se " +
            "calienta enseguida.",
  },
  lucas: {
    nombre: "Lucas", color: "#8fe3b0", oculto: true,
    carpeta: "assets/img/personajes/lucas/",
    poses: ["normal", "pensando", "enojado", "triste", "orgulloso"],
    retrato: "normal",
    chibi: "assets/img/personajes/chibis/lucas.png",
    chibiSalto: "assets/img/personajes/chibis/lucas-saltando.png",
    perfil: "Introvertido y de personalidad fría. Dice lo que piensa sin que " +
            "le tiemble la voz. Es el más inteligente del grupo y, curiosamente, " +
            "el que menos lo hace notar. Hagas lo que hagas, él va a seguir " +
            "exactamente igual.",
  },
  iara: {
    nombre: "Iara", color: "#7fc9a8", oculto: true,
    carpeta: "assets/img/personajes/iara/",
    poses: ["normal", "pensando", "enojada", "triste", "orgullosa"],
    retrato: "normal",
    chibi: "assets/img/personajes/chibis/iara.png",
    chibiSalto: "assets/img/personajes/chibis/iara-saltando.png",
    perfil: "Introvertida, tranquila, serena. Racional casi todo el tiempo: " +
            "no se altera aunque a su alrededor se prenda fuego todo. Cada " +
            "tanto tira una broma, y más de una vez es humor negro.",
  },

  franco: {
    nombre: "Franco", color: "#ffa8a8", oculto: true,
    carpeta: "assets/img/personajes/franco/",
    poses: ["normal", "pensando", "enojado", "triste", "orgulloso"],
    retrato: "normal",
    chibi: "assets/img/personajes/chibis/franco.png",
    chibiSalto: "assets/img/personajes/chibis/franco-saltando.png",
    perfil: "Extrovertido, jodón y servicial. Hacerlo enojar es casi " +
            "imposible: se le rebota todo. De los seis es el único que va a " +
            "estar ahí decidas lo que decidas — con Franco no hay nada que " +
            "ganarse.",
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

  // Ilustrados, del mismo estilo que los personajes.
  habitacion:      "assets/img/habitacion.png",
  "patio-colegio": "assets/img/patio-colegio.png",
  cafeteria:       "assets/img/cafeteria.png",
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
    { ir: "recreo_patio" },
  ],

  /* =========================================================
     EL RECREO LARGO
     patio del colegio -> cafetería
     Acá empieza a pesar la afinidad: mirá RELACIONES.md.
     ========================================================= */

  /* ---------- El patio ---------- */
  recreo_patio: [
    { fondo: "patio-colegio" },
    { texto: "El patio a las once y veinte es otra cosa que a las siete y cuarto." },
    { texto: "El sol pega de frente contra el edificio y rebota, así que todo el mundo termina apiñado en la sombra de los dos árboles." },
    { esperar: 500 },

    { texto: "Franco me soltó recién cuando llegamos al cantero." },
    { franco: "orgulloso", donde: "derecha" },
    { quien: "franco", texto: "Acá. Este es el lugar. Sentate." },
    { quien: "yo", texto: "¿Hay un lugar?" },
    { franco: "normal" },
    { quien: "franco", texto: "Obvio que hay un lugar. Hace tres años que es este." },
    { esperar: 400 },
    { texto: "Tres años sentándose en el mismo cantero, a veinte metros de donde yo me siento hace tres años." },
    { texto: "Veinte metros. Los conté sin querer." },
    { esperar: 600 },

    /* --- Álvaro dice algo de más --- */
    { franco: null, alvaro: "normal", donde: "derecha" },
    { quien: "alvaro", texto: "Che, ¿ustedes vieron el corte de pelo nuevo del de Química?" },
    { quien: "pato", texto: "No arranques." },
    { alvaro: "orgulloso" },
    { quien: "alvaro", texto: "Parece que se peinó con un tenedor. Con un tenedor, banda." },
    { esperar: 400 },
    { texto: "Se rió solo, fuerte, sin fijarse quién andaba cerca." },
    { alvaro: "normal" },
    { texto: "Y justo atrás pasaba una preceptora." },
    { esperar: 700 },
    { texto: "Álvaro no la vio. O la vio y le dio igual, que con él nunca sabés." },
    { texto: "El resto del banco se quedó esperando a ver qué hacía yo." },

    {
      opciones: [
        { texto: "Seguirle el chiste",                    ir: "alvaro_chiste_si" },
        { texto: "Bancarlo aunque se haya mandado",       ir: "alvaro_bancar" },
        { texto: "Decirle que es un pesado",              ir: "alvaro_pesado" },
      ]
    },
  ],

  alvaro_chiste_si: [
    { afinidad: { alvaro: 1 } },
    { alvaro: "orgulloso", donde: "derecha" },
    { quien: "yo", texto: "Con un tenedor sucio, además." },
    { esperar: 400 },
    { texto: "Álvaro se dio vuelta despacio, como si no pudiera creer lo que acababa de escuchar." },
    { quien: "alvaro", texto: "¡EEEEH!" },
    { quien: "alvaro", texto: "¿Escucharon? ¡El calladito!" },
    { texto: "Me palmeó la espalda tres veces, cada una más fuerte que la anterior." },
    { quien: "yo", texto: "(me está por dislocar algo)" },
    { ir: "recreo_hacia_cafeteria" },
  ],

  alvaro_bancar: [
    { afinidad: { alvaro: 2 } },
    { texto: "La preceptora frenó y lo miró." },
    { alvaro: "triste", donde: "derecha" },
    { texto: "Álvaro recién ahí se dio cuenta. Se le fue la sonrisa de golpe." },
    { quien: "yo", texto: "Estábamos hablando de un dibujo animado, señora." },
    { esperar: 600 },
    { texto: "Mentira flagrante. Pero la dije tranquilo, mirándola, que es la única forma de que una mentira funcione." },
    { texto: "La preceptora nos miró tres segundos más y siguió." },
    { esperar: 500 },
    { alvaro: "normal" },
    { quien: "alvaro", texto: "..." },
    { quien: "alvaro", texto: "Che." },
    { quien: "yo", texto: "Qué." },
    { alvaro: "orgulloso" },
    { quien: "alvaro", texto: "Sos de los míos, vos." },
    { esperar: 400 },
    { texto: "No sé si quiero ser de los suyos." },
    { texto: "Pero era la primera vez que alguien me metía en un plural." },
    { ir: "recreo_hacia_cafeteria" },
  ],

  alvaro_pesado: [
    { afinidad: { alvaro: -2 } },
    { quien: "yo", texto: "Sos medio pesado, ¿sabías?" },
    { esperar: 700 },
    { texto: "Salió más seco de lo que lo pensé." },
    { alvaro: "triste", donde: "derecha" },
    { texto: "Se hizo un silencio corto en el banco. De esos que duran poco pero se sienten un rato largo." },
    { esperar: 500 },
    { alvaro: "normal" },
    { quien: "alvaro", texto: "Ja. Sí, me lo dicen." },
    { texto: "Lo dijo con la misma sonrisa de siempre, y ahí me di cuenta de que era la primera vez que se la veía puesta a propósito." },
    { esperar: 600 },
    { quien: "pato", texto: "Uh." },
    { quien: "yo", texto: "¿Qué?" },
    { quien: "pato", texto: "Nada. Recién llegás y ya estás repartiendo." },
    { texto: "Lo dijo sin mover la cara. No supe si me estaba cargando o avisando." },
    { ir: "recreo_hacia_cafeteria" },
  ],

  /* ---------- Camino a la cafetería ---------- */
  recreo_hacia_cafeteria: [
    { alvaro: null, franco: null },
    { esperar: 400 },
    { quien: "mauri", texto: "Che, ¿vamos yendo? Si llegamos tarde no queda nada." },
    { quien: "franco", texto: "Mauri tiene hambre. Mauri siempre tiene hambre." },
    { quien: "mauri", texto: "Mauri desayunó a las seis." },
    { esperar: 400 },
    { texto: "Se levantaron todos juntos, sin ponerse de acuerdo, como se levanta la gente que hace esto todos los días." },
    { texto: "Yo me levanté medio segundo tarde. Se nota, esa clase de cosas." },
    { ir: "cafeteria_llegada" },
  ],

  /* ---------- La cafetería ---------- */
  cafeteria_llegada: [
    { fondo: "cafeteria" },
    { texto: "La cafetería es lo único del colegio que parece de este siglo." },
    { texto: "Luces blancas, mesas largas, y un cartel arriba del mostrador que dice HOY ES UN BUEN DÍA PARA TENER UN GRAN DÍA." },
    { esperar: 400 },
    { texto: "Nunca entendí ese cartel. Sigo sin entenderlo." },
    { esperar: 500 },

    { texto: "Los cinco se acomodaron en la mesa del fondo con la naturalidad de quien tiene una mesa." },
    { texto: "Y en la de al lado, sola, con los auriculares puestos y un libro dado vuelta sobre la mesa, había alguien." },
    { esperar: 600 },

    { iara: "normal", donde: "izquierda" },
    { texto: "Anteojos, campera del instituto, el pelo largo tapándole media cara." },
    { texto: "La había visto mil veces sin verla nunca, que a esta altura del día ya es un patrón." },
    { esperar: 400 },
    { quien: "aiko", texto: "Iara, corré la mochila." },
    { texto: "Iara corrió la mochila sin levantar la vista del teléfono." },
    { esperar: 500 },

    { aiko: "normal-feliz", donde: "derecha" },
    { quien: "aiko", texto: "{nombre}, ella es Iara. Va con nosotros pero nunca viene a nada." },
    { iara: "pensando" },
    { quien: "iara", texto: "Vengo a esto." },
    { quien: "aiko", texto: "Esto es sentarse a comer." },
    { quien: "iara", texto: "Es algo." },
    { esperar: 500 },
    { texto: "Recién ahí levantó la cabeza y me miró." },
    { iara: "normal" },
    { quien: "iara", texto: "Vos sos el de la ventana." },
    { quien: "yo", texto: "Ese." },
    { quien: "iara", texto: "Escribís algo en un cuaderno cuando pensás que nadie te ve." },
    { esperar: 700 },
    { texto: "No escribo nada. Hago cuentas." },
    { texto: "Pero eso no se explica sin quedar peor, así que no dije nada." },
    { iara: "pensando" },
    { quien: "iara", texto: "Bueno. Algo escribís." },
    { ir: "cafeteria_pato" },
  ],

  /* ---------- Pato y las fotos ---------- */
  cafeteria_pato: [
    { esperar: 400 },
    { iara: null, pato: "pensando", donde: "izquierda" },
    { texto: "Pato no se sentó. Estaba parado contra el ventanal con el teléfono levantado, buscando algo que yo no veía." },
    { esperar: 500 },
    { texto: "Sacó tres fotos seguidas al mismo lugar: la planta del rincón, con el sol atravesándole las hojas." },
    { texto: "Después se quedó mirando la pantalla con cara de que ninguna de las tres había salido." },
    { esperar: 600 },

    {
      opciones: [
        { texto: "Decirle que la última salió buena", ir: "pato_elogio" },
        { texto: "Preguntarle qué está buscando",     ir: "pato_pregunta" },
        { texto: "No decir nada",                     ir: "pato_nada" },
      ]
    },
  ],

  pato_elogio: [
    { afinidad: { pato: 1 } },
    { pato: "pensando", donde: "izquierda" },
    { quien: "yo", texto: "La última salió buena." },
    { esperar: 500 },
    { texto: "Bajó el teléfono y me miró como si le hubiera hablado en otro idioma." },
    { quien: "pato", texto: "¿Vos viste cuál era la última?" },
    { quien: "yo", texto: "La que sacaste más abajo. Se te metió el reflejo del vidrio y quedó como dos plantas." },
    { esperar: 700 },
    { pato: "orgulloso" },
    { texto: "Se quedó callado un segundo largo." },
    { quien: "pato", texto: "Era lo que estaba buscando." },
    { quien: "pato", texto: "Nadie se da cuenta de eso." },
    { esperar: 400 },
    { texto: "Volvió a la mesa y se sentó enfrente mío, que hasta ese momento estaba vacío." },
    { texto: "No dijo nada más. Pero se sentó enfrente." },
    { ir: "cafeteria_dulce" },
  ],

  pato_pregunta: [
    { afinidad: { pato: 2 } },
    { pato: "pensando", donde: "izquierda" },
    { quien: "yo", texto: "¿Qué buscás?" },
    { quien: "pato", texto: "La luz." },
    { quien: "yo", texto: "...la luz está ahí." },
    { pato: "normal" },
    { quien: "pato", texto: "La luz está siempre. Lo difícil es que se note que está." },
    { esperar: 600 },
    { texto: "Lo dijo con el mismo tono con el que dice todo, así que no supe si era en serio o me estaba cargando." },
    { texto: "Después me di cuenta de que con él probablemente sean las dos cosas al mismo tiempo." },
    { ir: "cafeteria_dulce" },
  ],

  pato_nada: [
    { texto: "No dije nada." },
    { texto: "Guardó el teléfono, se sentó en la punta de la mesa y no volvió a sacarlo." },
    { esperar: 600 },
    { texto: "Y estuve como diez minutos pensando que tendría que haber dicho algo, que es mi forma habitual de participar de las cosas." },
    { ir: "cafeteria_dulce" },
  ],

  /* ---------- El alfajor ---------- */
  cafeteria_dulce: [
    { pato: null },
    { esperar: 400 },
    { texto: "Me compré un alfajor porque era lo único que me alcanzaba, y me lo quedé mirando un rato sin abrirlo." },
    { esperar: 500 },
    { aiko: "normal-feliz", donde: "derecha" },
    { quien: "aiko", texto: "Uh. De los negros." },
    { texto: "Lo dijo sin pedirlo, que es una forma bastante eficiente de pedir algo." },
    { esperar: 400 },
    { iara: "pensando", donde: "izquierda" },
    { texto: "Iara ni levantó la vista, pero apoyó el teléfono boca abajo, que en ella parece ser la forma de prestar atención." },
    { esperar: 600 },

    {
      opciones: [
        { texto: "Partirlo con Aiko",        ir: "dulce_aiko" },
        { texto: "Convidarle a Iara",        ir: "dulce_iara" },
        { texto: "Ponerlo en el medio de la mesa", ir: "dulce_mesa" },
      ]
    },
  ],

  dulce_aiko: [
    { afinidad: { aiko: 1 } },
    { aiko: "normal-feliz", donde: "derecha" },
    { texto: "Lo partí al medio y le di la mitad más grande, porque partir al medio nunca sale al medio." },
    { quien: "aiko", texto: "Ah, mirá vos. Sos de los que dan la parte grande." },
    { quien: "yo", texto: "Salió así." },
    { aiko: "pensando-feliz" },
    { quien: "aiko", texto: "No salió así. La elegiste." },
    { esperar: 700 },
    { texto: "Tenía razón otra vez. Me está empezando a molestar un poco." },
    { ir: "cafeteria_manga" },
  ],

  dulce_iara: [
    { iara: "normal", donde: "izquierda" },
    { quien: "yo", texto: "¿Querés?" },
    { esperar: 500 },
    { texto: "Levantó la vista. Miró el alfajor. Me miró a mí." },
    { iara: "pensando" },
    { quien: "iara", texto: "No puedo. Soy diabética." },
    { esperar: 600 },
    { quien: "yo", texto: "Uh. Perdón, no sabía." },
    { iara: "normal" },
    { quien: "iara", texto: "Obvio que no sabías. Nos conocimos hace cuatro minutos." },
    { esperar: 400 },
    { quien: "iara", texto: "Igual gracias. Casi nadie pregunta, directamente comen adelante mío." },
    { esperar: 500 },
    { texto: "Volvió al teléfono. Pero antes de volver, hizo un gesto con la cabeza. Cortito." },
    { texto: "Anoté eso: Iara, diabética. Y lo anoté en serio, porque no soy de olvidarme de los datos." },
    { ir: "cafeteria_manga" },
  ],

  dulce_mesa: [
    { texto: "Lo abrí y lo dejé en el medio de la mesa, sin decir nada." },
    { esperar: 400 },
    { quien: "franco", texto: "¡Comunismo!" },
    { texto: "Franco se llevó la mitad en un movimiento." },
    { aiko: "normal-triste", donde: "derecha" },
    { quien: "aiko", texto: "Che, yo lo pedí primero." },
    { quien: "franco", texto: "Vos no pediste, insinuaste. Es distinto." },
    { esperar: 600 },
    { texto: "Aiko me miró como esperando que yo hiciera algo al respecto." },
    { texto: "No hice nada al respecto, que es mi especialidad." },
    { ir: "cafeteria_manga" },
  ],

  /* ---------- La charla de manga, y Mauri ---------- */
  cafeteria_manga: [
    { aiko: null },
    { esperar: 400 },
    { iara: "pensando", donde: "izquierda" },
    { texto: "En algún momento Iara giró el libro que tenía dado vuelta sobre la mesa." },
    { texto: "No era un libro. Era un tomo, y por la tapa lo reconocí antes de poder frenarme." },
    { esperar: 500 },
    { quien: "iara", texto: "¿Lo leíste?" },
    { esperar: 600 },

    { texto: "Y acá viene la parte donde normalmente digo que no." },
    { texto: "Digo que no a todo, por reflejo, para que la conversación termine antes de tener que sostenerla." },
    { esperar: 500 },

    {
      opciones: [
        { texto: "Decirle la verdad: lo leíste entero dos veces", ir: "manga_verdad" },
        { texto: "Decirle que no, por reflejo",                   ir: "manga_no" },
      ]
    },
  ],

  manga_verdad: [
    { recordar: "hablaste_de_manga" },
    { afinidad: { iara: 2 } },
    { iara: "normal", donde: "izquierda" },
    { quien: "yo", texto: "Dos veces." },
    { esperar: 400 },
    { quien: "yo", texto: "La segunda para entender el final, que la primera vez no me cerró." },
    { esperar: 600 },
    { texto: "Iara se sacó un auricular." },
    { texto: "No sé por qué, pero eso me pareció importante." },
    { iara: "orgullosa" },
    { quien: "iara", texto: "A mí tampoco me cerró." },
    { quien: "iara", texto: "Estuve dos semanas leyendo teorías de gente que tampoco entendió nada." },
    { esperar: 400 },
    { quien: "yo", texto: "¿Y encontraste alguna que sirva?" },
    { iara: "pensando" },
    { quien: "iara", texto: "Una. Pero es tan triste que preferiría no haberla leído." },
    { esperar: 700 },
    { quien: "yo", texto: "Contámela igual." },
    { iara: "normal" },
    { quien: "iara", texto: "Ah, sos de esos." },
    { texto: "Y me la contó. Y era tan triste como dijo." },
    { ir: "cafeteria_mauri" },
  ],

  manga_no: [
    { quien: "yo", texto: "No, ni idea." },
    { esperar: 700 },
    { texto: "Mentira. Lo leí entero dos veces." },
    { texto: "La segunda para entender el final, que la primera vez no me cerró." },
    { esperar: 500 },
    { iara: "pensando", donde: "izquierda" },
    { texto: "Iara se quedó mirándome un segundo más de lo que dura una mirada normal." },
    { esperar: 600 },
    { quien: "iara", texto: "Mmm." },
    { quien: "iara", texto: "Bueno." },
    { afinidad: { iara: -2 } },
    { esperar: 500 },
    { texto: "Volvió al teléfono y no me habló más en todo el recreo." },
    { esperar: 400 },
    { texto: "Y no sé cómo se dio cuenta. Pero se dio cuenta." },
    { ir: "cafeteria_mauri" },
  ],

  /* ---------- Mauri, que no se acerca solo ---------- */
  cafeteria_mauri: [
    { iara: null },
    { esperar: 500 },
    { texto: "Del otro lado de la mesa, Mauri no estaba en la conversación." },
    { mauri: "pensando", donde: "derecha" },
    { texto: "Tenía el teléfono apoyado contra el vaso y leía con la cabeza medio agachada, moviendo los labios sin darse cuenta." },
    { esperar: 500 },

    { si: "hablaste_de_manga", texto: "Desde donde estaba yo se veía la pantalla. Era el mismo tomo del que veníamos hablando." },
    { sino: "hablaste_de_manga", texto: "Desde donde estaba yo se veía la pantalla. Era un manga, aunque no llegué a ver cuál." },
    { esperar: 400 },

    { texto: "En todo el recreo no dijo tres frases seguidas, y ninguna me la dijo a mí." },
    { texto: "No por antipático. Se le nota que no es por antipático." },
    { esperar: 600 },
    { texto: "Es de los que esperan que vayas vos." },
    { texto: "Cosa que yo entiendo bastante bien, porque es exactamente lo que hago." },
    { esperar: 500 },

    {
      opciones: [
        { texto: "Preguntarle en qué tomo va", ir: "mauri_charla" },
        { texto: "Dejarlo tranquilo",          ir: "mauri_nada" },
      ]
    },
  ],

  mauri_charla: [
    { afinidad: { mauri: 2 } },
    { mauri: "pensando", donde: "derecha" },
    { quien: "yo", texto: "¿En qué tomo vas?" },
    { esperar: 600 },
    { texto: "Levantó la cabeza de golpe, como si lo hubiera despertado." },
    { mauri: "normal" },
    { quien: "mauri", texto: "¿Eh? Ah. Doce." },
    { quien: "yo", texto: "Uf. Estás justo antes de la parte." },
    { esperar: 500 },
    { mauri: "orgulloso" },
    { quien: "mauri", texto: "¿QUÉ PARTE?" },
    { quien: "yo", texto: "Si te digo cuál, te la arruino." },
    { quien: "mauri", texto: "¡Decime cuál!" },
    { quien: "yo", texto: "No." },
    { esperar: 400 },
    { texto: "Se quedó un rato largo mirándome con el teléfono en la mano, tratando de decidir si eso lo hacía enojar o no." },
    { mauri: "normal" },
    { quien: "mauri", texto: "...bueno." },
    { quien: "mauri", texto: "Pero después me decís si tenía razón." },
    { esperar: 500 },
    { texto: "Y volvió a leer, pero esta vez más rápido." },
    { texto: "De reojo lo vi levantar la vista dos veces para ver si yo seguía ahí." },
    { ir: "fin_recreo" },
  ],

  mauri_nada: [
    { texto: "Lo dejé tranquilo." },
    { texto: "Es lo que a mí me gustaría que hicieran conmigo, así que me pareció lo correcto." },
    { esperar: 600 },
    { mauri: "normal", donde: "derecha" },
    { texto: "Terminó el recreo y no cruzamos una palabra." },
    { esperar: 400 },
    { texto: "Y recién cuando nos levantamos me di cuenta de una cosa incómoda." },
    { texto: "Que a mí me gustaría que me dejaran tranquilo, sí." },
    { texto: "Pero esta mañana alguien no me dejó tranquilo en el andén, y por eso estoy sentado en esta mesa." },
    { ir: "fin_recreo" },
  ],

  /* ---------- Se termina el recreo ---------- */
  fin_recreo: [
    { mauri: null },
    { esperar: 500 },
    { texto: "El timbre de la cafetería no es el mismo que el de las aulas. Es más corto, casi educado." },
    { texto: "Se levantaron todos juntos otra vez." },
    { esperar: 400 },
    { texto: "Esta vez me levanté con ellos." },
    { esperar: 600 },

    /* Cómo te va yendo con cada uno, sin decir ningún número. */
    { siAfinidad: "alvaro", min: 2, alvaro: "orgulloso", donde: "izquierda" },
    { siAfinidad: "alvaro", min: 2, quien: "alvaro", texto: "Mañana te sentás acá de una, ¿estamos?" },
    { siAfinidad: "alvaro", min: 2, quien: "yo", texto: "...estamos." },
    { siAfinidad: "alvaro", min: 2, alvaro: null },
    { siAfinidad: "alvaro", max: -1, texto: "Álvaro salió primero y no esperó a nadie. No hacía falta que dijera nada." },

    { siAfinidad: "pato", min: 2, pato: "normal", donde: "izquierda" },
    { siAfinidad: "pato", min: 2, texto: "Pato me pasó el teléfono con la foto de la planta abierta en la pantalla, sin decir nada, y esperó." },
    { siAfinidad: "pato", min: 2, quien: "yo", texto: "Esa es la buena." },
    { siAfinidad: "pato", min: 2, quien: "pato", texto: "Ya sé." },
    { siAfinidad: "pato", min: 2, pato: null },

    { siAfinidad: "iara", min: 2, iara: "normal", donde: "derecha" },
    { siAfinidad: "iara", min: 2, quien: "iara", texto: "Ey. Cuando termines el catorce me avisás." },
    { siAfinidad: "iara", min: 2, quien: "yo", texto: "No empecé el catorce." },
    { siAfinidad: "iara", min: 2, quien: "iara", texto: "Empezalo." },
    { siAfinidad: "iara", min: 2, iara: null },
    { siAfinidad: "iara", max: -1, texto: "Iara se fue con los auriculares puestos. Ni me miró." },
    { siAfinidad: "iara", max: -1, texto: "Y lo peor no era eso. Lo peor era saber exactamente por qué." },

    { siAfinidad: "mauri", min: 2, mauri: "normal", donde: "derecha" },
    { siAfinidad: "mauri", min: 2, quien: "mauri", texto: "Che, {nombre}." },
    { siAfinidad: "mauri", min: 2, quien: "mauri", texto: "Era la parte del hermano, ¿no?" },
    { siAfinidad: "mauri", min: 2, quien: "yo", texto: "Terminá el tomo, Mauri." },
    { siAfinidad: "mauri", min: 2, mauri: null },
    { esperar: 700 },

    { fondo: "patio-colegio" },
    { texto: "Cruzamos el patio en fila para el lado de las escaleras." },
    { esperar: 400 },

    { si: "aceptaste_invitacion", aiko: "normal-feliz", donde: "derecha" },
    { si: "aceptaste_invitacion", quien: "aiko", texto: "No te olvides de mañana." },
    { si: "aceptaste_invitacion", quien: "yo", texto: "No me voy a olvidar." },
    { si: "aceptaste_invitacion", texto: "Y era verdad. Iba a estar contando las horas, que es lo mío." },

    { si: "rechazaste_invitacion", aiko: "pensando-feliz", donde: "derecha" },
    { si: "rechazaste_invitacion", quien: "aiko", texto: "Che." },
    { si: "rechazaste_invitacion", quien: "aiko", texto: "Lo de recién en la mesa, cuando no dijiste nada." },
    { si: "rechazaste_invitacion", quien: "yo", texto: "¿Qué?" },
    { si: "rechazaste_invitacion", quien: "aiko", texto: "Nada. Después te digo." },
    { si: "rechazaste_invitacion", texto: "Me robó la frase. Y encima le quedaba mejor que a mí." },
    { esperar: 600 },

    { aiko: null },
    { texto: "Subimos las escaleras." },
    { texto: "Y en el descanso del primer piso hice la cuenta, porque no puedo evitarlo." },
    { esperar: 500 },
    { texto: "Doce horas atrás estaba mirando el techo de mi cuarto pensando que hoy iba a ser exactamente igual a ayer." },
    { esperar: 700 },
    { texto: "Me equivoqué por bastante." },
    { ir: "por_escribir" },
  ],

  /* ---------- Hasta acá está escrito ---------- */
  por_escribir: [
    { esperar: 800 },
    { fondo: "amanecer" },
    { esperar: 600 },
    { texto: "CONTINUARÁ" },

    { si: "aceptaste_invitacion",  texto: "Mañana vas a la casa de Aiko." },
    { si: "rechazaste_invitacion", texto: "Mañana la ves en el recreo largo. Ella insistió; vos todavía no dijiste nada." },

    /* Cómo quedó la cosa con cada uno, sin decir ningún número. */
    { siAfinidad: "alvaro", min: 2, texto: "Álvaro te guardó un lugar en el cantero." },
    { siAfinidad: "alvaro", max: -1, texto: "Con Álvaro empezaste torcido." },
    { siAfinidad: "pato",   min: 2, texto: "Pato te mostró una foto. Eso, en él, es mucho." },
    { siAfinidad: "iara",   min: 2, texto: "Iara te dejó tarea: el tomo catorce." },
    { siAfinidad: "iara",   max: -1, texto: "Iara se dio cuenta de que le mentiste. No lo dijo, pero se dio cuenta." },
    { siAfinidad: "mauri",  min: 2, texto: "Mauri te va a buscar mañana para preguntarte por el final." },
    { siAfinidad: "mauri",  max: 0,  texto: "Mauri sigue esperando que alguien se le acerque." },

    { texto: "Seguí escribiendo desde acá en js/historia.js.\n\nMirá RELACIONES.md para la afinidad." },
    { fin: true },
  ],
};
