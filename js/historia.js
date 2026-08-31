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
      "enojo-seria", "pantie-normal-enojada", "pantie-normal-feliz", 
      "pantie-pensando-feliz", "pantie-pensando-avergonzada",
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

  /* El hermano menor de Aiko. No tiene sprites: funciona igual, solo con voz. */
  sora: {
    nombre: "Sora", color: "#ffe08a", oculto: true,
    carpeta: "assets/img/personajes/sora/",
    poses: ["normal", "feliz", "pensando", "enojado", "triste", "orgulloso",
            "sorprendido", "asustado", "timido", "cansado", "aburrido",
            "confundido", "determinado"],
    retrato: "feliz",
    perfil: "El hermano de Aiko, once años. Anuncia todo lo que pasa en la casa " +
            "a un volumen que no admite discusión. No tiene filtro y no lo va a " +
            "tener nunca, y en el fondo eso es lo mejor que tiene.",
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
  entrada:     "assets/img/escuela/entrada.jpg",
  patio:       "assets/img/escuela/patio-formacion.jpg",
  aula:        "assets/img/escuela/aula.jpeg",
  computacion: "assets/img/escuela/computacion.webp",

  // Ilustrados, del mismo estilo que los personajes.
  habitacion:      "assets/img/habitacion-mc.png",   // el cuarto del protagonista
  "patio-colegio": "assets/img/escuela/patio-colegio.png",
  cafeteria:       "assets/img/cafeteria.png",

  // La casa de Aiko.
  "sala-aiko":   "assets/img/casa-aiko/sala-estar-aiko.png",
  "cuarto-aiko": "assets/img/casa-aiko/dormitorio-aiko.png",
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
    { fondo: "habitacion", musica: "ohayou" },

    { texto: "El despertador sonó a las seis y diez, como todos los días." },
    { texto: "Y como todos los días lo apagué antes del segundo pitido y me quedé mirando el techo un rato más." },
    { texto: "No porque tuviera sueño. Ya no. Es que el techo es la única cosa que no me pide nada." },
    { esperar: 600 },

    {fondo: "amanecer"},
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
    { afinidad: { aiko: 2 } },
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
    { afinidad: { aiko: -1 } },
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
    { afinidad: { alvaro: 2 } },
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
    { afinidad: { alvaro: 1 } },
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
    /* Si aceptaste la invitación, la historia sigue en el DÍA 2. */
    { si: "aceptaste_invitacion", ir: "dia2_despertar" },
    /* Y si la rechazaste, el trabajo se hace en el recreo largo. */
    { si: "rechazaste_invitacion", ir: "d2r_despertar" },

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
  /* =========================================================
     DÍA 2 — LA CASA DE AIKO
     Solo se juega si aceptaste la invitación.
     despertar -> colegio -> salida -> panadería -> subte -> Zavaleta -> la casa
     Acá la afinidad con Aiko puede llegar arriba de todo: mirá RELACIONES.md.
     ========================================================= */

  /* ---------- 1. El despertador que no hizo falta ---------- */
  dia2_despertar: [
    { fondo: "habitacion", musica: "ohayou" },
    { esperar: 600 },

    { texto: "Me desperté a las cinco y cuarenta." },
    { texto: "Cincuenta minutos antes del despertador, sin ningún motivo, con los ojos abiertos de golpe como si alguien me hubiera llamado." },
    { esperar: 500 },
    { texto: "Me quedé quieto esperando volver a dormirme." },
    { texto: "No me dormí." },
    { esperar: 700 },

    { texto: "Lo que pasó fue que empecé a hacer la cuenta." },
    { texto: "Once horas hasta la salida del colegio. Once, otra vez el once, que a esta altura ya me parece una joda personal del universo." },
    { esperar: 400 },
    { texto: "Y de ahí, veintidós minutos de subte hasta Zavaleta. Los conté una vez, hace meses, sin saber para qué me iban a servir." },
    { esperar: 600 },

    { texto: "Después vino la otra parte, que es la que hago mejor." },
    { texto: "La lista de todo lo que podía salir mal." },
    { esperar: 400 },
    { texto: "Le llegué a doce ítems antes de que sonara el despertador." },
    { texto: "Doce en cincuenta minutos. Ese sí que es un buen ritmo." },
    { esperar: 700 },

    { texto: "Y en el medio de la lista me acordé del mensaje de Franco." },
    { texto: "Facturas. Los Moyano." },
    { esperar: 500 },
    { texto: "El teléfono seguía ahí, sobre la mesa de luz, con la conversación de Aiko abierta desde ayer y sin una sola línea escrita de mi lado." },
    { esperar: 400 },
    { texto: "Ella me pasó la ubicación anoche a las nueve. Yo le puse un pulgar arriba." },
    { texto: "Un pulgar. Como un tío contestando un cumpleaños." },
    { esperar: 700 },

    {
      opciones: [
        { texto: "Escribirle algo ahora", ir: "dia2_mensaje_si" },
        { texto: "Dejarlo para cuando la vea", ir: "dia2_mensaje_no" },
      ]
    },
  ],

  dia2_mensaje_si: [
    { recordar: "le_escribiste" },
    { afinidad: { aiko: 2 } },
    { texto: "Escribí: buen día. Lo borré." },
    { texto: "Escribí: che, ¿sigue en pie lo de hoy? Lo borré, porque eso es preguntarle si se arrepintió." },
    { esperar: 500 },
    { texto: "Escribí: estoy despierto desde las seis menos veinte por tu culpa." },
    { esperar: 700 },
    { texto: "Ese lo mandé." },
    { texto: "Y me quedé mirando el techo con el teléfono en el pecho, arrepintiéndome durante los cuatro minutos más largos de mi vida." },
    { esperar: 600 },

    { texto: "Contestó a los cuatro minutos y dos segundos." },
    { esperar: 400 },
    { texto: "Aiko: jajaja bien ahí" },
    { texto: "Aiko: yo estoy despierta desde las cinco así que perdiste" },
    { esperar: 500 },
    { texto: "Aiko: nos vemos a la salida, no te me escapes" },
    { esperar: 700 },

    { texto: "La leí ocho veces. Ocho." },
    { texto: "Después me levanté de un salto, que es algo que no hago." },
    { ir: "dia2_colegio" },
  ],

  dia2_mensaje_no: [
    { texto: "Dejé el teléfono boca abajo." },
    { texto: "Total la iba a ver en cuatro horas, y no hay nada que decir que no se pueda decir en persona." },
    { esperar: 600 },
    { texto: "Eso es lo que me dije." },
    { texto: "Lo que hice, en realidad, fue no escribirle porque no supe cómo empezar la frase." },
    { esperar: 500 },
    { texto: "Y esas dos cosas se parecen bastante desde afuera, pero desde adentro no se parecen en nada." },
    { ir: "dia2_colegio" },
  ],

  /* ---------- 2. El día más largo del año ---------- */
  dia2_colegio: [
    { fondo: "aula", musica: "alegre" },
    { esperar: 500 },
    { texto: "El día pasó como pasan los días cuando esperás algo: en cámara lenta y de golpe, las dos cosas al mismo tiempo." },
    { esperar: 400 },
    { texto: "Historia, matemática, un módulo de laboratorio en el que rompí una pipeta." },
    { texto: "No me acuerdo de nada más y eso que fue hoy." },
    { esperar: 600 },

    { si: "le_escribiste", aiko: "pensando-feliz", donde: "derecha" },
    { si: "le_escribiste", texto: "Aiko no me dijo nada del mensaje en toda la mañana." },
    { si: "le_escribiste", texto: "Pero cada vez que la miraba, ella ya me estaba mirando, y eso pasó tres veces." },
    { si: "le_escribiste", quien: "aiko", texto: "Dejá de contar." },
    { si: "le_escribiste", quien: "yo", texto: "No estoy contando nada." },
    { si: "le_escribiste", aiko: "normal-feliz" },
    { si: "le_escribiste", quien: "aiko", texto: "Tres, {nombre}. Van tres." },
    { si: "le_escribiste", aiko: null },

    { sino: "le_escribiste", aiko: "normal-feliz", donde: "derecha" },
    { sino: "le_escribiste", texto: "Aiko entró tarde, se sentó adelante y no dio vuelta la cabeza ni una vez." },
    { sino: "le_escribiste", texto: "Y yo estuve toda la mañana buscándole un significado a una nuca." },
    { sino: "le_escribiste", aiko: null },
    { esperar: 600 },

    /* Cómo te trata el grupo hoy depende de cómo te portaste ayer. */
    { siAfinidad: "alvaro", min: 2, alvaro: "orgulloso", donde: "izquierda" },
    { siAfinidad: "alvaro", min: 2, quien: "alvaro", texto: "¡Acá wachin! Te guardé el lugar." },
    { siAfinidad: "alvaro", min: 2, texto: "Tenía la mochila puesta en la silla de al lado desde antes de que yo entrara." },
    { siAfinidad: "alvaro", min: 2, alvaro: null },
    { siAfinidad: "alvaro", max: -1, texto: "Álvaro contó un chiste largo mirando para el otro lado, con esa precisión que tiene la gente para no mirarte." },

    { siAfinidad: "iara", min: 2, iara: "pensando", donde: "izquierda" },
    { siAfinidad: "iara", min: 2, quien: "iara", texto: "Tomo catorce." },
    { siAfinidad: "iara", min: 2, quien: "yo", texto: "Todavía no." },
    { siAfinidad: "iara", min: 2, quien: "iara", texto: "Te doy hasta el viernes." },
    { siAfinidad: "iara", min: 2, iara: null },
    { siAfinidad: "iara", max: -1, texto: "Iara me pasó por al lado en el pasillo y no fue que no me saludó. Fue que se acordaba perfectamente de por qué no me saludaba." },

    { siAfinidad: "pato", min: 3, pato: "normal", donde: "izquierda" },
    { siAfinidad: "pato", min: 3, texto: "Pato me mandó una foto sin ningún texto: la ventana del aula a contraluz, con el polvo flotando." },
    { siAfinidad: "pato", min: 3, quien: "yo", texto: "Esa es mejor que la de la planta." },
    { siAfinidad: "pato", min: 3, quien: "pato", texto: "Obvio que es mejor. Por eso te la mandé a vos." },
    { siAfinidad: "pato", min: 3, pato: null },

    { siAfinidad: "mauri", min: 2, mauri: "orgulloso", donde: "izquierda" },
    { siAfinidad: "mauri", min: 2, quien: "mauri", texto: "TENÍAS RAZÓN." },
    { siAfinidad: "mauri", min: 2, quien: "yo", texto: "Te dije." },
    { siAfinidad: "mauri", min: 2, quien: "mauri", texto: "Terminé el doce a las dos de la mañana y estoy destruido y es tu culpa." },
    { siAfinidad: "mauri", min: 2, mauri: null },
    { esperar: 600 },

    { texto: "A las tres menos diez, el timbre." },
    { texto: "Y por primera vez en un año y medio no fui el último en levantarme." },
    { ir: "dia2_salida" },
  ],

  /* ---------- 3. La salida, y la panadería ---------- */
  dia2_salida: [
    { fondo: "entrada" },
    { esperar: 500 },
    { texto: "Me esperó en el portón, apoyada contra la reja, con la mochila colgando de una mano." },
    { aiko: "normal-feliz", donde: "derecha" },
    { quien: "aiko", texto: "Bueno. Vamos." },
    { quien: "yo", texto: "Vamos." },
    { esperar: 400 },
    { texto: "Y arrancamos a caminar los dos juntos para el lado de la estación, como si eso fuera una cosa normal que hacemos." },
    { esperar: 600 },

    { franco: "orgulloso", donde: "izquierda" },
    { quien: "franco", texto: "¡EEEH!" },
    { aiko: "normal-enojada" },
    { quien: "aiko", texto: "Franco." },
    { franco: "normal" },
    { quien: "franco", texto: "Yo no dije nada. Saludé." },
    { esperar: 400 },
    { texto: "Me hizo un gesto con la cabeza que era claramente sobre las facturas." },
    { texto: "Un gesto tan poco disimulado que técnicamente era un cartel." },
    { franco: null },
    { esperar: 600 },

    { fondo: "camino-al-subte", aiko: null },
    { texto: "A media cuadra de la estación está la panadería de los Moyano." },
    { texto: "Lleva cuarenta años ahí y tiene la vidriera empañada desde 1998." },
    { esperar: 500 },
    { texto: "Aiko pasó por adelante sin frenar y sin mirarla, hablando de otra cosa." },
    { esperar: 400 },
    { texto: "Yo tenía doce mil pesos y once metros para decidir." },

    {
      opciones: [
        { texto: "Frenar y comprar facturas", ir: "panaderia_si" },
        { texto: "Seguir de largo", ir: "panaderia_no" },
      ]
    },
  ],

  panaderia_si: [
    { recordar: "llevaste_facturas" },
    { afinidad: { aiko: 3 } },
    { quien: "yo", texto: "Pará un segundo." },
    { esperar: 500 },
    { aiko: "pensando-feliz", donde: "derecha" },
    { quien: "aiko", texto: "¿Qué hacés?" },
    { quien: "yo", texto: "Nada. Ya vengo." },
    { esperar: 600 },

    { texto: "Salí con media docena en una bolsa de papel que empezó a mancharse de grasa antes de llegar a la esquina." },
    { esperar: 400 },
    { texto: "Ella miró la bolsa. Después me miró a mí. Después otra vez la bolsa." },
    { aiko: "normal-feliz" },
    { quien: "aiko", texto: "¿Vos sabés que estas son mis favoritas?" },
    { esperar: 700 },

    { quien: "yo", texto: "...no." },
    { texto: "Mentira parcial. Lo sabía hace catorce horas." },
    { esperar: 500 },
    { aiko: "pensando-avergonzada" },
    { quien: "aiko", texto: "Mentiroso." },
    { quien: "aiko", texto: "Te lo dijo Franco." },
    { quien: "yo", texto: "...sí." },
    { esperar: 400 },
    { aiko: "normal-feliz" },
    { quien: "aiko", texto: "Bueno, igual las compraste vos." },
    { texto: "Y me sacó la bolsa de la mano para llevarla ella, que fue una forma de terminar la discusión." },
    { ir: "dia2_vagon" },
  ],

  panaderia_no: [
    { texto: "Seguí de largo." },
    { texto: "Mil doscientos pesos y una idea bastante clara de lo ridículo que es aparecer con facturas como si fuera un tío en Navidad." },
    { esperar: 600 },
    { texto: "A las tres cuadras me di cuenta de que eso no era lo que me había frenado." },
    { texto: "Lo que me frenó fue tener que explicar por qué las compré." },
    { esperar: 500 },
    { texto: "Que es distinto, y es peor." },
    { ir: "dia2_vagon" },
  ],

  /* ---------- 4. El vagón, en sentido contrario ---------- */
  dia2_vagon: [
    { fondo: "vagon-subte" },
    { esperar: 500 },
    { texto: "El subte de las tres y media va vacío para este lado." },
    { texto: "Nos sentamos en el banco largo del fondo, contra la ventanilla, y no había nadie más en medio vagón." },
    { esperar: 600 },

    { aiko: "normal-feliz", donde: "derecha" },
    { texto: "Hace un año y medio que hago este viaje. Nunca me había sentado." },
    { texto: "Voy siempre parado contra la puerta, calculando cuántas estaciones faltan." },
    { esperar: 500 },

    { si: "hablaste", texto: "Ayer a la mañana, en el andén, le hablé." },
    { si: "hablaste", texto: "Hoy estoy sentado al lado de ella yendo a su casa. Treinta y un horas." },
    { si: "hablaste", texto: "Hay cosas que tardan una vida y hay cosas que tardan treinta y una horas, y nadie te avisa cuál es cuál." },
    { sino: "hablaste", texto: "Hace treinta y un horas pasé de largo por el andén para no tener que decir buenas." },
    { sino: "hablaste", texto: "Y acá estoy, yendo a su casa, sin haber hecho ni una sola cosa bien en el medio." },
    { sino: "hablaste", texto: "Tengo suerte de poder contar con su entusiasmo y carisma. De lo contrario, estaria volviendo en soledad como de costumbre." },
    { esperar: 700 },

    { aiko: "pensando-feliz" },
    { quien: "aiko", texto: "Che." },
    { quien: "yo", texto: "Qué." },
    { quien: "aiko", texto: "¿Por qué te sentás siempre solo?" },
    { esperar: 900 },

    { texto: "Lo preguntó mirando la ventanilla, no a mí, que es la única forma en que esa pregunta no es una agresión." },
    { texto: "Y se quedó callada esperando, sin llenar el silencio, que es una cosa que casi nadie sabe hacer." },
    { esperar: 600 },

    {
      opciones: [
        { texto: "Decirle la verdad", ir: "vagon_verdad" },
        { texto: "Que te importa, sapa", ir: "vagon_mentira" },
        { texto: "Devolverle la pregunta", ir: "vagon_esquivar" },
      ]
    },
  ],

  vagon_verdad: [
    { recordar: "le_dijiste_la_verdad" },
    { afinidad: { aiko: 2 } },
    { aiko: "pensando-feliz", donde: "derecha" },
    { esperar: 500 },
    { quien: "yo", texto: "Porque si me siento solo, eso me ayuda a sentirme tranquilo." },
    { esperar: 700 },
    { quien: "aiko", texto: "...¿te gusta , la tranquilidad?" },
    { quien: "yo", texto: "Exacto." },
    { esperar: 400 },
    { quien: "yo", texto: "Desde que tengo memoria, lo hago para evitar cualquier conflicto." },
    { quien: "yo", texto: "Es como mi forma de defenderme por asi decirlo" },
    { esperar: 900 },

    { texto: "La dije mirando el piso del vagón." },
    { texto: "Nunca se lo había dicho a nadie, principalmente porque nadie me lo había preguntado sin estar apurado." },
    { esperar: 600 },

    { aiko: "normal-triste" },
    { texto: "Tardó en contestar. Dos estaciones." },
    { quien: "aiko", texto: "Eso es lo más triste que escuché en mi vida." },
    { quien: "yo", texto: "Sí, ya sé, perdón." },
    { aiko: "normal-feliz" },
    { quien: "aiko", texto: "No te disculpes, boludo. No dije que estuviera mal." },
    { esperar: 500 },
    { quien: "aiko", texto: "Dije que era triste. Son cosas distintas." },
    { esperar: 700 },
    { texto: "Y no me dijo nada más hasta Zavaleta." },
    { texto: "Pero en algún momento del túnel apoyó el hombro contra el mío y no lo sacó." },
    { ir: "zavaleta" },
  ],

  vagon_mentira: [
    { recordar: "le_mentiste_a_aiko" },
    { afinidad: { aiko: -2 } },
    { aiko: "pensando-feliz", donde: "derecha" },
    { quien: "yo", texto: "Que te importa, sapa" },
    { esperar: 900 },

    { texto: "Es la respuesta que uso siempre. La tengo gastada de tanto usarla." },
    { texto: "Funciona en el noventa por ciento de los casos porque el noventa por ciento de la gente lo pregunta para pasar el rato." },
    { esperar: 600 },

    { aiko: "normal-triste" },
    { texto: "Ella no dijo nada." },
    { texto: "Se dio vuelta hacia la ventanilla y se quedó mirando el túnel, que no tiene nada para mirar." },
    { esperar: 700 },
    { quien: "aiko", texto: "Dale." },
    { esperar: 400 },
    { texto: "Una palabra. Sin enojo, sin nada." },
    { texto: "Y esa fue la última que dijo hasta Zavaleta." },
    { esperar: 600 },
    { texto: "Tres estaciones para entender que me había preguntado en serio." },
    { texto: "Y que yo le había contestado con una frase de ascensor." },
    { ir: "zavaleta" },
  ],

  vagon_esquivar: [
    { recordar: "le_esquivaste" },
    { aiko: "pensando-feliz", donde: "derecha" },
    { quien: "yo", texto: "¿Y vos por qué preguntás?" },
    { esperar: 700 },
    { texto: "Clásico. Devolver la pelota. Manual del que no quiere hablar de sí mismo, página uno." },
    { esperar: 500 },

    { aiko: "normal-feliz" },
    { quien: "aiko", texto: "Uh, mirá qué vivo." },
    { quien: "aiko", texto: "Pregunto porque te miro hace un año y medio y todavía no entiendo si estás solo porque querés o porque te salió así." },
    { esperar: 900 },
    { quien: "yo", texto: "...¿me mirás hace un año y medio?" },
    { aiko: "pensando-avergonzada" },
    { quien: "aiko", texto: "Ese no era el punto de la frase." },
    { quien: "yo", texto: "Era un poco el punto de la frase." },
    { esperar: 500 },
    { aiko: "normal-enojada" },
    { quien: "aiko", texto: "Callate." },
    { esperar: 600 },
    { texto: "Y se rió, y se tapó la cara con la mano, y me di cuenta de que le había esquivado la pregunta sin querer y de que igual había salido bien." },
    { texto: "Que es la primera vez en mi vida que algo me sale bien por accidente en la dirección correcta." },
    { ir: "zavaleta" },
  ],

  /* ---------- 5. Zavaleta ---------- */
  zavaleta: [
    { aiko: null },
    { fondo: "camino-al-subte" },
    { esperar: 600 },
    { texto: "Zavaleta a las cuatro de la tarde es otra ciudad." },
    { texto: "Casas bajas, un kiosco con la persiana a medio subir, dos pibes pateando contra una pared que ya tiene la mancha marcada." },
    { esperar: 500 },

    { texto: "Bajé en esta estación ciento ochenta veces sin salir nunca de la estación." },
    { texto: "Hago combinación acá. Bajo, camino cuarenta metros por el pasillo, subo al otro andén." },
    { esperar: 400 },
    { texto: "Nunca me había subido las escaleras hasta la calle." },
    { esperar: 700 },

    { aiko: "normal-feliz", donde: "derecha" },
    { quien: "aiko", texto: "Es esa de allá. La de la reja verde." },
    { esperar: 400 },
    { texto: "Caminamos cuatro cuadras y media." },
    { texto: "Las conté, obviamente. Cuatro cuadras y media son unos seiscientos metros, unos ocho minutos a paso normal." },
    { esperar: 500 },
    { texto: "Tardamos diecinueve." },
    { texto: "Y no me di cuenta hasta que llegamos." },
    { ir: "casa_aiko_puerta" },
  ],

  /* ---------- 6. La puerta ---------- */
  casa_aiko_puerta: [
    { fondo: "sala-aiko" },
    { esperar: 500 },
    { texto: "La casa es angosta y larga, de las que tienen el pasillo al costado y el patio atrás." },
    { texto: "En la reja verde hay una calcomanía despegada de un club de barrio y un timbre que no anda desde hace años, según me avisó antes de tocarlo igual." },
    { esperar: 600 },

    { aiko: "pensando-feliz", donde: "derecha" },
    { quien: "aiko", texto: "Che, dos cosas antes de entrar." },
    { quien: "yo", texto: "Bueno." },
    { quien: "aiko", texto: "Una: mi vieja va a preguntar mucho. No te asustes." },
    { quien: "aiko", texto: "Dos: tengo un hermano de once años." },
    { esperar: 400 },
    { quien: "yo", texto: "¿Y eso qué implica?" },
    { aiko: "normal-feliz" },
    { quien: "aiko", texto: "Vas a ver." },
    { esperar: 700 },

    { aiko: null },
    { texto: "Abrió la puerta y lo primero que llegó fue el olor a algo con cebolla, y un televisor puesto fuerte en algún lado del fondo." },
    { esperar: 500 },
    { quien: "sora", texto: "¡MAMÁ, TRAJO A ALGUIEN!" },
    { esperar: 400 },
    { texto: "Una voz desde el fondo de la casa. Enorme, con una capacidad de proyección que no le conocía a un pibe de once años." },
    { esperar: 500 },

    { aiko: "normal-enojada", donde: "derecha" },
    { quien: "aiko", texto: "SORA TE JURO." },
    { esperar: 400 },

    { sora: "feliz", donde: "izquierda" },
    { texto: "Apareció en el pasillo en menos de tres segundos, todavia con su uniforme escolar" },
    { quien: "sora", texto: "¡Y ES UN VARÓN!" },
    { quien: "aiko", texto: "ES UN COMPAÑERO DE LA ESCUELA." },
    { sora: "orgulloso" },
    { quien: "sora", texto: "¡ES UN VARÓN COMPAÑERO DE LA ESCUELA!" },
    { esperar: 400 },
    { texto: "Lo dijo con una precisión que no era inocente." },
    { texto: "A los once ya no se dicen las cosas sin querer. Se dicen sabiendo perfectamente lo que hacen." },
    {texto: "Pendejo de mierda"},
    { esperar: 500 },

    { sora: "timido" },
    { texto: "Me miró de arriba a abajo, evaluándome, y se metió para adentro sin decir nada más." },
    { texto: "Ni idea si aprobé." },
    { sora: null },
    { esperar: 700 },

    { aiko: "pensando-avergonzada" },
    { texto: "Se quedó parada en el pasillo con la mano todavía en el picaporte, mirando fijo un punto de la pared." },
    { quien: "aiko", texto: "Te dije que ibas a ver." },
    { quien: "yo", texto: "Me gustó igual." },
    { esperar: 400 },
    { aiko: "normal-enojada" },
    { quien: "aiko", texto: "No te gustó nada, no seas hipócrita." },
    { quien: "yo", texto: "Me gustó un poco." },
    { esperar: 600 },

    { si: "llevaste_facturas", aiko: "normal-feliz" },
    { si: "llevaste_facturas", texto: "Levantó la bolsa de la panadería como si fuera un trofeo y la mandó para adentro sin mirar." },
    { si: "llevaste_facturas", quien: "aiko", texto: "SORA. FACTURAS. TRAJO ÉL." },
    { si: "llevaste_facturas", sora: "determinado", donde: "izquierda" },
    { si: "llevaste_facturas", quien: "sora", texto: "¡ME CAE BIEN!" },
    { si: "llevaste_facturas", sora: null },
    { si: "llevaste_facturas", texto: "Y así fue como en esta casa me aceptaron antes de verme la cara." },

    { sino: "llevaste_facturas", texto: "Su mamá salió de la cocina, me dio la mano, me preguntó el nombre, de dónde era, en qué andaba mi familia y si había comido." },
    { sino: "llevaste_facturas", texto: "Contesté cuatro de cinco. La de la familia la contesté corta y ella no repreguntó, que le agradecí en silencio." },
    { esperar: 700 },

    { ir: "casa_aiko_cuarto" },
  ],

  /* ---------- 7. El cuarto ---------- */
  casa_aiko_cuarto: [
    { fondo: "cuarto-aiko" },
    { esperar: 600 },
    { texto: "El cuarto es chico y está ordenado de una manera que no esperaba." },
    { texto: "Un escritorio contra la ventana, un estante largo lleno de tomos parados por altura, y una silla sola." },
    { esperar: 500 },
    { texto: "Una silla sola, dije." },
    { esperar: 400 },

    { aiko: "normal-feliz", donde: "derecha" },
    { quien: "aiko", texto: "Sentate vos en la silla." },
    { quien: "yo", texto: "¿Y vos?" },
    { quien: "aiko", texto: "Yo en la cama, que es mi cama." },
    { esperar: 700 },

    { texto: "Abrimos las notebooks y laburamos una hora y cuarenta." },
    { texto: "En serio, eh. Laburamos de verdad." },
    { esperar: 400 },
    { texto: "Ella dictaba y yo tipeaba, igual que ayer, salvo que ayer había veinte máquinas alrededor y un ventilador haciendo ruido." },
    { texto: "Acá lo único que se escuchaba era el televisor del fondo y Sora peleándose con alguien que no existía." },
    { esperar: 600 },

    { aiko: "pensando-feliz" },
    { texto: "A las seis menos veinte terminamos la última tabla y ella cerró la notebook de golpe." },
    { quien: "aiko", texto: "Listo. Entregamos y nos sacamos un diez." },
    { quien: "yo", texto: "Nos sacamos un ocho." },
    { quien: "aiko", texto: "Un nueve." },
    { quien: "yo", texto: "Un ocho, Aiko. Le falta la conclusión." },
    { aiko: "normal-enojada" },
    { quien: "aiko", texto: "LE FALTA LA CONCLUSIÓN, dice." },
    { esperar: 700 },

    { texto: "Y ahí se hizo el silencio raro." },
    { texto: "Ese silencio de cuando se termina la excusa por la que dos personas estaban en la misma habitación." },
    { esperar: 600 },

    { aiko: "pensando-avergonzada" },
    { texto: "Miré el estante para tener algo que mirar." },
    { texto: "Y en la punta, al lado de los tomos, había un portarretratos apoyado boca abajo." },
    { esperar: 500 },
    { texto: "Boca abajo no es un accidente. Boca abajo lo puso alguien." },
    { esperar: 700 },

    { quien: "aiko", texto: "Es mi viejo." },
    { esperar: 400 },
    { quien: "aiko", texto: "No lo doy vuelta porque no quiero verlo todos los días, y no lo guardo porque tampoco quiero eso." },
    { esperar: 600 },
    { aiko: "normal-triste" },
    { quien: "aiko", texto: "Y no lo voy a hablar hoy." },
    { esperar: 900 },

    { texto: "Lo dijo con la voz igual de siempre, que fue justamente lo que me avisó que no era igual de siempre." },

    {
      opciones: [
        { texto: "Preguntarle qué pasó", ir: "cuarto_insistir" },
        { texto: "Dejarlo ahí", ir: "cuarto_respetar" },
      ]
    },
  ],

  cuarto_insistir: [
    { afinidad: { aiko: -2 } },
    { aiko: "normal-triste", donde: "derecha" },
    { quien: "yo", texto: "¿Qué pasó con tu viejo?" },
    { esperar: 900 },

    { texto: "Apenas terminé de decirlo ya sabía." },
    { texto: "Hay preguntas que uno escucha salir de la propia boca como si las hubiera dicho otro." },
    { esperar: 600 },

    { aiko: "enojo-seria" },
    { texto: "No se enojó. Habría sido mejor que se enojara." },
    { quien: "aiko", texto: "Te dije que no lo iba a hablar hoy." },
    { quien: "yo", texto: "Perdón." },
    { quien: "aiko", texto: "Está bien." },
    { esperar: 500 },
    { texto: "Mphf" },
    { esperar: 700 },

    { aiko: "normal-triste" },
    { texto: "Despues de ese suspiro, sacado de una tsundere que ves en esos animes genericos, se levantó a abrir la ventana, que no hacía falta abrir, y se quedó ahí un rato." },
    { texto: "Después juntó las notebooks y me dijo que se estaba haciendo tarde." },
    { esperar: 500 },
    { texto: "Eran las nueve menos cinco." },
    { texto: "Y era la primera vez en todo el día que yo no quería que fuera tarde." },
    { ir: "casa_aiko_final" },
  ],

  cuarto_respetar: [
    { afinidad: { aiko: 2 } },
    { aiko: "normal-triste", donde: "derecha" },
    { texto: "No pregunté nada." },
    { texto: "Que en mi caso es fácil, porque no preguntar es mi estado natural. Pero esta vez costó, y eso es nuevo." },
    { esperar: 700 },

    { quien: "yo", texto: "Bueno." },
    { esperar: 400 },
    { quien: "yo", texto: "Cuando quieras hablarlo, hablalo. Y si no, no." },
    { esperar: 900 },

    { texto: "Levantó la cabeza." },
    { aiko: "pensando-feliz" },
    { quien: "aiko", texto: "¿Así de fácil?" },
    { quien: "yo", texto: "Así de fácil." },
    { esperar: 600 },

    { texto: "Se quedó mirándome con una cara que no le había visto en todo el año y medio." },
    { texto: "Ni ayer en el andén, ni en la cafetería, ni en el vagón." },
    { esperar: 500 },
    { aiko: "normal-feliz" },
    { quien: "aiko", texto: "Sos bastante mejor persona de lo que te creés, {nombre}." },
    { quien: "yo", texto: "No sabés lo que decís." },
    { quien: "aiko", texto: "Sé perfectamente lo que digo. Es un defecto que tengo." },
    { ir: "casa_aiko_cuarto_final" },
  ],

  /* ---------- 7b. Lo que pasa si le respetaste el espacio ----------
     Solo llega acá el que viene con afinidad 7 o más con Aiko. El resto
     se saltea la escena entera y va derecho a la despedida. */
  casa_aiko_cuarto_final: [
    { siAfinidad: "aiko", max: 6, ir: "casa_aiko_final" },
    { recordar: "d2_casi" },

    { aiko: "normal-feliz", donde: "derecha" },
    { esperar: 700 },
    { texto: "Y después no dijo nada más, que fue peor." },
    { esperar: 500 },

    { texto: "Se corrió para el costado de la cama y palmeó el lugar de al lado, dos veces, sin mirarme." },
    { esperar: 400 },
    { quien: "aiko", texto: "Vení. La silla esa es un espanto." },
    { esperar: 900 },

    { texto: "Calculé la distancia entre la silla y la cama." },
    { texto: "Un metro veinte. Dos pasos y medio." },
    { texto: "¿Tan cerca me quiere?" },
    { esperar: 500 },
    { texto: "Y me quedé sentado, porque mi cuerpo entendió la orden y el resto de mí pidió una reunión urgente." },
    { esperar: 700 },

    { aiko: "pensando-feliz" },
    { quien: "aiko", texto: "No te voy a morder, {nombre}." },
    { quien: "yo", texto: "No es eso." },
    { quien: "aiko", texto: "¿Y qué es?" },
    { esperar: 900 },

    { texto: "Y ahí tuve una de esas peleas internas que duran dos segundos y ocupan una vida." },
    { texto: "En realidad dos peleas al mismo tiempo, contra mis dos cabezas" },
    { esperar: 400 },
    { texto: "Una parte de mí queriendo hacerle caso." },
    { texto: "La otra haciendo lo que hace siempre: buscar la salida, hacer el ridículo, calcular cuánto me iba a doler si me equivocaba." },
    { esperar: 600 },
    { texto: "Decidi hacerle caso a la primera." },
    { esperar: 500 },
    { texto: "Me levanté y fui para su lado." },
    { esperar: 900 },

    { aiko: "normal-feliz" },
    { texto: "Me senté en el borde, con la espalda derecha, como si estuviera esperando en un consultorio." },
    { quien: "aiko", texto: "Sos lo más incómodo que vi en mi vida." },
    { quien: "yo", texto: "Estoy cómodo." },
    { quien: "aiko", texto: "Estás sentado como un señor esperando el turno del dentista." },
    { esperar: 400 },
    { texto: "Tenía razón, así que me aflojé un poco, que en mi caso significa bajar tres grados los hombros." },
    { esperar: 700 },

    { texto: "Afuera ya estaba oscuro. La lámpara del escritorio era la única luz prendida y dejaba la mitad del cuarto en penumbra." },
    { texto: "Se escuchaba el televisor del fondo, muy lejos, como si fuera de otra casa." },
    { esperar: 600 },

    { aiko: "pensando-feliz" },
    { quien: "aiko", texto: "Che." },
    { quien: "yo", texto: "Qué." },
    { esperar: 500 },
    { quien: "aiko", texto: "Gracias por no preguntar. Que te trate con confianza no te hace ser un desubicado, eso me gusta de vos. Siempre tan respetuoso y bueno" },
    { esperar: 900 },

    { texto: "Lo dijo bajo. Tan bajo que tuve que darme vuelta para escucharla, y cuando me di vuelta ya estaba más cerca de lo que estaba antes." },
    { esperar: 500 },
    { texto: "No sé en qué momento se movió. Yo cuento todo y eso no lo conté." },
    { esperar: 700 },

    { aiko: "pensando-avergonzada" },
    { texto: "Veinte centímetros." },
    { texto: "Los conté después, obviamente, cuando ya no servía para nada." },
    { esperar: 600 },

    { texto: "Y estuvo eso raro de que las dos personas saben, y las dos saben que la otra sabe, y ninguna de las dos hace nada." },
    { texto: "Con la diferencia de que ella estaba tranquila y yo tenía el pulso en las orejas." },
    { esperar: 700 },

    { texto: "Me acordé de golpe de todo lo que tenía en contra." },
    { texto: "Que no sé qué hacer con las manos. Que hace un año y medio que no le hablo a nadie de esto. Que si me equivoco no hay forma de volver al lunes." },
    { esperar: 500 },
    { texto: "Que soy el tipo que salió cuarenta minutos antes de su casa durante un año para no cruzarse con nadie, solo por miedo a conectar. " },
    { esperar: 900 },

    { quien: "yo", texto: "Aiko." },
    { aiko: "pensando-avergonzada" },
    { quien: "aiko", texto: "¿Mmm?" },
    { esperar: 900 },

    { texto: "Y no me salió." },
    { texto: "Igual que ayer en la sala de computación, igual que las otras cuatrocientas veces." },
    { esperar: 500 },
    { texto: "Se me quedó atravesado en el mismo lugar de siempre, ese punto exacto entre la cabeza y la boca donde se me mueren las cosas." },
    { esperar: 700 },

    { texto: "Pero esta vez no bajé la vista." },
    { texto: "Eso es nuevo. Puede parecer poco. No es poco." },
    { esperar: 900 },

    { aiko: "normal-feliz" },
    { texto: "Ella esperó." },
    { texto: "Tres segundos, cuatro. Sin llenar el silencio, que es esa cosa que sabe hacer y que no sé de dónde la sacó." },
    { esperar: 600 },
    { texto: "Después levantó la mano y me acomodó el cuello de la camisa, que no estaba desacomodado." },
    { esperar: 700 },
    { quien: "aiko", texto: "Ya sé. Estas temblando boludo, lo noto." },
    { texto: "Ella levanto la vista para mirarme a los ojos."},
    { esperar: 500 },
    { quien: "aiko", texto: "No hace falta hoy." },
    { esperar: 900 },

    {
      opciones: [
        { texto: "Besarla", ir: "besar_aiko" },
        { texto: "...", ir: "no_besar" },
      ]
    },

  ],
  no_besar: [
    { sora: "sorprendido", donde: "izquierda" },
    { quien: "sora", texto: "¡AIKO, MAMÁ DICE QUE SI EL CHICO SE QUEDA A COMER!" },
    { esperar: 400 },

    { aiko: "normal-enojada" },
    { texto: "Aiko cerró los ojos con una paciencia que se le notaba entrenada." },
    { quien: "aiko", texto: "SORA." },
    { sora: "orgulloso" },
    { quien: "sora", texto: "¡ES UNA PREGUNTA DE MAMÁ, NO MÍA!" },
    { quien: "aiko", texto: "TOCÁ LA PUERTA." },
    { quien: "sora", texto: "ESTABA ABIERTA." },
    { esperar: 400 },
    { sora: null },
    { texto: "Se fue por el pasillo gritando la respuesta antes de que nadie se la diera." },
    { esperar: 700 },

    { aiko: "pensando-avergonzada", donde: "derecha" },
    { texto: "Nos quedamos los dos mirando la puerta vacía." },
    { esperar: 500 },
    { quien: "aiko", texto: "Un día lo vendo al nenito este." },
    { quien: "yo", texto: "Yo te lo compro." },
    { esperar: 400 },
    { aiko: "normal-feliz" },
    { texto: "Se rió con la nariz. Ese ruido chiquito." },
    { esperar: 600 },

    { texto: "Y con eso se rompió lo que había en el aire, que es exactamente lo que yo necesitaba y también exactamente lo que no quería." },
    { texto: "Las dos cosas al mismo tiempo, que es como me pasan las cosas a mí." },
    { esperar: 700 },

    { texto: "Junté las notebooks." },
    { texto: "Ella no me dijo que me quedara a comer, y yo no pregunté, y creo que los dos entendimos que era mejor así." },
    { esperar: 500 },
    { texto: "Por hoy." },
    { ir: "casa_aiko_final" },
  ],
  besar_aiko: [
    { afinidad: { aiko: 5 } },
      {texto: "Le hice caso a mi instinto, con la poca calma que me quedaba, cerre mis ojos y le di un piquito en los labios"},
      {aiko: "pensando-avergonzada"},
      {texto: "Ella se soprendio abriendo los ojos. Me rei, olvidandome de toda la tension"},
      {quien: "yo", texto: "Es la primera vez que te veo con los ojos bien abiertos"},
      {aiko: null},
      {texto: "Sin previo aviso, ella se lanzo a mi boca"},
      {esperar: 500},

      {texto: "No se en que momento accedi y me deje llevar por la situacion"},
      { texto: "Puse mi mano en si cintura, la acerque mas... ella se acomodo en mi regazo"},
      { texto: "Baje mis labios por inecria a al altura de su cuello"},
      { texto: "Ella dejo escapar un gemido... lo que me termino provocando mas"},
      { texto: "Mis manos estaban temblorosas"},
      {texto: "Ya no se si por la emocion o la verguenza (sinceramente no me importa)"},
      { texto: "Con esas mismas manos, empece a desprender su uniforme"},
      {esperar: 400},

      {texto: "Posterior a eso, mi otra mano se deslizo sobre su muslo, viajando hasta mas adentro."},
      {texto: "Ella se estremecio dejando escapar un gemido un poco mas fuerte, tapandose la boca para que las ondas sonoras no viajen mas alla de la habitacion"},

      {aiko: "pantie-normal-feliz"},
      {quien: "aiko", texto: "Boludo... queres que me escuche mi familia?"},
      {texto: "Dijo antes de reirse, lo que provoco en mi la misma reaccion"},
      {quien: "yo", texto: "Vos te la buscaste, ahora bancatela"},
      {aiko: "pantie-pensando-feliz"},
      {quien: "aiko", texto: "Wachin..."},
      {aiko: "pantie-pensando-avergonzada"},
      {texto: "Su cara cambio cuando se escucharon pasos en las escaleras"},
      {aiko: null},
      {esperar: 500},
      {texto: "Con la velocidad de la luz, nos vestimos y nos arreglamos lo mas que pudimos."},
      {esperar: 400},

    { sora: "sorprendido", donde: "izquierda" },
    { quien: "sora", texto: "¡AIKO, MAMÁ DICE QUE SI EL CHICO SE QUEDA A COMER!" },
    { esperar: 400 },

    { aiko: "pensando-avergonzada", donde : "derecha" },
    { texto: "Aiko cerró los ojos con una paciencia que se le notaba entrenada." },
    { quien: "aiko", texto: "Sora..." },
    { sora: "orgulloso" },
    { quien: "sora", texto: "¡ES UNA PREGUNTA DE MAMÁ, NO MÍA!" },
    { quien: "aiko", texto: "TOCÁ LA PUERTA." },
    { quien: "sora", texto: "ESTABA ABIERTA." },
    { esperar: 400 },
    { sora: null },
    { texto: "Se fue por el pasillo gritando la respuesta antes de que nadie se la diera." },
    { esperar: 700 },

    { aiko: "pensando-avergonzada" },
    { texto: "Nos quedamos los dos mirando la puerta vacía." },
    { esperar: 500 },
    { quien: "aiko", texto: "Un día lo vendo al nenito este." },
    { quien: "yo", texto: "Yo te lo compro." },
    { esperar: 400 },
    { aiko: "normal-feliz" },
    { texto: "Se rió con la nariz. Ese ruido chiquito." },
    { esperar: 600 },

    { texto: "Y con eso se rompió lo que había en el aire, que es exactamente lo que yo necesitaba y también exactamente lo que no quería." },
    { texto: "Las dos cosas al mismo tiempo, que es como me pasan las cosas a mí." },
    { esperar: 700 },

    { texto: "Junté las notebooks." },
    { texto: "Ella no me dijo que me quedara a comer, y yo no pregunté, y creo que los dos entendimos que era mejor así." },
    { esperar: 500 },
    { texto: "Por hoy." },
    { ir: "casa_aiko_final" },
    ],

  /* ---------- 8. La puerta, otra vez ---------- */
  casa_aiko_final: [
    { fondo: "sala-aiko" },
    { esperar: 600 },
    { texto: "Me acompañó hasta la reja verde." },
    { texto: "Adentro, Sora gritó algo que ninguno de los dos quiso escuchar." },
    { esperar: 500 },

    /* Cómo te despide depende de todo lo que pasó hoy y ayer. */
    { siAfinidad: "aiko", min: 7, aiko: "normal-feliz", donde: "derecha" },
    { siAfinidad: "aiko", min: 7, quien: "aiko", texto: "Che, {nombre}." },
    { siAfinidad: "aiko", min: 7, quien: "yo", texto: "Qué." },
    { siAfinidad: "aiko", min: 7, quien: "aiko", texto: "El trabajo lo terminamos hoy." },
    { siAfinidad: "aiko", min: 7, quien: "aiko", texto: "Así que mañana ya no tenemos excusa, ¿te das cuenta?" },
    { siAfinidad: "aiko", min: 7, esperar: 900 },
    { siAfinidad: "aiko", min: 7, quien: "yo", texto: "...me doy cuenta." },
    { siAfinidad: "aiko", min: 7, aiko: "pensando-feliz" },
    { siAfinidad: "aiko", min: 7, quien: "aiko", texto: "Bueno. Entonces inventá una." },
    { siAfinidad: "aiko", min: 7, texto: "Y cerró la reja antes de que se me ocurriera nada, que fue una gentileza de su parte." },

    { siAfinidad: "aiko", min: 3, max: 6, aiko: "normal-feliz", donde: "derecha" },
    { siAfinidad: "aiko", min: 3, max: 6, quien: "aiko", texto: "Gracias por venir." },
    { siAfinidad: "aiko", min: 3, max: 6, quien: "yo", texto: "Gracias por invitarme." },
    { siAfinidad: "aiko", min: 3, max: 6, quien: "aiko", texto: "Uh, qué formales los dos." },
    { siAfinidad: "aiko", min: 3, max: 6, texto: "Se rió con la nariz otra vez, ese ruido chiquito." },
    { siAfinidad: "aiko", min: 3, max: 6, quien: "aiko", texto: "Nos vemos mañana en el andén. Y esta vez me saludás." },

    { siAfinidad: "aiko", max: 2, aiko: "normal-triste", donde: "derecha" },
    { siAfinidad: "aiko", max: 2, quien: "aiko", texto: "Bueno. Nos vemos mañana." },
    { siAfinidad: "aiko", max: 2, quien: "yo", texto: "Nos vemos." },
    { siAfinidad: "aiko", max: 2, texto: "Cerró la reja y se metió para adentro sin darse vuelta." },
    { siAfinidad: "aiko", max: 2, texto: "Y me quedé un rato largo del lado de afuera, calculando en qué parte exacta del día se me había escapado esto." },
    { esperar: 900 },

    { aiko: null },
    { fondo: "camino-al-subte" },
    { esperar: 600 },
    { texto: "Volví caminando a la estación." },
    { texto: "Cuatro cuadras y media. Ocho minutos a paso normal." },
    { esperar: 500 },

    { si: "le_dijiste_la_verdad", texto: "Tardé veinticuatro." },
    { si: "le_dijiste_la_verdad", texto: "Y en el medio me di cuenta de que le había contado a alguien la cosa que no le cuento a nadie, y de que no se había roto nada." },

    { si: "le_mentiste_a_aiko", texto: "Tardé seis." },
    { si: "le_mentiste_a_aiko", texto: "Fui rápido, como se va cuando uno quiere llegar a algún lado a no pensar." },
    { si: "le_mentiste_a_aiko", texto: "No sirvió. En el vagón la pregunta seguía ahí, esperándome sentada." },

    { si: "le_esquivaste", texto: "Tardé once." },
    { si: "le_esquivaste", texto: "Once minutos, otra vez el once. Y en los once me quedó dando vueltas que me mira hace un año y medio." },
    { esperar: 700 },

    { texto: "Y en el andén, esperando el de vuelta, hice la última cuenta del día." },
    { esperar: 500 },
    { texto: "Ciento ochenta veces bajé en esta estación sin salir a la calle." },
    { texto: "Ciento ochenta y una, con la de hoy." },
    { esperar: 700 },
    { texto: "La única que me voy a acordar." },
    { ir: "fin_dia2" },
  ],

  /* =========================================================
     DÍA 2 — RAMA DEL RECHAZO
     Le dijiste que no podías, y ella te reubicó para el recreo largo.
     ========================================================= */

  /* ---------- 1. La mañana, sin nada esperando ---------- */
  d2r_despertar: [
    { fondo: "habitacion", musica: "ohayou" },
    { esperar: 600 },

    { texto: "Me desperté a las seis y diez, con el despertador, como corresponde." },
    { texto: "Sin sobresaltos, sin abrir los ojos de golpe, sin nada." },
    { esperar: 500 },
    { texto: "Que es exactamente como me desperté los últimos cuatrocientos días y nunca me había molestado." },
    { esperar: 700 },

    { texto: "Ayer a las seis menos diez dije que tenía cosas que hacer." },
    { texto: "Las cosas que tenía que hacer resultaron ser: cenar, mirar el techo y dormirme a las once y veinte." },
    { esperar: 500 },
    { texto: "Una agenda apretadísima." },
    { esperar: 700 },

    { texto: "Lo peor no fue decirle que no." },
    { texto: "Lo peor fue que ella no se enojó, y me acomodó para el recreo largo como si nada, y con eso me dejó sin ni siquiera el derecho a sentirme mal." },
    { esperar: 600 },
    { texto: "Es difícil hacerse la víctima cuando la otra persona te resuelve el problema que vos creaste." },
    { esperar: 700 },

    { texto: "Salí seis y veinte." },
    { texto: "Diez minutos tarde respecto de mi horario de siempre, que en mi escala es un desastre logístico." },
    { esperar: 500 },
    { texto: "No me apuré." },
    { ir: "d2r_colegio" },
  ],

  /* ---------- 2. Las primeras horas ---------- */
  d2r_colegio: [
    { fondo: "aula", musica: "alegre" },
    { esperar: 500 },
    { texto: "Historia, matemática, y un módulo de laboratorio en el que rompí una pipeta." },
    { texto: "De las tres cosas me acuerdo de la pipeta y de nada más." },
    { esperar: 600 },

    { aiko: "normal-feliz", donde: "derecha" },
    { texto: "Aiko entró justo con el timbre, me vio, y en vez de saludar levantó dos dedos y señaló el reloj." },
    { esperar: 400 },
    { quien: "aiko", texto: "Recreo largo. No te me pierdas." },
    { quien: "yo", texto: "No me voy a perder." },
    { aiko: "pensando-feliz" },
    { quien: "aiko", texto: "Eso dijiste ayer." },
    { esperar: 500 },
    { texto: "Ayer no dije eso. Ayer dije otra cosa." },
    { texto: "Pero tenía razón igual, que es lo más molesto de ella." },
    { aiko: null },
    { esperar: 700 },

    /* Cómo te trata el grupo hoy depende de cómo te portaste ayer. */
    { siAfinidad: "alvaro", min: 2, alvaro: "orgulloso", donde: "izquierda" },
    { siAfinidad: "alvaro", min: 2, quien: "alvaro", texto: "¡Eh! ¿Vos no ibas a la casa de Aiko ayer?" },
    { siAfinidad: "alvaro", min: 2, quien: "yo", texto: "No fui." },
    { siAfinidad: "alvaro", min: 2, alvaro: "pensando" },
    { siAfinidad: "alvaro", min: 2, quien: "alvaro", texto: "..." },
    { siAfinidad: "alvaro", min: 2, quien: "alvaro", texto: "Sos un caso perdido, chabón. Te quiero igual." },
    { siAfinidad: "alvaro", min: 2, alvaro: null },

    { siAfinidad: "mauri", min: 2, mauri: "orgulloso", donde: "izquierda" },
    { siAfinidad: "mauri", min: 2, quien: "mauri", texto: "TERMINÉ EL DOCE." },
    { siAfinidad: "mauri", min: 2, quien: "yo", texto: "¿Y?" },
    { siAfinidad: "mauri", min: 2, quien: "mauri", texto: "No te voy a decir nada porque te tenés que comer el trece igual que yo." },
    { siAfinidad: "mauri", min: 2, mauri: null },
    { esperar: 600 },

    { texto: "Diez y cuarenta. Timbre largo." },
    { ir: "d2r_recreo" },
  ],

  /* ---------- 3. El recreo largo ---------- */
  d2r_recreo: [
    { recordar: "d2r_trabajo_en_el_recreo" },
    { fondo: "cafeteria" },
    { esperar: 600 },

    { texto: "La cafetería en el recreo largo es un ruido con paredes." },
    { texto: "Ochenta personas, cuatro ventiladores y el chirrido de las sillas contra las baldosas." },
    { esperar: 500 },

    { aiko: "normal-feliz", donde: "derecha" },
    { texto: "Ella ya estaba en la mesa del fondo, la que está pegada a la ventana, con la notebook abierta y una silla corrida hacia afuera." },
    { texto: "Corrida hacia afuera para mí, quiero decir. No es que estuviera desordenada." },
    { esperar: 400 },
    { quien: "aiko", texto: "Llegaste." },
    { quien: "yo", texto: "Llegué." },
    { aiko: "pensando-feliz" },
    { quien: "aiko", texto: "Sentate que tenemos cincuenta minutos y vos escribís lento." },
    { esperar: 600 },

    { texto: "Trabajamos bien, para mi sorpresa." },
    { texto: "Ella dictaba y yo tipeaba, igual que en la sala de computación, salvo que acá el ruido era de gente y no de ventiladores, y eso cambia todo." },
    { esperar: 500 },
    { texto: "Con el ruido de la máquina uno se aísla. Con el ruido de la gente uno tiene que elegir aislarse." },
    { esperar: 700 },

    { texto: "A los veinte minutos ya teníamos la mitad de lo que nos faltaba." },
    { texto: "Y ahí ella dejó de dictar." },
    { ir: "d2r_coqueteo1" },
  ],

  /* ---------- 3a. Primer coqueteo: la letra ---------- */
  d2r_coqueteo1: [
    { aiko: "pensando-feliz", donde: "derecha" },
    { texto: "Me sacó el cuaderno de al lado del teclado y se puso a mirar las anotaciones que había hecho a mano." },
    { esperar: 400 },
    { quien: "aiko", texto: "Che." },
    { quien: "yo", texto: "Qué." },
    { quien: "aiko", texto: "¿Siempre escribís tan chiquito o es a propósito para que nadie te lea?" },
    { esperar: 700 },

    { texto: "Levantó la vista del cuaderno cuando lo preguntó, que es un detalle que registré y preferiría no haber registrado." },
    { esperar: 500 },

    {
      opciones: [
        { texto: "\"Es a propósito.\"",           ir: "d2r_c1_seguir" },
        { texto: "\"Es la letra que tengo.\"",    ir: "d2r_c1_esquivar" },
      ]
    },
  ],

  d2r_c1_seguir: [
    { afinidad: { aiko: 1 } },
    { quien: "yo", texto: "Es a propósito." },
    { esperar: 400 },
    { quien: "yo", texto: "Vos sos la primera que se pone a leerlo, así que evidentemente funciona mal." },
    { esperar: 700 },

    { aiko: "normal-feliz" },
    { texto: "Se rió con la nariz. Ese ruido chiquito." },
    { quien: "aiko", texto: "Uh, mirá vos. Hoy viniste con respuestas." },
    { quien: "yo", texto: "Vengo con una. Después no me queda nada, así que no la gastes." },
    { esperar: 500 },
    { aiko: "pensando-feliz" },
    { quien: "aiko", texto: "La voy a gastar toda, obvio." },
    { esperar: 600 },
    { texto: "Y volvió al cuaderno, pero se lo quedó ella, apoyado del lado suyo de la mesa." },
    { texto: "No me lo devolvió en los cincuenta minutos." },
    { ir: "d2r_coqueteo2" },
  ],

  d2r_c1_esquivar: [
    { quien: "yo", texto: "Es la letra que tengo." },
    { esperar: 700 },
    { texto: "Lo dije mirando la pantalla, que es mi movimiento defensivo de toda la vida." },
    { esperar: 500 },

    { aiko: "pensando-feliz" },
    { quien: "aiko", texto: "Ajá." },
    { esperar: 400 },
    { texto: "Ese ajá tenía como cuatro cosas adentro y ninguna era la que dije yo." },
    { esperar: 600 },
    { texto: "Me devolvió el cuaderno y siguió dictando." },
    { texto: "Y yo me quedé pensando en las tres respuestas mejores que se me ocurrieron cuatro segundos tarde." },
    { ir: "d2r_coqueteo2" },
  ],

  /* ---------- 3b. Segundo coqueteo: lo de ayer ---------- */
  d2r_coqueteo2: [
    { esperar: 600 },
    { texto: "Media hora. Nos quedaba la conclusión y las fuentes." },
    { esperar: 400 },

    { aiko: "pensando-feliz", donde: "derecha" },
    { quien: "aiko", texto: "¿Puedo decirte una cosa sin que te pongas raro?" },
    { quien: "yo", texto: "No te puedo garantizar nada." },
    { esperar: 500 },
    { quien: "aiko", texto: "Ayer cuando me dijiste que no podías, no te creí ni un poquito." },
    { esperar: 900 },

    { texto: "Y lo dijo sin acusación, con el tono de quien comenta el clima." },
    { texto: "Que es peor, porque contra una acusación uno se defiende." },
    { esperar: 600 },

    {
      opciones: [
        { texto: "\"No, no era verdad.\"",              ir: "d2r_c2_seguir" },
        { texto: "\"Tenía cosas que hacer, posta.\"",   ir: "d2r_c2_esquivar" },
      ]
    },
  ],

  d2r_c2_seguir: [
    { afinidad: { aiko: 1 } },
    { quien: "yo", texto: "No, no era verdad." },
    { esperar: 700 },
    { texto: "Salió más fácil de lo que esperaba, que es una cosa que me está pasando seguido últimamente y no me termina de gustar." },
    { esperar: 500 },

    { aiko: "normal-feliz" },
    { quien: "aiko", texto: "¿Y por qué me dijiste que sí?" },
    { quien: "yo", texto: "Porque era más rápido que explicarte por qué no." },
    { esperar: 900 },

    { aiko: "pensando-avergonzada" },
    { texto: "Se quedó un segundo con la boca a medio abrir." },
    { quien: "aiko", texto: "Eso fue casi honesto." },
    { quien: "yo", texto: "Fue completamente honesto. No exageres." },
    { esperar: 500 },
    { aiko: "normal-feliz" },
    { quien: "aiko", texto: "Bueno, no te vengas arriba." },
    { esperar: 600 },
    { texto: "Y me pateó el pie por abajo de la mesa, una vez, sin mirarme." },
    { texto: "Estuve como cuarenta segundos sin poder escribir nada." },
    { ir: "d2r_coqueteo3" },
  ],

  d2r_c2_esquivar: [
    { quien: "yo", texto: "Tenía cosas que hacer, posta." },
    { esperar: 900 },
    { texto: "Y me escuché decirlo con la misma voz de agenda llena que usé ayer." },
    { texto: "La tengo tan practicada que ya me sale sin querer." },
    { esperar: 600 },

    { aiko: "normal-feliz" },
    { quien: "aiko", texto: "Dale, está bien." },
    { esperar: 400 },
    { texto: "Y no insistió, que fue exactamente lo que pedí y exactamente lo que no quería." },
    { esperar: 500 },
    { texto: "Ese combo lo vengo consiguiendo bastante seguido." },
    { ir: "d2r_coqueteo3" },
  ],

  /* ---------- 3c. Tercer coqueteo: el corte ---------- */
  d2r_coqueteo3: [
    { esperar: 600 },
    { texto: "Cuarenta minutos. Terminamos las fuentes y quedaba solo la conclusión, que es la parte que nadie quiere escribir." },
    { esperar: 500 },

    { franco: "orgulloso", donde: "izquierda" },
    { quien: "franco", texto: "¡BANDA! ¿Qué hacen?" },
    { aiko: "normal-enojada", donde: "derecha" },
    { quien: "aiko", texto: "El trabajo que vos ya entregaste, Franco." },
    { franco: "normal" },
    { quien: "franco", texto: "Ah, sí. Perdón. Los dejo." },
    { esperar: 400 },
    { texto: "No nos dejó. Se quedó parado al lado de la mesa como veinte segundos, mirándonos alternadamente." },
    { franco: "orgulloso" },
    { quien: "franco", texto: "Nada, nada. Me voy." },
    { franco: null },
    { esperar: 700 },

    { aiko: "pensando-avergonzada" },
    { texto: "Aiko se tapó la cara con la mano." },
    { quien: "aiko", texto: "Lo voy a matar." },
    { quien: "yo", texto: "Hacelo cuando entreguemos." },
    { esperar: 500 },
    { aiko: "normal-feliz" },
    { quien: "aiko", texto: "Uh. Dos respuestas en un día." },
    { esperar: 700 },

    { texto: "Y después se quedó mirándome un momento más de lo que hacía falta." },
    { esperar: 500 },
    { aiko: "pensando-feliz" },
    { quien: "aiko", texto: "Che, {nombre}." },
    { quien: "yo", texto: "Qué." },
    { quien: "aiko", texto: "La próxima que te invite a algo, decime que no en el momento." },
    { esperar: 400 },
    { quien: "aiko", texto: "No me digas que sí y después te arrepientas. Prefiero el no." },
    { esperar: 900 },

    { texto: "Eso no era un coqueteo. Eso era otra cosa." },
    { texto: "Pero lo dijo con la misma cara con la que venía cargándome hace media hora, así que no supe dónde ponerlo." },
    { esperar: 600 },

    {
      opciones: [
        { texto: "\"¿Vas a invitarme a algo?\"",   ir: "d2r_c3_seguir" },
        { texto: "\"Está bien. Perdón.\"",          ir: "d2r_c3_esquivar" },
      ]
    },
  ],

  d2r_c3_seguir: [
    { afinidad: { aiko: 1 } },
    { quien: "yo", texto: "¿Vas a invitarme a algo?" },
    { esperar: 900 },

    { texto: "Lo dije y me quedé escuchándolo rebotar en mi propia cabeza, buscándole el tono con el que había salido." },
    { texto: "Salió tranquilo. No sé de dónde." },
    { esperar: 600 },

    { aiko: "pensando-avergonzada" },
    { texto: "Ella tardó." },
    { texto: "Uno de esos silencios cortos que uno cuenta igual." },
    { esperar: 500 },
    { quien: "aiko", texto: "Capaz." },
    { aiko: "normal-feliz" },
    { quien: "aiko", texto: "Depende de cómo te portes el resto del recreo." },
    { esperar: 400 },
    { quien: "yo", texto: "Me quedan diez minutos para portarme bien." },
    { quien: "aiko", texto: "Y una conclusión sin escribir. Empezá por ahí." },
    { esperar: 700 },
    { texto: "Escribí la conclusión en cuatro minutos." },
    { texto: "Es lo más rápido que hice algo en mi vida y no tengo intención de analizar por qué." },
    { ir: "d2r_fin_recreo" },
  ],

  d2r_c3_esquivar: [
    { quien: "yo", texto: "Está bien. Perdón." },
    { esperar: 700 },

    { aiko: "normal-feliz" },
    { quien: "aiko", texto: "No te disculpes, boludo. No te estoy retando." },
    { esperar: 500 },
    { texto: "Ya sé que no me estaba retando." },
    { texto: "Pero pedir perdón es lo que hago cuando no sé qué otra cosa hacer, y funciona bastante bien para cerrar conversaciones." },
    { esperar: 600 },
    { texto: "El problema es que a veces uno no quiere cerrar la conversación." },
    { esperar: 500 },

    { aiko: "pensando-feliz" },
    { quien: "aiko", texto: "Bueno. Falta la conclusión." },
    { texto: "Y volvió a la pantalla." },
    { ir: "d2r_fin_recreo" },
  ],

  /* ---------- 4. Suena el timbre ---------- */
  d2r_fin_recreo: [
    { esperar: 600 },
    { texto: "Timbre. Cincuenta minutos exactos, que es lo que ella había calculado a ojo cuando llegué." },
    { esperar: 500 },

    { aiko: "normal-feliz", donde: "derecha" },
    { texto: "Cerró la notebook y la metió en la mochila de un solo movimiento, de esos que se aprenden repitiéndolos mil veces." },
    { quien: "aiko", texto: "Listo. Entregamos y nos sacamos un nueve." },
    { quien: "yo", texto: "Un ocho." },
    { aiko: "normal-enojada" },
    { quien: "aiko", texto: "UN NUEVE." },
    { esperar: 500 },

    { texto: "Nos levantamos con el resto de la cafetería, en ese embudo de ochenta personas que quieren salir por una puerta." },
    { esperar: 400 },

    /* La despedida cambia según cuánto le seguiste el juego. */
    { siAfinidad: "aiko", min: 6, aiko: "pensando-feliz" },
    { siAfinidad: "aiko", min: 6, quien: "aiko", texto: "Che." },
    { siAfinidad: "aiko", min: 6, quien: "yo", texto: "Qué." },
    { siAfinidad: "aiko", min: 6, quien: "aiko", texto: "Lo de recién. Lo de si te iba a invitar a algo." },
    { siAfinidad: "aiko", min: 6, esperar: 900 },
    { siAfinidad: "aiko", min: 6, aiko: "normal-feliz" },
    { siAfinidad: "aiko", min: 6, quien: "aiko", texto: "Pensalo vos y me avisás." },
    { siAfinidad: "aiko", min: 6, texto: "Y se metió en el embudo antes de que se me ocurriera nada, que a esta altura ya es una técnica que tiene." },

    { siAfinidad: "aiko", min: 3, max: 5, aiko: "normal-feliz" },
    { siAfinidad: "aiko", min: 3, max: 5, quien: "aiko", texto: "Bueno. Mañana entregamos." },
    { siAfinidad: "aiko", min: 3, max: 5, quien: "yo", texto: "Mañana entregamos." },
    { siAfinidad: "aiko", min: 3, max: 5, texto: "Y quedó ahí, en una cosa dicha dos veces porque a ninguno de los dos se le ocurrió una tercera." },

    { siAfinidad: "aiko", max: 2, aiko: "normal-triste" },
    { siAfinidad: "aiko", max: 2, quien: "aiko", texto: "Nos vemos." },
    { siAfinidad: "aiko", max: 2, texto: "Se fue con el resto sin darse vuelta." },
    { siAfinidad: "aiko", max: 2, texto: "Y me quedé haciendo la cuenta de en qué parte exacta de los cincuenta minutos se me escapó esto." },
    { esperar: 900 },

    { aiko: null },
    { fondo: "patio-colegio" },
    { esperar: 600 },
    { texto: "Las dos últimas horas pasaron como pasan las horas cuando ya no hay nada esperando." },
    { esperar: 500 },

    { texto: "Y en el subte de vuelta, parado al lado de la puerta como siempre, hice la cuenta del día." },
    { esperar: 400 },
    { texto: "Cincuenta minutos sentado enfrente de alguien, hablando." },
    { texto: "Cincuenta minutos es el tiempo que yo tardo, normalmente, en encontrar una excusa para irme." },
    { esperar: 700 },
    { texto: "Hoy no la busqué ni una vez." },
    { ir: "fin_dia2" },
  ],

  fin_dia2: [
    { esperar: 800 },
    { fondo: "amanecer", musica: null },
    { esperar: 700 },
    { texto: "FIN DEL DÍA 2" },
    { esperar: 500 },

    { siAfinidad: "aiko", min: 7, texto: "Aiko te pidió que inventes una excusa para mañana.\n\nMás te vale inventarla." },
    { siAfinidad: "aiko", min: 3, max: 6, texto: "Con Aiko quedaron bien.\n\nQuedaron bien, nada más. Todavía hay margen para las dos cosas." },
    { siAfinidad: "aiko", max: 2, texto: "Con Aiko algo se torció hoy.\n\nNo está roto. Pero se torció, y ella se dio cuenta antes que vos." },

    { si: "d2_casi", texto: "En el cuarto estuvo a veinte centímetros y no te salió.\n\nElla te dijo que no hacía falta hoy. Dijo hoy." },
    { si: "le_mentiste_a_aiko", texto: "Te preguntó en serio por qué te sentás solo y le contestaste con una frase gastada." },
    { si: "llevaste_facturas", texto: "En esa casa, por ahora, sos el que trajo las facturas." },
    { si: "d2r_trabajo_en_el_recreo", texto: "El trabajo lo terminaron en la cafetería, en cincuenta minutos.\n\nNo buscaste una excusa para irte ni una vez." },

    { texto: "Si estas leyendo esto, te aviso que todavia estoy trabajando en el juego, no seas impaciente." },
    { fin: true },
  ],

};