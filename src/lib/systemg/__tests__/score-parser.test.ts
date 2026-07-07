import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parseScale } from '../scale-parser';
import { parseScore, formatDuration } from '../score-parser';
import { INSTRUMENT_IDS } from '../instruments';

const read = (p: string) => readFileSync(fileURLToPath(new URL(p, import.meta.url)), 'utf8');
const occidental = parseScale(read('../data/occidental_scale.txt'));

describe('parseScore — Lettre à Élise (fichier legacy réel)', () => {
  const text = read('../../../../public/player/scores/beeth-lettre-a-elise.txt');
  const score = parseScore(text, occidental.symbols, INSTRUMENT_IDS);

  it('se parse sans erreur', () => {
    expect(score.errors).toEqual([]);
  });

  it('lit l’en-tête, la redéfinition locale et l’instrument', () => {
    expect(score.scale).toBe('occidental');
    const defs = score.events.filter((e) => e.type === 'definition');
    expect(defs.some((d) => d.type === 'definition' && d.name === 'N' && d.expression === '950')).toBe(true);
    const instr = score.events.filter((e) => e.type === 'instrument');
    expect(instr[0]).toMatchObject({ type: 'instrument', name: 'piano_2' });
  });

  it('applique la redéfinition N=950 aux durées (dc = 237.5 ms)', () => {
    const first = score.events.find((e) => e.type === 'note');
    expect(first).toBeDefined();
    if (first?.type === 'note') {
      expect(first.noteExpr.toLowerCase()).toBe('mih');
      expect(first.freqHz).toBeCloseTo(661.5, 10); // LA*3/2, LA=441
      expect(first.durMs).toBe(237.5); // N/4 avec N=950
    }
  });

  it('calcule la position du Système G rehd3 = REH*189/176', () => {
    const rehd3 = score.events.find((e) => e.type === 'note' && e.noteExpr.toLowerCase() === 'rehd3');
    if (rehd3?.type === 'note') {
      expect(rehd3.freqHz).toBeCloseTo(441 * (4 / 3) * (189 / 176), 8); // ≈ 631.43 Hz
    } else {
      throw new Error('rehd3 absent');
    }
  });

  it('a une durée totale cohérente (somme des durées)', () => {
    const sum = score.events.reduce((a, e) => a + (e.type === 'note' ? e.durMs : 0), 0);
    expect(score.totalMs).toBeCloseTo(sum, 6);
    expect(score.noteCount).toBeGreaterThan(50);
  });
});

describe('parseScore — sémantique du legacy', () => {
  it('les définitions locales sont séquentielles', () => {
    const text = '@occidental\nla,N\nN = 400\nla,N\n';
    const s = parseScore(text, occidental.symbols, INSTRUMENT_IDS);
    const notes = s.events.filter((e) => e.type === 'note');
    expect(notes[0]).toMatchObject({ durMs: 800 }); // N de la gamme
    expect(notes[1]).toMatchObject({ durMs: 400 }); // N local
  });

  it('la dernière définition locale gagne (Remove+Add du legacy)', () => {
    const text = '@occidental\nN = 500\nN = 600\nla,N\n';
    const s = parseScore(text, occidental.symbols, INSTRUMENT_IDS);
    const note = s.events.find((e) => e.type === 'note');
    expect(note).toMatchObject({ durMs: 600 });
  });

  it('P produit une fréquence 0 (silence)', () => {
    const s = parseScore('@occidental\np,c\n', occidental.symbols, INSTRUMENT_IDS);
    expect(s.events.find((e) => e.type === 'note')).toMatchObject({ freqHz: 0, durMs: 400 });
  });

  it('@ accepté après des commentaires mais pas après du contenu', () => {
    const ok = parseScore('# titre\n@oriental\n', occidental.symbols, INSTRUMENT_IDS);
    expect(ok.scale).toBe('oriental');
    const late = parseScore('N = 500\n@oriental\n', occidental.symbols, INSTRUMENT_IDS);
    expect(late.scale).toBeNull();
    expect(late.errors.length).toBeGreaterThan(0);
  });

  it('signale les symboles inconnus avec le numéro de ligne', () => {
    const s = parseScore('@occidental\nfantome,c\n', occidental.symbols, INSTRUMENT_IDS);
    expect(s.errors).toEqual([{ line: 2, message: 'fantome is not defined' }]);
  });

  it('signale les valeurs hors bornes [0, 32767]', () => {
    const s = parseScore('@occidental\nla*1000,c\n', occidental.symbols, INSTRUMENT_IDS);
    expect(s.errors[0].message).toContain('has a wrong value');
  });

  it('signale les instruments inconnus (avertissement non bloquant)', () => {
    const s = parseScore('@occidental\n$ theremine\n', occidental.symbols, INSTRUMENT_IDS);
    expect(s.errors).toEqual([]);
    expect(s.warnings[0].message).toBe('theremine not found in the instrument list');
  });

  it('signale les lignes malformées', () => {
    const s = parseScore('@occidental\nla;c\n', occidental.symbols, INSTRUMENT_IDS);
    expect(s.errors[0].message).toContain('Error in');
  });

  it('accepte les expressions arithmétiques dans les notes (mihhh = mih*4)', () => {
    const text = '@occidental\nmihhh = mih*4\nmihhh,dc\nmih*2,dc\n';
    const s = parseScore(text, occidental.symbols, INSTRUMENT_IDS);
    expect(s.errors).toEqual([]);
    const notes = s.events.filter((e) => e.type === 'note');
    expect(notes[0]).toMatchObject({ freqHz: 661.5 * 4 });
    expect(notes[1]).toMatchObject({ freqHz: 661.5 * 2 });
  });
});

describe('toutes les partitions embarquées', () => {
  const files = [
    '4-gammes-mineures.txt',
    'ave-maria-caccini.txt',
    'ave-maria-gounod.txt',
    'beeth-7e-symphonie-allegretto-1.txt',
    'beeth-lettre-a-elise.txt',
    'bellini-la-norma-casta-diva.txt',
    'bizet-carmen-habanera.txt',
    'faure-apres-un-reve.txt',
    'gedeon-noel-noel.txt',
    'hahn-a-chloris.txt',
    'mozart-alleluia.txt',
    'mozart-reine-de-la-nuit.txt',
  ];
  for (const f of files) {
    it(`${f} se parse sans erreur`, () => {
      const text = read(`../../../../public/player/scores/${f}`);
      const s = parseScore(text, occidental.symbols, INSTRUMENT_IDS);
      expect(s.errors, JSON.stringify(s.errors)).toEqual([]);
      expect(s.noteCount).toBeGreaterThan(0);
    });
  }
});

describe('formatDuration', () => {
  it('formate comme le legacy (HH:MM:SS.mmm)', () => {
    expect(formatDuration(0)).toBe('00:00:00.000');
    expect(formatDuration(61_234)).toBe('00:01:01.234');
    expect(formatDuration(3_600_000 + 1500)).toBe('01:00:01.500');
  });
});
