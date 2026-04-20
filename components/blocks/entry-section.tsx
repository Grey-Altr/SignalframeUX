"use client";

import { GLSLHeroLazy } from "@/components/animation/glsl-hero-lazy";
import { PointcloudRing } from "@/components/dossier/pointcloud-ring";
import { IrisCloud } from "@/components/dossier/iris-cloud";

export function EntrySection() {
  return (
    <div className="relative h-screen w-full overflow-hidden" data-entry-section>
      <GLSLHeroLazy />

      {/* Pointcloud ring — above GLSL, behind all text (no z-index, z-auto). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="aspect-square w-[min(90vw,90vh)]">
          <div className="relative h-full w-full">
            {/* Iris — inward-drifting cloud behind the main ring */}
            <IrisCloud
              count={4500}
              outerRadius={0.39}
              innerRadius={0.12}
              trail={0.04}
              pixelSort={0.5}
              sortThreshold={4}
              className="absolute inset-0"
            />
            {/* Main ring — on top of the iris */}
            <PointcloudRing
              count={2400}
              radius={0.42}
              trail={0.1}
              pixelSort={0.33}
              sortThreshold={4}
              className="absolute inset-0"
            />
          </div>
        </div>
      </div>

      {/* HTML overlay — LCP target */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-[1em]">
        <h1
          data-anim="hero-title"
          className="w-full whitespace-nowrap font-display text-center uppercase leading-[0.9] tracking-[0.02em] text-foreground"
          style={{
            // Keep the lockup stable on short viewports by constraining with vh.
            // Lockup +8% vs baseline (matches subtitle + slash overlay).
            fontSize: "clamp(4.86rem, min(calc(12.96*var(--sf-vw)), calc(34.56*var(--sf-vh))), 12.96rem)",
            fontWeight: 700,
          }}
        >
          <span className="inline-block overflow-hidden"><span data-anim="hero-char" className="sf-hero-deferred inline-block">S</span></span><span className="inline-block overflow-hidden"><span data-anim="hero-char" className="sf-hero-deferred inline-block">I</span></span><span className="inline-block overflow-hidden"><span data-anim="hero-char" className="sf-hero-deferred inline-block">G</span></span><span className="inline-block overflow-hidden"><span data-anim="hero-char" className="sf-hero-deferred inline-block">N</span></span><span className="inline-block overflow-hidden"><span data-anim="hero-char" className="sf-hero-deferred inline-block">A</span></span><span className="inline-block overflow-hidden"><span data-anim="hero-char" className="sf-hero-deferred inline-block">L</span></span><span className="inline-block overflow-hidden"><span data-anim="hero-char" className="sf-hero-deferred inline-block">F</span></span><span className="inline-block overflow-hidden"><span data-anim="hero-char" className="sf-hero-deferred inline-block">R</span></span><span className="inline-block overflow-hidden"><span data-anim="hero-char" className="sf-hero-deferred inline-block">A</span></span><span className="inline-block overflow-hidden"><span data-anim="hero-char" className="sf-hero-deferred inline-block">M</span></span><span className="inline-block overflow-hidden"><span data-anim="hero-char" className="sf-hero-deferred inline-block">E</span></span><span className="inline-block overflow-hidden align-baseline pr-[0.28em]"><span className="relative top-[0.08em] text-primary sf-hero-deferred inline-block align-baseline text-[1.28em] tracking-[-0.12em] leading-none" data-anim="hero-char">{"//"}</span></span><span className="inline-block overflow-hidden -ml-[0.15em] align-baseline"><span data-anim="hero-char" className="sf-hero-deferred inline-block">U</span></span><span className="inline-block overflow-hidden align-baseline"><span data-anim="hero-char" className="sf-hero-deferred inline-block">X</span></span>
        </h1>
        <p
          data-anim="hero-subtitle"
          className="mt-[calc(var(--sfx-space-8)*1.08)] max-w-(--max-w-content) text-center font-sans font-medium text-foreground/56 tracking-[0.02em] animate-[hero-fade-in_0.5s_ease-out_0.2s_forwards] text-[calc(var(--sfx-text-xs)*1.58)] md:text-[calc(var(--sfx-text-sm)*1.58)]"
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
          fontSize: "clamp(4.86rem, min(calc(12.96*var(--sf-vw)), calc(34.56*var(--sf-vh))), 12.96rem)",
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
