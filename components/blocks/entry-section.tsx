"use client";

import { GLSLHeroLazy } from "@/components/animation/glsl-hero-lazy";

export function EntrySection() {
  return (
    <div className="relative h-screen w-full overflow-hidden" data-entry-section>
      <GLSLHeroLazy />

      {/* HTML overlay — LCP target */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-[1em]">
        <h1
          data-anim="hero-title"
          className="font-display text-center text-primary-foreground uppercase tracking-[0.02em] leading-[0.9] w-full"
          style={{
            fontSize: "clamp(7.5rem, 13.4vw, 14rem)",
            fontWeight: 700,
          }}
        >
          <span className="inline-block overflow-hidden"><span data-anim="hero-char" className="sf-hero-deferred inline-block">S</span></span><span className="inline-block overflow-hidden"><span data-anim="hero-char" className="sf-hero-deferred inline-block">I</span></span><span className="inline-block overflow-hidden"><span data-anim="hero-char" className="sf-hero-deferred inline-block">G</span></span><span className="inline-block overflow-hidden"><span data-anim="hero-char" className="sf-hero-deferred inline-block">N</span></span><span className="inline-block overflow-hidden"><span data-anim="hero-char" className="sf-hero-deferred inline-block">A</span></span><span className="inline-block overflow-hidden"><span data-anim="hero-char" className="sf-hero-deferred inline-block">L</span></span><span className="inline-block overflow-hidden"><span data-anim="hero-char" className="sf-hero-deferred inline-block">F</span></span><span className="inline-block overflow-hidden"><span data-anim="hero-char" className="sf-hero-deferred inline-block">R</span></span><span className="inline-block overflow-hidden"><span data-anim="hero-char" className="sf-hero-deferred inline-block">A</span></span><span className="inline-block overflow-hidden"><span data-anim="hero-char" className="sf-hero-deferred inline-block">M</span></span><span className="inline-block overflow-hidden"><span data-anim="hero-char" className="sf-hero-deferred inline-block">E</span></span><span className="inline-block overflow-hidden"><span className="text-primary sf-hero-deferred inline-block tracking-[-0.12em]" data-anim="hero-char">{"//"}</span></span><span className="inline-block overflow-hidden ml-[0.08em]"><span data-anim="hero-char" className="sf-hero-deferred inline-block">U</span></span><span className="inline-block overflow-hidden"><span data-anim="hero-char" className="sf-hero-deferred inline-block">X</span></span>
        </h1>
        <p
          data-anim="hero-subtitle"
          className="mt-[var(--sfx-space-4)] text-muted-foreground text-center font-sans text-base tracking-[var(--sf-tracking-label)] animate-[hero-fade-in_0.5s_ease-out_0.2s_forwards]"
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
        className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none font-display uppercase tracking-[0.02em] text-primary px-[1em]"
        style={{
          fontSize: "clamp(7.5rem, 13.4vw, 14rem)",
          lineHeight: 0.9,
          fontWeight: 700,
          opacity: 0.25,
          mixBlendMode: "screen",
        }}
      >
        <span className="invisible" aria-hidden="true">SIGNALFRAME</span>
        <span className="tracking-[-0.12em]">{"//"}</span>
        <span className="invisible ml-[0.08em]" aria-hidden="true">UX</span>
      </div>
    </div>
  );
}
