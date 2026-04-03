"use client";

import { useRef, useCallback, type ReactNode } from "react";

interface MagneticProps {
  children: ReactNode;
  /** Detection radius in pixels (default 60) */
  radius?: number;
  /** Pull strength 0–1 (default 0.15) */
  strength?: number;
  /** Max displacement in pixels (default 8) */
  maxDisplacement?: number;
  className?: string;
}

/**
 * Magnetic pull wrapper — children translate toward the cursor
 * when it enters the detection radius. Spring-back on leave.
 * Skips on touch devices and reduced motion.
 */
export function Magnetic({
  children,
  radius = 60,
  strength = 0.15,
  maxDisplacement = 8,
  className,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < radius) {
          const pullX = Math.max(-maxDisplacement, Math.min(maxDisplacement, dx * strength));
          const pullY = Math.max(-maxDisplacement, Math.min(maxDisplacement, dy * strength));
          el.style.transform = `translate(${pullX}px, ${pullY}px)`;
        }
      });
    },
    [radius, strength, maxDisplacement]
  );

  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(rafRef.current);
    // Spring-back — CSS transition handles the easing
    el.style.transform = "translate(0, 0)";
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        display: "inline-block",
        transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
