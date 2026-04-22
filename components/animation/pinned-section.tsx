"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { gsap, ScrollTrigger } from "@/lib/gsap-core";

interface PinnedSectionProps {
  children: ReactNode;
  className?: string;
  /** Total scroll distance in viewport heights (e.g., 2 = calc(200*var(--sf-vh)), 3 = calc(300*var(--sf-vh))) */
  scrollDistance: number;
  id?: string;
}

/**
 * PinnedSection — viewport-pinned scroll wrapper.
 *
 * Holds `children` at viewport top while the user scrolls through
 * `scrollDistance` viewport heights. Consumed by Phase 31 (THESIS manifesto)
 * and Phase 32 (SIGNAL section).
 *
 * Implementation: portal-based "virtual pin". Children render into a
 * `position: fixed` portal at viewport top (body-level, outside ScaleCanvas).
 * A fixed-height spacer in main flow provides the scroll footprint. A
 * ScrollTrigger scrubs the portal's opacity: hidden outside the scroll
 * window, visible inside. No GSAP `pin:` is involved — the portal is always
 * viewport-anchored, and opacity is the on/off switch.
 *
 * Why not GSAP pin: ScaleCanvas applies `transform: scale()` to `<main>`.
 * The CSS containing-block rule makes `position: fixed` (GSAP's default pin
 * strategy) hijacked by the transform — the pinned element sticks to the
 * transformed ancestor, not the viewport. `position: sticky` has the same
 * issue. `pinType:"transform"` sidesteps containing-block but compounds
 * scale values and can't anchor to viewport from an off-screen portal
 * origin. Portaling out of the transformed subtree and relying on an
 * always-fixed wrapper is the only strategy that survives.
 *
 * Consumers attach their own scrub ScrollTriggers to the spacer (exposed
 * via `forwardedRef`) for per-statement timeline animation across the pin
 * window. The spacer sits at the exact document-y where pinning should
 * start, with `scrollDistance * vh` of pin range.
 */
export const PinnedSection = forwardRef<HTMLDivElement, PinnedSectionProps>(
  function PinnedSection(
    { children, className, scrollDistance, id },
    forwardedRef,
  ) {
    const spacerRef = useRef<HTMLDivElement>(null);
    const portalContentRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);

    useImperativeHandle(
      forwardedRef,
      () => spacerRef.current as HTMLDivElement,
      [],
    );

    useEffect(() => {
      setMounted(true);
      setReducedMotion(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      );
    }, []);

    useEffect(() => {
      const spacer = spacerRef.current;
      const content = portalContentRef.current;
      if (!spacer || !content || !mounted || reducedMotion) return;

      const ctx = gsap.context(() => {
        // Opacity-based "virtual pin": portal lives at viewport top always
        // (position: fixed). Show it while the spacer is inside the scroll
        // window, hide it outside. A short fade (0.08 of the pin window on
        // each end) prevents a hard pop-in.
        const tl = gsap.timeline({ paused: true });
        tl.set(content, { autoAlpha: 0 });
        tl.to(content, { autoAlpha: 1, duration: 0.08 }, 0);
        tl.to(content, { autoAlpha: 1, duration: 0.84 }, 0.08);
        tl.to(content, { autoAlpha: 0, duration: 0.08 }, 0.92);

        ScrollTrigger.create({
          trigger: spacer,
          start: "top top",
          end: () => `+=${scrollDistance * window.innerHeight}`,
          scrub: 0.15,
          animation: tl,
          invalidateOnRefresh: true,
        });
      });

      return () => ctx.revert();
    }, [scrollDistance, mounted, reducedMotion]);

    // Reduced-motion branch: render inline, no portal, no animation.
    if (reducedMotion) {
      return (
        <div
          id={id}
          className={className}
          style={{ height: "var(--sf-canvas-h, calc(100*var(--sf-vh)))" }}
        >
          {children}
        </div>
      );
    }

    // Fixed portal target, created lazily on first mount and reused if another
    // PinnedSection ever mounts. Keyed by id so multiple pinned sections don't
    // collide. `pointer-events:none` so the portal never steals clicks from
    // underlying chrome; children can re-enable pointer-events where needed.
    const portalTarget = typeof document !== "undefined" ? document.body : null;

    const portalContent = (
      <div
        ref={portalContentRef}
        data-pinned-portal={id || "pinned"}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          opacity: 0,
          visibility: "hidden",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          id={id}
          className={className}
          style={{
            width: "100%",
            height: "var(--sf-canvas-h, calc(100*var(--sf-vh)))",
            pointerEvents: "auto",
          }}
        >
          {children}
        </div>
      </div>
    );

    return (
      <>
        {/* Spacer holds the scroll footprint of the pin window in main flow.
            Scroll range: scrollDistance * vh — matches the ScrollTrigger's
            start (top top) and end (+= distance * vh). */}
        <div
          ref={spacerRef}
          aria-hidden="true"
          style={{
            height: `calc(${scrollDistance} * var(--sf-canvas-h, 100vh))`,
          }}
        />
        {mounted && portalTarget
          ? createPortal(portalContent, portalTarget)
          : null}
      </>
    );
  },
);

PinnedSection.displayName = "PinnedSection";
