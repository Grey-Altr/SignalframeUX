"use client";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * IrisCloud — an inward-drifting pointcloud that fills the annular region
 * between `innerRadius` (the pupil, kept empty) and `outerRadius` (just
 * inside the main ring). Each particle has a random phase and drift speed,
 * so the cloud reads as a continuous stream flowing toward the pupil.
 *
 * Paired with PointcloudRing: mount both inside the same sized wrapper
 * with IrisCloud first so the iris paints behind the main ring.
 */
export function IrisCloud({
  count = 800,
  outerRadius = 0.36,
  innerRadius = 0.06,
  trail = 0,
  pixelSort = 0,
  sortThreshold = 20,
  className,
}: {
  count?: number;
  outerRadius?: number;
  innerRadius?: number;
  // Per-frame fade alpha (0 = hard clear; 0.05–0.15 subtle decay trails).
  trail?: number;
  // Fraction of canvas rows to pixel-sort per frame, rotating through the
  // canvas over time (0 = off; 0.33 = sort 1/3 of rows each frame). Sort
  // key is alpha, so trails (dimmer) pull to one end of each bright run.
  pixelSort?: number;
  // Alpha threshold (0-255) below which pixels are excluded from sort runs.
  sortThreshold?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;
    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    // Per-particle state: angular position, phase offset along the inward
    // life cycle, and a per-particle drift speed multiplier for depth.
    const pts = Array.from({ length: count }, () => ({
      theta: Math.random() * Math.PI * 2,
      phase: Math.random(),
      speed: 0.6 + Math.random() * 0.8,
    }));

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let frameIdx = 0;
    // Shift start back by the warm-up window so real-time `now` picks up
    // smoothly where the synthetic warm-up frames left off.
    const WARMUP_FRAMES = 20;
    const FRAME_MS = 1000 / 60;
    const start = performance.now() - WARMUP_FRAMES * FRAME_MS;
    const draw = (now: number) => {
      frameIdx++;
      const t = (now - start) / 1000;
      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;
      const rOuter = Math.min(W, H) * outerRadius;
      const rInner = Math.min(W, H) * innerRadius;

      if (trail > 0) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = `rgba(0, 0, 0, ${trail})`;
        ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = "source-over";
      } else {
        ctx.clearRect(0, 0, W, H);
      }
      ctx.fillStyle = "oklch(0.96 0.01 90 / 0.3)";
      for (const p of pts) {
        // life ∈ [0, 1). 0 → just spawned at outer edge; near 1 → near pupil.
        const life = reduced
          ? p.phase
          : (p.phase + t * p.speed * 0.04) % 1;
        // Fade to zero as particles approach the pupil so disappearance is
        // graceful rather than a hard pop when they wrap.
        const edgeFade = life < 0.9 ? 1 : (1 - life) / 0.1;
        const r01 = 1 - life;
        const r = rInner + (rOuter - rInner) * r01;
        // Fixed angle per particle → motion is purely radial (straight line
        // from spawn at the outer edge toward the pupil at the center).
        const x = cx + Math.cos(p.theta) * r;
        const y = cy + Math.sin(p.theta) * r;
        ctx.globalAlpha = edgeFade;
        ctx.fillRect(x, y, 1 * dpr, 1 * dpr);
      }
      ctx.globalAlpha = 1;

      // Horizontal row-sort pass, throttled & rotating.
      // Only sorts a subset of rows per frame; sort key is alpha so
      // bright fresh particles separate from dim trail pixels within
      // each contiguous run above `sortThreshold`.
      if (pixelSort > 0 && !reduced) {
        const chunkSize = Math.max(1, Math.round(H * pixelSort));
        const rowStart = (frameIdx * chunkSize) % H;
        const rowEnd = Math.min(H, rowStart + chunkSize);
        const rowCount = rowEnd - rowStart;
        const img = ctx.getImageData(0, rowStart, W, rowCount);
        const data = img.data;
        const stride = W * 4;

        for (let y = 0; y < rowCount; y++) {
          const rowBase = y * stride;
          let runStart = -1;
          for (let x = 0; x <= W; x++) {
            const bright =
              x < W && data[rowBase + x * 4 + 3] > sortThreshold;
            if (bright && runStart === -1) {
              runStart = x;
            } else if (!bright && runStart !== -1) {
              // Irregularity: skip ~25% of runs randomly so streaks flicker
              // across frames instead of refreshing uniformly each pass.
              if (Math.random() < 0.75) {
                // Per-run random direction (replaces row-parity pattern) —
                // adjacent runs on the same row can drag in opposite
                // directions, breaking the clean alternating stripe look.
                const dir = Math.random() < 0.5 ? 1 : -1;
                const runLen = x - runStart;
                const buf = new Uint32Array(runLen);
                const view = new DataView(
                  data.buffer,
                  data.byteOffset + rowBase + runStart * 4,
                  runLen * 4,
                );
                for (let i = 0; i < runLen; i++) buf[i] = view.getUint32(i * 4);
                buf.sort((a, b) => dir * ((a & 0xff) - (b & 0xff)));
                for (let i = 0; i < runLen; i++) view.setUint32(i * 4, buf[i]);
              }
              runStart = -1;
            }
          }
        }
        ctx.putImageData(img, 0, rowStart);
      }
    };

    // Warm up: pre-run WARMUP_FRAMES of draw synchronously so the canvas has
    // accumulated trails + sort streaks before first visible frame.
    for (let i = 0; i < WARMUP_FRAMES; i++) {
      draw(start + i * FRAME_MS);
    }

    const tick = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [count, outerRadius, innerRadius, trail, pixelSort, sortThreshold]);

  return (
    <canvas
      ref={ref}
      data-plate="kloroform-iris"
      role="img"
      aria-label="KLOROFORM-style iris pointcloud drifting toward the pupil"
      className={cn("block h-full w-full", className)}
    />
  );
}
