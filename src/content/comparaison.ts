/**
 * « Le Système G face à Partch, Johnston et au maqam » — mise en perspective
 * de la théorie de Nabih Gédéon parmi les autres démarches d'intonation juste
 * et les traditions modales à intervalles neutres.
 *
 * Le texte est découpé en blocs typés (essai + tableau comparatif + sources),
 * sur le même modèle que `introduction.ts`. Français = source ; anglais et
 * italien = traductions de travail.
 *
 * Prudence historique : les données sur le Système G proviennent des notices
 * d'éditeur et de bibliothèque (l'ancien site intervalles-systeme-g.com ayant
 * disparu). Table des ratios complète et définition exacte des positions
 * restent à confirmer sur les documents originaux de l'auteur.
 */

export type CompareLinkTarget = 'theory' | 'intro' | 'player';

export type CompareBlock =
  | { t: 'p'; text: string }
  | { t: 'h2'; text: string }
  | { t: 'epigraph'; text: string }
  | { t: 'list'; items: string[] }
  | { t: 'table'; caption: string; headers: string[]; rows: string[][] }
  | { t: 'callout'; text: string; links: { label: string; to: CompareLinkTarget }[] }
  | { t: 'sources'; label: string; items: { label: string; href: string }[] };

export interface CompareDoc {
  overline: string;
  title: string;
  subtitle: string;
  aside: string;
  blocks: CompareBlock[];
}

export const comparaison: Record<'fr' | 'en' | 'it', CompareDoc> = {
  fr: {
    overline: 'Théorie · Mise en perspective',
    title: 'Le Système G face à Partch, Johnston et au maqam',
    subtitle:
      "Où situer une intonation juste sans le nombre 5, entre l'utopie instrumentale de Partch, la notation savante de Johnston et la tradition modale arabo-turque",
    aside:
      "Cette mise en perspective s'appuie sur les notices d'éditeur et de bibliothèque du Système G (l'ancien site ayant disparu) et sur la logique interne de la théorie. La table complète des rapports et la définition exacte des trois positions restent à confirmer sur les documents originaux de l'auteur.",
    blocks: [
      {
        t: 'epigraph',
        text:
          "Tous refusent le même compromis — les douze demi-tons égaux — mais chacun revient à la justesse par un chemin différent.",
      },
      { t: 'h2', text: 'Un socle commun : le refus du tempérament égal' },
      {
        t: 'p',
        text:
          "Le Système G partage avec Harry Partch, Ben Johnston et la théorie du maqam un même point de départ : le rejet du tempérament égal à douze demi-tons, au profit d'intervalles « justes » — des rapports de fréquences simples issus de la résonance naturelle. C'est la grande famille de l'intonation juste et du renouveau microtonal du XXᵉ siècle. Jusque-là, Gédéon est un cousin de Partch et de Johnston, et un interlocuteur naturel des traditions modales orientales.",
      },
      { t: 'h2', text: 'Le trait distinctif : une intonation juste sans le nombre 5' },
      {
        t: 'p',
        text:
          "Ce qui isole le Système G tient à un choix arithmétique. Là où presque toute la musique occidentale — savante ou tempérée — repose sur la tierce majeure de rapport 5/4, Gédéon construit ses « intervalles naturels » sur les seuls nombres premiers 2, 3, 7 et 11, en excluant délibérément le 5. Sa découverte fondatrice (2005) est la représentation exacte du demi-ton par le rapport 22/21 (environ 80,5 cents ; 22 = 2 × 11, 21 = 3 × 7), d'où il fait dériver tout le reste. Cette signature — septimale et undécimale, mais sans tierce de 5 — est précisément ce qui éloigne le Système G de la sonorité occidentale de Partch et de Johnston, et le rapproche du monde des intervalles neutres.",
      },
      { t: 'h2', text: 'Face à Harry Partch (1901–1974)' },
      {
        t: 'p',
        text:
          "Partch et Gédéon partagent l'ambition de fixer un système juste explicite atteignant la limite 11. Mais Partch inclut le nombre 5 : sa tierce 5/4 et sa sixte 5/3 sont des piliers de son « diamant de tonalité », et il matérialise un gamut fermé de 43 hauteurs qu'il joue sur des instruments qu'il a lui-même conçus et construits — une musique « corporelle », pensée pour la scène. Le Système G, lui, reste du côté de la théorie et de la pédagogie : un cadre analytique — le demi-ton générateur, puis les positions — démontré par un logiciel de synthèse plutôt que par un orchestre d'instruments neufs.",
      },
      { t: 'h2', text: 'Face à Ben Johnston (1926–2019)' },
      {
        t: 'p',
        text:
          "Johnston propose avant tout un système de notation destiné aux interprètes acoustiques occidentaux : il conserve l'ossature diatonique juste à limite 5 et note les inflexions, en étendant les accidents jusqu'à des nombres premiers très élevés (jusqu'au 31ᵉ partiel dans son Quatuor nº 9). Gédéon fait l'inverse : il abandonne cette ossature de 5 et place le 7 et le 11 au cœur du langage. Là où Johnston outille le quatuor à cordes, le Système G s'oriente vers une pratique vocale et fretée plus proche de l'Orient, restituée par le calcul.",
      },
      { t: 'h2', text: 'Face à la théorie du maqam' },
      {
        t: 'p',
        text:
          "C'est ici que le Système G est le plus proche, en esprit. Sa notion de « positions » — une même note prend une position basse, moyenne ou haute selon la tonalité, chacune porteuse d'une expressivité propre — décalque presque la pratique du maqam, où l'intonation est contextuelle et « floue » : la hauteur d'un degré neutre glisse selon le maqam, la région et le sens mélodique. Son recours au 11 rejoint d'ailleurs les rationalisations undécimales par lesquelles les théoriciens modélisent la tierce neutre arabo-turque (11/9, ou le 27/22 attribué à Zalzal). La différence est décisive : l'intonation du maqam est orale, plurielle, non fixée, et résiste à une table de rapports unique ; le Système G propose au contraire un système fermé et chiffré censé capturer cette expressivité. En somme, Gédéon fait pour le monde des intervalles neutres orientaux ce que Partch a fait pour une utopie occidentale spéculative : transformer une pratique souple en une grammaire d'intonation juste explicite — geste cohérent avec sa biographie libano-française, à la charnière des deux cultures.",
      },
      { t: 'h2', text: 'Tableau comparatif' },
      {
        t: 'table',
        caption:
          'Quatre approches de la justesse, comparées selon sept dimensions. Le Système G se distingue surtout par l’exclusion du nombre 5 et par ses « positions » expressives.',
        headers: ['', 'Système G', 'Harry Partch', 'Ben Johnston', 'Maqam'],
        rows: [
          [
            'Auteur & période',
            'Nabih Gédéon (Liban, né 1946) ; publié à partir de 2005',
            'H. Partch (États-Unis, 1901–1974) ; Genesis of a Music, 1947',
            'B. Johnston (États-Unis, 1926–2019)',
            'Tradition collective arabo-turque, séculaire',
          ],
          [
            'Nombres premiers',
            '2, 3, 7, 11 — sans le 5',
            '2, 3, 5, 7, 11 (limite 11)',
            'Base 5 étendue jusqu’au 31ᵉ partiel et au-delà',
            '3 (pythagoricien) + neutres rationalisés par le 11',
          ],
          [
            'Intervalle emblématique',
            'Demi-ton naturel 22/21 (≈ 80,5 cents)',
            'Diamant de tonalité à limite 11 ; 43 hauteurs',
            'Diatonique juste de limite 5, prise comme référence notée',
            'Tierce neutre (≈ ¾ de ton) ; jins / tétracordes',
          ],
          [
            'Nature du système',
            'Théorie chiffrée fermée + logiciel de démonstration',
            'Gamut fixe de 43 sons + instruments construits',
            'Système de notation pour instruments acoustiques',
            'Système modal oral, non fixé',
          ],
          [
            'Rapport à la note',
            '« Positions » basse / moyenne / haute selon la tonalité',
            'Hauteurs fixes (Otonalité / Utonalité)',
            'Hauteur déduite de la notation et du contexte harmonique',
            'Intonation contextuelle « floue », variable',
          ],
          [
            'Finalité',
            'Théorie + pédagogie : la justesse « du premier coup »',
            'Composition et lutherie',
            'Notation et interprétation (quatuors à cordes)',
            'Pratique modale vivante',
          ],
          [
            'Transmission',
            'Écrite (livre, logiciel)',
            'Écrite + instruments dédiés',
            'Partition notée',
            'Orale et auditive',
          ],
        ],
      },
      { t: 'h2', text: 'En une phrase' },
      {
        t: 'p',
        text:
          "Le Système G est une intonation juste à limite 11 mais sans le nombre 5, qui rationalise en rapports fixes (le demi-ton 22/21) et en « positions » expressives le territoire des intervalles neutres que le maqam laisse, lui, à l'oralité — se plaçant ainsi entre l'utopie instrumentale de Partch, la notation savante de Johnston et la tradition modale arabo-turque.",
      },
      {
        t: 'callout',
        text: 'Approfondir la théorie et l’entendre',
        links: [
          { label: 'Le Système G, en quelques mots', to: 'intro' },
          { label: 'Écouter dans le player', to: 'player' },
        ],
      },
      {
        t: 'sources',
        label: 'Sources et repères',
        items: [
          {
            label: 'Système G — notice BnF',
            href: 'https://catalogue.bnf.fr/ark:/12148/cb41427448h',
          },
          {
            label: 'Système G — Bibliothèques de Paris (coup de cœur 2016)',
            href: 'https://bibliotheques.paris.fr/2016/doc/SYRACUSE/1035561/le-systeme-g-l-intonation-juste-enfin-trouvee-les-intervalles-naturels-a-base-2-3-7-et-11-position-e',
          },
          {
            label: 'Harry Partch — la gamme à 43 sons (Wikipedia)',
            href: "https://en.wikipedia.org/wiki/Harry_Partch's_43-tone_scale",
          },
          {
            label: 'Ben Johnston (Wikipedia)',
            href: 'https://en.wikipedia.org/wiki/Ben_Johnston_(composer)',
          },
          {
            label: 'Maqam arabe (Wikipedia)',
            href: 'https://en.wikipedia.org/wiki/Arabic_maqam',
          },
        ],
      },
    ],
  },

  en: {
    overline: 'Theory · In perspective',
    title: 'The G System alongside Partch, Johnston and maqam theory',
    subtitle:
      'Where to place a just intonation without the prime 5 — between Partch’s instrumental utopia, Johnston’s scholarly notation and the Arab-Turkish modal tradition',
    aside:
      "This perspective draws on the publisher and library records of the G System (the original website being gone) and on the theory’s internal logic. The full table of ratios and the exact definition of the three positions remain to be confirmed from the author’s original documents.",
    blocks: [
      {
        t: 'epigraph',
        text:
          'They all reject the same compromise — the twelve equal semitones — but each returns to true intonation by a different path.',
      },
      { t: 'h2', text: 'A common ground: rejecting equal temperament' },
      {
        t: 'p',
        text:
          'The G System shares one starting point with Harry Partch, Ben Johnston and maqam theory: it rejects the twelve equal semitones of equal temperament in favour of “just” intervals — simple frequency ratios drawn from natural resonance. This is the broad family of just intonation and the twentieth-century microtonal revival. So far, Gédéon is a cousin of Partch and Johnston, and a natural interlocutor for the modal traditions of the East.',
      },
      { t: 'h2', text: 'The distinctive trait: just intonation without the prime 5' },
      {
        t: 'p',
        text:
          'What sets the G System apart is an arithmetical choice. Where almost all Western music — learned or tempered — rests on the major third with ratio 5/4, Gédéon builds his “natural intervals” on the prime numbers 2, 3, 7 and 11 alone, deliberately excluding 5. His founding discovery (2005) is the exact representation of the semitone as the ratio 22/21 (about 80.5 cents; 22 = 2 × 11, 21 = 3 × 7), from which everything else follows. This signature — septimal and undecimal, yet without a 5-based third — is precisely what distances the G System from the Western sound of Partch and Johnston, and brings it close to the world of neutral intervals.',
      },
      { t: 'h2', text: 'Alongside Harry Partch (1901–1974)' },
      {
        t: 'p',
        text:
          'Partch and Gédéon share the ambition of fixing an explicit just system reaching the 11-limit. But Partch includes the prime 5: his 5/4 third and 5/3 sixth are pillars of his “tonality diamond,” and he materialises a closed gamut of 43 pitches, played on instruments he designed and built himself — a “corporeal” music conceived for the stage. The G System stays on the side of theory and pedagogy: an analytical framework — the generating semitone, then the positions — demonstrated by synthesis software rather than by an orchestra of newly built instruments.',
      },
      { t: 'h2', text: 'Alongside Ben Johnston (1926–2019)' },
      {
        t: 'p',
        text:
          'Johnston offers above all a notation system for Western acoustic performers: he keeps the just diatonic 5-limit backbone and notates the inflections, extending his accidentals up to very high prime numbers (up to the 31st partial in his Quartet No. 9). Gédéon does the opposite: he abandons that 5-based backbone and places 7 and 11 at the heart of the language. Where Johnston equips the string quartet, the G System turns toward a vocal and fretted practice closer to the East, rendered through computation.',
      },
      { t: 'h2', text: 'Alongside maqam theory' },
      {
        t: 'p',
        text:
          'Here the G System is closest, in spirit. Its notion of “positions” — one and the same note takes a low, middle or high position according to the key, each carrying its own expressiveness — almost traces the practice of maqam, where intonation is contextual and “fuzzy”: the pitch of a neutral degree slides according to the maqam, the region and the melodic direction. Its use of 11, moreover, meets the undecimal rationalisations by which theorists model the Arab-Turkish neutral third (11/9, or the 27/22 attributed to Zalzal). The difference is decisive: maqam intonation is oral, plural, unfixed, and resists any single table of ratios; the G System, by contrast, offers a closed, numbered system meant to capture that very expressiveness. In short, Gédéon does for the world of Eastern neutral intervals what Partch did for a speculative Western utopia: he turns a supple practice into an explicit grammar of just intonation — a move consistent with his Lebanese-French biography, at the hinge of the two cultures.',
      },
      { t: 'h2', text: 'Comparative table' },
      {
        t: 'table',
        caption:
          'Four approaches to true intonation, compared across seven dimensions. The G System stands out above all by excluding the prime 5 and by its expressive “positions.”',
        headers: ['', 'G System', 'Harry Partch', 'Ben Johnston', 'Maqam'],
        rows: [
          [
            'Author & period',
            'Nabih Gédéon (Lebanon, b. 1946); published from 2005',
            'H. Partch (USA, 1901–1974); Genesis of a Music, 1947',
            'B. Johnston (USA, 1926–2019)',
            'Collective Arab-Turkish tradition, centuries old',
          ],
          [
            'Prime numbers',
            '2, 3, 7, 11 — without 5',
            '2, 3, 5, 7, 11 (11-limit)',
            '5-based, extended to the 31st partial and beyond',
            '3 (Pythagorean) + neutrals rationalised through 11',
          ],
          [
            'Emblematic interval',
            'Natural semitone 22/21 (≈ 80.5 cents)',
            '11-limit tonality diamond; 43 pitches',
            'Just 5-limit diatonic, taken as the notated reference',
            'Neutral third (≈ ¾ tone); ajnas / tetrachords',
          ],
          [
            'Nature of the system',
            'Closed numbered theory + demonstration software',
            'Fixed 43-pitch gamut + purpose-built instruments',
            'Notation system for acoustic instruments',
            'Oral modal system, unfixed',
          ],
          [
            'Relation to the note',
            '“Positions” low / middle / high according to the key',
            'Fixed pitches (Otonality / Utonality)',
            'Pitch inferred from notation and harmonic context',
            'Contextual, “fuzzy,” variable intonation',
          ],
          [
            'Purpose',
            'Theory + pedagogy: true intonation “at first sight”',
            'Composition and instrument building',
            'Notation and performance (string quartets)',
            'A living modal practice',
          ],
          [
            'Transmission',
            'Written (book, software)',
            'Written + dedicated instruments',
            'Notated score',
            'Oral and aural',
          ],
        ],
      },
      { t: 'h2', text: 'In one sentence' },
      {
        t: 'p',
        text:
          'The G System is an 11-limit just intonation but without the prime 5, which rationalises into fixed ratios (the 22/21 semitone) and expressive “positions” the territory of neutral intervals that maqam leaves to orality — placing itself between Partch’s instrumental utopia, Johnston’s scholarly notation and the Arab-Turkish modal tradition.',
      },
      {
        t: 'callout',
        text: 'Go deeper into the theory and hear it',
        links: [
          { label: 'The G System, in a few words', to: 'intro' },
          { label: 'Listen in the player', to: 'player' },
        ],
      },
      {
        t: 'sources',
        label: 'Sources and pointers',
        items: [
          {
            label: 'G System — BnF record',
            href: 'https://catalogue.bnf.fr/ark:/12148/cb41427448h',
          },
          {
            label: 'G System — Bibliothèques de Paris (2016 pick)',
            href: 'https://bibliotheques.paris.fr/2016/doc/SYRACUSE/1035561/le-systeme-g-l-intonation-juste-enfin-trouvee-les-intervalles-naturels-a-base-2-3-7-et-11-position-e',
          },
          {
            label: 'Harry Partch — the 43-tone scale (Wikipedia)',
            href: "https://en.wikipedia.org/wiki/Harry_Partch's_43-tone_scale",
          },
          {
            label: 'Ben Johnston (Wikipedia)',
            href: 'https://en.wikipedia.org/wiki/Ben_Johnston_(composer)',
          },
          {
            label: 'Arabic maqam (Wikipedia)',
            href: 'https://en.wikipedia.org/wiki/Arabic_maqam',
          },
        ],
      },
    ],
  },

  it: {
    overline: 'Teoria · In prospettiva',
    title: 'Il Sistema G di fronte a Partch, Johnston e alla teoria del maqam',
    subtitle:
      "Dove collocare un'intonazione giusta senza il numero 5 — tra l'utopia strumentale di Partch, la notazione dotta di Johnston e la tradizione modale arabo-turca",
    aside:
      "Questa messa in prospettiva si basa sulle schede editoriali e bibliotecarie del Sistema G (essendo scomparso il sito originale) e sulla logica interna della teoria. La tabella completa dei rapporti e la definizione esatta delle tre posizioni restano da confermare sui documenti originali dell'autore.",
    blocks: [
      {
        t: 'epigraph',
        text:
          'Tutti rifiutano lo stesso compromesso — i dodici semitoni uguali — ma ciascuno ritorna alla giusta intonazione per una via diversa.',
      },
      { t: 'h2', text: 'Un terreno comune: il rifiuto del temperamento equabile' },
      {
        t: 'p',
        text:
          "Il Sistema G condivide con Harry Partch, Ben Johnston e la teoria del maqam uno stesso punto di partenza: il rifiuto dei dodici semitoni uguali del temperamento equabile, a favore di intervalli « giusti » — semplici rapporti di frequenza tratti dalla risonanza naturale. È la grande famiglia dell'intonazione giusta e del rinnovamento microtonale del Novecento. Fin qui, Gédéon è un cugino di Partch e di Johnston, e un interlocutore naturale delle tradizioni modali orientali.",
      },
      { t: 'h2', text: 'Il tratto distintivo: un’intonazione giusta senza il numero 5' },
      {
        t: 'p',
        text:
          "Ciò che isola il Sistema G è una scelta aritmetica. Là dove quasi tutta la musica occidentale — dotta o temperata — poggia sulla terza maggiore di rapporto 5/4, Gédéon costruisce i suoi « intervalli naturali » sui soli numeri primi 2, 3, 7 e 11, escludendo deliberatamente il 5. La sua scoperta fondante (2005) è la rappresentazione esatta del semitono con il rapporto 22/21 (circa 80,5 cents; 22 = 2 × 11, 21 = 3 × 7), da cui fa derivare tutto il resto. Questa firma — settimale e undecimale, ma senza terza di 5 — è precisamente ciò che allontana il Sistema G dalla sonorità occidentale di Partch e di Johnston, avvicinandolo al mondo degli intervalli neutri.",
      },
      { t: 'h2', text: 'Di fronte a Harry Partch (1901–1974)' },
      {
        t: 'p',
        text:
          "Partch e Gédéon condividono l'ambizione di fissare un sistema giusto esplicito che raggiunge il limite 11. Ma Partch include il numero 5: la sua terza 5/4 e la sua sesta 5/3 sono pilastri del suo « diamante di tonalità », ed egli materializza un gamut chiuso di 43 altezze, suonate su strumenti che ha ideato e costruito lui stesso — una musica « corporea », pensata per la scena. Il Sistema G, invece, resta dal lato della teoria e della pedagogia: un quadro analitico — il semitono generatore, poi le posizioni — dimostrato da un software di sintesi anziché da un'orchestra di strumenti nuovi.",
      },
      { t: 'h2', text: 'Di fronte a Ben Johnston (1926–2019)' },
      {
        t: 'p',
        text:
          "Johnston propone anzitutto un sistema di notazione destinato agli interpreti acustici occidentali: conserva l'ossatura diatonica giusta di limite 5 e annota le inflessioni, estendendo le alterazioni fino a numeri primi molto elevati (fino al 31º parziale nel suo Quartetto n. 9). Gédéon fa l'inverso: abbandona quest'ossatura di 5 e pone il 7 e l'11 al cuore del linguaggio. Là dove Johnston attrezza il quartetto d'archi, il Sistema G si orienta verso una pratica vocale e « a tasti » più vicina all'Oriente, restituita dal calcolo.",
      },
      { t: 'h2', text: 'Di fronte alla teoria del maqam' },
      {
        t: 'p',
        text:
          "È qui che il Sistema G è più vicino, nello spirito. La sua nozione di « posizioni » — una stessa nota assume una posizione bassa, media o alta secondo la tonalità, ciascuna portatrice di una propria espressività — ricalca quasi la pratica del maqam, dove l'intonazione è contestuale e « sfumata »: l'altezza di un grado neutro scivola secondo il maqam, la regione e il senso melodico. Il suo ricorso all'11, del resto, incontra le razionalizzazioni undecimali con cui i teorici modellano la terza neutra arabo-turca (11/9, o il 27/22 attribuito a Zalzal). La differenza è decisiva: l'intonazione del maqam è orale, plurale, non fissata, e resiste a una tabella unica di rapporti; il Sistema G, al contrario, propone un sistema chiuso e cifrato inteso a catturare proprio quell'espressività. In sintesi, Gédéon fa per il mondo degli intervalli neutri orientali ciò che Partch ha fatto per un'utopia occidentale speculativa: trasforma una pratica flessibile in una grammatica esplicita d'intonazione giusta — gesto coerente con la sua biografia libano-francese, alla cerniera delle due culture.",
      },
      { t: 'h2', text: 'Tabella comparativa' },
      {
        t: 'table',
        caption:
          "Quattro approcci alla giusta intonazione, confrontati secondo sette dimensioni. Il Sistema G si distingue soprattutto per l'esclusione del numero 5 e per le sue « posizioni » espressive.",
        headers: ['', 'Sistema G', 'Harry Partch', 'Ben Johnston', 'Maqam'],
        rows: [
          [
            'Autore & periodo',
            'Nabih Gédéon (Libano, n. 1946); pubblicato dal 2005',
            'H. Partch (USA, 1901–1974); Genesis of a Music, 1947',
            'B. Johnston (USA, 1926–2019)',
            'Tradizione collettiva arabo-turca, secolare',
          ],
          [
            'Numeri primi',
            '2, 3, 7, 11 — senza il 5',
            '2, 3, 5, 7, 11 (limite 11)',
            'Base 5 estesa fino al 31º parziale e oltre',
            '3 (pitagorico) + neutri razionalizzati con l’11',
          ],
          [
            'Intervallo emblematico',
            'Semitono naturale 22/21 (≈ 80,5 cents)',
            'Diamante di tonalità a limite 11; 43 altezze',
            'Diatonica giusta di limite 5, presa come riferimento notato',
            'Terza neutra (≈ ¾ di tono); ajnas / tetracordi',
          ],
          [
            'Natura del sistema',
            'Teoria cifrata chiusa + software dimostrativo',
            'Gamut fisso di 43 suoni + strumenti costruiti',
            'Sistema di notazione per strumenti acustici',
            'Sistema modale orale, non fissato',
          ],
          [
            'Rapporto con la nota',
            '« Posizioni » bassa / media / alta secondo la tonalità',
            'Altezze fisse (Otonalità / Utonalità)',
            'Altezza dedotta dalla notazione e dal contesto armonico',
            'Intonazione contestuale « sfumata », variabile',
          ],
          [
            'Finalità',
            'Teoria + pedagogia: la giusta intonazione « al primo colpo »',
            'Composizione e liuteria',
            'Notazione e interpretazione (quartetti d’archi)',
            'Pratica modale viva',
          ],
          [
            'Trasmissione',
            'Scritta (libro, software)',
            'Scritta + strumenti dedicati',
            'Partitura notata',
            'Orale e uditiva',
          ],
        ],
      },
      { t: 'h2', text: 'In una frase' },
      {
        t: 'p',
        text:
          "Il Sistema G è un'intonazione giusta a limite 11 ma senza il numero 5, che razionalizza in rapporti fissi (il semitono 22/21) e in « posizioni » espressive il territorio degli intervalli neutri che il maqam lascia invece all'oralità — collocandosi così tra l'utopia strumentale di Partch, la notazione dotta di Johnston e la tradizione modale arabo-turca.",
      },
      {
        t: 'callout',
        text: 'Approfondire la teoria e ascoltarla',
        links: [
          { label: 'Il Sistema G, in poche parole', to: 'intro' },
          { label: 'Ascoltare nel player', to: 'player' },
        ],
      },
      {
        t: 'sources',
        label: 'Fonti e riferimenti',
        items: [
          {
            label: 'Sistema G — scheda BnF',
            href: 'https://catalogue.bnf.fr/ark:/12148/cb41427448h',
          },
          {
            label: 'Sistema G — Bibliothèques de Paris (scelta 2016)',
            href: 'https://bibliotheques.paris.fr/2016/doc/SYRACUSE/1035561/le-systeme-g-l-intonation-juste-enfin-trouvee-les-intervalles-naturels-a-base-2-3-7-et-11-position-e',
          },
          {
            label: 'Harry Partch — la scala a 43 suoni (Wikipedia)',
            href: "https://en.wikipedia.org/wiki/Harry_Partch's_43-tone_scale",
          },
          {
            label: 'Ben Johnston (Wikipedia)',
            href: 'https://en.wikipedia.org/wiki/Ben_Johnston_(composer)',
          },
          {
            label: 'Maqam arabo (Wikipedia)',
            href: 'https://en.wikipedia.org/wiki/Arabic_maqam',
          },
        ],
      },
    ],
  },
};
