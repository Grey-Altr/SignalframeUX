"use client";

/**
 * Lightweight GSAP entry — only core + ScrollTrigger.
 * Use this when you don't need SplitText, ScrambleText, DrawSVG, Flip, or CustomEase.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, Observer, useGSAP);
gsap.defaults({ ease: "power2.out" });

export { gsap, ScrollTrigger, Observer, useGSAP };
