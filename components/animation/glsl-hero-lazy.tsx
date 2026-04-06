"use client";

/**
 * SSR-safe lazy wrapper for GLSLHero.
 * next/dynamic({ ssr: false }) must live in a Client Component.
 * Mirrors the SignalCanvasLazy / SignalMeshLazy pattern.
 */

import dynamic from "next/dynamic";

const GLSLHeroDynamic = dynamic(
  () => import("@/components/animation/glsl-hero").then((m) => ({ default: m.GLSLHero })),
  { ssr: false }
);

export function GLSLHeroLazy() {
  return <GLSLHeroDynamic />;
}
