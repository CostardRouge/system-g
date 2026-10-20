/**
 * Le jeu d'icônes (COMMON-PROJECT-SPEC, C11) : les fichiers que
 * scripts/build-icons.mjs écrit dans public/ ont la taille qu'ils annoncent,
 * l'icône tactile d'iOS n'a pas de couche alpha (une transparence s'y affiche
 * en noir), le manifeste et le <head> les déclarent tous. Un écart ici se
 * voit sur un téléphone seulement : chaque onglet de bureau a l'air juste.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const root = new URL('../../../', import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root));

/** Largeur, hauteur et type de couleur (2 = RGB, 6 = RGBA) lus dans l'en-tête IHDR d'un PNG. */
function png(path: string) {
  const bytes = read(path);
  expect(bytes.subarray(0, 8), path).toEqual(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  expect(bytes.subarray(12, 16).toString('latin1'), path).toBe('IHDR');
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20), colorType: bytes[25] };
}

const rasters: Record<string, number> = {
  'public/favicon-16.png': 16,
  'public/favicon-32.png': 32,
  'public/icon-192.png': 192,
  'public/icon-512.png': 512,
  'public/icon-maskable-192.png': 192,
  'public/icon-maskable-512.png': 512,
  'public/apple-touch-icon.png': 180,
};

describe("le jeu d'icônes", () => {
  it('a chaque PNG à la taille annoncée par son nom', () => {
    for (const [path, size] of Object.entries(rasters)) {
      const { width, height } = png(path);
      expect([width, height], path).toEqual([size, size]);
    }
  });

  it("a une icône tactile iOS sans couche alpha, et des icônes de navigateur avec", () => {
    expect(png('public/apple-touch-icon.png').colorType).toBe(2);
    expect(png('public/icon-512.png').colorType).toBe(6);
    expect(png('public/icon-maskable-512.png').colorType).toBe(6);
  });

  it('garde ses trois sources SVG, et favicon.svg comme ancienne adresse de icon.svg', () => {
    for (const name of ['icon.svg', 'icon-apple.svg', 'icon-maskable.svg']) {
      expect(read(`public/${name}`).toString('utf8'), name).toContain('<svg');
    }
    expect(read('public/favicon.svg').equals(read('public/icon.svg'))).toBe(true);
  });

  it('a un favicon.ico qui embarque les tailles 16, 32 et 48', () => {
    const ico = read('public/favicon.ico');
    expect(ico.readUInt16LE(2)).toBe(1);
    const count = ico.readUInt16LE(4);
    const sizes = Array.from({ length: count }, (_, i) => ico[6 + 16 * i]);
    expect(sizes).toEqual([16, 32, 48]);
  });

  it('est déclaré en entier par le manifeste, avec des chemins relatifs', () => {
    const manifest = JSON.parse(read('public/site.webmanifest').toString('utf8'));
    const icons = manifest.icons as { src: string; sizes: string; purpose: string }[];
    const declared = icons.map((icon) => `${icon.src} ${icon.sizes} ${icon.purpose}`).sort();
    expect(declared).toEqual([
      'icon-192.png 192x192 any',
      'icon-512.png 512x512 any',
      'icon-maskable-192.png 192x192 maskable',
      'icon-maskable-512.png 512x512 maskable',
    ]);
    for (const icon of icons) {
      expect(icon.src, icon.src).not.toMatch(/^\//);
      const { width } = png(`public/${icon.src}`);
      expect(icon.sizes, icon.src).toBe(`${width}x${width}`);
    }
    expect(manifest.short_name).toBe('Système G');
  });

  it('est déclaré en entier dans le <head> du layout', () => {
    const layout = read('src/layouts/BaseLayout.astro').toString('utf8');
    for (const needle of [
      '/icon.svg`} type="image/svg+xml"',
      '/favicon-32.png`} sizes="32x32"',
      '/favicon-16.png`} sizes="16x16"',
      '<link rel="apple-touch-icon" href={`',
      '/apple-touch-icon.png`} />',
      '<link rel="manifest" href={`',
      '/site.webmanifest`} />',
      '<meta name="theme-color" content="#7a2e2e" />',
      '<meta name="apple-mobile-web-app-title" content="Système G" />',
    ]) {
      expect(layout, needle).toContain(needle);
    }
  });
});
