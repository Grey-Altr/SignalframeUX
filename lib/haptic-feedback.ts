/**
 * Haptic feedback utility — Vibration API wrapper with feature detection.
 *
 * Design: Micro-vibration on click (10ms) and hover (5ms). Ambient confirmation,
 * not attention-grabbing. Safari/iOS and desktop browsers degrade silently —
 * no error, no console warning.
 *
 * Feature detection: `"vibrate" in navigator` is the reliable cross-browser guard.
 * Calling navigator.vibrate() on unsupported platforms throws — always check first.
 */

/** Haptic interaction types */
export type HapticType = "click" | "hover";

/** Vibration durations in milliseconds — micro-vibration pattern */
const DURATIONS: Record<HapticType, number> = {
  click: 10,
  hover: 5,
};

/**
 * Trigger a micro-vibration haptic pulse.
 *
 * No-ops silently when:
 * - Running server-side (typeof navigator === "undefined")
 * - Vibration API is not supported (Safari, iOS, desktop browsers)
 */
export function triggerHaptic(type: HapticType): void {
  if (typeof navigator === "undefined") return;
  // Safari/iOS and desktop browsers do not implement Vibration API — silent no-op
  if (!("vibrate" in navigator)) return;
  navigator.vibrate(DURATIONS[type]);
}
