"use client";

import dynamic from "next/dynamic";

// Deferred client-boundary wrapper for Y2KMarkGrid.
// Keeps 60 SVG tiles out of the initial server HTML so the /reference
// hero is the single stable LCP candidate under Lighthouse throttling.
// Real-user impact is minimal (grid hydrates immediately on desktop).
export const Y2KMarkGridDeferred = dynamic(
  () => import("./y2k-mark-grid").then((m) => ({ default: m.Y2KMarkGrid })),
  { ssr: false, loading: () => null },
);
