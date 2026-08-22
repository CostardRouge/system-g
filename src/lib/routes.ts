/**
 * Manifeste des pages réelles du site (hors rubriques « en préparation »,
 * exclues du sitemap et des jumeaux Markdown/OG puisqu'elles n'ont pas
 * encore de contenu substantiel — voir `litterature.astro`, en `noindex`).
 *
 * Source unique consommée par le sitemap, le générateur d'images OG et les
 * jumeaux Markdown : chaque route n'existe qu'une fois ici, son titre et sa
 * description restant résolus depuis `ui.ts` / `content/*.ts` — jamais
 * recopiés en dur.
 */
import { useTranslations, type Lang } from '../i18n/utils';
import type { PageType } from '../components/Seo.astro';
import { bioParagraphs } from '../content/bio';
import { introduction } from '../content/introduction';
import { aide } from '../content/aide';
import { comparaison } from '../content/comparaison';

export interface RouteMeta {
  title: string;
  description: string;
}

export interface RouteDef {
  /** Chemin neutre : sans `base` Astro ni préfixe de langue. */
  path: string;
  /** Pilote og:type et le nœud schema.org — voir SchemaOrg.astro. */
  type: PageType;
  meta(lang: Lang): RouteMeta;
  /**
   * Contenu « en préparation » (voir `noindex` sur litterature.astro) :
   * exclue du sitemap et des jumeaux Markdown, mais garde son image OG
   * (utile si le lien est tout de même partagé).
   */
  noindex?: boolean;
}

export const routes: RouteDef[] = [
  {
    path: '/',
    type: 'website',
    meta: (lang) => {
      const t = useTranslations(lang);
      return { title: t('site.title'), description: t('site.description') };
    },
  },
  {
    path: '/biographie',
    type: 'profile',
    meta: (lang) => {
      const t = useTranslations(lang);
      return { title: t('bio.title'), description: bioParagraphs[lang]?.[0] ?? t('bio.subtitle') };
    },
  },
  {
    path: '/theorie',
    type: 'website',
    meta: (lang) => {
      const t = useTranslations(lang);
      return { title: t('nav.theory'), description: t('theory.index.lede') };
    },
  },
  {
    path: '/theorie/introduction',
    type: 'article',
    meta: (lang) => ({ title: introduction[lang].title, description: introduction[lang].subtitle }),
  },
  {
    path: '/theorie/comparaison',
    type: 'article',
    meta: (lang) => ({ title: comparaison[lang].title, description: comparaison[lang].subtitle }),
  },
  {
    path: '/theorie/positions',
    type: 'app',
    meta: (lang) => {
      const t = useTranslations(lang);
      return { title: t('theory.sub.positions.title'), description: t('theory.sub.positions.desc') };
    },
  },
  {
    path: '/player',
    type: 'app',
    meta: (lang) => {
      const t = useTranslations(lang);
      return { title: t('nav.player'), description: t('player.lede') };
    },
  },
  {
    path: '/player/aide',
    type: 'article',
    meta: (lang) => ({ title: aide[lang].title, description: aide[lang].subtitle }),
  },
  {
    path: '/litterature',
    type: 'website',
    noindex: true,
    meta: (lang) => {
      const t = useTranslations(lang);
      return { title: t('nav.literature'), description: t('home.card.literature.desc') };
    },
  },
];

/** Routes indexables : celles qui figurent dans le sitemap et ont un jumeau Markdown. */
export function indexableRoutes(): RouteDef[] {
  return routes.filter((route) => !route.noindex);
}

/** Fichier source (relatif à la racine du dépôt) d'une route, pour une langue. */
export function sourceFileForRoute(path: string, lang: Lang): string {
  const base = lang === 'fr' ? 'src/pages' : `src/pages/${lang}`;
  return path === '/' ? `${base}/index.astro` : `${base}${path}.astro`;
}

/** Identifiant de fichier stable pour une route (utilisé pour les images OG et les jumeaux Markdown). */
export function routeSlug(path: string): string {
  return path === '/' ? 'index' : path.replace(/^\//, '').replace(/\//g, '-');
}
