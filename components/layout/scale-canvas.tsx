"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/gsap-core";

const DESIGN_WIDTH = 1280;
const DESIGN_HEIGHT = 800;

/** Width below which the nav always morphs to horizontal — row doesn't fit vertically on mobile. */
const NAV_HORIZONTAL_MIN_VW = 768;
/** Approx width the horizontal nav occupies at --sf-nav-scale=1 (7*32 cubes + 6*4 gaps + 2*24 padding). */
const NAV_HORIZONTAL_EXTENT_PX = 320;

/* ────────────────────────────────────────────────────────────
   Nav morph is scrubbed independently along two axes:
   - Width: cascade progresses as vw grows from _VW_START → _VW_END.
   - Height: cascade progresses as vh shrinks from _VH_IDLE → _VH_FLOOR.
   The published progress is max(vwProgress, vhProgress) — either
   dimension can drive the cascade, so users with tall windows still
   see cubes animate when they drag horizontally, and users who shrink
   height still see the row collapse. At vh ≤ _VH_FLOOR the cascade is
   fully morphed; above _VH_IDLE height contributes nothing and the
   cascade is width-driven only.
   ──────────────────────────────────────────────────────────── */
/** Width at which the width-driven scrub begins (morph=0 at or below). */
const NAV_MORPH_VW_START = 1050;
/** Width at which the width-driven scrub completes (morph=1 at or above). */
const NAV_MORPH_VW_END = 1900;
/** Height at or above which height does not contribute to morph. */
const NAV_MORPH_VH_IDLE = 900;
/** Height at or below which height fully forces morph to 1 (nav cannot
 *  reasonably sit as a vertical column in this much vertical space). */
const NAV_MORPH_VH_FLOOR = 435;

/**
 * ScaleCanvas — scales content by window.innerWidth / 1280 so the page fills
 * the viewport width (no pillarbox). Content taller than the scaled design
 * height scrolls naturally.
 *
 * Publishes a separate chrome scale as --sf-canvas-scale: min(vw/1280, vh/800).
 * This responds to both dimensions on resize, so HUD / corner buttons shrink
 * when either axis shrinks.
 *
 * The nav gets its own --sf-nav-scale that stays at 1 while the nav is still
 * in its vertical column layout. Only after viewport crosses the horizontal
 * threshold (body[data-nav-layout="horizontal"]) does nav-scale start
 * shrinking. This preserves the user's mental model: first rearrange the nav
 * from column to row, then resize. --sf-frame-offset-x and --sf-frame-bottom-gap
 * are pinned to 0 under this mode; the contract is preserved so a future
 * aspect-locked mode could swap in non-zero offsets without changing consumers.
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
      // Content scale: width-only — keeps the page filling the viewport
      // horizontally so there is never a pillarbox.
      const contentScale = vw / DESIGN_WIDTH;
      // Chrome scale: min of width/height ratios — responds to *either*
      // dimension shrinking so HUD/corner buttons get smaller when the
      // window gets shorter OR narrower.
      const chromeScale = Math.min(contentScale, vh / DESIGN_HEIGHT);

      // Nav morph: scrubbed along vw and vh independently; take the max so
      // either axis can drive the cascade. Mobile width (vw<768) forces
      // full horizontal regardless. Above vh=900 height contributes nothing
      // and the cascade is width-driven; below vh=435 height forces full
      // horizontal (nav can't reasonably fit as a vertical column in that
      // little vertical space).
      const vwProgress = Math.max(
        0,
        Math.min(
          1,
          (vw - NAV_MORPH_VW_START) /
            (NAV_MORPH_VW_END - NAV_MORPH_VW_START),
        ),
      );
      const vhProgress = Math.max(
        0,
        Math.min(
          1,
          (NAV_MORPH_VH_IDLE - vh) /
            (NAV_MORPH_VH_IDLE - NAV_MORPH_VH_FLOOR),
        ),
      );
      const navMorph =
        vw < NAV_HORIZONTAL_MIN_VW ? 1 : Math.max(vwProgress, vhProgress);
      // Fully morphed = horizontal; partial progress still classifies as
      // vertical so --sf-nav-scale stays at 1 until the cascade completes.
      const navHorizontal = navMorph >= 1;
      // Nav scale stays at 1 until the cascade fully lands. Once horizontal,
      // shrinks only if the row doesn't fit the viewport width.
      const navScale = navHorizontal
        ? Math.min(1, vw / NAV_HORIZONTAL_EXTENT_PX)
        : 1;

      // No hero shift needed: h-screen sections inside [data-sf-canvas]
      // resolve to 100vh/contentScale (see globals.css), so each section's
      // post-scale height equals the viewport height. Hero sits centered.
      inner.style.transform = `scale(${contentScale})`;
      outer.style.height = `${inner.offsetHeight * contentScale}px`;

      const root = document.documentElement.style;
      root.setProperty("--sf-canvas-scale", String(chromeScale));
      root.setProperty("--sf-content-scale", String(contentScale));
      root.setProperty("--sf-nav-scale", String(navScale));
      root.setProperty("--sf-nav-morph", String(navMorph));
      root.setProperty("--sf-hero-shift", "0px");
      root.setProperty("--sf-frame-offset-x", "0px");
      root.setProperty("--sf-frame-bottom-gap", "0px");
      document.body.setAttribute(
        "data-nav-layout",
        navHorizontal ? "horizontal" : "vertical",
      );
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
    <div
      ref={outerRef}
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
  );
}
