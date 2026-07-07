/**
 * Moteur audio du Système G — séquenceur Web Audio.
 *
 * Améliorations par rapport au legacy (qui utilisait Thread.Sleep) :
 *   - ordonnancement sur l'horloge de l'AudioContext (précision à
 *     l'échantillon près), avec fenêtre de lookahead ;
 *   - courtes enveloppes de gain pour éviter les clics aux transitions ;
 *   - pause/reprise exactes via suspend()/resume().
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

interface ScheduleItem {
  eventIndex: number;
  /** Décalage de début en secondes depuis le début de la lecture. */
  start: s;
  duration: s;
  freqHz: number;
  instrumentId: string;
}
type s = number;

const LOOKAHEAD_S = 0.4; // fenêtre d'ordonnancement
const TICK_MS = 80; // période du timer d'ordonnancement
const FADE_S = 0.006; // enveloppe anti-clic (6 ms)

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

  /**
   * Construit le plan de lecture : positions temporelles absolues de chaque
   * note, avec l'instrument actif à cet endroit de la partition.
   */
  private buildSchedule(events: readonly ScoreEvent[], opts: PlayOptions): ScheduleItem[] {
    const items: ScheduleItem[] = [];
    let t = 0;
    let instrument = opts.instrumentId ?? '';
    const startIndex = opts.startIndex ?? 0;
    const only = opts.onlyIndices ? new Set(opts.onlyIndices) : null;

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
      items.push({
        eventIndex: i,
        start: t,
        duration: e.durMs / 1000,
        freqHz: e.freqHz,
        instrumentId: instrument,
      });
      t += e.durMs / 1000;
    }
    return items;
  }

  /**
   * L'instrument actif juste avant `startIndex` (pour reprendre au milieu
   * d'une partition qui contient des `$`).
   */
  static instrumentAt(events: readonly ScoreEvent[], startIndex: number, fallback: string): string {
    let instrument = fallback;
    for (let i = 0; i < startIndex && i < events.length; i++) {
      const e = events[i];
      if (e.type === 'instrument') instrument = e.name;
    }
    return instrument;
  }

  async play(events: readonly ScoreEvent[], opts: PlayOptions): Promise<void> {
    this.stop(true);
    const ctx = this.ensureContext();
    if (ctx.state === 'suspended') await ctx.resume();

    this.opts = opts;
    // En reprise au milieu du morceau, repartir avec l'instrument actif là-bas.
    if (opts.mode === 'instrument' && !opts.forceInstrument && (opts.startIndex ?? 0) > 0) {
      opts = {
        ...opts,
        instrumentId: SystemGEngine.instrumentAt(events, opts.startIndex!, opts.instrumentId ?? ''),
      };
      this.opts = opts;
    }
    this.schedule = this.buildSchedule(events, opts);
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
      this.scheduleItem(item, at);
      this.nextToSchedule++;
    }
  }

  private scheduleItem(item: ScheduleItem, at: number): void {
    const ctx = this.ctx!;
    const opts = this.opts!;
    if (item.freqHz <= 0 || item.duration <= 0) return; // silence (P)

    const gain = ctx.createGain();
    gain.connect(this.master!);
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
      const buffer = instr && this.buffers.get(instr.id);
      if (!instr || !buffer) return; // instrument non chargé : silence
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.playbackRate.value = playbackRateFor(instr, item.freqHz, opts.pitchOffset ?? 0);
      node = src;
    }
    node.connect(gain);
    node.start(at);
    node.stop(end + 0.01);
    this.liveNodes.add(node);
    node.onended = () => {
      this.liveNodes.delete(node);
      gain.disconnect();
    };
  }

  /** Met à jour la note « en cours » pour l'UI, sur l'horloge audio. */
  private updateHighlight(): void {
    if (!this.ctx || this.state !== 'playing' || !this.opts) return;
    const elapsed = this.ctx.currentTime - this.startTime;

    while (this.highlightCursor < this.schedule.length) {
      const item = this.schedule[this.highlightCursor];
      if (elapsed < item.start) break;
      this.currentEventIndex = item.eventIndex;
      const e = item;
      this.opts.onNote?.(e.eventIndex, e.freqHz, e.duration * 1000);
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
        node.onended = null;
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
}
