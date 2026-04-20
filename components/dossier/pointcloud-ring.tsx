"use client";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export type SharedGroups = {
  intensity: Float32Array;
  fade: Float32Array;
};

export function PointcloudRing({
  count = 2400,
  radius = 0.38,
  trail = 0,
  pixelSort = 0,
  sortThreshold = 20,
  borderRadius = 0,
  borderAlpha = 0.4,
  groups,
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
  // Optional shared angular-group table (intensity + fade per wedge). When
  // provided, the component looks up its particles' group by angular
  // position using `groups.intensity.length` as the wedge count. Lets the
  // ring share group traits with IrisCloud for coherent cross-component
  // wedge modulation. When omitted, falls back to internal random groups.
  groups?: SharedGroups;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Offscreen buffer holds only the "smeared" layer: non-reset particles +
    // border + trail-fade + sort pass. The visible canvas is cleared each
    // frame, then offscreen is drawImage'd on and reset particles stamp on
    // top — so reset-particle pixels never enter any sort pass (including
    // across frames), fully isolating them from the sort effect.
    const offscreen = document.createElement("canvas");
    const offCtx = offscreen.getContext("2d");
    if (!offCtx) return;

    // DPR read inside resize so canvas stays crisp across monitor / zoom changes.
    let dpr = window.devicePixelRatio || 1;
    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      offscreen.width = canvas.width;
      offscreen.height = canvas.height;
    };
    resize();
    window.addEventListener("resize", resize);

    // Theme-aware particle color. Canvas 2D fillStyle strings can't reference
    // CSS var() — we resolve --sf-hero-particle-lch once and re-resolve only
    // when `<html>.class` flips (light ↔ dark). Cached as a plain string so
    // the per-frame template literal interpolation is free.
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

    // Shared groups (from prop) take priority — they let angular wedges
    // carry coherent intensity/fade across ring + iris. When no shared table
    // is passed, fall back to an internally generated one sized by count.
    const groupIntensity = groups?.intensity
      ?? (() => {
        const arr = new Float32Array(Math.ceil(count / 33));
        for (let g = 0; g < arr.length; g++) {
          arr[g] = Math.random() < 0.33 ? 0.4 + Math.random() * 1.2 : 1.0;
        }
        return arr;
      })();
    const groupFade = groups?.fade
      ?? (() => {
        const arr = new Float32Array(Math.ceil(count / 33));
        for (let g = 0; g < arr.length; g++) {
          arr[g] = Math.random() < 0.33 ? 0.3 + Math.random() * 0.4 : 1.0;
        }
        return arr;
      })();
    const GROUP_COUNT = groupIntensity.length;
    const GROUP_SLICE = (Math.PI * 2) / GROUP_COUNT;
    const GROUP_SPREAD = 0.5; // fraction of slice each group occupies
    // sortReset feature plumbing retained for reversible disable; currently
    // zeroed so every particle participates in the sort pass at full strength.
    const groupSortReset = new Uint8Array(GROUP_COUNT);
    const pts = Array.from({ length: count }, (_, i) => {
      // Angular clustering: particles are distributed evenly across
      // GROUP_COUNT groups, each group anchored at an evenly-spaced theta
      // around the ring. Within a group, particles jitter by ± (slice ×
      // spread / 2). GROUP_COUNT is driven by the shared groups table when
      // provided so angular wedges align with iris.
      const groupIdx = Math.floor((i * GROUP_COUNT) / count);
      const groupCenter = groupIdx * GROUP_SLICE;
      const theta = groupCenter + (Math.random() - 0.5) * GROUP_SLICE * GROUP_SPREAD;
      // Hexa-modal radial distribution — six nested bands growing outward:
      //   core   [-0.02, 0.02]   — dense core (~18% of particles)
      //   halo   [0.022, 0.14]   — sparse, 1px outside core (~11%)
      //   outer1 [0.142, 0.378]  — 2× halo width (~18%)
      //   outer2 [0.380, 0.616]  — same width as outer1 (~10%)
      //   outer3 [0.618, 1.090]  — 2× outer2 width, highest bucket share (~34%)
      //   outer4 [1.090, 1.560]  — same width as outer3, 75% less dense (~9%)
      // outer3 / outer4 both extend past the square container: outer3 max
      // pr ≈ 0.878×canvasR, outer4 max pr ≈ 1.075×canvasR — only a
      // horizontal slice renders on landscape viewports; vertical/diagonal
      // clipping grows progressively across outer bands.
      const bucket = Math.random();
      let rJitter;
      // Core (band 1), outer1 (band 3), and outer4 (band 6) rotate
      // counter-clockwise; halo, outer2, outer3 co-rotate clockwise with
      // the global `rot`. The alternating direction gives the ring a
      // nested, differential feel.
      let rotDir = 1;
      if (bucket < 0.18) {
        rJitter = (Math.random() - 0.5) * 0.04;
        rotDir = -1;
      } else if (bucket < 0.29) {
        rJitter = 0.022 + Math.random() * 0.118;
      } else if (bucket < 0.47) {
        rJitter = 0.142 + Math.random() * 0.236;
        rotDir = -1;
      } else if (bucket < 0.57) {
        rJitter = 0.380 + Math.random() * 0.236;
      } else if (bucket < 0.91) {
        rJitter = 0.618 + Math.random() * 0.472;
      } else {
        rJitter = 1.090 + Math.random() * 0.470;
        rotDir = -1;
      }
      // sortReset gated to inner 3 bands (core / halo / outer1). outer2 and
      // outer3 stay in the sort pass so their streaks remain intact.
      const sortReset = groupSortReset[groupIdx] === 1 && rJitter < 0.380;
      // groupIdx is stored (not the cached intensity/fade values) so the
      // draw loop reads live from the shared arrays — this makes re-rolls
      // of group traits take effect immediately.
      return { theta, rJitter, groupIdx, rotDir, sortReset };
    });

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let frameIdx = 0;
    // Shift start back by the warm-up window so real-time `now` picks up
    // smoothly where the synthetic warm-up frames left off (breath + rotation
    // don't jump backward). 180 frames ≈ 3s of simulated time — lets the
    // pixel-sort streaks fully develop synchronously before first paint, so
    // the canvas appears with mature sort saturation on page load.
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
        offCtx.globalCompositeOperation = "destination-out";
        offCtx.fillStyle = `rgba(0, 0, 0, ${trail})`;
        offCtx.fillRect(0, 0, W, H);
        offCtx.globalCompositeOperation = "source-over";
      } else {
        offCtx.clearRect(0, 0, W, H);
      }
      offCtx.fillStyle = `oklch(${particleLCH} / 0.75)`;
      // Main layer: draw every particle NOT flagged as sortReset onto the
      // offscreen buffer. These pixels enter the sort pass below and get
      // smeared into streaks.
      for (const p of pts) {
        if (p.sortReset) continue;
        // Particle radius = base ring radius + breath oscillation + per-particle
        // jitter. Both oscillation and jitter are absolute pixel offsets scaled
        // by `thicknessScale`, so thickness stays constant as `radius` grows.
        const pr = r + breath + p.rJitter * thicknessScale;
        const angle = p.theta + rot * p.rotDir;
        const x = cx + Math.cos(angle) * pr;
        const y = cy + Math.sin(angle) * pr;
        // Outer3 (rJitter ≥ 0.618) is dimmed vs. inner bands but sits at
        // 0.76× (0.4 × 1.9) so it still crosses sortThreshold strongly and
        // contributes 90% more pixels to the sort pass than the haze setting.
        const bandMul = p.rJitter >= 0.618 ? 0.76 : 1.0;
        offCtx.globalAlpha = groupIntensity[p.groupIdx] * groupFade[p.groupIdx] * bandMul;
        offCtx.fillRect(x, y, 1 * dpr, 1 * dpr);
      }
      offCtx.globalAlpha = 1;

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
          offCtx.strokeStyle = `oklch(${particleLCH} / ${alpha.toFixed(3)})`;
          offCtx.lineWidth = 1 * dpr;
          offCtx.beginPath();
          offCtx.arc(cx, cy, canvasR * borderRadius + offsetPx, 0, Math.PI * 2);
          offCtx.stroke();
        }
      }

      // Horizontal row-sort pass, throttled & rotating — runs on offscreen
      // buffer, which contains ONLY non-reset particles + border. Reset
      // particles are drawn after this composite step and never visible here.
      if (pixelSort > 0 && !reduced) {
        const chunkSize = Math.max(1, Math.round(H * pixelSort));
        const rowStart = (frameIdx * chunkSize) % H;
        const rowEnd = Math.min(H, rowStart + chunkSize);
        const rowCount = rowEnd - rowStart;
        const img = offCtx.getImageData(0, rowStart, W, rowCount);
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
        offCtx.putImageData(img, 0, rowStart);
      }

      // Composite: clear visible canvas fully, blit the offscreen (smeared)
      // layer, then stamp reset particles on top. Reset particles have no
      // persistence on the visible canvas from previous frames (it was just
      // cleared) and no presence on the offscreen canvas (never drawn
      // there), so no sort pass ever touches their pixels.
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(offscreen, 0, 0);
      ctx.fillStyle = `oklch(${particleLCH} / 0.75)`;
      for (const p of pts) {
        if (!p.sortReset) continue;
        const pr = r + breath + p.rJitter * thicknessScale;
        const angle = p.theta + rot * p.rotDir;
        const x = cx + Math.cos(angle) * pr;
        const y = cy + Math.sin(angle) * pr;
        const bandMul = p.rJitter >= 0.618 ? 0.76 : 1.0;
        ctx.globalAlpha = groupIntensity[p.groupIdx] * groupFade[p.groupIdx] * bandMul;
        ctx.fillRect(x, y, 1 * dpr, 1 * dpr);
      }
      ctx.globalAlpha = 1;
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
      themeObserver.disconnect();
    };
  }, [count, radius, trail, pixelSort, sortThreshold, borderRadius, borderAlpha, groups]);

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
