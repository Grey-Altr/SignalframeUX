"use client";

import { useRef, useState, useEffect, useCallback } from "react";

interface SectionIndicatorProps {
  /** CSS selector for the sections to track (default: [data-section]) */
  selector?: string;
  className?: string;
}

/**
 * Vertical dot indicator — fixed to viewport right edge.
 * One dot per [data-section] element. Active = magenta, inactive = muted.
 * Connected by a thin line. Click to smooth-scroll. Hidden on mobile.
 */
export function SectionIndicator({ selector = "[data-section]", className }: SectionIndicatorProps) {
  const [sections, setSections] = useState<Array<{ id: string; label: string }>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Discover sections on mount
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(selector);
    const items = Array.from(els).map((el) => ({
      id: el.getAttribute("data-section") || el.id || "",
      label: el.getAttribute("data-section-label") || el.getAttribute("data-section") || "",
    }));
    setSections(items);
  }, [selector]);

  // Observe which section is in view
  useEffect(() => {
    if (sections.length === 0) return;

    const els = document.querySelectorAll<HTMLElement>(selector);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // At scroll top, always select first section
        if (window.scrollY < 10) {
          setActiveIndex(0);
          return;
        }
        // Find the entry with highest intersection ratio
        let bestIndex = activeIndex;
        let bestRatio = 0;
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
            const idx = Array.from(els).indexOf(entry.target as HTMLElement);
            if (idx !== -1) {
              bestIndex = idx;
              bestRatio = entry.intersectionRatio;
            }
          }
        });
        if (bestRatio > 0) setActiveIndex(bestIndex);
      },
      { threshold: [0.1, 0.3, 0.5, 0.7] }
    );

    els.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [sections, selector, activeIndex]);

  const scrollTo = useCallback((index: number) => {
    const els = document.querySelectorAll<HTMLElement>(selector);
    const target = els[index];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selector]);

  if (sections.length === 0) return null;

  return (
    <div
      className={`hidden md:flex fixed right-4 top-1/2 -translate-y-1/2 z-[var(--z-content)] flex-col items-center sf-section-indicator-fade ${className ?? ""}`}
      aria-label="Section navigation"
      role="navigation"
    >
      {/* Connecting line */}
      <div
        className="absolute w-[1px] bg-foreground/15"
        style={{
          top: 0,
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
        }}
        aria-hidden="true"
      />

      {sections.map((section, i) => {
        const isActive = i === activeIndex;
        const isEndpoint = i === 0 || i === sections.length - 1;
        return (
          <button
            key={section.id}
            onClick={() => scrollTo(i)}
            aria-label={`Jump to ${section.label}`}
            aria-current={isActive ? "true" : undefined}
            className="relative p-3 group"
            title={section.label}
          >
            {isEndpoint ? (
              <span
                className={`block relative transition-all duration-200 ${
                  isActive ? "w-1 h-1" : "w-0.5 h-0.5 group-hover:scale-125"
                }`}
              >
                {/* Horizontal bar */}
                <span className={`absolute top-1/2 left-0 w-full -translate-y-1/2 ${isActive ? "h-[2px] bg-primary" : "h-[1.5px] bg-foreground/30 group-hover:bg-foreground/60"}`} />
                {/* Vertical bar */}
                <span className={`absolute left-1/2 top-0 h-full -translate-x-1/2 ${isActive ? "w-[2px] bg-primary" : "w-[1.5px] bg-foreground/30 group-hover:bg-foreground/60"}`} />
                {/* Fill center when active */}
                {isActive && <span className="absolute inset-[25%] bg-primary" />}
              </span>
            ) : (
              <span
                className={`block rounded-full transition-all duration-200 ${
                  isActive
                    ? "w-1 h-1 bg-primary scale-110"
                    : "w-0.5 h-0.5 bg-foreground/30 group-hover:bg-foreground/60"
                }`}
              />
            )}
            {/* Label tooltip on hover */}
            <span
              className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap text-[var(--text-2xs)] uppercase tracking-[0.15em] font-bold font-mono opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground pointer-events-none"
            >
              {section.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
