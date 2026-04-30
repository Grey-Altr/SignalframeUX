"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/gsap-core";

const DESIGN_WIDTH = 1280;
const DESIGN_HEIGHT = 800;

/** Nav cascade scrubs --sf-nav-morph between these vh bounds.
 *  Above IDLE the nav is untouched; below FLOOR it's fully peeled.
 *  At FLOOR the nav also begins scaling down via SHRINK_VH (same value). */
const NAV_MORPH_VH_IDLE = 800;
const NAV_MORPH_VH_FLOOR = 435;
/** vh below which chrome + nav scale down; both stay at 1 when vh ≥ this. */
const SHRINK_VH = 435;

/** Pillarbox breakpoint per Phase 66 ARC-02 — below this, render at native
 *  pixel sizes (transform=none) so axe-core post-transform getBoundingClientRect
 *  measures real sizes (closes path_h target-size). Above sm the v1.8 scaling
 *  path is unchanged. See .planning/codebase/scale-canvas-track-b-decision.md
 *  for rationale. Pre-hydration scaleScript + canvasSyncScript at
 *  app/layout.tsx mirror this exact value (CLS=0 contract — Pitfall 1). */
const BREAKPOINT_PX = 640;

/**
 * ScaleCanvas — scales content by window.innerWidth / 1280 so the page fills
 * the viewport width (no pillarbox above sm). Below sm (640px), transform is
 * identity (Phase 66 ARC-02 pillarbox) — content renders at native pixel sizes
 * for native a11y target-size + color-contrast semantics.
 * Content taller than the scaled design height scrolls naturally.
 *
 * Publishes --sf-canvas-scale (min(vw/1280, vh/800)) for chrome elements that
 * should shrink on either axis, --sf-content-scale for body content, and
 * --sf-nav-scale for the nav (tracks chrome scale). Also publishes
 * --sf-nav-morph (0..1) driven by vh: 0 at vh≥800, 1 at vh≤435. CSS reads
 * morph to run the per-cube peel cascade (column → L-shape row).
 *
 * --sf-frame-offset-x / --sf-frame-bottom-gap are pinned to 0; the contract is
 * preserved so a future aspect-locked mode could swap in non-zero offsets.
 */
export function ScaleCanvas({ children }: { children: React.ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    let rafId = 0;

    const applyScale = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let contentScale: number;
      let heightScale: number;
      let chromeScale: number;
      let navScale: number;
      let navMorph: number;

      if (vw < BREAKPOINT_PX) {
        // Pillarbox below sm: native sizes, identity transform, no nav-morph.
        // Phase 66 ARC-02 — closes path_h (mobile a11y target-size). Discharges
        // _path_h_decision.review_gate option (a) verbatim. Mirrored exactly
        // by app/layout.tsx scaleScript + canvasSyncScript pre-hydration IIFEs.
        contentScale = 1;
        heightScale = 1;
        chromeScale = 1;
        navScale = 1;
        navMorph = 0;
      } else {
        // Above sm: v1.8 behavior unchanged.
        // Content scale: width-only — keeps the page filling the viewport
        // horizontally so there is never a pillarbox.
        contentScale = vw / DESIGN_WIDTH;
        // Chrome + nav scale: stays at 1 until vh drops below SHRINK_VH,
        // then shrinks linearly with vh. Width still constrains it (so the
        // chrome doesn't overflow a narrow viewport), but height does not
        // until we cross the threshold.
        heightScale = Math.min(1, vh / SHRINK_VH);
        chromeScale = Math.min(contentScale, heightScale);
        navScale = heightScale;

        // Nav morph: 0 at vh ≥ IDLE, 1 at vh ≤ FLOOR, linear scrub between.
        // Drives the per-cube peel cascade in globals.css.
        navMorph = Math.max(
          0,
          Math.min(
            1,
            (NAV_MORPH_VH_IDLE - vh) /
              (NAV_MORPH_VH_IDLE - NAV_MORPH_VH_FLOOR),
          ),
        );
      }

      // No hero shift needed: h-screen sections inside [data-sf-canvas]
      // resolve to 100vh/contentScale (see globals.css), so each section's
      // post-scale height equals the viewport height. Hero sits centered.
      // Transform itself is driven by CSS rule reading --sf-content-scale
      // (set pre-hydration by blocking script in layout.tsx to avoid CLS).
      // Below sm (pillarbox), contentScale=1 so outer height equals the
      // unscaled inner offsetHeight — native rendering.
      outer.style.height = `${inner.offsetHeight * contentScale}px`;

      const root = document.documentElement.style;
      root.setProperty("--sf-canvas-scale", String(chromeScale));
      root.setProperty("--sf-content-scale", String(contentScale));
      root.setProperty("--sf-nav-scale", String(navScale));
      root.setProperty("--sf-nav-morph", String(navMorph));
      root.setProperty("--sf-hero-shift", "0px");
      root.setProperty("--sf-frame-offset-x", "0px");
      root.setProperty("--sf-frame-bottom-gap", "0px");
      ScrollTrigger.refresh();
    };

    // Debounce via rAF — ResizeObserver can fire many times per frame during
    // content settles (fonts, images, GSAP animations).
    const schedule = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        applyScale();
      });
    };

    applyScale();

    const ro = new ResizeObserver(schedule);
    ro.observe(inner);
    window.addEventListener("resize", schedule);
    window.addEventListener("orientationchange", schedule);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("orientationchange", schedule);
    };
  }, []);

  return (
    <>
      <div
        ref={outerRef}
        // The sibling blocking script (inlined in app/layout.tsx body tail per
        // CRT-01, Phase 59) mutates outer.style.height at
        // HTML parse time — before React hydrates — to preserve CLS. React sees
        // the DOM height prop without a match in the SSR virtual tree and flags
        // a hydration mismatch. This is the canonical React escape hatch for
        // intentional pre-hydration DOM mutation (same pattern used by theme
        // scripts on <html>).
        suppressHydrationWarning
        style={{ position: "relative", width: "100%", overflow: "hidden" }}
      >
        <div
          ref={innerRef}
          data-sf-canvas=""
          style={{
            width: `${DESIGN_WIDTH}px`,
            transformOrigin: "top left",
            willChange: "transform",
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}
