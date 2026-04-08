"use client";

import { useRef } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap-core";
import { GLSLSignalLazy } from "@/components/animation/glsl-signal-lazy";

/**
 * SignalSection — 150vh atmospheric parallax section.
 *
 * Full-viewport WebGL scene at maximum SIGNAL intensity (uIntensity locked 1.0),
 * slow scrub:2 parallax translating the scene wrapper -40px over the scroll range,
 * --signal-intensity:1.0 set on documentElement when the section enters view, persisted.
 *
 * No text competes with the shader (SG-03). Not a pinned section.
 * Reduced-motion: GLSLSignal renders its own static fallback; no ScrollTrigger created.
 *
 * SIGNAL/FRAME ordering: signal runs through the frame.
 *
 * @module components/blocks/signal-section
 */
export function SignalSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const wrap = canvasWrapRef.current;
      if (!section || !wrap) return;

      // Reduced-motion: no ScrollTrigger, no parallax, no intensity setter.
      // GLSLSignal renders its own static fallback internally.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 2, // SLOW atmospheric scrub — research-locked, NOT scrub:1 or scrub:true
        invalidateOnRefresh: true,
        onEnter: () => {
          // SIGNAL sets the GLOBAL --signal-intensity to 1.0 on documentElement.
          // CSS cascade: PROOF's section-scoped value still wins inside PROOF's subtree.
          document.documentElement.style.setProperty("--signal-intensity", "1.0");
        },
        onUpdate: (self) => {
          // Parallax: translate scene wrapper 0 to -40px over full scroll range.
          // SignalCanvas scissor follows getBoundingClientRect() on next ticker frame.
          const parallaxOffset = self.progress * 40;
          wrap.style.transform = `translateY(${-parallaxOffset}px)`;
        },
        // Intentionally no leave callback — intensity persists at 1.0.
        // Correct handoff to ACQUISITION at full intensity.
      });

      // Zero-range trap diagnostic (RESEARCH Pitfall 1).
      // If start === end: layout collapsed before ScrollTrigger init — fonts/Lenis order issue.
      console.debug("[SIGNAL ST]", "start:", trigger.start, "end:", trigger.end);

      return () => {
        trigger.kill();
      };
    },
    { scope: sectionRef, dependencies: [] },
  );

  return (
    <section
      ref={sectionRef}
      data-signal-root
      data-anim
      style={{ height: "150vh", position: "relative", overflow: "hidden" }}
      className="rounded-none"
    >
      {/* Scene wrapper — its transform is mutated by the parallax ScrollTrigger.
          The SignalCanvas scissor/viewport follows getBoundingClientRect() on this
          element automatically, so parallax shifts the scissor region too. */}
      <div
        ref={canvasWrapRef}
        data-signal-wrap
        className="absolute inset-0 rounded-none"
        style={{ transform: "translateY(0px)" }}
      >
        <GLSLSignalLazy />
      </div>
      {/* SG-03: zero text inside SIGNAL section — pure visual/generative experience.
          Ikeda reference: perceptual threshold, not informational.
          Phase 34 visual language audit may add a SIGNAL//FIELD label if warranted. */}
    </section>
  );
}
