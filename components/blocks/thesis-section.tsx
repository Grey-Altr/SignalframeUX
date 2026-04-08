"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap-split";
import { PinnedSection } from "@/components/animation/pinned-section";
import { ManifestoStatement } from "@/components/blocks/manifesto-statement";
import { THESIS_MANIFESTO } from "@/lib/thesis-manifesto";

// Per-statement timeline budget — enter (0.5) + hold (0.3) + exit (0.3) = 1.1s.
// Statements are placed at `i * TIMELINE_UNIT` inside the master timeline,
// which ScrollTrigger then scrubs against the pin window.
const TIMELINE_UNIT = 1.1;
const ENTER_DURATION = 0.5;
const HOLD_DURATION = 0.3;
const EXIT_DURATION = 0.3;

// Weighted-arc void budget (vh) — S1 (signal-frame opener) and S6 (signal-frame
// closer) are structural bookends that get breathing room; S2-S5 share a tighter
// rhythm. The attribute is rendered for the TH-04 test and also informs the
// visual pacing the human verifier looks for in Task 4 Part A.
const BOOKEND_VOID_VH = 40;
const INTERIOR_VOID_VH = 25;

function voidBeforeFor(index: number, total: number): number {
  return index === 0 || index === total - 1
    ? BOOKEND_VOID_VH
    : INTERIOR_VOID_VH;
}

/**
 * ThesisSection — 200-300vh pinned manifesto.
 *
 * Composes Phase 29's PinnedSection primitive with a nested scrubbed
 * ScrollTrigger that drives a single master GSAP timeline. The master
 * timeline contains per-statement enter/hold/exit windows; each window
 * is added by this component via `querySelectorAll("[data-statement]")`
 * and `SplitText.create` on the discovered spans.
 *
 * Key decisions:
 * - D-13: Tweens target `self.chars` only — never the PinnedSection root
 *   or the stage div (animating a pinned element breaks pin measurement).
 * - D-19 / D-31: `scrollDistance` = 2.5 desktop, 2 mobile.
 * - D-21: Nested ScrollTrigger with `pinnedContainer` (not an extension of
 *   the PinnedSection API). Task 0 upgraded PinnedSection to forwardRef so
 *   we can read its container DOM node via `pinnedRef`.
 * - D-26: the PageAnimations scan-selector attribute is never attached here.
 * - D-27..D-30: Reduced-motion short-circuit returns a stacked specimen.
 *
 * Consumed by `app/page.tsx` inside the THESIS `SFSection` landmark.
 */
export function ThesisSection() {
  const pinnedRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Detected once at mount — ScrollTrigger.refresh handles post-mount layout
  // changes, and we do not listen for resize past the initial detection.
  const [scrollDistance, setScrollDistance] = useState<number>(2.5);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    const mobileMQ = window.matchMedia("(max-width: 667px)");
    const rmMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    setScrollDistance(mobileMQ.matches ? 2 : 2.5);
    setReducedMotion(rmMQ.matches);
  }, []);

  useGSAP(
    () => {
      if (reducedMotion) return;
      const stage = stageRef.current;
      const pinned = pinnedRef.current;
      if (!stage || !pinned) return;

      const tl = gsap.timeline({ paused: true });

      // Parent-owned SplitText orchestration — find every statement span,
      // split it in place, and attach enter/hold/exit tweens at the correct
      // timeline position. Explicit position offsets (not ">" chaining) so
      // asynchronous onSplit callbacks cannot corrupt the order.
      const spans = stage.querySelectorAll<HTMLSpanElement>("[data-statement]");
      spans.forEach((span, i) => {
        const position = i * TIMELINE_UNIT;
        SplitText.create(span, {
          type: "chars",
          mask: "chars",
          autoSplit: true,
          onSplit(self: { chars: Element[] }) {
            tl.from(
              self.chars,
              {
                yPercent: 100,
                opacity: 0,
                duration: ENTER_DURATION,
                stagger: 0.02,
                ease: "sf-snap",
              },
              position,
            ).to(
              self.chars,
              {
                opacity: 0,
                duration: EXIT_DURATION,
                ease: "power1.in",
              },
              position + ENTER_DURATION + HOLD_DURATION,
            );
          },
        });
      });

      ScrollTrigger.create({
        trigger: stage,
        pinnedContainer: pinned,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        animation: tl,
        invalidateOnRefresh: true,
      });
    },
    { scope: stageRef, dependencies: [reducedMotion, scrollDistance] },
  );

  // ── Reduced-motion branch: stacked specimen, no pin, no scrub, no SplitText
  if (reducedMotion) {
    return (
      <div
        data-thesis-reduced-motion
        className="flex flex-col gap-24 py-24 px-6 md:px-16"
      >
        {THESIS_MANIFESTO.map((s, i) => (
          <div
            key={`${i}-${s.pillar}`}
            className="text-left rounded-none"
            data-void-before={voidBeforeFor(i, THESIS_MANIFESTO.length)}
          >
            <span
              data-statement
              data-statement-size="anchor"
              className="font-[family-name:var(--font-display)] text-foreground"
              style={{
                fontSize: "clamp(56px, 10vw, 120px)",
                lineHeight: 0.9,
                letterSpacing: "-0.02em",
              }}
            >
              {s.text}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // ── Motion branch: pinned scroll choreography
  return (
    <PinnedSection
      ref={pinnedRef}
      scrollDistance={scrollDistance}
      id="thesis-pin"
    >
      <div
        ref={stageRef}
        data-pinned-container
        data-stage
        className="relative w-full h-screen"
      >
        {THESIS_MANIFESTO.map((s, i) => (
          <ManifestoStatement
            key={`${i}-${s.pillar}`}
            text={s.text}
            anchor={s.anchor}
            mobileAnchor={s.mobileAnchor}
            voidBefore={voidBeforeFor(i, THESIS_MANIFESTO.length)}
          />
        ))}
      </div>
    </PinnedSection>
  );
}
