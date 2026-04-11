"use client";

import { GLSLHeroLazy } from "@/components/animation/glsl-hero-lazy";

export function EntrySection() {
  return (
    <div className="relative h-screen w-full overflow-hidden" data-entry-section>
      {/* WebGL background — absolute inset-0, z-0 */}
      <GLSLHeroLazy />

      {/* HTML overlay — LCP target */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <h1
          data-anim="hero-title"
          className="font-display text-center text-primary-foreground uppercase tracking-[0.02em] leading-[0.9]"
          style={{
            fontSize: "clamp(7.5rem, 12vw, 10rem)",
            fontWeight: 700,
            opacity: 0.01,
          }}
        >
          SIGNALFRAME<span className="text-primary">{"//"}</span>UX
        </h1>
        <p
          data-anim="hero-subtitle"
          className="mt-4 text-muted-foreground text-center font-sans text-base tracking-[var(--sf-tracking-label)]"
          style={{ opacity: 0 }}
        >
          A dual-layer design system for generative expression.
        </p>
      </div>

      {/*
        VL-05: Canonical magenta hero moment — scroll-driven signal-intensity slash.
        Layered sibling to the h1 (cannot be a child — parent h1 has opacity: 0.01
        which caps children). Invisible SIGNALFRAME/UX spacer spans pin the //
        to the exact x-position of the h1 slash without layout math, so the two
        layers visually register at any viewport. mix-blend-mode: screen lets
        the magenta punch through the dark GLSL background like an analog bloom.
        Baseline 0.18 is the reduced-motion / pre-GSAP fallback; page-animations
        scrubs 0.18 → 1.0 across entry-section scroll progress.
      */}
      <div
        data-anim="hero-slash-moment"
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none font-display uppercase tracking-[0.02em] text-primary"
        style={{
          fontSize: "clamp(7.5rem, 12vw, 10rem)",
          lineHeight: 0.9,
          fontWeight: 700,
          opacity: 0.25,
          mixBlendMode: "screen",
        }}
      >
        <span className="invisible" aria-hidden="true">SIGNALFRAME</span>
        <span>{"//"}</span>
        <span className="invisible" aria-hidden="true">UX</span>
      </div>
    </div>
  );
}
