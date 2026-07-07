// @ts-check
import { defineConfig } from 'astro/config';

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

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
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
