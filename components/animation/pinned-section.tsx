"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-core";

interface PinnedSectionProps {
  children: ReactNode;
  className?: string;
  /** Total scroll distance in viewport heights (e.g., 2 = 200vh, 3 = 300vh) */
  scrollDistance: number;
  id?: string;
}

/**
 * PinnedSection — reusable pin/scrub scroll wrapper.
 *
 * Pins this section to the viewport while the user scrolls through
 * `scrollDistance` viewport heights of content. Consumed by Phase 31
 * (THESIS manifesto) and Phase 32 (SIGNAL section).
 *
 * - Reduced-motion: section renders statically, no ScrollTrigger created.
 * - Cleanup: gsap.context().revert() destroys all created ScrollTriggers.
 * - Root div has no overflow:hidden — GSAP pin switches to position:fixed,
 *   clipping parents break the pin geometry.
 *
 * @example
 * ```tsx
 * <PinnedSection scrollDistance={2} id="thesis">
 *   <ManifestoContent />
 * </PinnedSection>
 * ```
 */
export function PinnedSection({
  children,
  className,
  scrollDistance,
  id,
}: PinnedSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // prefers-reduced-motion: instant placement, no scroll-driven animation
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        start: "top top",
        end: () => `+=${scrollDistance * window.innerHeight}`,
        invalidateOnRefresh: true,
      });
    });

    return () => ctx.revert();
  }, [scrollDistance]);

  return (
    <div
      ref={containerRef}
      id={id}
      className={className}
      style={{ height: "100vh" }}
    >
      {children}
    </div>
  );
}
