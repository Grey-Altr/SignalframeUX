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
   Nav morph is scrubbed by viewport height:
   - vh ≥ _VH_IDLE: morph=0, full vertical column.
   - vh ≤ _VH_FLOOR: morph=1, full horizontal row.
   - between: linear scrub — as vh decreases, cubes peel off the
     column into the row one by one in forward cascade order (cube 6,
     then 5, 4, 3, 2, 1, glyph). As vh increases they stack back into
     the column in reverse order (glyph first, cube 6 last — "first
     in, last out"). Width does not contribute; at any vw the nav is
     driven by vh alone. Mobile (vw<768) still forces morph=1 since
     the nav must collapse regardless of height in that case.
   ──────────────────────────────────────────────────────────── */
/** Height at or above which the nav is fully vertical column (morph=0). */
const NAV_MORPH_VH_IDLE = 900;
/** Height at or below which the nav is fully horizontal row (morph=1).
 *  The nav cannot reasonably sit as a vertical column in less vertical
 *  space than this — hero + nav together would overflow. */
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

      // Nav morph: scrubbed by vh alone. As vh decreases past IDLE the
      // column peels out into the row one cube at a time; as vh increases
      // cubes stack back into the column (glyph first, cube 6 last).
      // Mobile width (vw<768) overrides to force full horizontal since the
      // column orientation can't sit in a narrow viewport regardless of vh.
      const vhProgress = Math.max(
        0,
        Math.min(
          1,
          (NAV_MORPH_VH_IDLE - vh) /
            (NAV_MORPH_VH_IDLE - NAV_MORPH_VH_FLOOR),
        ),
      );
      const navMorph = vw < NAV_HORIZONTAL_MIN_VW ? 1 : vhProgress;
      // Conveyor-belt cascade: 6 slices (one per peel of cubes 6→1). Each
      // slice has a peel-half (cube slides right) followed by a shift-half
      // (remaining column drops one pitch so the next cube lands at the
      // bottom row slot). Row cubes also slide left during each subsequent
      // peel-half so the row packs tight from the left — cube 6 ends up
      // at X=0 (leftmost), cube 1 at X=5·pitch (rightmost). phaseIdx picks
      // the slice; phaseLocal is 0..1 within the slice. CSS reads these
      // to derive per-cube transforms.
      const phaseIdxRaw = navMorph * 6;
      const navPhaseIdx = Math.min(5, Math.max(0, Math.floor(phaseIdxRaw)));
      const navPhaseLocal = Math.max(
        0,
        Math.min(1, phaseIdxRaw - navPhaseIdx),
      );
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
      root.setProperty("--sf-nav-phase-idx", String(navPhaseIdx));
      root.setProperty("--sf-nav-phase-local", String(navPhaseLocal));
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
