"use client";

/**
 * SignalframeUX custom GSAP easings — single canonical source.
 * Import from any gsap-* entry point that has CustomEase registered.
 * Registers `sf-snap` (stepped bounce) and `sf-punch` (overshoot) easings.
 *
 * @example
 * // Called automatically by gsap-plugins.ts, gsap-flip.ts, gsap-split.ts.
 * // Manual use: import and call once at app init.
 * registerSFEasings();
 * gsap.to(el, { x: 100, ease: "sf-snap", duration: 0.4 });
 */
export function registerSFEasings() {
  CustomEase.create(
    "sf-snap",
    "M0,0 C0.14,0 0.27,0.5 0.5,0.5 0.73,0.5 0.86,1 1,1"
  );
  CustomEase.create("sf-punch", "M0,0 C0.7,0 0.3,1.5 1,1");
}
