"use client";

/**
 * Lightweight GSAP entry — core + ScrollTrigger + DrawSVGPlugin only.
 * Use for circuit-divider where only DrawSVG path animations are needed.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

// Guard against SSR module evaluation — GSAP plugins must only be registered
// in a browser context.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);
}

export { gsap, ScrollTrigger, DrawSVGPlugin };
