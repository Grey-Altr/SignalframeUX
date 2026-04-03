"use client";

import { useRef, useState, useEffect, useCallback } from "react";

export interface CodeLine {
  text: string;
  /** Optional syntax color class or CSS color */
  color?: string;
}

interface CodeTypewriterProps {
  /** Lines to reveal sequentially */
  lines: CodeLine[];
  /** Delay between each line reveal in ms (default 60) */
  lineDelay?: number;
  /** Whether to show a blinking cursor (default true) */
  showCursor?: boolean;
  /** Cursor color (default magenta) */
  cursorColor?: string;
  className?: string;
}

/**
 * Staggered code line reveal — lines appear one at a time with
 * y-offset and opacity animation. Triggered by IntersectionObserver.
 * Not char-by-char typing (too slow) — line-by-line reveal.
 */
export function CodeTypewriter({
  lines,
  lineDelay = 60,
  showCursor = true,
  cursorColor = "var(--color-primary)",
  className,
}: CodeTypewriterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const [started, setStarted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const startReveal = useCallback(() => {
    if (started) return;
    setStarted(true);

    let count = 0;
    function revealNext() {
      count++;
      setVisibleCount(count);
      if (count < lines.length) {
        timerRef.current = setTimeout(revealNext, lineDelay);
      }
    }
    timerRef.current = setTimeout(revealNext, lineDelay);
  }, [started, lines.length, lineDelay]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Reduced motion — show all immediately
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisibleCount(lines.length);
      setStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startReveal();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [startReveal, lines.length]);

  return (
    <div ref={containerRef} className={className}>
      <pre className="text-base leading-[1.7] font-mono overflow-x-auto text-[var(--sf-muted-text-dark)]">
        <code>
          {lines.map((line, i) => {
            const isVisible = i < visibleCount;
            const isCurrent = i === visibleCount - 1 && visibleCount < lines.length;

            return (
              <div
                key={i}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(8px)",
                  transition: "opacity 0.15s ease, transform 0.15s ease",
                  color: line.color || undefined,
                }}
              >
                {line.text || "\u00A0"}
                {showCursor && isCurrent && (
                  <span
                    style={{
                      color: cursorColor,
                      animation: "sf-cursor-blink 1s step-end infinite",
                    }}
                  >
                    |
                  </span>
                )}
              </div>
            );
          })}
          {showCursor && visibleCount >= lines.length && started && (
            <span
              style={{
                color: cursorColor,
                animation: "sf-cursor-blink 1s step-end infinite",
              }}
            >
              |
            </span>
          )}
        </code>
      </pre>
    </div>
  );
}
