"use client";

import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; alpha: number };

/**
 * CanvasCursor — canvas-based crosshair + particle trail cursor.
 *
 * SIGNAL layer element. Scoped to sections with [data-cursor] attribute.
 * Hidden on touch/coarse-pointer devices. rAF loop pauses on tab hidden.
 * Color sourced from --color-primary CSS custom property.
 */
export function CanvasCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // AC-2: Exit early on touch/coarse-pointer devices — no listeners, no canvas
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // --- State refs (no re-render needed) ---
    const particles: Particle[] = [];
    const mousePos = { x: -9999, y: -9999 };
    let isActive = false;
    let activeSectionCount = 0;
    let rafId = 0;
    let primaryRgb = { r: 255, g: 0, b: 128 }; // magenta fallback

    // --- Resolve --color-primary to RGB once at mount ---
    // Canvas 2D context does not understand oklch() — parse via temp element trick
    (function resolvePrimaryColor() {
      try {
        const raw = getComputedStyle(document.documentElement)
          .getPropertyValue("--color-primary")
          .trim();
        if (!raw) return;

        // Offscreen 1×1 canvas trick: set fillStyle, draw, read pixel
        const probe = document.createElement("canvas");
        probe.width = 1;
        probe.height = 1;
        const pCtx = probe.getContext("2d");
        if (!pCtx) return;
        pCtx.fillStyle = raw;
        pCtx.fillRect(0, 0, 1, 1);
        const [r, g, b] = pCtx.getImageData(0, 0, 1, 1).data;
        primaryRgb = { r, g, b };
      } catch {
        // keep fallback magenta
      }
    })();

    // --- Canvas sizing with devicePixelRatio ---
    const dpr = window.devicePixelRatio || 1;

    function resizeCanvas() {
      if (!canvas) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resizeCanvas();

    // --- Render loop ---
    function render() {
      if (!ctx || !canvas) return;

      // Clear canvas each frame
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      if (!isActive) {
        rafId = requestAnimationFrame(render);
        return;
      }

      const { r, g, b } = primaryRgb;
      const mx = mousePos.x;
      const my = mousePos.y;

      // AC-4: Draw fading particle trail (oldest-first for correct painter order)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.alpha -= 0.02;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`;
        ctx.fill();
      }

      // AC-3: Draw crosshair — 4 lines, 24px from center, 1px stroke
      const ARM = 24;
      ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.lineWidth = 1;

      // Horizontal left arm
      ctx.beginPath();
      ctx.moveTo(mx - ARM, my);
      ctx.lineTo(mx - 4, my);
      ctx.stroke();

      // Horizontal right arm
      ctx.beginPath();
      ctx.moveTo(mx + 4, my);
      ctx.lineTo(mx + ARM, my);
      ctx.stroke();

      // Vertical top arm
      ctx.beginPath();
      ctx.moveTo(mx, my - ARM);
      ctx.lineTo(mx, my - 4);
      ctx.stroke();

      // Vertical bottom arm
      ctx.beginPath();
      ctx.moveTo(mx, my + 4);
      ctx.lineTo(mx, my + ARM);
      ctx.stroke();

      rafId = requestAnimationFrame(render);
    }

    rafId = requestAnimationFrame(render);

    // --- Mouse tracking + particle spawn ---
    function onMouseMove(e: MouseEvent) {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;

      if (isActive) {
        // Cap particles at 60 — remove oldest when over limit
        if (particles.length >= 60) {
          particles.shift();
        }
        particles.push({ x: e.clientX, y: e.clientY, alpha: 1.0 });
      }
    }

    // AC-6: IntersectionObserver for [data-cursor] section scoping
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-cursor]"));
    let observer: IntersectionObserver | null = null;

    if (sections.length > 0) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              activeSectionCount++;
            } else {
              activeSectionCount = Math.max(0, activeSectionCount - 1);
            }
          }
          isActive = activeSectionCount > 0;
        },
        { threshold: 0 }
      );

      sections.forEach((el) => observer!.observe(el));
    }
    // If no [data-cursor] sections exist, cursor stays inactive (canvas stays clear)

    // AC-5: Tab visibility — pause/resume rAF loop
    function onVisibilityChange() {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      } else {
        if (rafId === 0) {
          rafId = requestAnimationFrame(render);
        }
      }
    }

    function onResize() {
      resizeCanvas();
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("resize", onResize, { passive: true });

    // AC cleanup on unmount
    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", onResize);
      observer?.disconnect();
    };
  }, []);

  // AC-8: canvas styles — fixed, full-viewport, pointer-events none, z-index from token
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: "var(--z-cursor, 9999)" as unknown as number,
        width: "100vw",
        height: "100vh",
      }}
    />
  );
}
