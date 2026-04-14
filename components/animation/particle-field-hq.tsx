"use client";

/**
 * ParticleFieldHQ — High-density, tier-aware particle system (TouchDesigner Particle SOP).
 *
 * Upgraded version of particle-field.tsx with:
 *   - Tier-scaled particle count from effect-presets
 *   - Connection lines between nearby particles
 *   - Drift driven by --sfx-signal-intensity
 *   - Canvas2D renderer (no additional WebGL context needed)
 *
 * @module components/animation/particle-field-hq
 */

import { useRef, useEffect, useState } from "react";
import { getPreset, type QualityTier, getQualityTier } from "@/lib/effects";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
};

export type ParticleFieldHQProps = {
  className?: string;
  intensity?: number;
  count?: number;
  connectDistance?: number;
  particleColor?: string;
  lineColor?: string;
};

function readIntensity(): number {
  if (typeof document === "undefined") return 0.5;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--sfx-signal-intensity")
    .trim();
  const v = parseFloat(raw);
  return isNaN(v) ? 0.5 : v;
}

export function ParticleFieldHQ({
  className,
  intensity = 1,
  count: countOverride,
  connectDistance: distOverride,
  particleColor = "oklch(0.65 0.3 var(--sfx-theme-hue))",
  lineColor,
}: ParticleFieldHQProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tier] = useState<QualityTier>(() =>
    typeof window !== "undefined" ? getQualityTier() : "fallback"
  );

  useEffect(() => {
    if (tier === "fallback") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const preset = getPreset("particle");
    const pCount = countOverride ?? preset.count;
    const connectDist = distOverride ?? preset.connectDistance;

    if (pCount <= 0) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio, 2);

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const particles: Particle[] = [];
    for (let i = 0; i < pCount; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * preset.speed,
        vy: (Math.random() - 0.5) * preset.speed,
        size: preset.size * (0.5 + Math.random() * 0.5),
      });
    }

    const computedPrimary = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-primary")
      .trim();
    const pColor = particleColor.includes("var(") ? computedPrimary || "#ff00ff" : particleColor;
    const lColor = lineColor ?? pColor;

    let rafId = 0;
    let signalI = readIntensity();
    const signalInterval = setInterval(() => { signalI = readIntensity(); }, 500);

    function frame() {
      if (!ctx || w === 0) { rafId = requestAnimationFrame(frame); return; }
      ctx.clearRect(0, 0, w, h);

      const drift = preset.drift * intensity * signalI;
      const pOpacity = preset.opacity * intensity * Math.max(signalI, 0.2);

      for (const p of particles) {
        p.x += p.vx * drift * 2;
        p.y += p.vy * drift * 2;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
      }

      if (connectDist > 0) {
        ctx.strokeStyle = lColor;
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = dx * dx + dy * dy;
            const maxD = connectDist * connectDist;
            if (dist < maxD) {
              const alpha = (1 - dist / maxD) * pOpacity * 0.3;
              ctx.globalAlpha = alpha;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      ctx.fillStyle = pColor;
      for (const p of particles) {
        ctx.globalAlpha = pOpacity;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }

      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(frame);
    }

    rafId = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(signalInterval);
      ro.disconnect();
    };
  }, [tier, intensity, countOverride, distOverride, particleColor, lineColor]);

  if (tier === "fallback") return null;

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className ?? ""}`}
      aria-hidden="true"
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
