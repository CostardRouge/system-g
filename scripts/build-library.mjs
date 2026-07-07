/**
 * Génère la bibliothèque de partitions du player à partir des fichiers
 * legacy (dossier `system-g-player/occidental - txt`).
 *
 *   node scripts/build-library.mjs
 *
 * - copie chaque .txt vers public/player/scores/<slug>.txt ;
 * - convertit les .rtf simples en .txt (déballage RTF minimal) ;
 * - produit src/lib/systemg/library.json (titre, compositeur, catégorie).
 *
 * Le script est idempotent : il reconstruit tout à chaque exécution.
 * Les fichiers .bak et .DS_Store sont ignorés.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'system-g-player', 'occidental - txt');
const OUT_SCORES = join(ROOT, 'public', 'player', 'scores');
const OUT_JSON = join(ROOT, 'src', 'lib', 'systemg', 'library.json');

/** Compositeurs reconnus par préfixe de nom de fichier (ordre = priorité). */
const COMPOSERS = [
  ['mozart-gasparini', 'Mozart / Gasparini'],
  ['roland de lassus', 'Roland de Lassus'],
  ['ronsard costeley', 'Costeley / Ronsard'],
  ['reynaldo hahn', 'Reynaldo Hahn'],
  ['carl orff', 'Carl Orff'],
  ['ave maria caccini', 'Caccini'],
  ['ave maria gounod', 'Bach / Gounod'],
  ['ave maria schubert', 'Schubert'],
  ['b streisand', 'M. Legrand (B. Streisand)'],
  ['cl francois', 'Claude François'],
  ['monnot piaf', 'M. Monnot (Piaf)'],
  ['leforestier', 'Maxime Le Forestier'],
  ['allegri', 'Allegri'],
  ['bach', 'Bach'],
  ['beeth', 'Beethoven'],
  ['bellini', 'Bellini'],
  ['bizet', 'Bizet'],
  ['brahms', 'Brahms'],
  ['brassens', 'Brassens'],
  ['catalani', 'Catalani'],
  ['charpentier', 'Charpentier'],
  ['delibes', 'Delibes'],
  ['duparc', 'Duparc'],
  ['dvorak', 'Dvořák'],
  ['faure', 'Fauré'],
  ['gedeon', 'Nabih Gédéon'],
  ['gluck', 'Gluck'],
  ['gounod', 'Gounod'],
  ['hahn', 'Reynaldo Hahn'],
  ['handel', 'Haendel'],
  ['idir', 'Idir'],
  ['korsakov', 'Rimski-Korsakov'],
  ['kosma', 'Kosma (Prévert)'],
  ['massenet', 'Massenet'],
  ['mozart', 'Mozart'],
  ['offenbach', 'Offenbach'],
  ['piaf', 'Piaf'],
  ['ponchielli', 'Ponchielli'],
  ['poulenc', 'Poulenc'],
  ['puccini', 'Puccini'],
  ['rachmaninoff', 'Rachmaninov'],
  ['ravel', 'Ravel'],
  ['robilliard', 'Robilliard'],
  ['rossini', 'Rossini'],
  ['schubert', 'Schubert'],
  ['trenet', 'Trenet'],
  ['vaccai', 'Vaccai'],
  ['verdi', 'Verdi'],
  ['vittoria', 'Victoria'],
];

/** Titres explicites pour les pièces sans compositeur dans le nom. */
const ANONYMOUS = new Map([
  ['belle qui tiens ma vie', 'Arbeau (Orchésographie)'],
  ['canon de la paix', 'Canon (trad.)'],
  ["qu'est devenu", 'Anonyme'],
  ['joyeux anniversaire', 'Traditionnel'],
  ['la marseillaise', 'Rouget de Lisle'],
  ["l'internationale", 'Degeyter'],
  ['le chant des partisans', 'Anna Marly'],
  ['tantum ergo', 'Traditionnel'],
  ['calme et serenite', 'Nabih Gédéon'],
  ['noel noel', 'Nabih Gédéon'],
  ['4 gammes majeures', '—'],
  ['4 gammes mineures', '—'],
]);

/**
 * Corrections documentées de défauts des fichiers d'origine.
 * Clé = nom de fichier source ; valeur = liste de [recherche, remplacement],
 * appliqués ligne à ligne (correspondance exacte après trim).
 */
const PATCHES = new Map([
  // Repère de section dont le « # » a été oublié dans le fichier legacy :
  // sans lui, le player (d'époque comme actuel) refuse toute la partition.
  ['belle qui tiens ma vie SOPRANO.txt', [['SOL MAJEUR', '# SOL MAJEUR']]],
]);

function applyPatches(file, text) {
  const patches = PATCHES.get(file);
  if (!patches) return text;
  return text
    .split(/\r\n|\r|\n/)
    .map((line) => {
      const found = patches.find(([search]) => line.trim() === search);
      return found ? found[1] : line;
    })
    .join('\n');
}

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\+/g, '-plus')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Déduit {composer, title} du nom de fichier (sans extension). */
function metadata(stem) {
  const lower = stem.toLowerCase();
  for (const [prefix, composer] of ANONYMOUS) {
    if (lower.startsWith(prefix)) return { composer, title: capitalize(stem) };
  }
  for (const [prefix, composer] of COMPOSERS) {
    if (lower.startsWith(prefix)) {
      let title = stem.slice(prefix.length).trim().replace(/^[-–]\s*/, '');
      if (prefix.startsWith('ave maria')) title = `Ave Maria ${title}`.trim();
      if (title === '') title = capitalize(stem);
      return { composer, title: capitalize(title) };
    }
  }
  return { composer: '—', title: capitalize(stem) };
}

/** Déballage RTF minimal (suffisant pour les exports TextEdit simples). */
function unrtf(text) {
  return text
    .replace(/\\'([0-9a-fA-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\{\\\*?[^{}]*\}/g, '')
    .replace(/\\par[d]?\b/g, '\n')
    .replace(/\\line\b/g, '\n')
    .replace(/\\tab\b/g, ' ')
    .replace(/\\\n/g, '\n')
    .replace(/\\[a-zA-Z]+-?\d*\s?/g, '')
    .replace(/[{}]/g, '')
    .split('\n')
    .map((l) => l.trim())
    .filter((l, i, a) => l !== '' || (i > 0 && a[i - 1] !== ''))
    .join('\n');
}

const CATEGORIES = [
  { dir: '.', id: 'repertoire' },
  { dir: 'VACCAI', id: 'vaccai' },
  { dir: 'variétés', id: 'varietes' },
];

// Nettoyage best-effort : certains environnements interdisent l'unlink de
// fichiers existants ; dans ce cas on écrase en place (les slugs sont stables).
try {
  rmSync(OUT_SCORES, { recursive: true, force: true });
} catch {
  /* on écrasera en place */
}
mkdirSync(OUT_SCORES, { recursive: true });

const entries = [];
const seen = new Set();

for (const { dir, id } of CATEGORIES) {
  const abs = join(SRC, dir);
  for (const file of readdirSync(abs).sort()) {
    if (file.startsWith('.') || file.endsWith('.bak')) continue;
    if (file === 'VACCAI' || file === 'variétés') continue;
    const isRtf = file.endsWith('.rtf');
    if (!file.endsWith('.txt') && !isRtf) continue;

    const stem = file.replace(/\.(txt|rtf)$/, '');
    let slug = slugify(stem);
    if (seen.has(slug)) slug = `${id}-${slug}`;
    if (seen.has(slug)) {
      console.warn(`! doublon ignoré : ${dir}/${file}`);
      continue;
    }
    seen.add(slug);

    let text = readFileSync(join(abs, file), 'latin1');
    // Réencodage : les fichiers legacy sont en ANSI/latin1 ; réécrits en UTF-8.
    if (isRtf) text = unrtf(text);
    text = applyPatches(file, text);
    writeFileSync(join(OUT_SCORES, `${slug}.txt`), text, 'utf8');

    const { composer, title } = metadata(stem);
    entries.push({ file: `${slug}.txt`, title, composer, category: id });
  }
}

entries.sort((a, b) =>
  `${a.composer} ${a.title}`.localeCompare(`${b.composer} ${b.title}`, 'fr'),
);

writeFileSync(OUT_JSON, JSON.stringify(entries, null, 2) + '\n', 'utf8');
console.log(`${entries.length} partitions → public/player/scores/ + library.json`);
