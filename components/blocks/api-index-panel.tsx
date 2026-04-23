"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { SFPanel } from "@/components/sf";
import { useAPIExplorer } from "@/context/api-explorer-context";
import { APIEntryRow } from "./api-entry-row";
import { APIEntryDataSheet } from "./api-entry-data-sheet";
import type { APIEntry } from "@/hooks/use-api-pagination";

interface APIIndexPanelProps {
  slice: APIEntry[];
  panelIndex: number; // 0-based
  totalPanels: number;
  isDesktop: boolean;
  onPrev?: () => void;
  onNext?: () => void;
}

export function APIIndexPanel({ slice, panelIndex, totalPanels, isDesktop, onPrev, onNext }: APIIndexPanelProps) {
  const { activeEntryId, setActiveEntryId } = useAPIExplorer();
  const panelRef = useRef<HTMLElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const lastActivatedIdRef = useRef<string | null>(null);

  const activeInSlice = useMemo(
    () => (activeEntryId ? slice.find((e) => e.id === activeEntryId) ?? null : null),
    [slice, activeEntryId],
  );

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

  const label = `COMPONENTS ${String(panelIndex + 1).padStart(2, "0")}/${String(totalPanels).padStart(2, "0")}${
    activeInSlice ? ` · ${activeInSlice.doc.importName}` : ""
  }`;

  // Dev-only overflow guard (R-63-c compliance check).
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const el = panelRef.current;
    if (!el) return;
    const contentZone = el.querySelector<HTMLElement>("[data-panel-content]");
    if (!contentZone) return;
    const check = () => {
      if (contentZone.scrollHeight > contentZone.clientHeight + 1) {
        console.warn(
          `[§14.18 R-63-c] APIIndexPanel ${panelIndex + 1}/${totalPanels} overflows port: ` +
            `${contentZone.scrollHeight}px content vs ${contentZone.clientHeight}px port.`,
        );
      }
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(contentZone);
    return () => ro.disconnect();
  }, [panelIndex, totalPanels, activeInSlice]);

  // §14.18 R-64-j focus management: focus detail on open, re-focus row on close.
  useEffect(() => {
    if (activeInSlice) {
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
  }, [activeInSlice]);

  const half = Math.ceil(slice.length / 2);
  const aSide = isDesktop ? slice.slice(0, half) : slice;
  const bSide = isDesktop ? slice.slice(half) : [];

  return (
    <SFPanel
      ref={panelRef}
      name={`components-${panelIndex + 1}`}
      mode="fit"
      label={label}
      className="flex flex-col font-mono bg-background"
    >
      <div className="flex items-center justify-between px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] pt-[var(--sfx-space-4)] pb-[var(--sfx-space-2)] text-[var(--text-xs)] uppercase tracking-[0.25em] text-muted-foreground border-b border-foreground/15 shrink-0">
        <span className="text-foreground">{label}</span>
        <span aria-hidden="true" className="tabular-nums text-muted-foreground">
          [{String(slice.length).padStart(2, "0")}]
        </span>
      </div>

      <div data-panel-content className="flex-1 min-h-0 overflow-hidden">
        {activeInSlice ? (
          <div
            ref={detailRef}
            tabIndex={-1}
            onKeyDown={handlePanelKeyDown}
            aria-label={`${activeInSlice.doc.importName} details. Press Escape to close.`}
            className="px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] pt-[var(--sfx-space-6)] pb-[var(--sfx-space-6)] outline-none"
          >
            <APIEntryDataSheet doc={activeInSlice.doc} />
          </div>
        ) : isDesktop ? (
          <div className="grid grid-cols-2 divide-x divide-foreground/20 h-full">
            <ul role="list" className="list-none m-0 p-0 divide-y divide-foreground/10 overflow-hidden">
              {aSide.map((entry) => (
                <li key={entry.id}>
                  <APIEntryRow
                    id={entry.id}
                    doc={entry.doc}
                    active={false}
                    showStatus={false}
                    onClick={handleRowClick}
                    onKeyDown={handleRowKeyDown}
                  />
                </li>
              ))}
            </ul>
            <ul role="list" className="list-none m-0 p-0 divide-y divide-foreground/10 overflow-hidden">
              {bSide.map((entry) => (
                <li key={entry.id}>
                  <APIEntryRow
                    id={entry.id}
                    doc={entry.doc}
                    active={false}
                    showStatus={false}
                    onClick={handleRowClick}
                    onKeyDown={handleRowKeyDown}
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <ul role="list" className="list-none m-0 p-0 divide-y divide-foreground/10 overflow-hidden">
            {slice.map((entry) => (
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
        <span className="tabular-nums">
          {String(panelIndex + 1).padStart(2, "0")}/{String(totalPanels).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={!onNext}
          aria-label="Next panel"
          className="disabled:opacity-30 hover:text-foreground focus-visible:text-foreground outline-none"
        >
          <span aria-hidden="true">▶</span>
        </button>
      </div>
    </SFPanel>
  );
}
