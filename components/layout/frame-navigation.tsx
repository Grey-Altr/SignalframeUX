"use client";

import { useFrameNavigation } from "@/hooks/use-frame-navigation";

/**
 * R-64 keyboard model mount point. Renders nothing; lives once in
 * `app/layout.tsx` inside LenisProvider so `useLenisInstance()` can reach
 * the Lenis instance.
 */
export function FrameNavigation(): null {
  useFrameNavigation();
  return null;
}
