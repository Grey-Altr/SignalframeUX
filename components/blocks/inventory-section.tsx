"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import dynamic from "next/dynamic";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap-core";
import { COMPONENT_REGISTRY } from "@/lib/component-registry";
// API_DOCS no longer imported here — ComponentDetail looks it up internally
// off entry.docId (see components/blocks/component-detail.tsx). Keeps /'s
// First-Load JS lean; the doc table loads with the lazy detail chunk.
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
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Stagger-reveal rows when the section enters viewport. `gsap.from` with
  // embedded scrollTrigger handles all the edge cases: if the page loads
  // already past the trigger, GSAP skips the animation and renders final
  // state; if the user scrolls in normally, rows cascade from opacity:0 +
  // x:-24 to their final position with a 40ms stagger (matches the
  // page-animations.tsx batch cadence). start "top 70%" gives the eye time
  // to parse the header before rows start cascading.
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      // Synchronous reduced-motion guard MUST stay outside rIC: users with
      // prefers-reduced-motion should never schedule any work (D-06).
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // CRT-04 (Phase 63.1 Plan 02): defer the heavy GSAP setup to idle time
      // so first paint is not blocked. The useGSAP hook itself stays synchronous
      // (it must — React hook rules); only the stagger animation construction
      // is scheduled via rIC + setTimeout(0) fallback. Single-ticker rule preserved
      // because gsap.ticker remains the only rAF source — rIC only schedules WHEN
      // the work runs, not what runs inside it. See components/layout/lenis-provider.tsx
      // lines 28-68 for the canonical reference pattern (CRT-04).
      let ricHandle: number | undefined;

      const initAnimations = () => {
        ricHandle = undefined;
        const rows = section.querySelectorAll<HTMLElement>("[data-inventory-row]");
        if (rows.length === 0) return;

        gsap.from(rows, {
          opacity: 0,
          x: -24,
          duration: 0.45,
          stagger: 0.04,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        });
      };

      // Schedule: rIC if available (Chrome/FF; Safari 17+ behind flag),
      // else setTimeout(0) — both yield to the next idle/macrotask.
      type IdleCb = (cb: IdleRequestCallback, opts?: { timeout: number }) => number;
      const ric = (window as Window & { requestIdleCallback?: IdleCb })
        .requestIdleCallback;
      ricHandle = ric
        ? ric(initAnimations, { timeout: 100 })
        : (setTimeout(initAnimations, 0) as unknown as number);

      return () => {
        // Cancel pending rIC/setTimeout if init has not fired yet (fast unmounts).
        const cancelRic = (
          window as Window & { cancelIdleCallback?: (h: number) => void }
        ).cancelIdleCallback;
        if (ricHandle !== undefined) {
          if (cancelRic) cancelRic(ricHandle);
          else clearTimeout(ricHandle);
        }
      };
    },
    { scope: sectionRef, dependencies: [] },
  );

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

  return (
    <section
      ref={sectionRef}
      id="inventory-section"
      className="w-full h-full flex flex-col px-[var(--sfx-space-8)] md:px-[var(--sfx-space-12)] py-16 md:py-24"
    >
      {/* Section header */}
      <div className="mb-[var(--sfx-space-6)] flex items-baseline justify-between">
        <span className="font-mono text-xs text-foreground/70 tracking-widest uppercase">
          — INVENTORY
        </span>
        <span className="font-mono text-xs text-foreground/70">
          {INVENTORY_ROWS.length} COMPONENTS
        </span>
      </div>

      {/* Table — flex-1 to fill remaining viewport, rows distribute evenly */}
      <div
        role="table"
        aria-label="Component inventory"
        className="w-full flex-1 flex flex-col min-h-0"
      >
        {/* Header row — aria-hidden, use plain spans (no role= on hidden children) */}
        <div
          role="row"
          className={cn(
            GRID_COLS,
            "font-mono text-xs text-foreground/70 border-b border-foreground/20 pb-[var(--sfx-space-2)] mb-[var(--sfx-space-1)] shrink-0 items-end"
          )}
          aria-hidden="true"
        >
          <span>SF//</span>
          <span>NAME</span>
          <span>LAYER</span>
          <span>TIER</span>
          <span>—</span>
        </div>

        {/* Data rows — flex-1 each, distributes available height across 12 rows */}
        {INVENTORY_ROWS.map((row) => (
          <div
            key={row.index}
            role="row"
            tabIndex={0}
            data-inventory-row
            className={cn(
              GRID_COLS,
              "font-mono text-sm",
              "border-b border-foreground/10 px-0",
              "flex-1 items-center min-h-0",
              "cursor-pointer transition-colors duration-[var(--sfx-duration-instant)]",
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
            <span role="cell" data-sf-code className="text-primary">
              {row.sfCode}
            </span>
            <span role="cell">{row.name}</span>
            <span
              role="cell"
              data-layer-tag
              className={
                row.layer === "signal"
                  ? "text-primary"
                  : "text-foreground/70"
              }
            >
              {row.layer === "signal" ? "[//SIGNAL]" : "[FRAME]"}
            </span>
            <span role="cell" data-pattern-tier className="text-foreground/70">
              {row.pattern}
            </span>
            <span role="cell" aria-hidden="true">→</span>
          </div>
        ))}
      </div>

      {/* Footer link */}
      <div className="mt-[var(--sfx-space-4)] shrink-0">
        <Link
          href="/inventory"
          className="font-mono text-sm text-foreground/70 hover:text-foreground transition-colors duration-[var(--sfx-duration-instant)]"
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
                width: "clamp(320px, calc(40*var(--sf-vw)), 600px)",
              }}
            >
              <ComponentDetailLazy
                entry={openEntry}
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
