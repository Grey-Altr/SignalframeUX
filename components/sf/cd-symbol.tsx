/**
 * CDSymbol — renders an SVG symbol from the sprite sheet at /symbols.svg.
 *
 * Zero runtime JS beyond the SVG <use> element. Server-component compatible.
 * No 'use client' directive needed — pure HTML output.
 *
 * @example
 *   <CDSymbol name="crosshair" size={16} />
 *   <CDSymbol name="signal-wave" size={32} className="text-primary" />
 */

import { cn } from "@/lib/utils";

interface CDSymbolProps {
  /** Symbol id from /symbols.svg (e.g. "crosshair", "signal-wave") */
  name: string;
  /** Width and height in px. Default 24. */
  size?: number;
  /** Additional CSS classes — use text-* for color (currentColor). */
  className?: string;
}

export function CDSymbol({ name, size = 24, className }: CDSymbolProps) {
  return (
    <svg
      width={size}
      height={size}
      className={cn("inline-block shrink-0", className)}
      aria-hidden="true"
      role="img"
    >
      <use href={`/symbols.svg#${name}`} />
    </svg>
  );
}
