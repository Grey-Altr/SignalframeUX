"use client";

import { useRef, useCallback, useState, type ReactNode } from "react";

interface XrayRevealProps {
  /** Default visible layer */
  topLayer: ReactNode;
  /** Hidden layer revealed on hover via circular clip-path */
  bottomLayer: ReactNode;
  /** Reveal circle radius in px (default 80) */
  radius?: number;
  className?: string;
}

/**
 * CSS clip-path X-ray reveal — cursor-following circular window
 * that reveals the bottom layer through the top layer.
 * No WebGL — pure CSS clip-path for performance.
 */
export function XrayReveal({
  topLayer,
  bottomLayer,
  radius = 80,
  className,
}: XrayRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [hovering, setHovering] = useState(false);
  const rafRef = useRef<number>(0);

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        setPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      });
    },
    []
  );

  const handleEnter = useCallback(() => setHovering(true), []);
  const handleLeave = useCallback(() => {
    setHovering(false);
    cancelAnimationFrame(rafRef.current);
  }, []);

  const currentRadius = hovering ? radius : 0;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className ?? ""}`}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Top layer — always visible */}
      <div className="relative z-[1]">{topLayer}</div>

      {/* Bottom layer — revealed through circular clip-path */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          clipPath: `circle(${currentRadius}px at ${pos.x}px ${pos.y}px)`,
          transition: hovering
            ? "clip-path 0.05s linear"
            : "clip-path 0.3s var(--ease-default)",
        }}
      >
        {bottomLayer}
      </div>
    </div>
  );
}
