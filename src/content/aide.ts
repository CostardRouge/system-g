/**
 * Contenu de la rubrique d'aide du player interactif.
 *
 * Objectif : permettre à un visiteur de comprendre de quoi il s'agit,
 * comment le player fonctionne, comment tester la théorie et comment
 * apprécier ce qu'il entend. Le texte est découpé en blocs typés, rendus
 * par le composant AideContent.astro (page complète) et résumés dans
 * PlayerHelpPanel.astro (panneau dépliable au-dessus du player).
 *
 * Français = source. Anglais = traduction de travail. L'italien retombe
 * sur le français tant qu'il n'est pas traduit (voir AideContent.astro).
 */

export type AideLink = 'player' | 'theory' | 'theoryIntro';

export type AideBlock =
  | { t: 'h2'; id: string; text: string }
  | { t: 'p'; text: string }
  | { t: 'list'; items: string[] }
  | { t: 'steps'; items: { title: string; text: string }[] }
  | { t: 'try'; items: { title: string; text: string }[] }
  | { t: 'keys'; caption?: string; rows: { k: string; v: string }[] }
  | { t: 'callout'; text: string; links?: { label: string; to: AideLink }[] };

export interface AideSummaryItem {
  title: string;
  text: string;
}

export interface AideDoc {
  overline: string;
  title: string;
  subtitle: string;
  aside: string;
  /** Résumé court affiché dans le panneau intégré au player. */
  panelTitle: string;
  panelLede: string;
  panelItems: AideSummaryItem[];
  panelCta: string;
  /** Contenu complet de la page d'aide dédiée. */
  blocks: AideBlock[];
}

export const aide: Record<'fr' | 'en' | 'it', AideDoc> = {
  fr: {
    overline: 'Aide du player',
    title: 'Comprendre et utiliser le player',
    subtitle: 'De quoi il s’agit, comment ça marche, et comment ressentir la théorie',
    aside:
      "Le player n’exige aucune connaissance musicale préalable : lancez une pièce, écoutez, et laissez les explications ci-dessous vous guider quand une question se pose.",

    panelTitle: 'Comment ça marche ?',
    panelLede:
      "Le player rejoue les partitions en intonation juste, telles que les calculait le logiciel historique de 2009. En clair : vous entendez la théorie des intervalles, note après note.",
    panelItems: [
      {
        title: 'Choisissez une pièce',
        text: 'Dans la bibliothèque, cliquez un titre (ou cherchez par compositeur / œuvre).',
      },
      {
        title: 'Écoutez',
        text: 'Le bouton ▶ lance la lecture ; la note en cours s’affiche en Hz et en millisecondes.',
      },
      {
        title: 'Comparez',
        text: "Passez la sortie en « onde sinus » pour isoler la justesse, ou transposez pour changer de hauteur.",
      },
    ],
    panelCta: 'Guide complet et notation',

    blocks: [
      { t: 'h2', id: 'de-quoi', text: 'De quoi s’agit-il ?' },
      {
        t: 'p',
        text:
          "Le player est un lecteur audiovisuel. Il ne lit pas des enregistrements : il calcule et joue chaque note à sa fréquence exacte, selon les intervalles du Système G. Vous n’écoutez donc pas une interprétation, mais la théorie elle-même — la juste intonation rendue audible.",
      },
      {
        t: 'p',
        text:
          "Deux tableaux s’affichent côte à côte : à gauche la gamme (chaque symbole avec sa fréquence en Hz), à droite la partition en cours (chaque note, sa hauteur et sa durée). Ce que le tableau montre, l’oreille l’entend : c’est là tout l’intérêt.",
      },
      {
        t: 'callout',
        text: "Pour la théorie derrière les sons, commencez par l’introduction au Système G.",
        links: [
          { label: 'Introduction à la théorie', to: 'theoryIntro' },
          { label: 'Rubrique Théorie', to: 'theory' },
        ],
      },

      { t: 'h2', id: 'prise-en-main', text: 'Prise en main, étape par étape' },
      {
        t: 'steps',
        items: [
          {
            title: 'Choisir une pièce',
            text:
              "Dans la bibliothèque en haut, cliquez un titre. Le champ « Rechercher » filtre par compositeur ou par œuvre ; le menu « Catégorie » restreint à un genre. La partition se charge aussitôt dans le tableau de droite.",
          },
          {
            title: 'Lancer la lecture',
            text:
              "Le bouton ▶ Lecture joue la pièce du début ; ■ Arrêt la stoppe. La ligne en cours est surlignée et défile automatiquement.",
          },
          {
            title: 'Reprendre à un endroit précis',
            text:
              "Cliquez une ligne de la partition, puis « ↳ Lire depuis la ligne choisie » pour partir de ce point plutôt que du début.",
          },
          {
            title: 'Choisir la sortie sonore',
            text:
              "Le menu « Sortie » propose un instrument échantillonné, une onde sinus ou une onde carrée. L’onde sinus, dépouillée, est idéale pour juger la justesse d’un intervalle sans le timbre.",
          },
          {
            title: 'Transposer',
            text:
              "Le champ « Transposition » décale toute la pièce vers l’aigu ou le grave (pas de 0,5). Utile pour amener une pièce dans une tessiture confortable — les intervalles justes, eux, restent intacts.",
          },
          {
            title: 'Suivre les changements « $ »',
            text:
              "Certaines partitions changent d’instrument en cours de route (directive « $ »). La case « Suivre les changements $ » applique ou ignore ces changements pendant la lecture.",
          },
          {
            title: 'Écouter une portion seulement',
            text:
              "Maj + clic sur une deuxième ligne sélectionne une plage ; « Lire la sélection » ne joue que ces mesures. Parfait pour isoler un passage et le réécouter.",
          },
          {
            title: 'Voir la définition d’une note',
            text:
              "Double-cliquez une note de la partition : le player met en évidence sa ligne dans le tableau de la gamme, où figure sa formule exacte (le rapport de fréquences qui la définit).",
          },
          {
            title: 'Charger votre propre partition',
            text:
              "Vous pouvez déposer un fichier texte (.txt) de partition directement sur le tableau : le player le lit avec le même moteur. Le format est décrit plus bas.",
          },
        ],
      },
      {
        t: 'p',
        text:
          "Sous les commandes, quatre indicateurs vous situent en permanence : la fréquence de la note en cours (Hz), sa durée (ms), la durée totale de la pièce et le nombre de notes.",
      },

      { t: 'h2', id: 'comprendre', text: 'Comprendre ce que l’on entend' },
      {
        t: 'p',
        text:
          "Dans le tempérament égal des pianos modernes, chaque note a une hauteur fixe et unique. Le Système G part d’un autre constat : une même note occupe plusieurs positions selon la tonalité et son rôle mélodique. C’est cette finesse que le player rend audible.",
      },
      {
        t: 'list',
        items: [
          "Positions : une note peut être basse, moyenne ou haute. Dans la notation, le nom seul est la position moyenne ; le suffixe 1 marque la position basse, le suffixe 3 la position haute. Ainsi « sib1 » et « sib » ne sont pas tout à fait à la même hauteur.",
          "Attraction : ces micro-différences ne sont pas arbitraires. Une note « attirée » vers sa voisine se rapproche d’elle — c’est ce qui donne aux mélodies justes leur relief et leur expressivité (le sous-titre du projet : positions et expressivité).",
          "Demi-ton naturel : la découverte fondatrice du Système G est la représentation exacte du demi-ton, le rapport de fréquences 22/21, dont découle la construction des gammes.",
          "Un cadre unifié : la même notation décrit les musiques occidentale et orientale. Le menu « Gamme » bascule entre la gamme occidentale et la gamme orientale sans changer de logique.",
        ],
      },
      {
        t: 'callout',
        text: "Le détail des positions et du demi-ton naturel est développé dans la rubrique Théorie.",
        links: [{ label: 'Comprendre le système', to: 'theory' }],
      },

      { t: 'h2', id: 'apprecier', text: 'Écouter, tester, apprécier' },
      {
        t: 'p',
        text:
          "La meilleure façon de saisir la théorie est de l’écouter activement. Voici quelques expériences simples à tenter dans le player.",
      },
      {
        t: 'try',
        items: [
          {
            title: 'Isolez la justesse',
            text:
              "Choisissez une pièce, passez la sortie en « onde sinus » et fermez les yeux. Sans le timbre d’un instrument, les intervalles justes s’entendent « posés », sans le léger battement du tempérament égal.",
          },
          {
            title: 'Entendez une même note à deux hauteurs',
            text:
              "Repérez dans une partition deux occurrences d’une note avec et sans suffixe (par ex. « sib » puis « sib1 »). Sélectionnez chacune (Maj + clic) et comparez : la différence est fine, mais réelle.",
          },
          {
            title: 'Suivez la partition des yeux',
            text:
              "Laissez défiler le surlignage tout en lisant la colonne Hz : vous voyez la fréquence changer d’un cheveu là où le tempérament égal donnerait une valeur figée.",
          },
          {
            title: 'Comparez deux mondes',
            text:
              "Écoutez une pièce en gamme occidentale, puis explorez la gamme orientale : c’est la même notation et le même moteur, appliqués à deux traditions.",
          },
          {
            title: 'Remontez à la source d’une note',
            text:
              "Double-cliquez une note à suffixe pour voir sa formule dans la gamme : vous passez du son entendu au rapport de fréquences qui le définit.",
          },
        ],
      },

      { t: 'h2', id: 'notation', text: 'Lire une partition du Système G' },
      {
        t: 'p',
        text:
          "Les partitions sont de simples fichiers texte. Chaque ligne est soit une note, soit une consigne. Comprendre ce format permet de lire les tableaux — et d’écrire ses propres pièces.",
      },
      {
        t: 'keys',
        caption: 'Lignes de consigne',
        rows: [
          { k: '@occidental / @oriental', v: 'En-tête : choisit la gamme utilisée (première ligne).' },
          { k: '# …', v: 'Commentaire : nom de section, tonalité ou paroles. Ignoré à la lecture.' },
          { k: '$ instrument', v: 'Change l’instrument à partir de cette ligne.' },
          { k: 'NOM = expression', v: 'Définition locale (ex. « N = 550 » fixe la durée de base). La dernière définition l’emporte.' },
          { k: 'note,durée', v: 'Un événement musical : une hauteur et une durée, séparées par une virgule.' },
        ],
      },
      {
        t: 'keys',
        caption: 'Écrire une note',
        rows: [
          { k: 'do ré mi fa sol la si', v: 'Le nom de la note (en toutes lettres, minuscules).' },
          { k: 'd / b', v: 'Altération : d = dièse, b = bémol (dd / bb pour le double). Ex. « fad » = fa dièse.' },
          { k: 'g / h', v: 'Registre d’octave : g = octave grave, h = octave haute. Ex. « doh » = do de l’octave supérieure.' },
          { k: '1 / 3', v: 'Position microtonale : 1 = basse, 3 = haute ; sans chiffre = position moyenne. Ex. « sib1 ».' },
          { k: '0', v: 'Un silence (fréquence nulle) pour la durée indiquée.' },
        ],
      },
      {
        t: 'keys',
        caption: 'Durées (après la virgule)',
        rows: [
          { k: 'r / b / n', v: 'ronde / blanche / noire.' },
          { k: 'c / dc / tc', v: 'croche / double-croche / triple-croche.' },
          { k: 'suffixe p', v: 'valeur pointée (ex. « np » = noire pointée) ; pp = double pointée.' },
          { k: 'préfixe tr / qu', v: 'triolet / quintolet (ex. « trn » = triolet de noires).' },
          { k: 'a-b', v: 'les durées se combinent (ex. « b-dc » = une blanche moins une double-croche).' },
        ],
      },
      {
        t: 'p',
        text:
          "Astuce : la lettre « b » signifie « bémol » quand elle fait partie du nom d’une note (avant la virgule) et « blanche » quand elle indique la durée (après la virgule). La virgule lève toujours l’ambiguïté.",
      },
      {
        t: 'callout',
        text: "Prêt à écouter ? Retournez au player et lancez une première pièce.",
        links: [{ label: 'Ouvrir le player', to: 'player' }],
      },
    ],
  },

  en: {
    overline: 'Player help',
    title: 'Understanding and using the player',
    subtitle: 'What it is, how it works, and how to feel the theory',
    aside:
      "The player requires no prior musical training: start a piece, listen, and let the notes below guide you whenever a question comes up.",

    panelTitle: 'How does it work?',
    panelLede:
      "The player replays scores in just intonation, exactly as the original 2009 software computed them. In short: you hear the theory of intervals, note after note.",
    panelItems: [
      {
        title: 'Pick a piece',
        text: 'In the library, click a title (or search by composer / work).',
      },
      {
        title: 'Listen',
        text: 'The ▶ button starts playback; the current note is shown in Hz and milliseconds.',
      },
      {
        title: 'Compare',
        text: "Switch the output to “sine wave” to isolate the tuning, or transpose to change pitch.",
      },
    ],
    panelCta: 'Full guide and notation',

    blocks: [
      { t: 'h2', id: 'de-quoi', text: 'What is it?' },
      {
        t: 'p',
        text:
          "The player is an audiovisual reader. It does not play recordings: it computes and sounds each note at its exact frequency, following the intervals of System G. So you are not listening to a performance, but to the theory itself — just intonation made audible.",
      },
      {
        t: 'p',
        text:
          "Two tables sit side by side: on the left the scale (each symbol with its frequency in Hz), on the right the current score (each note, its pitch and its duration). What the table shows, the ear hears: that is the whole point.",
      },
      {
        t: 'callout',
        text: "For the theory behind the sounds, start with the introduction to System G.",
        links: [
          { label: 'Introduction to the theory', to: 'theoryIntro' },
          { label: 'Theory section', to: 'theory' },
        ],
      },

      { t: 'h2', id: 'prise-en-main', text: 'Getting started, step by step' },
      {
        t: 'steps',
        items: [
          {
            title: 'Choose a piece',
            text:
              "In the library at the top, click a title. The “Search” field filters by composer or work; the “Category” menu narrows to a genre. The score loads immediately in the right-hand table.",
          },
          {
            title: 'Start playback',
            text:
              "The ▶ Play button plays from the top; ■ Stop halts it. The current line is highlighted and scrolls automatically.",
          },
          {
            title: 'Resume from a chosen spot',
            text:
              "Click a line in the score, then “↳ Play from selected line” to start from there instead of the beginning.",
          },
          {
            title: 'Choose the sound output',
            text:
              "The “Output” menu offers a sampled instrument, a sine wave or a square wave. The bare sine wave is ideal for judging the tuning of an interval without any timbre.",
          },
          {
            title: 'Transpose',
            text:
              "The “Transpose” field shifts the whole piece up or down (in steps of 0.5). Handy to bring a piece into a comfortable range — the just intervals themselves stay intact.",
          },
          {
            title: 'Follow “$” changes',
            text:
              "Some scores change instrument along the way (the “$” directive). The “Follow $ changes” checkbox applies or ignores those changes during playback.",
          },
          {
            title: 'Listen to a portion only',
            text:
              "Shift + click a second line to select a range; “Play selection” plays only those bars. Perfect for isolating a passage and replaying it.",
          },
          {
            title: 'See a note’s definition',
            text:
              "Double-click a note in the score: the player highlights its row in the scale table, where its exact formula appears (the frequency ratio that defines it).",
          },
          {
            title: 'Load your own score',
            text:
              "You can drop a score text file (.txt) straight onto the table: the player reads it with the same engine. The format is described below.",
          },
        ],
      },
      {
        t: 'p',
        text:
          "Below the controls, four readouts keep you oriented at all times: the frequency of the current note (Hz), its duration (ms), the total duration of the piece and the number of notes.",
      },

      { t: 'h2', id: 'comprendre', text: 'Understanding what you hear' },
      {
        t: 'p',
        text:
          "In the equal temperament of modern pianos, every note has a single fixed pitch. System G starts from a different observation: one and the same note takes several positions depending on the key and its melodic role. That subtlety is what the player makes audible.",
      },
      {
        t: 'list',
        items: [
          "Positions: a note can be low, middle or high. In the notation, the bare name is the middle position; the suffix 1 marks the low position, the suffix 3 the high position. So “sib1” and “sib” are not at quite the same pitch.",
          "Attraction: these micro-differences are not arbitrary. A note “drawn” toward its neighbour moves closer to it — this is what gives well-tuned melodies their relief and expressiveness (the project’s subtitle: positions and expressiveness).",
          "The natural semitone: System G’s founding discovery is the exact representation of the semitone, the frequency ratio 22/21, from which the construction of the scales follows.",
          "A unified framework: the same notation describes Western and Eastern music. The “Scale” menu switches between the Western and Eastern scales without changing the logic.",
        ],
      },
      {
        t: 'callout',
        text: "The detail of the positions and the natural semitone is developed in the Theory section.",
        links: [{ label: 'Understand the system', to: 'theory' }],
      },

      { t: 'h2', id: 'apprecier', text: 'Listen, test, appreciate' },
      {
        t: 'p',
        text:
          "The best way to grasp the theory is to listen actively. Here are a few simple experiments to try in the player.",
      },
      {
        t: 'try',
        items: [
          {
            title: 'Isolate the tuning',
            text:
              "Choose a piece, switch the output to “sine wave” and close your eyes. Without an instrument’s timbre, the just intervals sound “settled”, without the slight beating of equal temperament.",
          },
          {
            title: 'Hear one note at two pitches',
            text:
              "Find in a score two occurrences of a note with and without a suffix (e.g. “sib” then “sib1”). Select each one (Shift + click) and compare: the difference is subtle, but real.",
          },
          {
            title: 'Follow the score with your eyes',
            text:
              "Let the highlight scroll while reading the Hz column: you can see the frequency shift by a hair where equal temperament would give a frozen value.",
          },
          {
            title: 'Compare two worlds',
            text:
              "Listen to a piece in the Western scale, then explore the Eastern scale: same notation and same engine, applied to two traditions.",
          },
          {
            title: 'Trace a note back to its source',
            text:
              "Double-click a suffixed note to see its formula in the scale: you move from the sound you hear to the frequency ratio that defines it.",
          },
        ],
      },

      { t: 'h2', id: 'notation', text: 'Reading a System G score' },
      {
        t: 'p',
        text:
          "Scores are plain text files. Each line is either a note or an instruction. Understanding this format lets you read the tables — and write your own pieces.",
      },
      {
        t: 'keys',
        caption: 'Instruction lines',
        rows: [
          { k: '@occidental / @oriental', v: 'Header: selects the scale to use (first line).' },
          { k: '# …', v: 'Comment: section name, key or lyrics. Ignored during playback.' },
          { k: '$ instrument', v: 'Changes the instrument from this line on.' },
          { k: 'NAME = expression', v: 'Local definition (e.g. “N = 550” sets the base duration). The last definition wins.' },
          { k: 'note,duration', v: 'A musical event: a pitch and a duration, separated by a comma.' },
        ],
      },
      {
        t: 'keys',
        caption: 'Writing a note',
        rows: [
          { k: 'do ré mi fa sol la si', v: 'The note name (spelled out, lowercase).' },
          { k: 'd / b', v: 'Accidental: d = sharp, b = flat (dd / bb for double). E.g. “fad” = F sharp.' },
          { k: 'g / h', v: 'Octave register: g = lower octave, h = upper octave. E.g. “doh” = C in the octave above.' },
          { k: '1 / 3', v: 'Microtonal position: 1 = low, 3 = high; no digit = middle position. E.g. “sib1”.' },
          { k: '0', v: 'A rest (zero frequency) for the given duration.' },
        ],
      },
      {
        t: 'keys',
        caption: 'Durations (after the comma)',
        rows: [
          { k: 'r / b / n', v: 'whole / half / quarter note.' },
          { k: 'c / dc / tc', v: 'eighth / sixteenth / thirty-second note.' },
          { k: 'p suffix', v: 'dotted value (e.g. “np” = dotted quarter); pp = double-dotted.' },
          { k: 'tr / qu prefix', v: 'triplet / quintuplet (e.g. “trn” = quarter-note triplet).' },
          { k: 'a-b', v: 'durations combine (e.g. “b-dc” = a half note minus a sixteenth).' },
        ],
      },
      {
        t: 'p',
        text:
          "Tip: the letter “b” means “flat” when it is part of a note name (before the comma) and “half note” when it gives the duration (after the comma). The comma always removes the ambiguity.",
      },
      {
        t: 'callout',
        text: "Ready to listen? Head back to the player and start a first piece.",
        links: [{ label: 'Open the player', to: 'player' }],
      },
    ],
  },

  // L'italien retombe sur le français tant qu'il n'est pas traduit.
  get it() {
    return this.fr;
  },
};
