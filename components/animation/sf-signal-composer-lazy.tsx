"use client";

import dynamic from "next/dynamic";
import type { SFSignalComposerProps } from "./sf-signal-composer";

const SFSignalComposerInner = dynamic(
  () => import("./sf-signal-composer").then((m) => m.SFSignalComposer),
  { ssr: false }
);

export function SFSignalComposerLazy(props: SFSignalComposerProps) {
  return <SFSignalComposerInner {...props} />;
}
