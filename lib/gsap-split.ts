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

import { registerSFEasings } from "./gsap-easings";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, CustomEase, useGSAP);
registerSFEasings();

export { gsap, ScrollTrigger, SplitText, CustomEase, useGSAP };
