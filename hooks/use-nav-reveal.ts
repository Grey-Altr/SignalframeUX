import { useEffect, type RefObject } from "react";
import { ScrollTrigger } from "@/lib/gsap-core";

/**
 * Drives nav reveal via `document.body.dataset.navVisible`.
 *
 * CONTRACT (CONTEXT.md section VL -- Nav reveal pattern, LOCKED):
 * - Homepage: pass a ref to the ENTRY section (`[data-entry-section]`).
 * - Subpages: pass a ref to the page <header> element (the one wrapping the h1).
 *   Nav appears once the page header scrolls out of view.
 * - `triggerRef.current === null` is a SAFETY FALLBACK ONLY (logs a dev-mode warning)
 *   -- subpages MUST pass a real header. Do not rely on the null branch.
 *
 * Reduced motion: nav visible immediately, no ScrollTrigger.
 *
 * The Nav DOM element MUST carry `sf-nav-hidden` as its initial className. The CSS
 * rule in app/globals.css flips visibility based on `body[data-nav-visible="true"]`.
 */
export function useNavReveal(triggerRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    // Initial state: hidden
    document.body.dataset.navVisible = "false";

    // Reduced motion -> visible immediately
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.body.dataset.navVisible = "true";
      return () => {
        // Leave nav visible on unmount so subsequent navigation is not stuck hidden
        document.body.dataset.navVisible = "true";
      };
    }

    const trigger = triggerRef.current;
    if (!trigger) {
      // Safety fallback -- NOT a sanctioned subpage path
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "[useNavReveal] triggerRef.current is null -- subpages MUST pass their <header> element ref. Showing nav as fallback.",
        );
      }
      document.body.dataset.navVisible = "true";
      return () => {
        document.body.dataset.navVisible = "true";
      };
    }

    // Hide initially, reveal when trigger bottom passes viewport top
    const st = ScrollTrigger.create({
      trigger,
      start: "bottom top",
      onEnter: () => {
        document.body.dataset.navVisible = "true";
      },
      onLeaveBack: () => {
        document.body.dataset.navVisible = "false";
      },
    });

    return () => {
      st.kill();
      // On unmount, leave nav visible (avoids stuck-hidden state during route change)
      document.body.dataset.navVisible = "true";
    };
  }, [triggerRef]);
}
