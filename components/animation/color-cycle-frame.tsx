"use client";

/**
 * STP-02 Theme Toggle Audit — color-cycle-frame.tsx
 *
 * AUDIT FINDINGS (2026-04-06, Phase 5 Plan 01):
 *
 * Conflict surfaces in components/animation/:
 *   - color-cycle-frame.tsx: calls document.documentElement.style.setProperty("--sfx-primary", ...)
 *     on mount (random init) and on scroll-triggered color cycle (inside wipe onMid callback).
 *   - hero-mesh.tsx: uses hardcoded rgba(255,255,255,...) on canvas context — theme-neutral.
 *     Canvas paint calls do not respond to CSS variable changes. No guard needed.
 *   - vhs-overlay.tsx: GSAP mutates opacity only — no color properties. No guard needed.
 *
 * GSAP color mutation audit result:
 *   grep -rn "gsap.(to|from|fromTo|set).*(color|background|fill|stroke)" components/animation/
 *   → NO MATCHES — zero GSAP color mutations exist. GSAP only animates opacity and transform.
 *
 * sf-no-transition mechanism:
 *   lib/theme.ts applies "sf-no-transition" class, toggles dark class, removes after 2 rAF ticks.
 *   globals.css backs with: transition: none !important; animation-duration: 0.01ms !important.
 *   This mechanism is correct and complete for CSS transition suppression.
 *
 * setProperty vs sf-no-transition:
 *   CSS variable mutation via setProperty() is instant — not transition-dependent.
 *   sf-no-transition suppresses transition animations, not variable reads.
 *   Therefore: setProperty calls do NOT conflict with sf-no-transition directly.
 *
 * Guarded conflict:
 *   If a theme toggle occurs during an active color cycle wipe (~150ms window), the onMid
 *   callback fires after the wipe covers and calls setProperty("--sfx-primary", cycleColor).
 *   This overwrites the theme's intended --color-primary with the cycling accent color.
 *   Guard: skip setProperty if "sf-no-transition" class is present on documentElement.
 *   The init setProperty (mount) is not guarded — it fires once at load, before any toggle.
 */

import { useRef, useCallback, useEffect } from "react";
import { triggerColorStutter } from "@/lib/color-stutter";
import type gsap from "gsap";

// Lazy-imported inside triggerLocalWipe to avoid SSR issues
let _gsap: typeof gsap | null = null;
async function getGsap() {
  if (!_gsap) {
    const mod = await import("@/lib/gsap-core");
    _gsap = mod.gsap;
  }
  return _gsap;
}

const ACCENT_COLORS = [
  "oklch(0.7 0.18 195)",   // Cyan
  "oklch(0.75 0.3 140)",   // Lime
  "oklch(0.75 0.18 75)",   // Amber
  "oklch(0.65 0.22 25)",   // Coral
  "oklch(0.55 0.25 290)",  // Violet
  "oklch(0.55 0.25 10)",   // Red
  "oklch(0.65 0.3 60)",    // Gold
];

const SCROLL_THRESHOLD = 60;
const IDLE_MS = 200;
const WIPE_DURATION = 150;

/**
 * Text-clipped wipe: animates a hard-edge gradient via GSAP so the wipe
 * is only visible inside the letterforms (background-clip: text).
 *
 * A proxy value 0→1→2 drives gradient stop positions:
 *   0→1: black edge sweeps down, covering text. At 1: fully black, onMid fires.
 *   1→2: black edge sweeps out, revealing new color.
 */
async function triggerLocalWipe(container: HTMLElement, direction: number, onMid: () => void) {
  const gsap = await getGsap();
  // Remove any old child-div wipe elements from previous implementation
  const oldWipe = container.querySelector<HTMLDivElement>(".sf-frame-wipe");
  if (oldWipe) oldWipe.remove();

  const s = container.style;
  const currentColor = getComputedStyle(document.documentElement).getPropertyValue("--sfx-primary").trim() || "oklch(0.65 0.3 60)";
  const coverColor = getComputedStyle(document.documentElement).getPropertyValue("--sfx-foreground").trim() || "oklch(0.145 0 0)";
  const gradDir = direction > 0 ? "to bottom" : "to top";

  // Enable text-clip mode
  s.setProperty("-webkit-background-clip", "text");
  s.setProperty("background-clip", "text");
  s.setProperty("-webkit-text-fill-color", "transparent");

  let midFired = false;
  let activeColor = currentColor;
  const proxy = { v: 0 };

  const updateGradient = () => {
    const v = proxy.v;

    if (v <= 1) {
      // Phase 1: cover — black edge sweeps in
      const edge = v * 100;
      s.setProperty("background-image",
        `linear-gradient(${gradDir}, ${coverColor} ${edge}%, ${activeColor} ${edge}%)`
      );
    } else {
      // Phase 2: reveal — black edge sweeps out
      const edge = (v - 1) * 100;
      s.setProperty("background-image",
        `linear-gradient(${gradDir}, ${activeColor} ${edge}%, ${coverColor} ${edge}%)`
      );
    }
  };

  // Set initial state
  updateGradient();

  // Phase 1: cover (0 → 1)
  gsap.to(proxy, {
    v: 1,
    duration: WIPE_DURATION / 1000,
    ease: "power2.out",
    onUpdate: updateGradient,
    onComplete: () => {
      // Text fully covered — swap color
      onMid();
      midFired = true;
      activeColor = getComputedStyle(document.documentElement).getPropertyValue("--sfx-primary").trim() || currentColor;

      // Phase 2: reveal (1 → 2)
      gsap.to(proxy, {
        v: 2,
        duration: WIPE_DURATION / 1000,
        ease: "power2.out",
        onUpdate: updateGradient,
        onComplete: () => {
          // Cleanup — restore normal text rendering
          s.removeProperty("background-image");
          s.removeProperty("-webkit-text-fill-color");
          s.removeProperty("background-clip");
          s.removeProperty("-webkit-background-clip");
        },
      });
    },
  });
}

export function ColorCycleFrame({ children, className, style: styleProp }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null);
  const indexRef = useRef(-1);
  const hoveredRef = useRef(false);
  const accumulatedRef = useRef(0);
  const lockedRef = useRef(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const random = Math.floor(Math.random() * ACCENT_COLORS.length);
    indexRef.current = random;
    document.documentElement.style.setProperty("--sfx-primary", ACCENT_COLORS[random]);
  }, []);

  const apply = useCallback((next: number, direction: number) => {
    indexRef.current = next;
    lockedRef.current = true;

    const container = ref.current;
    if (!container) return;
    triggerLocalWipe(container, direction, () => {
      const root = document.documentElement;
      // STP-02 guard: skip if theme toggle is in progress (sf-no-transition window ~2 rAF ticks)
      if (root.classList.contains("sf-no-transition")) return;
      root.style.setProperty("--sfx-primary", ACCENT_COLORS[next]);
      triggerColorStutter();
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (!hoveredRef.current) return;
      e.preventDefault();
      e.stopPropagation();

      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        lockedRef.current = false;
        accumulatedRef.current = 0;
      }, IDLE_MS);

      if (lockedRef.current) return;

      accumulatedRef.current += e.deltaY;

      if (Math.abs(accumulatedRef.current) >= SCROLL_THRESHOLD) {
        const direction = accumulatedRef.current > 0 ? 1 : -1;
        accumulatedRef.current = 0;
        const next = (indexRef.current + direction + ACCENT_COLORS.length) % ACCENT_COLORS.length;
        apply(next, direction);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [apply]);

  return (
    <span
      ref={ref}
      className={className}
      onMouseEnter={() => { hoveredRef.current = true; accumulatedRef.current = 0; }}
      onMouseLeave={() => { hoveredRef.current = false; accumulatedRef.current = 0; }}
      style={{ cursor: "ns-resize", position: "relative", overflow: "clip", verticalAlign: "bottom", lineHeight: "inherit", marginTop: "-58px", ...styleProp }}
    >
      {children}
    </span>
  );
}
