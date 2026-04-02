"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { SFButton } from "@/components/sf/sf-button";
import { SFInput } from "@/components/sf/sf-input";
import { SFBadge } from "@/components/sf/sf-badge";
import { gsap, Flip } from "@/lib/gsap-plugins";

const CATEGORIES = [
  "ALL",
  "FRAME",
  "SIGNAL",
  "LAYOUT",
  "INPUT",
  "DATA",
  "FEEDBACK",
  "MOTION",
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

/* ── CSS-only preview components ── */

function PreviewButton() {
  return (
    <div className="flex gap-1.5">
      <span className="inline-block h-5 border border-current text-[10px] px-2.5 py-0.5 uppercase">
        PRIMARY
      </span>
      <span className="inline-block h-5 border border-current text-[10px] px-2.5 py-0.5 uppercase">
        GHOST
      </span>
    </div>
  );
}

function PreviewInput() {
  return (
    <div className="relative w-[80%] h-5 border border-current">
      <span className="absolute left-1.5 top-px animate-pulse">|</span>
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
      <span className="flex-1 h-5 border border-current bg-current text-white text-[7px] flex items-center justify-center uppercase">
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
  return (
    <span
      className="inline-block px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-white"
      style={{ background: color }}
    >
      {text}
    </span>
  );
}

function PreviewTable() {
  return (
    <span className="text-[10px] font-mono tracking-wide">
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
        className="absolute left-0.5 top-px text-base uppercase sf-display text-primary"
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

/* ── Component data ── */

const COMPONENTS: ComponentEntry[] = [
  { index: "001", name: "BUTTON", category: "PRIMITIVES", subcategory: "FRAME", version: "v2.1.0", variant: "default", filterTag: "INPUT", preview: <PreviewButton /> },
  { index: "002", name: "INPUT", category: "PRIMITIVES", subcategory: "FRAME", version: "v2.1.0", variant: "black", filterTag: "INPUT", preview: <PreviewInput /> },
  { index: "003", name: "TOGGLE", category: "PRIMITIVES", subcategory: "FRAME", version: "v2.0.0", variant: "default", filterTag: "INPUT", preview: <PreviewToggle /> },
  { index: "004", name: "SLIDER", category: "PRIMITIVES", subcategory: "FRAME", version: "v2.0.0", variant: "default", filterTag: "INPUT", preview: <PreviewSlider /> },
  { index: "005", name: "CARD", category: "LAYOUT", subcategory: "FRAME", version: "v2.1.0", variant: "default", filterTag: "LAYOUT", preview: <PreviewCard /> },
  { index: "006", name: "MODAL", category: "LAYOUT", subcategory: "FRAME", version: "v2.0.0", variant: "yellow", filterTag: "LAYOUT", preview: <PreviewModal /> },
  { index: "007", name: "TABS", category: "NAVIGATION", subcategory: "FRAME", version: "v2.1.0", variant: "default", filterTag: "LAYOUT", preview: <PreviewTabs /> },
  { index: "008", name: "BADGE", category: "FEEDBACK", subcategory: "FRAME", version: "v2.0.0", variant: "black", filterTag: "FEEDBACK", preview: <PreviewBadge color="var(--color-primary)" text="NEW" /> },
  { index: "009", name: "TABLE", category: "DATA", subcategory: "FRAME", version: "v2.1.0", variant: "black", filterTag: "DATA", preview: <PreviewTable /> },
  { index: "010", name: "TOAST", category: "FEEDBACK", subcategory: "FRAME", version: "v2.0.0", variant: "default", filterTag: "FEEDBACK", preview: <PreviewBadge color="var(--sf-green)" text="SUCCESS" /> },
  { index: "011", name: "PAGINATION", category: "NAVIGATION", subcategory: "FRAME", version: "v2.0.0", variant: "default", filterTag: "DATA", preview: <PreviewDots /> },
  { index: "012", name: "DRAWER", category: "LAYOUT", subcategory: "FRAME", version: "v2.0.0", variant: "yellow", filterTag: "LAYOUT", preview: <PreviewDrawer /> },
  { index: "101", name: "NOISE_BG", category: "GENERATIVE", subcategory: "SIGNAL", version: "v1.0.0", variant: "black", filterTag: "SIGNAL", preview: <PreviewNoise /> },
  { index: "102", name: "WAVEFORM", category: "GENERATIVE", subcategory: "SIGNAL", version: "v1.0.0", variant: "black", filterTag: "SIGNAL", preview: <PreviewWave /> },
  { index: "103", name: "GLITCH_TXT", category: "GENERATIVE", subcategory: "SIGNAL", version: "v1.0.0", variant: "black", filterTag: "SIGNAL", preview: <PreviewGlitch /> },
  { index: "104", name: "PARTICLE", category: "GENERATIVE", subcategory: "SIGNAL", version: "v1.0.0", variant: "black", filterTag: "SIGNAL", preview: <PreviewParticle /> },
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

    const activeBtn = bar.querySelector<HTMLElement>(
      `button[data-filter="${activeFilter}"]`
    );
    if (!activeBtn) return;

    const barRect = bar.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    indicator.style.width = `${btnRect.width}px`;
    indicator.style.transform = `translateX(${btnRect.left - barRect.left}px)`;
  }, [activeFilter, filterBarRef]);

  return (
    <div
      ref={indicatorRef}
      className="absolute bottom-0 left-0 h-[3px] bg-primary transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none"
    />
  );
}

export function ComponentsExplorer() {
  const [activeFilter, setActiveFilter] = useState<Category>("ALL");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);
  const flipStateRef = useRef<Flip.FlipState | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const captureFlipState = useCallback(() => {
    if (!gridRef.current) return;
    flipStateRef.current = Flip.getState(
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

  const filtered = COMPONENTS.filter((comp) => {
    const matchesCategory =
      activeFilter === "ALL" || comp.filterTag === activeFilter;
    const matchesSearch =
      searchQuery === "" ||
      comp.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const resultCount =
    activeFilter === "ALL" && searchQuery === "" ? 340 : filtered.length;

  useEffect(() => {
    if (!flipStateRef.current || !gridRef.current) return;
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
            className={`border-0 border-r-2 border-foreground rounded-none px-5 py-3.5 text-[11px] tracking-[0.15em] h-auto ${
              activeFilter === cat ? "text-primary" : ""
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
          className="flex-1 border-0 rounded-none px-5 py-3.5 h-auto text-[11px] uppercase tracking-[0.15em] font-bold shadow-none focus-visible:ring-0"
        />
        <div className="border-0 border-l-2 border-foreground px-5 py-3.5 text-[11px] tracking-[0.15em] text-muted-foreground font-bold uppercase flex items-center">
          {resultCount} RESULTS
        </div>
        {/* Filter indicator bar */}
        <FilterIndicator filterBarRef={filterBarRef} activeFilter={activeFilter} />
      </div>

      {/* ── Component Grid ── */}
      <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-4">
        {filtered.map((comp) => {
          const styles = variantStyles[comp.variant];
          const isYellow = comp.variant === "yellow";

          return (
            <div
              key={comp.index}
              data-flip-id={comp.index}
              className={`flip-card group relative overflow-hidden p-5 flex flex-col justify-between border-r-2 border-b-2 border-foreground [&:nth-child(4n)]:border-r-0 transition-colors duration-100 ${styles.cell} ${styles.hoverCell}`}
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

              <div className="text-[11px] text-muted-foreground uppercase tracking-[0.2em]">
                {comp.index} · {comp.category}
              </div>

              <div
                className={`text-[15px] uppercase leading-none transition-colors duration-150 sf-display ${styles.titleHover}`}
              >
                {comp.name}
              </div>

              <div
                className={`w-full h-12 border flex items-center justify-center text-[10px] transition-colors duration-150 mt-2 mb-2 ${
                  comp.variant === "black"
                    ? "border-[oklch(0.3_0_0)] group-hover:border-primary"
                    : comp.variant === "yellow"
                      ? "border-foreground"
                      : "border-border/40 group-hover:border-primary"
                }`}
                style={{ boxShadow: "var(--sf-inset-shadow)" }}
              >
                {comp.preview}
              </div>

              <div className="flex justify-between text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                <span>{comp.subcategory}</span>
                <span>{comp.version}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Detail Hint Bar ── */}
      <div className="flex justify-between items-center px-6 md:px-12 py-3.5 border-t-[3px] border-foreground sf-yellow-band text-[11px] font-bold uppercase tracking-[0.15em]">
        <span>
          CLICK ANY COMPONENT TO VIEW PROPS, VARIANTS, AND CODE →
        </span>
        <a href="/reference" className="text-primary sf-link-draw">
          VIEW ALL 340 COMPONENTS
        </a>
      </div>
    </>
  );
}
