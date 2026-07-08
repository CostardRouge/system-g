import { describe, it, expect } from 'vitest';
import { snapToEqual, centsFromEqual, centsBetween, nearestSemitones } from '../temperament';
import { encodeWav, type PcmSource } from '../wav-export';
import { buildScheduleItems, instrumentAt } from '../engine';
import type { ScoreEvent } from '../score-parser';

describe('temperament (comparateur 12-TET)', () => {
  it('le diapason lui-même est déjà tempéré', () => {
    expect(snapToEqual(441, 441)).toBeCloseTo(441, 10);
    expect(centsFromEqual(441, 441)).toBeCloseTo(0, 10);
  });

  it('la quinte juste (3/2) dévie de +1,955 cents du 12-TET', () => {
    const just = 441 * 1.5; // MIH
    expect(nearestSemitones(just, 441)).toBe(7);
    expect(centsFromEqual(just, 441)).toBeCloseTo(1.955, 3);
  });

  it('la tierce majeure pythagoricienne (81/64) dévie de +7,82 cents', () => {
    const pyth = 441 * (81 / 64);
    expect(centsFromEqual(pyth, 441)).toBeCloseTo(7.82, 2);
  });

  it('une « position » du Système G : 896/891 ≈ +9,69 cents', () => {
    expect(centsBetween(441 * (896 / 891), 441)).toBeCloseTo(9.688, 3);
  });

  it('l’aplatissement 12-TET préserve l’octave', () => {
    expect(snapToEqual(882, 441)).toBeCloseTo(882, 10);
    expect(snapToEqual(220.5, 441)).toBeCloseTo(220.5, 10);
  });

  it('gère le silence (0 Hz)', () => {
    expect(snapToEqual(0, 441)).toBe(0);
    expect(centsFromEqual(0, 441)).toBe(0);
  });
});

describe('encodeWav', () => {
  const mono: PcmSource = {
    numberOfChannels: 1,
    length: 4,
    sampleRate: 44100,
    getChannelData: () => new Float32Array([0, 0.5, -0.5, 1]),
  };

  it('produit un en-tête RIFF/WAVE correct', async () => {
    const blob = encodeWav(mono);
    expect(blob.type).toBe('audio/wav');
    const bytes = new Uint8Array(await blob.arrayBuffer());
    const str = (o: number, n: number) => String.fromCharCode(...bytes.slice(o, o + n));
    expect(str(0, 4)).toBe('RIFF');
    expect(str(8, 4)).toBe('WAVE');
    expect(str(36, 4)).toBe('data');
    const view = new DataView(bytes.buffer);
    expect(view.getUint16(22, true)).toBe(1); // mono
    expect(view.getUint32(24, true)).toBe(44100);
    expect(view.getUint32(40, true)).toBe(8); // 4 frames × 2 octets
    expect(bytes.length).toBe(44 + 8);
    // Échantillons : 0, 0.5→16383, -0.5→-16384, 1→32767
    expect(view.getInt16(44, true)).toBe(0);
    expect(view.getInt16(46, true)).toBe(Math.trunc(0.5 * 0x7fff)); // setInt16 tronque
    expect(view.getInt16(50, true)).toBe(0x7fff);
  });
});

describe('buildScheduleItems (plan de lecture pur)', () => {
  const events: ScoreEvent[] = [
    { line: 1, type: 'instrument', name: 'flute' },
    { line: 2, type: 'note', noteExpr: 'la', durExpr: 'c', freqHz: 441, durMs: 400 },
    { line: 3, type: 'instrument', name: 'cello' }, // inconnu → ignoré
    { line: 4, type: 'note', noteExpr: 'mih', durExpr: 'c', freqHz: 661.5, durMs: 400 },
    { line: 5, type: 'instrument', name: 'oud' },
    { line: 6, type: 'note', noteExpr: 'p', durExpr: 'c', freqHz: 0, durMs: 400 },
  ];

  it('suit les changements $ et ignore les instruments inconnus', () => {
    const items = buildScheduleItems(events, { mode: 'instrument', instrumentId: 'piano_2' });
    expect(items.map((i) => i.instrumentId)).toEqual(['flute', 'flute', 'oud']);
    expect(items.map((i) => i.start)).toEqual([0, 0.4, 0.8]);
  });

  it('forceInstrument ignore les $', () => {
    const items = buildScheduleItems(events, {
      mode: 'instrument',
      instrumentId: 'piano_2',
      forceInstrument: true,
    });
    expect(items.every((i) => i.instrumentId === 'piano_2')).toBe(true);
  });

  it('startIndex et onlyIndices restreignent la lecture', () => {
    const from = buildScheduleItems(events, { mode: 'oscillator', startIndex: 3 });
    expect(from.map((i) => i.eventIndex)).toEqual([3, 5]);
    const only = buildScheduleItems(events, { mode: 'oscillator', onlyIndices: [1] });
    expect(only.map((i) => i.eventIndex)).toEqual([1]);
  });

  it('tuning equal aplatit les fréquences au 12-TET (quinte 661,5 → ~659,56)', () => {
    const items = buildScheduleItems(events, {
      mode: 'oscillator',
      tuning: 'equal',
      tetRefHz: 441,
    });
    expect(items[0].freqHz).toBeCloseTo(441, 10);
    expect(items[1].freqHz).toBeCloseTo(441 * Math.pow(2, 7 / 12), 6); // ≈ 660.75... calculé
    expect(items[1].freqHz).not.toBeCloseTo(661.5, 1);
    expect(items[2].freqHz).toBe(0); // le silence reste un silence
  });

  it('tempoScale divise les durées sans toucher aux hauteurs', () => {
    const items = buildScheduleItems(events, { mode: 'oscillator', tempoScale: 2 });
    expect(items.map((i) => i.start)).toEqual([0, 0.2, 0.4]);
    expect(items[0].duration).toBeCloseTo(0.2, 10);
    expect(items[0].freqHz).toBe(441);
    // Valeur invalide → tempo neutre.
    const bad = buildScheduleItems(events, { mode: 'oscillator', tempoScale: 0 });
    expect(bad[0].duration).toBeCloseTo(0.4, 10);
  });

  it('instrumentAt retrouve l’instrument actif à un index donné', () => {
    expect(instrumentAt(events, 4, 'piano_2')).toBe('flute');
    expect(instrumentAt(events, 6, 'piano_2')).toBe('oud');
    expect(instrumentAt(events, 0, 'piano_2')).toBe('piano_2');
  });
});
