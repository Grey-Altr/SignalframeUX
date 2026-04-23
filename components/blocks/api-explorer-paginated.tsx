"use client";

import { useCallback } from "react";
import { useLenisInstance } from "@/components/layout/lenis-provider";
import { useAPIExplorer } from "@/context/api-explorer-context";
import { useAPIPagination } from "@/hooks/use-api-pagination";
import { APIIndexPanel } from "./api-index-panel";
import { APIAuxPanel } from "./api-aux-panel";

export function APIExplorerPaginated() {
  const { query } = useAPIExplorer();
  const { componentsSlices, hooksEntries, tokensEntries, totalVisible, isDesktop } = useAPIPagination(query);
  const lenis = useLenisInstance();

  const scrollToPanel = useCallback(
    (name: string) => {
      const el = document.querySelector<HTMLElement>(`[data-section="${name}"]`);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      if (lenis) lenis.scrollTo(top, { lock: true });
      else window.scrollTo({ top, behavior: "smooth" });
    },
    [lenis],
  );

  if (totalVisible === 0) {
    return (
      <div
        data-section="no-match"
        className="h-[var(--sf-panel-height)] overflow-hidden flex items-center justify-center font-mono text-[var(--text-sm)] uppercase tracking-[0.2em] text-muted-foreground"
      >
        {`// NO SURFACES MATCH "${query}"`}
      </div>
    );
  }

  const hasAux = hooksEntries.length > 0 || tokensEntries.length > 0;
  const totalWithAux = componentsSlices.length + (hasAux ? 1 : 0);

  return (
    <>
      {componentsSlices.map((slice, i) => (
        <APIIndexPanel
          key={`components-${i}`}
          slice={slice}
          panelIndex={i}
          totalPanels={componentsSlices.length}
          isDesktop={isDesktop}
          onPrev={i > 0 ? () => scrollToPanel(`components-${i}`) : undefined}
          onNext={
            i < totalWithAux - 1
              ? () => scrollToPanel(i + 1 < componentsSlices.length ? `components-${i + 2}` : "aux-surfaces")
              : undefined
          }
        />
      ))}
      {hasAux && (
        <APIAuxPanel
          hooksEntries={hooksEntries}
          tokensEntries={tokensEntries}
          onPrev={
            componentsSlices.length > 0
              ? () => scrollToPanel(`components-${componentsSlices.length}`)
              : undefined
          }
        />
      )}
    </>
  );
}
