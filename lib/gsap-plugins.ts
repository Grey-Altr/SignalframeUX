"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { Flip } from "gsap/Flip";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

import { registerSFEasings } from "./gsap-easings";

gsap.registerPlugin(
  ScrollTrigger,
  SplitText,
  ScrambleTextPlugin,
  Flip,
  CustomEase,
  useGSAP
);
registerSFEasings();

/**
 * Initialize reduced-motion handling for GSAP.
 * Call once from a client component's useEffect — not at module scope.
 * Returns a cleanup function that removes the matchMedia listener.
 */
let motionCleanup: (() => void) | null = null;

export function initReducedMotion(): () => void {
  if (typeof window === "undefined") return () => {};

  // Clean up previous listener before re-initializing (safe under Strict Mode double-invoke)
  motionCleanup?.();

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );
  if (prefersReduced.matches) {
    gsap.globalTimeline.timeScale(0);
  }
  const handler = (e: MediaQueryListEvent) => {
    gsap.globalTimeline.timeScale(e.matches ? 0 : 1);
  };
  prefersReduced.addEventListener("change", handler);

  motionCleanup = () => {
    prefersReduced.removeEventListener("change", handler);
    motionCleanup = null;
  };

  return motionCleanup;
}

export { gsap, ScrollTrigger, SplitText, Flip, CustomEase, useGSAP };
