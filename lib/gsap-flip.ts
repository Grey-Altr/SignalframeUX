"use client";

/**
 * Lightweight GSAP entry — core + ScrollTrigger + Flip only.
 * Use for components-explorer where only Flip layout transitions are needed.
 * ~20KB vs ~75KB for the full gsap-plugins bundle.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(ScrollTrigger, Flip);

export { gsap, ScrollTrigger, Flip };
