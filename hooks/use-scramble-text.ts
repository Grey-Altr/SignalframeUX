"use client";

import { useEffect, useState, useRef, useId } from "react";

const SCRAMBLE_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";

/**
 * Shared scramble coordinator — single RAF loop drives all registered scramble instances.
 * Eliminates concurrent setIntervals.
 */
export type ScrambleEntry = {
  target: string;
  delay: number;
  duration: number;
  settled: Set<number>;
  startTime: number;
  started: boolean;
  done: boolean;
  setText: (s: string) => void;
};

/** Shared state survives HMR via globalThis — prevents orphaned RAF loops during dev reloads */
const SCRAMBLE_KEY = "__sf_scramble" as const;
type ScrambleState = { registry: Map<string, ScrambleEntry>; raf: number; mountTime: number };

function getScrambleState(): ScrambleState {
  const g = globalThis as unknown as Record<string, ScrambleState | undefined>;
  if (!g[SCRAMBLE_KEY]) {
    g[SCRAMBLE_KEY] = { registry: new Map(), raf: 0, mountTime: 0 };
  }
  return g[SCRAMBLE_KEY]!;
}

function scrambleTick() {
  const s = getScrambleState();
  const now = Date.now();
  let allDone = true;

  s.registry.forEach((entry) => {
    if (entry.done) return;
    allDone = false;

    // Wait for staggered delay
    if (!entry.started) {
      if (now - s.mountTime < entry.delay) return;
      entry.started = true;
      entry.startTime = now;
    }

    const elapsed = now - entry.startTime;
    const progress = Math.min(elapsed / entry.duration, 1);
    const chars = entry.target.split("");

    const result = chars.map((c, i) => {
      if (c === " ") return " ";
      const settleAt = (i / chars.length) * 0.7 + 0.3;
      if (progress >= settleAt || entry.settled.has(i)) {
        entry.settled.add(i);
        return c;
      }
      return SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)];
    });

    entry.setText(result.join(""));
    if (entry.settled.size >= chars.filter(c => c !== " ").length) {
      entry.done = true;
    }
  });

  if (!allDone) {
    s.raf = requestAnimationFrame(scrambleTick);
  } else {
    s.raf = 0;
  }
}

export function useScrambleText(target: string, delay: number, duration = 600) {
  const [text, setText] = useState(target);
  const reactId = useId();
  const idRef = useRef(reactId);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth < 768) return;

    const id = idRef.current;
    const s = getScrambleState();

    // Immediately show scrambled state
    setText(target.split("").map((c) =>
      c === " " ? " " : SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)]
    ).join(""));

    // Register into shared loop
    s.registry.set(id, {
      target, delay, duration,
      settled: new Set<number>(),
      startTime: 0,
      started: false,
      done: false,
      setText,
    });

    // Start shared loop if first registration
    if (s.registry.size === 1) {
      s.mountTime = Date.now();
    }
    if (!s.raf) {
      s.raf = requestAnimationFrame(scrambleTick);
    }

    return () => {
      s.registry.delete(id);
      if (s.registry.size === 0) {
        if (s.raf) {
          cancelAnimationFrame(s.raf);
          s.raf = 0;
        }
        s.mountTime = 0;
      }
    };
  }, [target, delay, duration]);

  return text;
}
