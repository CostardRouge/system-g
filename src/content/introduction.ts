/**
 * « Introduction au Système G » — reprise de l'ancienne page d'accueil du site
 * historique (intervalles-systeme-g.com), réintégrée comme page d'entrée de la
 * rubrique Théorie.
 *
 * Le texte est découpé en blocs typés pour un rendu propre (essai, exemple,
 * appels à l'écoute, plaidoyer). Les anciens liens web.archive sont remplacés
 * par des cibles internes ('theory' → /theorie, 'player' → /player), résolues
 * dans le composant de rendu.
 *
 * Français = source. Anglais = traduction de travail.
 */

export type LinkTarget = 'theory' | 'player';

export type IntroBlock =
  | { t: 'p'; text: string }
  | { t: 'h2'; text: string }
  | { t: 'list'; items: string[] }
  | { t: 'epigraph'; text: string }
  | { t: 'callout'; text: string; links: { label: string; to: LinkTarget }[] }
  | { t: 'note'; lines: string[] }
  | { t: 'resources'; items: { label: string; desc: string; to: LinkTarget }[] };

export interface IntroDoc {
  overline: string;
  title: string;
  subtitle: string;
  aside: string;
  blocks: IntroBlock[];
}

export const introduction: Record<'fr' | 'en' | 'it', IntroDoc> = {
  fr: {
    overline: 'Introduction',
    title: 'Le Système G, en quelques mots',
    subtitle: "Pourquoi une nouvelle théorie des intervalles — et pourquoi elle change tout",
    aside:
      "Cher visiteur, je serai toujours très heureux de répondre à toute demande d’éclaircissements concernant le contenu de ces pages, par message ou par courriel.",
    blocks: [
      { t: 'epigraph', text: "Un proverbe dit : « Le mieux est l’ennemi du bien ». Je dis : « Le mieux n’est pas toujours l’ennemi du bien »." },
      {
        t: 'p',
        text:
          "Suivant la théorie du tempérament égal (une octave constituée de douze demi-tons égaux), largement acceptée et enseignée, les gammes sont composées d’une suite d’intervalles — un demi-ton, un ton, un ton et demi, trois quarts de ton dans la musique orientale — entre les notes de l’octave, en fonction des tonalités. Et alors, chacun ou presque, y compris parmi les théoriciens de la musique, croit fermement que chaque note occupe une seule position dans la gamme et que les intervalles sont immuables. On pourrait soutenir que la gamme tempérée est une excellente simplification, dans la mesure où elle permet à chacun d’acquérir relativement aisément une certaine connaissance musicale, les interprètes compensant le manque de précision de la théorie quant à la bonne position des sons par une bonne « oreille musicale ». Mais est-ce suffisant ?",
      },
      {
        t: 'p',
        text:
          "Il faut savoir qu’une même note peut occuper plusieurs positions, en fonction de la tonalité, et que les intervalles sont plus ou moins grands en conséquence.",
      },
      {
        t: 'p',
        text:
          "Ainsi, par exemple en DO majeur, nous constatons, quand on descend de la dominante SOL à la sous-dominante FA :",
      },
      {
        t: 'list',
        items: [
          "qu’on exécute un ton plus grand (ton maxime) que le ton ordinaire (celui qui sépare les notes DO-RE), le FA étant comme attiré par la médiante MI (demi-ton minime) ;",
          "et que, du même coup, la tierce majeure FA-LA est plus grande (tierce maxime) que la tierce majeure DO-MI ;",
          "que la tierce mineure RE-FA est plus petite (tierce minime) que la tierce mineure MI-SOL ;",
          "et que la quarte DO-FA est plus petite (quarte faible) que la quarte juste SOL-DO, etc.",
        ],
      },
      {
        t: 'p',
        text:
          "Le tandem « théorie–bonne oreille » fonctionne tant bien que mal ; une petite minorité de pratiquants parvient à l’excellence, par opposition à la très grande majorité des soi-disant professionnels et des amateurs. Prenez, par exemple, les meilleurs chanteurs d’opéra : en dépit d’une voix de grande qualité et d’une interprétation époustouflante, il leur arrive d’avoir des moments de faiblesse, de doute, de perplexité, à cause d’une ou plusieurs notes qui se suivent et dont la justesse laisse à désirer. Mais comme le résultat final — voix, interprétation, émotion — est satisfaisant, ou supposé tel, pourquoi aller plus loin, n’est-ce pas ?",
      },
      {
        t: 'p',
        text:
          "Je dis au contraire : pourquoi se contenter de ce qui est bien quand on peut se rapprocher de la perfection ? Et s’il existait un moyen facile d’atteindre la justesse directement, à tout moment et sans aucune hésitation, pour les meilleurs pratiquants, mais surtout pour tous les autres qui en manquent terriblement ?",
      },
      {
        t: 'callout',
        text:
          "Ce moyen existe : c’est le « Système G » qui, grâce à la bonne représentation des intervalles — notamment du demi-ton (22/21) — offre au monde la fantastique découverte des positions (basse, moyenne et haute) que chaque note peut occuper en fonction de la tonalité.",
        links: [{ label: 'Les règles concernant les positions', to: 'theory' }],
      },
      {
        t: 'p',
        text:
          "Que l’on se rassure : c’est d’une telle simplicité ! Je ne suis moi-même ni mathématicien, ni physicien, ni informaticien, ni acousticien… La simple logique qui m’a amené à découvrir les intervalles naturels et les positions — avec chacune son expressivité propre, qui permet de la capter plus aisément — est à la portée de chacun. Sans trop d’effort, avec la vulgarisation du « Système G », le plus grand nombre accèdera à la juste intonation.",
      },
      { t: 'epigraph', text: "Le mieux n’est pas toujours l’ennemi du bien." },
      {
        t: 'callout',
        text:
          "Pour une démonstration par l’ordinateur et une illustration sonore des intervalles du Système G et de la juste intonation :",
        links: [
          { label: 'Écouter : musique occidentale', to: 'player' },
          { label: 'Écouter : musique orientale', to: 'player' },
        ],
      },
      { t: 'h2', text: 'Révolutionnaire ?' },
      {
        t: 'p',
        text:
          "Oh, oui ! Il a fallu attendre le XXIᵉ siècle — soit 13,8 milliards d’années après le big bang ! — pour voir se mettre en place LA BONNE théorie des intervalles et découvrir les différentes positions des notes. Pourtant, ce système est tellement simple. Notez bien qu’il ne s’agit nullement d’un amusement théorique. Contrairement aux autres systèmes d’intervalles qui nous sont parvenus et que l’on peut ranger au fond d’un tiroir pour cause d’inapplicabilité, le Système G correspond parfaitement à la bonne pratique et garantit la meilleure interprétation qui soit.",
      },
      {
        t: 'note',
        lines: [
          "Monsieur le Directeur de la Musique,",
          "On y arrivera un jour, c’est inéluctable — alors à quoi bon attendre ? Il faut une réforme. Créons dès à présent une commission chargée d’examiner le « Système G » pour décider de sa mise au programme dans les écoles et les conservatoires. Nous avons là une bonne graine à semer.",
        ],
      },
      { t: 'h2', text: 'Explorer plus loin' },
      {
        t: 'resources',
        items: [
          {
            label: "L’ouvrage de référence",
            desc: "« L’Intonation juste enfin trouvée ! » — le fruit d’une longue recherche, hors des sentiers battus, qui a permis d’échafauder, grâce à la représentation enfin exacte du demi-ton naturel (22/21), le bon système d’intervalles.",
            to: 'theory',
          },
          {
            label: 'Le G System Player',
            desc: "Un outil extraordinairement simple, téléchargeable gratuitement, qui permet de coder une mélodie (note, durée) pour écouter, comparer, apprendre et faire apprendre.",
            to: 'player',
          },
          {
            label: 'Écouter : musique occidentale et orientale',
            desc: "Des morceaux codés sur le G System Player et enregistrés : une illustration sonore et une démonstration par l’ordinateur du bien-fondé du Système G.",
            to: 'player',
          },
          {
            label: 'Marquage des partitions',
            desc: "Trouver la juste intonation du premier coup grâce au marquage — tonalités occidentales, arabes et byzantines. (Bientôt disponible dans la rubrique Théorie.)",
            to: 'theory',
          },
        ],
      },
    ],
  },

  en: {
    overline: 'Introduction',
    title: 'The G System, in a few words',
    subtitle: 'Why a new theory of intervals — and why it changes everything',
    aside:
      'Dear visitor, I will always be glad to answer any request for clarification about the content of these pages, by message or by email.',
    blocks: [
      { t: 'epigraph', text: 'A proverb says: “The better is the enemy of the good.” I say: “The better is not always the enemy of the good.”' },
      {
        t: 'p',
        text:
          'According to the theory of equal temperament (an octave made of twelve equal semitones), widely accepted and taught, scales are built from a sequence of intervals — a semitone, a tone, a tone and a half, three-quarter tones in Eastern music — between the notes of the octave, depending on the key. And so almost everyone, including music theorists, firmly believes that each note occupies a single position in the scale and that intervals are immutable. One could argue that the tempered scale is an excellent simplification, in that it lets anyone acquire a certain musical knowledge relatively easily, performers making up for the theory’s lack of precision about the right pitch of notes with a good “musical ear.” But is that enough?',
      },
      {
        t: 'p',
        text:
          'The truth is that one and the same note can occupy several positions, depending on the key, and that the intervals are larger or smaller as a result.',
      },
      {
        t: 'p',
        text:
          'Thus, for example in C major, we observe, when descending from the dominant G to the subdominant F:',
      },
      {
        t: 'list',
        items: [
          'that one plays a larger whole tone (maximal tone) than the ordinary tone (the one separating C-D), the F being as if drawn toward the mediant E (minimal semitone);',
          'and that, at the same stroke, the major third F-A is larger (maximal third) than the major third C-E;',
          'that the minor third D-F is smaller (minimal third) than the minor third E-G;',
          'and that the fourth C-F is smaller (weak fourth) than the perfect fourth G-C, and so on.',
        ],
      },
      {
        t: 'p',
        text:
          'The “theory plus good ear” pairing works after a fashion; a small minority of practitioners reach excellence, as opposed to the great majority of so-called professionals and amateurs. Take, for instance, the best opera singers: despite a voice of great quality and a breathtaking interpretation, they sometimes have moments of weakness, doubt or perplexity, because of one or more consecutive notes whose intonation leaves something to be desired. But since the final result — voice, interpretation, emotion — is satisfying, or assumed to be, why go further, right?',
      },
      {
        t: 'p',
        text:
          'On the contrary, I say: why settle for what is good when one can come closer to perfection? What if there were an easy way to reach true intonation directly, at any moment and without the slightest hesitation — for the finest practitioners, but above all for all the others who so badly lack it?',
      },
      {
        t: 'callout',
        text:
          'That way exists: it is the “G System” which, thanks to the correct representation of intervals — notably the semitone (22/21) — offers the world the wonderful discovery of the positions (low, middle and high) that each note can occupy depending on the key.',
        links: [{ label: 'The rules governing the positions', to: 'theory' }],
      },
      {
        t: 'p',
        text:
          'Rest assured: it is so simple! I am myself neither a mathematician, nor a physicist, nor a computer scientist, nor an acoustician… The simple logic that led me to discover natural intervals and positions — each with its own expressiveness, which makes it easier to grasp — is within everyone’s reach. Without too much effort, as the “G System” becomes widely known, the greatest number will attain just intonation.',
      },
      { t: 'epigraph', text: 'The better is not always the enemy of the good.' },
      {
        t: 'callout',
        text:
          'For a computer demonstration and an audible illustration of the intervals of the G System and of just intonation:',
        links: [
          { label: 'Listen: Western music', to: 'player' },
          { label: 'Listen: Eastern music', to: 'player' },
        ],
      },
      { t: 'h2', text: 'Revolutionary?' },
      {
        t: 'p',
        text:
          'Oh, yes! We had to wait for the 21st century — that is, 13.8 billion years after the big bang! — to see THE right theory of intervals fall into place and to discover the different positions of the notes. And yet this system is so simple. Note carefully that it is in no way a theoretical amusement. Unlike the other systems of intervals that have come down to us, which one can file away at the back of a drawer for being inapplicable, the G System matches good practice perfectly and guarantees the finest possible interpretation.',
      },
      {
        t: 'note',
        lines: [
          'To the Director of Music,',
          'We will get there one day — it is inevitable — so why wait? A reform is needed. Let us set up, here and now, a commission to examine the “G System” and decide on its inclusion in the curricula of schools and conservatories. Here is a good seed to sow.',
        ],
      },
      { t: 'h2', text: 'Explore further' },
      {
        t: 'resources',
        items: [
          {
            label: 'The reference book',
            desc: '“Just Intonation, Found at Last!” — the fruit of a long, unconventional search that made it possible to build, thanks to the at-last-exact representation of the natural semitone (22/21), the right system of intervals.',
            to: 'theory',
          },
          {
            label: 'The G System Player',
            desc: 'An extraordinarily simple, freely downloadable tool that lets you encode a melody (note, duration) to listen, compare, learn and teach.',
            to: 'player',
          },
          {
            label: 'Listen: Western and Eastern music',
            desc: 'Pieces encoded on the G System Player and recorded: an audible illustration and a computer demonstration of the soundness of the G System.',
            to: 'player',
          },
          {
            label: 'Marking the scores',
            desc: 'Find just intonation at first sight thanks to score marking — Western, Arabic and Byzantine keys. (Coming soon in the Theory section.)',
            to: 'theory',
          },
        ],
      },
    ],
  },

  it: {
    overline: 'Introduzione',
    title: 'Il Sistema G, in poche parole',
    subtitle: 'Perché una nuova teoria degli intervalli — e perché cambia tutto',
    aside:
      'Caro visitatore, sarò sempre molto lieto di rispondere a qualsiasi richiesta di chiarimento sul contenuto di queste pagine, per messaggio o per email.',
    blocks: [
      { t: 'epigraph', text: 'Un proverbio dice: « Il meglio è nemico del bene ». Io dico: « Il meglio non è sempre nemico del bene ».' },
      {
        t: 'p',
        text:
          "Secondo la teoria del temperamento equabile (un’ottava composta da dodici semitoni uguali), largamente accettata e insegnata, le scale sono composte da una successione di intervalli — un semitono, un tono, un tono e mezzo, tre quarti di tono nella musica orientale — tra le note dell’ottava, secondo le tonalità. E allora, quasi tutti, compresi i teorici della musica, credono fermamente che ogni nota occupi una sola posizione nella scala e che gli intervalli siano immutabili. Si potrebbe sostenere che la scala temperata sia un’eccellente semplificazione, in quanto permette a chiunque di acquisire con relativa facilità una certa conoscenza musicale, gli interpreti compensando la mancanza di precisione della teoria quanto alla giusta posizione dei suoni con un buon « orecchio musicale ». Ma è sufficiente?",
      },
      {
        t: 'p',
        text:
          'Bisogna sapere che una stessa nota può occupare più posizioni, secondo la tonalità, e che gli intervalli sono più o meno grandi di conseguenza.',
      },
      {
        t: 'p',
        text:
          'Così, per esempio in DO maggiore, constatiamo, quando si scende dalla dominante SOL alla sottodominante FA:',
      },
      {
        t: 'list',
        items: [
          'che si esegue un tono più grande (tono massimo) del tono ordinario (quello che separa le note DO-RE), il FA essendo come attratto dalla mediante MI (semitono minimo);',
          'e che, al tempo stesso, la terza maggiore FA-LA è più grande (terza massima) della terza maggiore DO-MI;',
          'che la terza minore RE-FA è più piccola (terza minima) della terza minore MI-SOL;',
          'e che la quarta DO-FA è più piccola (quarta debole) della quarta giusta SOL-DO, ecc.',
        ],
      },
      {
        t: 'p',
        text:
          'Il binomio « teoria–buon orecchio » funziona alla meno peggio; una piccola minoranza di praticanti raggiunge l’eccellenza, in contrapposizione alla grande maggioranza dei cosiddetti professionisti e dei dilettanti. Prendete, per esempio, i migliori cantanti d’opera: nonostante una voce di grande qualità e un’interpretazione mozzafiato, capita loro di avere momenti di debolezza, di dubbio, di perplessità, a causa di una o più note consecutive la cui intonazione lascia a desiderare. Ma poiché il risultato finale — voce, interpretazione, emozione — è soddisfacente, o supposto tale, perché andare oltre, non è vero?',
      },
      {
        t: 'p',
        text:
          'Io dico al contrario: perché accontentarsi di ciò che è buono quando ci si può avvicinare alla perfezione? E se esistesse un modo facile per raggiungere l’intonazione giusta direttamente, in ogni momento e senza la minima esitazione — per i migliori praticanti, ma soprattutto per tutti gli altri che ne mancano terribilmente?',
      },
      {
        t: 'callout',
        text:
          'Questo modo esiste: è il « Sistema G » che, grazie alla giusta rappresentazione degli intervalli — in particolare del semitono (22/21) — offre al mondo la fantastica scoperta delle posizioni (bassa, media e alta) che ogni nota può occupare secondo la tonalità.',
        links: [{ label: 'Le regole riguardanti le posizioni', to: 'theory' }],
      },
      {
        t: 'p',
        text:
          'Ci si rassicuri: è di una tale semplicità! Io stesso non sono né matematico, né fisico, né informatico, né acustico… La semplice logica che mi ha portato a scoprire gli intervalli naturali e le posizioni — ciascuna con la propria espressività, che permette di coglierla più facilmente — è alla portata di tutti. Senza troppa fatica, con la divulgazione del « Sistema G », il maggior numero di persone accederà all’intonazione giusta.',
      },
      { t: 'epigraph', text: 'Il meglio non è sempre nemico del bene.' },
      {
        t: 'callout',
        text:
          'Per una dimostrazione al computer e un’illustrazione sonora degli intervalli del Sistema G e dell’intonazione giusta:',
        links: [
          { label: 'Ascoltare: musica occidentale', to: 'player' },
          { label: 'Ascoltare: musica orientale', to: 'player' },
        ],
      },
      { t: 'h2', text: 'Rivoluzionario?' },
      {
        t: 'p',
        text:
          'Oh, sì! È stato necessario attendere il XXI secolo — cioè 13,8 miliardi di anni dopo il big bang! — per veder prendere forma LA giusta teoria degli intervalli e scoprire le diverse posizioni delle note. Eppure questo sistema è così semplice. Si noti bene che non si tratta affatto di un divertimento teorico. Contrariamente agli altri sistemi di intervalli giunti fino a noi, che si possono riporre in fondo a un cassetto per inapplicabilità, il Sistema G corrisponde perfettamente alla buona pratica e garantisce la migliore interpretazione possibile.',
      },
      {
        t: 'note',
        lines: [
          'Signor Direttore della Musica,',
          'Ci arriveremo un giorno, è inevitabile — allora perché aspettare? Occorre una riforma. Creiamo fin d’ora una commissione incaricata di esaminare il « Sistema G » per decidere il suo inserimento nei programmi delle scuole e dei conservatori. Abbiamo qui un buon seme da seminare.',
        ],
      },
      { t: 'h2', text: 'Esplorare oltre' },
      {
        t: 'resources',
        items: [
          {
            label: 'L’opera di riferimento',
            desc: '« L’intonazione giusta finalmente trovata! » — il frutto di una lunga ricerca, fuori dai sentieri battuti, che ha permesso di costruire, grazie alla rappresentazione finalmente esatta del semitono naturale (22/21), il giusto sistema di intervalli.',
            to: 'theory',
          },
          {
            label: 'Il G System Player',
            desc: 'Uno strumento straordinariamente semplice, scaricabile gratuitamente, che permette di codificare una melodia (nota, durata) per ascoltare, confrontare, imparare e far imparare.',
            to: 'player',
          },
          {
            label: 'Ascoltare: musica occidentale e orientale',
            desc: 'Brani codificati sul G System Player e registrati: un’illustrazione sonora e una dimostrazione al computer della fondatezza del Sistema G.',
            to: 'player',
          },
          {
            label: 'Marcatura delle partiture',
            desc: 'Trovare l’intonazione giusta al primo colpo grazie alla marcatura — tonalità occidentali, arabe e bizantine. (Presto disponibile nella sezione Teoria.)',
            to: 'theory',
          },
        ],
      },
    ],
  },
};
