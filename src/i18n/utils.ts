/**
 * Utilitaires d'internationalisation.
 *
 * S'appuie sur le routage i18n natif d'Astro : le français est servi à la
 * racine (`/`), l'anglais est préfixé (`/en/`). Ces fonctions restent
 * volontairement simples et sans dépendance externe.
 */
import { ui, defaultLang, languages, type UiKey } from './ui';

export type Lang = keyof typeof ui;

/** Déduit la langue courante à partir de l'URL. */
export function getLangFromUrl(url: URL): Lang {
  const [, maybeLang] = url.pathname.split('/');
  if (maybeLang in ui) return maybeLang as Lang;
  return defaultLang;
}

/**
 * Renvoie une fonction de traduction pour la langue donnée.
 * Retombe sur le français si la clé est absente dans la langue cible.
 */
export function useTranslations(lang: Lang) {
  return function t(key: UiKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/**
 * Construit un chemin localisé et compatible avec le `base` d'Astro.
 * Exemple : localizedPath('/biographie', 'en') → '/en/biographie'
 */
export function localizedPath(path: string, lang: Lang): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (lang === defaultLang) return `${base}${clean}` || '/';
  return `${base}/${lang}${clean}`;
}

/** Liste des langues disponibles (code + libellé). */
export function listLanguages() {
  return Object.entries(languages) as [Lang, string][];
}

export { defaultLang, languages };
