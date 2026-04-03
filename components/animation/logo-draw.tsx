"use client";

import { useRef, useEffect } from "react";

/**
 * DrawSVG logo animation — SFUX logo paths draw themselves on mount,
 * then fill fades in. Used as loading state and route transition branding.
 */
export function LogoDraw({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (animatedRef.current) return;
    animatedRef.current = true;

    const svg = svgRef.current;
    if (!svg) return;

    const paths = svg.querySelectorAll<SVGPathElement>(".logo-stroke");
    const fills = svg.querySelectorAll<SVGElement>(".logo-fill");

    // Set initial state — strokes hidden, fills transparent
    paths.forEach((path) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
    });
    fills.forEach((el) => {
      el.style.opacity = "0";
    });

    // Animate stroke draw
    const drawDuration = 1200;
    const startTime = performance.now();

    function animateStroke(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / drawDuration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);

      paths.forEach((path) => {
        const length = path.getTotalLength();
        path.style.strokeDashoffset = `${length * (1 - eased)}`;
      });

      if (progress < 1) {
        requestAnimationFrame(animateStroke);
      } else {
        // Fill fade in after stroke completes
        fills.forEach((el) => {
          el.style.transition = "opacity 0.3s ease";
          el.style.opacity = "1";
        });
        // Fade out strokes
        paths.forEach((path) => {
          path.style.transition = "opacity 0.4s ease 0.1s";
          path.style.opacity = "0.3";
        });
      }
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Skip animation — show final state
      paths.forEach((p) => { p.style.strokeDashoffset = "0"; });
      fills.forEach((el) => { el.style.opacity = "1"; });
    } else {
      requestAnimationFrame(animateStroke);
    }
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 200 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="SignalframeUX loading"
      role="img"
    >
      {/* S */}
      <path className="logo-stroke" d="M8 36C8 36 12 40 22 40C32 40 36 34 36 30C36 22 22 22 22 18C22 14 28 10 34 14" stroke="currentColor" strokeWidth="3" strokeLinecap="square" fill="none" />
      <text className="logo-fill" x="8" y="38" fill="currentColor" fontFamily="var(--font-display)" fontSize="36" fontWeight="400">S</text>

      {/* F */}
      <path className="logo-stroke" d="M44 40V12H66M44 26H60" stroke="currentColor" strokeWidth="3" strokeLinecap="square" fill="none" />
      <text className="logo-fill" x="44" y="38" fill="currentColor" fontFamily="var(--font-display)" fontSize="36" fontWeight="400">F</text>

      {/* // separator */}
      <path className="logo-stroke" d="M78 40L88 8M92 40L102 8" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="square" fill="none" />

      {/* U */}
      <path className="logo-stroke" d="M112 12V32C112 36 116 40 124 40C132 40 136 36 136 32V12" stroke="currentColor" strokeWidth="3" strokeLinecap="square" fill="none" />
      <text className="logo-fill" x="110" y="38" fill="currentColor" fontFamily="var(--font-display)" fontSize="36" fontWeight="400">U</text>

      {/* X */}
      <path className="logo-stroke" d="M148 12L172 40M172 12L148 40" stroke="currentColor" strokeWidth="3" strokeLinecap="square" fill="none" />
      <text className="logo-fill" x="146" y="38" fill="currentColor" fontFamily="var(--font-display)" fontSize="36" fontWeight="400">X</text>
    </svg>
  );
}
