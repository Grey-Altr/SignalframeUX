"use client";

import { useState, useRef, useCallback } from "react";
import { SFBadge } from "@/components/sf/sf-badge";
import { SFButton } from "@/components/sf/sf-button";
import {
  SFTabs,
  SFTabsList,
  SFTabsTrigger,
  SFTabsContent,
} from "@/components/sf/sf-tabs";
import {
  SFTable,
  SFTableHeader,
  SFTableHead,
  SFTableBody,
  SFTableRow,
  SFTableCell,
} from "@/components/sf/sf-table";
import { SFScrollArea } from "@/components/sf/sf-scroll-area";
import {
  SFSelect,
  SFSelectTrigger,
  SFSelectContent,
  SFSelectItem,
  SFSelectValue,
} from "@/components/sf/sf-select";
import { SharedCodeBlock as CodeBlock } from "@/components/blocks/shared-code-block";

/* ── Sidebar nav structure ── */
const NAV_SECTIONS = [
  {
    title: "CORE",
    items: [
      { label: "createSignalframeUX", id: "createSignalframeUX" },
      { label: "useSignalframe", id: "useSignalframe" },
      { label: "SFUXProvider", id: "SFUXProvider" },
      { label: "defineTheme", id: "defineTheme" },
    ],
  },
  {
    title: "COMPONENTS",
    items: [
      { label: "Button", id: "button", badge: "340+" },
      { label: "Input", id: "input" },
      { label: "Card", id: "card" },
      { label: "Modal", id: "modal" },
      { label: "Table", id: "table" },
      { label: "Tabs", id: "tabs" },
      { label: "Toast", id: "toast" },
      { label: "Dropdown", id: "dropdown" },
      { label: "Drawer", id: "drawer" },
      { label: "Badge", id: "badge" },
    ],
  },
  {
    title: "SIGNAL LAYER",
    items: [
      { label: "NoiseBG", id: "noisebg" },
      { label: "ParticleMesh", id: "particlemesh" },
      { label: "GlitchText", id: "glitchtext" },
      { label: "Waveform", id: "waveform" },
      { label: "ReactiveCanvas", id: "reactivecanvas" },
    ],
  },
  {
    title: "TOKENS",
    items: [
      { label: "colors", id: "colors" },
      { label: "spacing", id: "spacing" },
      { label: "typography", id: "typography" },
      { label: "motion", id: "motion" },
      { label: "elevation", id: "elevation" },
    ],
  },
  {
    title: "HOOKS",
    items: [
      { label: "useSignalEffect", id: "useSignalEffect" },
      { label: "useToken", id: "useToken" },
      { label: "useMotion", id: "useMotion" },
      { label: "useBreakpoint", id: "useBreakpoint" },
    ],
  },
];

/* ── Props table data ── */
const BUTTON_PROPS = [
  { name: "variant", type: "'frame' | 'ghost' | 'signal' | 'danger'", default: "'frame'", desc: "VISUAL VARIANT" },
  { name: "size", type: "'sm' | 'md' | 'lg'", default: "'md'", desc: "BUTTON SIZE" },
  { name: "signalEffect", type: "'shimmer' | 'pulse' | 'glitch' | 'none'", default: "'none'", desc: "SIGNAL LAYER EFFECT" },
  { name: "signalIntensity", type: "number (0-1)", default: "0.5", desc: "EFFECT STRENGTH" },
  { name: "disabled", type: "boolean", default: "false", desc: "DISABLE INTERACTION" },
  { name: "onClick", type: "() => void", default: "\u2014", desc: "CLICK HANDLER", required: true },
];

/* ── Lookup helpers for sidebar → content mapping ── */
function findNavItem(id: string) {
  for (const section of NAV_SECTIONS) {
    const item = section.items.find((i) => i.id === id);
    if (item) return { section: section.title, label: item.label };
  }
  return { section: "UNKNOWN", label: id.toUpperCase() };
}

// Flat list of all nav item IDs for keyboard navigation
const ALL_NAV_IDS = NAV_SECTIONS.flatMap((s) => s.items.map((i) => i.id));

export function APIExplorer() {
  const [activeNav, setActiveNav] = useState("button");
  const contentRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  function handleNavClick(id: string) {
    setActiveNav(id);
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  const handleSidebarKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const idx = ALL_NAV_IDS.indexOf(activeNav);
      let nextIdx = idx;

      switch (e.key) {
        case "ArrowDown":
          nextIdx = Math.min(idx + 1, ALL_NAV_IDS.length - 1);
          break;
        case "ArrowUp":
          nextIdx = Math.max(idx - 1, 0);
          break;
        case "Home":
          nextIdx = 0;
          break;
        case "End":
          nextIdx = ALL_NAV_IDS.length - 1;
          break;
        default:
          return;
      }

      e.preventDefault();
      const nextId = ALL_NAV_IDS[nextIdx];
      handleNavClick(nextId);
      // Focus the newly active button
      const btn = sidebarRef.current?.querySelector<HTMLButtonElement>(
        `button[aria-selected="true"]`
      );
      // Need to wait for re-render
      requestAnimationFrame(() => {
        sidebarRef.current
          ?.querySelector<HTMLButtonElement>(`button[aria-selected="true"]`)
          ?.focus();
      });
    },
    [activeNav]
  );

  const activeItem = findNavItem(activeNav);

  return (
    <div className="mt-[var(--nav-height)]">
      {/* Page Header */}
      <header className="grid grid-cols-[1fr_auto] items-end border-b-4 border-foreground">
        <h1
          className="sf-display px-6 md:px-12 pt-10 pb-6"
          style={{ fontSize: "clamp(60px, 9vw, 100px)" }}
        >
          API
          <br />
          <span className="text-primary">REFERENCE</span>
        </h1>
        <div className="px-6 md:px-12 pb-6 text-right text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
          PROPS · HOOKS · TOKENS · SURFACE
        </div>
      </header>

      {/* MOBILE NAV — Select dropdown (visible below md) */}
      <div className="md:hidden border-b-[3px] border-foreground bg-foreground p-4">
        <SFSelect value={activeNav} onValueChange={handleNavClick}>
          <SFSelectTrigger className="w-full bg-[var(--sf-dark-surface)] text-background border-[var(--sf-subtle-border)] text-[11px] uppercase tracking-[0.1em]">
            <SFSelectValue />
          </SFSelectTrigger>
          <SFSelectContent className="max-h-[50vh]">
            {NAV_SECTIONS.map((section) => (
              section.items.map((item) => (
                <SFSelectItem key={item.id} value={item.id} className="text-[11px] uppercase tracking-[0.08em]">
                  {section.title} / {item.label}
                </SFSelectItem>
              ))
            ))}
          </SFSelectContent>
        </SFSelect>
      </div>

      <div className="min-h-[calc(100vh-var(--nav-height))] grid grid-cols-1 md:grid-cols-[240px_1fr_380px]">
      {/* LEFT PANEL — API Navigation */}
      <nav
        ref={sidebarRef}
        aria-label="API sections"
        onKeyDown={handleSidebarKeyDown}
        className="sticky top-[var(--nav-height)] h-[calc(100vh-var(--nav-height))] bg-foreground text-background hidden md:block"
      >
        <SFScrollArea className="h-full">
          <div className="border-b border-[var(--sf-subtle-border)] p-5 sf-display text-2xl">
            API&trade;
          </div>
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="border-b border-[var(--sf-dark-surface)] py-3">
              <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground px-4 pb-2">
                {section.title}
              </div>
              {section.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  aria-selected={activeNav === item.id}
                  className={`block w-full text-left no-underline uppercase transition-colors text-[11px] tracking-[0.08em] py-1.5 px-4 ${
                    activeNav === item.id
                      ? "text-primary bg-[var(--sf-dark-surface)] border-l-[3px] border-l-primary"
                      : "text-[var(--sf-muted-text-dark)] hover:text-background hover:bg-[var(--sf-dark-surface)]"
                  }`}
                >
                  {item.label}
                  {"badge" in item && item.badge && (
                    <SFBadge intent="primary" className="ml-1.5 text-[10px] py-0 px-1.5 h-auto">
                      {item.badge}
                    </SFBadge>
                  )}
                </button>
              ))}
            </div>
          ))}
        </SFScrollArea>
      </nav>

      {/* CENTER PANEL — Documentation */}
      <div ref={contentRef} className="overflow-y-auto border-r-[3px] border-foreground py-10 px-6 md:px-12 h-auto md:h-[calc(100vh-var(--nav-height))]">
        <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-6">
          <span className="text-primary">API</span> /{" "}
          <span className="text-primary">{activeItem.section}</span> / {activeItem.label.toUpperCase()}
        </div>

        {activeNav !== "button" ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <h1 className="text-foreground sf-display text-[72px] leading-[0.95] mb-2">{activeItem.label.toUpperCase()}</h1>
            <SFBadge intent="outline" className="text-sm py-2 px-6 opacity-60">
              DOCUMENTATION IN PROGRESS
            </SFBadge>
            <p className="text-[12px] text-muted-foreground uppercase tracking-[0.1em] max-w-[400px] text-center mt-2">
              SELECT <button type="button" onClick={() => handleNavClick("button")} className="text-primary underline">BUTTON</button> IN THE SIDEBAR FOR A FULL API REFERENCE EXAMPLE.
            </p>
          </div>
        ) : (
          <>
        <h1 className="text-foreground sf-display text-[72px] leading-[0.95] mb-2">BUTTON</h1>
        <SFBadge intent="signal" className="mb-6 text-[11px] tracking-[0.1em]">
          FRAME LAYER · v2.1.0 · STABLE
        </SFBadge>

        <p className="text-sm leading-[1.8] text-muted-foreground max-w-[580px] mb-8">
          THE PRIMARY INTERACTIVE ELEMENT. SUPPORTS SIGNAL (DETERMINISTIC)
          AND SIGNAL (GENERATIVE) VARIANTS. PROGRESSIVE ENHANCEMENT — SIGNAL
          EFFECTS LAYER ON TOP WITHOUT BREAKING ACCESSIBILITY.
        </p>

        <h2 className="sf-display text-[32px] mt-12 mb-4 pt-6 border-t-2 border-foreground">IMPORT</h2>
        <CodeBlock label="TSX" className="my-4">
          <span className="text-primary">import</span>
          {" { "}<span className="text-[var(--sf-code-text)]">Button</span>{" } "}
          <span className="text-primary">from</span>{" "}
          <span className="text-[var(--sf-yellow)]">{"'@sfux/components'"}</span>
          {"\n\n"}
          <span className="text-[var(--sf-dim-text)]">{"// OR DIRECT IMPORT"}</span>
          {"\n"}
          <span className="text-primary">import</span>
          {" { "}<span className="text-[var(--sf-code-text)]">Button</span>{" } "}
          <span className="text-primary">from</span>{" "}
          <span className="text-[var(--sf-yellow)]">{"'@sfux/components/Button'"}</span>
        </CodeBlock>

        <h2 className="sf-display text-[32px] mt-12 mb-4 pt-6 border-t-2 border-foreground">PROPS</h2>
        <SFTable className="mb-6">
          <SFTableHeader>
            <SFTableRow>
              <SFTableHead>PROP</SFTableHead>
              <SFTableHead>TYPE</SFTableHead>
              <SFTableHead>DEFAULT</SFTableHead>
              <SFTableHead>DESC</SFTableHead>
            </SFTableRow>
          </SFTableHeader>
          <SFTableBody>
            {BUTTON_PROPS.map((prop) => (
              <SFTableRow key={prop.name}>
                <SFTableCell className="text-primary font-bold">{prop.name}</SFTableCell>
                <SFTableCell>
                  <code className="text-[10px] bg-muted px-1.5 py-0.5">{prop.type}</code>
                </SFTableCell>
                <SFTableCell className="text-muted-foreground">{prop.default}</SFTableCell>
                <SFTableCell>
                  {prop.desc}
                  {prop.required && (
                    <SFBadge intent="primary" className="ml-1.5 text-[10px] py-0 px-1 h-auto">REQ</SFBadge>
                  )}
                </SFTableCell>
              </SFTableRow>
            ))}
          </SFTableBody>
        </SFTable>

        <h2 className="sf-display text-[32px] mt-12 mb-4 pt-6 border-t-2 border-foreground">USAGE</h2>
        <SFTabs defaultValue="frame">
          <SFTabsList className="border-b-0 mb-0">
            <SFTabsTrigger value="frame">FRAME (DEFAULT)</SFTabsTrigger>
            <SFTabsTrigger value="signal">SIGNAL VARIANT (GENERATIVE)</SFTabsTrigger>
          </SFTabsList>
          <SFTabsContent value="frame" className="mt-0">
            <CodeBlock label="TSX" className="my-4">
              <span className="text-[var(--sf-code-text)]">&lt;Button</span>{" "}
              <span className="text-[var(--sf-code-keyword)]">variant</span>=
              <span className="text-[var(--sf-yellow)]">{'"frame"'}</span>
              <span className="text-[var(--sf-code-text)]">&gt;</span>
              {"\n  GET STARTED\n"}
              <span className="text-[var(--sf-code-text)]">&lt;/Button&gt;</span>
            </CodeBlock>
          </SFTabsContent>
          <SFTabsContent value="signal" className="mt-0">
            <CodeBlock label="TSX" className="my-4">
              <span className="text-[var(--sf-code-text)]">&lt;Button</span>
              {"\n  "}<span className="text-[var(--sf-code-keyword)]">variant</span>=
              <span className="text-[var(--sf-yellow)]">{'"signal"'}</span>
              {"\n  "}<span className="text-[var(--sf-code-keyword)]">signalEffect</span>=
              <span className="text-[var(--sf-yellow)]">{'"shimmer"'}</span>
              {"\n  "}<span className="text-[var(--sf-code-keyword)]">signalIntensity</span>
              {"={"}<span className="text-[var(--sf-code-keyword)]">0.8</span>{"}"}
              {"\n"}<span className="text-[var(--sf-code-text)]">&gt;</span>
              {"\n  LAUNCH SEQUENCE\n"}
              <span className="text-[var(--sf-code-text)]">&lt;/Button&gt;</span>
            </CodeBlock>
          </SFTabsContent>
        </SFTabs>

        <h2 className="sf-display text-[32px] mt-12 mb-4 pt-6 border-t-2 border-foreground">ACCESSIBILITY</h2>
        <CodeBlock label="INFO" className="my-4">
          <span className="text-muted-foreground">
            WCAG 2.1 AA COMPLIANT{"\n"}
            {"• "}FOCUS RING: 3PX SOLID, OFFSET 2PX{"\n"}
            {"• "}CONTRAST: 7:1 MIN (FRAME), 4.5:1 (SIGNAL){"\n"}
            {"• "}FRAME EFFECTS: RESPECTS PREFERS-REDUCED-MOTION{"\n"}
            {"• "}ARIA: ROLE=&quot;BUTTON&quot; AUTOMATIC
          </span>
        </CodeBlock>
          </>
        )}
      </div>

      {/* RIGHT PANEL — Live Preview */}
      <aside className="sticky top-[var(--nav-height)] h-[calc(100vh-var(--nav-height))] bg-[var(--sf-darkest-surface)] text-[oklch(0.985_0_0)] hidden md:block">
        <SFScrollArea className="h-full">
          <div className="flex items-center justify-between border-b border-[var(--sf-subtle-border)] p-4">
            <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              LIVE PREVIEW&trade;
            </span>
            <div className="flex gap-2">
              {["LIGHT", "DARK", "FRAME"].map((label, i) => (
                <SFButton
                  key={label}
                  intent={i === 0 ? "primary" : "ghost"}
                  size="sm"
                  className={`text-[11px] h-6 px-2.5 ${
                    i !== 0 ? "border-[var(--sf-subtle-border)] text-muted-foreground" : ""
                  }`}
                >
                  {label}
                </SFButton>
              ))}
            </div>
          </div>

          <div className="relative flex flex-col items-center justify-center gap-6 p-10 min-h-[300px]">
            <div className="absolute top-5 left-5 text-[10px] uppercase tracking-[0.2em] text-[var(--sf-code-text)] opacity-40">
              <div>SF//UX::BUTTON::RENDER</div>
              <div>VARIANT: FRAME | GHOST | SIGNAL</div>
              <div>SIGNAL: SHIMMER @ 0.8</div>
              <div>FPS: 60 | MEM: 2.4MB</div>
            </div>

            <div className="text-center mt-[60px]">
              <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">VARIANT: FRAME</div>
              <SFButton intent="ghost" size="lg" className="bg-background text-foreground border-background hover:bg-background/80 hover:text-foreground">GET STARTED</SFButton>
            </div>
            <div className="text-center">
              <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">VARIANT: GHOST</div>
              <SFButton intent="ghost" size="lg" className="text-foreground border-foreground hover:bg-foreground hover:text-background">VIEW DOCS</SFButton>
            </div>
            <div className="text-center">
              <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">VARIANT: SIGNAL (SHIMMER)</div>
              <SFButton intent="primary" size="lg" className="relative overflow-hidden">LAUNCH SEQUENCE</SFButton>
            </div>
            <div className="text-center">
              <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">VARIANT: YELLOW (TDR)</div>
              <SFButton intent="ghost" size="lg" className="bg-[var(--sf-yellow)] text-foreground border-[var(--sf-yellow)] hover:bg-foreground hover:text-background hover:border-foreground">
                BUY ME&trade;
              </SFButton>
            </div>
          </div>

          <div className="w-full p-5 bg-[var(--sf-code-bg)] font-mono text-[11px] text-[var(--sf-code-text)] leading-[1.6] border-t border-[var(--sf-subtle-border)]">
            <span className="text-muted-foreground">{"// CURRENTLY RENDERED"}</span>
            {"\n"}&lt;<span className="text-primary">Button</span>
            {"\n  "}<span className="text-[var(--sf-code-keyword)]">variant</span>=
            <span className="text-[var(--sf-yellow)]">{'"signal"'}</span>
            {"\n  "}<span className="text-[var(--sf-code-keyword)]">size</span>=
            <span className="text-[var(--sf-yellow)]">{'"md"'}</span>
            {"\n/>\n"}
          </div>
        </SFScrollArea>
      </aside>
      </div>
    </div>
  );
}
