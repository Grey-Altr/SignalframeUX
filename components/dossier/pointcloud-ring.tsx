"use client";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function PointcloudRing({
  count = 2400,
  radius = 0.38,
  trail = 0,
  pixelSort = 0,
  sortThreshold = 20,
  borderRadius = 0,
  borderAlpha = 0.4,
  className,
}: {
  count?: number;
  radius?: number;
  // Per-frame fade alpha for particle trails (0 = hard clear / no trail,
  // 0.05–0.15 gives a subtle decay, 0.3+ feels aggressive).
  trail?: number;
  // Fraction of canvas rows to pixel-sort per frame, rotating through the
  // canvas over time (0 = off; 0.33 = sort 1/3 of rows each frame).
  pixelSort?: number;
  // Alpha threshold (0-255) below which pixels are excluded from sort runs.
  sortThreshold?: number;
  // Optional thin stroked circle drawn at this fraction of canvas size,
  // concentric with the ring. 0 = no border. Useful as an outer frame
  // enclosing the particle ring at a larger radius.
  borderRadius?: number;
  // Alpha for the border stroke (0-1).
  borderAlpha?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // DPR read inside resize so canvas stays crisp across monitor / zoom changes.
    let dpr = window.devicePixelRatio || 1;
    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const pts = Array.from({ length: count }, () => {
      const theta = Math.random() * Math.PI * 2;
      // Penta-modal radial distribution — five nested bands growing outward:
      //   core   [-0.02, 0.02]   — dense core (~43% of particles)
      //   halo   [0.022, 0.14]   — sparse, 1px outside core (~14%)
      //   outer1 [0.142, 0.378]  — 2× halo width, 75% halo density (~21%)
      //   outer2 [0.380, 0.616]  — same width as outer1, 50% its density (~11%)
      //   outer3 [0.618, 1.090]  — 2× outer2 width, 50% its density (~11%)
      // outer3 reaches pr ≈ 0.895 × canvasR — only horizontal rendering
      // fits on the viewport-wide canvas; vertical/diagonal clipping grows
      // progressively across outer bands.
      const bucket = Math.random();
      let rJitter;
      if (bucket < 0.4286) {
        rJitter = (Math.random() - 0.5) * 0.04;
      } else if (bucket < 0.5714) {
        rJitter = 0.022 + Math.random() * 0.118;
      } else if (bucket < 0.7857) {
        rJitter = 0.142 + Math.random() * 0.236;
      } else if (bucket < 0.8929) {
        rJitter = 0.380 + Math.random() * 0.236;
      } else {
        rJitter = 0.618 + Math.random() * 0.472;
      }
      return { theta, rJitter };
    });

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let frameIdx = 0;
    // Shift start back by the warm-up window so real-time `now` picks up
    // smoothly where the synthetic warm-up frames left off (breath + rotation
    // don't jump backward).
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
      // Thickness is locked to a reference radius (0.42) so the ring can
      // grow via `radius` without also getting thicker — rJitter and breath
      // below both use `thicknessScale`, not `r`.
      const canvasR = Math.min(W, H);
      const thicknessScale = canvasR * 0.42;
      const breath = Math.sin(t * 0.05) * 0.04 * thicknessScale;
      const rot = reduced ? 0 : t * 0.03;
      const r = canvasR * radius;

      if (trail > 0) {
        // Fade previous frame via destination-out: erases existing alpha by
        // `trail` without adding black pixels, so canvas stays transparent
        // between particles and the backdrop (GLSL hero) shows through.
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = `rgba(0, 0, 0, ${trail})`;
        ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = "source-over";
      } else {
        ctx.clearRect(0, 0, W, H);
      }
      ctx.fillStyle = "oklch(0.96 0.01 90 / 0.75)";
      for (const p of pts) {
        // Particle radius = base ring radius + breath oscillation + per-particle
        // jitter. Both oscillation and jitter are absolute pixel offsets scaled
        // by `thicknessScale`, so thickness stays constant as `radius` grows.
        const pr = r + breath + p.rJitter * thicknessScale;
        const x = cx + Math.cos(p.theta + rot) * pr;
        const y = cy + Math.sin(p.theta + rot) * pr;
        ctx.fillRect(x, y, 1 * dpr, 1 * dpr);
      }

      // Optional outer border — rendered as a multi-stroke band with a
      // triangular alpha profile (dim → bright → dim across thickness) so
      // the downstream pixel-sort pass has alpha variation per row crossing
      // to drag horizontally. A single uniform stroke would sort into itself
      // (no visible effect); the gradient band gives sort meaningful runs.
      if (borderRadius > 0) {
        const layers = 7;
        const spanPx = 3; // half-thickness in CSS px; ±3 × dpr physical
        for (let i = 0; i < layers; i++) {
          const norm = (i - (layers - 1) / 2) / ((layers - 1) / 2); // -1..1
          const offsetPx = norm * spanPx * dpr;
          const alpha = (1 - Math.abs(norm)) * borderAlpha;
          if (alpha <= 0.02) continue;
          ctx.strokeStyle = `oklch(0.96 0.01 90 / ${alpha.toFixed(3)})`;
          ctx.lineWidth = 1 * dpr;
          ctx.beginPath();
          ctx.arc(cx, cy, canvasR * borderRadius + offsetPx, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Horizontal row-sort pass, throttled & rotating.
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
          // Bidirectional: alternate sort direction per absolute row so
          // consecutive rows pull bright pixels in opposite directions.
          const dir = ((rowStart + y) & 1) ? -1 : 1;
          let runStart = -1;
          for (let x = 0; x <= W; x++) {
            const bright =
              x < W && data[rowBase + x * 4 + 3] > sortThreshold;
            if (bright && runStart === -1) {
              runStart = x;
            } else if (!bright && runStart !== -1) {
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
              runStart = -1;
            }
          }
        }
        ctx.putImageData(img, 0, rowStart);
      }
    };

    // Warm up: pre-run WARMUP_FRAMES of draw synchronously so the canvas has
    // accumulated trails + sort streaks before the user ever sees it. No
    // fade-in from empty.
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
  }, [count, radius, trail, pixelSort, sortThreshold, borderRadius, borderAlpha]);

  return (
    <canvas
      ref={ref}
      data-plate="kloroform-pointcloud"
      role="img"
      aria-label="KLOROFORM-style dissolving ring pointcloud"
      className={cn("block h-full w-full", className)}
    />
  );
}
