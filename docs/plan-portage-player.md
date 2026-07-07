# Plan de portage — G System Player → Web (Astro)

*Analyse du code source legacy et proposition d'architecture, 7 juillet 2026.*

## 1. Ce qu'est le player legacy

Application Windows **C# WinForms (2009, Faraj Elias)** utilisant DirectX DirectSound. Le cœur tient en **~1 150 lignes de code utile** : `FormG.cs` (858 l., UI + séquenceur), `BeepCl.cs` (286 l., oscillateur sinus/carré), plus une DLL d'évaluation d'expressions (`Evaluate.dll` / `JsMath.Eval`).

### Les trois briques conceptuelles

**a) Fichiers de gamme** (`gamme occidentale.txt`, 485 lignes ; `gamme orientale.txt`, 304 lignes). Chaque note est définie comme une **expression fractionnaire exacte** dérivée du LA (441 Hz en occidental, 440 en oriental) :

```
LA = 441
SOLG = LAG*8/9
SOLGD = LAG*243/256
SOLG3 = SOLG*896/891   ← les suffixes 1/3 sont les « positions » du Système G
```

C'est ici que vit toute la théorie : intonation juste par rapports de fréquences (pythagoriciens, microtonaux type 896/891, 21/22, quarts de ton orientaux 15/14, 11/10…). Les durées sont aussi symboliques : `N = 800`, `B = 2*N`, `DC = N/4`, triolets `TRN = N/3`, quintolets `QUN = N/5`, pointés `NP`, `NPP`…

**b) Fichiers de partition** (« Run files ») — ~220 fichiers .txt fournis (répertoire occidental, Vaccai, variétés) :

```
@occidental          ← gamme à charger
N = 950              ← redéfinition locale (tempo)
$ piano_2            ← changement d'instrument en cours de morceau
# mi re mi re mi si  ← commentaire / repère
mih,dc               ← note,durée — une paire par ligne (monophonique)
rehd3,dc
```

Le player résout récursivement chaque symbole via la gamme + les définitions locales, évalue l'arithmétique et obtient des paires **(fréquence en Hz, durée en ms)**. Les erreurs (symbole non défini, valeur hors bornes) sont rapportées avec le numéro de ligne.

**c) Moteur audio** — séquenceur monophonique, 3 modes :

1. **Instrument échantillonné** : 18 fichiers WAV en boucle (~4,8 Mo au total). Le pitch est obtenu en réglant `buffer.Frequency = Hz × coefficient` (un coefficient de calibration par instrument, ex. Flute = 72, Oud = 66.65). C'est du *pitch-shifting par rééchantillonnage*.
2. **Haut-parleur (oscillateur)** : onde sinus ou carrée générée en temps réel.
3. **PC speaker** : `Console.Beep` (obsolète, à abandonner).

Le timing repose sur `Thread.Sleep(dur)` — imprécis ; le web fera **mieux** que l'original sur ce point.

### UI legacy

Deux tableaux (gamme à gauche, partition à droite avec colonnes symbole/Hz/durée), boutons Play/Pause/Stop/Play-selection (F5/F6/F7), surlignage de la note en cours, affichage Hz + ms, durée totale du morceau, transposition (offset numérique), menu contextuel « aller à la définition » d'un symbole, drag & drop de fichiers.

## 2. Verdict : complexité

**Facile à comprendre, effort de portage modéré.** Petit codebase, logique claire, monophonique, pas de dépendance métier cachée (Evaluate.dll ne fait que de l'arithmétique). Les 20 % délicats :

- **Fidélité des hauteurs** : les coefficients de calibration par instrument doivent être convertis correctement (`playbackRate = Hz × coeff / sampleRate_du_wav`). À valider par mesure de la hauteur de base de chaque WAV et tests comparatifs.
- **Le résolveur d'expressions** : substitution récursive de symboles + évaluation arithmétique. Simple à réécrire proprement en TypeScript (au lieu du bricolage regex du C#), mais il doit reproduire exactement les mêmes valeurs — testable unitairement.
- **Qualité audio** : la boucle brute de WAV clique aux transitions ; on ajoutera de courtes enveloppes de gain (attaque/relâchement ~5-10 ms), absentes de l'original.

Tout le reste (UI, bibliothèque de partitions, i18n) est du développement web classique.

## 3. Architecture cible dans le site Astro

Philosophie conforme au projet : **statique, zéro vendor lock-in, dépendances minimales**. Le player est une *island* interactive en **TypeScript pur** (pas de framework lourd requis — Web Audio API + DOM suffisent) intégrée à la page `/player` du site Astro existant.

```
src/
  lib/systemg/
    scale-parser.ts      # parse les fichiers de gamme (symbole = expression)
    score-parser.ts      # parse les partitions (@gamme, $instr, #, note,durée)
    evaluator.ts         # résolution récursive + éval arithmétique (fractions)
    scheduler.ts         # séquenceur Web Audio (lookahead, sample-accurate)
    instruments.ts       # table {nom, coefficient, url} + chargement AudioBuffer
  components/player/
    Player.astro         # island — tableaux gamme/partition, transport, réglages
  content/scores/        # les ~220 partitions .txt + métadonnées (titre,
                         # compositeur, catégorie, gamme) en collection Astro
public/audio/instruments/  # les 18 sons (WAV d'origine ou FLAC/OGG)
```

### Correspondances techniques

| Legacy (DirectSound) | Web |
|---|---|
| `SecondaryBuffer` WAV en boucle + `Frequency` | `AudioBufferSourceNode` `loop=true` + `playbackRate` |
| `Thread.Sleep(dur)` | horloge `AudioContext.currentTime` + scheduling lookahead (précis à l'échantillon près) |
| `BeepCl` sinus/carré | `OscillatorNode` (`sine` / `square`) — quasi gratuit |
| `JsMath.Eval` | évaluateur maison en rationnels exacts (num/dén) → aucune dérive d'arrondi |
| Registre Windows (version admin) | JSON de configuration des instruments |
| Drag & drop de .txt | conservé (API File) + bibliothèque intégrée |

## 4. Phases

**Phase 1 — Moteur + MVP (le cœur).**
Parsers + évaluateur en TS avec tests unitaires (Vitest) validés contre des valeurs calculées du legacy ; script de vérification des 18 coefficients ; séquenceur Web Audio ; UI minimale : choix gamme, chargement d'une partition (bibliothèque réduite + drag & drop), Play/Pause/Stop, surlignage de la ligne jouée, affichage Hz/ms, durée totale, choix d'instrument, transposition.

**Phase 2 — Bibliothèque et confort.**
Les ~220 partitions en collection de contenu avec recherche/filtres (compositeur, catégorie, gamme) ; lecture d'une sélection ; mode oscillateur ; raccourcis clavier ; tableau de la gamme avec « aller à la définition » ; responsive mobile ; i18n fr/en du player.

**Phase 3 — Expressivité et pédagogie (au-delà du legacy).**
C'est là que le web apporte la valeur « ressentir la théorie » : visualisation des **positions** (échelle comparant tempérament égal vs Système G, déviations en cents), courbe de hauteur animée pendant la lecture, comparateur A/B tempéré/juste sur un même passage, éditeur de partition en ligne avec validation d'erreurs (comme le legacy), URLs partageables d'un morceau/passage, export audio (WAV via OfflineAudioContext).

## 5. Points d'attention

- **Droits** : code © 2009 Faraj Elias (farajelias@hotmail.com) ; échantillons d'instruments d'origine inconnue. À clarifier avec la famille avant publication du code/des sons.
- **Autoplay mobile** : l'AudioContext doit être démarré par un geste utilisateur (bouton Play) — standard.
- **Deux versions dans les sources** : « code source » (instruments embarqués, la référence) et « _Users » (instruments via registre Windows). La version de référence pour le portage est **« G System player code source »**.
- **Format des partitions** : conserver le .txt d'origine tel quel comme format canonique (esprit archive) ; les métadonnées vivent à côté, pas dedans.

## 6. Décisions à valider

1. Framework de l'island : TypeScript pur (recommandé, zéro dépendance) ou Preact/Svelte si l'UI se complexifie en phase 3.
2. Format audio des instruments : WAV d'origine (4,8 Mo, fidélité maximale) ou FLAC/OGG (plus léger).
3. Périmètre du MVP : bibliothèque complète dès la phase 1 ou une dizaine de morceaux représentatifs.
