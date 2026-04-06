"use client";

/**
 * Lazy loader for SFMenubar -- loads Radix Menubar only when rendered.
 *
 * P3 component: never exported from sf/index.ts barrel.
 * Import this file directly when you need a menubar.
 *
 * @example
 * ```tsx
 * import { SFMenubarLazy } from "@/components/sf/sf-menubar-lazy";
 *
 * <SFMenubarLazy>...</SFMenubarLazy>
 * ```
 */

import dynamic from "next/dynamic";
import { SFSkeleton } from "@/components/sf";

const SFMenubarDynamic = dynamic(
  () =>
    import("@/components/sf/sf-menubar").then((m) => ({
      default: m.SFMenubar,
    })),
  {
    ssr: false,
    loading: () => <SFSkeleton className="h-10 w-full" />,
  }
);

export function SFMenubarLazy(
  props: React.ComponentProps<typeof SFMenubarDynamic>
) {
  return <SFMenubarDynamic {...props} />;
}
