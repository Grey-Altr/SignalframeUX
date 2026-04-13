"use client";

import { useState, useEffect, memo } from "react";
import { toggleTheme as sharedToggleTheme } from "@/lib/theme";

export const DarkModeToggle = memo(function DarkModeToggle() {
  const [dark, setDark] = useState(false);
  const [renderPhase, setRenderPhase] = useState(0);


  useEffect(() => {
    // Sync state with what the blocking script set
    setDark(document.documentElement.classList.contains("dark"));
    // Graphic render effect: progressively draw the toggle like scan lines
    const phases = [500, 580, 640, 700, 740, 780, 850];
    const timeouts = phases.map((delay, i) =>
      setTimeout(() => setRenderPhase(i + 1), delay)
    );
    // Fallback: ensure toggle is accessible even if animation doesn't complete
    const fallback = setTimeout(() => setRenderPhase(7), 2000);
    return () => { timeouts.forEach(clearTimeout); clearTimeout(fallback); };
  }, []);

  function toggle() {
    const wasDark = dark;
    setDark((prev) => sharedToggleTheme(prev));
    // Bloom flash when switching dark → light
    if (wasDark) {
      const bloom = document.createElement("div");
      Object.assign(bloom.style, {
        position: "fixed",
        inset: "0",
        zIndex: "9999",
        pointerEvents: "none",
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(16px) brightness(3)",
        WebkitBackdropFilter: "blur(16px) brightness(3)",
        opacity: "1",
        transition: "opacity 1.2s ease-out, backdrop-filter 1.2s ease-out, background 1.2s ease-out",
      });
      bloom.setAttribute("aria-hidden", "true");
      document.body.appendChild(bloom);
      requestAnimationFrame(() => {
        bloom.style.opacity = "0";
        bloom.style.background = "rgba(255,255,255,0)";
        bloom.style.backdropFilter = "blur(0px) brightness(1)";
        (bloom.style as CSSStyleDeclaration & { webkitBackdropFilter: string }).webkitBackdropFilter = "blur(0px) brightness(1)";
      });
      setTimeout(() => bloom.remove(), 1200);
    }
  }

  const renderOpacity = renderPhase === 0 ? 0 : renderPhase < 3 ? 0.15 : renderPhase < 5 ? 0.4 : renderPhase < 7 ? 0.7 : 1;
  const renderFilter = renderPhase < 7 ? `brightness(${1 + (7 - renderPhase) * 0.3})` : "none";

  return (
    <div
      className="flex items-center gap-[var(--sfx-space-2)].5"
      style={{
        opacity: renderOpacity,
        filter: renderFilter,
        transition: "opacity 0.6s ease-out, filter 0.6s ease-out",
      }}
    >
      <svg aria-hidden="true" width="20" height="26" viewBox="0 0 7 9" className="text-primary" style={{ imageRendering: "pixelated" }}>
        <rect x="2" y="0" width="3" height="1" fill="currentColor" />
        <rect x="1" y="1" width="1" height="1" fill="currentColor" />
        <rect x="5" y="1" width="1" height="1" fill="currentColor" />
        <rect x="1" y="2" width="1" height="1" fill="currentColor" />
        <rect x="3" y="2" width="1" height="1" fill="currentColor" />
        <rect x="5" y="2" width="1" height="1" fill="currentColor" />
        <rect x="1" y="3" width="1" height="1" fill="currentColor" />
        <rect x="5" y="3" width="1" height="1" fill="currentColor" />
        <rect x="2" y="4" width="3" height="1" fill="currentColor" />
        <rect x="2" y="5" width="3" height="1" fill="currentColor" />
        <rect x="3" y="6" width="1" height="1" fill="currentColor" />
      </svg>
      <button
        onClick={toggle}
        tabIndex={renderPhase > 0 ? 0 : -1}
        aria-hidden={renderPhase === 0 ? true : undefined}
        className="relative w-[42px] h-[28px] border-2 border-foreground bg-transparent shrink-0 cursor-pointer"
        aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        aria-pressed={dark}
        style={{
          clipPath: renderPhase < 4 ? `inset(0 0 ${100 - renderPhase * 30}% 0)` : "none",
        }}
      >
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-foreground transition-all duration-300"
          style={{
            left: dark ? "2px" : "24px",
            backgroundColor: dark ? "var(--color-primary)" : undefined,
            transitionTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          }}
        />
      </button>
      <svg aria-hidden="true" width="20" height="26" viewBox="0 0 7 9" className="text-primary" style={{ imageRendering: "pixelated" }}>
        <rect x="2" y="0" width="3" height="1" fill="currentColor" />
        <rect x="1" y="1" width="1" height="1" fill="currentColor" />
        <rect x="5" y="1" width="1" height="1" fill="currentColor" />
        <rect x="1" y="2" width="1" height="1" fill="currentColor" />
        <rect x="5" y="2" width="1" height="1" fill="currentColor" />
        <rect x="1" y="3" width="1" height="1" fill="currentColor" />
        <rect x="5" y="3" width="1" height="1" fill="currentColor" />
        <rect x="2" y="4" width="3" height="1" fill="currentColor" />
        <rect x="2" y="5" width="3" height="1" fill="currentColor" />
        <rect x="3" y="6" width="1" height="1" fill="currentColor" />
      </svg>
    </div>
  );
});
