"use client";

import { GLSLHeroLazy } from "@/components/animation/glsl-hero-lazy";

export function EntrySection() {
  return (
    <div className="relative h-screen w-full overflow-hidden" data-entry-section>
      <GLSLHeroLazy />

      {/* HTML overlay — LCP target */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-[1em]">
        <h1
          data-anim="hero-title"
          className="w-full whitespace-nowrap font-display text-center uppercase leading-[0.9] tracking-[0.02em] text-primary-foreground"
          style={{
            // Keep the lockup stable on short viewports by constraining with vh.
            // Display lockup scaled +30% vs baseline (clamp + subtitle + slash overlay).
            fontSize: "clamp(5.85rem, min(15.6vw, 41.6vh), 15.6rem)",
            fontWeight: 700,
          }}
        >
          <span className="inline-block overflow-hidden"><span data-anim="hero-char" className="sf-hero-deferred inline-block">S</span></span><span className="inline-block overflow-hidden"><span data-anim="hero-char" className="sf-hero-deferred inline-block">I</span></span><span className="inline-block overflow-hidden"><span data-anim="hero-char" className="sf-hero-deferred inline-block">G</span></span><span className="inline-block overflow-hidden"><span data-anim="hero-char" className="sf-hero-deferred inline-block">N</span></span><span className="inline-block overflow-hidden"><span data-anim="hero-char" className="sf-hero-deferred inline-block">A</span></span><span className="inline-block overflow-hidden"><span data-anim="hero-char" className="sf-hero-deferred inline-block">L</span></span><span className="inline-block overflow-hidden"><span data-anim="hero-char" className="sf-hero-deferred inline-block">F</span></span><span className="inline-block overflow-hidden"><span data-anim="hero-char" className="sf-hero-deferred inline-block">R</span></span><span className="inline-block overflow-hidden"><span data-anim="hero-char" className="sf-hero-deferred inline-block">A</span></span><span className="inline-block overflow-hidden"><span data-anim="hero-char" className="sf-hero-deferred inline-block">M</span></span><span className="inline-block overflow-hidden"><span data-anim="hero-char" className="sf-hero-deferred inline-block">E</span></span><span className="inline-block overflow-hidden align-baseline pr-[0.28em]"><span className="relative top-[0.08em] text-primary sf-hero-deferred inline-block align-baseline text-[1.28em] tracking-[-0.12em] leading-none" data-anim="hero-char">{"//"}</span></span><span className="inline-block overflow-hidden -ml-[0.15em] align-baseline"><span data-anim="hero-char" className="sf-hero-deferred inline-block">U</span></span><span className="inline-block overflow-hidden align-baseline"><span data-anim="hero-char" className="sf-hero-deferred inline-block">X</span></span>
        </h1>
        <p
          data-anim="hero-subtitle"
          className="mt-[calc(var(--sfx-space-8)*1.3)] max-w-(--max-w-content) text-center font-sans font-medium text-foreground/56 tracking-[0.02em] animate-[hero-fade-in_0.5s_ease-out_0.2s_forwards] text-[calc(var(--sfx-text-xs)*1.3)] md:text-[calc(var(--sfx-text-sm)*1.3)]"
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
        className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center whitespace-nowrap px-[1em] font-display uppercase tracking-[0.02em] text-primary"
        style={{
          fontSize: "clamp(5.85rem, min(15.6vw, 41.6vh), 15.6rem)",
          lineHeight: 0.9,
          fontWeight: 700,
          opacity: 0.25,
          mixBlendMode: "screen",
        }}
      >
        <span className="invisible" aria-hidden="true">SIGNALFRAME</span>
        <span className="relative top-[0.08em] pr-[0.28em] tracking-[-0.12em] text-[1.28em]">{"//"}</span>
        <span className="invisible -ml-[0.15em]" aria-hidden="true">UX</span>
      </div>
    </div>
  );
}
