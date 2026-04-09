"use client";

import { useEffect, useRef, useState } from "react";
import { useNavReveal } from "@/hooks/use-nav-reveal";

/**
 * Mounts useNavReveal with a DOM element resolved by querySelector.
 *
 * Render this inside any page that needs nav-reveal-on-scroll behavior.
 * The target element must exist in the DOM (e.g. `[data-entry-section]` on the
 * homepage, `[data-nav-reveal-trigger]` on subpages).
 *
 * Renders nothing -- pure side effect.
 */
export function NavRevealMount({ targetSelector }: { targetSelector: string }) {
  const triggerRef = useRef<HTMLElement | null>(null);
  const [, setReady] = useState(false);

  // Populate ref on mount (DOM is now available)
  useEffect(() => {
    triggerRef.current = document.querySelector<HTMLElement>(targetSelector);
    // Force a re-render so useNavReveal's effect re-runs with the populated ref
    setReady(true);
  }, [targetSelector]);

  useNavReveal(triggerRef);

  return null;
}
