"use client";

import dynamic from "next/dynamic";

const SignalCanvas = dynamic(
  () => import("@/lib/signal-canvas").then((m) => m.SignalCanvas),
  { ssr: false }
);

export function SignalCanvasLazy() {
  return <SignalCanvas />;
}
