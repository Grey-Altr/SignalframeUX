"use client";
import { useEffect, useRef } from "react";

export function HalftoneCorrugated({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const reduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    let raf = 0;
    const start = performance.now();
    const draw = (now: number) => {
      const t = reduced ? 0 : (now - start) / 1000;
      const W = canvas.width;
      const H = canvas.height;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);

      const cols = 80;
      const rows = 32;
      const cw = W / cols;
      const rh = H / rows;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const wave = Math.sin((c / cols) * Math.PI * 4 + t * 1.1 + r * 0.2);
          const tilt = Math.sin((r / rows) * Math.PI * 2 - t * 0.4);
          const v = (wave + tilt) * 0.5; // -1..1
          const lightness = 0.5 + v * 0.5;
          const size = Math.max(0.2, Math.min(1, lightness)) * Math.min(cw, rh) * 0.9;
          ctx.fillStyle = `oklch(${0.85 * lightness} 0 0)`;
          ctx.fillRect(c * cw + (cw - size) / 2, r * rh + (rh - size) / 2, size, size);
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      data-plate="blackflag-halftone"
      role="img"
      aria-label="Black Flag E0000 corrugated halftone wave"
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
