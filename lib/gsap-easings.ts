"use client";

/**
 * SignalframeUX custom GSAP easings — single canonical source.
 * Import from any gsap-* entry point that has CustomEase registered.
 *
 * @example
 * // Register the SF custom easings once at app init (client-only).
 * import { registerSFEasings } from "signalframeux/animation";
 * registerSFEasings();
 * // Then reference "sf-snap" or "sf-punch" in any gsap tween:
 * // gsap.to(el, { x: 100, ease: "sf-snap", duration: 0.3 });
 */
import { CustomEase } from "gsap/CustomEase";

export function registerSFEasings() {
  CustomEase.create(
    "sf-snap",
    "M0,0 C0.12,0.65 0.28,1 1,1"
  );
  CustomEase.create("sf-punch", "M0,0 C0.16,0.75 0.3,1 1,1");
}
