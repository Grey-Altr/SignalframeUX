"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import dynamic from "next/dynamic";
import { COMPONENT_REGISTRY } from "@/lib/component-registry";
import { API_DOCS } from "@/lib/api-docs";
import {
  HOMEPAGE_INVENTORY_INDICES,
  CODED_REGISTRY,
} from "@/lib/nomenclature";
import { cn } from "@/lib/utils";

// Lazy-load ComponentDetail — NOT in shared bundle (DV-12 bundle gate)
const ComponentDetailLazy = dynamic(
  () =>
    import("@/components/blocks/component-detail").then((m) => ({
      default: m.ComponentDetail,
    })),
  { ssr: false, loading: () => null }
);

// ── Build 12-item display rows from HOMEPAGE_INVENTORY_INDICES ────────────
// Match against CODED_REGISTRY to get sfCode

interface InventoryRow {
  index: string;
  sfCode: string;
  name: string;
  layer: "frame" | "signal";
  pattern: "A" | "B" | "C";
}

function buildInventoryRows(): InventoryRow[] {
  const codeMap = new Map(CODED_REGISTRY.map((e) => [e.index, e]));
  return HOMEPAGE_INVENTORY_INDICES.map((idx) => {
    const entry = codeMap.get(idx) ?? COMPONENT_REGISTRY[idx];
    if (!entry)
      throw new Error(
        `HOMEPAGE_INVENTORY_INDICES contains unknown index: ${idx}`
      );
    return {
      index: idx,
      sfCode: entry.sfCode ?? "SF//???-???",
      name: entry.name,
      layer: entry.layer,
      pattern: entry.pattern,
    };
  });
}

const INVENTORY_ROWS = buildInventoryRows();

// ── Grid column classes (shared between header and data rows) ─────────────

const GRID_COLS = "grid grid-cols-[14ch_20ch_12ch_4ch_2ch]";

// ── Component ─────────────────────────────────────────────────────────────

export function InventorySection() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpen = useCallback((index: string, el: HTMLElement) => {
    triggerRef.current = el;
    setOpenIndex(index);
  }, []);

  const handleClose = useCallback(() => {
    setOpenIndex(null);
  }, []);

  // Portal-level Escape handler — catches close even if ComponentDetail
  // lazy chunk hasn't loaded or GSAP animation hasn't completed
  useEffect(() => {
    if (!openIndex) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openIndex, handleClose]);

  const openEntry = openIndex ? COMPONENT_REGISTRY[openIndex] : null;
  const openDoc = openEntry ? API_DOCS[openEntry.docId] : undefined;

  return (
    <section
      id="inventory-section"
      data-section="inventory"
      className="w-full px-8 md:px-12 py-16 md:py-24"
    >
      {/* Section header */}
      <div className="mb-8 flex items-baseline justify-between">
        <span className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
          — INVENTORY
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {INVENTORY_ROWS.length} COMPONENTS
        </span>
      </div>

      {/* Table */}
      <div role="table" aria-label="Component inventory" className="w-full">
        {/* Header row */}
        <div
          role="row"
          className={cn(
            GRID_COLS,
            "font-mono text-xs text-muted-foreground border-b border-foreground/20 pb-1 mb-1"
          )}
          aria-hidden="true"
        >
          <span>SF//</span>
          <span>NAME</span>
          <span>LAYER</span>
          <span>TIER</span>
          <span>—</span>
        </div>

        {/* Data rows */}
        {INVENTORY_ROWS.map((row) => (
          <div
            key={row.index}
            role="row"
            tabIndex={0}
            data-inventory-row
            className={cn(
              GRID_COLS,
              "font-mono text-sm",
              "border-b border-foreground/10 py-1.5 px-0",
              "cursor-pointer transition-colors duration-[34ms]",
              "hover:bg-foreground hover:text-background",
              "focus:bg-foreground focus:text-background focus:outline-none"
            )}
            onClick={(e) =>
              handleOpen(row.index, e.currentTarget as HTMLElement)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleOpen(row.index, e.currentTarget as HTMLElement);
              }
            }}
            aria-label={`Open ${row.name} component detail`}
          >
            <span data-sf-code className="text-primary">
              {row.sfCode}
            </span>
            <span>{row.name}</span>
            <span
              data-layer-tag
              className={
                row.layer === "signal"
                  ? "text-primary"
                  : "text-muted-foreground"
              }
            >
              {row.layer === "signal" ? "[//SIGNAL]" : "[FRAME]"}
            </span>
            <span data-pattern-tier className="text-muted-foreground">
              {row.pattern}
            </span>
            <span aria-hidden="true">→</span>
          </div>
        ))}
      </div>

      {/* Footer link */}
      <div className="mt-6">
        <Link
          href="/inventory"
          className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors duration-[34ms]"
        >
          → /inventory
        </Link>
      </div>

      {/* Fixed portal for ComponentDetail */}
      {mounted &&
        openIndex &&
        openEntry &&
        createPortal(
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-background/60"
              style={{ zIndex: "calc(var(--z-overlay, 100) - 1)" }}
              onClick={handleClose}
              aria-hidden="true"
            />
            {/* Panel */}
            <div
              data-component-detail
              className="fixed right-0 top-0 bottom-0 overflow-y-auto bg-background border-l-4 border-foreground"
              style={{
                zIndex: "var(--z-overlay, 100)",
                width: "clamp(320px, 40vw, 600px)",
              }}
            >
              <ComponentDetailLazy
                entry={openEntry}
                doc={openDoc}
                highlightedCode=""
                onClose={handleClose}
                triggerRef={
                  triggerRef as React.RefObject<HTMLElement | null>
                }
              />
            </div>
          </>,
          document.body
        )}
    </section>
  );
}
