/**
 * Bibliothèque de partitions du player.
 *
 * `library.json` est GÉNÉRÉ par `scripts/build-library.mjs` à partir des
 * fichiers legacy (dossier `system-g-player/occidental - txt`) — ne pas
 * l'éditer à la main : relancer le script après tout ajout de partition.
 */
import manifest from './library.json';

export type ScoreCategory = 'repertoire' | 'vaccai' | 'varietes';

export interface LibraryEntry {
  /** Nom de fichier dans public/player/scores/. */
  file: string;
  title: string;
  composer: string;
  category: ScoreCategory;
}

export const SCORE_LIBRARY: readonly LibraryEntry[] = manifest as LibraryEntry[];

export const CATEGORY_LABELS: Record<ScoreCategory, { fr: string; en: string; it: string }> = {
  repertoire: { fr: 'Répertoire classique', en: 'Classical repertoire', it: 'Repertorio classico' },
  vaccai: { fr: 'Vaccai (méthode de chant)', en: 'Vaccai (singing method)', it: 'Vaccai (metodo di canto)' },
  varietes: { fr: 'Variétés', en: 'Popular songs', it: 'Canzoni' },
};
