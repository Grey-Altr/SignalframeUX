"use client";

/**
 * SignalOverlay — Live SIGNAL parameter adjustment panel.
 *
 * A floating control panel that lets visitors interactively adjust three
 * SIGNAL system parameters. Values are written directly to CSS custom
 * properties on :root, which WebGL uniforms pick up on the next frame
 * via the SignalCanvas singleton's render loop.
 *
 * Controls:
 *   --signal-intensity  (0.0–1.0)   Overall SIGNAL effect strength
 *   --signal-speed      (0.0–2.0)   Animation speed multiplier
 *   --signal-accent     (0–360)     OKLCH hue rotation for accent color
 *
 * Visibility:
 *   - Toggle button fixed bottom-right (always visible)
 *   - Shift+S keyboard shortcut toggles panel
 *   - No persistence — panel state resets on page reload (per research recommendation)
 *
 * Reduced-motion: speed slider is replaced with a "Reduced motion active" message.
 *
 * @module components/animation/signal-overlay
 */

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { SFSlider } from "@/components/sf/sf-slider";
import {
  getSignalOverlayOpen,
  setSignalOverlayOpen,
  subscribeSignalOverlay,
  toggleSignalOverlayOpen,
} from "@/lib/signal-overlay-store";

// ---------------------------------------------------------------------------
// Default values
// ---------------------------------------------------------------------------

const DEFAULTS = {
  intensity: 50,   // maps to 0.50
  speed: 50,       // maps to 1.00x
  accent: 0,       // degrees, maps to 0 hue shift
};

// ---------------------------------------------------------------------------
// SliderControl sub-component
// ---------------------------------------------------------------------------

interface SliderControlProps {
  label: string;
  cssVar: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  displayValue: string;
  onChange: (value: number) => void;
}

function SliderControl({
  label,
  cssVar,
  value,
  min,
  max,
  step = 1,
  displayValue,
  onChange,
}: SliderControlProps) {
  return (
    <div className="flex flex-col gap-[var(--sfx-space-2)]">
      <div className="flex items-center justify-between">
        <label
          htmlFor={cssVar}
          className="text-[9px] font-bold uppercase tracking-[0.12em] text-foreground/70"
        >
          {label}
        </label>
        <span className="text-[9px] font-mono text-foreground/50 tabular-nums">
          {displayValue}
        </span>
      </div>
      <SFSlider
        id={cssVar}
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
        aria-label={label}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// SignalOverlay component
// ---------------------------------------------------------------------------

/**
 * Live SIGNAL parameter panel — toggle with Shift+S or the floating S button.
 *
 * Writes --signal-intensity, --signal-speed, --signal-accent to :root
 * so WebGL uniforms and CSS-driven effects pick up changes on the next frame.
 *
 * @example
 * // Mount via SignalOverlayLazy in GlobalEffects — never directly in Server Components
 * <SignalOverlayLazy />
 */
export function SignalOverlay() {
  // Open state is owned by lib/signal-overlay-store so the nav chrome toggle
  // (components/layout/nav.tsx NavSignalToggle) drives the same boolean.
  const [isOpen, setIsOpenState] = useState<boolean>(getSignalOverlayOpen);
  const [intensity, setIntensity] = useState(DEFAULTS.intensity);
  const [speed, setSpeed] = useState(DEFAULTS.speed);
  const [accent, setAccent] = useState(DEFAULTS.accent);
  const [reducedMotion, setReducedMotion] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => subscribeSignalOverlay(setIsOpenState), []);

  // Detect reduced-motion preference on mount
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Keyboard shortcut: Shift+S to toggle panel
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.shiftKey && e.key === "S") {
        e.preventDefault();
        toggleSignalOverlayOpen();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Write CSS custom property handlers
  function handleIntensity(value: number) {
    setIntensity(value);
    document.documentElement.style.setProperty("--sfx-signal-intensity", String(value / 100));
  }

  function handleSpeed(value: number) {
    setSpeed(value);
    // 50 = 1.0x speed; 0 = 0.0x; 100 = 2.0x
    document.documentElement.style.setProperty("--sfx-signal-speed", String(value / 50));
  }

  function handleAccent(value: number) {
    setAccent(value);
    document.documentElement.style.setProperty("--sfx-signal-accent", String(value));
  }

  // Reset to defaults
  function handleReset() {
    setIntensity(DEFAULTS.intensity);
    setSpeed(DEFAULTS.speed);
    setAccent(DEFAULTS.accent);
    document.documentElement.style.setProperty("--sfx-signal-intensity", "0.5");
    document.documentElement.style.setProperty("--sfx-signal-speed", "1");
    document.documentElement.style.setProperty("--sfx-signal-accent", "0");
  }

  return (
    <>
      {/* Toggle now lives in the nav chrome row (NavSignalToggle) — no
          standalone floating button here. Keyboard (Shift+S) and the nav
          button both drive the shared lib/signal-overlay-store. */}

      {/* Panel */}
      {isOpen && (
        <div
          id="signal-overlay-panel"
          ref={panelRef}
          role="dialog"
          aria-label="SIGNAL parameter controls"
          className={cn(
            "fixed origin-bottom-left z-[calc(var(--z-scroll-top,9000)+10)]",
            "w-64",
            "bg-background/95 backdrop-blur-sm",
            "border-2 border-foreground"
          )}
          style={{
            // Anchor above the nav chrome row in the bottom-left corner so the
            // panel lands adjacent to its toggle button inside the nav.
            bottom: "calc(var(--sf-frame-bottom-gap, 0px) + 72px * var(--sf-canvas-scale, 1))",
            left: "calc(var(--sf-frame-offset-x, 0px) + 24px * var(--sf-canvas-scale, 1))",
            transform: "scale(var(--sf-canvas-scale, 1))",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-[var(--sfx-space-4)] py-[var(--sfx-space-3)] border-b-2 border-foreground">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] sf-display">
              SIGNAL//
            </span>
            <button
              onClick={() => setSignalOverlayOpen(false)}
              aria-label="Close SIGNAL overlay"
              className="text-[11px] font-bold text-foreground/60 hover:text-foreground transition-colors duration-[var(--sfx-duration-fast)] leading-none"
            >
              ×
            </button>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-5 p-[var(--sfx-space-4)]">
            <SliderControl
              label="Signal Intensity"
              cssVar="--sfx-signal-intensity"
              value={intensity}
              min={0}
              max={100}
              step={1}
              displayValue={`${(intensity / 100).toFixed(2)}`}
              onChange={handleIntensity}
            />

            {reducedMotion ? (
              <div className="flex flex-col gap-[var(--sfx-space-1)]">
                <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-foreground/40">
                  Animation Speed
                </span>
                <span className="text-[9px] text-foreground/40 italic">
                  Reduced motion active
                </span>
              </div>
            ) : (
              <SliderControl
                label="Animation Speed"
                cssVar="--sfx-signal-speed"
                value={speed}
                min={0}
                max={100}
                step={1}
                displayValue={`${(speed / 50).toFixed(2)}x`}
                onChange={handleSpeed}
              />
            )}

            <SliderControl
              label="Accent Shift"
              cssVar="--sfx-signal-accent"
              value={accent}
              min={0}
              max={360}
              step={1}
              displayValue={`${accent}°`}
              onChange={handleAccent}
            />
          </div>

          {/* Footer: reset */}
          <div className="px-[var(--sfx-space-4)] pb-[var(--sfx-space-4)]">
            <button
              onClick={handleReset}
              className="w-full text-[9px] font-bold uppercase tracking-[0.12em] text-foreground/40 hover:text-foreground border border-foreground/20 hover:border-foreground py-[var(--sfx-space-1)] transition-colors duration-[var(--sfx-duration-fast)]"
            >
              Reset defaults
            </button>
          </div>
        </div>
      )}
    </>
  );
}
