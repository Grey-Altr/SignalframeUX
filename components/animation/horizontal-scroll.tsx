"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-core";

interface HorizontalScrollProps {
  children: ReactNode[];
  /** Label pinned at top during scroll */
  sectionLabel?: string;
  className?: string;
}

/**
 * Horizontal scroll section — converts vertical scroll into horizontal translation.
 * Container pins to viewport, inner panels slide left as user scrolls.
 * On mobile (< 768px), renders as standard vertical stack.
 */
export function HorizontalScroll({ children, sectionLabel, className }: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    // Skip on mobile — CSS handles vertical fallback
    if (window.innerWidth < 768) return;

    // Skip on reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const panelCount = inner.children.length;
    if (panelCount <= 1) return;

    const ctx = gsap.context(() => {
      gsap.to(inner, {
        x: () => -(inner.scrollWidth - container.offsetWidth),
        ease: "power2.out",
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1,
          end: () => `+=${inner.scrollWidth - container.offsetWidth}`,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className ?? ""}`}>
      {/* Pinned label */}
      {sectionLabel && (
        <div className="absolute top-4 left-6 z-[var(--z-content)] font-mono text-[var(--text-xs)] uppercase tracking-[0.2em] text-muted-foreground font-bold pointer-events-none hidden md:block">
          {sectionLabel}
        </div>
      )}

      {/* Horizontal track — flex on desktop, stack on mobile */}
      <div
        ref={innerRef}
        className="flex flex-col md:flex-row md:flex-nowrap"
      >
        {children.map((child, i) => (
          <div
            key={i}
            className="w-full md:w-screen flex-shrink-0 border-b-2 md:border-b-0 md:border-r-2 border-foreground/20 last:border-0"
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
