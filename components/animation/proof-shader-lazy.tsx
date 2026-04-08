"use client";

/**
 * SSR-safe lazy wrapper for ProofShader.
 * next/dynamic({ ssr: false }) required because ProofShader imports Three.js
 * at module level — same pattern as GLSLHeroLazy / SignalMeshLazy.
 */

import dynamic from "next/dynamic";
import type { ProofShaderProps } from "@/components/animation/proof-shader";

const ProofShaderDynamic = dynamic(
  () =>
    import("@/components/animation/proof-shader").then((m) => ({
      default: m.ProofShader,
    })),
  { ssr: false }
);

export function ProofShaderLazy(props: ProofShaderProps) {
  return <ProofShaderDynamic {...props} />;
}
