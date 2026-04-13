"use client";

/**
 * ComponentSkeleton + SkeletonGrid — stroke-only FRAME-state shapes (Approach B).
 *
 * Renders 12 SF component silhouettes as bare transparent-fill, 1px-border shapes.
 * Used in the PROOF section (Phase 32) and imported by INVENTORY (Phase 33).
 *
 * Architecture:
 * - Pure presentational — no state, no effects, no GSAP imports
 * - SkeletonGrid forwards ref to root div so ProofSection rAF lerp can directly
 *   mutate .style.opacity without a GSAP tween (RESEARCH pitfall 4 — tween property
 *   collision prevention, AC-9)
 * - All borders use rounded-none explicitly (STATE.md v1.3 rule)
 * - No CSS animation on any element — parent rAF loop drives all visual change
 * - All spacing maps to blessed stops: {4,8,12,16,24,32,48,64,96}px
 *   Tailwind map: p-[var(--sfx-space-1)]=4 p-[var(--sfx-space-2)]=8 p-[var(--sfx-space-3)]=12 p-[var(--sfx-space-4)]=16 p-[var(--sfx-space-6)]=24 p-[var(--sfx-space-8)]=32 p-[var(--sfx-space-12)]=48 p-16=64 p-24=96
 *
 * SIGNAL/FRAME ordering: signal runs through the frame.
 *
 * @module components/animation/component-skeleton
 */

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import {
  PROOF_COMPONENT_SKELETONS,
  type ProofComponentId,
} from "@/lib/proof-components";

// ── Individual skeleton shape renderer ──────────────────────────────────────
//
// Each shape approximates the FRAME-state silhouette of a real SF component
// using 1px solid borders in foreground color, transparent fills, and zero
// radius. The goal is immediate recognizability without fidelity — this is
// the "bare bones" state that dissolves as --signal-intensity rises.

interface ComponentSkeletonProps {
  id: ProofComponentId;
  className?: string;
}

export function ComponentSkeleton({ id, className }: ComponentSkeletonProps) {
  const shape = renderShape(id);
  return (
    <div
      data-skeleton-id={id}
      className={cn("flex flex-col gap-[var(--sfx-space-2)] rounded-none", className)}
    >
      <span className="font-mono text-[9px] uppercase tracking-widest rounded-none opacity-60">
        {id}
      </span>
      {shape}
    </div>
  );
}

function renderShape(id: ProofComponentId) {
  // Base class shared by all bordered shapes: 1px solid, no fill, no radius
  const baseBox = "border border-foreground bg-transparent rounded-none";

  switch (id) {
    case "SF//BTN-001":
      // Small horizontal rectangle — button shape
      return <div className={cn(baseBox, "h-8 w-24")} aria-hidden="true" />;

    case "SF//CRD-001":
      // Larger rectangle — card shape with header divider
      return (
        <div
          className={cn(baseBox, "h-16 w-24 flex flex-col")}
          aria-hidden="true"
        >
          <div className="h-4 border-b border-foreground rounded-none" />
          <div className="flex-1" />
        </div>
      );

    case "SF//INP-001":
      // Thin horizontal rectangle — input field
      return <div className={cn(baseBox, "h-8 w-24")} aria-hidden="true" />;

    case "SF//TGL-001":
      // Pill rectangle with an inset square knob — toggle
      return (
        <div
          className={cn(baseBox, "h-6 w-12 flex items-center")}
          aria-hidden="true"
        >
          <div className="h-4 w-4 border border-foreground rounded-none ml-1" />
        </div>
      );

    case "SF//TBL-001":
      // Grid of cells — table rows and columns
      return (
        <div
          className={cn(baseBox, "h-16 w-24 flex flex-col")}
          aria-hidden="true"
        >
          <div className="h-4 border-b border-foreground rounded-none" />
          <div className="flex-1 flex flex-col">
            <div className="flex-1 border-b border-foreground rounded-none" />
            <div className="flex-1 border-b border-foreground rounded-none" />
            <div className="flex-1" />
          </div>
        </div>
      );

    case "SF//BDG-001":
      // Tiny narrow rectangle — badge
      return <div className={cn(baseBox, "h-4 w-12")} aria-hidden="true" />;

    case "SF//DLG-001":
      // Rectangle with title strip — dialog
      return (
        <div
          className={cn(baseBox, "h-16 w-24 flex flex-col")}
          aria-hidden="true"
        >
          <div className="h-4 border-b border-foreground rounded-none" />
          <div className="flex-1 p-[var(--sfx-space-1)]">
            <div className="h-2 w-12 border border-foreground rounded-none" />
          </div>
        </div>
      );

    case "SF//TAB-001":
      // Horizontal strip divided into three tab sections
      return (
        <div className={cn(baseBox, "h-8 w-24 flex")} aria-hidden="true">
          <div className="flex-1 border-r border-foreground rounded-none" />
          <div className="flex-1 border-r border-foreground rounded-none" />
          <div className="flex-1 rounded-none" />
        </div>
      );

    case "SF//SLD-001":
      // Thin horizontal line with a centered square knob — slider
      return (
        <div
          className="relative h-4 w-24 flex items-center"
          aria-hidden="true"
        >
          <div className="h-0 w-full border-t border-foreground rounded-none" />
          <div className="absolute left-1/2 h-4 w-4 -translate-x-1/2 border border-foreground bg-background rounded-none" />
        </div>
      );

    case "SF//SEL-001":
      // Rectangle with an inset caret — select / dropdown
      return (
        <div
          className={cn(
            baseBox,
            "h-8 w-24 flex items-center justify-end pr-2",
          )}
          aria-hidden="true"
        >
          <div className="h-2 w-2 border-r border-b border-foreground rotate-45 rounded-none" />
        </div>
      );

    case "SF//TIP-001":
      // Small rectangle — tooltip bubble
      return (
        <div className="relative" aria-hidden="true">
          <div className={cn(baseBox, "h-6 w-16")} />
        </div>
      );

    case "SF//PRG-001":
      // Thin bar partially filled — progress indicator
      return (
        <div className={cn(baseBox, "h-2 w-24 flex")} aria-hidden="true">
          <div className="h-full w-1/3 border-r border-foreground rounded-none" />
        </div>
      );
  }
}

// ── SkeletonGrid — forwardRef so ProofSection can drive .style.opacity ──────
//
// ProofSection's rAF lerp mutates skeletonRef.current.style.opacity directly
// in each frame. This avoids a GSAP tween on the same property (pitfall 4).
// Parent rAF loop owns all visual change — no inline style animation here.

interface SkeletonGridProps {
  className?: string;
}

export const SkeletonGrid = forwardRef<HTMLDivElement, SkeletonGridProps>(
  function SkeletonGrid({ className }, ref) {
    return (
      <div
        ref={ref}
        data-proof-layer="skeleton"
        className={cn(
          "absolute inset-0 z-10 flex items-center justify-center p-[var(--sfx-space-8)] rounded-none",
          className,
        )}
        aria-hidden="true"
      >
        {/* 4-column grid of 12 skeleton shapes — gap-[var(--sfx-space-4)] = 16px (blessed) */}
        <div className="grid grid-cols-4 gap-[var(--sfx-space-4)] rounded-none">
          {PROOF_COMPONENT_SKELETONS.map((id) => (
            <ComponentSkeleton key={id} id={id} />
          ))}
        </div>
      </div>
    );
  },
);

SkeletonGrid.displayName = "SkeletonGrid";
