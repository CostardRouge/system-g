/**
 * Dessine l'icône du site et en tire tout le jeu (COMMON-PROJECT-SPEC, C11) :
 * les trois sources SVG dans public/ (icon.svg, icon-apple.svg,
 * icon-maskable.svg, et favicon.svg, l'ancienne adresse, copie de icon.svg),
 * les PNG que lisent les navigateurs, les launchers et l'écran d'accueil
 * d'un téléphone, et le favicon.ico.
 *
 * Lancé à la main (`npm run icons`) après un changement du dessin ; les
 * fichiers produits sont commités, un hébergeur statique ne rasterise rien.
 *
 * Le dessin a une seule maison : ce fichier. Le « G » est le contour du
 * glyphe d'EB Garamond (la police des images de partage), extrait une fois en
 * chemin SVG, et le bécarre est tracé à la main : aucune police n'est
 * résolue par nom, le rendu est le même sur toute machine. La rasterisation
 * passe par resvg (WASM), déjà là pour les images de partage — pas de sharp.
 *
 * Trois sources, parce que trois lecteurs : le navigateur affiche l'icône
 * telle quelle (coins arrondis, fond transparent autour) ; iOS compose
 * lui-même les coins de l'écran d'accueil et montre une transparence en
 * noir, donc la source « apple » est pleine et le PNG sans couche alpha ;
 * un launcher Android masque l'icône « maskable » à sa guise, donc le motif
 * tient dans le cercle central de 80 % de la largeur.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { crc32, deflateSync } from 'node:zlib';
import { initWasm, Resvg } from '@resvg/resvg-wasm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pub = join(__dirname, '..', 'public');

const PAPER = '#f7f2e7';
const LINE = '#cdbfa4';
const ACCENT = '#7a2e2e';
const GOLD = '#9a7b3f';

/** Le « G » d'EB Garamond 600, sur 1000 unités (cadre 34–694 × 190–868). */
const G_PATH =
  'M383 868Q312 868 249 844Q186 820 137.5 776.5Q89 733 61.5 673Q34 613 34 541Q34 470 61.5 407Q89 344 139 295.5Q189 247 257.5 218.5Q326 190 409 190Q428 190 456 193.5Q484 197 514 202Q544 207 569.5 213Q595 219 609 225Q616 228 620 232.5Q624 237 625 245Q630 278 633 308Q636 338 636 360Q636 368 631.5 374Q627 380 620 380Q609 380 604 372.5Q599 365 595 356Q587 338 577 320.5Q567 303 552 287Q542 277 524.5 265.5Q507 254 480 246Q453 238 414 238Q359 238 315 260.5Q271 283 241 323Q211 363 195 413.5Q179 464 179 519Q179 588 195 643.5Q211 699 240 738.5Q269 778 309 799Q349 820 399 820Q435 820 455.5 809.5Q476 799 485 791Q496 782 503 764Q510 746 511 722Q511 713 512 699L513 671Q513 657 513 648Q513 637 509.5 628.5Q506 620 496 615Q487 608 473 602.5Q459 597 444.5 594.5Q430 592 421 591Q414 590 406 584.5Q398 579 398 571Q398 563 405.5 559Q413 555 419 555Q442 555 467 556L516 558Q540 559 563 559Q591 559 618.5 557Q646 555 675 555Q681 555 687.5 558.5Q694 562 694 571Q694 579 687 584Q680 589 674 590Q647 597 637.5 608Q628 619 625 639Q621 661 619.5 678Q618 695 618 714L618 745Q618 750 621.5 754Q625 758 629 763Q633 768 636.5 773Q640 778 640 783Q640 789 636.5 795.5Q633 802 622 804Q615 805 595 815Q575 825 544.5 837.5Q514 850 473.5 859Q433 868 383 868Z';

/**
 * Le motif sur un cadre de 64 : le G (contour à l'échelle 0,042, posé pour
 * que sa base tombe à 45 et son centre à 30) et le bécarre doré en haut à
 * droite (deux hampes, deux barres obliques).
 */
const MARK = [
  `<path fill="${ACCENT}" transform="translate(14.7 8.5) scale(0.042)" d="${G_PATH}"/>`,
  `<g fill="${GOLD}">`,
  '  <rect x="45.9" y="7" width="1.2" height="15.5"/>',
  '  <rect x="50.9" y="10.5" width="1.2" height="15.5"/>',
  '  <path d="M45.9 12.3 52.1 9.9v2.4l-6.2 2.4z"/>',
  '  <path d="M45.9 19.3 52.1 16.9v2.4l-6.2 2.4z"/>',
  '</g>',
].join('\n  ');

const svg = (body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Système G">\n  ${body}\n</svg>\n`;

/** Le navigateur : une carte aux coins arrondis, un filet, le motif. */
const icon = svg(
  [
    `<rect width="64" height="64" rx="10" fill="${PAPER}"/>`,
    `<rect x="2.5" y="2.5" width="59" height="59" rx="8" fill="none" stroke="${LINE}" stroke-width="1.5"/>`,
    MARK,
  ].join('\n  '),
);

/** iOS : plein cadre, sans coins (le système les arrondit) ni transparence. */
const apple = svg([`<rect width="64" height="64" fill="${PAPER}"/>`, MARK].join('\n  '));

/**
 * Android (maskable) : plein cadre, le motif centré et réduit à 72 % — son
 * rectangle (14,7–52 × 7–45) tient alors dans le cercle de rayon 25,6 (80 %)
 * que tout masque de launcher laisse visible.
 */
const maskable = svg(
  [
    `<rect width="64" height="64" fill="${PAPER}"/>`,
    '<g transform="translate(32 32) scale(0.72) translate(-33.35 -26)">',
    `  ${MARK.replace(/\n {2}/g, '\n    ')}`,
    '</g>',
  ].join('\n  '),
);

await initWasm(await readFile(join(__dirname, '..', 'node_modules/@resvg/resvg-wasm/index_bg.wasm')));

/** Rasterise une source SVG en carré de `size` pixels : les pixels RGBA et le PNG de resvg. */
function raster(source, size) {
  const image = new Resvg(source, { fitTo: { mode: 'width', value: size } }).render();
  if (image.width !== size || image.height !== size) throw new Error(`${size} px attendus, ${image.width}×${image.height} rendus`);
  return { png: image.asPng(), pixels: image.pixels, size };
}

/** Un PNG RGB (type de couleur 2, sans couche alpha) à partir de pixels RGBA opaques. */
function opaquePng({ pixels, size }) {
  const rows = Buffer.alloc(size * (1 + size * 3));
  for (let y = 0; y < size; y++) {
    rows[y * (1 + size * 3)] = 0; // filtre « none »
    for (let x = 0; x < size; x++) {
      const from = (y * size + x) * 4;
      const to = y * (1 + size * 3) + 1 + x * 3;
      if (pixels[from + 3] !== 255) throw new Error(`pixel translucide en ${x},${y} : la source apple doit être pleine`);
      rows[to] = pixels[from];
      rows[to + 1] = pixels[from + 1];
      rows[to + 2] = pixels[from + 2];
    }
  }
  const chunk = (type, data) => {
    const body = Buffer.concat([Buffer.from(type, 'latin1'), data]);
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body));
    return Buffer.concat([length, body, crc]);
  };
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8; // 8 bits par canal
  header[9] = 2; // RGB
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(rows, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/** Un favicon.ico qui embarque des PNG (Windows Vista et plus, tous les navigateurs). */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2); // type : icône
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map(({ png, size }) => {
    const entry = Buffer.alloc(16);
    entry[0] = size === 256 ? 0 : size;
    entry[1] = size === 256 ? 0 : size;
    entry.writeUInt16LE(1, 4); // plans
    entry.writeUInt16LE(32, 6); // bits par pixel
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...images.map(({ png }) => Buffer.from(png))]);
}

const sources = {
  'icon.svg': icon,
  'favicon.svg': icon,
  'icon-apple.svg': apple,
  'icon-maskable.svg': maskable,
};
for (const [name, source] of Object.entries(sources)) await writeFile(join(pub, name), source);

const outputs = [
  ['favicon-16.png', raster(icon, 16).png],
  ['favicon-32.png', raster(icon, 32).png],
  ['icon-192.png', raster(icon, 192).png],
  ['icon-512.png', raster(icon, 512).png],
  ['icon-maskable-192.png', raster(maskable, 192).png],
  ['icon-maskable-512.png', raster(maskable, 512).png],
  ['apple-touch-icon.png', opaquePng(raster(apple, 180))],
  ['favicon.ico', ico([raster(icon, 16), raster(icon, 32), raster(icon, 48)])],
];
for (const [name, bytes] of outputs) await writeFile(join(pub, name), bytes);

console.log(`Icônes écrites dans ${pub} : ${Object.keys(sources).length} sources SVG, ${outputs.length} fichiers.`);
