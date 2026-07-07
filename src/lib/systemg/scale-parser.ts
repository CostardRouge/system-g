/**
 * Parseur des fichiers de gamme du Système G.
 *
 * Format (hérité du player legacy) :
 *   - `# ...`            → ligne de commentaire / titre de section ;
 *   - `NOM = expression` → définition d'une note ou d'une durée ;
 *   - lignes vides ignorées.
 *
 * En cas de doublon, la PREMIÈRE définition gagne (comportement du
 * `Dictionary.Add` + catch du legacy).
 */
import { evaluate, chainResolvers } from './evaluator';

export type ScaleId = 'occidental' | 'oriental';

export interface ScaleEntry {
  /** Numéro de ligne dans le fichier source (à partir de 1). */
  line: number;
  kind: 'comment' | 'definition';
  /** Texte du commentaire, ou nom du symbole. */
  name: string;
  /** Expression brute (vide pour un commentaire). */
  expression: string;
  /** Valeur évaluée en Hz ou en ms (undefined pour un commentaire). */
  value?: number;
}

export interface Scale {
  /** Entrées dans l'ordre du fichier, pour l'affichage. */
  entries: ScaleEntry[];
  /** Table symbole (MAJUSCULES) → expression, pour la résolution. */
  symbols: Map<string, string>;
}

export function parseScale(text: string): Scale {
  const entries: ScaleEntry[] = [];
  const symbols = new Map<string, string>();
  const lines = text.split(/\r\n|\r|\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lineNo = i + 1;
    if (line === '') continue;

    if (line.startsWith('#')) {
      entries.push({ line: lineNo, kind: 'comment', name: line, expression: '' });
      continue;
    }

    const eq = line.indexOf('=');
    if (eq === -1) continue; // le legacy ignorerait/planterait ; on ignore proprement
    const name = line.slice(0, eq).trim();
    const expression = line.slice(eq + 1).trim();
    if (name === '' || expression === '') continue;

    entries.push({ line: lineNo, kind: 'definition', name, expression });

    const key = name.toUpperCase();
    if (!symbols.has(key)) symbols.set(key, expression); // première définition gagne
  }

  // Évaluation de chaque entrée pour l'affichage (Hz / ms).
  const resolve = chainResolvers(symbols);
  for (const entry of entries) {
    if (entry.kind !== 'definition') continue;
    try {
      entry.value = evaluate(entry.expression, resolve);
    } catch {
      entry.value = undefined;
    }
  }

  return { entries, symbols };
}
