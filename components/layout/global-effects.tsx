"use client";

import { useEffect, useRef } from "react";

/** Magenta scanline that scrolls down the viewport */
function Scanline() {
  return (
    <>
      <div className="scanline" />
      <style jsx>{`
        @keyframes scanline-move {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .scanline {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: rgba(255, 229, 0, 0.1);
          z-index: 999;
          pointer-events: none;
          animation: scanline-move 8s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .scanline { display: none; }
        }
      `}</style>
    </>
  );
}

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
      cursor.classList.add("sf-cursor-click");
      cursor.addEventListener("animationend", () => {
        cursor.classList.remove("sf-cursor-click");
      }, { once: true });
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
          position: fixed;
          top: -20px;
          left: -20px;
          width: 40px;
          height: 40px;
          pointer-events: none;
          z-index: 10000;
          mix-blend-mode: exclusion;
          transform: translate(0px, 0px);
          will-change: transform;
          transition: opacity 0.2s;
          opacity: 0.7;
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
          width: 1px;
          height: 28px;
          transform: translate(-50%, -50%);
        }
        .sf-cursor::after {
          width: 28px;
          height: 1px;
          transform: translate(-50%, -50%);
        }
        .sf-cursor.active {
          opacity: 1;
        }
        .sf-cursor.active::before,
        .sf-cursor.active::after {
          transform: translate(-50%, -50%) rotate(45deg);
        }
        .sf-cursor.active::before {
          background: linear-gradient(#FF0090 30%, transparent 30%, transparent 70%, #FF0090 70%);
        }
        .sf-cursor.active::after {
          background: linear-gradient(to right, #FF0090 30%, transparent 30%, transparent 70%, #FF0090 70%);
        }
        @keyframes sf-cursor-click {
          0% { scale: 1; }
          40% { scale: 0.5; }
          100% { scale: 1; }
        }
        .sf-cursor-click {
          animation: sf-cursor-click 0.25s cubic-bezier(0.22, 1, 0.36, 1);
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
      <Scanline />
      <CustomCursor />
      <ScrollProgress />
      <VHSBadge />
    </>
  );
}
