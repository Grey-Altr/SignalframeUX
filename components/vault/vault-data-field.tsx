"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface VaultDataFieldProps {
  columns?: number;
  rows?: number;
  className?: string;
}

/*
 * Ikeda data field — live vertical columns of numbers that scroll at
 * per-column speeds. Every ~60 frames a small fraction of cells flip
 * to highlighted state (white on black) before fading. The composition
 * reads as incoming telemetry: no semantic meaning, just structured
 * noise that registers as "data under observation."
 *
 * Implementation is rAF-driven and contained in a single useEffect;
 * state lives in refs to avoid per-frame React reconciliation.
 * Rendered via canvas 2D for throughput — SVG at 10 cols × 32 rows ×
 * 60fps is reconciliation-unfriendly.
 */
export function VaultDataField({
  columns = 10,
  rows = 32,
  className,
}: VaultDataFieldProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const rafRef = React.useRef(0);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    const ro = new ResizeObserver(() => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      resize();
    });
    ro.observe(canvas);

    // per-column offsets (float) and per-cell glow intensity (0-1)
    const colOffsets = Array.from({ length: columns }, () => Math.random() * rows);
    const colSpeeds = Array.from({ length: columns }, () => 0.4 + Math.random() * 1.8);
    const glow = new Float32Array(columns * rows);

    const charFor = (col: number, row: number) => {
      // deterministic pseudo-random digit per cell coordinate
      const s = Math.sin(col * 17.3 + row * 11.7) * 10000;
      return Math.floor(Math.abs(s) % 10).toString();
    };

    let last = performance.now();
    const tick = () => {
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;

      const rect = canvas.getBoundingClientRect();
      const cw = rect.width / columns;
      const rh = rect.height / rows;

      ctx.clearRect(0, 0, rect.width, rect.height);

      // subtle bg ink
      ctx.fillStyle = "rgba(250,250,250,0.025)";
      ctx.fillRect(0, 0, rect.width, rect.height);

      ctx.font = `${Math.min(rh * 0.6, 14)}px var(--font-jetbrains), ui-monospace, monospace`;
      ctx.textBaseline = "middle";

      for (let c = 0; c < columns; c++) {
        colOffsets[c] = (colOffsets[c] + colSpeeds[c] * dt) % rows;
        // maybe promote one cell in this column to glow
        if (Math.random() < 0.04) {
          const r = Math.floor(Math.random() * rows);
          glow[c * rows + r] = 1;
        }
        for (let r = 0; r < rows; r++) {
          const scrollRow = (r + colOffsets[c]) % rows;
          const ch = charFor(c, Math.floor(scrollRow));
          const g = glow[c * rows + r];
          if (g > 0) {
            ctx.fillStyle = `rgba(189,255,0,${Math.min(1, g)})`;
            glow[c * rows + r] = Math.max(0, g - dt * 1.6);
          } else {
            ctx.fillStyle = "rgba(250,250,250,0.52)";
          }
          ctx.fillText(
            ch,
            c * cw + cw / 2 - 4,
            r * rh + rh / 2
          );
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [columns, rows]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("block w-full h-full", className)}
      aria-hidden="true"
    />
  );
}
