"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { SFPanel } from "@/components/sf";
import { useAPIExplorer } from "@/context/api-explorer-context";
import { APIEntryRow } from "./api-entry-row";
import { APIEntryDataSheet } from "./api-entry-data-sheet";
import type { APIEntry } from "@/hooks/use-api-pagination";

interface APIAuxPanelProps {
  hooksEntries: APIEntry[];
  tokensEntries: APIEntry[];
  onPrev?: () => void;
}

export function APIAuxPanel({ hooksEntries, tokensEntries, onPrev }: APIAuxPanelProps) {
  const { activeEntryId, setActiveEntryId } = useAPIExplorer();
  const panelRef = useRef<HTMLElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const lastActivatedIdRef = useRef<string | null>(null);

  const activeInPanel = useMemo(() => {
    if (!activeEntryId) return null;
    return (
      hooksEntries.find((e) => e.id === activeEntryId) ??
      tokensEntries.find((e) => e.id === activeEntryId) ??
      null
    );
  }, [activeEntryId, hooksEntries, tokensEntries]);

  const handleRowClick = useCallback(
    (id: string) => {
      if (activeEntryId === id) {
        setActiveEntryId(null);
      } else {
        lastActivatedIdRef.current = id;
        setActiveEntryId(id);
      }
    },
    [activeEntryId, setActiveEntryId],
  );

  const handleRowKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, id: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleRowClick(id);
      } else if (e.key === "Escape" && activeEntryId) {
        e.preventDefault();
        setActiveEntryId(null);
      }
    },
    [activeEntryId, handleRowClick, setActiveEntryId],
  );

  const handlePanelKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === "Escape" && activeEntryId) {
        e.preventDefault();
        setActiveEntryId(null);
      }
    },
    [activeEntryId, setActiveEntryId],
  );

  const label = `AUXILIARY SURFACES${activeInPanel ? ` · ${activeInPanel.doc.importName}` : ""}`;

  // §14.18 R-64-j focus management: focus detail on open, re-focus row on close.
  useEffect(() => {
    if (activeInPanel) {
      detailRef.current?.focus();
      return;
    }
    // Grid restored — if we were previously active, re-focus the triggering row.
    const lastId = lastActivatedIdRef.current;
    if (!lastId || !panelRef.current) return;
    const raf = requestAnimationFrame(() => {
      const row = panelRef.current?.querySelector<HTMLButtonElement>(
        `[data-api-entry="${lastId}"]`,
      );
      row?.focus();
      lastActivatedIdRef.current = null;
    });
    return () => cancelAnimationFrame(raf);
  }, [activeInPanel]);

  return (
    <SFPanel
      ref={panelRef}
      name="aux-surfaces"
      mode="fit"
      label={label}
      className="flex flex-col font-mono bg-background"
    >
      <div className="flex items-center justify-between px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] pt-[var(--sfx-space-4)] pb-[var(--sfx-space-2)] text-[var(--text-xs)] uppercase tracking-[0.25em] text-muted-foreground border-b border-foreground/15 shrink-0">
        <span className="text-foreground">{label}</span>
        <span aria-hidden="true" className="tabular-nums text-muted-foreground">
          [{String(hooksEntries.length + tokensEntries.length).padStart(2, "0")}]
        </span>
      </div>

      <div data-panel-content className="flex-1 min-h-0 overflow-hidden">
        {activeInPanel ? (
          <div
            ref={detailRef}
            tabIndex={-1}
            onKeyDown={handlePanelKeyDown}
            aria-label={`${activeInPanel.doc.importName} details. Press Escape to close.`}
            className="px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] pt-[var(--sfx-space-6)] pb-[var(--sfx-space-6)] outline-none"
          >
            <APIEntryDataSheet doc={activeInPanel.doc} />
          </div>
        ) : (
          <div className="px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] py-[var(--sfx-space-4)] space-y-[var(--sfx-space-6)]">
            <section>
              <div className="text-[var(--text-xs)] uppercase tracking-[0.25em] text-muted-foreground mb-[var(--sfx-space-2)] border-b border-foreground/15 pb-[var(--sfx-space-1)]">
                HOOKS <span className="text-muted-foreground">{"//"}</span> {hooksEntries.length} SURFACES
              </div>
              {hooksEntries.length === 0 ? (
                <div className="text-[var(--text-xs)] uppercase tracking-[0.15em] text-muted-foreground">
                  {"// NO MATCH"}
                </div>
              ) : (
                <ul role="list" className="list-none m-0 p-0 divide-y divide-foreground/10">
                  {hooksEntries.map((entry) => (
                    <li key={entry.id}>
                      <APIEntryRow
                        id={entry.id}
                        doc={entry.doc}
                        active={false}
                        showStatus
                        onClick={handleRowClick}
                        onKeyDown={handleRowKeyDown}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <div className="text-[var(--text-xs)] uppercase tracking-[0.25em] text-muted-foreground mb-[var(--sfx-space-2)] border-b border-foreground/15 pb-[var(--sfx-space-1)]">
                TOKENS <span className="text-muted-foreground">{"//"}</span> {tokensEntries.length} SURFACES
              </div>
              {tokensEntries.length === 0 ? (
                <div className="text-[var(--text-xs)] uppercase tracking-[0.15em] text-muted-foreground">
                  {"// NO TOKENS REGISTERED — pending v0.2"}
                </div>
              ) : (
                <ul role="list" className="list-none m-0 p-0 divide-y divide-foreground/10">
                  {tokensEntries.map((entry) => (
                    <li key={entry.id}>
                      <APIEntryRow
                        id={entry.id}
                        doc={entry.doc}
                        active={false}
                        showStatus
                        onClick={handleRowClick}
                        onKeyDown={handleRowKeyDown}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-[var(--sfx-space-4)] px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] py-[var(--sfx-space-2)] text-[var(--text-xs)] uppercase tracking-[0.2em] text-muted-foreground border-t border-foreground/15 shrink-0">
        <button
          type="button"
          onClick={onPrev}
          disabled={!onPrev}
          aria-label="Previous panel"
          className="disabled:opacity-30 hover:text-foreground focus-visible:text-foreground outline-none"
        >
          <span aria-hidden="true">◀</span>
        </button>
        <span className="tabular-nums">AUX</span>
      </div>
    </SFPanel>
  );
}
