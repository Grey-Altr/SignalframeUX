"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/gsap-core";

const DESIGN_WIDTH = 1280;

/**
 * ScaleCanvas — uniformly scales the entire tree by window.innerWidth / 1280
 * so every element keeps its design-pixel proportions at any viewport width.
 * The page itself fills the viewport width; only the content inside scales.
 * Content taller than the scaled design height scrolls naturally.
 *
 * Publishes --sf-canvas-scale, --sf-frame-offset-x (always 0), and
 * --sf-frame-bottom-gap (always 0) so fixed chrome (nav, HUD) resolves to
 * the real viewport corners under width-only scaling. The offset vars stay
 * in the contract so a future aspect-locked mode could reintroduce
 * pillarbox/letterbox without changing consumers.
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
      const scale = window.innerWidth / DESIGN_WIDTH;

      inner.style.transform = `scale(${scale})`;
      outer.style.height = `${inner.offsetHeight * scale}px`;

      const root = document.documentElement.style;
      root.setProperty("--sf-canvas-scale", String(scale));
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
