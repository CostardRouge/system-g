/**
 * Les faits que les mentions légales citent, pris dans le code — jamais
 * recopiés en dur dans les textes (src/content/legal.ts), qui ne portent que
 * des marqueurs `{nom}`. Un test (src/lib/__tests__/legal.test.ts) tient les
 * textes à ces faits : l'hôte du traceur, les clés posées dans le navigateur,
 * l'absence d'événement envoyé.
 */
import { AUDIENCE_DEFAULTS, AUDIENCE_OPT_OUT_KEY } from './audience';
import { PLAYER_SETTINGS_KEY } from './player-settings';

/** Le dépôt public du site ; sa licence est LICENSE sur main. */
export const SOURCE_REPOSITORY = 'https://github.com/CostardRouge/system-g';

export const LEGAL_FACTS = {
  source: SOURCE_REPOSITORY,
  license: `${SOURCE_REPOSITORY}/blob/main/LICENSE`,
  /** L'hôte du traceur (l'instance de l'éditeur). */
  tracker: new URL(AUDIENCE_DEFAULTS.src).host,
  settingsKey: PLAYER_SETTINGS_KEY,
  optOutKey: AUDIENCE_OPT_OUT_KEY,
} as const;

/** Les marqueurs qu'un texte peut porter. */
export type LegalVar = keyof typeof LEGAL_FACTS | 'host';

/** Les valeurs des marqueurs pour un build : l'hôte du site vient de `Astro.site`. */
export function legalVars(site: URL | undefined): Record<LegalVar, string> {
  return { ...LEGAL_FACTS, host: site?.host ?? '' };
}

/** Remplace les marqueurs `{nom}` ; un marqueur inconnu reste tel quel (le test le voit). */
export function fillLegal(text: string, vars: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? vars[key] : match));
}

/** Les marqueurs présents dans un texte. */
export function placeholdersOf(text: string): string[] {
  return [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]);
}
