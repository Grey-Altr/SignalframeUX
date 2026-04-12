"use client";

/**
 * SSR-safe lazy wrapper for DatamoshOverlay.
 * next/dynamic({ ssr: false }) ensures checkWebGL() runs client-side only.
 * Mirrors the SignalOverlayLazy pattern.
 */

import dynamic from "next/dynamic";

const DatamoshOverlayDynamic = dynamic(
  () =>
    import("@/components/animation/datamosh-overlay").then((m) => ({
      default: m.DatamoshOverlay,
    })),
  { ssr: false }
);

export function DatamoshOverlayLazy() {
  return <DatamoshOverlayDynamic />;
}
