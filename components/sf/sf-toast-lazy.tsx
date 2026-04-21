"use client";

import dynamic from "next/dynamic";

// Sonner (~33 kB gz) + the SFToastContent render stack are pulled in lazily,
// outside the critical path. SFToaster has no per-page state, so a client-only
// dynamic mount is correct; the imperative sfToast API lives in sf-toast and
// is imported separately by whatever component fires a toast.
const SFToasterInner = dynamic(
  () => import("./sf-toast").then((m) => ({ default: m.SFToaster })),
  { ssr: false },
);

export function SFToasterLazy() {
  return <SFToasterInner />;
}
