"use client";

/**
 * Lazy loader for SFRichEditor — loads @tiptap/* only when rendered.
 *
 * P3 component (Pattern B): never exported from sf/index.ts barrel.
 * Import this file directly — do NOT import via @/components/sf barrel.
 * Tiptap (~55-70 KB gzip) lands exclusively in this lazy chunk;
 * homepage First Load JS is not affected.
 *
 * SSR contract:
 *   - ssr: false prevents server-side evaluation of sf-rich-editor.tsx
 *   - sf-rich-editor.tsx also carries immediatelyRender: false + injectCSS: false
 *     for belt-and-suspenders hydration safety
 *
 * Registry entry (public/r/sf-rich-editor.json + registry.json items[]) is deferred
 * to Phase 76 REG-01 per Phase 71 Pattern B precedent. Do NOT add registry artifacts here.
 *
 * @example
 * ```tsx
 * import { SFRichEditorLazy } from "@/components/sf/sf-rich-editor-lazy";
 *
 * <SFRichEditorLazy value={html} onChange={setHtml} />
 * ```
 */

import dynamic from "next/dynamic";
import { SFSkeleton } from "@/components/sf";

const SFRichEditorDynamic = dynamic(
  () =>
    import("@/components/sf/sf-rich-editor").then((m) => ({
      default: m.SFRichEditor,
    })),
  {
    ssr: false,
    loading: () => <SFSkeleton className="h-[200px] w-full" />,
  }
);

export function SFRichEditorLazy(
  props: React.ComponentProps<typeof SFRichEditorDynamic>
) {
  return <SFRichEditorDynamic {...props} />;
}
