"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type ReactNode,
} from "react";
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
 * Exposes its root container via `React.forwardRef` so consumers can
 * use it as the `pinnedContainer` for nested ScrollTriggers that need
 * to scrub their own timelines inside the pinned span.
 *
 * - Reduced-motion: section renders statically, no ScrollTrigger created.
 * - Cleanup: gsap.context().revert() destroys all created ScrollTriggers.
 * - Root div has no overflow:hidden — GSAP pin switches to position:fixed,
 *   clipping parents break the pin geometry.
 *
 * @example
 * ```tsx
 * const pinnedRef = useRef<HTMLDivElement>(null);
 * <PinnedSection ref={pinnedRef} scrollDistance={2.5} id="thesis">
 *   <ManifestoContent />
 * </PinnedSection>
 * ```
 */
export const PinnedSection = forwardRef<HTMLDivElement, PinnedSectionProps>(
  function PinnedSection(
    { children, className, scrollDistance, id },
    forwardedRef,
  ) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Expose the internal container DOM node via the forwarded ref so nested
    // ScrollTriggers can use it as their `pinnedContainer`. Internal ref stays
    // the source of truth for our own effect.
    useImperativeHandle(
      forwardedRef,
      () => containerRef.current as HTMLDivElement,
      [],
    );

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
        style={{ height: "var(--sf-canvas-h, 100vh)" }}
      >
        {children}
      </div>
    );
  },
);

PinnedSection.displayName = "PinnedSection";
