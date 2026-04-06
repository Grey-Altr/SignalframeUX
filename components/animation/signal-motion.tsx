"use client";

/**
 * SignalMotion — Scrub-capable scroll-driven animation wrapper.
 *
 * Distinct from ScrollReveal (one-shot entrance animation) in three ways:
 * 1. Scrubs with scroll POSITION — animation is tied to scroll progress, not a single entry event
 * 2. Uses gsap.fromTo — explicit start + end state (ScrollReveal uses gsap.from)
 * 3. Animation reverses when scrolling back up (scrub behavior)
 *
 * Usage: wrap any element to animate it between `from` and `to` states as
 * the user scrolls through the defined trigger window.
 *
 * @module components/animation/signal-motion
 */

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap-core";
import { cn } from "@/lib/utils";

interface SignalMotionProps {
  children: React.ReactNode;
  className?: string;
  /** GSAP TweenVars for the start state. Default: { opacity: 0.3, y: 20 } */
  from?: gsap.TweenVars;
  /** GSAP TweenVars for the end state. Default: { opacity: 1, y: 0 } */
  to?: gsap.TweenVars;
  /**
   * Scrub value passed to ScrollTrigger.
   * - true → instantly follows scroll
   * - number → catchup duration in seconds (e.g. 1 = 1s lag for smoothness)
   * Default: 1
   */
  scrub?: boolean | number;
  /** ScrollTrigger start position. Default: "top 80%" */
  start?: string;
  /** ScrollTrigger end position. Default: "top 30%" */
  end?: string;
  /** Show ScrollTrigger debug markers (development only) */
  markers?: boolean;
}

/**
 * Wraps children with a scrub-capable GSAP ScrollTrigger animation.
 *
 * The animation interpolates between `from` and `to` states based on scroll
 * position within the `start`/`end` window. Unlike ScrollReveal, this
 * reverses when the user scrolls back up.
 *
 * Respects prefers-reduced-motion: children render at `to` state immediately
 * with no animation when reduced motion is active.
 *
 * @example
 * <SignalMotion from={{ opacity: 0, x: -40 }} to={{ opacity: 1, x: 0 }} scrub={1.5}>
 *   <SFCard>...</SFCard>
 * </SignalMotion>
 */
export function SignalMotion({
  children,
  className,
  from = { opacity: 0.3, y: 20 },
  to = { opacity: 1, y: 0 },
  scrub = 1,
  start = "top 80%",
  end = "top 30%",
  markers = false,
}: SignalMotionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      const inner = innerRef.current;
      if (!container || !inner) return;

      // Reduced-motion guard: render at `to` state immediately, no animation
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(inner, to);
        return;
      }

      gsap.fromTo(inner, from, {
        ...to,
        scrollTrigger: {
          trigger: container,
          start,
          end,
          scrub,
          markers,
        } as ScrollTrigger.Vars,
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={cn(className)}>
      <div ref={innerRef}>{children}</div>
    </div>
  );
}
