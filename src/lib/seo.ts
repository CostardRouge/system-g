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
