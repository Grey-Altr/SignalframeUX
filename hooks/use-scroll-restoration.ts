"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

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
 * Lenis compatibility note: The rAF timing gives Lenis time to initialize before the scrollTo
 * fires. If Lenis overrides the position, use `lenis.scrollTo(y, { immediate: true })` instead
 * of `window.scrollTo`. Monitor visually — if scroll snaps back to 0, Lenis is winning the race.
 *
 * sessionStorage failures are caught silently — scroll simply starts at 0 on that visit.
 */
export function useScrollRestoration() {
  const pathname = usePathname();
  const key = `${SCROLL_KEY_PREFIX}.${pathname}`;

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
          requestAnimationFrame(() => window.scrollTo(0, y));
        }
      }
    } catch {
      // Ignore — scroll starts at 0
    }
  }, [key]);
}
