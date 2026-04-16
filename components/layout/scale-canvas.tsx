"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/gsap-core";

const DESIGN_WIDTH = 1280;

/**
 * ScaleCanvas — locks content to a 1280px design canvas, then uniformly
 * scales the entire tree by window.innerWidth / 1280 so every element
 * keeps its 1280x800-reference proportions at any viewport size.
 *
 * Outer div sits in document flow; its height is kept in sync with the
 * scaled content so native scroll (and Lenis / GSAP ScrollTrigger) work.
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
      // offsetHeight is the pre-transform layout height of the 1280-wide canvas.
      outer.style.height = `${inner.offsetHeight * scale}px`;
      document.documentElement.style.setProperty("--sf-canvas-scale", String(scale));
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
