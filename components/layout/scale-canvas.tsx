"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/gsap-core";

const DESIGN_WIDTH = 1280;
const DESIGN_HEIGHT = 800;

/**
 * ScaleCanvas — aspect-locks content to a 1280x800 design frame. Computes
 * scale = min(vw/1280, vh/800) so the full frame always fits inside the
 * window (pillarbox on wide aspect ratios, letterbox on tall ones). The
 * scaled frame is horizontally centered; content below 800 design units
 * scrolls naturally.
 *
 * Publishes --sf-canvas-scale, --sf-frame-offset-x, --sf-frame-bottom-gap
 * so fixed chrome (nav, HUD) can anchor to the design frame edges instead
 * of the raw window corners.
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
      const scale = Math.min(vw / DESIGN_WIDTH, vh / DESIGN_HEIGHT);
      const renderedFrameWidth = DESIGN_WIDTH * scale;
      const renderedFrameHeight = DESIGN_HEIGHT * scale;
      const offsetX = Math.max(0, (vw - renderedFrameWidth) / 2);
      const bottomGap = Math.max(0, vh - renderedFrameHeight);

      inner.style.transform = `translateX(${offsetX}px) scale(${scale})`;
      outer.style.height = `${inner.offsetHeight * scale}px`;

      const root = document.documentElement.style;
      root.setProperty("--sf-canvas-scale", String(scale));
      root.setProperty("--sf-frame-offset-x", `${offsetX}px`);
      root.setProperty("--sf-frame-bottom-gap", `${bottomGap}px`);
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
