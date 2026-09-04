/**
 * Web Audio API synthesizer for playful, kid-friendly sound effects
 * and cute cheerful background music loop.
 * 100% self-contained, zero external assets, immediate browser execution.
 */

let audioCtx: AudioContext | null = null;
let soundEffectsEnabled = true;
let bgmEnabled = false;
let bgmIntervalId: ReturnType<typeof setInterval> | null = null;
let bgmStep = 0;
const bgmListeners: Set<(playing: boolean) => void> = new Set();

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// ----------------------------------------------------
// Sound Effects Controls
// ----------------------------------------------------

export function isSoundEnabled(): boolean {
  return soundEffectsEnabled;
}

export function setSoundEnabled(enabled: boolean): void {
  soundEffectsEnabled = enabled;
}

export function toggleSound(): boolean {
  soundEffectsEnabled = !soundEffectsEnabled;
  if (soundEffectsEnabled) {
    playPop();
  }
  return soundEffectsEnabled;
}

/**
 * Play a short bouncy bubble pop
 */
export function playPop(frequency = 420): void {
  if (!soundEffectsEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 1.8, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  } catch {
    // Autoplay restrictions
  }
}

/**
 * Play a cheerful star sparkle / success chime
 */
export function playChime(): void {
  if (!soundEffectsEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.06);

      gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.06);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + index * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.06 + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + index * 0.06);
      osc.stop(ctx.currentTime + index * 0.06 + 0.23);
    });
  } catch {
    // Ignore
  }
}

/**
 * Play victory fanfare
 */
export function playFanfare(): void {
  if (!soundEffectsEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const chord = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    chord.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);

      gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.45);
    });
  } catch {
    // Ignore
  }
}

/**
 * Play gentle boing / jump
 */
export function playJump(): void {
  if (!soundEffectsEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(250, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  } catch {
    // Ignore
  }
}

// ----------------------------------------------------
// Cute Background Music Synthesizer (BGM)
// ----------------------------------------------------

// Kid-friendly playful frequencies
const C4 = 261.63;
const D4 = 293.66;
const E4 = 329.63;
const F4 = 349.23;
const G4 = 392.00;
const A4 = 440.00;
const B4 = 493.88;
const C5 = 523.25;
const D5 = 587.33;
const E5 = 659.25;
const F5 = 698.46;
const G5 = 783.99;
const A5 = 880.00;
const C6 = 1046.50;
const D6 = 1174.66;

// Bass roots
const C3 = 130.81;
const F3 = 174.61;
const G3 = 196.00;
const A3 = 220.00;

// 32-step cheerful kid melody (cute marimba & music box feel)
const BGM_MELODY: (number | null)[] = [
  // Bar 1 - C major (Happy greeting)
  C5, null, E5, null, G5, null, C6, null,
  // Bar 2 - A minor (Gentle bounce)
  A5, null, G5, null, E5, null, C5, null,
  // Bar 3 - F major (Playful skip)
  D5, null, E5, null, F5, G5, A5, null,
  // Bar 4 - G major (Resolution chime)
  G5, null, E5, null, D5, null, C5, null,
  // Bar 5 - Variation high
  E5, null, G5, null, C6, null, D6, null,
  // Bar 6 - Cascade
  C6, null, A5, null, G5, null, E5, null,
  // Bar 7 - Light dance
  F5, null, A5, null, G5, null, E5, null,
  // Bar 8 - Sweet finish
  D5, null, E5, null, C5, null, null, null,
];

// Soft bass roots every 8 steps
const BGM_BASS: (number | null)[] = [
  C3, null, null, null, G3, null, null, null,
  A3, null, null, null, E4, null, null, null,
  F3, null, null, null, C4, null, null, null,
  G3, null, null, null, D4, null, null, null,
  C3, null, null, null, G3, null, null, null,
  A3, null, null, null, E4, null, null, null,
  F3, null, null, null, G3, null, null, null,
  C3, null, null, null, C4, null, null, null,
];

function playBgmNote(freq: number, isBass = false): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (isBass) {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.045, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.36);
    } else {
      // Marimba/music-box chime tone
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Subtle harmonic overtone for marimba sparkle
      const overtone = ctx.createOscillator();
      const overtoneGain = ctx.createGain();
      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(freq * 2, ctx.currentTime);
      overtoneGain.gain.setValueAtTime(0.015, ctx.currentTime);
      overtoneGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
      overtone.connect(overtoneGain);
      overtoneGain.connect(ctx.destination);
      overtone.start(ctx.currentTime);
      overtone.stop(ctx.currentTime + 0.13);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.29);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
  } catch {
    // Ignore autoplay restriction
  }
}

function tickBgm(): void {
  if (!bgmEnabled) return;

  const note = BGM_MELODY[bgmStep % BGM_MELODY.length];
  if (note !== null && note !== undefined) {
    playBgmNote(note, false);
  }

  const bass = BGM_BASS[bgmStep % BGM_BASS.length];
  if (bass !== null && bass !== undefined) {
    playBgmNote(bass, true);
  }

  bgmStep = (bgmStep + 1) % BGM_MELODY.length;
}

export function isBgmPlaying(): boolean {
  return bgmEnabled;
}

export function startBgm(): void {
  if (bgmEnabled) return;
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume();
  }

  bgmEnabled = true;
  bgmStep = 0;
  // ~115 BPM step interval (260ms per 8th note)
  bgmIntervalId = setInterval(tickBgm, 260);
  tickBgm();
  notifyBgmListeners();
}

export function stopBgm(): void {
  bgmEnabled = false;
  if (bgmIntervalId) {
    clearInterval(bgmIntervalId);
    bgmIntervalId = null;
  }
  notifyBgmListeners();
}

export function toggleBgm(): boolean {
  if (bgmEnabled) {
    stopBgm();
  } else {
    startBgm();
  }
  return bgmEnabled;
}

function notifyBgmListeners(): void {
  bgmListeners.forEach((fn) => fn(bgmEnabled));
}

export function subscribeBgm(callback: (playing: boolean) => void): () => void {
  bgmListeners.add(callback);
  callback(bgmEnabled);
  return () => {
    bgmListeners.delete(callback);
  };
}
