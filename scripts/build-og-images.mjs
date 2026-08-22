/**
 * Génère une image de partage (Open Graph) 1200×630 par page × par langue,
 * dans public/og/{lang}/{slug}.png — au lieu d'une seule image générique
 * réutilisée sur tout le site.
 *
 * Rendu avec satori (pas de rasterisation façon `sharp`, qui résout les
 * polices par nom installées sur la machine et rendrait un texte invisible
 * sur un serveur/CI sans cette police) puis rasterisé avec le moteur WASM
 * de resvg (portable, marche aussi bien en CI que localement).
 *
 * Exécuté avant `astro build` (voir le script `prebuild` de package.json) :
 * les PNG produits sont des fichiers `public/` classiques, copiés tels
 * quels par Astro comme n'importe quel autre asset statique.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { initWasm, Resvg } from '@resvg/resvg-wasm';
import { ui } from '../src/i18n/ui.ts';
import { useTranslations } from '../src/i18n/utils.ts';
import { routes, routeSlug } from '../src/lib/routes.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'public', 'og');

const PAPER = '#f7f2e7';
const INK = '#24201a';
const INK_SOFT = '#4a4238';
const ACCENT = '#7a2e2e';
const GOLD = '#9a7b3f';
const LINE = '#cdbfa4';

const [regular, bold, wasmBinary] = await Promise.all([
  readFile(join(root, 'node_modules/@fontsource/eb-garamond/files/eb-garamond-latin-400-normal.woff')),
  readFile(join(root, 'node_modules/@fontsource/eb-garamond/files/eb-garamond-latin-700-normal.woff')),
  readFile(join(root, 'node_modules/@resvg/resvg-wasm/index_bg.wasm')),
]);

await initWasm(wasmBinary);

const fonts = [
  { name: 'EB Garamond', data: regular, weight: 400, style: 'normal' },
  { name: 'EB Garamond', data: bold, weight: 700, style: 'normal' },
];

function h(type, style, children) {
  return { type, props: { style, children } };
}

function card({ overline, title, description }) {
  return h(
    'div',
    {
      width: 1200,
      height: 630,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: PAPER,
      padding: '72px 88px',
      fontFamily: 'EB Garamond',
    },
    [
      // Cadre fin, dans l'esprit du favicon.
      h('div', {
        position: 'absolute',
        top: 28,
        left: 28,
        right: 28,
        bottom: 28,
        border: `1.5px solid ${LINE}`,
        borderRadius: 10,
        display: 'flex',
      }),
      h(
        'div',
        { display: 'flex', flexDirection: 'column' },
        [
          h(
            'div',
            {
              display: 'flex',
              alignItems: 'center',
              fontSize: 30,
              color: GOLD,
              letterSpacing: 2,
              textTransform: 'uppercase',
            },
            overline,
          ),
          h(
            'div',
            {
              display: 'flex',
              marginTop: 28,
              fontSize: title.length > 60 ? 56 : 68,
              fontWeight: 700,
              color: INK,
              lineHeight: 1.15,
              maxWidth: 980,
            },
            title,
          ),
          description
            ? h(
                'div',
                {
                  display: 'flex',
                  marginTop: 26,
                  fontSize: 32,
                  color: INK_SOFT,
                  lineHeight: 1.5,
                  maxWidth: 900,
                },
                description.length > 160 ? `${description.slice(0, 157)}…` : description,
              )
            : null,
        ].filter(Boolean),
      ),
      h('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, [
        h('div', { display: 'flex', fontSize: 40, fontWeight: 700, color: ACCENT }, 'G'),
        h('div', { display: 'flex', fontSize: 26, color: INK_SOFT }, 'intervalles-systeme-g.com'),
      ]),
    ],
  );
}

async function renderPng(props) {
  const svg = await satori(card(props), { width: 1200, height: 630, fonts });
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  return resvg.render().asPng();
}

const langs = Object.keys(ui);
let count = 0;

for (const lang of langs) {
  const t = useTranslations(lang);
  await mkdir(join(outDir, lang), { recursive: true });

  for (const route of routes) {
    const { title, description } = route.meta(lang);
    const png = await renderPng({ overline: t('site.title'), title, description });
    await writeFile(join(outDir, lang, `${routeSlug(route.path)}.png`), png);
    count += 1;
  }
}

console.log(`OG images générées : ${count} (${langs.length} langues × ${routes.length} pages).`);
