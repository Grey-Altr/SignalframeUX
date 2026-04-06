"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { gsap } from "@/lib/gsap-core";

/**
 * Presence indicator -- FRAME layer status primitive.
 * 8px square, GSAP pulse on active state. Respects prefers-reduced-motion.
 *
 * @param status - Current state: "active" (pulsing green), "idle" (accent), "offline" (muted)
 * @param className - Additional classes merged onto the dot element
 *
 * @example
 * <SFStatusDot status="active" />
 * <SFStatusDot status="idle" />
 * <SFStatusDot status="offline" />
 */

type SFStatusDotStatus = "active" | "idle" | "offline";

interface SFStatusDotProps {
  status?: SFStatusDotStatus;
  className?: string;
}

const statusColors: Record<SFStatusDotStatus, string> = {
  active: "bg-success",
  idle: "bg-accent",
  offline: "bg-muted-foreground",
};

function SFStatusDot({ status = "idle", className }: SFStatusDotProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status !== "active" || !ref.current) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tween = gsap.to(ref.current, {
      opacity: 0.4,
      duration: 0.2,
      ease: "power2.out",
      repeat: -1,
      yoyo: true,
    });

    return () => {
      tween.kill();
    };
  }, [status]);

  return (
    <div
      ref={ref}
      role="status"
      aria-label={status}
      className={cn("size-2", statusColors[status], className)}
    />
  );
}

export { SFStatusDot, type SFStatusDotStatus };
