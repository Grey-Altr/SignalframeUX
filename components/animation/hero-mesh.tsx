"use client";

import { useEffect, useRef, useCallback } from "react";

interface Node {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
}

const GRID_SPACING = 40;
const DOT_RADIUS = 1.2;
const DOT_OPACITY = 0.3;
const LINE_OPACITY = 0.08;
const MOUSE_RADIUS = 150;
const MOUSE_FORCE = 28;
const SINE_AMPLITUDE = 3;
const SINE_SPEED = 0.0008;

export function HeroMesh({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const nodesRef = useRef<Node[]>([]);
  const colsRef = useRef(0);
  const animRef = useRef<number>(0);
  const visibleRef = useRef(true);
  const reducedMotionRef = useRef(false);
  const sizeRef = useRef({ w: 0, h: 0 });

  const buildGrid = useCallback((width: number, height: number) => {
    const nodes: Node[] = [];
    const cols = Math.ceil(width / GRID_SPACING) + 2;
    const rows = Math.ceil(height / GRID_SPACING) + 2;
    colsRef.current = cols + 1; // account for c starting at -1
    for (let r = -1; r < rows; r++) {
      for (let c = -1; c < cols; c++) {
        const x = c * GRID_SPACING;
        const y = r * GRID_SPACING;
        nodes.push({ baseX: x, baseY: y, x, y });
      }
    }
    nodesRef.current = nodes;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mql.matches;
    const motionHandler = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
    };
    mql.addEventListener("change", motionHandler);

    function resize() {
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w, h };
      buildGrid(w, h);
    }

    resize();
    let resizeTimer: ReturnType<typeof setTimeout>;
    function debouncedResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    }
    window.addEventListener("resize", debouncedResize);

    function onMouseMove(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Only track when cursor is over the canvas area
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        mouseRef.current.x = x;
        mouseRef.current.y = y;
      } else {
        mouseRef.current.x = -9999;
        mouseRef.current.y = -9999;
      }
    }

    // Listen on document so z-index children don't block events — gated by visibility
    if (visibleRef.current) {
      document.addEventListener("mousemove", onMouseMove);
    }

    const startTime = performance.now();

    function draw(now: number) {
      if (!ctx || !canvas) return;
      // Skip drawing when offscreen — re-entry handled by IntersectionObserver
      if (!visibleRef.current) return;
      const { w, h } = sizeRef.current;
      ctx.clearRect(0, 0, w, h);

      const elapsed = now - startTime;
      const nodes = nodesRef.current;
      const cols = colsRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const isReduced = reducedMotionRef.current;

      // Update node positions with smooth interpolation
      const lerp = 0.08; // Easing factor — lower = smoother/slower return
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        let targetX = n.baseX;
        let targetY = n.baseY;

        if (!isReduced) {
          // Sine wave ambient motion
          const phase = (n.baseX + n.baseY) * 0.01;
          targetX += Math.sin(elapsed * SINE_SPEED + phase) * SINE_AMPLITUDE;
          targetY += Math.cos(elapsed * SINE_SPEED * 0.7 + phase * 1.3) * SINE_AMPLITUDE;

          // Mouse repulsion
          const dx = targetX - mx;
          const dy = targetY - my;
          const distSq = dx * dx + dy * dy;
          if (distSq < MOUSE_RADIUS * MOUSE_RADIUS && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE;
            targetX += (dx / dist) * force;
            targetY += (dy / dist) * force;
          }
        }

        // Smooth interpolation toward target (eases in and springs back)
        n.x += (targetX - n.x) * lerp;
        n.y += (targetY - n.y) * lerp;
      }

      // Draw lines using grid topology (right neighbor + bottom neighbor only)
      // This is O(n) instead of O(n^2)
      // Canvas API requires rgb/hex — oklch not supported. White is correct: mesh always sits on dark hero panel.
      ctx.strokeStyle = `rgba(255, 255, 255, ${LINE_OPACITY})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        // Right neighbor
        const rightIdx = i + 1;
        if (rightIdx < nodes.length && rightIdx % cols !== 0) {
          const b = nodes[rightIdx];
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
        }
        // Bottom neighbor
        const bottomIdx = i + cols;
        if (bottomIdx < nodes.length) {
          const b = nodes[bottomIdx];
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
        }
      }
      ctx.stroke();

      // Draw dots — batched into single path for performance
      ctx.fillStyle = `rgba(255, 255, 255, ${DOT_OPACITY})`;
      ctx.beginPath();
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        ctx.moveTo(n.x + DOT_RADIUS, n.y);
        ctx.arc(n.x, n.y, DOT_RADIUS, 0, Math.PI * 2);
      }
      ctx.fill();

      animRef.current = requestAnimationFrame(draw);
    }

    // IntersectionObserver — pause RAF and mousemove when canvas is offscreen
    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          document.addEventListener("mousemove", onMouseMove);
          if (!reducedMotionRef.current) {
            cancelAnimationFrame(animRef.current);
            animRef.current = requestAnimationFrame(draw);
          }
        } else {
          document.removeEventListener("mousemove", onMouseMove);
          mouseRef.current = { x: -9999, y: -9999 };
        }
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    // For reduced motion, draw once statically
    if (reducedMotionRef.current) {
      draw(startTime);
    } else {
      animRef.current = requestAnimationFrame(draw);
    }

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animRef.current);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", debouncedResize);
      document.removeEventListener("mousemove", onMouseMove);
      mql.removeEventListener("change", motionHandler);
    };
  }, [buildGrid]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        width: "100%",
        height: "100%",
      }}
      aria-hidden="true"
    />
  );
}
