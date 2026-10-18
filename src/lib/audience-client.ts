/**
 * Mesure d'audience, côté navigateur.
 *
 * Lit les réglages que le build a écrits dans le <head> (`Audience.astro`) et
 * charge le traceur Umami, sauf si le visiteur a dit non : Do Not Track,
 * Global Privacy Control (qu'Umami ignore de lui-même) ou la clé
 * `umami.disabled` dans localStorage (la clé de refus d'Umami, qu'un visiteur
 * peut poser à la main). Sans réglages dans la page (développement, build
 * sans mesure), ne fait rien : aucune requête ne part.
 *
 * Le site est statique, chaque page est un chargement complet : le suivi
 * automatique du traceur convient, sans paramètres ni fragment d'URL.
 */

import { AUDIENCE_SETTINGS_ID, type AudienceSettings } from './audience';

const OPT_OUT_KEY = 'umami.disabled';

function settings(): AudienceSettings | null {
  try {
    const raw = document.getElementById(AUDIENCE_SETTINGS_ID)?.textContent ?? 'null';
    const c = JSON.parse(raw) as Partial<AudienceSettings> | null;
    if (c && typeof c.src === 'string' && typeof c.website === 'string') {
      return { src: c.src, website: c.website, domains: String(c.domains ?? '') };
    }
  } catch {
    /* réglages illisibles : pas de mesure */
  }
  return null;
}

function optedOut(): boolean {
  try {
    return Boolean(localStorage.getItem(OPT_OUT_KEY));
  } catch {
    return false;
  }
}

function privacySignal(): boolean {
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean; msDoNotTrack?: string };
  const dnt = nav.doNotTrack ?? (window as Window & { doNotTrack?: string }).doNotTrack ?? nav.msDoNotTrack;
  return nav.globalPrivacyControl === true || dnt === '1' || dnt === 'yes';
}

export function startAudience(): void {
  const cfg = settings();
  if (!cfg || privacySignal() || optedOut()) return;
  const script = document.createElement('script');
  script.async = true;
  script.src = cfg.src;
  Object.assign(script.dataset, {
    websiteId: cfg.website,
    domains: cfg.domains,
    doNotTrack: 'true',
    excludeSearch: 'true',
    excludeHash: 'true',
  });
  document.head.append(script);
}

startAudience();
