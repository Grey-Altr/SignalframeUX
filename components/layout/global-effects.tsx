"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "@/lib/gsap-core";
import { VHSOverlay } from "@/components/animation/vhs-overlay";
import { CanvasCursor } from "@/components/animation/canvas-cursor";

/** Magenta crosshair cursor with mix-blend-mode exclusion */
function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    // Only hide system cursor after mouse is detected (preserves keyboard user cursor)
    function enableCursor() {
      document.documentElement.classList.add("sf-has-mouse");
      document.removeEventListener("mousemove", enableCursor);
    }
    document.addEventListener("mousemove", enableCursor);

    function onMove(e: MouseEvent) {
      if (!cursor) return;
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }

    function onOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, [role='button'], input, select, textarea, [tabindex]");
      if (interactive) {
        cursor?.classList.add("active");
      } else {
        cursor?.classList.remove("active");
      }
    }

    function onClick() {
      if (!cursor) return;
      gsap.fromTo(
        cursor,
        { "--cursor-scale": 1 },
        {
          "--cursor-scale": 0.4,
          duration: 0.1,
          ease: "power2.in",
          yoyo: true,
          repeat: 1,
          repeatDelay: 0,
          overwrite: true,
        }
      );
    }

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mousedown", onClick);

    return () => {
      document.removeEventListener("mousemove", enableCursor);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mousedown", onClick);
      document.documentElement.classList.remove("sf-has-mouse");
    };
  }, []);

  return <div ref={cursorRef} className="sf-cursor" id="sf-cursor" />;
}

/** Scroll progress bar at the top of the viewport */
function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    function onScroll() {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        if (!barRef.current) return;
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? scrollTop / docHeight : 0;
        barRef.current.style.transform = `scaleX(${progress})`;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="fixed top-0 left-0 h-[2px] w-full bg-primary z-[var(--z-progress)] origin-left pointer-events-none"
      style={{ transform: "scaleX(0)" }}
    />
  );
}

/** Scroll-to-top button — appears after scrolling past 1 viewport */
function ScrollToTop() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);
  const visibleRef = useRef(false);

  useEffect(() => {
    let rafId = 0;
    function onScroll() {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const next = window.scrollY > window.innerHeight;
        if (next !== visibleRef.current) {
          visibleRef.current = next;
          setVisible(next);
        }
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <button
      ref={btnRef}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      onClick={() => {
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
      }}
      className="fixed bottom-20 right-6 z-[var(--z-scroll-top)] w-10 h-10 border-2 border-foreground bg-background text-foreground flex items-center justify-center text-[var(--text-md)] font-bold hover:bg-foreground hover:text-background transition-colors duration-200"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition:
          "opacity var(--duration-normal) var(--ease-default), transform var(--duration-normal) var(--ease-default), background-color var(--duration-fast) var(--ease-default), color var(--duration-fast) var(--ease-default)",
      }}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
}

/** VHS-style fixed badge in bottom-right corner */
function VHSBadge() {
  return (
    <div aria-hidden="true" className="fixed bottom-6 left-6 bg-foreground dark:bg-[var(--sf-dark-surface)] text-background dark:text-foreground px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] z-[var(--z-scroll-top)] hidden sm:flex items-center gap-1.5">
      <span className="text-primary text-[10px]">◉◉</span>
      SF//UX
    </div>
  );
}

/** Idle standby overlay — faint scanline drift after 60s of no interaction */
function IdleOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const IDLE_TIMEOUT = 60_000;

  const resetIdle = useCallback(() => {
    const el = overlayRef.current;
    if (!el) return;
    el.classList.remove("sf-idle-overlay--active");
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      el.classList.add("sf-idle-overlay--active");
    }, IDLE_TIMEOUT);
  }, []);

  useEffect(() => {
    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"] as const;
    events.forEach((e) => document.addEventListener(e, resetIdle, { passive: true }));
    resetIdle(); // start the timer

    return () => {
      events.forEach((e) => document.removeEventListener(e, resetIdle));
      clearTimeout(timerRef.current);
    };
  }, [resetIdle]);

  return <div ref={overlayRef} className="sf-idle-overlay" aria-hidden="true" />;
}

export function GlobalEffects() {
  return (
    <>
      <VHSOverlay />
      <CanvasCursor />
      <ScrollProgress />
      <ScrollToTop />
      <VHSBadge />
      <IdleOverlay />
    </>
  );
}
