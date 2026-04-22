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
 * iris at the same angle. Re-rolls fan out via the
 * `sf-hero-shared-groups` BroadcastChannel (EntrySection broadcasts,
 * every hero worker subscribes).
 *
 * Render pipeline runs in a dedicated Web Worker via
 * canvas.transferControlToOffscreen() so particle update + pixel-sort
 * never touch the main thread.
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

    let offscreen: OffscreenCanvas;
    try {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      offscreen = canvas.transferControlToOffscreen();
    } catch {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const particleLCH =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--sf-hero-particle-lch")
        .trim() || "0.96 0.01 90";

    const worker = new Worker(
      new URL("./iris-cloud-worker.ts", import.meta.url),
      { type: "module" },
    );

    worker.postMessage(
      {
        type: "init",
        canvas: offscreen,
        config: {
          count,
          outerRadius,
          innerRadius,
          trail,
          pixelSort,
          sortThreshold,
          dpr,
          particleLCH,
          groups: groups ?? null,
          reduced,
        },
      },
      [offscreen],
    );

    const themeObserver = new MutationObserver(() => {
      const lch =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--sf-hero-particle-lch")
          .trim();
      if (lch) worker.postMessage({ type: "updateLCH", particleLCH: lch });
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const resize = () => {
      worker.postMessage({
        type: "resize",
        width: canvas.clientWidth,
        height: canvas.clientHeight,
        dpr: window.devicePixelRatio || 1,
      });
    };
    window.addEventListener("resize", resize);

    // Combined gate: ioVisible && !document.hidden — IO catches scroll-offscreen,
    // visibilitychange catches tab-switch / backgrounded tab (battery saver on mobile).
    let ioVisible = false;
    const syncVisibility = () => {
      worker.postMessage({
        type: "visibility",
        visible: ioVisible && !document.hidden,
      });
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        ioVisible = entry.isIntersecting;
        syncVisibility();
      },
      { rootMargin: "200px" },
    );
    io.observe(canvas);
    document.addEventListener("visibilitychange", syncVisibility);

    return () => {
      worker.terminate();
      themeObserver.disconnect();
      window.removeEventListener("resize", resize);
      io.disconnect();
      document.removeEventListener("visibilitychange", syncVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
