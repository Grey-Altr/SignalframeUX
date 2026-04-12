"use client";

import { useRef } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap-core";
import { GLSLSignalLazy } from "@/components/animation/glsl-signal-lazy";

/**
 * SignalSection — 150vh Ikeda data field section.
 *
 * Full-viewport WebGL scene (scanlines + data columns + yellow spike markers).
 * No parallax transform — the scene is registered with SignalCanvas scissor
 * tracking the container rect directly. Removing the translateY parallax
 * prevents scissor drift and Lenis conflicts.
 *
 * ScrollTrigger: onEnter/onLeave lifecycle callbacks only. No pin, no scrub.
 * Reduced-motion: GLSLSignal renders a CSS scanline fallback; no ScrollTrigger.
 *
 * SIGNAL/FRAME ordering: signal runs through the frame.
 *
 * @module components/blocks/signal-section
 */
export function SignalSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        invalidateOnRefresh: true,
        onEnter: () => {
          // Set global --signal-intensity to 1.0 when SIGNAL enters viewport.
          // PROOF's section-scoped value still wins inside PROOF's subtree (CSS cascade).
          document.documentElement.style.setProperty("--sfx-signal-intensity", "1.0");
        },
        // No onLeave — intensity persists at 1.0 as handoff to ACQUISITION.
      });

      console.debug("[SIGNAL ST]", "start:", trigger.start, "end:", trigger.end);

      return () => { trigger.kill(); };
    },
    { scope: sectionRef, dependencies: [] },
  );

  return (
    <section
      ref={sectionRef}
      data-signal-root
      data-anim
      style={{ height: "150vh", position: "relative" }}
      className="rounded-none"
    >
      {/* SignalCanvas scissor tracks this div's getBoundingClientRect().
          No transform on this wrapper — the rect matches the section exactly. */}
      <div
        data-signal-wrap
        className="sticky top-0 h-screen rounded-none"
      >
        <GLSLSignalLazy />
      </div>
    </section>
  );
}
