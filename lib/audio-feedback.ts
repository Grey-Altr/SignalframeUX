/**
 * Audio feedback utility — singleton Web Audio API oscillator palette.
 *
 * Design: DU/TDR terminal acknowledgment tones. Square wave, very low gain,
 * brief decay envelope. Each event creates-and-stops its own OscillatorNode —
 * no sustained oscillator kept alive.
 *
 * Browser autoplay policy: AudioContext is created lazily on first user gesture.
 * Never at module import. getCtx() must be called from inside an event handler.
 */

/** Module-level singleton — NOT created at import */
let _ctx: AudioContext | null = null;

/** Lazy singleton factory — call only from inside a user gesture event handler */
function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!_ctx) _ctx = new AudioContext();
  // Browser may suspend context between gestures — always resume
  if (_ctx.state === "suspended") _ctx.resume();
  return _ctx;
}

/** Interaction tone types */
export type ToneType = "hover" | "click" | "focus";

/** Tone parameters — frequencies in 200-800Hz terminal range, gain 0.03-0.08 */
const TONES: Record<ToneType, { freq: number; duration: number; gain: number }> = {
  hover: { freq: 320, duration: 0.06, gain: 0.04 },
  click: { freq: 600, duration: 0.08, gain: 0.06 },
  focus: { freq: 200, duration: 0.05, gain: 0.03 },
};

/**
 * Play a brief square wave acknowledgment tone.
 *
 * No-ops when:
 * - Running server-side (typeof window === "undefined")
 * - prefers-reduced-motion is active
 * - AudioContext cannot be obtained
 *
 * Must be called from inside a user gesture event handler to satisfy
 * browser autoplay policy. The AudioContext is lazily created on first call.
 */
export function playTone(type: ToneType): void {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ctx = getCtx();
  if (!ctx) return;

  const { freq, duration, gain } = TONES[type];

  const osc = ctx.createOscillator();
  const g = ctx.createGain();

  osc.type = "square";
  osc.frequency.setValueAtTime(freq, ctx.currentTime);

  // Fast decay envelope — terminal acknowledgment, not sustain
  g.gain.setValueAtTime(gain, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

  osc.connect(g);
  g.connect(ctx.destination);

  // Create-and-stop per event — no persistent oscillator
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}
