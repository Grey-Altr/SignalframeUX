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
      {/* GLSL noise field — part of "everything else" that constructs at
          t=7s once iris + rings are fully revealed. */}
      <div className="sf-hero-construct absolute inset-0">
        <GLSLHeroLazy />
      </div>

      {/* Pointcloud ring + iris container. Ring particles are gated per-band
          by the worker (see RING_REVEAL_OFFSET_S in pointcloud-ring-worker.ts);
          no wrapper animation needed here. Iris gets its own 2s CSS fade
          because the iris worker has no band structure — its full particle
          cloud resolves as a single visual layer. */}
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
          {/* Iris — staged entrance owner for 0–2s. */}
          <div className="sf-hero-iris-reveal absolute left-1/2 top-0 aspect-square h-full -translate-x-1/2">
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
          className="mt-[calc(var(--sfx-space-8)*1.08)] max-w-(--max-w-content) text-center font-sans font-medium text-foreground/56 tracking-[0.02em] text-[calc(var(--sfx-text-xs)*1.58)] md:text-[calc(var(--sfx-text-sm)*1.58)]"
          style={{ opacity: 0 }}
        >
          A dual-layer design system for generative expression.
        </p>
      </div>

      {/*
        VL-05 clip mask — SVG <mask> whose luminance is the h1 line with only
        the // span in white, everything else in black. Rendered via foreignObject
        so it uses the page's loaded Anton font + HTML layout engine, matching
        the h1's glyph metrics pixel-for-pixel. VL-05 applies this via
        mask-image so its magenta is confined to the h1 //'s silhouette —
        no bleed beyond the main slash.
      */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ overflow: "visible" }}
      >
        <defs>
          <mask id="hero-slash-clip">
            <foreignObject width="100%" height="100%">
              <div
                {...{ xmlns: "http://www.w3.org/1999/xhtml" }}
                className="flex h-full w-full items-center justify-center whitespace-nowrap px-[1em] font-display uppercase tracking-[0.02em]"
                style={{
                  fontSize: "clamp(4.86rem, min(calc(12.96*var(--sf-vw)), calc(34.56*var(--sf-vh))), 12.96rem)",
                  lineHeight: 0.9,
                  fontWeight: 700,
                }}
              >
                <span style={{ color: "black" }}>SIGNALFRAME</span>
                <span
                  className="relative top-[0.08em] pr-[0.28em] tracking-[-0.12em] text-[1.28em]"
                  style={{ color: "white" }}
                >{"//"}</span>
                <span className="-ml-[0.15em]" style={{ color: "black" }}>UX</span>
              </div>
            </foreignObject>
          </mask>
        </defs>
      </svg>

      {/*
        VL-05: Canonical magenta hero moment — scroll-driven signal-intensity slash.
        Layered sibling to the h1 (cannot be a child — parent h1 has opacity: 0.01
        which caps children). Invisible SIGNALFRAME/UX spacer spans pin the //
        to the exact x-position of the h1 slash without layout math, so the two
        layers visually register at any viewport. mix-blend-mode: screen lets
        the magenta punch through the dark GLSL background like an analog bloom.
        mask-image clips the whole layer to #hero-slash-clip so any sub-pixel
        overshoot from the screen-blend or font antialiasing stays inside the
        h1 // silhouette. Baseline 0.18 is the reduced-motion / pre-GSAP
        fallback; page-animations scrubs 0.18 → 1.0 across entry-section
        scroll progress.
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
          maskImage: "url(#hero-slash-clip)",
          WebkitMaskImage: "url(#hero-slash-clip)",
        }}
      >
        <span className="invisible" aria-hidden="true">SIGNALFRAME</span>
        <span className="relative top-[0.08em] pr-[0.28em] tracking-[-0.12em] text-[1.28em]">{"//"}</span>
        <span className="invisible -ml-[0.15em]" aria-hidden="true">UX</span>
      </div>
    </div>
  );
}
