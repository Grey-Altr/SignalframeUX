"use client";

/**
 * SSR-safe lazy wrapper for SignalMesh.
 * next/dynamic({ ssr: false }) must live in a Client Component.
 * Mirrors the SignalCanvasLazy pattern from components/layout/signal-canvas-lazy.tsx.
 */

import dynamic from "next/dynamic";

const SignalMeshDynamic = dynamic(
  () => import("@/components/animation/signal-mesh").then((m) => ({ default: m.SignalMesh })),
  { ssr: false }
);

export function SignalMeshLazy() {
  return <SignalMeshDynamic />;
}
