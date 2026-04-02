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

gsap.registerPlugin(ScrollTrigger, Flip, CustomEase);

// SignalframeUX custom easings (must be registered here for non-homepage routes)
CustomEase.create("sf-snap", "M0,0 C0.14,0 0.27,0.5 0.5,0.5 0.73,0.5 0.86,1 1,1");
CustomEase.create("sf-punch", "M0,0 C0.7,0 0.3,1.5 1,1");

export { gsap, ScrollTrigger, Flip, CustomEase };
