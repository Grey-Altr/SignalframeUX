"use client";

/**
 * @status reference-template
 * No live consumers (lockdown audit 2026-04-22, §6.31).
 * See: .planning/lockdown-audit/AUDIT-VERDICTS.md
 * Retained as layout-generation reference per KEEP-ref policy.
 */

/**
 * SSR-safe lazy wrapper for ParticleField.
 * next/dynamic({ ssr: false }) ensures navigator.hardwareConcurrency
 * and WebGL APIs are only accessed client-side.
 * Mirrors the DatamoshOverlayLazy / SignalOverlayLazy pattern.
 */

import dynamic from "next/dynamic";

const ParticleFieldDynamic = dynamic(
  () =>
    import("@/components/animation/particle-field").then((m) => ({
      default: m.ParticleField,
    })),
  { ssr: false }
);

export function ParticleFieldLazy() {
  return <ParticleFieldDynamic />;
}
