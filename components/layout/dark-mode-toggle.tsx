"use client";

import { useState, useEffect, useLayoutEffect, memo } from "react";
import { toggleTheme as sharedToggleTheme } from "@/lib/theme";

export const DarkModeToggle = memo(function DarkModeToggle() {
  // Must match SSR: never read `document` in the initial state initializer, or
  // the client can disagree with the server when the blocking script has set `.dark`.
  const [dark, setDark] = useState(false);
  const [renderPhase, setRenderPhase] = useState(0);

  useLayoutEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    // Keep in sync if theme is changed by other controls (e.g. command palette).
    const root = document.documentElement;
    const sync = () => setDark(root.classList.contains("dark"));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    // Graphic render effect: progressively draw the toggle like scan lines
    const phases = [0, 48, 96, 144, 192, 240, 288];
    const timeouts = phases.map((delay, i) =>
      setTimeout(() => setRenderPhase(i + 1), delay)
    );
    // Fallback: ensure toggle is accessible even if animation doesn't complete
    const fallback = setTimeout(() => setRenderPhase(7), 400);
    return () => {
      observer.disconnect();
      timeouts.forEach(clearTimeout);
      clearTimeout(fallback);
    };
  }, []);

  function toggle() {
    const wasDark = document.documentElement.classList.contains("dark");
    const nextDark = sharedToggleTheme(wasDark);
    setDark(nextDark);
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
        transition: "opacity 0.45s ease-out, backdrop-filter 0.45s ease-out, background 0.45s ease-out",
      });
      bloom.setAttribute("aria-hidden", "true");
      document.body.appendChild(bloom);
      requestAnimationFrame(() => {
        bloom.style.opacity = "0";
        bloom.style.background = "rgba(255,255,255,0)";
        bloom.style.backdropFilter = "blur(0px) brightness(1)";
        (bloom.style as CSSStyleDeclaration & { webkitBackdropFilter: string }).webkitBackdropFilter = "blur(0px) brightness(1)";
      });
      setTimeout(() => bloom.remove(), 500);
    }
  }

  const renderOpacity = renderPhase === 0 ? 0 : renderPhase < 3 ? 0.15 : renderPhase < 5 ? 0.4 : renderPhase < 7 ? 0.7 : 1;
  const renderFilter = renderPhase < 7 ? `brightness(${1 + (7 - renderPhase) * 0.3})` : "none";

  return (
    <div
      className="flex items-center"
      style={{
        opacity: renderOpacity,
        filter: renderFilter,
        transition: "opacity 0.25s ease-out, filter 0.25s ease-out",
      }}
    >
      <button
        onClick={toggle}
        tabIndex={renderPhase > 0 ? 0 : -1}
        aria-hidden={renderPhase === 0 ? true : undefined}
        className="relative w-[4.5rem] h-8 border-2 border-muted-foreground bg-muted shrink-0 cursor-pointer overflow-hidden"
        aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        aria-pressed={dark}
        style={{
          clipPath: renderPhase < 4 ? `inset(0 0 ${100 - renderPhase * 30}% 0)` : "none",
        }}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 10 10"
          className={`absolute left-[3px] top-1/2 h-4 w-4 -translate-y-1/2 ${dark ? "text-primary" : "text-muted-foreground"}`}
        >
          <rect x="3" y="1" width="4" height="1" fill="currentColor" />
          <rect x="2" y="2" width="6" height="3" fill="currentColor" />
          <rect x="3" y="5" width="4" height="2" fill="currentColor" />
          <rect x="4" y="7" width="2" height="2" fill="currentColor" />
        </svg>
        <svg
          aria-hidden="true"
          viewBox="0 0 10 10"
          className={`absolute right-[3px] top-1/2 h-4 w-4 -translate-y-1/2 ${dark ? "text-muted-foreground" : "text-primary"}`}
        >
          <rect x="3" y="1" width="4" height="1" fill="currentColor" />
          <rect x="2" y="2" width="1" height="1" fill="currentColor" />
          <rect x="7" y="2" width="1" height="1" fill="currentColor" />
          <rect x="2" y="3" width="1" height="2" fill="currentColor" />
          <rect x="7" y="3" width="1" height="2" fill="currentColor" />
          <rect x="3" y="5" width="4" height="2" fill="currentColor" />
          <rect x="4" y="7" width="2" height="2" fill="currentColor" />
        </svg>
        <div
          className="sf-theme-toggle-knob absolute top-1/2 h-[22px] w-[8px] bg-muted-foreground"
          style={{
            left: "22px",
            transform: `translate3d(${dark ? 0 : 20}px, -50%, 0)`,
            backgroundColor: dark ? "var(--color-primary)" : undefined,
            willChange: "transform",
          }}
        />
      </button>
    </div>
  );
});
