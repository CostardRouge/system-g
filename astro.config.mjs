// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * Configuration Astro — site statique, sans vendor lock.
 *
 * Le `site` et le `base` sont pilotés par variables d'environnement pour
 * distinguer proprement le mode développement et le mode production
 * (GitHub Pages en sous-chemin, ou domaine personnalisé).
 *
 *   SITE_URL   → URL absolue du site en production
 *                (ex: https://intervalles-systeme-g.com
 *                 ou  https://<user>.github.io)
 *   BASE_PATH  → sous-chemin de déploiement
 *                (ex: "/" pour un domaine perso,
 *                 ou  "/systeme-g" pour GitHub Pages projet)
 */
const SITE_URL = process.env.SITE_URL ?? 'https://intervalles-systeme-g.com';
const BASE_PATH = process.env.BASE_PATH ?? '/';
// Dossiers de sortie et de cache surchargeables (utile en CI ou sur
// systèmes de fichiers réseau).
const OUT_DIR = process.env.OUT_DIR ?? 'dist';
const CACHE_DIR = process.env.ASTRO_CACHE_DIR ?? './.astro';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  trailingSlash: 'ignore',
  outDir: OUT_DIR,
  cacheDir: CACHE_DIR,
  build: {
    format: 'directory',
  },
  integrations: [
    // Sitemap avec annotations hreflang : les locales déclarées ici doivent
    // rester alignées sur la section `i18n` ci-dessous.
    sitemap({
      i18n: {
        defaultLocale: 'fr',
        locales: {
          fr: 'fr',
          en: 'en',
          it: 'it',
        },
      },
    }),
  ],
  vite: {
    // Emplacement du cache Vite, surchargeable (utile dans les
    // environnements où node_modules est en lecture partagée).
    cacheDir: process.env.VITE_CACHE_DIR || 'node_modules/.vite',
  },
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en', 'it'],
    routing: {
      // Le français (langue de base) reste à la racine : /
      // Les autres langues sont préfixées : /en/, /it/
      prefixDefaultLocale: false,
    },
  },
});
