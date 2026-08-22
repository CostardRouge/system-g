/**
 * Utilitaires SEO / GEO.
 *
 * Tout est dérivé de la configuration (`Astro.site`, `import.meta.env.BASE_URL`)
 * et des dictionnaires i18n : aucune URL ni aucun texte n'est codé en dur ici.
 * Si le contenu change dans `ui.ts` ou `content/`, les métadonnées suivent.
 */
import { ui, defaultLang } from '../i18n/ui';
import type { Lang } from '../i18n/utils';

/** Locales Open Graph correspondant aux langues du site. */
export const ogLocales: Record<Lang, string> = {
  fr: 'fr_FR',
  en: 'en_US',
  it: 'it_IT',
};

/** Codes hreflang (BCP 47) par langue. */
export const hreflangCodes: Record<Lang, string> = {
  fr: 'fr',
  en: 'en',
  it: 'it',
};

/**
 * Chemin « neutre » : le pathname courant débarrassé du `base` Astro et du
 * préfixe de langue. Sert à reconstruire les URL équivalentes dans chaque langue.
 */
export function neutralPath(pathname: string, base: string): string {
  const cleanBase = base.replace(/\/$/, '');
  let path = pathname;
  if (cleanBase && path.startsWith(cleanBase)) path = path.slice(cleanBase.length);
  for (const lang of Object.keys(ui)) {
    if (lang === defaultLang) continue;
    if (path === `/${lang}` || path.startsWith(`/${lang}/`)) {
      path = path.slice(lang.length + 1);
      break;
    }
  }
  if (!path.startsWith('/')) path = `/${path}`;
  return path;
}

/** Chemin localisé (relatif, `base` inclus) pour un chemin neutre donné. */
export function localizedPathname(neutral: string, lang: Lang, base: string): string {
  const cleanBase = base.replace(/\/$/, '');
  if (lang === defaultLang) return `${cleanBase}${neutral}` || '/';
  return `${cleanBase}/${lang}${neutral === '/' ? '/' : neutral}`;
}

/** URL absolue à partir d'un pathname (s'appuie sur `Astro.site`). */
export function absoluteUrl(pathname: string, site: URL | undefined): string {
  if (!site) return pathname;
  return new URL(pathname, site).href;
}

/**
 * Profils publics de l'auteur, centralisés ici une bonne fois pour toutes.
 * Référencé par le `sameAs` du noeud Person (JSON-LD) — jamais recopié
 * ailleurs, pour ne pas risquer de faire dériver deux sources.
 */
const authorProfiles = ['https://www.linkedin.com/in/nabih-gedeon-978536271/'];

/** Liste dédupliquée des profils de l'auteur, pour le `sameAs` schema.org. */
export function authorSameAs(): string[] {
  return [...new Set(authorProfiles)];
}

/** Contenu de la balise `<meta name="robots">`, selon le flag `noindex` de la page. */
export function robotsDirective(noindex: boolean | undefined): string {
  return noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
}

/**
 * Chemin du jumeau Markdown d'une page (calqué sur le schéma de routes de
 * `src/pages/[...slug].md.ts`, pas sur une manipulation du pathname : la
 * racine `/` et `/en` n'ont pas la même forme, seul le chemin neutre le
 * sait). Ex. `/theorie/introduction` (fr) → `/theorie/introduction.md`,
 * `/` (en) → `/en/index.md`.
 */
export function markdownTwinPathname(pathname: string, base: string, lang: Lang): string {
  const neutral = neutralPath(pathname, base);
  const slug = neutral === '/' ? 'index' : neutral.slice(1);
  const prefixed = lang === defaultLang ? slug : `${lang}/${slug}`;
  return `${base.replace(/\/$/, '')}/${prefixed}.md`;
}

/** Chemin (relatif au `base`) de l'image de partage générée pour une route et une langue données. */
export function ogImagePathname(slug: string, lang: Lang, base: string): string {
  return `${base.replace(/\/$/, '')}/og/${lang}/${slug}.png`;
}

export interface Alternate {
  lang: Lang;
  hreflang: string;
  href: string;
}

/**
 * Liste des URL équivalentes de la page courante dans chaque langue,
 * pour les balises `link rel="alternate" hreflang`.
 */
export function languageAlternates(
  currentPathname: string,
  base: string,
  site: URL | undefined,
): Alternate[] {
  const neutral = neutralPath(currentPathname, base);
  return (Object.keys(ui) as Lang[]).map((lang) => ({
    lang,
    hreflang: hreflangCodes[lang],
    href: absoluteUrl(localizedPathname(neutral, lang, base), site),
  }));
}
