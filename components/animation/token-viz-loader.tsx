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
  { ssr: false }
);

/** Client boundary wrapper for TokenViz — use this in Server Components. */
export function TokenVizLoader() {
  return <TokenVizDynamic />;
}
