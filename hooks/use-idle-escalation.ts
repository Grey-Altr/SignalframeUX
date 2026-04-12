"use client";

import { useEffect, useRef, useCallback, useState } from "react";

export interface IdleThreshold {
  /** Milliseconds after idle starts before this phase activates */
  delay: number;
  /** Called when this phase activates */
  onEnter: () => void;
  /** Called when idle resets (user interacts) */
  onExit: () => void;
}

/**
 * Reusable idle-escalation hook with N configurable phases.
 *
 * Returns the current phase index:
 *   -1 = active (not idle)
 *    0 = first threshold reached
 *    1 = second threshold reached
 *   ...etc.
 *
 * Listens for mousemove, mousedown, keydown, scroll, touchstart.
 * Resets all phases on any interaction.
 * Suppressed entirely under prefers-reduced-motion.
 * Uses chained setTimeout (not setInterval) for phase escalation.
 */
export function useIdleEscalation(thresholds: IdleThreshold[]): number {
  const [phase, setPhase] = useState(-1);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const activePhaseRef = useRef(-1);
  const thresholdsRef = useRef(thresholds);
  thresholdsRef.current = thresholds;

  const clearTimers = useCallback(() => {
    for (const t of timersRef.current) {
      clearTimeout(t);
    }
    timersRef.current = [];
  }, []);

  const resetIdle = useCallback(() => {
    // Exit all active phases
    const currentPhase = activePhaseRef.current;
    if (currentPhase >= 0) {
      for (let i = currentPhase; i >= 0; i--) {
        thresholdsRef.current[i]?.onExit();
      }
    }
    activePhaseRef.current = -1;
    setPhase(-1);
    clearTimers();

    // Schedule escalation chain — each threshold fires after its delay from NOW
    const sorted = [...thresholdsRef.current].map((t, idx) => ({ ...t, idx }));
    sorted.sort((a, b) => a.delay - b.delay);

    for (const entry of sorted) {
      const timer = setTimeout(() => {
        activePhaseRef.current = entry.idx;
        setPhase(entry.idx);
        entry.onEnter();
      }, entry.delay);
      timersRef.current.push(timer);
    }
  }, [clearTimers]);

  useEffect(() => {
    // Suppress under prefers-reduced-motion
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"] as const;
    for (const e of events) {
      document.addEventListener(e, resetIdle, { passive: true });
    }

    // Start the idle timer immediately
    resetIdle();

    return () => {
      for (const e of events) {
        document.removeEventListener(e, resetIdle);
      }
      clearTimers();
    };
  }, [resetIdle, clearTimers]);

  return phase;
}
