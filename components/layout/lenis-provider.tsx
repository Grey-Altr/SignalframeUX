"use client";

import { useEffect, useRef, useState, createContext, useContext } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap-core";

const LenisContext = createContext<Lenis | null>(null);

export function useLenisInstance(): Lenis | null {
  return useContext(LenisContext);
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Skip smooth scroll if user prefers reduced motion.
    // This guard MUST remain synchronous (NOT inside the rIC scope)
    // so users with reduced-motion preference never schedule any work.
    if (mql.matches) return;

    let instance: Lenis | null = null;
    let tickerCallback: ((time: number) => void) | null = null;

    // CRT-04 (Phase 59 Plan C): Defer Lenis init to idle time (or 100ms
    // timeout) to free the critical-path render budget. PF-04 contract
    // preserved verbatim per feedback_pf04_autoresize_contract.md
    // (commits 2b2acb3 + 73311e0).
    // Single-ticker rule preserved: gsap.ticker remains the sole rAF source.
    //
    // Keyboard-driven panel snap (Space/Shift+Space/Home/End) now lives in
    // useFrameNavigation (R-64 keyboard model). LenisProvider only owns wheel
    // + touch smooth-scroll. FrameNavigation mount is in app/layout.tsx.
    const initLenis = () => {
      instance = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 2,
        autoResize: true, // PF-04 contract — DO NOT REMOVE (feedback_pf04_autoresize_contract.md)
      });
      lenisRef.current = instance;
      setLenis(instance);
      (window as any).lenis = instance;

      // Sync Lenis scroll position with GSAP ScrollTrigger
      instance.on("scroll", ScrollTrigger.update);
      tickerCallback = (time: number) => {
        if (instance) instance.raf(time * 1000);
      };
      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);
    };

    // Schedule: rIC if available (Chrome/FF; Safari 17+ behind flag),
    // else setTimeout(0) — both yield to the next idle/macrotask.
    // The 100ms timeout cap ensures init never starves under heavy
    // main-thread contention; deep-anchor scroll-restore still
    // resolves within ≤ 2 frames after that ceiling because consumers
    // (useLenisInstance()) already handle the null window.
    type IdleCb = (cb: IdleRequestCallback, opts?: { timeout: number }) => number;
    const ric = (window as Window & { requestIdleCallback?: IdleCb })
      .requestIdleCallback;
    const handle = ric
      ? ric(initLenis, { timeout: 100 })
      : (setTimeout(initLenis, 0) as unknown as number);

    // Destroy Lenis if user enables reduced motion at runtime.
    // motionHandler may fire before initLenis resolves (rIC pending);
    // guard with `if (instance)` so we don't try to destroy a null instance.
    const motionHandler = (e: MediaQueryListEvent) => {
      if (e.matches) {
        if (tickerCallback) gsap.ticker.remove(tickerCallback);
        if (instance) instance.destroy();
        lenisRef.current = null;
        setLenis(null);
      }
    };
    mql.addEventListener("change", motionHandler);

    return () => {
      // Cancel the pending rIC/setTimeout handle if init has not fired yet.
      // This prevents handle leaks on fast unmounts (e.g. route transitions).
      const cancelRic = (
        window as Window & { cancelIdleCallback?: (h: number) => void }
      ).cancelIdleCallback;
      if (cancelRic) cancelRic(handle);
      else clearTimeout(handle);

      mql.removeEventListener("change", motionHandler);
      if (tickerCallback) gsap.ticker.remove(tickerCallback);
      if (instance) instance.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
