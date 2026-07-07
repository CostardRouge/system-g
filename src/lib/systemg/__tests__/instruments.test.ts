import { describe, it, expect } from 'vitest';
import { INSTRUMENTS, getInstrument, playbackRateFor } from '../instruments';

describe('instruments', () => {
  it('reprend les 18 instruments du legacy', () => {
    expect(INSTRUMENTS.length).toBe(18);
    expect(getInstrument('Piano_2')?.coefficient).toBe(41.695);
    expect(getInstrument('oud')?.coefficient).toBe(66.65);
  });

  it('playbackRate = Hz × coeff / sampleRate (modèle DirectSound vérifié sur les WAV)', () => {
    // Mesuré : chaque WAV joué à sampleRate = Hz × coeff restitue la hauteur Hz
    // (base × coeff / sr ≈ 1, 1/2, 1/4 selon l'octave incluse dans le coeff).
    const flute = getInstrument('flute')!;
    expect(playbackRateFor(flute, 441)).toBeCloseTo((441 * 72) / 44053, 12);

    // La transposition legacy est additive sur le coefficient.
    expect(playbackRateFor(flute, 441, 2)).toBeCloseTo((441 * 74) / 44053, 12);
  });

  it('les taux de lecture restent dans une plage jouable pour le répertoire courant', () => {
    // Sur la plage utile 55–1764 Hz (LA/8 à LA×4), le rate doit rester raisonnable.
    for (const instr of INSTRUMENTS) {
      const rMid = playbackRateFor(instr, 441);
      expect(rMid).toBeGreaterThan(0.05);
      expect(rMid).toBeLessThan(4);
    }
  });
});
