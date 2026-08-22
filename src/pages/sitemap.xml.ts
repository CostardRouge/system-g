/**
 * sitemap.xml généré à la main (et non par un plugin d'analyse statique),
 * pour avoir accès aux données réelles de chaque page : `lastmod` (dernier
 * commit git du fichier source) et l'image de partage associée — deux
 * informations qu'un plugin config-time ne peut pas connaître.
 *
 * Toutes les pages réelles × toutes les langues, à l'exclusion des
 * rubriques « en préparation » (voir `noindex` sur litterature.astro) :
 * un sitemap n'a pas vocation à lister du contenu volontairement exclu de
 * l'index.
 */
import type { APIRoute } from 'astro';
import { ui } from '../i18n/ui';
import type { Lang } from '../i18n/utils';
import { absoluteUrl, localizedPathname, ogImagePathname } from '../lib/seo';
import { indexableRoutes, routeSlug, sourceFileForRoute } from '../lib/routes';
import { gitLastModified } from '../lib/git';

const langs = Object.keys(ui) as Lang[];

export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL;

  const urlEntries = indexableRoutes().flatMap((route) => {
    const slug = routeSlug(route.path);
    return langs.map((lang) => {
      const loc = absoluteUrl(localizedPathname(route.path, lang, base), site);
      const lastmod = gitLastModified(sourceFileForRoute(route.path, lang));
      const image = absoluteUrl(ogImagePathname(slug, lang, base), site);

      const alternates = langs
        .map(
          (altLang) =>
            `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${absoluteUrl(localizedPathname(route.path, altLang, base), site)}" />`,
        )
        .join('\n');

      return [
        '  <url>',
        `    <loc>${loc}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        alternates,
        '    <image:image>',
        `      <image:loc>${image}</image:loc>`,
        '    </image:image>',
        '  </url>',
      ].join('\n');
    });
  });

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml"',
    '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ...urlEntries,
    '</urlset>',
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
