"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { ManifestoAnchor } from "@/lib/thesis-manifesto";

interface ManifestoStatementProps {
  text: string;
  anchor: ManifestoAnchor;
  mobileAnchor?: ManifestoAnchor;
  /** vh units of intentional void before this statement's enter (TH-04) */
  voidBefore: number;
}

const STATEMENT_STYLE: CSSProperties = {
  fontSize: "clamp(56px, calc(10*var(--sf-vw)), 120px)",
  lineHeight: 0.9,
  letterSpacing: "-0.02em",
};

const STATEMENT_CLASS =
  "font-[family-name:var(--font-display)] text-foreground";

/**
 * ManifestoStatement — single THESIS manifesto anchor statement.
 *
 * Pure renderer. The parent ThesisSection owns the master GSAP timeline
 * and iterates [data-statement] spans via querySelectorAll to attach
 * SplitText + per-statement tweens. This component never calls into GSAP
 * directly, which keeps the timeline logic centralized and the statement
 * subcomponent easy to reason about.
 *
 * All statements are display-scale anchors (Anton clamp(56px, calc(10*var(--sf-vw)), 120px)).
 * No connector tier exists — the wiki-locked 6-statement set is all-anchor.
 *
 * - D-13 compliance: this component renders nothing the parent tweens into;
 *   the parent only targets `self.chars` from SplitText (grandchildren).
 * - D-26 compliance: the PageAnimations scan-selector attribute is never attached.
 * - Radius: rounded-none explicit on the positioning wrapper.
 */
export function ManifestoStatement({
  text,
  anchor,
  mobileAnchor,
  voidBefore,
}: ManifestoStatementProps) {
  // Resolve anchor against viewport — mobileAnchor overrides on <=667px
  // We defer the decision to an effect so SSR renders the desktop anchor
  // (avoiding a hydration mismatch from reading window on the server).
  const [resolvedAnchor, setResolvedAnchor] = useState<ManifestoAnchor>(anchor);

  useEffect(() => {
    if (!mobileAnchor) return;
    const mq = window.matchMedia("(max-width: 667px)");
    setResolvedAnchor(mq.matches ? mobileAnchor : anchor);
  }, [anchor, mobileAnchor]);

  return (
    <div
      className="absolute rounded-none"
      style={resolvedAnchor as CSSProperties}
      data-void-before={voidBefore}
    >
      <span
        data-statement
        data-statement-size="anchor"
        className={STATEMENT_CLASS}
        style={STATEMENT_STYLE}
      >
        {text}
      </span>
    </div>
  );
}
