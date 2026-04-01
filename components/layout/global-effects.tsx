"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap-plugins";
import { VHSOverlay } from "@/components/animation/vhs-overlay";

/** Magenta crosshair cursor with mix-blend-mode exclusion */
function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    let isActive = false;

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
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="sf-cursor" id="sf-cursor" />
      <style jsx global>{`
        body, body * { cursor: none !important; }
        @media (pointer: coarse) {
          body, body * { cursor: auto !important; }
          .sf-cursor { display: none !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sf-cursor { display: none !important; }
          body, body * { cursor: auto !important; }
        }
      `}</style>
      <style jsx>{`
        .sf-cursor {
          --cursor-scale: 1;
          position: fixed;
          top: -24px;
          left: -24px;
          width: 48px;
          height: 48px;
          pointer-events: none;
          z-index: 10000;
          mix-blend-mode: exclusion;
          transform: translate(0px, 0px);
          will-change: transform;
          transition: opacity 0.2s;
          opacity: 1;
        }
        .sf-cursor::before,
        .sf-cursor::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          background: linear-gradient(#FF0090 42%, transparent 42%, transparent 58%, #FF0090 58%);
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
                      background 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sf-cursor::before {
          width: 2px;
          height: 36px;
          transform: translate(-50%, -50%) scaleY(var(--cursor-scale));
        }
        .sf-cursor::after {
          width: 36px;
          height: 2px;
          transform: translate(-50%, -50%) scaleX(var(--cursor-scale));
        }
        .sf-cursor.active {
          opacity: 1;
        }
        .sf-cursor.active::before {
          transform: translate(-50%, -50%) rotate(45deg) scaleY(var(--cursor-scale));
        }
        .sf-cursor.active::after {
          transform: translate(-50%, -50%) rotate(45deg) scaleX(var(--cursor-scale));
        }
        .sf-cursor.active::before {
          background: linear-gradient(#FF0090 30%, transparent 30%, transparent 70%, #FF0090 70%);
        }
        .sf-cursor.active::after {
          background: linear-gradient(to right, #FF0090 30%, transparent 30%, transparent 70%, #FF0090 70%);
        }
      `}</style>
    </>
  );
}

/** Scroll progress bar at the top of the viewport */
function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onScroll() {
      if (!barRef.current) return;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      barRef.current.style.transform = `scaleX(${progress})`;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 h-[2px] w-full bg-primary z-[999] origin-left pointer-events-none"
      style={{ transform: "scaleX(0)" }}
    />
  );
}

/** VHS-style fixed badge in bottom-right corner */
function VHSBadge() {
  return (
    <div className="fixed bottom-6 right-6 bg-foreground dark:bg-[oklch(0.2_0_0)] text-background dark:text-foreground px-4 py-2 text-[clamp(8px,1vw,11px)] font-bold uppercase tracking-[0.1em] z-[200] flex items-center gap-2">
      <span className="text-primary text-sm">◉◉</span>
      SF//UX
    </div>
  );
}

export function GlobalEffects() {
  return (
    <>
      <VHSOverlay />
      <CustomCursor />
      <ScrollProgress />
      <VHSBadge />
    </>
  );
}
