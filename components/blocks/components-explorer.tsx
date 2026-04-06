"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { SFButton, SFInput, SFBadge } from "@/components/sf";
import { useSessionState, SESSION_KEYS } from "@/hooks/use-session-state";
import { useScrollRestoration } from "@/hooks/use-scroll-restoration";
type FlipModule = Awaited<typeof import("@/lib/gsap-flip")>;

const CATEGORIES = [
  "ALL",
  "FORMS",
  "FEEDBACK",
  "NAVIGATION",
  "DATA_DISPLAY",
  "LAYOUT",
  "GENERATIVE",
] as const;

type Category = (typeof CATEGORIES)[number];

interface ComponentEntry {
  index: string;
  name: string;
  category: string;
  subcategory: string;
  version: string;
  variant: "default" | "black" | "yellow";
  filterTag: Category;
  preview: React.ReactNode;
}

/* ── CSS-only preview components ──
 * Lightweight span/div sketches for the /components explorer grid.
 * component-grid.tsx (homepage) has a separate set using live SF primitives for richer demos.
 * The split is intentional: explorer needs compact thumbnails, homepage needs interactive previews.
 */

function PreviewButton() {
  return (
    <div className="flex gap-1.5">
      <span className="inline-block h-5 border border-current text-[var(--text-xs)] px-2.5 py-0.5 uppercase">
        PRIMARY
      </span>
      <span className="inline-block h-5 border border-current text-[var(--text-xs)] px-2.5 py-0.5 uppercase">
        GHOST
      </span>
    </div>
  );
}

function PreviewInput() {
  return (
    <div className="relative w-[80%] h-5 border border-current">
      <span aria-hidden="true" className="absolute left-1.5 top-px animate-pulse">|</span>
    </div>
  );
}

function PreviewToggle() {
  return (
    <div className="relative w-9 h-[18px] border border-current">
      <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-current" />
    </div>
  );
}

function PreviewSlider() {
  return (
    <div className="relative w-[80%] h-1 bg-current">
      <div
        className="absolute top-[-4px] h-3 w-2 bg-primary"
        style={{ left: "60%" }}
      />
    </div>
  );
}

function PreviewCard() {
  return (
    <div className="relative w-[70%] h-9 border border-current">
      <div className="absolute top-1 left-1 right-1 h-2 bg-current opacity-20" />
    </div>
  );
}

function PreviewModal() {
  return (
    <div className="relative w-[60%] h-9 border-2 border-current">
      <span className="absolute top-0.5 right-1.5 text-xs leading-none">
        x
      </span>
    </div>
  );
}

function PreviewTabs() {
  return (
    <div className="flex w-[80%]">
      <span className="flex-1 h-5 border border-current bg-current text-background text-[7px] flex items-center justify-center uppercase">
        A
      </span>
      <span className="flex-1 h-5 border border-current text-[7px] flex items-center justify-center uppercase">
        B
      </span>
      <span className="flex-1 h-5 border border-current text-[7px] flex items-center justify-center uppercase">
        C
      </span>
    </div>
  );
}

function PreviewBadge({ color, text }: { color: string; text: string }) {
  const needsDarkText = color === "var(--sf-green)" || color === "var(--sf-yellow)";
  return (
    <span
      className={`inline-block px-2.5 py-0.5 text-[var(--text-xs)] uppercase tracking-wider ${needsDarkText ? "text-foreground" : "text-primary-foreground"}`}
      style={{ background: color }}
    >
      {text}
    </span>
  );
}

function PreviewTable() {
  return (
    <span className="text-[var(--text-xs)] font-mono tracking-wide">
      ID--NAME--STATUS
    </span>
  );
}

function PreviewDots() {
  return (
    <div className="flex gap-1">
      <span className="w-2 h-2 border bg-primary border-primary" />
      <span className="w-2 h-2 border border-current" />
      <span className="w-2 h-2 border border-current" />
      <span className="w-2 h-2 border border-current" />
    </div>
  );
}

function PreviewDrawer() {
  return (
    <div className="relative w-[40%] ml-auto h-[44px] border border-current">
      <div className="absolute top-1 left-1 right-1 h-2 bg-current opacity-20" />
    </div>
  );
}

function PreviewNoise() {
  return (
    <div
      className="w-[80%] h-7 opacity-30"
      style={{
        background:
          "repeating-linear-gradient(90deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 3px)",
      }}
    />
  );
}

function PreviewWave() {
  return (
    <div
      className="w-[80%] h-5"
      style={{
        background:
          "repeating-linear-gradient(90deg, transparent 0px, transparent 2px, var(--sf-green) 2px, var(--sf-green) 3px)",
      }}
    />
  );
}

function PreviewGlitch() {
  return (
    <div className="relative">
      <span className="text-base uppercase sf-display">ABC</span>
      <span
        aria-hidden="true"
        className="absolute left-0.5 top-px text-base uppercase sf-display text-[var(--sf-primary-on-dark)]"
        style={{ clipPath: "inset(30% 0 30% 0)" }}
      >
        ABC
      </span>
    </div>
  );
}

function PreviewParticle() {
  return (
    <span className="text-lg tracking-[4px]" style={{ color: "var(--sf-green)" }}>
      · · · ·
    </span>
  );
}

function PreviewAvatar() {
  return (
    <div className="size-8 border-2 border-current flex items-center justify-center text-[10px]">
      U
    </div>
  );
}

function PreviewBreadcrumb() {
  return (
    <span className="text-[var(--text-xs)] font-mono">HOME / DOCS / API</span>
  );
}

function PreviewAlert() {
  return (
    <div className="w-[80%] h-6 border-2 border-primary bg-primary/10 flex items-center px-1.5 text-[7px] uppercase font-mono">
      INFO
    </div>
  );
}

function PreviewAlertDialog() {
  return (
    <div className="relative w-[60%] h-9 border-2 border-current">
      <div className="absolute bottom-1 right-1 flex gap-1">
        <span className="text-[6px] border border-current px-1">CANCEL</span>
        <span className="text-[6px] border border-current px-1 bg-destructive/20">
          CONFIRM
        </span>
      </div>
    </div>
  );
}

function PreviewCollapsible() {
  return (
    <div className="w-[80%]">
      <div className="h-4 border border-current flex items-center px-1 text-[7px] font-mono uppercase">
        TOGGLE
      </div>
      <div className="h-3 border border-current border-t-0 bg-current/5" />
    </div>
  );
}

function PreviewEmptyState() {
  return (
    <span className="text-[var(--text-xs)] font-mono uppercase tracking-widest opacity-60">
      NO DATA
    </span>
  );
}

function PreviewStatusDot() {
  return (
    <div className="flex gap-2 items-center">
      <span className="size-2 bg-success" />
      <span className="size-2 bg-accent" />
      <span className="size-2 bg-muted-foreground" />
    </div>
  );
}

/* ── Component data ── */

const COMPONENTS: ComponentEntry[] = [
  { index: "001", name: "BUTTON", category: "FORMS", subcategory: "FRAME", version: "v2.1.0", variant: "default", filterTag: "FORMS", preview: <PreviewButton /> },
  { index: "002", name: "INPUT", category: "FORMS", subcategory: "FRAME", version: "v2.1.0", variant: "black", filterTag: "FORMS", preview: <PreviewInput /> },
  { index: "003", name: "TOGGLE", category: "FORMS", subcategory: "FRAME", version: "v2.0.0", variant: "default", filterTag: "FORMS", preview: <PreviewToggle /> },
  { index: "004", name: "SLIDER", category: "FORMS", subcategory: "FRAME", version: "v2.0.0", variant: "default", filterTag: "FORMS", preview: <PreviewSlider /> },
  { index: "005", name: "CARD", category: "LAYOUT", subcategory: "FRAME", version: "v2.1.0", variant: "default", filterTag: "LAYOUT", preview: <PreviewCard /> },
  { index: "006", name: "MODAL", category: "LAYOUT", subcategory: "FRAME", version: "v2.0.0", variant: "yellow", filterTag: "LAYOUT", preview: <PreviewModal /> },
  { index: "007", name: "TABS", category: "NAVIGATION", subcategory: "FRAME", version: "v2.1.0", variant: "default", filterTag: "NAVIGATION", preview: <PreviewTabs /> },
  { index: "008", name: "BADGE", category: "FEEDBACK", subcategory: "FRAME", version: "v2.0.0", variant: "black", filterTag: "FEEDBACK", preview: <PreviewBadge color="var(--color-primary)" text="NEW" /> },
  { index: "009", name: "TABLE", category: "DATA_DISPLAY", subcategory: "FRAME", version: "v2.1.0", variant: "black", filterTag: "DATA_DISPLAY", preview: <PreviewTable /> },
  { index: "010", name: "TOAST", category: "FEEDBACK", subcategory: "FRAME", version: "v2.0.0", variant: "default", filterTag: "FEEDBACK", preview: <PreviewBadge color="var(--sf-green)" text="SUCCESS" /> },
  { index: "011", name: "PAGINATION", category: "NAVIGATION", subcategory: "FRAME", version: "v2.0.0", variant: "default", filterTag: "NAVIGATION", preview: <PreviewDots /> },
  { index: "012", name: "DRAWER", category: "LAYOUT", subcategory: "FRAME", version: "v2.0.0", variant: "yellow", filterTag: "LAYOUT", preview: <PreviewDrawer /> },
  { index: "013", name: "AVATAR", category: "NAVIGATION", subcategory: "FRAME", version: "v1.3.0", variant: "default", filterTag: "NAVIGATION", preview: <PreviewAvatar /> },
  { index: "014", name: "BREADCRUMB", category: "NAVIGATION", subcategory: "FRAME", version: "v1.3.0", variant: "default", filterTag: "NAVIGATION", preview: <PreviewBreadcrumb /> },
  { index: "015", name: "ALERT", category: "FEEDBACK", subcategory: "FRAME", version: "v1.3.0", variant: "default", filterTag: "FEEDBACK", preview: <PreviewAlert /> },
  { index: "016", name: "DIALOG_CFM", category: "FEEDBACK", subcategory: "FRAME", version: "v1.3.0", variant: "yellow", filterTag: "FEEDBACK", preview: <PreviewAlertDialog /> },
  { index: "017", name: "COLLAPSE", category: "FEEDBACK", subcategory: "FRAME", version: "v1.3.0", variant: "default", filterTag: "FEEDBACK", preview: <PreviewCollapsible /> },
  { index: "018", name: "EMPTY", category: "FEEDBACK", subcategory: "FRAME", version: "v1.3.0", variant: "black", filterTag: "FEEDBACK", preview: <PreviewEmptyState /> },
  { index: "019", name: "STATUS_DOT", category: "DATA_DISPLAY", subcategory: "FRAME", version: "v1.3.0", variant: "default", filterTag: "DATA_DISPLAY", preview: <PreviewStatusDot /> },
  { index: "101", name: "NOISE_BG", category: "GENERATIVE", subcategory: "SIGNAL", version: "v1.0.0", variant: "black", filterTag: "GENERATIVE", preview: <PreviewNoise /> },
  { index: "102", name: "WAVEFORM", category: "GENERATIVE", subcategory: "SIGNAL", version: "v1.0.0", variant: "black", filterTag: "GENERATIVE", preview: <PreviewWave /> },
  { index: "103", name: "GLITCH_TXT", category: "GENERATIVE", subcategory: "SIGNAL", version: "v1.0.0", variant: "black", filterTag: "GENERATIVE", preview: <PreviewGlitch /> },
  { index: "104", name: "PARTICLE", category: "GENERATIVE", subcategory: "SIGNAL", version: "v1.0.0", variant: "black", filterTag: "GENERATIVE", preview: <PreviewParticle /> },
];

/* ── Variant style maps ── */

const variantStyles: Record<
  ComponentEntry["variant"],
  { cell: string; hoverCell: string; titleHover: string }
> = {
  default: {
    cell: "bg-background text-foreground",
    hoverCell: "hover:bg-foreground hover:text-background hover:border-primary",
    titleHover: "group-hover:text-primary",
  },
  black: {
    cell: "bg-foreground text-background",
    hoverCell: "hover:bg-primary hover:text-background",
    titleHover: "group-hover:text-background",
  },
  yellow: {
    cell: "text-foreground",
    hoverCell: "hover:bg-foreground hover:text-background hover:border-primary",
    titleHover: "group-hover:text-primary",
  },
};

/* ── Sliding filter indicator ── */
function FilterIndicator({
  filterBarRef,
  activeFilter,
}: {
  filterBarRef: React.RefObject<HTMLDivElement | null>;
  activeFilter: Category;
}) {
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = filterBarRef.current;
    const indicator = indicatorRef.current;
    if (!bar || !indicator) return;

    requestAnimationFrame(() => {
      const activeBtn = bar.querySelector<HTMLElement>(
        `button[data-filter="${activeFilter}"]`
      );
      if (!activeBtn) return;

      const barRect = bar.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      indicator.style.width = `${btnRect.width}px`;
      indicator.style.transform = `translateX(${btnRect.left - barRect.left}px)`;
    });
  }, [activeFilter, filterBarRef]);

  return (
    <div
      ref={indicatorRef}
      className="absolute bottom-0 left-0 h-[3px] bg-primary transition-[width,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none"
    />
  );
}

export function ComponentsExplorer() {
  const [activeFilter, setActiveFilter] = useSessionState<Category>(SESSION_KEYS.COMPONENTS_FILTER, "ALL");
  useScrollRestoration();
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);
  const flipStateRef = useRef<ReturnType<typeof import("gsap/Flip").Flip.getState> | null>(null);
  const gsapRef = useRef<FlipModule | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Lazy-load GSAP plugins on mount
  useEffect(() => {
    import("@/lib/gsap-flip").then((mod) => {
      gsapRef.current = mod;
    });
  }, []);

  const captureFlipState = useCallback(() => {
    if (!gridRef.current || !gsapRef.current) return;
    flipStateRef.current = gsapRef.current.Flip.getState(
      gridRef.current.querySelectorAll(".flip-card")
    );
  }, []);

  const handleFilter = useCallback(
    (cat: Category) => {
      captureFlipState();
      setActiveFilter(cat);
    },
    [captureFlipState]
  );

  const handleSearch = useCallback(
    (value: string) => {
      setSearchInput(value);
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        captureFlipState();
        setSearchQuery(value);
      }, 150);
    },
    [captureFlipState]
  );

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  const filtered = useMemo(() => COMPONENTS.filter((comp) => {
    const matchesCategory =
      activeFilter === "ALL" || comp.filterTag === activeFilter;
    const matchesSearch =
      searchQuery === "" ||
      comp.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }), [activeFilter, searchQuery]);

  const resultCount = filtered.length;

  // Reset focus index when filter/search changes
  useEffect(() => {
    setFocusedIndex(0);
  }, [activeFilter, searchQuery]);

  const handleGridKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const count = filtered.length;
      if (count === 0) return;

      // Detect columns from CSS grid computed style
      const cols = gridRef.current
        ? getComputedStyle(gridRef.current).gridTemplateColumns.split(" ").length
        : 2;
      let next = focusedIndex;

      switch (e.key) {
        case "ArrowRight":
          next = Math.min(focusedIndex + 1, count - 1);
          break;
        case "ArrowLeft":
          next = Math.max(focusedIndex - 1, 0);
          break;
        case "ArrowDown":
          next = Math.min(focusedIndex + cols, count - 1);
          break;
        case "ArrowUp":
          next = Math.max(focusedIndex - cols, 0);
          break;
        case "Home":
          next = 0;
          break;
        case "End":
          next = count - 1;
          break;
        default:
          return;
      }

      e.preventDefault();
      setFocusedIndex(next);
      const cells = gridRef.current?.querySelectorAll<HTMLElement>(".flip-card");
      cells?.[next]?.focus();
    },
    [focusedIndex, filtered.length]
  );

  useEffect(() => {
    if (!flipStateRef.current || !gridRef.current || !gsapRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      flipStateRef.current = null;
      return;
    }
    const { gsap, Flip } = gsapRef.current;
    const state = flipStateRef.current;
    flipStateRef.current = null;

    Flip.from(state, {
      targets: gridRef.current.querySelectorAll(".flip-card"),
      duration: 0.5,
      ease: "sf-snap",
      stagger: 0.03,
      absolute: true,
      onEnter: (elements) =>
        gsap.fromTo(
          elements,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.4, ease: "sf-punch" }
        ),
      onLeave: (elements) =>
        gsap.to(elements, {
          opacity: 0,
          scale: 0.8,
          duration: 0.3,
          ease: "power2.in",
        }),
    });
  }, [activeFilter, searchQuery]);

  return (
    <>
      {/* ── Filter Bar ── */}
      <div ref={filterBarRef} className="relative flex flex-wrap border-b-[3px] border-foreground">
        {CATEGORIES.map((cat) => (
          <SFButton
            key={cat}
            intent={activeFilter === cat ? "signal" : "ghost"}
            size="sm"
            onClick={() => handleFilter(cat)}
            aria-pressed={activeFilter === cat}
            data-filter={cat}
            className={`border-0 border-r-2 border-foreground rounded-none px-6 py-3.5 text-[var(--text-sm)] tracking-[0.15em] h-auto ${
              activeFilter === cat ? "text-[var(--sf-primary-on-dark)]" : ""
            }`}
          >
            {cat}
          </SFButton>
        ))}
        <SFInput
          type="text"
          placeholder="SEARCH COMPONENTS..."
          aria-label="Search components"
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1 border-0 rounded-none px-6 py-3.5 h-auto text-[var(--text-sm)] uppercase tracking-[0.15em] font-bold shadow-none focus-visible:ring-0"
        />
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="border-0 border-l-2 border-foreground px-6 py-3.5 text-[var(--text-sm)] tracking-[0.15em] text-muted-foreground font-bold uppercase flex items-center"
        >
          {resultCount} RESULTS
        </div>
        {/* Filter indicator bar */}
        <FilterIndicator filterBarRef={filterBarRef} activeFilter={activeFilter} />
      </div>

      {/* ── Component Grid ── */}
      <div
        ref={gridRef}
        role="listbox"
        aria-label="Component library"
        onKeyDown={handleGridKeyDown}
        className="grid grid-cols-2 lg:grid-cols-4 list-none m-0 p-0"
      >
        {filtered.length === 0 ? (
          <div className="col-span-full flex items-center justify-center py-24 px-6 border-b-2 border-foreground">
            <div className="text-center max-w-md">
              <div
                aria-hidden="true"
                className="sf-display text-[clamp(32px,4vw,48px)] text-muted-foreground mb-4 tracking-[-0.02em]"
              >
                0 MATCHES
              </div>
              <p className="text-[var(--text-sm)] uppercase tracking-[0.15em] text-muted-foreground mb-6">
                NO COMPONENTS MATCH THE CURRENT FILTER.
                <br />
                ADJUST YOUR SEARCH OR RESET FILTERS.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  setSearchQuery("");
                  setActiveFilter("ALL");
                }}
                className="sf-pressable sf-invert-hover inline-block text-[var(--text-xs)] uppercase tracking-[0.2em] font-bold px-6 py-3 border-2 border-foreground text-foreground hover:bg-foreground hover:text-background"
              >
                RESET FILTERS
              </button>
            </div>
          </div>
        ) : filtered.map((comp, i) => {
          const styles = variantStyles[comp.variant];
          const isYellow = comp.variant === "yellow";

          return (
            <div
              role="option"
              aria-selected={i === focusedIndex}
              key={comp.index}
              data-flip-id={comp.index}
              tabIndex={i === focusedIndex ? 0 : -1}
              aria-label={`${comp.name}, ${comp.category}, ${comp.subcategory}, ${comp.version}`}
              className={`flip-card group relative overflow-hidden p-6 flex flex-col justify-between border-r-2 border-b-2 border-foreground [&:nth-child(4n)]:border-r-0 transition-colors duration-100 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-[-2px] ${styles.cell} ${styles.hoverCell}`}
              style={{
                aspectRatio: "1.2",
                ...(isYellow
                  ? { backgroundColor: "var(--sf-yellow)" }
                  : {}),
              }}
            >
              {isYellow && (
                <div
                  className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-[0.03]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundSize: "150px",
                  }}
                />
              )}

              <div className={`text-[var(--text-sm)] uppercase tracking-[0.2em] ${comp.variant === "black" ? "text-[var(--sf-muted-text-dark)]" : "text-muted-foreground"}`}>
                {comp.index} · {comp.category}
              </div>

              <div
                className={`text-[var(--text-md)] uppercase leading-none transition-colors duration-150 sf-display ${styles.titleHover}`}
              >
                {comp.name}
              </div>

              <div
                className={`w-full h-12 border flex items-center justify-center text-[var(--text-xs)] transition-colors duration-150 mt-2 mb-2 ${
                  comp.variant === "black"
                    ? "border-[var(--sf-subtle-border)] group-hover:border-primary"
                    : comp.variant === "yellow"
                      ? "border-foreground"
                      : "border-border/40 group-hover:border-primary"
                }`}
                style={{ boxShadow: "var(--sf-inset-shadow)" }}
              >
                {comp.preview}
              </div>

              <div className={`flex justify-between text-[var(--text-sm)] uppercase tracking-[0.15em] ${comp.variant === "black" ? "text-[var(--sf-muted-text-dark)]" : "text-muted-foreground"}`}>
                <span>{comp.subcategory}</span>
                <span>{comp.version}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Detail Hint Bar ── */}
      <div className="flex justify-between items-center px-6 md:px-12 py-3.5 border-t-[3px] border-foreground sf-yellow-band text-[var(--text-sm)] font-bold uppercase tracking-[0.15em]">
        <span>
          BROWSE COMPONENTS ABOVE · VIEW FULL API REFERENCE →
        </span>
        <a href="/reference" className="text-foreground sf-link-draw underline underline-offset-4">
          API REFERENCE
        </a>
      </div>
    </>
  );
}
