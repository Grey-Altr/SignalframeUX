"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLenisInstance } from "@/components/layout/lenis-provider";

const SCROLL_KEY_PREFIX = "sfux.scroll";

/**
 * Saves and restores scroll position for the current page using sessionStorage.
 *
 * Call once per page that requires scroll restoration (currently: /components via ComponentsExplorer).
 *
 * Behavior:
 * - On SPA navigation away: saves `window.scrollY` keyed by current pathname.
 * - On hard-reload (browser `beforeunload`): saves scroll position before the page unloads.
 * - On mount: reads any stored position and restores via `requestAnimationFrame` to ensure
 *   the DOM has painted before scrolling.
 * - Hard reload: sessionStorage is cleared by the browser, so scroll starts at 0 on next load.
 *
 * Lenis compatibility note: Routes scroll through lenis.scrollTo(y, { immediate: true }) when
 * Lenis is active — this prevents the race condition where Lenis overrides window.scrollTo.
 * Falls back to window.scrollTo when Lenis is null (prefers-reduced-motion).
 *
 * sessionStorage failures are caught silently — scroll simply starts at 0 on that visit.
 */
export function useScrollRestoration() {
  const pathname = usePathname();
  const key = `${SCROLL_KEY_PREFIX}.${pathname}`;
  const lenis = useLenisInstance();

  // Save scroll position on SPA navigation away and on hard-reload (beforeunload)
  useEffect(() => {
    const saveScroll = () => {
      try {
        sessionStorage.setItem(key, String(window.scrollY));
      } catch {
        // Ignore — sessionStorage unavailable
      }
    };

    window.addEventListener("beforeunload", saveScroll);

    return () => {
      // Save on SPA navigation away (cleanup fires when pathname changes or component unmounts)
      saveScroll();
      window.removeEventListener("beforeunload", saveScroll);
    };
  }, [key]);

  // Restore scroll position after mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(key);
      if (stored !== null) {
        const y = parseInt(stored, 10);
        if (!isNaN(y) && y > 0) {
          // rAF ensures DOM has painted before scrolling (also gives Lenis time to initialize)
          requestAnimationFrame(() => {
            if (lenis) {
              lenis.scrollTo(y, { immediate: true });
            } else {
              window.scrollTo(0, y);
            }
          });
        }
      }
    } catch {
      // Ignore — scroll starts at 0
    }
  }, [key, lenis]);
}
