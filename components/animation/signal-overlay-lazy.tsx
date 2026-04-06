"use client";

/**
 * SSR-safe lazy wrapper for SignalOverlay.
 * next/dynamic({ ssr: false }) must live in a Client Component.
 * Mirrors the SignalMeshLazy pattern from components/animation/signal-mesh-lazy.tsx.
 */

import dynamic from "next/dynamic";

const SignalOverlayDynamic = dynamic(
  () =>
    import("@/components/animation/signal-overlay").then((m) => ({
      default: m.SignalOverlay,
    })),
  { ssr: false }
);

export function SignalOverlayLazy() {
  return <SignalOverlayDynamic />;
}
