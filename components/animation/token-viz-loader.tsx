"use client";

/**
 * TokenVizLoader — thin client boundary for dynamic import of TokenViz.
 *
 * Next.js 15 does not allow `ssr: false` with next/dynamic in Server Components.
 * This client boundary wrapper holds the dynamic import so the parent Server
 * Component (app/tokens/page.tsx) can remain a Server Component.
 *
 * @module components/animation/token-viz-loader
 */

import dynamic from "next/dynamic";

const TokenVizDynamic = dynamic(
  () => import("@/components/animation/token-viz").then((m) => ({ default: m.TokenViz })),
  {
    ssr: false,
    // CLS fix: reserve the canvas's computed totalH (~763px) + wrapper py
    // padding so post-hydration injection doesn't shift layout. Matches the
    // canvas min-height set inside TokenViz itself.
    loading: () => (
      <div
        aria-hidden="true"
        className="px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] py-[var(--sfx-space-12)]"
        style={{ minHeight: "840px" }}
      />
    ),
  }
);

/** Client boundary wrapper for TokenViz — use this in Server Components. */
export function TokenVizLoader() {
  return <TokenVizDynamic />;
}
