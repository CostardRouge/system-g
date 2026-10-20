/**
 * Jumeaux Markdown des pages réelles — `/theorie/introduction.md`, etc.
 *
 * Convention GEO : une version texte brut de chaque page, pour les modèles
 * qui préfèrent du Markdown au HTML. Une seule route dynamique couvre
 * toutes les pages × langues (voir `src/lib/routes.ts`), plutôt que de
 * dupliquer un fichier par page comme pour les `.astro`. Une adresse
 * traduite (src/lib/slugs.ts) donne un jumeau traduit : `/en/legal.md`.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { ui, defaultLang } from '../i18n/ui';
import type { Lang } from '../i18n/utils';
import { indexableRoutes } from '../lib/routes';
import { renderRouteMarkdown } from '../lib/markdown';
import { localizedSlug } from '../lib/slugs';

export const getStaticPaths: GetStaticPaths = () => {
  const langs = Object.keys(ui) as Lang[];
  return indexableRoutes().flatMap((route) =>
    langs.map((lang) => {
      const served = localizedSlug(route.path, lang);
      const slug = served === '/' ? 'index' : served.slice(1);
      return {
        params: { slug: lang === defaultLang ? slug : `${lang}/${slug}` },
        props: { path: route.path, lang },
      };
    }),
  );
};

export const GET: APIRoute = ({ props, site }) => {
  const { path, lang } = props as { path: string; lang: Lang };
  const body = renderRouteMarkdown(path, lang, import.meta.env.BASE_URL, site);

  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
