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
  // Re-roll updates flow through the `sf-hero-shared-groups` BroadcastChannel
  // (owned by EntrySection) so every worker on the page stays coherent.
  groups?: SharedGroups;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    // Transfer is one-shot per canvas element. OffscreenCanvas support is
    // required (Chromium, Safari 16.4+, Firefox 105+). No graceful fallback
    // — the render pipeline is worker-only now.
    let offscreen: OffscreenCanvas;
    try {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      offscreen = canvas.transferControlToOffscreen();
    } catch {
      // Strict-mode double-mount in dev lands here on the second mount —
      // canvas already transferred to a since-terminated worker. Leave
      // blank; prod build renders once and this path is unreached.
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
      new URL("./pointcloud-ring-worker.ts", import.meta.url),
      { type: "module" },
    );

    worker.postMessage(
      {
        type: "init",
        canvas: offscreen,
        config: {
          count,
          radius,
          trail,
          pixelSort,
          sortThreshold,
          borderRadius,
          borderAlpha,
          dpr,
          particleLCH,
          groups: groups ?? null,
          reduced,
        },
      },
      [offscreen],
    );

    // Theme observer — forward particle colour changes to the worker.
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

    // Visibility gating stays on main thread — IO fires on the DOM element,
    // not the transferred OffscreenCanvas. Worker pauses its rAF on request.
    // Combined gate: `ioVisible && !document.hidden` — IO catches scroll-offscreen,
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
    // Worker is a one-shot resource keyed to the initial prop snapshot;
    // transferControlToOffscreen is illegal to call twice, so we never
    // re-init on prop change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
