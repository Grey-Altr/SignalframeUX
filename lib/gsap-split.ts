"use client";

/**
 * Lightweight GSAP entry — core + ScrollTrigger + SplitText + ScrambleText + CustomEase.
 * Use for split-headline and scramble-text components.
 * ~35KB vs ~75KB for the full gsap-plugins bundle (no DrawSVG, Flip).
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, CustomEase, useGSAP);

// SignalframeUX custom easings
CustomEase.create(
  "sf-snap",
  "M0,0 C0.14,0 0.27,0.5 0.5,0.5 0.73,0.5 0.86,1 1,1"
);
CustomEase.create("sf-punch", "M0,0 C0.7,0 0.3,1.5 1,1");

export { gsap, ScrollTrigger, SplitText, CustomEase, useGSAP };
