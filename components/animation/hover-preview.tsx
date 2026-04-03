"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";

export interface HoverPreviewItem {
  label: string;
  href: string;
  /** Image src for the preview */
  image: string;
  /** Sublabel (e.g., layer type, version) */
  sublabel?: string;
}

interface HoverPreviewProps {
  items: HoverPreviewItem[];
  className?: string;
}

/**
 * Vertical text list with image preview on hover.
 * Image container slides in from right with clip-path reveal,
 * tracking cursor Y within list item bounds.
 * On touch devices: renders as plain links (no hover preview).
 */
export function HoverPreview({ items, className }: HoverPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mouseY, setMouseY] = useState(0);

  const handleMouseMove = useCallback((e: React.MouseEvent, index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    setMouseY(e.clientY - rect.top);
    setActiveIndex(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setActiveIndex(null);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className ?? ""}`} onMouseLeave={handleMouseLeave}>
      {/* Text list */}
      <div className="relative z-[var(--z-content)]">
        {items.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center justify-between py-4 px-2 border-b border-foreground/20 no-underline transition-colors hover:text-primary"
            onMouseMove={(e) => handleMouseMove(e, i)}
          >
            <span className="font-mono uppercase tracking-wider text-sm font-bold">
              {item.label}
            </span>
            {item.sublabel && (
              <span className="text-[var(--text-xs)] uppercase tracking-[0.15em] text-muted-foreground">
                {item.sublabel}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Preview image — desktop only */}
      <div
        ref={previewRef}
        aria-hidden="true"
        className="hidden md:block pointer-events-none absolute right-0 w-[280px] h-[180px] border-2 border-foreground bg-background overflow-hidden z-[var(--z-content)]"
        style={{
          top: `${mouseY - 90}px`,
          clipPath: activeIndex !== null ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
          transition: "clip-path 0.3s var(--ease-default), top 0.05s linear",
        }}
      >
        {activeIndex !== null && items[activeIndex] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={items[activeIndex].image}
            alt=""
            className="w-full h-full object-cover"
          />
        )}
      </div>
    </div>
  );
}
