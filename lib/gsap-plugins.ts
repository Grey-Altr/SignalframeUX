"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Flip } from "gsap/Flip";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(
  ScrollTrigger,
  SplitText,
  ScrambleTextPlugin,
  DrawSVGPlugin,
  Flip,
  CustomEase,
  useGSAP
);

// SignalframeUX custom easings
CustomEase.create(
  "sf-snap",
  "M0,0 C0.14,0 0.27,0.5 0.5,0.5 0.73,0.5 0.86,1 1,1"
);
CustomEase.create("sf-punch", "M0,0 C0.7,0 0.3,1.5 1,1");

// Reduced motion: freeze all GSAP animations
if (typeof window !== "undefined") {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );
  if (prefersReduced.matches) {
    gsap.globalTimeline.timeScale(0);
  }
  prefersReduced.addEventListener("change", (e) => {
    gsap.globalTimeline.timeScale(e.matches ? 0 : 1);
  });
}

export { gsap, ScrollTrigger, SplitText, Flip, CustomEase, useGSAP };
