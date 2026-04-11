"use client";

/**
 * Lightweight GSAP entry — core + ScrollTrigger + Flip + CustomEase.
 * Use for components-explorer where Flip layout transitions need sf-snap/sf-punch eases.
 * ~25KB vs ~75KB for the full gsap-plugins bundle.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { CustomEase } from "gsap/CustomEase";

import { registerSFEasings } from "./gsap-easings";

// Guard against SSR module evaluation — GSAP plugins must only be registered
// in a browser context.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Flip, CustomEase);
  registerSFEasings();
}

export { gsap, ScrollTrigger, Flip, CustomEase };
