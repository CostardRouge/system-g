/**
 * Table des instruments du Système G.
 *
 * Chaque instrument est un échantillon WAV joué en le rééchantillonnant :
 * le legacy réglait `DirectSound.Frequency = Hz × coefficient` (fréquence
 * d'échantillonnage de lecture). L'équivalent Web Audio est :
 *
 *     playbackRate = (Hz × coefficient) / sampleRate_du_WAV
 *
 * Les coefficients proviennent du code source legacy (FormG.cs) ; les
 * fréquences d'échantillonnage ont été mesurées sur les WAV d'origine.
 * (decodeAudioData rééchantillonne au taux de l'AudioContext en préservant
 * la hauteur : il faut donc conserver ici le taux D'ORIGINE du fichier.)
 *
 * NOTE : le legacy ne boucle PAS l'échantillon (PlayFlags = 0). Chaque note
 * relance le sample depuis le début ; s'il est plus court que la note, le
 * son s'éteint naturellement. Ce comportement est reproduit tel quel.
 */

export interface Instrument {
  /** Identifiant (minuscules) — nom de fichier et nom utilisé après `$`. */
  id: string;
  /** Nom d'affichage (celui du legacy). */
  label: string;
  /** Coefficient de calibration du legacy. */
  coefficient: number;
  /** Fréquence d'échantillonnage d'origine du WAV (Hz). */
  wavSampleRate: number;
}

export const INSTRUMENTS: readonly Instrument[] = [
  { id: 'brass_1', label: 'Brass_1', coefficient: 17.5, wavSampleRate: 28000 },
  { id: 'brass_2', label: 'Brass_2', coefficient: 35.05, wavSampleRate: 28000 },
  { id: 'elixia_organ', label: 'Elixia_Organ', coefficient: 41.9, wavSampleRate: 44100 },
  { id: 'flute', label: 'Flute', coefficient: 72, wavSampleRate: 44053 },
  { id: 'flute_low', label: 'Flute_Low', coefficient: 35.4, wavSampleRate: 44053 },
  { id: 'guitar_1', label: 'Guitar_1', coefficient: 32, wavSampleRate: 28161 },
  { id: 'guitar_2', label: 'Guitar_2', coefficient: 47, wavSampleRate: 44100 },
  { id: 'harp', label: 'Harp', coefficient: 55.45, wavSampleRate: 44100 },
  { id: 'oboe', label: 'Oboe', coefficient: 75, wavSampleRate: 44053 },
  { id: 'organ', label: 'Organ', coefficient: 56.2, wavSampleRate: 44100 },
  { id: 'oud', label: 'Oud', coefficient: 66.65, wavSampleRate: 44053 },
  { id: 'oud_tremolo', label: 'Oud_Tremolo', coefficient: 56, wavSampleRate: 44053 },
  { id: 'piano_2', label: 'Piano_2', coefficient: 41.695, wavSampleRate: 21978 },
  { id: 'piano_3', label: 'Piano_3', coefficient: 41.7, wavSampleRate: 22000 },
  { id: 'string_0', label: 'String_0', coefficient: 25.255, wavSampleRate: 33333 },
  { id: 'string_1', label: 'String_1', coefficient: 25.27, wavSampleRate: 33333 },
  { id: 'string_2', label: 'String_2', coefficient: 32, wavSampleRate: 33333 },
  { id: 'violin', label: 'Violin', coefficient: 40, wavSampleRate: 27778 },
] as const;

export const INSTRUMENT_IDS: readonly string[] = INSTRUMENTS.map((i) => i.id);

export function getInstrument(id: string): Instrument | undefined {
  return INSTRUMENTS.find((i) => i.id === id.toLowerCase());
}

/**
 * Taux de lecture Web Audio pour produire `freqHz` avec cet instrument.
 * `pitchOffset` reproduit la transposition du legacy : un décalage ADDITIF
 * sur le coefficient (numericUpDown de l'UI d'origine).
 */
export function playbackRateFor(instr: Instrument, freqHz: number, pitchOffset = 0): number {
  return (freqHz * (instr.coefficient + pitchOffset)) / instr.wavSampleRate;
}
