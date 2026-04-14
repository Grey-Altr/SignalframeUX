/**
 * Tokenized effect presets for every effect family in the system.
 *
 * Each preset is a plain record of numeric knobs. Components read these as
 * defaults and scale them by the runtime quality-tier multiplier, giving a
 * smooth degradation curve without per-component if/else branches.
 *
 * Naming mirrors TouchDesigner TOP/CHOP/SOP nomenclature loosely:
 *   - feedback  → Feedback TOP
 *   - particle  → Particle SOP
 *   - displace  → Displace TOP
 *   - bloom     → Bloom TOP
 *   - glitch    → Glitch / Datamosh
 *   - audio     → CHOP-like modulation
 *
 * @module lib/effects/effect-presets
 */

import { type QualityTier, getQualityTier, tierMultiplier } from "./quality-tier";

// ---------------------------------------------------------------------------
// Per-family preset shapes
// ---------------------------------------------------------------------------

export type FeedbackPreset = {
  decay: number;
  trailLength: number;
  colorShift: number;
  zoom: number;
  rotation: number;
};

export type ParticlePreset = {
  count: number;
  size: number;
  speed: number;
  drift: number;
  opacity: number;
  connectDistance: number;
};

export type DisplacePreset = {
  gain: number;
  frequency: number;
  octaves: number;
  lacunarity: number;
  speed: number;
};

export type BloomPreset = {
  threshold: number;
  radius: number;
  intensity: number;
  softKnee: number;
};

export type GlitchPreset = {
  rate: number;
  blockSize: number;
  chromaticShift: number;
  scanlineIntensity: number;
  rgbSplitAmount: number;
};

export type AudioPreset = {
  smoothing: number;
  fftSize: number;
  bassMultiplier: number;
  midMultiplier: number;
  highMultiplier: number;
  reactivity: number;
};

export type EffectPresetMap = {
  feedback: FeedbackPreset;
  particle: ParticlePreset;
  displace: DisplacePreset;
  bloom: BloomPreset;
  glitch: GlitchPreset;
  audio: AudioPreset;
};

export type EffectFamily = keyof EffectPresetMap;

// ---------------------------------------------------------------------------
// Baseline presets (tier-agnostic maximums)
// ---------------------------------------------------------------------------

const BASELINE: EffectPresetMap = {
  feedback: {
    decay: 0.96,
    trailLength: 0.85,
    colorShift: 0.02,
    zoom: 1.002,
    rotation: 0.001,
  },
  particle: {
    count: 6000,
    size: 1.5,
    speed: 0.4,
    drift: 0.15,
    opacity: 0.6,
    connectDistance: 120,
  },
  displace: {
    gain: 0.08,
    frequency: 2.4,
    octaves: 4,
    lacunarity: 2.0,
    speed: 0.3,
  },
  bloom: {
    threshold: 0.7,
    radius: 0.4,
    intensity: 0.6,
    softKnee: 0.5,
  },
  glitch: {
    rate: 0.15,
    blockSize: 16,
    chromaticShift: 3.0,
    scanlineIntensity: 0.12,
    rgbSplitAmount: 2.0,
  },
  audio: {
    smoothing: 0.8,
    fftSize: 1024,
    bassMultiplier: 1.2,
    midMultiplier: 1.0,
    highMultiplier: 0.8,
    reactivity: 0.6,
  },
};

// ---------------------------------------------------------------------------
// Tier-scaled accessors
// ---------------------------------------------------------------------------

/**
 * Return the scaled preset for a given effect family.
 *
 * Multiplies every numeric value in the baseline preset by the tier
 * multiplier, with floor guards so feedback-decay and bloom-threshold
 * don't collapse to zero (which would kill the visual entirely).
 */
export function getPreset<K extends EffectFamily>(
  family: K,
  tier?: QualityTier
): EffectPresetMap[K] {
  const t = tier ?? getQualityTier();
  const m = tierMultiplier(t);
  const base = BASELINE[family];

  if (t === "fallback") {
    return zeroPreset(family);
  }

  const scaled: Record<string, number> = {};
  for (const [key, val] of Object.entries(base)) {
    scaled[key] = val * m;
  }

  applyFloors(family, scaled);

  return scaled as EffectPresetMap[K];
}

function zeroPreset<K extends EffectFamily>(family: K): EffectPresetMap[K] {
  const base = BASELINE[family];
  const out: Record<string, number> = {};
  for (const key of Object.keys(base)) out[key] = 0;
  return out as EffectPresetMap[K];
}

function applyFloors(family: EffectFamily, p: Record<string, number>): void {
  switch (family) {
    case "feedback":
      p.decay = Math.max(p.decay, 0.88);
      break;
    case "bloom":
      p.threshold = Math.max(p.threshold, 0.5);
      break;
    case "displace":
      p.octaves = Math.max(Math.round(p.octaves), 1);
      break;
    case "particle":
      p.count = Math.round(p.count);
      break;
    case "audio":
      p.fftSize = nearestPow2(p.fftSize);
      break;
  }
}

function nearestPow2(n: number): number {
  if (n <= 0) return 32;
  return Math.pow(2, Math.round(Math.log2(n)));
}

/**
 * Retrieve the raw (unscaled) baseline for inspection / devtools.
 */
export function getBaseline<K extends EffectFamily>(family: K): EffectPresetMap[K] {
  return { ...BASELINE[family] };
}
