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
   Hero-to-nav proportional distance (measured at design 1280×800):
   - Vertical nav container: 332px total height (incl. 24px top padding).
   - First visible nav cube top = viewport_bottom − 332 + 24 = 492 at vh=800.
   - h1 bounding box: 217px tall at contentScale=1.
   - Hero is flex-centered with subtitle below — title sits ~27px above
     the viewport's vertical midpoint so the title+subtitle pair centers.
   - Design gap between h1 bottom and first cube top = 10px at baseline.
   Rule: morph when actualGap < (designGap × contentScale). As content
   scales, the proportional gap shrinks, but the unscaled nav eats more
   of the viewport bottom — once that mismatch breaks proportion, flip
   the nav to horizontal so the bottom-left footprint collapses.
   ──────────────────────────────────────────────────────────── */
const NAV_VERTICAL_HEIGHT_PX = 332;
const NAV_TOP_PADDING_PX = 24;
const HERO_HALF_DESIGN_H_PX = 109;
const HERO_SUBTITLE_OFFSET_PX = 27;
const DESIGN_HERO_NAV_GAP_PX = 10;
/** Delta range (px) over which --sf-nav-morph scrubs 0→1. Tuned so the full
 *  cascade plays across a comfortable viewport-drag distance at vh≈810
 *  (~vw 1350→1920). Larger = slower / more scrubbable. */
const NAV_MORPH_RANGE_PX = 40;

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

      // Nav layout: scrubbed by viewport. Compute the delta between the
      // proportional hero/nav gap and the actual one — when the nav starts
      // encroaching on hero space, morph progress ramps 0→1 over the next
      // NAV_MORPH_RANGE_PX of encroachment. Mobile (vw<768) forces full
      // horizontal. Each cube peels off the column in sequence, driven by
      // its own slice of this 0→1 progress (see globals.css).
      const heroTitleBottom =
        vh / 2 - HERO_SUBTITLE_OFFSET_PX * contentScale +
        HERO_HALF_DESIGN_H_PX * contentScale;
      const navFirstCubeTop = vh - NAV_VERTICAL_HEIGHT_PX + NAV_TOP_PADDING_PX;
      const actualHeroNavGap = navFirstCubeTop - heroTitleBottom;
      const proportionalHeroNavGap = DESIGN_HERO_NAV_GAP_PX * contentScale;
      const encroachment = proportionalHeroNavGap - actualHeroNavGap;
      const rawProgress = Math.max(
        0,
        Math.min(1, encroachment / NAV_MORPH_RANGE_PX),
      );
      const navMorph = vw < NAV_HORIZONTAL_MIN_VW ? 1 : rawProgress;
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
