"use client";

import { useEffect, useMemo } from "react";
import { GLSLHeroLazy } from "@/components/animation/glsl-hero-lazy";
import { PointcloudRing } from "@/components/dossier/pointcloud-ring";
import { IrisCloud } from "@/components/dossier/iris-cloud";

// Shared angular group count — both the ring's 5 radial bands and the iris
// partition the same 128 angular wedges, so an angular position carries
// coherent intensity/fade across every layer in the stack.
const SHARED_GROUP_COUNT = 128;
// Every REROLL_INTERVAL_MS, a fraction REROLL_FRACTION of the shared groups
// gets their intensity + fade re-randomized in place. Ring + iris read the
// arrays live each frame, so the re-roll propagates immediately and is
// visually coherent across every layer modulated by the same wedge.
const REROLL_INTERVAL_MS = 13_000;
const REROLL_FRACTION = 0.13;

function rollIntensity() {
  return Math.random() < 0.33 ? 0.4 + Math.random() * 1.2 : 1.0;
}
function rollFade() {
  return Math.random() < 0.33 ? 0.3 + Math.random() * 0.4 : 1.0;
}

export function EntrySection() {
  // Shared group traits — 33% of wedges get a random intensity multiplier,
  // an independent 33% get a random fade multiplier. PointcloudRing and
  // IrisCloud both receive these arrays and look up their particles' group
  // by angular position, so a "dim" wedge at 45° reads as dim across the
  // core, halo, outer1/2/3/4 ring bands AND the iris cloud simultaneously.
  const sharedGroups = useMemo(() => {
    const intensity = new Float32Array(SHARED_GROUP_COUNT);
    const fade = new Float32Array(SHARED_GROUP_COUNT);
    for (let g = 0; g < SHARED_GROUP_COUNT; g++) {
      intensity[g] = rollIntensity();
      fade[g] = rollFade();
    }
    return { intensity, fade };
  }, []);

  useEffect(() => {
    const rerollCount = Math.max(1, Math.round(SHARED_GROUP_COUNT * REROLL_FRACTION));
    // BroadcastChannel fans re-rolls out to every worker canvas on the page.
    // Main-thread readers of `sharedGroups` (if any are re-added later) keep
    // seeing the live Float32Array; workers get a fresh structured-clone copy.
    const ch =
      typeof BroadcastChannel !== "undefined"
        ? new BroadcastChannel("sf-hero-shared-groups")
        : null;
    const id = window.setInterval(() => {
      for (let k = 0; k < rerollCount; k++) {
        const g = Math.floor(Math.random() * SHARED_GROUP_COUNT);
        sharedGroups.intensity[g] = rollIntensity();
        sharedGroups.fade[g] = rollFade();
      }
      ch?.postMessage({
        intensity: sharedGroups.intensity,
        fade: sharedGroups.fade,
      });
    }, REROLL_INTERVAL_MS);
    return () => {
      window.clearInterval(id);
      ch?.close();
    };
  }, [sharedGroups]);

  return (
    <div className="relative h-screen w-full overflow-hidden" data-entry-section>
      <GLSLHeroLazy />

      {/* Pointcloud ring — above GLSL, behind all text (no z-index, z-auto). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        {/*
          Wrapper height matches the old square dim so min(W,H) = H and the
          ring/iris render at identical pixel sizes. Wrapper width spans the
          full viewport so the tri-modal outer band can render past the old
          canvas axes without horizontal clipping.
        */}
        <div className="relative h-[min(90vw,90vh)] w-full">
          {/* Iris — centered square sub-container, canvas dims = square dims,
              so iris size is exactly what it was before. */}
          <div className="absolute left-1/2 top-0 aspect-square h-full -translate-x-1/2">
            <IrisCloud
              count={4500}
              outerRadius={0.39}
              innerRadius={0.12}
              trail={0.04}
              pixelSort={1}
              sortThreshold={4}
              groups={sharedGroups}
              className="absolute inset-0"
            />
          </div>
          {/* Ring — full-width canvas (width=viewport, height=square-dim).
              canvasR = min(W,H) = H = square-dim → ring size unchanged,
              but canvas has horizontal room for the outer band. */}
          <PointcloudRing
            count={4200}
            radius={0.42}
            trail={0.04}
            pixelSort={1}
            sortThreshold={4}
            groups={sharedGroups}
            className="absolute inset-0"
          />
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
