"use client";

import dynamic from "next/dynamic";

// CommandPalette pulls cmdk + several radix packages (~25 kB gz). It only
// activates on ⌘K or an explicit click, so splitting its chunk out of the
// root layout keeps First-Load JS lean. The dialog is never visible until
// the user acts, so client-only mount is correct.
const CommandPaletteDynamic = dynamic(
  () => import("./command-palette").then((m) => ({ default: m.CommandPalette })),
  { ssr: false },
);

export function CommandPaletteLazy(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return <CommandPaletteDynamic {...props} />;
}
