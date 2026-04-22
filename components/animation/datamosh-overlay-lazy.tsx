"use client";

/**
 * @status reference-template
 * No live consumers (lockdown audit 2026-04-22, §6.22).
 * See: .planning/lockdown-audit/AUDIT-VERDICTS.md
 * Retained as layout-generation reference per KEEP-ref policy.
 */

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
