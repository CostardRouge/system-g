/**
 * Jumeaux Markdown des pages réelles — `/theorie/introduction.md`, etc.
 *
 * Convention GEO : une version texte brut de chaque page, pour les modèles
 * qui préfèrent du Markdown au HTML. Une seule route dynamique couvre
 * toutes les pages × langues (voir `src/lib/routes.ts`), plutôt que de
 * dupliquer un fichier par page comme pour les `.astro`.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { ui, defaultLang } from '../i18n/ui';
import type { Lang } from '../i18n/utils';
import { indexableRoutes } from '../lib/routes';
import { renderRouteMarkdown } from '../lib/markdown';

export const getStaticPaths: GetStaticPaths = () => {
  const langs = Object.keys(ui) as Lang[];
  return indexableRoutes().flatMap((route) => {
    const neutralSlug = route.path === '/' ? 'index' : route.path.slice(1);
    return langs.map((lang) => ({
      params: { slug: lang === defaultLang ? neutralSlug : `${lang}/${neutralSlug}` },
      props: { path: route.path, lang },
    }));
  });
};

export const GET: APIRoute = ({ props }) => {
  const { path, lang } = props as { path: string; lang: Lang };
  const body = renderRouteMarkdown(path, lang, import.meta.env.BASE_URL);

  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
