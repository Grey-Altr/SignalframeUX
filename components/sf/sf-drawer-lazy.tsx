"use client";

/**
 * Lazy loader for SFDrawer -- loads vaul only when rendered.
 *
 * Heavy component: never exported from sf/index.ts barrel.
 * Import this file directly when you need a drawer.
 *
 * @example
 * ```tsx
 * import { SFDrawerLazy } from "@/components/sf/sf-drawer-lazy";
 * import { SFDrawerContent, SFDrawerHeader, SFDrawerTitle } from "@/components/sf/sf-drawer";
 *
 * <SFDrawerLazy>
 *   <SFDrawerContent>
 *     <SFDrawerHeader><SFDrawerTitle>Panel</SFDrawerTitle></SFDrawerHeader>
 *   </SFDrawerContent>
 * </SFDrawerLazy>
 * ```
 */

import dynamic from "next/dynamic";
import { SFSkeleton } from "@/components/sf";

const SFDrawerDynamic = dynamic(
  () =>
    import("@/components/sf/sf-drawer").then((m) => ({
      default: m.SFDrawer,
    })),
  {
    ssr: false,
    loading: () => <SFSkeleton className="h-[200px] w-full" />,
  }
);

export function SFDrawerLazy(
  props: React.ComponentProps<typeof SFDrawerDynamic>
) {
  return <SFDrawerDynamic {...props} />;
}
