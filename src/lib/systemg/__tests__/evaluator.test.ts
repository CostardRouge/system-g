import { describe, it, expect } from 'vitest';
import { evaluate, chainResolvers, UndefinedSymbolError, ExpressionError } from '../evaluator';

const table = (obj: Record<string, string>) =>
  new Map(Object.entries(obj).map(([k, v]) => [k.toUpperCase(), v]));

describe('evaluate', () => {
  it('évalue les expressions arithmétiques de base', () => {
    const r = chainResolvers(new Map());
    expect(evaluate('441', r)).toBe(441);
    expect(evaluate('2*3+4', r)).toBe(10);
    expect(evaluate('2*(3+4)', r)).toBe(14);
    expect(evaluate('7/2', r)).toBe(3.5);
    expect(evaluate('-5+8', r)).toBe(3);
  });

  it('résout les symboles récursivement (sémantique legacy)', () => {
    const r = chainResolvers(
      table({ LA: '441', LAG: 'LA/2', SOLG: 'LAG*8/9', SOLG3: 'SOLG*896/891' }),
    );
    expect(evaluate('LA', r)).toBe(441);
    expect(evaluate('LAG', r)).toBe(220.5);
    expect(evaluate('SOLG', r)).toBeCloseTo((220.5 * 8) / 9, 10);
    expect(evaluate('SOLG3', r)).toBeCloseTo((((220.5 * 8) / 9) * 896) / 891, 10);
  });

  it('est insensible à la casse comme le legacy', () => {
    const r = chainResolvers(table({ MIH: 'LA*3/2', LA: '441' }));
    expect(evaluate('mih', r)).toBeCloseTo(661.5, 10);
    expect(evaluate('MiH', r)).toBeCloseTo(661.5, 10);
  });

  it('donne la priorité au premier dictionnaire (dictRun avant dictNote)', () => {
    const scale = table({ N: '800' });
    const local = table({ N: '950' });
    const r = chainResolvers(local, scale);
    expect(evaluate('N/4', r)).toBe(237.5);
  });

  it('gère les expressions composées de symboles et de nombres', () => {
    const r = chainResolvers(table({ MI: '330.75', MIH: 'MI*2' }));
    expect(evaluate('mihhh', chainResolvers(table({ MIHHH: 'MIH*4', MIH: 'MI*2', MI: '330.75' })))).toBeCloseTo(
      330.75 * 8,
      10,
    );
    expect(evaluate('MIH*4', r)).toBeCloseTo(330.75 * 8, 10);
  });

  it('signale les symboles non définis avec le message du legacy', () => {
    const r = chainResolvers(new Map());
    expect(() => evaluate('INCONNU', r)).toThrowError(UndefinedSymbolError);
    expect(() => evaluate('INCONNU', r)).toThrowError('INCONNU is not defined');
  });

  it('détecte les définitions circulaires', () => {
    const r = chainResolvers(table({ A: 'B', B: 'A' }));
    expect(() => evaluate('A', r)).toThrowError(ExpressionError);
  });

  it('rejette les expressions mal formées', () => {
    const r = chainResolvers(new Map());
    expect(() => evaluate('2*(3+4', r)).toThrowError(ExpressionError);
    expect(() => evaluate('2 3', r)).toThrowError(ExpressionError);
  });
});
