/**
 * Mesure d'audience : les réglages que le build écrit dans chaque page.
 *
 * Umami, auto-hébergé par l'éditeur du site (la même instance que ses autres
 * sites), sans cookie ni identifiant inter-sites. Le build n'écrit qu'un bloc
 * de réglages (`Audience.astro`) ; c'est le script de la page
 * (`audience-client.ts`) qui charge le traceur, et seulement si le visiteur
 * n'a pas dit non (Do Not Track, Global Privacy Control, la clé
 * `umami.disabled`).
 *
 * Rien ici n'est secret : tout finit dans le HTML. Les variables
 * d'environnement permettent de changer d'instance ou de domaine sans toucher
 * au code, et surtout de couper la mesure : un `UMAMI_WEBSITE_ID` vide ou
 * absent n'écrit rien du tout.
 */

export interface AudienceSettings {
  /** L'adresse du traceur. */
  src: string;
  /** L'identifiant du site dans le tableau de bord Umami. */
  website: string;
  /** Les hôtes autorisés à compter, séparés par des virgules (`data-domains`). */
  domains: string;
}

/** Les réglages par défaut : l'instance de l'éditeur, nommée /insight (les listes de filtres bloquent /script.js). */
export const AUDIENCE_DEFAULTS = {
  src: 'https://insight.steevepommier.com/insight',
  /** Le domaine personnalisé et la copie GitHub Pages ; tout autre hôte (localhost, un fork) ne compte pas. */
  domains: ['intervalles-systeme-g.com', 'costardrouge.github.io'],
} as const;

/** L'identifiant de l'élément qui porte les réglages dans le <head>. */
export const AUDIENCE_SETTINGS_ID = 'audience-settings';

type Env = Record<string, string | boolean | undefined>;

const list = (value: string): string[] =>
  value
    .split(',')
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);

/**
 * Les réglages de ce build, ou `null` pour aucune mesure : en production
 * seulement (`npm run dev` et les tests ne comptent jamais), sauf si
 * `UMAMI_DEV=true` ; sans `UMAMI_WEBSITE_ID`, rien.
 */
export function audienceSettings(env: Env, opts: { production: boolean }): AudienceSettings | null {
  if (!opts.production && env.UMAMI_DEV !== 'true') return null;
  const website = String(env.UMAMI_WEBSITE_ID ?? '').trim();
  if (!website) return null;
  let src: string = AUDIENCE_DEFAULTS.src;
  try {
    const custom = new URL(String(env.UMAMI_SRC ?? '').trim() || AUDIENCE_DEFAULTS.src);
    if (custom.protocol === 'https:' || custom.protocol === 'http:') src = custom.href;
  } catch {
    /* une adresse inutilisable garde le traceur par défaut */
  }
  const domains =
    typeof env.UMAMI_DOMAINS === 'string' ? list(env.UMAMI_DOMAINS) : [...AUDIENCE_DEFAULTS.domains];
  return { src, website, domains: domains.join(',') };
}

/** Le JSON des réglages, sûr dans un <script> : jamais de `<` qui fermerait la balise. */
export function audienceJson(settings: AudienceSettings): string {
  return JSON.stringify(settings).replace(/</g, '\\u003c');
}
