/**
 * Comparaison avec le tempérament égal (12-TET).
 *
 * Le cœur pédagogique du Système G est l'écart entre l'intonation juste
 * (rapports de fréquences exacts) et le tempérament égal du piano moderne.
 * Ce module fournit les deux outils de cette comparaison :
 *   - `snapToEqual`  : la fréquence 12-TET la plus proche (pour ENTENDRE
 *     le même passage en tempérament égal — comparateur A/B) ;
 *   - `centsFromEqual` : l'écart en cents entre la note juste et sa voisine
 *     tempérée (pour VOIR les positions du Système G).
 *
 * La référence est le LA de la gamme chargée (441 Hz en occidental,
 * 440 Hz en oriental) afin que les deux versions partagent le même diapason.
 */

/** Nombre de demi-tons 12-TET (arrondi) entre `freqHz` et la référence. */
export function nearestSemitones(freqHz: number, refHz: number): number {
  return Math.round(12 * Math.log2(freqHz / refHz));
}

/** Fréquence 12-TET la plus proche de `freqHz` (diapason `refHz`). */
export function snapToEqual(freqHz: number, refHz: number): number {
  if (freqHz <= 0) return 0;
  return refHz * Math.pow(2, nearestSemitones(freqHz, refHz) / 12);
}

/**
 * Écart en cents entre `freqHz` et sa note 12-TET la plus proche.
 * Positif = plus haut que le tempérament égal. Toujours dans ]-50, +50].
 */
export function centsFromEqual(freqHz: number, refHz: number): number {
  if (freqHz <= 0) return 0;
  return 1200 * Math.log2(freqHz / snapToEqual(freqHz, refHz));
}

/** Écart en cents entre deux fréquences quelconques. */
export function centsBetween(aHz: number, bHz: number): number {
  return 1200 * Math.log2(aHz / bHz);
}
