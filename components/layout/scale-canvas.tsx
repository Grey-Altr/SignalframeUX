"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/gsap-core";

const DESIGN_WIDTH = 1280;
const DESIGN_HEIGHT = 800;

/**
 * ScaleCanvas — scales content by window.innerWidth / 1280 so the page fills
 * the viewport width (no pillarbox). Content taller than the scaled design
 * height scrolls naturally.
 *
 * Publishes a separate chrome scale as --sf-canvas-scale: min(vw/1280, vh/800).
 * This responds to both dimensions on resize, so nav / HUD / corner buttons
 * shrink when either axis shrinks — matching the user's mental model of
 * "chrome scales on any resize" while still keeping the page itself
 * viewport-filling. --sf-frame-offset-x and --sf-frame-bottom-gap are pinned
 * to 0 under this mode; the contract is preserved so a future aspect-locked
 * mode could swap in non-zero offsets without changing consumers.
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
      // Content scale: width-only — keeps the page filling the viewport
      // horizontally so there is never a pillarbox.
      const contentScale = window.innerWidth / DESIGN_WIDTH;
      // Chrome scale: min of width/height ratios — responds to *either*
      // dimension shrinking so nav/HUD/corner buttons get smaller when the
      // window gets shorter OR narrower.
      const chromeScale = Math.min(
        contentScale,
        window.innerHeight / DESIGN_HEIGHT,
      );
      // Hero shift: when the viewport is too short to show the full
      // 800-design-unit hero, slide the content up by the full height
      // deficit so the hero's bottom edge meets the viewport bottom
      // (instead of overflowing off-screen). This keeps 1280x800
      // proportions intact while fully clearing the bottom-left nav
      // from the title.
      const heroRealHeight = DESIGN_HEIGHT * contentScale;
      const heroShift = Math.max(
        0,
        heroRealHeight - window.innerHeight,
      );

      inner.style.transform = `translateY(${-heroShift}px) scale(${contentScale})`;
      outer.style.height = `${inner.offsetHeight * contentScale - heroShift}px`;

      const root = document.documentElement.style;
      root.setProperty("--sf-canvas-scale", String(chromeScale));
      root.setProperty("--sf-content-scale", String(contentScale));
      root.setProperty("--sf-hero-shift", `${heroShift}px`);
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
