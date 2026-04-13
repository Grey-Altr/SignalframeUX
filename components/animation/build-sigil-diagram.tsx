"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type DiagramMode = "poignant" | "decorative";

interface BuildSigilDiagramProps {
  className?: string;
  seed: string;
  words: string[];
  mode?: DiagramMode;
}

type Point = { x: number; y: number };

const GLYPHS = ["+", "x", "::", "[]", "<>", "#", "01"];
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>[]{}+-=/";

function hashSeed(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function makeStateA(count: number): Point[] {
  return Array.from({ length: count }, (_, i) => {
    const t = i / count;
    const r = 0.12 + (i % 7) * 0.01;
    const a = t * Math.PI * 8;
    return {
      x: 0.5 + Math.cos(a) * (0.08 + r),
      y: 0.5 + Math.sin(a) * (0.08 + r * 1.2),
    };
  });
}

function makeStateB(count: number): Point[] {
  return Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    const y = 0.2 + 0.65 * (1 - t);
    return {
      x: 0.08 + t * 0.84,
      y: y + Math.sin(t * Math.PI * 6) * 0.09,
    };
  });
}

function makeStateC(count: number, seedHash: number): Point[] {
  const base = (seedHash % 37) / 37;
  return Array.from({ length: count }, (_, i) => {
    const t = i / count;
    const arm = i % 3;
    return {
      x: 0.5 + (t - 0.5) * (arm === 0 ? 0.9 : arm === 1 ? -0.65 : 0.35),
      y: 0.5 + Math.sin((t + base) * Math.PI * (arm + 2)) * 0.28,
    };
  });
}

function mix(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function scrambleWord(word: string, revealCount: number) {
  return word
    .split("")
    .map((c, i) => (i < revealCount ? c : SCRAMBLE_CHARS[(i * 7 + revealCount * 11) % SCRAMBLE_CHARS.length]))
    .join("");
}

export function BuildSigilDiagram({
  className,
  seed,
  words,
  mode = "poignant",
}: BuildSigilDiagramProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [labelIndex, setLabelIndex] = useState(0);
  const [scrambleFrame, setScrambleFrame] = useState(0);
  const seedHash = useMemo(() => hashSeed(seed), [seed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const stateA = makeStateA(54);
    const stateB = makeStateB(54);
    const stateC = makeStateC(54, seedHash);

    let frame = 0;
    let raf = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      frame += 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      const t = (frame * 0.0035 + (seedHash % 100) * 0.0005) % 3;
      const phase = Math.floor(t);
      const local = easeInOut(t % 1);

      const from = phase === 0 ? stateA : phase === 1 ? stateB : stateC;
      const to = phase === 0 ? stateB : phase === 1 ? stateC : stateA;
      const points = from.map((p, i) => ({
        x: mix(p.x, to[i].x, local) * w,
        y: mix(p.y, to[i].y, local) * h,
      }));

      ctx.strokeStyle = "oklch(0.65 0.3 var(--sfx-theme-hue) / 0.35)";
      ctx.lineWidth = mode === "poignant" ? 1.1 : 0.9;
      for (let i = 0; i < points.length - 1; i += 1) {
        const a = points[i];
        const b = points[i + 1];
        if (i % 3 === 0) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Secondary brutalist sigil connectors
      ctx.strokeStyle = "oklch(0.145 0 0 / 0.35)";
      for (let i = 0; i < points.length; i += 9) {
        const a = points[i];
        const b = points[(i + 23) % points.length];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // Points
      for (let i = 0; i < points.length; i += 1) {
        const p = points[i];
        const r = i % 7 === 0 ? 2.3 : 1.1;
        ctx.fillStyle = i % 7 === 0 ? "oklch(0.65 0.3 var(--sfx-theme-hue) / 0.85)" : "oklch(0.145 0 0 / 0.6)";
        ctx.fillRect(p.x - r / 2, p.y - r / 2, r, r);
      }

      // Light glyph placement
      ctx.fillStyle = "oklch(0.145 0 0 / 0.45)";
      ctx.font = "10px var(--sfx-font-mono), monospace";
      for (let i = 0; i < 6; i += 1) {
        const p = points[(i * 8 + 3) % points.length];
        ctx.fillText(GLYPHS[(i + phase) % GLYPHS.length], p.x + 4, p.y - 3);
      }

      // Medium dither: concentrated in two poignant regions
      const ditherStep = mode === "poignant" ? 3 : 4;
      for (let y = 0; y < h; y += ditherStep) {
        for (let x = 0; x < w; x += ditherStep) {
          const d1 = Math.hypot(x - w * 0.32, y - h * 0.36);
          const d2 = Math.hypot(x - w * 0.72, y - h * 0.64);
          const emphasis = Math.max(0, 1 - Math.min(d1, d2) / (mode === "poignant" ? 190 : 140));
          if (emphasis <= 0.08) continue;
          if (((x + y + frame) / ditherStep) % 2 < 1) {
            ctx.fillStyle = `oklch(0.145 0 0 / ${0.03 + emphasis * 0.08})`;
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }

      raf = window.requestAnimationFrame(draw);
    };

    raf = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [mode, seedHash]);

  useEffect(() => {
    const labelTimer = window.setInterval(() => {
      setLabelIndex((i) => (i + 1) % Math.max(1, words.length));
      setScrambleFrame(0);
    }, 2200);
    const scrambleTimer = window.setInterval(() => {
      setScrambleFrame((n) => (n + 1) % 12);
    }, 70);
    return () => {
      window.clearInterval(labelTimer);
      window.clearInterval(scrambleTimer);
    };
  }, [words.length]);

  const currentWord = words[labelIndex] ?? "SIGNAL";
  const reveal = Math.min(currentWord.length, scrambleFrame);
  const scrambled = scrambleWord(currentWord, reveal);

  return (
    <div className={`relative overflow-hidden border border-foreground/30 bg-background ${className ?? ""}`}>
      <canvas ref={canvasRef} className="block h-full w-full" aria-hidden="true" />
      <div className="pointer-events-none absolute left-[var(--sfx-space-3)] top-[var(--sfx-space-3)] font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
        {seed}
      </div>
      <div className="pointer-events-none absolute right-[var(--sfx-space-3)] bottom-[var(--sfx-space-3)] font-mono text-[10px] uppercase tracking-[0.08em] text-primary">
        {scrambled}
      </div>
      <div className="pointer-events-none absolute left-[var(--sfx-space-3)] bottom-[var(--sfx-space-3)] font-mono text-[9px] text-muted-foreground">
        {mode === "poignant" ? "::SIGIL-MORPH::01" : "::AUX-TRACE::"}
      </div>
    </div>
  );
}
