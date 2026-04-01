"use client";

import { useState } from "react";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";

const CATEGORIES = [
  "ALL",
  "SIGNAL",
  "FIELD",
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
      <span className="inline-block h-5 border border-current text-[8px] px-2.5 py-0.5 uppercase">
        PRIMARY
      </span>
      <span className="inline-block h-5 border border-current text-[8px] px-2.5 py-0.5 uppercase">
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
        className="absolute top-[-4px] h-3 w-2"
        style={{ left: "60%", background: "#FF0090" }}
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
      className="inline-block px-2.5 py-0.5 text-[8px] uppercase tracking-wider text-white"
      style={{ background: color }}
    >
      {text}
    </span>
  );
}

function PreviewTable() {
  return (
    <span className="text-[8px] font-mono tracking-wide">
      ID--NAME--STATUS
    </span>
  );
}

function PreviewDots() {
  return (
    <div className="flex gap-1">
      <span
        className="w-2 h-2 border"
        style={{ background: "#FF0090", borderColor: "#FF0090" }}
      />
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
          "repeating-linear-gradient(90deg, transparent 0px, transparent 2px, #00FF00 2px, #00FF00 3px)",
      }}
    />
  );
}

function PreviewGlitch() {
  return (
    <div className="relative">
      <span
        className="text-base uppercase"
        style={{ fontFamily: "var(--font-anton)" }}
      >
        ABC
      </span>
      <span
        className="absolute left-0.5 top-px text-base uppercase"
        style={{
          fontFamily: "var(--font-anton)",
          color: "#FF0090",
          clipPath: "inset(30% 0 30% 0)",
        }}
      >
        ABC
      </span>
    </div>
  );
}

function PreviewParticle() {
  return (
    <span className="text-lg tracking-[4px]" style={{ color: "#00FF00" }}>
      · · · ·
    </span>
  );
}

/* ── Component data ── */

const COMPONENTS: ComponentEntry[] = [
  // Row 1 — Primitives
  {
    index: "001",
    name: "BUTTON",
    category: "PRIMITIVES",
    subcategory: "SIGNAL",
    version: "v2.1.0",
    variant: "default",
    filterTag: "INPUT",
    preview: <PreviewButton />,
  },
  {
    index: "002",
    name: "INPUT",
    category: "PRIMITIVES",
    subcategory: "SIGNAL",
    version: "v2.1.0",
    variant: "black",
    filterTag: "INPUT",
    preview: <PreviewInput />,
  },
  {
    index: "003",
    name: "TOGGLE",
    category: "PRIMITIVES",
    subcategory: "SIGNAL",
    version: "v2.0.0",
    variant: "default",
    filterTag: "INPUT",
    preview: <PreviewToggle />,
  },
  {
    index: "004",
    name: "SLIDER",
    category: "PRIMITIVES",
    subcategory: "SIGNAL",
    version: "v2.0.0",
    variant: "default",
    filterTag: "INPUT",
    preview: <PreviewSlider />,
  },
  // Row 2 — Layout / Nav / Feedback
  {
    index: "005",
    name: "CARD",
    category: "LAYOUT",
    subcategory: "SIGNAL",
    version: "v2.1.0",
    variant: "default",
    filterTag: "LAYOUT",
    preview: <PreviewCard />,
  },
  {
    index: "006",
    name: "MODAL",
    category: "LAYOUT",
    subcategory: "SIGNAL",
    version: "v2.0.0",
    variant: "yellow",
    filterTag: "LAYOUT",
    preview: <PreviewModal />,
  },
  {
    index: "007",
    name: "TABS",
    category: "NAVIGATION",
    subcategory: "SIGNAL",
    version: "v2.1.0",
    variant: "default",
    filterTag: "LAYOUT",
    preview: <PreviewTabs />,
  },
  {
    index: "008",
    name: "BADGE",
    category: "FEEDBACK",
    subcategory: "SIGNAL",
    version: "v2.0.0",
    variant: "black",
    filterTag: "FEEDBACK",
    preview: <PreviewBadge color="#FF0090" text="NEW" />,
  },
  // Row 3 — Data / Feedback / Navigation
  {
    index: "009",
    name: "TABLE",
    category: "DATA",
    subcategory: "SIGNAL",
    version: "v2.1.0",
    variant: "black",
    filterTag: "DATA",
    preview: <PreviewTable />,
  },
  {
    index: "010",
    name: "TOAST",
    category: "FEEDBACK",
    subcategory: "SIGNAL",
    version: "v2.0.0",
    variant: "default",
    filterTag: "FEEDBACK",
    preview: <PreviewBadge color="#00FF00" text="SUCCESS" />,
  },
  {
    index: "011",
    name: "PAGINATION",
    category: "NAVIGATION",
    subcategory: "SIGNAL",
    version: "v2.0.0",
    variant: "default",
    filterTag: "DATA",
    preview: <PreviewDots />,
  },
  {
    index: "012",
    name: "DRAWER",
    category: "LAYOUT",
    subcategory: "SIGNAL",
    version: "v2.0.0",
    variant: "yellow",
    filterTag: "LAYOUT",
    preview: <PreviewDrawer />,
  },
  // Row 4 — FIELD generative components
  {
    index: "101",
    name: "NOISE_BG",
    category: "GENERATIVE",
    subcategory: "FIELD",
    version: "v1.0.0",
    variant: "black",
    filterTag: "FIELD",
    preview: <PreviewNoise />,
  },
  {
    index: "102",
    name: "WAVEFORM",
    category: "GENERATIVE",
    subcategory: "FIELD",
    version: "v1.0.0",
    variant: "black",
    filterTag: "FIELD",
    preview: <PreviewWave />,
  },
  {
    index: "103",
    name: "GLITCH_TXT",
    category: "GENERATIVE",
    subcategory: "FIELD",
    version: "v1.0.0",
    variant: "black",
    filterTag: "FIELD",
    preview: <PreviewGlitch />,
  },
  {
    index: "104",
    name: "PARTICLE",
    category: "GENERATIVE",
    subcategory: "FIELD",
    version: "v1.0.0",
    variant: "black",
    filterTag: "FIELD",
    preview: <PreviewParticle />,
  },
];

/* ── Variant style maps ── */

const variantStyles: Record<
  ComponentEntry["variant"],
  {
    cell: string;
    hoverCell: string;
    titleHover: string;
  }
> = {
  default: {
    cell: "bg-background text-foreground",
    hoverCell:
      "hover:bg-foreground hover:text-background hover:border-primary",
    titleHover: "group-hover:text-primary",
  },
  black: {
    cell: "bg-foreground text-background",
    hoverCell: "hover:bg-primary hover:text-background",
    titleHover: "group-hover:text-background",
  },
  yellow: {
    cell: "text-foreground",
    hoverCell:
      "hover:bg-foreground hover:text-background hover:border-primary",
    titleHover: "group-hover:text-primary",
  },
};

export default function ComponentsPage() {
  const [activeFilter, setActiveFilter] = useState<Category>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = COMPONENTS.filter((comp) => {
    const matchesCategory =
      activeFilter === "ALL" || comp.filterTag === activeFilter;
    const matchesSearch =
      searchQuery === "" ||
      comp.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const resultCount =
    activeFilter === "ALL" && searchQuery === ""
      ? 340
      : filtered.length;

  return (
    <>
      <Nav />
      <main className="mt-[83px]">
        {/* ── Page Header: COMP\nONENTS + 340 stat ── */}
        <header
          className="grid grid-cols-[1fr_auto] items-end border-b-4 border-foreground"
          style={{ marginTop: 0 }}
        >
          <h1
            className="leading-[0.9] uppercase tracking-[-0.02em] px-6 md:px-12 pt-10 pb-6"
            style={{
              fontFamily: "var(--font-anton)",
              fontSize: "clamp(60px, 9vw, 120px)",
            }}
          >
            COMP
            <br />
            ONENTS
          </h1>
          <div className="px-6 md:px-12 pb-6 text-right">
            <strong
              className="block text-primary"
              style={{
                fontFamily: "var(--font-anton)",
                fontSize: "clamp(28px, 4vw, 48px)",
                lineHeight: 1,
              }}
            >
              340
            </strong>
            <span className="text-muted-foreground text-[11px] uppercase tracking-[0.15em] leading-snug block mt-1">
              SIGNAL + FIELD PRIMITIVES
              <br />
              FOR EVERY SURFACE
            </span>
          </div>
        </header>

        {/* ── Filter Bar ── */}
        <div className="flex flex-wrap border-b-[3px] border-foreground text-[11px] uppercase tracking-[0.15em] font-bold">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-3.5 border-r-2 border-foreground transition-colors duration-100 ${
                activeFilter === cat
                  ? "bg-foreground text-primary"
                  : "bg-background text-foreground hover:bg-foreground hover:text-background"
              }`}
              style={{ fontFamily: "inherit" }}
            >
              {cat}
            </button>
          ))}
          <input
            type="text"
            placeholder="SEARCH COMPONENTS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-5 py-3.5 bg-transparent border-none outline-none text-[11px] uppercase tracking-[0.15em] font-bold placeholder:text-muted-foreground"
            style={{ fontFamily: "inherit" }}
          />
          <span className="px-5 py-3.5 text-muted-foreground border-l-2 border-foreground whitespace-nowrap">
            {resultCount} RESULTS
          </span>
        </div>

        {/* ── Component Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {filtered.map((comp) => {
            const styles = variantStyles[comp.variant];
            const isYellow = comp.variant === "yellow";

            return (
              <div
                key={comp.index}
                className={`group relative overflow-hidden p-5 flex flex-col justify-between border-r-2 border-b-2 border-foreground [&:nth-child(4n)]:border-r-0 transition-all duration-100 cursor-pointer ${styles.cell} ${styles.hoverCell}`}
                style={{
                  aspectRatio: "1.2",
                  ...(isYellow
                    ? { backgroundColor: "var(--sf-yellow)" }
                    : {}),
                }}
              >
                {/* Noise overlay for yellow cells */}
                {isYellow && (
                  <div
                    className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-[0.03]"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                      backgroundSize: "150px",
                    }}
                  />
                )}

                {/* Index + subcategory */}
                <div className="text-[9px] text-muted-foreground uppercase tracking-[0.2em]">
                  {comp.index} · {comp.category}
                </div>

                {/* Component name */}
                <div
                  className={`text-[15px] uppercase leading-none transition-colors duration-150 ${styles.titleHover}`}
                  style={{ fontFamily: "var(--font-anton)" }}
                >
                  {comp.name}
                </div>

                {/* Preview area */}
                <div
                  className={`w-full h-12 border flex items-center justify-center text-[10px] transition-colors duration-150 ${
                    comp.variant === "black"
                      ? "border-[#333] group-hover:border-primary"
                      : comp.variant === "yellow"
                        ? "border-foreground"
                        : "border-border/40 group-hover:border-primary"
                  }`}
                  style={{
                    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.06)",
                    marginTop: "8px",
                    marginBottom: "8px",
                  }}
                >
                  {comp.preview}
                </div>

                {/* Meta row */}
                <div className="flex justify-between text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                  <span>{comp.subcategory}</span>
                  <span>{comp.version}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Detail Hint Bar ── */}
        <div
          className="flex justify-between items-center px-6 md:px-12 py-3.5 border-t-[3px] border-foreground text-[11px] font-bold uppercase tracking-[0.15em]"
          style={{ backgroundColor: "var(--sf-yellow)" }}
        >
          <span>
            CLICK ANY COMPONENT TO VIEW PROPS, VARIANTS, AND CODE →
          </span>
          <a
            href="#"
            className="text-primary no-underline hover:underline"
          >
            VIEW ALL 340 COMPONENTS
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
