"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap-core";
import { GLSLSignalLazy } from "@/components/animation/glsl-signal-lazy";
import { cn } from "@/lib/utils";

/**
 * SignalSection — calc(150*var(--sf-vh)) Ikeda data field section.
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
// Data readout rows rendered at bottom of SIGNAL — Ikeda/Dischord-tracklist
// register, not marketing copy. Each row is a coded signifier, not a sentence.
const DATA_COLUMNS = [
  { k: "FIELD", v: "IKEDA_0x7F" },
  { k: "MODE", v: "DATA_SPIKE" },
  { k: "DEPTH", v: "06//08" },
  { k: "LATCH", v: "TRUE" },
];

export function SignalSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

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

      // FRAME overlay reveal — honors the dual-layer model (CLAUDE.md): FRAME
      // runs through SIGNAL, staying legible regardless of shader state. Entry
      // is a staggered cascade matching the INVENTORY cadence (40ms) so the
      // whole homepage shares a single entrance language.
      const frame = frameRef.current;
      if (frame) {
        const parts = frame.querySelectorAll<HTMLElement>("[data-signal-frame]");
        gsap.from(parts, {
          opacity: 0,
          y: 16,
          duration: 0.55,
          stagger: 0.04,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        });
      }

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
      style={{ height: "var(--sf-canvas-h, calc(100*var(--sf-vh)))", position: "relative" }}
      className="rounded-none"
    >
      {/* SignalCanvas scissor tracks this div's getBoundingClientRect().
          No transform on this wrapper — the rect matches the section exactly. */}
      <div
        data-signal-wrap
        className="sticky top-0 h-screen rounded-none"
      >
        <GLSLSignalLazy />

        {/* ── FRAME overlay — Ikeda-register legibility layer ─────────────
            Renders ON TOP of the shader (z-10). Honors CLAUDE.md dual-layer
            rule: the FRAME stays legible regardless of shader contrast. Only
            three elements: a big display headline and a single bottom data
            row. Corner signifiers removed — they conflicted with fixed chrome
            (nav cubes at left edge, InstrumentHUD at top-right) and the HUD
            already surfaces section + intensity readout. */}
        <div
          ref={frameRef}
          className="absolute inset-0 z-10 pointer-events-none"
        >
          {/* Center: coded display headline — big Anton so it punches through
              any shader state. Magenta // slashes are the brand signifier. */}
          <div className="absolute inset-0 flex items-center justify-center">
            <h2
              data-signal-frame
              aria-label="Signal"
              className={cn(
                "sf-display text-foreground uppercase tracking-[-0.02em] leading-[0.9] text-center",
                "font-[family-name:var(--font-display)]",
              )}
              style={{ fontSize: "clamp(96px, calc(14*var(--sf-vw)), 220px)" }}
            >
              <span className="text-primary">/</span>/SIGNAL
              <span className="text-primary">/</span>/
            </h2>
          </div>

          {/* Bottom: single data row spanning full width, padded clear of
              nav cubes (left ≥ nav-width + space-4) so nothing clips. */}
          <div
            data-signal-frame
            className="absolute bottom-[var(--sfx-space-8)] left-[calc(var(--sfx-nav-width,96px)+var(--sfx-space-4))] right-[var(--sfx-space-12)] flex items-baseline justify-between gap-[var(--sfx-space-12)] font-mono text-xs text-foreground/70 tracking-widest uppercase"
          >
            <div className="flex gap-[var(--sfx-space-8)]">
              {DATA_COLUMNS.map(({ k, v }) => (
                <span key={k} className="flex gap-[var(--sfx-space-2)]">
                  <span className="text-foreground/40">{k}</span>
                  <span className="text-foreground">{v}</span>
                </span>
              ))}
            </div>
            <span className="shrink-0">
              05/06 <span className="text-primary">{"//"}</span> FIELD
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
