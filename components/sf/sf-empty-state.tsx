"use client";

import { cn } from "@/lib/utils";
import { ScrambleText } from "@/components/animation/scramble-text";

/**
 * Designed empty state -- FRAME layer placeholder with DU/TDR tension.
 * Bayer dither background, monospace text, optional ScrambleText SIGNAL treatment.
 *
 * @param title - Primary message text displayed in monospace uppercase
 * @param scramble - When true, title renders inside ScrambleText for SIGNAL layer effect
 * @param action - Optional action slot (e.g., a button to retry or navigate)
 * @param className - Additional classes merged onto the outer container
 * @param children - Optional description content rendered below the title
 *
 * @example
 * <SFEmptyState title="NO DATA FOUND" scramble>
 *   <p>Try adjusting your filters.</p>
 * </SFEmptyState>
 */

interface SFEmptyStateProps {
  title: string;
  scramble?: boolean;
  action?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

/* 4x4 Bayer ordered dither pattern as base64 PNG (8x8 px, black/white checkerboard-like noise) */
const BAYER_DITHER_URI =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAAXNSR0IArs4c6QAAADFJREFUGFdj/P///38GBgZGRkZGBhBgAAMmJiYGZMDIyAgXAAuAAchqRrgqsCBIFQMAAPwJBgmjMXwAAAAASUVORK5CYII=";

function SFEmptyState({
  title,
  scramble = false,
  action,
  className,
  children,
}: SFEmptyStateProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center py-16 px-8 text-center font-mono uppercase tracking-wider",
        className
      )}
    >
      {/* Bayer dither background layer */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("${BAYER_DITHER_URI}")`,
          backgroundSize: "8px 8px",
          imageRendering: "pixelated",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {scramble ? (
          <ScrambleText
            text={title}
            className="text-lg mb-4 block"
            trigger="load"
          />
        ) : (
          <h3 className="text-lg mb-4 text-foreground">{title}</h3>
        )}

        {children && (
          <div className="text-sm text-muted-foreground mb-6">{children}</div>
        )}

        {action}
      </div>
    </div>
  );
}

export { SFEmptyState };
