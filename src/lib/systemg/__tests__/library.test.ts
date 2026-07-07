import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parseScale } from '../scale-parser';
import { parseScore } from '../score-parser';
import { INSTRUMENT_IDS } from '../instruments';
import { SCORE_LIBRARY } from '../library';

const read = (p: string) => readFileSync(fileURLToPath(new URL(p, import.meta.url)), 'utf8');
const scales = {
  occidental: parseScale(read('../data/occidental_scale.txt')),
  oriental: parseScale(read('../data/oriental_scale.txt')),
};

describe('bibliothèque complète', () => {
  it('contient les trois catégories', () => {
    const cats = new Set(SCORE_LIBRARY.map((e) => e.category));
    expect(cats).toEqual(new Set(['repertoire', 'vaccai', 'varietes']));
    expect(SCORE_LIBRARY.length).toBeGreaterThan(200);
  });

  it('chaque fichier existe, se parse sans erreur, et produit des notes', () => {
    const failures: string[] = [];
    const allWarnings: string[] = [];
    for (const entry of SCORE_LIBRARY) {
      let text: string;
      try {
        text = read(`../../../../public/player/scores/${entry.file}`);
      } catch {
        failures.push(`${entry.file}: fichier manquant`);
        continue;
      }
      let parsed = parseScore(text, scales.occidental.symbols, INSTRUMENT_IDS);
      if (parsed.scale === 'oriental') {
        parsed = parseScore(text, scales.oriental.symbols, INSTRUMENT_IDS);
      }
      if (parsed.errors.length > 0) {
        failures.push(
          `${entry.file}: ${parsed.errors
            .slice(0, 3)
            .map((e) => `L${e.line} ${e.message}`)
            .join(' | ')}`,
        );
      } else if (parsed.noteCount === 0) {
        failures.push(`${entry.file}: aucune note`);
      }
      for (const w of parsed.warnings) allWarnings.push(`${entry.file}: ${w.message}`);
    }
    expect(failures, failures.join('\n')).toEqual([]);
    // Seuls les « $ cello » des partitions écrites pour la version admin
    // (échantillon perdu) sont attendus en avertissement.
    expect(allWarnings.every((w) => w.includes('cello')), allWarnings.join('\n')).toBe(true);
    expect(allWarnings.length).toBe(5);
  });
});

describe('instruments inconnus (échantillons perdus)', () => {
  it('produisent un avertissement, pas une erreur bloquante', () => {
    const s = parseScore(
      '@occidental\n$ cello\nla,c\n',
      scales.occidental.symbols,
      INSTRUMENT_IDS,
    );
    expect(s.errors).toEqual([]);
    expect(s.warnings).toEqual([{ line: 2, message: 'cello not found in the instrument list' }]);
    expect(s.noteCount).toBe(1);
  });
});
