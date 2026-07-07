import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parseScale } from '../scale-parser';
import { evaluate, chainResolvers } from '../evaluator';

const read = (f: string) =>
  readFileSync(fileURLToPath(new URL(`../data/${f}`, import.meta.url)), 'utf8');

const occidental = parseScale(read('occidental_scale.txt'));
const oriental = parseScale(read('oriental_scale.txt'));

describe('gamme occidentale (LA = 441)', () => {
  const hz = (sym: string) => evaluate(sym, chainResolvers(occidental.symbols));

  it('contient plusieurs centaines de définitions', () => {
    expect(occidental.symbols.size).toBeGreaterThan(300);
  });

  it('valeurs de référence calculées depuis les fractions du legacy', () => {
    expect(hz('P')).toBe(0); // pause
    expect(hz('LA')).toBe(441);
    expect(hz('LAG')).toBe(220.5);
    expect(hz('LAH')).toBe(882);
    expect(hz('MIH')).toBeCloseTo(441 * (3 / 2), 10); // 661.5
    expect(hz('SI')).toBeCloseTo(441 * (9 / 8), 10); // 496.125
    expect(hz('REH')).toBeCloseTo(441 * (4 / 3), 10); // 588
    expect(hz('SOLG')).toBeCloseTo(220.5 * (8 / 9), 10); // 196
    // Une « position 3 » du Système G : REHD3 = REH*189/176
    expect(hz('REHD3')).toBeCloseTo(441 * (4 / 3) * (189 / 176), 10);
  });

  it('durées de référence (N = 800)', () => {
    expect(hz('N')).toBe(800);
    expect(hz('B')).toBe(1600);
    expect(hz('C')).toBe(400);
    expect(hz('DC')).toBe(200);
    expect(hz('TRN')).toBeCloseTo(800 / 3, 10);
    expect(hz('NP')).toBe(1200); // 3*C
  });

  it('toutes les définitions sont évaluables et finies', () => {
    for (const e of occidental.entries) {
      if (e.kind !== 'definition') continue;
      expect(e.value, `${e.name} (ligne ${e.line})`).toBeDefined();
      expect(Number.isFinite(e.value!), `${e.name} (ligne ${e.line})`).toBe(true);
    }
  });
});

describe('gamme orientale (LA = 441 dans la version embarquée)', () => {
  const hz = (sym: string) => evaluate(sym, chainResolvers(oriental.symbols));

  it('contient les intervalles microtonaux', () => {
    expect(oriental.symbols.size).toBeGreaterThan(200);
    expect(hz('LA')).toBe(441);
    // Quart de ton oriental : SOLGBQ1 = SOLG*15/14
    expect(hz('SOLGBQ1')).toBeCloseTo(220.5 * (8 / 9) * (15 / 14), 10);
  });

  it('toutes les définitions sont évaluables, sauf les 2 défauts connus du fichier legacy', () => {
    // Le fichier d'origine définit FAW = MID et FAHW = MIHD, mais MID et MIHD
    // n'existent nulle part : défaut présent dans le player legacy lui-même
    // (qui n'aurait signalé l'erreur que si une partition utilisait FAW/FAHW).
    const KNOWN_LEGACY_DEFECTS = new Set(['FAW', 'FAHW']);
    const broken: string[] = [];
    for (const e of oriental.entries) {
      if (e.kind !== 'definition') continue;
      if (e.value === undefined || !Number.isFinite(e.value)) broken.push(e.name.toUpperCase());
    }
    expect(new Set(broken)).toEqual(KNOWN_LEGACY_DEFECTS);
  });
});

describe('règle du doublon', () => {
  it('la première définition gagne (Dictionary.Add du legacy)', () => {
    const s = parseScale('A = 1\nA = 2\n');
    expect(s.symbols.get('A')).toBe('1');
  });
});
