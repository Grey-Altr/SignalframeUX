"use client";

/**
 * Lightweight GSAP entry — core + ScrollTrigger + SplitText only.
 * Use for api-explorer where only SplitText headline animations are needed.
 * ~25KB vs ~75KB for the full gsap-plugins bundle.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };
