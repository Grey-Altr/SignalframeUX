"use client";

import { useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

/**
 * Page transition wipe — black panel slides across viewport on route change.
 * Wipe IN: left → right (covers), content swaps, Wipe OUT: left → right (reveals).
 * Uses CSS transforms for GPU compositing. No GSAP dependency.
 */
export function PageTransition() {
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);
  const wipeRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);

  const runWipe = useCallback(() => {
    const wipe = wipeRef.current;
    if (!wipe || isAnimatingRef.current) return;

    // Skip on reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    isAnimatingRef.current = true;

    // Phase 1: Wipe IN (cover screen)
    wipe.style.transition = "none";
    wipe.style.transform = "scaleX(0)";
    wipe.style.transformOrigin = "left";
    wipe.style.display = "block";

    // Force reflow
    void wipe.offsetHeight;

    wipe.style.transition = "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
    wipe.style.transform = "scaleX(1)";

    // Phase 2: Wipe OUT (reveal new content)
    const handleCover = () => {
      wipe.removeEventListener("transitionend", handleCover);

      // Scroll to top while covered
      window.scrollTo(0, 0);

      // Switch origin and wipe out
      wipe.style.transition = "none";
      wipe.style.transformOrigin = "right";
      void wipe.offsetHeight;

      wipe.style.transition = "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
      wipe.style.transform = "scaleX(0)";

      const handleReveal = () => {
        wipe.removeEventListener("transitionend", handleReveal);
        wipe.style.display = "none";
        isAnimatingRef.current = false;
      };
      wipe.addEventListener("transitionend", handleReveal, { once: true });
    };
    wipe.addEventListener("transitionend", handleCover, { once: true });
  }, []);

  useEffect(() => {
    if (pathname !== prevPathRef.current) {
      prevPathRef.current = pathname;
      runWipe();
    }
  }, [pathname, runWipe]);

  return (
    <div
      ref={wipeRef}
      className="sf-page-wipe"
      style={{ display: "none" }}
      aria-hidden="true"
    />
  );
}
