"use client";

import * as React from "react";
import { useRef, useEffect } from "react";
import { Progress as ProgressPrimitive } from "radix-ui";
import { gsap } from "@/lib/gsap-core";
import { cn } from "@/lib/utils";

/**
 * SFProgress -- SIGNAL layer progress bar with GSAP fill tween.
 *
 * Wraps Radix Progress directly (not shadcn base) to gain ref access
 * on the indicator. GSAP is the sole animation driver -- no CSS
 * transition-all. Respects prefers-reduced-motion (instant gsap.set).
 *
 * @param value - Progress percentage 0-100
 * @param className - Additional classes on root
 *
 * @example
 * ```tsx
 * <SFProgress value={60} />
 * <SFProgress value={100} className="h-2" />
 * ```
 */

interface SFProgressProps
  extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  value?: number;
}

function SFProgress({ className, value, ...props }: SFProgressProps) {
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = indicatorRef.current;
    if (!el) return;

    const targetX = -(100 - (value || 0));

    // Reduced-motion: instant position via gsap.set
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(el, { xPercent: targetX });
      return;
    }

    const tween = gsap.to(el, {
      xPercent: targetX,
      duration: 0.2,
      ease: "power2.out",
    });

    return () => {
      tween.kill();
    };
  }, [value]);

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      // Forward value to Radix Progress.Root so it sets aria-valuenow and
      // data-state correctly. Destructuring at the param list strips value
      // from `props` for the GSAP-tween useEffect; without re-passing here,
      // Radix sees no value and stays in data-state="indeterminate" with no
      // aria-valuenow attribute. Surfaced by Phase 74 SFFileUpload acceptance
      // spec FU-03 (auto-fix Rule 1: pre-existing SFProgress bug).
      value={value}
      className={cn(
        "relative flex h-1 w-full items-center overflow-x-hidden rounded-none bg-muted",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        ref={indicatorRef}
        data-slot="progress-indicator"
        className="size-full flex-1 rounded-none bg-primary"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { SFProgress };
