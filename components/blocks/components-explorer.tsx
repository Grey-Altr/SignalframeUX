"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { SFButton, SFInput, SFBadge } from "@/components/sf";
import { useSessionState, SESSION_KEYS } from "@/hooks/use-session-state";
import { useScrollRestoration } from "@/hooks/use-scroll-restoration";
import { COMPONENT_REGISTRY } from "@/lib/component-registry";
import { API_DOCS } from "@/lib/api-docs";
import type * as GsapFlipMod from "@/lib/gsap-flip";
type FlipModule = typeof GsapFlipMod;

// ComponentDetail is loaded lazily — NOT in the shared bundle (DV-12 bundle gate)
const ComponentDetailLazy = dynamic(
  () => import("@/components/blocks/component-detail").then((m) => ({ default: m.ComponentDetail })),
  { ssr: false, loading: () => null }
);

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
  pattern: "A" | "B" | "C";
}

const LAYERS = ["ALL", "FRAME", "SIGNAL"] as const;
type LayerFilter = (typeof LAYERS)[number];

const PATTERNS = ["ALL", "A", "B", "C"] as const;
type PatternFilter = (typeof PATTERNS)[number];

/* ── CSS-only preview components ──
 * Lightweight span/div sketches for the /components explorer grid.
 * component-grid.tsx (homepage) has a separate set using live SF primitives for richer demos.
 * The split is intentional: explorer needs compact thumbnails, homepage needs interactive previews.
 */

function PreviewButton() {
  return (
    <div className="flex gap-[var(--sfx-space-1)].5">
      <span className="inline-block h-5 border border-current text-[var(--text-xs)] px-[var(--sfx-space-2)].5 py-0.5 uppercase">
        PRIMARY
      </span>
      <span className="inline-block h-5 border border-current text-[var(--text-xs)] px-[var(--sfx-space-2)].5 py-0.5 uppercase">
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
        className="absolute top-[-4px] h-3 w-2 bg-foreground"
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
  // Use dark text on light/bright backgrounds (green, yellow, primary/magenta).
  // Magenta primary (#ff00a8) fails WCAG AA with white text (3.6:1) — dark text passes (5.8:1).
  const needsDarkText =
    color === "var(--sf-green)" ||
    color === "var(--sf-yellow)" ||
    color === "var(--color-primary)";
  return (
    <span
      className={`inline-block px-[var(--sfx-space-2)].5 py-0.5 text-[var(--text-xs)] uppercase tracking-wider ${needsDarkText ? "text-foreground" : "text-background"}`}
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
    <div className="flex gap-[var(--sfx-space-1)]">
      <span className="w-2 h-2 border bg-foreground border-foreground" />
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
    <div className="w-[80%] h-6 border-2 border-foreground bg-foreground/10 flex items-center px-[var(--sfx-space-1)].5 text-[7px] uppercase font-mono">
      INFO
    </div>
  );
}

function PreviewAlertDialog() {
  return (
    <div className="relative w-[60%] h-9 border-2 border-current">
      <div className="absolute bottom-1 right-1 flex gap-[var(--sfx-space-1)]">
        <span className="text-[6px] border border-current px-[var(--sfx-space-1)]">CANCEL</span>
        <span className="text-[6px] border border-current px-[var(--sfx-space-1)] bg-destructive/20">
          CONFIRM
        </span>
      </div>
    </div>
  );
}

function PreviewCollapsible() {
  return (
    <div className="w-[80%]">
      <div className="h-4 border border-current flex items-center px-[var(--sfx-space-1)] text-[7px] font-mono uppercase">
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
    <div className="flex gap-[var(--sfx-space-2)] items-center">
      <span className="size-2 bg-success" />
      <span className="size-2 bg-accent" />
      <span className="size-2 bg-muted-foreground" />
    </div>
  );
}

function PreviewAccordion() {
  return (
    <div className="w-[80%]">
      <div className="h-4 border border-current flex items-center justify-between px-[var(--sfx-space-1)] text-[7px] font-mono uppercase">
        <span>SECTION A</span>
        <span className="rotate-180">&#x25B4;</span>
      </div>
      <div className="h-3 border border-current border-t-0 bg-current/5 px-[var(--sfx-space-1)] text-[6px] font-mono opacity-60">
        CONTENT
      </div>
      <div className="h-4 border border-current border-t-0 flex items-center justify-between px-[var(--sfx-space-1)] text-[7px] font-mono uppercase">
        <span>SECTION B</span>
        <span>&#x25BE;</span>
      </div>
    </div>
  );
}

function PreviewProgress() {
  return (
    <div className="w-[80%] h-1 bg-muted">
      <div className="h-full bg-foreground" style={{ width: "60%" }} />
    </div>
  );
}

function PreviewToast() {
  return (
    <div className="border-2 border-foreground bg-background font-mono text-[var(--text-2xs)] uppercase p-[var(--sfx-space-2)] tracking-wider">
      SYSTEM OK
    </div>
  );
}

function PreviewToggleGroup() {
  return (
    <div className="flex gap-0">
      <span className="w-6 h-6 border border-current" />
      <span className="w-6 h-6 border border-current bg-current" />
      <span className="w-6 h-6 border border-current" />
    </div>
  );
}

function PreviewPagination() {
  return (
    <div className="flex items-center gap-[var(--sfx-space-1)]">
      <span className="text-[7px]">&lt;</span>
      <span className="w-5 h-5 border border-current text-[7px] flex items-center justify-center bg-current text-background">1</span>
      <span className="w-5 h-5 border border-current text-[7px] flex items-center justify-center">2</span>
      <span className="w-5 h-5 border border-current text-[7px] flex items-center justify-center">3</span>
      <span className="text-[7px]">&gt;</span>
    </div>
  );
}

function PreviewStepper() {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="w-4 h-4 border border-current bg-current" />
      <div className="w-px h-4 bg-current" />
      <div className="w-4 h-4 border border-current" />
    </div>
  );
}

function PreviewNavMenu() {
  return (
    <div className="flex gap-[var(--sfx-space-2)]">
      <span className="text-[7px] uppercase border-b border-current pb-0.5">NAV</span>
      <span className="text-[7px] uppercase border-b border-current pb-0.5">DOCS</span>
      <span className="text-[7px] uppercase border-b border-current pb-0.5">API</span>
    </div>
  );
}

function PreviewCalendar() {
  return (
    <div className="w-[70%]">
      <div className="grid grid-cols-7 gap-px">
        {Array.from({ length: 7 }, (_, i) => (
          <span key={i} className="w-3 h-3 border border-current text-[5px] flex items-center justify-center">
            {i + 1}
          </span>
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <span key={i + 7} className={`w-3 h-3 border border-current text-[5px] flex items-center justify-center ${i === 3 ? "bg-foreground text-background" : ""}`}>
            {i + 8}
          </span>
        ))}
      </div>
    </div>
  );
}

function PreviewMenubar() {
  return (
    <div className="flex gap-0 border border-current">
      <span className="text-[6px] uppercase px-[var(--sfx-space-1)].5 py-0.5 border-r border-current font-mono">FILE</span>
      <span className="text-[6px] uppercase px-[var(--sfx-space-1)].5 py-0.5 border-r border-current font-mono">EDIT</span>
      <span className="text-[6px] uppercase px-[var(--sfx-space-1)].5 py-0.5 font-mono">VIEW</span>
    </div>
  );
}

function PreviewHoverCard() {
  return (
    <div className="relative">
      <span className="underline text-xs font-mono">HOVER ME</span>
      <div className="absolute -top-10 left-0 border-2 border-current w-24 h-8 bg-background" />
    </div>
  );
}

function PreviewInputOTP() {
  return (
    <div className="flex gap-[var(--sfx-space-1)]">
      {[...Array(4)].map((_, i) => (
        <span key={i} className="w-5 h-6 border-2 border-current flex items-center justify-center text-xs font-mono">
          {i === 0 ? "\u00B7" : ""}
        </span>
      ))}
    </div>
  );
}

function PreviewInputGroup() {
  return (
    <div className="flex border border-current h-6 w-[80%]">
      <span className="px-[var(--sfx-space-1)].5 text-[8px] font-mono border-r border-current flex items-center">@</span>
      <span className="flex-1" />
    </div>
  );
}

/* ── Component data ── */

function PreviewScrambleText() {
  return (
    <span className="font-mono text-[var(--text-xs)] uppercase tracking-widest" style={{ color: "var(--sf-green)" }}>
      S!GN#L &gt;&gt; TX
    </span>
  );
}

function PreviewCircuitDivider() {
  return (
    <div className="w-[80%] h-px relative" style={{ background: "currentColor" }}>
      <span className="absolute left-[30%] -top-1 w-2 h-2 border border-current bg-background" />
      <span className="absolute left-[60%] -top-1 w-2 h-2 border border-current bg-background" />
    </div>
  );
}

const COMPONENTS: ComponentEntry[] = [
  { index: "001", name: "BUTTON",       category: "FORMS",        subcategory: "FRAME",  version: "v2.1.0", variant: "default", filterTag: "FORMS",        pattern: "A", preview: <PreviewButton /> },
  { index: "002", name: "INPUT",        category: "FORMS",        subcategory: "FRAME",  version: "v2.1.0", variant: "black",   filterTag: "FORMS",        pattern: "A", preview: <PreviewInput /> },
  { index: "003", name: "TOGGLE",       category: "FORMS",        subcategory: "FRAME",  version: "v2.0.0", variant: "default", filterTag: "FORMS",        pattern: "A", preview: <PreviewToggle /> },
  { index: "004", name: "SLIDER",       category: "FORMS",        subcategory: "FRAME",  version: "v2.0.0", variant: "default", filterTag: "FORMS",        pattern: "A", preview: <PreviewSlider /> },
  { index: "005", name: "CARD",         category: "LAYOUT",       subcategory: "FRAME",  version: "v2.1.0", variant: "default", filterTag: "LAYOUT",       pattern: "A", preview: <PreviewCard /> },
  { index: "006", name: "MODAL",        category: "LAYOUT",       subcategory: "FRAME",  version: "v2.0.0", variant: "yellow",  filterTag: "LAYOUT",       pattern: "A", preview: <PreviewModal /> },
  { index: "007", name: "TABS",         category: "NAVIGATION",   subcategory: "FRAME",  version: "v2.1.0", variant: "default", filterTag: "NAVIGATION",   pattern: "A", preview: <PreviewTabs /> },
  { index: "008", name: "BADGE",        category: "FEEDBACK",     subcategory: "FRAME",  version: "v2.0.0", variant: "black",   filterTag: "FEEDBACK",     pattern: "A", preview: <PreviewBadge color="var(--color-primary)" text="NEW" /> },
  { index: "009", name: "TABLE",        category: "DATA_DISPLAY", subcategory: "FRAME",  version: "v2.1.0", variant: "black",   filterTag: "DATA_DISPLAY", pattern: "A", preview: <PreviewTable /> },
  { index: "010", name: "TOAST (FRAME)",category: "FEEDBACK",     subcategory: "FRAME",  version: "v2.0.0", variant: "default", filterTag: "FEEDBACK",     pattern: "A", preview: <PreviewBadge color="var(--sf-green)" text="SUCCESS" /> },
  { index: "011", name: "PAGINATION",   category: "NAVIGATION",   subcategory: "FRAME",  version: "v1.3.0", variant: "default", filterTag: "NAVIGATION",   pattern: "A", preview: <PreviewPagination /> },
  { index: "012", name: "DRAWER",       category: "LAYOUT",       subcategory: "FRAME",  version: "v1.4.0", variant: "yellow",  filterTag: "LAYOUT",       pattern: "B", preview: <PreviewDrawer /> },
  { index: "013", name: "AVATAR",       category: "NAVIGATION",   subcategory: "FRAME",  version: "v1.3.0", variant: "default", filterTag: "NAVIGATION",   pattern: "A", preview: <PreviewAvatar /> },
  { index: "014", name: "BREADCRUMB",   category: "NAVIGATION",   subcategory: "FRAME",  version: "v1.3.0", variant: "default", filterTag: "NAVIGATION",   pattern: "A", preview: <PreviewBreadcrumb /> },
  { index: "015", name: "ALERT",        category: "FEEDBACK",     subcategory: "FRAME",  version: "v1.3.0", variant: "default", filterTag: "FEEDBACK",     pattern: "A", preview: <PreviewAlert /> },
  { index: "016", name: "DIALOG_CFM",   category: "FEEDBACK",     subcategory: "FRAME",  version: "v1.3.0", variant: "yellow",  filterTag: "FEEDBACK",     pattern: "A", preview: <PreviewAlertDialog /> },
  { index: "017", name: "COLLAPSE",     category: "FEEDBACK",     subcategory: "FRAME",  version: "v1.3.0", variant: "default", filterTag: "FEEDBACK",     pattern: "A", preview: <PreviewCollapsible /> },
  { index: "018", name: "EMPTY",        category: "FEEDBACK",     subcategory: "FRAME",  version: "v1.3.0", variant: "black",   filterTag: "FEEDBACK",     pattern: "C", preview: <PreviewEmptyState /> },
  { index: "019", name: "STATUS_DOT",   category: "DATA_DISPLAY", subcategory: "FRAME",  version: "v1.3.0", variant: "default", filterTag: "DATA_DISPLAY", pattern: "C", preview: <PreviewStatusDot /> },
  { index: "020", name: "ACCORDION",    category: "FEEDBACK",     subcategory: "SIGNAL", version: "v1.3.0", variant: "default", filterTag: "FEEDBACK",     pattern: "A", preview: <PreviewAccordion /> },
  { index: "021", name: "PROGRESS",     category: "FEEDBACK",     subcategory: "SIGNAL", version: "v1.3.0", variant: "default", filterTag: "FEEDBACK",     pattern: "A", preview: <PreviewProgress /> },
  { index: "022", name: "TOAST (SIGNAL)",category: "FEEDBACK",    subcategory: "SIGNAL", version: "v1.3.0", variant: "default", filterTag: "FEEDBACK",     pattern: "A", preview: <PreviewToast /> },
  { index: "023", name: "TOGGLE_GRP",   category: "FORMS",        subcategory: "FRAME",  version: "v1.3.0", variant: "default", filterTag: "FORMS",        pattern: "A", preview: <PreviewToggleGroup /> },
  { index: "024", name: "STEPPER",      category: "FEEDBACK",     subcategory: "SIGNAL", version: "v1.3.0", variant: "default", filterTag: "FEEDBACK",     pattern: "C", preview: <PreviewStepper /> },
  { index: "025", name: "NAV_MENU",     category: "NAVIGATION",   subcategory: "FRAME",  version: "v1.3.0", variant: "default", filterTag: "NAVIGATION",   pattern: "A", preview: <PreviewNavMenu /> },
  { index: "026", name: "CALENDAR",     category: "FORMS",        subcategory: "FRAME",  version: "v1.3.0", variant: "default", filterTag: "FORMS",        pattern: "B", preview: <PreviewCalendar /> },
  { index: "027", name: "MENUBAR",      category: "NAVIGATION",   subcategory: "FRAME",  version: "v1.3.0", variant: "default", filterTag: "NAVIGATION",   pattern: "B", preview: <PreviewMenubar /> },
  { index: "028", name: "HOVER_CARD",   category: "LAYOUT",       subcategory: "FRAME",  version: "v1.4.0", variant: "default", filterTag: "LAYOUT",       pattern: "A", preview: <PreviewHoverCard /> },
  { index: "029", name: "INPUT_OTP",    category: "FORMS",        subcategory: "FRAME",  version: "v1.4.0", variant: "black",   filterTag: "FORMS",        pattern: "A", preview: <PreviewInputOTP /> },
  { index: "030", name: "INPUT_GROUP",  category: "FORMS",        subcategory: "FRAME",  version: "v1.4.0", variant: "default", filterTag: "FORMS",        pattern: "A", preview: <PreviewInputGroup /> },
  { index: "101", name: "NOISE_BG",     category: "GENERATIVE",   subcategory: "SIGNAL", version: "v1.0.0", variant: "black",   filterTag: "GENERATIVE",   pattern: "C", preview: <PreviewNoise /> },
  { index: "102", name: "WAVEFORM",     category: "GENERATIVE",   subcategory: "SIGNAL", version: "v1.0.0", variant: "black",   filterTag: "GENERATIVE",   pattern: "C", preview: <PreviewWave /> },
  { index: "103", name: "GLITCH_TXT",   category: "GENERATIVE",   subcategory: "SIGNAL", version: "v1.0.0", variant: "black",   filterTag: "GENERATIVE",   pattern: "C", preview: <PreviewGlitch /> },
  { index: "104", name: "PARTICLE",     category: "GENERATIVE",   subcategory: "SIGNAL", version: "v1.0.0", variant: "black",   filterTag: "GENERATIVE",   pattern: "C", preview: <PreviewParticle /> },
  { index: "105", name: "SCRAMBLE_TEXT",category: "GENERATIVE",   subcategory: "SIGNAL", version: "v1.0.0", variant: "black",   filterTag: "GENERATIVE",   pattern: "C", preview: <PreviewScrambleText /> },
  { index: "106", name: "CIRCUIT_DIVIDER",category: "GENERATIVE", subcategory: "SIGNAL", version: "v1.0.0", variant: "black",   filterTag: "GENERATIVE",   pattern: "C", preview: <PreviewCircuitDivider /> },
];

/* ── Variant style maps ── */

const variantStyles: Record<
  ComponentEntry["variant"],
  { cell: string; hoverCell: string; titleHover: string }
> = {
  default: {
    cell: "bg-background text-foreground",
    hoverCell: "hover:bg-foreground hover:text-background hover:border-foreground",
    titleHover: "group-hover:text-foreground",
  },
  black: {
    cell: "bg-foreground text-background",
    hoverCell: "hover:bg-foreground/80 hover:text-background",
    titleHover: "group-hover:text-background",
  },
  yellow: {
    cell: "text-foreground",
    hoverCell: "hover:bg-foreground hover:text-background hover:border-foreground",
    titleHover: "group-hover:text-foreground",
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
      className="absolute bottom-0 left-0 h-[3px] bg-primary transition-[width,transform] duration-[var(--sfx-duration-normal)] ease-[cubic-bezier(0,0,0.2,1)] pointer-events-none"
    />
  );
}

export function ComponentsExplorer({ highlightedCodeMap }: { highlightedCodeMap: Record<string, string> }) {
  const [activeFilter, setActiveFilter] = useSessionState<Category>(SESSION_KEYS.COMPONENTS_FILTER, "ALL");
  const [activeLayer, setActiveLayer] = useSessionState<LayerFilter>(SESSION_KEYS.COMPONENTS_LAYER, "ALL");
  const [activePattern, setActivePattern] = useSessionState<PatternFilter>(SESSION_KEYS.COMPONENTS_PATTERN, "ALL");
  const [openIndex, setOpenIndex] = useSessionState<string | null>(SESSION_KEYS.DETAIL_OPEN, null);
  useScrollRestoration();
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);
  const flipStateRef = useRef<ReturnType<typeof GsapFlipMod.Flip.getState> | null>(null);
  const gsapRef = useRef<FlipModule | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const triggerRefs = useRef<Record<string, HTMLDivElement | null>>({});

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
    [captureFlipState, setActiveFilter]
  );

  const handleLayerFilter = useCallback(
    (layer: LayerFilter) => {
      if (layer === activeLayer) return;
      captureFlipState();
      setActiveLayer(layer);
    },
    [activeLayer, captureFlipState, setActiveLayer]
  );

  const handlePatternFilter = useCallback(
    (pattern: PatternFilter) => {
      if (pattern === activePattern) return;
      captureFlipState();
      setActivePattern(pattern);
    },
    [activePattern, captureFlipState, setActivePattern]
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

  const handleCardClick = useCallback(
    (index: string) => {
      if (openIndex === index) {
        setOpenIndex(null);
      } else {
        setOpenIndex(index);
      }
    },
    [openIndex, setOpenIndex]
  );

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  const filtered = useMemo(
    () =>
      COMPONENTS.filter((comp) => {
        const matchesCategory =
          activeFilter === "ALL" || comp.filterTag === activeFilter;
        const matchesSearch =
          searchQuery === "" ||
          comp.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLayer =
          activeLayer === "ALL" || comp.subcategory === activeLayer;
        const matchesPattern =
          activePattern === "ALL" || comp.pattern === activePattern;
        return matchesCategory && matchesSearch && matchesLayer && matchesPattern;
      }),
    [activeFilter, searchQuery, activeLayer, activePattern]
  );

  const resultCount = filtered.length;

  // Reset focus index when filter/search changes
  useEffect(() => {
    setFocusedIndex(0);
  }, [activeFilter, searchQuery, activeLayer, activePattern]);

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
          ease: "power2.out",
        }),
    });
  }, [activeFilter, searchQuery, activeLayer, activePattern]);

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
            className={`border-0 border-r-2 border-foreground rounded-none px-[var(--sfx-space-6)] py-[var(--sfx-space-3)].5 text-[var(--text-sm)] tracking-[0.15em] h-auto ${
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
          className="flex-1 border-0 rounded-none px-[var(--sfx-space-6)] py-[var(--sfx-space-3)].5 h-auto text-[var(--text-sm)] uppercase tracking-[0.15em] font-bold shadow-none focus-visible:ring-0"
        />
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="border-0 border-l-2 border-foreground px-[var(--sfx-space-6)] py-[var(--sfx-space-3)].5 text-[var(--text-sm)] tracking-[0.15em] text-muted-foreground font-bold uppercase flex items-center"
        >
          {resultCount} RESULTS
        </div>
        {/* Filter indicator bar */}
        <FilterIndicator filterBarRef={filterBarRef} activeFilter={activeFilter} />
      </div>

      {/* ── Layer + Pattern Filter Bar ── */}
      <div className="flex flex-wrap border-b-2 border-foreground/40 bg-background">
        <div className="flex items-center border-r-2 border-foreground/40 px-[var(--sfx-space-6)] py-[var(--sfx-space-2)] text-[var(--text-xs)] uppercase tracking-[0.2em] text-muted-foreground font-bold">
          LAYER
        </div>
        <div className="flex" role="group" aria-label="Filter by layer">
          {LAYERS.map((layer) => (
            <button
              key={layer}
              data-layer-filter={layer}
              onClick={() => handleLayerFilter(layer)}
              className={cn(
                "font-mono text-[var(--text-xs)] px-[var(--sfx-space-4)] py-[var(--sfx-space-2)] border-r border-foreground/20 uppercase tracking-[0.15em]",
                "transition-colors duration-[var(--sfx-duration-instant)]",
                activeLayer === layer
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/10"
              )}
            >
              {layer}
            </button>
          ))}
        </div>
        <div className="flex items-center border-r-2 border-l-2 border-foreground/40 px-[var(--sfx-space-6)] py-[var(--sfx-space-2)] text-[var(--text-xs)] uppercase tracking-[0.2em] text-muted-foreground font-bold">
          TIER
        </div>
        <div className="flex" role="group" aria-label="Filter by pattern">
          {PATTERNS.map((pattern) => (
            <button
              key={pattern}
              onClick={() => handlePatternFilter(pattern)}
              className={cn(
                "font-mono text-[var(--text-xs)] px-[var(--sfx-space-4)] py-[var(--sfx-space-2)] border-r border-foreground/20 uppercase tracking-[0.15em]",
                "transition-colors duration-[var(--sfx-duration-instant)]",
                activePattern === pattern
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/10"
              )}
            >
              {pattern === "ALL" ? "ALL" : `TIER ${pattern}`}
            </button>
          ))}
        </div>
      </div>

      {/* ── Component Grid ── */}
      <div
        ref={gridRef}
        role="listbox"
        aria-label="Component library"
        onKeyDown={handleGridKeyDown}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 list-none m-0 p-0"
      >
        {filtered.length === 0 ? (
          <div className="col-span-full flex items-center justify-center py-24 px-[var(--sfx-space-6)] border-b-2 border-foreground">
            <div className="text-center max-w-md">
              <div
                aria-hidden="true"
                className="sf-display text-[clamp(32px,calc(4*var(--sf-vw)),48px)] text-muted-foreground mb-[var(--sfx-space-4)] tracking-[-0.02em]"
              >
                0 MATCHES
              </div>
              <p className="text-[var(--text-sm)] uppercase tracking-[0.15em] text-muted-foreground mb-[var(--sfx-space-6)]">
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
                className="sf-pressable sf-invert-hover inline-block text-[var(--text-xs)] uppercase tracking-[0.2em] font-bold px-[var(--sfx-space-6)] py-[var(--sfx-space-3)] border-2 border-foreground text-foreground hover:bg-foreground hover:text-background"
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
              data-component-index={comp.index}
              tabIndex={i === focusedIndex ? 0 : -1}
              aria-label={`${comp.name}, ${comp.category}, ${comp.subcategory}, ${comp.version}`}
              ref={(el) => { triggerRefs.current[comp.index] = el; }}
              onClick={() => handleCardClick(comp.index)}
              className={`flip-card group relative overflow-hidden p-[var(--sfx-space-6)] flex flex-col justify-between border-r-2 border-b-2 border-foreground [&:nth-child(4n)]:border-r-0 transition-colors duration-[var(--sfx-duration-fast)] focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-[-2px] cursor-pointer ${styles.cell} ${styles.hoverCell}`}
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
                className={`text-[var(--text-md)] uppercase leading-none transition-colors duration-[var(--sfx-duration-fast)] sf-display ${styles.titleHover}`}
              >
                {comp.name}
              </div>

              <div
                className={`w-full h-12 border flex items-center justify-center text-[var(--text-xs)] transition-colors duration-[var(--sfx-duration-fast)] mt-[var(--sfx-space-2)] mb-[var(--sfx-space-2)] ${
                  comp.variant === "black"
                    ? "border-[var(--sf-subtle-border)] group-hover:border-foreground"
                    : comp.variant === "yellow"
                      ? "border-foreground"
                      : "border-border/40 group-hover:border-foreground"
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

      {/* Detail Panel — DOM sibling OUTSIDE Flip grid (DV-11) */}
      {openIndex && COMPONENT_REGISTRY[openIndex] && (
        <ComponentDetailLazy
          entry={COMPONENT_REGISTRY[openIndex]}
          doc={API_DOCS[COMPONENT_REGISTRY[openIndex].docId]}
          highlightedCode={highlightedCodeMap[openIndex] ?? ""}
          onClose={() => setOpenIndex(null)}
          triggerRef={{ current: triggerRefs.current[openIndex] ?? null }}
        />
      )}

      {/* ── Detail Hint Bar ── */}
      <div className="flex justify-between items-center px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] py-[var(--sfx-space-3)].5 border-t-[3px] border-foreground sf-yellow-band text-[var(--text-sm)] font-bold uppercase tracking-[0.15em]">
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
