/**
 * Dictionnaires de traduction.
 *
 * Le français est la langue de référence (`defaultLang`). Chaque clé doit
 * exister en français ; l'anglais peut être complété au fur et à mesure.
 * Une clé manquante en anglais retombe automatiquement sur le français
 * (voir `useTranslations` dans utils.ts).
 *
 * Convention de nommage : "section.element".
 */

export const languages = {
  fr: 'Français',
  en: 'English',
  it: 'Italiano',
} as const;

export const defaultLang = 'fr';

export const ui = {
  fr: {
    // Métadonnées globales
    'site.title': 'Le Système G',
    'site.tagline': "L'intonation juste enfin trouvée",
    'site.description':
      "Le Système G de Nabih Gédéon : la théorie des intervalles qui rend la juste intonation applicable. Positions, expressivité et demi-ton naturel.",

    // Navigation
    'nav.home': 'Accueil',
    'nav.literature': 'Littérature',
    'nav.theory': 'Théorie',
    'nav.player': 'Player interactif',
    'nav.bio': "L'auteur",
    'nav.skipToContent': 'Aller au contenu',

    // Accueil — hero
    'home.hero.overline': 'Théorie des intervalles musicaux',
    'home.hero.title': "L'intonation juste enfin trouvée",
    'home.hero.subtitle': 'Le Système G : positions et expressivité',
    'home.hero.author': 'par Nabih Gédéon',
    'home.hero.lede':
      "Une recherche raisonnée, méthodique et progressive de la juste intonation. Après un survol des systèmes du passé, la simple logique mène des rapports de fréquences à la découverte du demi-ton naturel, à la construction des gammes et au marquage des partitions.",

    // Accueil — sections d'invitation
    'home.explore.title': 'Explorer le projet',
    'home.explore.lede':
      'Ce site rassemble les pièces du projet Système G : les textes qui l’entourent et la théorie elle-même, prolongée par une écoute interactive.',

    'home.card.literature.title': 'Littérature',
    'home.card.literature.desc':
      "Les œuvres, résumés et traductions nés autour de la théorie des intervalles — les pièces littéraires du puzzle.",
    'home.card.literature.cta': 'Découvrir les textes',

    'home.card.theory.title': 'Théorie',
    'home.card.theory.desc':
      "Le demi-ton naturel (22/21), les positions basse, moyenne et haute, le codage et le marquage des partitions.",
    'home.card.theory.cta': 'Comprendre le système',

    'home.card.player.title': 'Player interactif',
    'home.card.player.desc':
      'Un lecteur audiovisuel pour ressentir la théorie : entendre les positions et l’expressivité, note après note.',
    'home.card.player.cta': 'Écouter et ressentir',

    // Accueil — découvertes
    'home.findings.title': 'Deux découvertes capitales',
    'home.findings.one.title': 'Le demi-ton naturel',
    'home.findings.one.desc':
      "La représentation exacte du demi-ton — rapport de fréquences 22/21 — dont découle tout le reste.",
    'home.findings.two.title': 'Les positions et leur expressivité',
    'home.findings.two.desc':
      "Basse, moyenne et haute : chaque note de la gamme occupe une position selon la tonalité, et chaque position porte son expressivité.",

    'home.quote':
      "Voici enfin — sans aucune exagération — LA bonne théorie des intervalles : évidemment applicable, et appliquée, qui épouse parfaitement la bonne pratique.",

    // Biographie
    'bio.overline': "L'auteur",
    'bio.title': 'Nabih Gédéon',
    'bio.subtitle': "Musicologue, chef de chœur et traducteur — à la recherche de la juste intonation",
    'bio.heading': "Biographie de l'auteur",

    // Rubrique Théorie — index
    'theory.index.lede':
      "La théorie des intervalles du Système G, pas à pas : de l’intuition de départ aux règles, au codage et au marquage des partitions.",
    'theory.sub.intro.title': 'Le Système G, en quelques mots',
    'theory.sub.intro.desc':
      "Introduction : pourquoi une nouvelle théorie des intervalles, et pourquoi elle change tout.",
    'theory.sub.rules.title': 'Les règles des positions',
    'theory.sub.rules.desc':
      "Positions basse, moyenne et haute ; leur expressivité et leur logique de construction.",
    'theory.sub.coding.title': 'Codage et demi-ton naturel',
    'theory.sub.coding.desc':
      "La représentation exacte du demi-ton (22/21) et le codage des intervalles.",
    'theory.sub.marking.title': 'Marquage des partitions',
    'theory.sub.marking.desc':
      "Occidentales, arabes et byzantines : trouver la juste intonation du premier coup.",
    'theory.sub.compare.title': 'Face à Partch, Johnston et au maqam',
    'theory.sub.compare.desc':
      "Mise en perspective : où situer le Système G parmi les autres intonations justes et les traditions modales.",
    'badge.available': 'Disponible',
    'badge.soon': 'À venir',

    // Pied de page
    'footer.rights': 'Tous droits réservés.',
    'footer.tagline': 'Théorie des intervalles musicaux',
    'footer.legacy': 'Site historique',

    // Générique
    'intro.preliminary': 'Observation préliminaire',
    'lang.label': 'Langue',
    'page.wip': 'Cette rubrique est en cours de préparation.',
    'page.wip.detail':
      'Les pièces du puzzle seront ajoutées progressivement. Revenez bientôt.',
    'back.home': "Retour à l'accueil",

    // Player interactif
    'player.lede':
      'Le player du Système G restitue les partitions en intonation juste, telles que les calculait le logiciel historique de 2009 — fidèlement porté sur le web.',
    'player.library': 'Bibliothèque',
    'player.library.hint': 'Ou déposez un fichier .txt de partition sur le tableau ci-dessous.',
    'player.scale': 'Gamme',
    'player.score': 'Partition',
    'player.play': 'Lecture',
    'player.pause': 'Pause',
    'player.stop': 'Arrêt',
    'player.playFrom': 'Lire depuis la ligne choisie',
    'player.instrument': 'Instrument',
    'player.followScore': 'Suivre les changements « $ » de la partition',
    'player.transpose': 'Transposition',
    'player.mode': 'Sortie',
    'player.mode.instrument': 'Instrument',
    'player.mode.sine': 'Onde sinus',
    'player.mode.square': 'Onde carrée',
    'player.duration': 'Durée totale',
    'player.notes': 'notes',
    'player.errors': 'Erreurs dans la partition',
    'player.col.symbol': 'Symbole',
    'player.col.dur': 'Durée',
    'player.status.loaded': 'Partition chargée',
    'player.status.playing': 'Lecture…',
    'player.status.paused': 'En pause',
    'player.status.stopped': 'Arrêté',
    'player.status.loading': 'Chargement des sons…',
    'player.empty': 'Choisissez une pièce dans la bibliothèque pour commencer.',
    'player.legacy.credit':
      'D’après le « G System player » original (© 2009 Faraj Elias), porté en Web Audio.',
    'player.search': 'Rechercher',
    'player.search.placeholder': 'Titre ou compositeur…',
    'player.category': 'Catégorie',
    'player.category.all': 'Toutes',
    'player.pieces': 'pièces',
    'player.playSelection': 'Lire la sélection',
    'player.warnings': 'Avertissements',
    'player.selection.hint':
      'Clic : choisir une ligne · Maj+clic : étendre la sélection · Double-clic : voir la définition du symbole dans la gamme.',

    // Aide du player
    'aide.backToPlayer': 'Revenir au player',
  },

  en: {
    'site.title': 'The G System',
    'site.tagline': 'Just intonation, found at last',
    'site.description':
      "Nabih Gédéon's G System: the theory of intervals that makes just intonation applicable. Positions, expressiveness and the natural semitone.",

    'nav.home': 'Home',
    'nav.literature': 'Literature',
    'nav.theory': 'Theory',
    'nav.player': 'Interactive player',
    'nav.bio': 'The author',
    'nav.skipToContent': 'Skip to content',

    'home.hero.overline': 'A theory of musical intervals',
    'home.hero.title': 'Just intonation, found at last',
    'home.hero.subtitle': 'The G System: positions and expressiveness',
    'home.hero.author': 'by Nabih Gédéon',
    'home.hero.lede':
      'A reasoned, methodical and progressive search for just intonation. After surveying the systems of the past, simple logic leads from frequency ratios to the discovery of the natural semitone, the construction of scales and the marking of scores.',

    'home.explore.title': 'Explore the project',
    'home.explore.lede':
      'This site gathers the pieces of the G System project: the writings that surround it and the theory itself, extended by an interactive listening experience.',

    'home.card.literature.title': 'Literature',
    'home.card.literature.desc':
      'The works, summaries and translations born around the theory of intervals — the literary pieces of the puzzle.',
    'home.card.literature.cta': 'Discover the texts',

    'home.card.theory.title': 'Theory',
    'home.card.theory.desc':
      'The natural semitone (22/21), the low, middle and high positions, the coding and the marking of scores.',
    'home.card.theory.cta': 'Understand the system',

    'home.card.player.title': 'Interactive player',
    'home.card.player.desc':
      'An audiovisual player to feel the theory: hear the positions and their expressiveness, note by note.',
    'home.card.player.cta': 'Listen and feel',

    'home.findings.title': 'Two decisive discoveries',
    'home.findings.one.title': 'The natural semitone',
    'home.findings.one.desc':
      'The exact representation of the semitone — a frequency ratio of 22/21 — from which everything else follows.',
    'home.findings.two.title': 'Positions and their expressiveness',
    'home.findings.two.desc':
      'Low, middle and high: each note of the scale takes a position according to the key, and each position carries its own expressiveness.',

    'home.quote':
      'Here at last — without any exaggeration — is THE right theory of intervals: obviously applicable, and applied, perfectly wedded to good practice.',

    'bio.overline': 'The author',
    'bio.title': 'Nabih Gédéon',
    'bio.subtitle': 'Musicologist, choir director and translator — in search of just intonation',
    'bio.heading': "Author's biography",

    'theory.index.lede':
      'The G System’s theory of intervals, step by step: from the founding intuition to the rules, the coding and the marking of scores.',
    'theory.sub.intro.title': 'The G System, in a few words',
    'theory.sub.intro.desc':
      'Introduction: why a new theory of intervals, and why it changes everything.',
    'theory.sub.rules.title': 'The rules of positions',
    'theory.sub.rules.desc':
      'Low, middle and high positions; their expressiveness and their logic of construction.',
    'theory.sub.coding.title': 'Coding and the natural semitone',
    'theory.sub.coding.desc':
      'The exact representation of the semitone (22/21) and the coding of intervals.',
    'theory.sub.marking.title': 'Marking the scores',
    'theory.sub.marking.desc':
      'Western, Arabic and Byzantine: finding just intonation at first sight.',
    'theory.sub.compare.title': 'Alongside Partch, Johnston and maqam',
    'theory.sub.compare.desc':
      'In perspective: where the G System sits among other just intonations and modal traditions.',
    'badge.available': 'Available',
    'badge.soon': 'Coming soon',

    'footer.rights': 'All rights reserved.',
    'footer.tagline': 'A theory of musical intervals',
    'footer.legacy': 'Historic website',

    'intro.preliminary': 'Preliminary note',
    'lang.label': 'Language',
    'page.wip': 'This section is being prepared.',
    'page.wip.detail':
      'The pieces of the puzzle will be added gradually. Please check back soon.',
    'back.home': 'Back to home',

    // Interactive player
    'player.lede':
      'The G System player renders scores in just intonation, exactly as the historic 2009 software computed them — faithfully ported to the web.',
    'player.library': 'Library',
    'player.library.hint': 'Or drop a score .txt file onto the table below.',
    'player.scale': 'Scale',
    'player.score': 'Score',
    'player.play': 'Play',
    'player.pause': 'Pause',
    'player.stop': 'Stop',
    'player.playFrom': 'Play from selected line',
    'player.instrument': 'Instrument',
    'player.followScore': 'Follow “$” changes in the score',
    'player.transpose': 'Transpose',
    'player.mode': 'Output',
    'player.mode.instrument': 'Instrument',
    'player.mode.sine': 'Sine wave',
    'player.mode.square': 'Square wave',
    'player.duration': 'Total duration',
    'player.notes': 'notes',
    'player.errors': 'Errors in score',
    'player.col.symbol': 'Symbol',
    'player.col.dur': 'Duration',
    'player.status.loaded': 'Score loaded',
    'player.status.playing': 'Playing…',
    'player.status.paused': 'Paused',
    'player.status.stopped': 'Stopped',
    'player.status.loading': 'Loading sounds…',
    'player.empty': 'Pick a piece from the library to get started.',
    'player.legacy.credit':
      'Based on the original “G System player” (© 2009 Faraj Elias), ported to Web Audio.',
    'player.search': 'Search',
    'player.search.placeholder': 'Title or composer…',
    'player.category': 'Category',
    'player.category.all': 'All',
    'player.pieces': 'pieces',
    'player.playSelection': 'Play selection',
    'player.warnings': 'Warnings',
    'player.selection.hint':
      'Click: pick a line · Shift+click: extend selection · Double-click: jump to the symbol’s definition in the scale.',

    // Player help
    'aide.backToPlayer': 'Back to the player',
  },

  it: {
    'site.title': 'Il Sistema G',
    'site.tagline': "L'intonazione giusta finalmente trovata",
    'site.description':
      "Il Sistema G di Nabih Gédéon: la teoria degli intervalli che rende applicabile l'intonazione giusta. Posizioni, espressività e semitono naturale.",

    'nav.home': 'Pagina iniziale',
    'nav.literature': 'Letteratura',
    'nav.theory': 'Teoria',
    'nav.player': 'Player interattivo',
    'nav.bio': "L'autore",
    'nav.skipToContent': 'Vai al contenuto',

    'home.hero.overline': 'Teoria degli intervalli musicali',
    'home.hero.title': "L'intonazione giusta finalmente trovata",
    'home.hero.subtitle': 'Il Sistema G: posizioni ed espressività',
    'home.hero.author': 'di Nabih Gédéon',
    'home.hero.lede':
      "Una ricerca ragionata, metodica e progressiva dell'intonazione giusta. Dopo una rassegna dei sistemi del passato, la semplice logica conduce dai rapporti di frequenza alla scoperta del semitono naturale, alla costruzione delle scale e alla marcatura delle partiture.",

    'home.explore.title': 'Esplorare il progetto',
    'home.explore.lede':
      'Questo sito raccoglie i pezzi del progetto Sistema G: i testi che lo circondano e la teoria stessa, prolungata da un ascolto interattivo.',

    'home.card.literature.title': 'Letteratura',
    'home.card.literature.desc':
      'Le opere, i riassunti e le traduzioni nati attorno alla teoria degli intervalli — i pezzi letterari del puzzle.',
    'home.card.literature.cta': 'Scoprire i testi',

    'home.card.theory.title': 'Teoria',
    'home.card.theory.desc':
      'Il semitono naturale (22/21), le posizioni bassa, media e alta, la codifica e la marcatura delle partiture.',
    'home.card.theory.cta': 'Comprendere il sistema',

    'home.card.player.title': 'Player interattivo',
    'home.card.player.desc':
      "Un lettore audiovisivo per sentire la teoria: udire le posizioni e l'espressività, nota dopo nota.",
    'home.card.player.cta': 'Ascoltare e sentire',

    'home.findings.title': 'Due scoperte capitali',
    'home.findings.one.title': 'Il semitono naturale',
    'home.findings.one.desc':
      'La rappresentazione esatta del semitono — rapporto di frequenza 22/21 — da cui deriva tutto il resto.',
    'home.findings.two.title': 'Le posizioni e la loro espressività',
    'home.findings.two.desc':
      'Bassa, media e alta: ogni nota della scala occupa una posizione secondo la tonalità, e ogni posizione porta la propria espressività.',

    'home.quote':
      'Ecco finalmente — senza alcuna esagerazione — LA giusta teoria degli intervalli: evidentemente applicabile, e applicata, che si sposa perfettamente con la buona pratica.',

    'bio.overline': "L'autore",
    'bio.title': 'Nabih Gédéon',
    'bio.subtitle': "Musicologo, direttore di coro e traduttore — alla ricerca dell'intonazione giusta",
    'bio.heading': "Biografia dell'autore",

    'theory.index.lede':
      "La teoria degli intervalli del Sistema G, passo dopo passo: dall'intuizione iniziale alle regole, alla codifica e alla marcatura delle partiture.",
    'theory.sub.intro.title': 'Il Sistema G, in poche parole',
    'theory.sub.intro.desc':
      'Introduzione: perché una nuova teoria degli intervalli, e perché cambia tutto.',
    'theory.sub.rules.title': 'Le regole delle posizioni',
    'theory.sub.rules.desc':
      'Posizioni bassa, media e alta; la loro espressività e la loro logica di costruzione.',
    'theory.sub.coding.title': 'Codifica e semitono naturale',
    'theory.sub.coding.desc':
      'La rappresentazione esatta del semitono (22/21) e la codifica degli intervalli.',
    'theory.sub.marking.title': 'Marcatura delle partiture',
    'theory.sub.marking.desc':
      "Occidentali, arabe e bizantine: trovare l'intonazione giusta al primo colpo.",
    'theory.sub.compare.title': 'Di fronte a Partch, Johnston e al maqam',
    'theory.sub.compare.desc':
      'In prospettiva: dove collocare il Sistema G tra le altre intonazioni giuste e le tradizioni modali.',
    'badge.available': 'Disponibile',
    'badge.soon': 'In arrivo',

    'footer.rights': 'Tutti i diritti riservati.',
    'footer.tagline': 'Teoria degli intervalli musicali',
    'footer.legacy': 'Sito storico',

    'intro.preliminary': 'Osservazione preliminare',
    'lang.label': 'Lingua',
    'page.wip': 'Questa sezione è in preparazione.',
    'page.wip.detail':
      'I pezzi del puzzle saranno aggiunti gradualmente. Torna presto a trovarci.',
    'back.home': 'Torna alla home',

    // Player interattivo
    'player.lede':
      'Il player del Sistema G riproduce le partiture in intonazione giusta, esattamente come le calcolava il software storico del 2009 — fedelmente portato sul web.',
    'player.library': 'Biblioteca',
    'player.library.hint': 'Oppure trascina un file .txt di partitura sulla tabella qui sotto.',
    'player.scale': 'Scala',
    'player.score': 'Partitura',
    'player.play': 'Riproduci',
    'player.pause': 'Pausa',
    'player.stop': 'Stop',
    'player.playFrom': 'Riproduci dalla riga scelta',
    'player.instrument': 'Strumento',
    'player.followScore': 'Segui i cambi « $ » della partitura',
    'player.transpose': 'Trasposizione',
    'player.mode': 'Uscita',
    'player.mode.instrument': 'Strumento',
    'player.mode.sine': 'Onda sinusoidale',
    'player.mode.square': 'Onda quadra',
    'player.duration': 'Durata totale',
    'player.notes': 'note',
    'player.errors': 'Errori nella partitura',
    'player.col.symbol': 'Simbolo',
    'player.col.dur': 'Durata',
    'player.status.loaded': 'Partitura caricata',
    'player.status.playing': 'Riproduzione…',
    'player.status.paused': 'In pausa',
    'player.status.stopped': 'Fermato',
    'player.status.loading': 'Caricamento dei suoni…',
    'player.empty': 'Scegli un brano dalla biblioteca per iniziare.',
    'player.legacy.credit':
      'Basato sul « G System player » originale (© 2009 Faraj Elias), portato su Web Audio.',
    'player.search': 'Cerca',
    'player.search.placeholder': 'Titolo o compositore…',
    'player.category': 'Categoria',
    'player.category.all': 'Tutte',
    'player.pieces': 'brani',
    'player.playSelection': 'Riproduci la selezione',
    'player.warnings': 'Avvertenze',
    'player.selection.hint':
      'Clic: scegli una riga · Maiusc+clic: estendi la selezione · Doppio clic: vai alla definizione del simbolo nella scala.',

    // Aiuto del player
    'aide.backToPlayer': 'Torna al player',
  },
} as const;

export type UiKey = keyof (typeof ui)['fr'];
