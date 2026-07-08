/**
 * Moteur audio du Système G — séquenceur Web Audio.
 *
 * Améliorations par rapport au legacy (qui utilisait Thread.Sleep) :
 *   - ordonnancement sur l'horloge de l'AudioContext (précision à
 *     l'échantillon près), avec fenêtre de lookahead ;
 *   - courtes enveloppes de gain pour éviter les clics aux transitions ;
 *   - pause/reprise exactes via suspend()/resume() ;
 *   - comparateur A/B : lecture en intonation juste (Système G) ou
 *     « aplatie » au tempérament égal (12-TET) sur le même diapason ;
 *   - export WAV hors ligne (OfflineAudioContext).
 *
 * Sémantique legacy conservée :
 *   - monophonique : une note à la fois, chaque note relance l'échantillon
 *     depuis le début (pas de boucle) ;
 *   - fréquence 0 (symbole P) = silence ;
 *   - les lignes `$ instrument` changent l'instrument pour la suite, sauf si
 *     l'option « forcer l'instrument » est active (checkBoxInstr du legacy) ;
 *   - transposition = décalage additif sur le coefficient de l'instrument.
 */
import type { ScoreEvent } from './score-parser';
import { getInstrument, playbackRateFor } from './instruments';
import { snapToEqual } from './temperament';
import { encodeWav } from './wav-export';

export type OscWave = 'sine' | 'square';

export interface PlayOptions {
  /** 'instrument' = échantillons WAV ; 'oscillator' = onde générée. */
  mode: 'instrument' | 'oscillator';
  /** Instrument de départ (mode instrument). */
  instrumentId?: string;
  /** Si vrai, ignore les changements `$` de la partition (checkBoxInstr legacy). */
  forceInstrument?: boolean;
  /** Transposition : décalage additif sur le coefficient (legacy numericUpDown). */
  pitchOffset?: number;
  /** Forme d'onde (mode oscillateur). */
  wave?: OscWave;
  /**
   * Intonation : 'just' = fréquences exactes du Système G (défaut) ;
   * 'equal' = chaque note est ramenée au 12-TET le plus proche (comparateur).
   */
  tuning?: 'just' | 'equal';
  /** Diapason du 12-TET (fréquence du LA de la gamme chargée). */
  tetRefHz?: number;
  /**
   * Multiplicateur de tempo (1 = tempo écrit ; 2 = deux fois plus vite).
   * Les hauteurs ne changent pas, seules les durées sont divisées.
   */
  tempoScale?: number;
  /** Index (dans events) à partir duquel commencer. */
  startIndex?: number;
  /** Si fourni, ne joue que ces index d'événements (lecture de sélection). */
  onlyIndices?: number[];
  /** Appelé quand une note commence (index dans events). */
  onNote?: (eventIndex: number, freqHz: number, durMs: number) => void;
  /** Appelé quand l'instrument courant change (suivi des `$`). */
  onInstrument?: (instrumentId: string) => void;
  /** Appelé à la fin naturelle ou après stop(). */
  onEnd?: (stopped: boolean) => void;
}

export interface ScheduleItem {
  eventIndex: number;
  /** Décalage de début en secondes depuis le début de la lecture. */
  start: number;
  /** Durée en secondes. */
  duration: number;
  /** Fréquence effectivement jouée (après tempérament éventuel), en Hz. */
  freqHz: number;
  instrumentId: string;
}

const LOOKAHEAD_S = 0.4; // fenêtre d'ordonnancement
const TICK_MS = 80; // période du timer d'ordonnancement
const FADE_S = 0.006; // enveloppe anti-clic (6 ms)

/**
 * Construit le plan de lecture : positions temporelles absolues de chaque
 * note, avec l'instrument actif à cet endroit de la partition et la
 * fréquence effective (juste, ou ramenée au tempérament égal).
 * Fonction pure — partagée par la lecture live et l'export WAV.
 */
export function buildScheduleItems(
  events: readonly ScoreEvent[],
  opts: PlayOptions,
): ScheduleItem[] {
  const items: ScheduleItem[] = [];
  let t = 0;
  let instrument = opts.instrumentId ?? '';
  const startIndex = opts.startIndex ?? 0;
  const only = opts.onlyIndices ? new Set(opts.onlyIndices) : null;
  const equal = opts.tuning === 'equal' && (opts.tetRefHz ?? 0) > 0;
  const tempo = opts.tempoScale && opts.tempoScale > 0 ? opts.tempoScale : 1;

  for (let i = 0; i < events.length; i++) {
    const e = events[i];
    if (e.type === 'instrument' && !opts.forceInstrument) {
      // Instrument inconnu (échantillon perdu) : on conserve le courant.
      if (getInstrument(e.name)) instrument = e.name;
      continue;
    }
    if (e.type !== 'note') continue;
    if (i < startIndex) continue;
    if (only && !only.has(i)) continue;
    const duration = e.durMs / 1000 / tempo;
    items.push({
      eventIndex: i,
      start: t,
      duration,
      freqHz: equal ? snapToEqual(e.freqHz, opts.tetRefHz!) : e.freqHz,
      instrumentId: instrument,
    });
    t += duration;
  }
  return items;
}

/** L'instrument actif juste avant `startIndex` (pour reprendre au milieu). */
export function instrumentAt(
  events: readonly ScoreEvent[],
  startIndex: number,
  fallback: string,
): string {
  let instrument = fallback;
  for (let i = 0; i < startIndex && i < events.length; i++) {
    const e = events[i];
    if (e.type === 'instrument' && getInstrument(e.name)) instrument = e.name;
  }
  return instrument;
}

/**
 * Ordonnance une note dans un contexte audio (live ou hors ligne).
 * Retourne le nœud source, ou null pour un silence / instrument non chargé.
 */
function scheduleNote(
  ctx: BaseAudioContext,
  destination: AudioNode,
  buffers: ReadonlyMap<string, AudioBuffer>,
  item: ScheduleItem,
  at: number,
  opts: PlayOptions,
): AudioScheduledSourceNode | null {
  if (item.freqHz <= 0 || item.duration <= 0) return null; // silence (P)

  const gain = ctx.createGain();
  gain.connect(destination);
  const end = at + item.duration;
  const fade = Math.min(FADE_S, item.duration / 4);
  gain.gain.setValueAtTime(0, at);
  gain.gain.linearRampToValueAtTime(1, at + fade);
  gain.gain.setValueAtTime(1, end - fade);
  gain.gain.linearRampToValueAtTime(0, end);

  let node: AudioScheduledSourceNode;
  if (opts.mode === 'oscillator') {
    const osc = ctx.createOscillator();
    osc.type = opts.wave ?? 'sine';
    osc.frequency.value = item.freqHz;
    node = osc;
  } else {
    const instr = getInstrument(item.instrumentId);
    const buffer = instr && buffers.get(instr.id);
    if (!instr || !buffer) return null; // instrument non chargé : silence
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.playbackRate.value = playbackRateFor(instr, item.freqHz, opts.pitchOffset ?? 0);
    node = src;
  }
  node.connect(gain);
  node.start(at);
  node.stop(end + 0.01);
  node.addEventListener('ended', () => gain.disconnect());
  return node;
}

export type EngineState = 'idle' | 'playing' | 'paused';

export class SystemGEngine {
  private ctx: AudioContext | null = null;
  private buffers = new Map<string, AudioBuffer>();
  private master: GainNode | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private raf = 0;
  private liveNodes = new Set<AudioScheduledSourceNode>();
  private schedule: ScheduleItem[] = [];
  private nextToSchedule = 0;
  private highlightCursor = 0;
  private startTime = 0; // ctx.currentTime au début de la lecture
  private opts: PlayOptions | null = null;
  private lastInstrument = '';

  state: EngineState = 'idle';

  /** L'index (dans events) de la note en cours, pour reprendre après pause. */
  currentEventIndex = -1;

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  /** Charge (et met en cache) l'échantillon d'un instrument. */
  async loadInstrument(id: string, baseUrl: string): Promise<void> {
    if (this.buffers.has(id)) return;
    const ctx = this.ensureContext();
    const res = await fetch(`${baseUrl}${id}.wav`);
    if (!res.ok) throw new Error(`Cannot load instrument "${id}" (${res.status})`);
    const buf = await ctx.decodeAudioData(await res.arrayBuffer());
    this.buffers.set(id, buf);
  }

  /** Instruments requis pour jouer `events` avec ces options. */
  static requiredInstruments(events: readonly ScoreEvent[], opts: PlayOptions): string[] {
    if (opts.mode !== 'instrument') return [];
    const ids = new Set<string>();
    if (opts.instrumentId) ids.add(opts.instrumentId);
    if (!opts.forceInstrument) {
      for (const e of events) {
        if (e.type === 'instrument' && getInstrument(e.name)) ids.add(e.name);
      }
    }
    return [...ids];
  }

  async play(events: readonly ScoreEvent[], opts: PlayOptions): Promise<void> {
    this.stop(true);
    const ctx = this.ensureContext();
    if (ctx.state === 'suspended') await ctx.resume();

    // En reprise au milieu du morceau, repartir avec l'instrument actif là-bas.
    if (opts.mode === 'instrument' && !opts.forceInstrument && (opts.startIndex ?? 0) > 0) {
      opts = {
        ...opts,
        instrumentId: instrumentAt(events, opts.startIndex!, opts.instrumentId ?? ''),
      };
    }
    this.opts = opts;
    this.schedule = buildScheduleItems(events, opts);
    if (this.schedule.length === 0) {
      opts.onEnd?.(false);
      return;
    }
    this.nextToSchedule = 0;
    this.highlightCursor = 0;
    this.lastInstrument = '';
    this.startTime = ctx.currentTime + 0.08;
    this.state = 'playing';

    this.tick(); // ordonnance immédiatement la première fenêtre
    this.timer = setInterval(() => this.tick(), TICK_MS);
    const loop = () => {
      this.updateHighlight();
      if (this.state !== 'idle') this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  private tick(): void {
    if (!this.ctx || this.state !== 'playing' || !this.opts) return;
    const horizon = this.ctx.currentTime + LOOKAHEAD_S;

    while (this.nextToSchedule < this.schedule.length) {
      const item = this.schedule[this.nextToSchedule];
      const at = this.startTime + item.start;
      if (at > horizon) break;
      const node = scheduleNote(this.ctx, this.master!, this.buffers, item, at, this.opts);
      if (node) {
        this.liveNodes.add(node);
        node.addEventListener('ended', () => this.liveNodes.delete(node));
      }
      this.nextToSchedule++;
    }
  }

  /** Met à jour la note « en cours » pour l'UI, sur l'horloge audio. */
  private updateHighlight(): void {
    if (!this.ctx || this.state !== 'playing' || !this.opts) return;
    const elapsed = this.ctx.currentTime - this.startTime;

    while (this.highlightCursor < this.schedule.length) {
      const item = this.schedule[this.highlightCursor];
      if (elapsed < item.start) break;
      this.currentEventIndex = item.eventIndex;
      this.opts.onNote?.(item.eventIndex, item.freqHz, item.duration * 1000);
      if (
        this.opts.mode === 'instrument' &&
        item.instrumentId &&
        item.instrumentId !== this.lastInstrument
      ) {
        this.lastInstrument = item.instrumentId;
        this.opts.onInstrument?.(item.instrumentId);
      }
      this.highlightCursor++;
    }

    const last = this.schedule[this.schedule.length - 1];
    if (elapsed >= last.start + last.duration) {
      const cb = this.opts.onEnd;
      this.stop(true);
      cb?.(false);
    }
  }

  async pause(): Promise<void> {
    if (this.state !== 'playing' || !this.ctx) return;
    this.state = 'paused';
    await this.ctx.suspend();
  }

  async resume(): Promise<void> {
    if (this.state !== 'paused' || !this.ctx) return;
    this.state = 'playing';
    await this.ctx.resume();
  }

  /** Arrête la lecture. `silent` supprime le callback onEnd. */
  stop(silent = false): void {
    const wasActive = this.state !== 'idle';
    const cb = this.opts?.onEnd;
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    cancelAnimationFrame(this.raf);
    for (const node of this.liveNodes) {
      try {
        node.stop();
        node.disconnect();
      } catch {
        /* déjà arrêté */
      }
    }
    this.liveNodes.clear();
    this.schedule = [];
    this.state = 'idle';
    this.currentEventIndex = -1;
    if (this.ctx?.state === 'suspended') void this.ctx.resume();
    if (wasActive && !silent) cb?.(true);
    this.opts = null;
  }

  /**
   * Joue une note isolée (aperçu — clic sur la gamme ou sur le clavier des
   * positions). Sans effet si une lecture est en cours.
   */
  previewNote(
    freqHz: number,
    durMs: number,
    opts: Pick<PlayOptions, 'mode' | 'instrumentId' | 'wave' | 'pitchOffset'>,
  ): void {
    if (this.state !== 'idle' || freqHz <= 0 || durMs <= 0) return;
    const ctx = this.ensureContext();
    if (ctx.state === 'suspended') void ctx.resume();
    scheduleNote(
      ctx,
      this.master!,
      this.buffers,
      {
        eventIndex: -1,
        start: 0,
        duration: durMs / 1000,
        freqHz,
        instrumentId: opts.instrumentId ?? '',
      },
      ctx.currentTime + 0.02,
      { mode: opts.mode, wave: opts.wave, pitchOffset: opts.pitchOffset },
    );
  }

  /** Vrai si l'échantillon d'un instrument est déjà en cache. */
  hasInstrument(id: string): boolean {
    return this.buffers.has(id);
  }

  /**
   * Rendu hors ligne du morceau complet → Blob WAV 16 bits.
   * Les instruments nécessaires doivent avoir été chargés au préalable
   * (mêmes buffers que la lecture live).
   */
  async renderWav(events: readonly ScoreEvent[], opts: PlayOptions): Promise<Blob> {
    const items = buildScheduleItems(events, opts);
    const totalS = items.length
      ? items[items.length - 1].start + items[items.length - 1].duration
      : 0;
    if (totalS <= 0) throw new Error('Nothing to render');

    const sampleRate = 44100;
    const lead = 0.05;
    const offline = new OfflineAudioContext(
      1,
      Math.ceil((totalS + lead + 0.2) * sampleRate),
      sampleRate,
    );
    for (const item of items) {
      scheduleNote(offline, offline.destination, this.buffers, item, lead + item.start, opts);
    }
    const rendered = await offline.startRendering();
    return encodeWav(rendered);
  }
}
