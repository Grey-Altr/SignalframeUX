"use client";

/**
 * SSR-safe lazy wrapper for GLSLSignal.
 *
 * next/dynamic({ ssr: false }) prevents React hydration mismatches from
 * window/WebGL checks that differ between server and client renders.
 * Same pattern as ProofShaderLazy / GLSLHeroLazy.
 *
 * SIGNAL/FRAME ordering: signal runs through the frame.
 *
 * @module components/animation/glsl-signal-lazy
 */

import dynamic from "next/dynamic";

const GLSLSignalDynamic = dynamic(
  () =>
    import("@/components/animation/glsl-signal").then((m) => ({
      default: m.GLSLSignal,
    })),
  { ssr: false },
);

export function GLSLSignalLazy() {
  return <GLSLSignalDynamic />;
}
