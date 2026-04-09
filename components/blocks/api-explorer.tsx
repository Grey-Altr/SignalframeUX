"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { API_DOCS } from "@/lib/api-docs";
import type { ComponentDoc } from "@/lib/api-docs";

/* ──────────────────────────────────────────────────────────────
   SP-04 — /reference schematic API index
   Register: Dischord tracklist + MIDI 1.0 spec + Wipeout stat blocks.
   NOT dev-docs sidebar/content/preview. NOT material-ui prop cards.

   Data layer (API_DOCS) frozen — this file restyles the render layer only.
   ────────────────────────────────────────────────────────────── */

type SurfaceKey = "COMPONENTS" | "HOOKS" | "TOKENS";

interface SurfaceEntry {
  id: string;
  doc: ComponentDoc;
}

interface SurfaceGroup {
  key: SurfaceKey;
  label: string;
  entries: SurfaceEntry[];
}

/** Classify an API_DOCS entry into one of three schematic surface groups. */
function classify(doc: ComponentDoc): SurfaceKey {
  if (doc.layer === "HOOK") return "HOOKS";
  if (doc.layer === "TOKEN") return "TOKENS";
  // CORE, FRAME, SIGNAL → COMPONENTS
  return "COMPONENTS";
}

/** Render a monospaced type signature stub for a doc entry.
 *  HOOKS render as `useName()`. TOKENS render as `name:`. Everything else as `Name(`. */
function formatSignature(doc: ComponentDoc): string {
  if (doc.layer === "HOOK") return "()";
  if (doc.layer === "TOKEN") return ":";
  return "(";
}

export function APIExplorer() {
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // ── Surface grouping (computed once from API_DOCS, filtered by query) ──
  const groups = useMemo<SurfaceGroup[]>(() => {
    const buckets: Record<SurfaceKey, SurfaceEntry[]> = {
      COMPONENTS: [],
      HOOKS: [],
      TOKENS: [],
    };
    for (const id of Object.keys(API_DOCS)) {
      const doc = API_DOCS[id];
      buckets[classify(doc)].push({ id, doc });
    }
    const q = query.trim().toLowerCase();
    const filter = (arr: SurfaceEntry[]) =>
      q
        ? arr.filter(
            (e) =>
              e.id.toLowerCase().includes(q) ||
              e.doc.name.toLowerCase().includes(q) ||
              e.doc.description.toLowerCase().includes(q),
          )
        : arr;
    return [
      { key: "COMPONENTS", label: "COMPONENTS", entries: filter(buckets.COMPONENTS) },
      { key: "HOOKS", label: "HOOKS", entries: filter(buckets.HOOKS) },
      { key: "TOKENS", label: "TOKENS", entries: filter(buckets.TOKENS) },
    ];
  }, [query]);

  const totalVisible = groups.reduce((sum, g) => sum + g.entries.length, 0);
  const totalAll = Object.keys(API_DOCS).length;

  // ── Entry click: toggle active + scroll reset ──
  const handleEntryClick = useCallback(
    (id: string) => {
      setActiveEntryId((prev) => (prev === id ? null : id));
      contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    },
    [],
  );

  // ── Keyboard navigation across entry rows ──
  const handleEntryKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, id: string) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const all = Array.from(
          containerRef.current?.querySelectorAll<HTMLButtonElement>("[data-api-entry]") ?? [],
        );
        const idx = all.findIndex((b) => b.dataset.apiEntry === id);
        if (idx === -1) return;
        const nextIdx =
          e.key === "ArrowDown"
            ? Math.min(idx + 1, all.length - 1)
            : Math.max(idx - 1, 0);
        all[nextIdx]?.focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        const first = containerRef.current?.querySelector<HTMLButtonElement>("[data-api-entry]");
        first?.focus();
      } else if (e.key === "End") {
        e.preventDefault();
        const all = containerRef.current?.querySelectorAll<HTMLButtonElement>("[data-api-entry]");
        all?.[all.length - 1]?.focus();
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleEntryClick(id);
      }
    },
    [handleEntryClick],
  );

  // ── GSAP: entry row stagger fade-in (single effect, reduced-motion guard) ──
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let ctx: { revert: () => void } | null = null;

    import("@/lib/gsap-core").then(({ gsap }) => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const entries = containerRef.current?.querySelectorAll("[data-api-entry]");
        if (entries?.length) {
          gsap.from(entries, {
            opacity: 0,
            y: 4,
            duration: 0.25,
            stagger: 0.015,
            ease: "power2.out",
            delay: 0.1,
          });
        }
        const groupHeads = containerRef.current?.querySelectorAll("[data-api-surface-group-head]");
        if (groupHeads?.length) {
          gsap.from(groupHeads, {
            opacity: 0,
            x: -6,
            duration: 0.3,
            stagger: 0.08,
            ease: "power2.out",
          });
        }
      }, containerRef);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      data-cursor
      className="relative min-h-[calc(100vh-var(--nav-height))] font-mono bg-background"
    >
      {/* ── FILTER BAR ─────────────────────────────────────────── */}
      <div className="sticky top-[var(--nav-height)] z-[var(--z-content)] border-b border-foreground/25 bg-background">
        <label className="flex items-center gap-4 px-6 md:px-12 py-4 text-[var(--text-xs)] uppercase tracking-[0.2em] text-muted-foreground min-w-0">
          <span aria-hidden="true" className="shrink-0">FILTER //</span>
          <input
            data-api-search
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="TYPE TO FILTER"
            aria-label="Filter API entries"
            spellCheck={false}
            autoComplete="off"
            className="flex-1 min-w-0 bg-transparent border-none outline-none text-foreground font-mono text-[var(--text-sm)] tracking-tight placeholder:text-muted-foreground/40 focus:placeholder:text-muted-foreground/60"
          />
          <span
            aria-live="polite"
            className="tabular-nums text-muted-foreground shrink-0"
          >
            {String(totalVisible).padStart(2, "0")}/{String(totalAll).padStart(2, "0")}
          </span>
        </label>
      </div>

      {/* ── GROUPED SCHEMATIC INDEX ─────────────────────────────── */}
      <div
        ref={contentRef}
        role="navigation"
        aria-label="API surfaces"
        className="divide-y divide-foreground/20"
      >
        {groups.map((group) => (
          <div key={group.key} data-api-surface-group={group.key}>
            <div
              data-api-surface-group-head
              className="flex items-baseline justify-between px-6 md:px-12 pt-12 pb-4 text-[var(--text-xs)] uppercase tracking-[0.25em] text-muted-foreground border-b border-foreground/15"
            >
              <span className="text-foreground">
                {group.label} <span className="text-muted-foreground/60">//</span> {group.entries.length} SURFACES
              </span>
              <span aria-hidden="true" className="tabular-nums text-muted-foreground/60">
                [{String(group.entries.length).padStart(2, "0")}]
              </span>
            </div>

            {group.entries.length === 0 ? (
              <div className="px-6 md:px-12 py-6 text-[var(--text-xs)] uppercase tracking-[0.15em] text-muted-foreground/60">
                // NO MATCH
              </div>
            ) : (
              <ul role="list" className="list-none m-0 p-0 divide-y divide-foreground/10">
                {group.entries.map((entry) => {
                  const isActive = activeEntryId === entry.id;
                  const { doc } = entry;
                  return (
                    <li key={entry.id}>
                      <button
                        type="button"
                        data-api-entry={entry.id}
                        data-api-entry-active={isActive ? "true" : undefined}
                        aria-current={isActive ? "location" : undefined}
                        aria-expanded={isActive}
                        onClick={() => handleEntryClick(entry.id)}
                        onKeyDown={(e) => handleEntryKeyDown(e, entry.id)}
                        className={`group w-full text-left px-6 md:px-12 py-3 flex items-baseline gap-6 border-l-[3px] transition-colors outline-none ${
                          isActive
                            ? "border-l-primary bg-foreground/[0.06]"
                            : "border-l-transparent hover:bg-foreground/[0.04] focus-visible:bg-foreground/[0.08] focus-visible:border-l-foreground/40"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className="w-4 shrink-0 text-[var(--text-xs)] tabular-nums text-muted-foreground/70"
                        >
                          {isActive ? "◉" : "○"}
                        </span>
                        <span className="flex-1 text-foreground tracking-tight text-[var(--text-sm)] break-all">
                          {doc.importName}
                          <span className="text-muted-foreground/60">{formatSignature(doc)}</span>
                        </span>
                        <span className="hidden sm:inline text-[var(--text-xs)] tabular-nums text-muted-foreground/70">
                          {doc.version}
                        </span>
                        <span className="text-[var(--text-xs)] uppercase tracking-[0.15em] text-muted-foreground/80">
                          [{doc.layer}]
                        </span>
                        <span className="hidden md:inline text-[var(--text-xs)] uppercase tracking-[0.15em] text-muted-foreground/60">
                          {doc.status}
                        </span>
                      </button>

                      {isActive && (
                        <div className="px-6 md:px-12 pt-6 pb-12 bg-foreground/[0.03] border-t border-foreground/15">
                          <EntryDataSheet doc={doc} />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}

        {/* Footer rule — schematic terminator */}
        <div className="px-6 md:px-12 py-8 text-[var(--text-xs)] uppercase tracking-[0.2em] text-muted-foreground/60">
          [EOF] // SIGNALFRAME//UX · {totalAll} SURFACES REGISTERED
        </div>
      </div>
    </section>
  );
}

/** EntryDataSheet — inline expanded body for a selected API surface.
 *  Renders description, import, props (as column-aligned grid data sheet),
 *  usage examples (inline pre blocks), and a11y notes. */
function EntryDataSheet({ doc }: { doc: ComponentDoc }) {
  const propsLabel =
    doc.layer === "HOOK" ? "RETURNS" : doc.layer === "TOKEN" ? "TOKENS" : "PROPS";

  return (
    <div className="max-w-[var(--max-w-wide)]">
      {/* Description */}
      <p className="font-mono text-[var(--text-sm)] uppercase tracking-tight text-muted-foreground leading-[1.6] max-w-[72ch] mb-8">
        {doc.description}
      </p>

      {/* Import line */}
      <section className="mb-8">
        <div className="text-[var(--text-xs)] uppercase tracking-[0.2em] text-muted-foreground/80 mb-2 border-b border-foreground/15 pb-1">
          IMPORT
        </div>
        <pre className="overflow-x-auto font-mono text-[var(--text-sm)] text-foreground whitespace-pre-wrap break-all">
          {`import { ${doc.importName} } from "${doc.importPath}";`}
        </pre>
      </section>

      {/* Props data sheet — column-aligned grid, NOT a table, NOT cards */}
      {doc.props.length > 0 && (
        <section className="mb-8">
          <div className="text-[var(--text-xs)] uppercase tracking-[0.2em] text-muted-foreground/80 mb-3 border-b border-foreground/15 pb-1">
            {propsLabel}
          </div>
          <div
            data-api-props-table
            role="list"
            aria-label={`${doc.name} ${propsLabel.toLowerCase()}`}
            className="grid grid-cols-[minmax(120px,auto)_minmax(140px,1.4fr)_minmax(90px,auto)_minmax(200px,2fr)] gap-x-6 gap-y-2 font-mono text-[var(--text-xs)] pt-2"
          >
            <div className="uppercase tracking-[0.15em] text-muted-foreground/60">NAME</div>
            <div className="uppercase tracking-[0.15em] text-muted-foreground/60">TYPE</div>
            <div className="uppercase tracking-[0.15em] text-muted-foreground/60">DEFAULT</div>
            <div className="uppercase tracking-[0.15em] text-muted-foreground/60">DESCRIPTION</div>
            {doc.props.map((prop) => (
              <Fragment key={prop.name}>
                <div className="text-foreground break-all">
                  {prop.name}
                  {prop.required ? <span className="text-primary">*</span> : null}
                </div>
                <div className="text-muted-foreground break-all">{prop.type}</div>
                <div className="text-muted-foreground tabular-nums break-all">
                  {prop.default || "—"}
                </div>
                <div className="text-muted-foreground uppercase tracking-tight leading-[1.5]">
                  {prop.desc}
                </div>
              </Fragment>
            ))}
          </div>
        </section>
      )}

      {/* Usage examples — inline pre blocks */}
      {doc.usage.length > 0 && (
        <section className="mb-8">
          <div className="text-[var(--text-xs)] uppercase tracking-[0.2em] text-muted-foreground/80 mb-3 border-b border-foreground/15 pb-1">
            USAGE
          </div>
          <div className="space-y-4">
            {doc.usage.map((ex) => (
              <div key={ex.label}>
                <div className="text-[var(--text-xs)] uppercase tracking-[0.15em] text-muted-foreground/60 mb-1">
                  // {ex.label}
                </div>
                <pre className="overflow-x-auto font-mono text-[var(--text-sm)] text-foreground bg-foreground/[0.05] border border-foreground/10 p-4 whitespace-pre">
                  {ex.code}
                </pre>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* A11Y notes */}
      {doc.a11y.length > 0 && (
        <section>
          <div className="text-[var(--text-xs)] uppercase tracking-[0.2em] text-muted-foreground/80 mb-3 border-b border-foreground/15 pb-1">
            A11Y
          </div>
          <ul className="list-none m-0 p-0 font-mono text-[var(--text-xs)] uppercase tracking-tight text-muted-foreground space-y-1">
            {doc.a11y.map((note, i) => (
              <li key={i} className="leading-[1.6]">
                <span aria-hidden="true" className="text-muted-foreground/50">// </span>
                {note}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
