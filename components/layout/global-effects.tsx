"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "@/lib/gsap-core";
import { useLenisInstance } from "@/components/layout/lenis-provider";
import { playTone } from "@/lib/audio-feedback";
import { triggerHaptic } from "@/lib/haptic-feedback";
import { VHSOverlay } from "@/components/animation/vhs-overlay";
import { DatamoshOverlayLazy } from "@/components/animation/datamosh-overlay-lazy";
import { CanvasCursor } from "@/components/animation/canvas-cursor";
import { SignalOverlayLazy } from "@/components/animation/signal-overlay-lazy";
import { useIdleEscalation } from "@/hooks/use-idle-escalation";

/**
 * Compute and write derived CSS custom properties from --sfx-signal-intensity.
 *
 * Maps the 0.0–1.0 intensity scalar to per-effect opacity tokens:
 *   - VHS scanline: linear 0.02 → 0.08
 *   - VHS noise:    linear 0.01 → 0.04
 *   - Grain:        logarithmic — subtle at low, saturates at high
 *
 * prefers-reduced-motion: all derived values collapse to 0.
 */
export function updateSignalDerivedProps(intensity: number) {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const i = prefersReduced ? 0 : intensity;
  const root = document.documentElement.style;

  // VHS scanline: 0.02 at low → 0.08 at high (linear)
  root.setProperty("--sfx-vhs-scanline-opacity", String(0.02 + i * 0.06));

  // VHS noise: 0.01 at low → 0.04 at high (linear)
  root.setProperty("--sfx-vhs-noise-opacity", String(0.01 + i * 0.03));

  // Grain: logarithmic curve — subtle at low, saturates at high
  // Baseline at intensity 0 = 0.03 (within spec 0.03–0.05 range)
  const grainOpacity = 0.03 + 0.05 * Math.log10(1 + i * 9);
  root.setProperty("--sfx-grain-opacity", String(Math.round(grainOpacity * 1000) / 1000));

  // Halftone: invisible below 0.4, ramps 0→0.15 from 0.4→1.0
  const halftoneOpacity = i < 0.4 ? 0 : (i - 0.4) / 0.6 * 0.15;
  root.setProperty("--sfx-halftone-opacity", String(Math.round(halftoneOpacity * 1000) / 1000));
}

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
  const lenis = useLenisInstance();

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
        if (lenis) {
          lenis.scrollTo(0);
        } else {
          window.scrollTo({ top: 0, behavior: "auto" });
        }
      }}
      className="fixed bottom-20 right-6 z-[var(--z-scroll-top)] w-10 h-10 border-2 border-foreground bg-background text-foreground flex items-center justify-center text-[var(--text-md)] font-bold hover:bg-foreground hover:text-background transition-colors duration-[var(--sfx-duration-normal)]"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition:
          "opacity var(--sfx-duration-normal) var(--sfx-ease-default), transform var(--sfx-duration-normal) var(--sfx-ease-default), background-color var(--sfx-duration-fast) var(--sfx-ease-default), color var(--sfx-duration-fast) var(--sfx-ease-default)",
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

/**
 * Idle standby overlay — grain drift + OKLCH color pulse after 8s of no interaction.
 *
 * When idle activates:
 *   1. Captures current --color-primary value from computed styles
 *   2. Parses base lightness from OKLCH string (null-checks: skips pulse if not OKLCH)
 *   3. Registers a GSAP ticker that oscillates lightness +/-5% over a 4-second period
 *   4. Activates sf-grain-animated class on grain overlay (film-grain flicker)
 *   5. Activates sf-idle-overlay--active class (scanline drift)
 *
 * On any interaction (resetIdle):
 *   - GSAP ticker removed immediately
 *   - --color-primary restored to captured base value (instant, no transition)
 *   - Grain drift class removed
 *   - Overlay opacity transition bypassed via transition:none + rAF restore
 *
 * NOTE: ColorCycleFrame also mutates --color-primary via setProperty on wheel events.
 * No conflict: idle requires 8s of full inactivity; any wheel event fires resetIdle
 * which removes the pulse ticker before ColorCycleFrame can fire.
 *
 * Reduced-motion: entire system is suppressed — silent and static.
 */
/**
 * Idle standby overlay — 3-phase escalation via useIdleEscalation hook.
 *
 * Phase 0 (8s):  Grain drift — activates sf-grain-animated class
 * Phase 1 (20s): Scan emphasis — relative +0.03 boost to --sfx-vhs-scanline-opacity
 * Phase 2 (45s): Glitch burst — OKLCH color pulse for 500ms, then auto-reset
 *
 * All escalation respects prefers-reduced-motion (suppressed in hook).
 * Scanline boost uses RELATIVE offset from current computed value.
 */
function IdleOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const tickerRef = useRef<((t: number, dt: number) => void) | null>(null);
  const basePrimaryRef = useRef<string>("");
  const baseScanlineRef = useRef<number | null>(null);
  const glitchTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // --- Phase 0: Grain drift ---
  const enterPhase0 = useCallback(() => {
    grainRef.current?.classList.add("sf-grain-animated");
    overlayRef.current?.classList.add("sf-idle-overlay--active");
  }, []);

  const exitPhase0 = useCallback(() => {
    grainRef.current?.classList.remove("sf-grain-animated");
    const el = overlayRef.current;
    if (el) {
      el.style.transition = "none";
      el.classList.remove("sf-idle-overlay--active");
      requestAnimationFrame(() => { el.style.transition = ""; });
    }
  }, []);

  // --- Phase 1: Scanline emphasis (relative +0.03) ---
  const enterPhase1 = useCallback(() => {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue("--sfx-vhs-scanline-opacity")
      .trim();
    const current = parseFloat(raw) || 0;
    baseScanlineRef.current = current;
    document.documentElement.style.setProperty(
      "--sfx-vhs-scanline-opacity",
      String(current + 0.03),
    );
  }, []);

  const exitPhase1 = useCallback(() => {
    if (baseScanlineRef.current !== null) {
      document.documentElement.style.setProperty(
        "--sfx-vhs-scanline-opacity",
        String(baseScanlineRef.current),
      );
      baseScanlineRef.current = null;
    }
  }, []);

  // --- Phase 2: Glitch burst (500ms color pulse, then auto-reset) + dropout bands ---
  const enterPhase2 = useCallback(() => {
    // Capture current --sfx-primary
    basePrimaryRef.current = getComputedStyle(document.documentElement)
      .getPropertyValue("--sfx-primary")
      .trim();

    const match = basePrimaryRef.current.match(/oklch\(([\d.]+)/);
    if (match) {
      const baseLightness = parseFloat(match[1]);

      // Guard: remove any existing ticker
      if (tickerRef.current) {
        gsap.ticker.remove(tickerRef.current);
        tickerRef.current = null;
      }

      let elapsed = 0;
      const PERIOD = 4; // seconds
      const pulseFn = (_time: number, deltaTime: number) => {
        elapsed += deltaTime / 1000;
        const l = baseLightness + 0.05 * Math.sin((2 * Math.PI * elapsed) / PERIOD);
        const next = basePrimaryRef.current.replace(/oklch\([\d.]+/, `oklch(${l.toFixed(3)}`);
        document.documentElement.style.setProperty("--sfx-primary", next);
      };

      gsap.ticker.add(pulseFn);
      tickerRef.current = pulseFn;
    }

    // Auto-reset after 500ms glitch burst
    glitchTimerRef.current = setTimeout(() => {
      // Clean up ticker
      if (tickerRef.current) {
        gsap.ticker.remove(tickerRef.current);
        tickerRef.current = null;
      }
      if (basePrimaryRef.current) {
        document.documentElement.style.setProperty("--sfx-primary", basePrimaryRef.current);
        basePrimaryRef.current = "";
      }
    }, 500);

    // VHS-03: Activate dropout bands during idle phase 2+
    const dropoutEl = document.querySelector("[data-vhs-dropout]");
    if (dropoutEl) {
      // Clear existing bands safely
      while (dropoutEl.firstChild) {
        dropoutEl.removeChild(dropoutEl.firstChild);
      }
      // Generate 3-6 random dropout bands (1-3px height, < 5% viewport coverage)
      const bandCount = Math.floor(Math.random() * 4) + 3;
      for (let i = 0; i < bandCount; i++) {
        const band = document.createElement("div");
        band.className = "vhs-dropout__band";
        const top = Math.random() * 95;
        const height = 1 + Math.random() * 2; // 1-3px
        band.style.top = `${top}%`;
        band.style.height = `${height}px`;
        dropoutEl.appendChild(band);
      }
      dropoutEl.classList.add("vhs-dropout--active");
    }
  }, []);

  const exitPhase2 = useCallback(() => {
    clearTimeout(glitchTimerRef.current);
    if (tickerRef.current) {
      gsap.ticker.remove(tickerRef.current);
      tickerRef.current = null;
    }
    if (basePrimaryRef.current) {
      document.documentElement.style.setProperty("--sfx-primary", basePrimaryRef.current);
      basePrimaryRef.current = "";
    }
    // VHS-03: Deactivate dropout bands
    const dropoutEl = document.querySelector("[data-vhs-dropout]");
    if (dropoutEl) {
      dropoutEl.classList.remove("vhs-dropout--active");
    }
  }, []);

  // Wire the 3 phases through useIdleEscalation
  const thresholds = useRef([
    { delay: 8_000, onEnter: enterPhase0, onExit: exitPhase0 },
    { delay: 20_000, onEnter: enterPhase1, onExit: exitPhase1 },
    { delay: 45_000, onEnter: enterPhase2, onExit: exitPhase2 },
  ]).current;

  useIdleEscalation(thresholds);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeout(glitchTimerRef.current);
      if (tickerRef.current) { gsap.ticker.remove(tickerRef.current); }
      if (basePrimaryRef.current) {
        document.documentElement.style.setProperty("--sfx-primary", basePrimaryRef.current);
      }
      if (baseScanlineRef.current !== null) {
        document.documentElement.style.setProperty(
          "--sfx-vhs-scanline-opacity",
          String(baseScanlineRef.current),
        );
      }
    };
  }, []);

  return (
    <>
      <div ref={overlayRef} className="sf-idle-overlay" aria-hidden="true" />
      <div
        ref={grainRef}
        className="sf-idle-grain fixed inset-0 pointer-events-none z-[var(--z-vhs)] sf-grain"
        aria-hidden="true"
      />
    </>
  );
}

/**
 * Document-level interaction feedback — audio tones + haptic micro-vibration.
 *
 * Uses a single pointerover/pointerout/pointerdown listener on document with
 * target.closest() delegation — no per-component wiring required.
 *
 * lastHoveredRef debounce: pointerover fires on every pixel of movement within
 * an element. Tracking the last interactive element prevents hundreds of
 * OscillatorNodes per second. pointerout resets the ref so re-entry fires again.
 *
 * Skipped on coarse-pointer (touch-only) devices — hover audio is not meaningful
 * when there is no hover state. Haptics still fire on pointerdown via touch.
 *
 * Note on ColorCycleFrame conflict: this component resets on any interaction
 * (via IdleOverlay's resetIdle), removing the idle color ticker before
 * ColorCycleFrame can fire on wheel events — naturally safe.
 */
function InteractionFeedback() {
  const lastHoveredRef = useRef<Element | null>(null);

  useEffect(() => {
    // Respect reduced motion — entire feedback system is silent + static
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Skip hover audio on coarse-pointer devices — no hover state on touch
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const INTERACTIVE = "button, a, [role='button'], .sf-card";

    function onPointerOver(e: PointerEvent) {
      const target = e.target as HTMLElement;
      const interactive = target.closest(INTERACTIVE);
      if (!interactive) return;
      // Debounce: skip if pointer is still over the same interactive element
      if (interactive === lastHoveredRef.current) return;
      lastHoveredRef.current = interactive;
      playTone("hover");
      triggerHaptic("hover");
    }

    function onPointerOut(e: PointerEvent) {
      const target = e.target as HTMLElement;
      const interactive = target.closest(INTERACTIVE);
      // Reset lastHovered when pointer leaves an interactive element
      if (interactive === lastHoveredRef.current) {
        lastHoveredRef.current = null;
      }
    }

    function onPointerDown(e: PointerEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest(INTERACTIVE)) return;
      playTone("click");
      triggerHaptic("click");
    }

    // pointerenter does not bubble — use pointerover with delegation + debounce
    document.addEventListener("pointerover", onPointerOver, { passive: true });
    document.addEventListener("pointerout", onPointerOut, { passive: true });
    document.addEventListener("pointerdown", onPointerDown, { passive: true });

    return () => {
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return null;
}

/**
 * Signal Intensity Bridge — reads --sfx-signal-intensity on mount and
 * whenever the slider changes, then propagates derived effect tokens.
 *
 * Uses a MutationObserver on <html> style attribute to detect changes
 * from signal-overlay.tsx without coupling the two modules.
 */
function SignalIntensityBridge() {
  useEffect(() => {
    function syncDerivedProps() {
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue("--sfx-signal-intensity")
        .trim();
      const intensity = parseFloat(raw) || 0.5;
      updateSignalDerivedProps(intensity);
    }

    // Initial sync
    syncDerivedProps();

    // Observe style attribute mutations on <html> (set by signal-overlay slider)
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes" && m.attributeName === "style") {
          syncDerivedProps();
          break;
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}

export function GlobalEffects() {
  return (
    <>
      <VHSOverlay />
      <DatamoshOverlayLazy />
      <CanvasCursor />
      <ScrollProgress />
      <ScrollToTop />
      <VHSBadge />
      <IdleOverlay />
      <InteractionFeedback />
      <SignalOverlayLazy />
      <SignalIntensityBridge />
    </>
  );
}
