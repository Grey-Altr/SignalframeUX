"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/gsap-core";

const DESIGN_WIDTH = 1280;
const DESIGN_HEIGHT = 800;

/** Below this viewport width OR height, the nav morphs from vertical column to horizontal row. */
const NAV_HORIZONTAL_MIN_VW = 768;
const NAV_HORIZONTAL_MIN_VH = 600;
/** Approx width the horizontal nav occupies at --sf-nav-scale=1 (7*32 cubes + 6*4 gaps + 2*24 padding). */
const NAV_HORIZONTAL_EXTENT_PX = 320;

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

      // Nav layout: vertical column until viewport is constrained on either
      // axis; then the column morphs to a horizontal row at bottom-left.
      const navHorizontal = vw < NAV_HORIZONTAL_MIN_VW || vh < NAV_HORIZONTAL_MIN_VH;
      // Nav scale stays at 1 while vertical. Once horizontal, shrinks only if
      // the row doesn't fit the viewport width — "after all boxes are in
      // horizontal orientation, THEN start scaling."
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
