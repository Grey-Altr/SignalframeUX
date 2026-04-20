"use client";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { SharedGroups } from "./pointcloud-ring";

/**
 * IrisCloud — an inward-drifting pointcloud that fills the annular region
 * between `innerRadius` (the pupil, kept empty) and `outerRadius` (just
 * inside the main ring). Each particle has a random phase and drift speed,
 * so the cloud reads as a continuous stream flowing toward the pupil.
 *
 * Paired with PointcloudRing: mount both inside the same sized wrapper
 * with IrisCloud first so the iris paints behind the main ring. When a
 * shared `groups` table is passed to both, their angular wedges carry
 * coherent intensity/fade — a dim wedge on the ring reads as dim on the
 * iris at the same angle.
 */
export function IrisCloud({
  count = 800,
  outerRadius = 0.36,
  innerRadius = 0.06,
  trail = 0,
  pixelSort = 0,
  sortThreshold = 20,
  groups,
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
  // Optional shared angular-group table (intensity + fade per wedge). When
  // provided, each iris particle looks up its group by angular position so
  // the iris's alpha modulation matches the ring at every angle.
  groups?: SharedGroups;
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

    // Theme-aware particle color. Mirrors the pattern in pointcloud-ring so
    // both canvases flip between the dark-mode cream and light-mode grey as
    // `<html>.class` toggles. Cached per mount; observer re-resolves on change.
    let particleLCH =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--sf-hero-particle-lch")
        .trim() || "0.96 0.01 90";
    const themeObserver = new MutationObserver(() => {
      particleLCH =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--sf-hero-particle-lch")
          .trim() || particleLCH;
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Per-particle state: angular position, phase offset along the inward
    // life cycle, per-particle drift speed multiplier for depth, and a
    // groupIdx into the shared group table (resolved from theta). The draw
    // loop reads intensity × fade live each frame so re-rolls of group
    // traits propagate immediately. groupIdx is -1 when no shared table
    // is provided; the draw loop then treats the modulation as 1.
    const groupCount = groups?.intensity.length ?? 0;
    const pts = Array.from({ length: count }, () => {
      const theta = Math.random() * Math.PI * 2;
      const groupIdx = groupCount > 0
        ? Math.floor((theta / (Math.PI * 2)) * groupCount) % groupCount
        : -1;
      return {
        theta,
        phase: Math.random(),
        speed: 0.6 + Math.random() * 0.8,
        groupIdx,
      };
    });

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let frameIdx = 0;
    // Shift start back by the warm-up window so real-time `now` picks up
    // smoothly where the synthetic warm-up frames left off. 180 frames ≈
    // 3s of simulated time — lets the pixel-sort streaks fully develop
    // synchronously before first paint, so the canvas appears with mature
    // sort saturation on page load.
    const WARMUP_FRAMES = 180;
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
      ctx.fillStyle = `oklch(${particleLCH} / 0.3)`;
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
        const groupMul = p.groupIdx >= 0 && groups
          ? groups.intensity[p.groupIdx] * groups.fade[p.groupIdx]
          : 1;
        ctx.globalAlpha = edgeFade * groupMul;
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
        // Wrap the ImageData buffer as Uint32 once so runs can be sorted
        // in-place via typed-array subarrays — no per-run allocation. On LE
        // systems each u32 packs (A << 24) | (B << 16) | (G << 8) | R, so
        // `v >>> 24` is the alpha byte used as sort key (matches original
        // big-endian DataView path: `(BE value) & 0xff` == A).
        const u32 = new Uint32Array(data.buffer, data.byteOffset, W * rowCount);
        const cmpAsc = (a: number, b: number) => (a >>> 24) - (b >>> 24);
        const cmpDesc = (a: number, b: number) => (b >>> 24) - (a >>> 24);

        for (let y = 0; y < rowCount; y++) {
          const rowBaseU32 = y * W;
          const rowBaseBytes = y * W * 4;
          const cmp = ((rowStart + y) & 1) ? cmpDesc : cmpAsc;
          let runStart = -1;
          for (let x = 0; x <= W; x++) {
            const bright =
              x < W && data[rowBaseBytes + x * 4 + 3] > sortThreshold;
            if (bright && runStart === -1) {
              runStart = x;
            } else if (!bright && runStart !== -1) {
              u32.subarray(rowBaseU32 + runStart, rowBaseU32 + x).sort(cmp);
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

    // rAF is gated by IntersectionObserver — only runs while the canvas is
    // in (or near) the viewport. Animation state persists; t keeps advancing
    // with wall-clock so radial drift phase matches uninterrupted motion.
    let running = false;
    const tick = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(tick);
    };
    const startAnim = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stopAnim = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) startAnim();
        else stopAnim();
      },
      { rootMargin: "200px" },
    );
    io.observe(canvas);

    return () => {
      stopAnim();
      io.disconnect();
      window.removeEventListener("resize", resize);
      themeObserver.disconnect();
    };
  }, [count, outerRadius, innerRadius, trail, pixelSort, sortThreshold, groups]);

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
