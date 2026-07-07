/**
 * Parseur des fichiers de partition (« Run files ») du Système G.
 *
 * Format (hérité du player legacy) :
 *   - `@occidental` / `@oriental` → gamme à utiliser (ligne d'en-tête) ;
 *   - `NOM = expression`          → définition locale (prioritaire sur la
 *                                   gamme, la DERNIÈRE définition gagne) ;
 *   - `$ instrument`              → changement d'instrument ;
 *   - `# ...`                     → commentaire / repère de section ;
 *   - `note,durée`                → un événement musical (monophonique).
 *
 * Les définitions locales sont séquentielles : elles ne s'appliquent qu'aux
 * lignes qui les suivent (comportement du legacy).
 *
 * Chaque valeur (fréquence et durée) doit rester dans [0, 32767] ; les
 * erreurs sont rapportées avec leur numéro de ligne, comme dans le legacy.
 */
import { evaluate, chainResolvers, UndefinedSymbolError } from './evaluator';
import type { ScaleId } from './scale-parser';

export interface ScoreError {
  line: number;
  message: string;
}

export type ScoreEvent =
  | { line: number; type: 'comment'; text: string }
  | { line: number; type: 'definition'; name: string; expression: string }
  | { line: number; type: 'instrument'; name: string }
  | {
      line: number;
      type: 'note';
      /** Expression brute de la note (ex. "mih"). */
      noteExpr: string;
      /** Expression brute de la durée (ex. "dc"). */
      durExpr: string;
      /** Fréquence évaluée en Hz (0 = silence). */
      freqHz: number;
      /** Durée évaluée en millisecondes. */
      durMs: number;
    };

export interface ParsedScore {
  /** Gamme demandée par l'en-tête `@`, ou null si absente. */
  scale: ScaleId | null;
  events: ScoreEvent[];
  errors: ScoreError[];
  /**
   * Avertissements non bloquants. Un instrument inconnu (ex. `$ cello`,
   * présent dans quelques partitions écrites pour la version « admin » du
   * legacy dont les échantillons sont perdus) n'empêche pas la lecture :
   * le moteur conserve alors l'instrument courant.
   */
  warnings: ScoreError[];
  /** Durée totale en millisecondes (somme des durées des notes). */
  totalMs: number;
  /** Nombre d'événements « note ». */
  noteCount: number;
}

/** Liste des noms d'instruments connus (minuscules), pour la validation des `$`. */
export function parseScore(
  text: string,
  scaleSymbols: ReadonlyMap<string, string>,
  knownInstruments: readonly string[],
): ParsedScore {
  const events: ScoreEvent[] = [];
  const errors: ScoreError[] = [];
  const warnings: ScoreError[] = [];
  const local = new Map<string, string>();
  const resolve = chainResolvers(local, scaleSymbols);
  let scale: ScaleId | null = null;
  let totalMs = 0;
  let noteCount = 0;
  /** Vrai tant qu'aucune ligne de contenu (définition/instrument/note) n'a été lue. */
  let first = true;

  const lines = text.split(/\r\n|\r|\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lineNo = i + 1;
    if (line === '') continue;

    // En-tête de gamme — accepté tant qu'aucun contenu n'a été rencontré.
    if (first && line.startsWith('@')) {
      const id = line.slice(1).trim().toLowerCase();
      if (id === 'occidental' || id === 'oriental') {
        scale = id;
      } else {
        errors.push({ line: lineNo, message: `Error in ${line}` });
      }
      first = false;
      continue;
    }

    // Commentaire (ne clôt pas la fenêtre d'en-tête, comme le legacy).
    if (line.startsWith('#')) {
      events.push({ line: lineNo, type: 'comment', text: line });
      continue;
    }

    // Définition locale : la dernière gagne.
    if (line.includes('=')) {
      const parts = line.split('=');
      if (parts.length !== 2 || parts[0].trim() === '' || parts[1].trim() === '') {
        errors.push({ line: lineNo, message: `Error in ${line}` });
        continue;
      }
      const name = parts[0].trim();
      const expression = parts[1].trim();
      events.push({ line: lineNo, type: 'definition', name, expression });
      local.set(name.toUpperCase(), expression);
      first = false;
      continue;
    }

    // Changement d'instrument.
    if (line.startsWith('$')) {
      const name = line.slice(1).trim().toLowerCase();
      events.push({ line: lineNo, type: 'instrument', name });
      if (!knownInstruments.includes(name)) {
        warnings.push({ line: lineNo, message: `${name} not found in the instrument list` });
      }
      first = false;
      continue;
    }

    // Événement note : `note,durée`.
    const parts = line.split(',');
    if (parts.length !== 2 || parts[0].trim() === '' || parts[1].trim() === '') {
      errors.push({ line: lineNo, message: `Error in ${line}` });
      first = false;
      continue;
    }

    const noteExpr = parts[0].trim();
    const durExpr = parts[1].trim();
    let freqHz = 0;
    let durMs = 0;
    let failed = false;

    for (const [expr, isDuration] of [
      [noteExpr, false],
      [durExpr, true],
    ] as const) {
      let value = 0;
      try {
        value = evaluate(expr, resolve);
      } catch (err) {
        if (err instanceof UndefinedSymbolError) {
          errors.push({ line: lineNo, message: `${err.symbol} is not defined` });
        } else {
          errors.push({ line: lineNo, message: `Error in ${expr}` });
        }
        failed = true;
        continue;
      }
      if (value < 0 || value > 32767 || !Number.isFinite(value)) {
        errors.push({
          line: lineNo,
          message: `${expr} = ${Math.round(value)}, has a wrong value`,
        });
        failed = true;
        continue;
      }
      if (isDuration) durMs = value;
      else freqHz = value;
    }

    first = false;
    if (failed) continue;

    events.push({ line: lineNo, type: 'note', noteExpr, durExpr, freqHz, durMs });
    totalMs += durMs;
    noteCount++;
  }

  return { scale, events, errors, warnings, totalMs, noteCount };
}

/** Formate une durée en ms comme le legacy : HH:MM:SS.mmm */
export function formatDuration(totalMs: number): string {
  const ms = Math.round(totalMs);
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  const r = ms % 1000;
  const pad = (n: number, w: number) => String(n).padStart(w, '0');
  return `${pad(h, 2)}:${pad(m, 2)}:${pad(s, 2)}.${pad(r, 3)}`;
}
