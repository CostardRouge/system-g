/**
 * Ce que le navigateur dit de la mesure d'audience : le refus posé par le
 * visiteur (la clé de refus d'Umami dans localStorage) et les signaux de
 * confidentialité (Do Not Track, Global Privacy Control). Sans effet de bord
 * à l'import, pour être lu par le chargeur du traceur (audience-client.ts)
 * comme par l'interrupteur des mentions légales (legal-client.ts).
 */
import { AUDIENCE_OPT_OUT_KEY } from './audience';

/** Vrai si le visiteur a coupé la mesure dans ce navigateur. */
export function optedOut(): boolean {
  try {
    return Boolean(localStorage.getItem(AUDIENCE_OPT_OUT_KEY));
  } catch {
    return false;
  }
}

/** Pose ou retire le refus ; sans effet si le stockage est indisponible. */
export function setOptedOut(off: boolean): void {
  try {
    if (off) localStorage.setItem(AUDIENCE_OPT_OUT_KEY, '1');
    else localStorage.removeItem(AUDIENCE_OPT_OUT_KEY);
  } catch {
    /* stockage indisponible : le choix ne peut pas être gardé */
  }
}

/** Vrai si le navigateur demande à ne pas être suivi (DNT ou GPC). */
export function privacySignal(): boolean {
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean; msDoNotTrack?: string };
  const dnt = nav.doNotTrack ?? (window as Window & { doNotTrack?: string }).doNotTrack ?? nav.msDoNotTrack;
  return nav.globalPrivacyControl === true || dnt === '1' || dnt === 'yes';
}
