"use client";

import dynamic from "next/dynamic";

const GlobalEffects = dynamic(
  () => import("@/components/layout/global-effects").then((m) => m.GlobalEffects),
  { ssr: false }
);

export function GlobalEffectsLazy() {
  return <GlobalEffects />;
}
