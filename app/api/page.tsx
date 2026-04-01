"use client";

import { useState } from "react";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
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
    title: "FRAME LAYER",
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
      { label: "useFrameEffect", id: "useFrameEffect" },
      { label: "useToken", id: "useToken" },
      { label: "useMotion", id: "useMotion" },
      { label: "useBreakpoint", id: "useBreakpoint" },
    ],
  },
];

/* ── Props table data ── */
const BUTTON_PROPS = [
  {
    name: "variant",
    type: "'signal' | 'ghost' | 'frame' | 'danger'",
    default: "'signal'",
    desc: "VISUAL VARIANT",
  },
  {
    name: "size",
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    desc: "BUTTON SIZE",
  },
  {
    name: "frameEffect",
    type: "'shimmer' | 'pulse' | 'glitch' | 'none'",
    default: "'none'",
    desc: "FRAME LAYER EFFECT",
  },
  {
    name: "frameIntensity",
    type: "number (0-1)",
    default: "0.5",
    desc: "EFFECT STRENGTH",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    desc: "DISABLE INTERACTION",
  },
  {
    name: "onClick",
    type: "() => void",
    default: "\u2014",
    desc: "CLICK HANDLER",
    required: true,
  },
];

/* ── Code block renderer ── */
function CodeBlock({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="relative overflow-x-auto font-mono bg-[oklch(0.12_0_0)] text-[oklch(0.6_0.28_145)] p-5 pr-6 text-[12px] leading-[1.7] my-4 shadow-[inset_0_2px_4px_oklch(0_0_0/0.2)]">
      {label && (
        <span className="absolute top-1.5 right-2.5 text-[8px] text-muted-foreground uppercase tracking-[0.2em]">
          {label}
        </span>
      )}
      {children}
    </div>
  );
}

export default function APIPage() {
  const [activeNav, setActiveNav] = useState("button");

  return (
    <>
      <Nav />
      <main>
        {/* 3-panel grid layout */}
        <div className="mt-[83px] min-h-[calc(100vh-83px)] grid grid-cols-1 md:grid-cols-[240px_1fr_380px]">
          {/* ═══════════════════════════════════════════
              LEFT PANEL — API Navigation
              ═══════════════════════════════════════════ */}
          <aside className="sticky top-[83px] h-[calc(100vh-83px)] bg-foreground text-background hidden md:block">
            <SFScrollArea className="h-full">
              {/* Header */}
              <div className="border-b border-[oklch(0.3_0_0)] p-5 sf-display text-2xl">
                API&trade;
              </div>

              {/* Nav sections */}
              {NAV_SECTIONS.map((section) => (
                <div
                  key={section.title}
                  className="border-b border-[oklch(0.2_0_0)] py-3"
                >
                  <div className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground px-4 pb-2">
                    {section.title}
                  </div>
                  {section.items.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={() => setActiveNav(item.id)}
                      className={`block no-underline uppercase transition-colors text-[11px] tracking-[0.08em] py-1.5 px-4 ${
                        activeNav === item.id
                          ? "text-primary bg-[oklch(0.18_0_0)] border-l-[3px] border-l-primary"
                          : "text-[oklch(0.65_0_0)] hover:text-background hover:bg-[oklch(0.18_0_0)]"
                      }`}
                    >
                      {item.label}
                      {"badge" in item && item.badge && (
                        <SFBadge
                          intent="primary"
                          className="ml-1.5 text-[8px] py-0 px-1.5 h-auto"
                        >
                          {item.badge}
                        </SFBadge>
                      )}
                    </a>
                  ))}
                </div>
              ))}
            </SFScrollArea>
          </aside>

          {/* ═══════════════════════════════════════════
              CENTER PANEL — Documentation
              ═══════════════════════════════════════════ */}
          <div className="overflow-y-auto border-r-[3px] border-foreground py-10 px-6 md:px-12 h-auto md:h-[calc(100vh-83px)]">
            {/* Breadcrumb */}
            <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-6">
              <span className="text-primary">API</span> /{" "}
              <span className="text-primary">COMPONENTS</span> / BUTTON
            </div>

            {/* Title */}
            <h1 className="text-foreground sf-display text-[72px] leading-[0.95] mb-2">
              BUTTON
            </h1>

            {/* Version badge */}
            <SFBadge intent="signal" className="mb-6 text-[9px] tracking-[0.1em]">
              SIGNAL LAYER · v2.1.0 · STABLE
            </SFBadge>

            {/* Description */}
            <p className="text-sm leading-[1.8] text-muted-foreground max-w-[580px] mb-8">
              THE PRIMARY INTERACTIVE ELEMENT. SUPPORTS SIGNAL (DETERMINISTIC)
              AND FRAME (GENERATIVE) VARIANTS. PROGRESSIVE ENHANCEMENT — FRAME
              EFFECTS LAYER ON TOP WITHOUT BREAKING ACCESSIBILITY.
            </p>

            {/* ── IMPORT ── */}
            <h2 className="sf-display text-[32px] mt-12 mb-4 pt-6 border-t-2 border-foreground">
              IMPORT
            </h2>
            <CodeBlock label="TSX">
              <span className="text-primary">import</span>
              {" { "}
              <span className="text-[oklch(0.6_0.28_145)]">Button</span>
              {" } "}
              <span className="text-primary">from</span>{" "}
              <span className="text-[var(--sf-yellow)]">
                {"'@sfux/components'"}
              </span>
              {"\n\n"}
              <span className="text-[oklch(0.4_0_0)]">{"// OR DIRECT IMPORT"}</span>
              {"\n"}
              <span className="text-primary">import</span>
              {" { "}
              <span className="text-[oklch(0.6_0.28_145)]">Button</span>
              {" } "}
              <span className="text-primary">from</span>{" "}
              <span className="text-[var(--sf-yellow)]">
                {"'@sfux/components/Button'"}
              </span>
            </CodeBlock>

            {/* ── PROPS ── */}
            <h2 className="sf-display text-[32px] mt-12 mb-4 pt-6 border-t-2 border-foreground">
              PROPS
            </h2>
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
                    <SFTableCell className="text-primary font-bold">
                      {prop.name}
                    </SFTableCell>
                    <SFTableCell>
                      <code className="text-[10px] bg-muted px-1.5 py-0.5">
                        {prop.type}
                      </code>
                    </SFTableCell>
                    <SFTableCell className="text-muted-foreground">
                      {prop.default}
                    </SFTableCell>
                    <SFTableCell>
                      {prop.desc}
                      {prop.required && (
                        <SFBadge
                          intent="primary"
                          className="ml-1.5 text-[8px] py-0 px-1 h-auto"
                        >
                          REQ
                        </SFBadge>
                      )}
                    </SFTableCell>
                  </SFTableRow>
                ))}
              </SFTableBody>
            </SFTable>

            {/* ── USAGE ── */}
            <h2 className="sf-display text-[32px] mt-12 mb-4 pt-6 border-t-2 border-foreground">
              USAGE
            </h2>

            <SFTabs defaultValue="signal">
              <SFTabsList className="border-b-0 mb-0">
                <SFTabsTrigger value="signal">SIGNAL (DEFAULT)</SFTabsTrigger>
                <SFTabsTrigger value="frame">FRAME VARIANT (GENERATIVE)</SFTabsTrigger>
              </SFTabsList>
              <SFTabsContent value="signal" className="mt-0">
                <CodeBlock label="TSX">
                  <span className="text-[oklch(0.6_0.28_145)]">&lt;Button</span>{" "}
                  <span className="text-[oklch(0.7_0.15_25)]">variant</span>=
                  <span className="text-[var(--sf-yellow)]">{'"signal"'}</span>
                  <span className="text-[oklch(0.6_0.28_145)]">&gt;</span>
                  {"\n  GET STARTED\n"}
                  <span className="text-[oklch(0.6_0.28_145)]">&lt;/Button&gt;</span>
                </CodeBlock>
              </SFTabsContent>
              <SFTabsContent value="frame" className="mt-0">
                <CodeBlock label="TSX">
                  <span className="text-[oklch(0.6_0.28_145)]">&lt;Button</span>
                  {"\n  "}
                  <span className="text-[oklch(0.7_0.15_25)]">variant</span>=
                  <span className="text-[var(--sf-yellow)]">{'"frame"'}</span>
                  {"\n  "}
                  <span className="text-[oklch(0.7_0.15_25)]">frameEffect</span>=
                  <span className="text-[var(--sf-yellow)]">{'"shimmer"'}</span>
                  {"\n  "}
                  <span className="text-[oklch(0.7_0.15_25)]">frameIntensity</span>
                  {"={"}
                  <span className="text-[oklch(0.7_0.15_25)]">0.8</span>
                  {"}"}
                  {"\n"}
                  <span className="text-[oklch(0.6_0.28_145)]">&gt;</span>
                  {"\n  LAUNCH SEQUENCE\n"}
                  <span className="text-[oklch(0.6_0.28_145)]">&lt;/Button&gt;</span>
                </CodeBlock>
              </SFTabsContent>
            </SFTabs>

            {/* ── ACCESSIBILITY ── */}
            <h2 className="sf-display text-[32px] mt-12 mb-4 pt-6 border-t-2 border-foreground">
              ACCESSIBILITY
            </h2>
            <CodeBlock label="INFO">
              <span className="text-muted-foreground">
                WCAG 2.1 AA COMPLIANT{"\n"}
                {"• "}FOCUS RING: 3PX SOLID, OFFSET 2PX{"\n"}
                {"• "}CONTRAST: 7:1 MIN (SIGNAL), 4.5:1 (FRAME){"\n"}
                {"• "}FRAME EFFECTS: RESPECTS PREFERS-REDUCED-MOTION{"\n"}
                {"• "}ARIA: ROLE=&quot;BUTTON&quot; AUTOMATIC
              </span>
            </CodeBlock>
          </div>

          {/* ═══════════════════════════════════════════
              RIGHT PANEL — Live Preview
              ═══════════════════════════════════════════ */}
          <aside className="sticky top-[83px] h-[calc(100vh-83px)] bg-[oklch(0.08_0_0)] text-[oklch(0.985_0_0)] hidden md:block">
            <SFScrollArea className="h-full">
              {/* Preview header */}
              <div className="flex items-center justify-between border-b border-[oklch(0.25_0_0)] p-4">
                <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                  LIVE PREVIEW&trade;
                </span>
                <div className="flex gap-2">
                  {["LIGHT", "DARK", "FRAME"].map((label, i) => (
                    <SFButton
                      key={label}
                      intent={i === 0 ? "primary" : "ghost"}
                      size="sm"
                      className={`text-[9px] h-6 px-2.5 ${
                        i !== 0
                          ? "border-[oklch(0.35_0_0)] text-muted-foreground"
                          : ""
                      }`}
                    >
                      {label}
                    </SFButton>
                  ))}
                </div>
              </div>

              {/* Preview stage */}
              <div className="relative flex flex-col items-center justify-center gap-6 p-10 min-h-[300px]">
                {/* HUD overlay */}
                <div className="absolute top-5 left-5 text-[8px] uppercase tracking-[0.2em] text-[oklch(0.6_0.28_145)] opacity-40">
                  <div>SF//UX::BUTTON::RENDER</div>
                  <div>VARIANT: SIGNAL | GHOST | FRAME</div>
                  <div>FRAME: SHIMMER @ 0.8</div>
                  <div>FPS: 60 | MEM: 2.4MB</div>
                </div>

                {/* Rendered buttons */}
                <div className="text-center mt-[60px]">
                  <div className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    VARIANT: SIGNAL
                  </div>
                  <SFButton intent="ghost" size="lg" className="bg-white text-black border-white hover:bg-white/80 hover:text-black">
                    GET STARTED
                  </SFButton>
                </div>

                <div className="text-center">
                  <div className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    VARIANT: GHOST
                  </div>
                  <SFButton intent="ghost" size="lg" className="text-white border-white hover:bg-white hover:text-black">
                    VIEW DOCS
                  </SFButton>
                </div>

                <div className="text-center">
                  <div className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    VARIANT: FRAME (SHIMMER)
                  </div>
                  <SFButton intent="primary" size="lg" className="relative overflow-hidden">
                    LAUNCH SEQUENCE
                  </SFButton>
                </div>

                <div className="text-center">
                  <div className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    VARIANT: YELLOW (TDR)
                  </div>
                  <SFButton
                    intent="ghost"
                    size="lg"
                    className="bg-[var(--sf-yellow)] text-foreground border-[var(--sf-yellow)] hover:bg-foreground hover:text-background hover:border-foreground"
                  >
                    BUY ME&trade;
                  </SFButton>
                </div>
              </div>

              {/* Preview code */}
              <div className="w-full p-5 bg-[oklch(0.12_0_0)] font-mono text-[11px] text-[oklch(0.6_0.28_145)] leading-[1.6] border-t border-[oklch(0.25_0_0)]">
                <span className="text-muted-foreground">
                  {"// CURRENTLY RENDERED"}
                </span>
                {"\n"}
                &lt;<span className="text-primary">Button</span>
                {"\n  "}
                <span className="text-[oklch(0.7_0.15_25)]">variant</span>=
                <span className="text-[var(--sf-yellow)]">{'"signal"'}</span>
                {"\n  "}
                <span className="text-[oklch(0.7_0.15_25)]">size</span>=
                <span className="text-[var(--sf-yellow)]">{'"md"'}</span>
                {"\n/>\n"}
              </div>
            </SFScrollArea>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
