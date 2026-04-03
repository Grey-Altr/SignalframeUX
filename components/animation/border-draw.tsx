"use client";

import { type ReactNode } from "react";

interface BorderDrawProps {
  children: ReactNode;
  /** Border color (default: magenta primary) */
  color?: string;
  /** Border weight in px (default 2) */
  weight?: number;
  /** Total draw duration in ms (default 400) */
  duration?: number;
  className?: string;
}

/**
 * Clockwise border-draw on hover.
 * Four edge spans scale from 0 to 1 in sequence: top → right → bottom → left.
 * Pure CSS — no JavaScript animation runtime needed.
 */
export function BorderDraw({
  children,
  color = "var(--color-primary)",
  weight = 2,
  duration = 400,
  className,
}: BorderDrawProps) {
  const step = duration / 4;
  const bg = color;

  return (
    <div className={`relative group ${className ?? ""}`}>
      {children}

      {/* Top edge — draws left to right */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 h-0 w-full origin-left scale-x-0 transition-transform group-hover:scale-x-100"
        style={{
          height: `${weight}px`,
          backgroundColor: bg,
          transitionDuration: `${step}ms`,
          transitionDelay: "0ms",
          transitionTimingFunction: "var(--ease-default)",
        }}
      />

      {/* Right edge — draws top to bottom */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 w-0 h-full origin-top scale-y-0 transition-transform group-hover:scale-y-100"
        style={{
          width: `${weight}px`,
          backgroundColor: bg,
          transitionDuration: `${step}ms`,
          transitionDelay: `${step}ms`,
          transitionTimingFunction: "var(--ease-default)",
        }}
      />

      {/* Bottom edge — draws right to left */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-0 w-full origin-right scale-x-0 transition-transform group-hover:scale-x-100"
        style={{
          height: `${weight}px`,
          backgroundColor: bg,
          transitionDuration: `${step}ms`,
          transitionDelay: `${step * 2}ms`,
          transitionTimingFunction: "var(--ease-default)",
        }}
      />

      {/* Left edge — draws bottom to top */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 w-0 h-full origin-bottom scale-y-0 transition-transform group-hover:scale-y-100"
        style={{
          width: `${weight}px`,
          backgroundColor: bg,
          transitionDuration: `${step}ms`,
          transitionDelay: `${step * 3}ms`,
          transitionTimingFunction: "var(--ease-default)",
        }}
      />
    </div>
  );
}
