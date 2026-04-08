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

    // Skip smooth scroll if user prefers reduced motion
    if (mql.matches) return;

    const instance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      autoResize: false,
    });
    lenisRef.current = instance;
    setLenis(instance);

    // Sync Lenis scroll position with GSAP ScrollTrigger
    instance.on("scroll", ScrollTrigger.update);
    const tickerCallback = (time: number) => {
      instance.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Destroy Lenis if user enables reduced motion at runtime
    const motionHandler = (e: MediaQueryListEvent) => {
      if (e.matches) {
        gsap.ticker.remove(tickerCallback);
        instance.destroy();
        lenisRef.current = null;
        setLenis(null);
      }
    };
    mql.addEventListener("change", motionHandler);

    return () => {
      mql.removeEventListener("change", motionHandler);
      gsap.ticker.remove(tickerCallback);
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
