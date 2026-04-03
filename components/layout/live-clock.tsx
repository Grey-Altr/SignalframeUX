"use client";

import { useState, useRef, useCallback, useEffect, memo } from "react";

const CLOCK_ANIM = {
  scrambleFrames: 28,
  scrambleFramesInit: 76,
} as const;

export const LiveClock = memo(function LiveClock() {
  const [display, setDisplay] = useState<string[]>(["—","—",":","—","—",":","—","—"]);
  const prevTimeRef = useRef("");
  const scrambleRef = useRef<Map<number, { frame: number; target: string }>>(
    new Map()
  );
  const rafRef = useRef<number>(0);

  const getTimeString = useCallback(() => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }, []);

  useEffect(() => {
    // Skip clock on mobile where it's hidden (sm:block)
    const mql = window.matchMedia("(min-width: 640px)");
    if (!mql.matches) return;

    // Initialize with scramble on load
    const initial = getTimeString();
    prevTimeRef.current = initial;
    // Start all digits scrambling with longer initial duration
    for (let i = 0; i < initial.length; i++) {
      if (initial[i] !== ":") {
        scrambleRef.current.set(i, { frame: -(CLOCK_ANIM.scrambleFramesInit - CLOCK_ANIM.scrambleFrames), target: initial[i] });
      }
    }
    setDisplay(initial.split("").map((c) => (c === ":" ? ":" : String(Math.floor(Math.random() * 10)))));
    startScrambleLoop();

    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    const tickClock = () => {
      const newTime = getTimeString();
      const oldTime = prevTimeRef.current;

      if (newTime === oldTime) return;

      // Detect which positions changed and start scramble for each
      for (let i = 0; i < newTime.length; i++) {
        if (newTime[i] !== oldTime[i] && newTime[i] !== ":") {
          scrambleRef.current.set(i, { frame: 0, target: newTime[i] });
        }
      }

      prevTimeRef.current = newTime;

      // Start animation loop if not already running
      if (!rafRef.current) {
        startScrambleLoop();
      }
    };

    const startSyncInterval = () => {
      const ms = new Date().getMilliseconds();
      timeoutId = setTimeout(() => {
        tickClock();
        intervalId = setInterval(tickClock, 1000);
      }, 1000 - ms);
    };

    startSyncInterval();

    function startScrambleLoop() {
      function tick() {
        const scrambles = scrambleRef.current;
        if (scrambles.size === 0) {
          rafRef.current = 0;
          return;
        }

        const currentTime = prevTimeRef.current;
        const chars = currentTime.split("");

        scrambles.forEach((state, idx) => {
          // For initial scramble (negative frames), progressively slow down
          // by only incrementing on some frames based on progress
          if (state.frame < 0) {
            const progress = 1 - Math.abs(state.frame) / (CLOCK_ANIM.scrambleFramesInit - CLOCK_ANIM.scrambleFrames);
            // Skip more frames as we approach the end (slowing down)
            const skipChance = progress * progress * 0.85;
            if (Math.random() < skipChance) {
              // Don't increment — hold current digit longer
              return;
            }
          }

          state.frame++;
          if (state.frame >= CLOCK_ANIM.scrambleFrames) {
            // Settle on correct digit
            chars[idx] = state.target;
            scrambles.delete(idx);
          } else {
            // Show random digit
            chars[idx] = String(Math.floor(Math.random() * 10));
          }
        });

        setDisplay(chars);
        rafRef.current = requestAnimationFrame(tick);
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    // Pause RAF + interval when tab is hidden, resume on visible
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
        clearTimeout(timeoutId);
        clearInterval(intervalId);
      } else {
        // Resume interval — clear first to prevent stacking
        clearTimeout(timeoutId);
        clearInterval(intervalId);
        startSyncInterval();
        if (scrambleRef.current.size > 0) startScrambleLoop();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibility);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [getTimeString]);

  return (
    <span
      role="timer"
      aria-live="off"
      className="sf-display text-[clamp(48px,6.5vw,80px)] leading-none tracking-tight tabular-nums sf-clock-pixelize"
      style={{
        fontVariantNumeric: "tabular-nums",
      }}
      aria-label={`Current time: ${display.join("")}`}
    >
      {display.map((char, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`inline-block text-center leading-none ${
            char === ":" ? "w-[0.2em]" : "w-[0.48em]"
          }`}
        >
          {char}
        </span>
      ))}
    </span>
  );
});
