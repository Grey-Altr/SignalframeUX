"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap-split";
import { PinnedSection } from "@/components/animation/pinned-section";
import { ManifestoStatement } from "@/components/blocks/manifesto-statement";
import { THESIS_MANIFESTO } from "@/lib/thesis-manifesto";

// Per-statement timeline budget — enter → hold → exit.
// Whole-span animation (no per-char stagger) keeps the scrub predictable
// and the timeline duration easy to reason about.
const TIMELINE_UNIT = 1.0;
const ENTER_DURATION = 0.35;
const HOLD_DURATION = 0.3;
const EXIT_DURATION = 0.35;

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
  const [scrollDistance, setScrollDistance] = useState<number>(3.0);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    const mobileMQ = window.matchMedia("(max-width: 667px)");
    const rmMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    setScrollDistance(mobileMQ.matches ? 2.0 : 3.0);
    setReducedMotion(rmMQ.matches);
  }, []);

  useGSAP(
    () => {
      if (reducedMotion) return;
      const stage = stageRef.current;
      const pinned = pinnedRef.current;
      if (!stage || !pinned) return;

      const spans = stage.querySelectorAll<HTMLSpanElement>("[data-statement]");
      if (spans.length === 0) return;

      // Seed every statement's initial state so the first render of the
      // scrubbed timeline has all spans hidden.
      gsap.set(spans, { opacity: 0, yPercent: 20 });

      const tl = gsap.timeline({ paused: true });

      // Each statement gets its own 1.0-unit slice: 0.35 enter → 0.3 hold →
      // 0.35 exit. Absolute position offsets (not ">" chaining) guarantee the
      // order is deterministic even if tween registration is reordered.
      spans.forEach((span, i) => {
        const enterStart = i * TIMELINE_UNIT;
        const exitStart = enterStart + ENTER_DURATION + HOLD_DURATION;
        tl.to(
          span,
          {
            opacity: 1,
            yPercent: 0,
            duration: ENTER_DURATION,
            ease: "sf-snap",
          },
          enterStart,
        ).to(
          span,
          {
            opacity: 0,
            yPercent: -20,
            duration: EXIT_DURATION,
            ease: "power1.out",
          },
          exitStart,
        );
      });

      ScrollTrigger.create({
        trigger: stage,
        pinnedContainer: pinned,
        start: "top top",
        // Explicit +=Npx end is mandatory: "bottom bottom" on a 100vh-tall
        // trigger resolves to the SAME scroll position as "top top" (zero
        // range), and scrub would never advance. Match the outer PinnedSection's
        // pin distance so the inner scrub spans the full pin window.
        end: () => `+=${scrollDistance * window.innerHeight}`,
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
        className="flex flex-col gap-24 py-24 px-[var(--sfx-space-6)] md:px-16"
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
