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
      autoResize: true,
    });
    lenisRef.current = instance;
    setLenis(instance);
    (window as any).lenis = instance;

    // Keyboard-driven viewport detent scrolling
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      // Don't intercept if user is typing in an input or activating a button/link
      if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(target.tagName)) return;
      if (target.getAttribute('role') === 'button') return;
      
      const vh = window.innerHeight;
      const currentScroll = window.scrollY;
      
      if (e.code === 'Space' || e.code === 'ArrowDown' || e.code === 'PageDown') {
        e.preventDefault();
        const nextTarget = Math.ceil((currentScroll + 10) / vh) * vh;
        console.log('Scrolling to:', nextTarget);
        instance.scrollTo(nextTarget, { duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      } else if (e.code === 'ArrowUp' || e.code === 'PageUp') {
        e.preventDefault();
        const prevTarget = Math.floor((currentScroll - 10) / vh) * vh;
        instance.scrollTo(Math.max(0, prevTarget), { duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      }
    };
    window.addEventListener('keydown', handleKeyDown, { passive: false });

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
      window.removeEventListener('keydown', handleKeyDown);
      mql.removeEventListener("change", motionHandler);
      gsap.ticker.remove(tickerCallback);
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
