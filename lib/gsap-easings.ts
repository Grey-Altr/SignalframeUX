"use client";

/**
 * SignalframeUX custom GSAP easings — single canonical source.
 * Import from any gsap-* entry point that has CustomEase registered.
 */
import { CustomEase } from "gsap/CustomEase";

export function registerSFEasings() {
  CustomEase.create(
    "sf-snap",
    "M0,0 C0.14,0 0.27,0.5 0.5,0.5 0.73,0.5 0.86,1 1,1"
  );
  CustomEase.create("sf-punch", "M0,0 C0.7,0 0.3,1.5 1,1");
}
