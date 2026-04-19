"use client";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function PointcloudRing({
  count = 2400,
  radius = 0.38,
  className,
}: {
  count?: number;
  radius?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const pts = Array.from({ length: count }, () => {
      const theta = Math.random() * Math.PI * 2;
      const rJitter = (Math.random() - 0.5) * 0.04;
      return { theta, rJitter };
    });

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    const start = performance.now();
    const draw = (now: number) => {
      const t = (now - start) / 1000;
      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;
      const breath = 1 + Math.sin(t * 0.3) * 0.04;
      const rot = reduced ? 0 : t * 0.12;
      const r = Math.min(W, H) * radius * breath;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "oklch(0.96 0.01 90 / 0.75)";
      for (const p of pts) {
        const x = cx + Math.cos(p.theta + rot) * (r + p.rJitter * r);
        const y = cy + Math.sin(p.theta + rot) * (r + p.rJitter * r);
        ctx.fillRect(x, y, 1.2 * dpr, 1.2 * dpr);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [count, radius]);

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
