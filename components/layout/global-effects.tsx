"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap-core";
import { useLenisInstance } from "@/components/layout/lenis-provider";
import { playTone } from "@/lib/audio-feedback";
import { triggerHaptic } from "@/lib/haptic-feedback";
import { VHSOverlay } from "@/components/animation/vhs-overlay";
import { getQualityTier, tierMultiplier } from "@/lib/effects/quality-tier";

import { CanvasCursor } from "@/components/animation/canvas-cursor";
import { SignalOverlayLazy } from "@/components/animation/signal-overlay-lazy";

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

  // VHS scanline: 0.005 at low → 0.02 at high (linear)
  root.setProperty("--sfx-vhs-scanline-opacity", String(0.005 + i * 0.015));

  // VHS noise: 0.0025 at low → 0.01 at high (linear)
  root.setProperty("--sfx-vhs-noise-opacity", String(0.0025 + i * 0.0075));

  // Grain: logarithmic curve — subtle at low, saturates at high
  // Baseline at intensity 0 = 0.03 (within spec 0.03–0.05 range)
  const grainOpacity = 0.03 + 0.05 * Math.log10(1 + i * 9);
  root.setProperty("--sfx-grain-opacity", String(Math.round(grainOpacity * 1000) / 1000));

  // Halftone: invisible below 0.4, ramps 0→0.15 from 0.4→1.0
  const halftoneOpacity = i < 0.4 ? 0 : (i - 0.4) / 0.6 * 0.15;
  root.setProperty("--sfx-halftone-opacity", String(Math.round(halftoneOpacity * 1000) / 1000));

  // Circuit: INVERSE of intensity — visible at low, fades at high (mutually exclusive with grain)
  // Range: 0.05 at intensity 0 → 0 at intensity 1.0
  const circuitOpacity = 0.05 * (1 - i);
  root.setProperty("--sfx-circuit-opacity", String(Math.round(circuitOpacity * 1000) / 1000));

  // Effects subsystem: tier-scaled intensity derivatives for CSS consumers
  const tier = getQualityTier();
  const tm = tierMultiplier(tier);
  root.setProperty("--sfx-fx-tier", tier);
  root.setProperty("--sfx-fx-multiplier", String(tm));
  root.setProperty("--sfx-fx-feedback-decay", String(Math.round((0.88 + i * 0.08 * tm) * 1000) / 1000));
  root.setProperty("--sfx-fx-displace-gain", String(Math.round(i * 0.08 * tm * 1000) / 1000));
  root.setProperty("--sfx-fx-bloom-intensity", String(Math.round(i * 0.6 * tm * 1000) / 1000));
  root.setProperty("--sfx-fx-glitch-rate", String(Math.round(i * 0.15 * tm * 1000) / 1000));
  root.setProperty("--sfx-fx-particle-opacity", String(Math.round(i * 0.6 * tm * 1000) / 1000));
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
          ease: "power2.out",
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
      className="fixed origin-bottom-right z-[var(--z-scroll-top)] w-10 h-10 border-2 border-foreground bg-background text-foreground flex items-center justify-center text-[var(--text-md)] font-bold hover:bg-foreground hover:text-background transition-colors duration-[var(--sfx-duration-normal)]"
      style={{
        bottom: "calc(var(--sf-frame-bottom-gap, 0px) + 80px * var(--sf-canvas-scale, 1))",
        right: "calc(var(--sf-frame-offset-x, 0px) + 24px * var(--sf-canvas-scale, 1))",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: visible
          ? "scale(var(--sf-canvas-scale, 1))"
          : "translateY(12px) scale(var(--sf-canvas-scale, 1))",
        transition:
          "opacity var(--sfx-duration-normal) var(--sfx-ease-default), transform var(--sfx-duration-normal) var(--sfx-ease-default), background-color var(--sfx-duration-fast) var(--sfx-ease-default), color var(--sfx-duration-fast) var(--sfx-ease-default)",
      }}
      aria-label="Scroll to top"
    >
      ↑
    </button>
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
      <CanvasCursor />
      <ScrollProgress />
      <ScrollToTop />
      <InteractionFeedback />
      <SignalOverlayLazy />
      <SignalIntensityBridge />
    </>
  );
}
