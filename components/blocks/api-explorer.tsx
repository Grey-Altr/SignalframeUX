"use client";

import { useState, useRef, useCallback, useEffect, memo } from "react";
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
  SFSelectGroup,
  SFSelectItem,
  SFSelectLabel,
  SFSelectValue,
} from "@/components/sf/sf-select";
import { SharedCodeBlock as CodeBlock } from "@/components/blocks/shared-code-block";
import { API_DOCS } from "@/lib/api-docs";
import type { ComponentDoc } from "@/lib/api-docs";
import { Breadcrumb } from "@/components/layout/breadcrumb";

const SF_SCRAMBLE_CHARS = "SIGNAL//01フレーム▓░▒";

/** Isolated HUD telemetry — updates every 2s without re-rendering the parent tree.
 *  Pauses interval when the tab is hidden to avoid unnecessary background re-renders. */
const HudTelemetry = memo(function HudTelemetry() {
  const [hud, setHud] = useState({ fps: 60, mem: 2.4 });

  useEffect(() => {
    let id: ReturnType<typeof setInterval> | undefined;

    function startInterval() {
      id = setInterval(() => {
        setHud({
          fps: 58 + Math.floor(Math.random() * 5),
          mem: +(2.1 + Math.random() * 0.8).toFixed(1),
        });
      }, 2000);
    }

    function onVisibility() {
      if (document.hidden) {
        clearInterval(id);
        id = undefined;
      } else if (!id) {
        startInterval();
      }
    }

    startInterval();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <div data-anim="hud-line">FPS: {hud.fps} | MEM: {hud.mem}MB</div>;
});

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

/** Data-driven documentation renderer — renders any ComponentDoc from api-docs.ts */
function DataDrivenDoc({ doc }: { doc: ComponentDoc }) {
  const layerLabel = doc.layer === "HOOK" ? "HOOK" : doc.layer === "TOKEN" ? "TOKEN" : `${doc.layer} LAYER`;
  return (
    <>
      <h1 className="text-foreground sf-display leading-[0.95] mb-2" style={{ fontSize: "clamp(48px, 8vw, 72px)" }}>
        {doc.name.toUpperCase()}
      </h1>
      <SFBadge intent="signal" className="mb-6 text-[var(--text-sm)] tracking-[0.1em]">
        {layerLabel} · {doc.version} · {doc.status}
      </SFBadge>

      <p className="text-[var(--text-base)] leading-[1.8] text-muted-foreground max-w-[580px] mb-8">
        {doc.description}
      </p>

      <h2 className="sf-display text-[var(--text-xl)] mt-12 mb-4 pt-6 border-t-2 border-foreground">IMPORT</h2>
      <CodeBlock label="TSX" className="my-4">
        <span className="text-primary">import</span>
        {" { "}<span className="text-[var(--sf-code-text)]">{doc.importName}</span>{" } "}
        <span className="text-primary">from</span>{" "}
        <span className="text-[var(--sf-yellow)]">{`'${doc.importPath}'`}</span>
      </CodeBlock>

      <h2 className="sf-display text-[var(--text-xl)] mt-12 mb-4 pt-6 border-t-2 border-foreground">
        {doc.layer === "HOOK" ? "RETURNS" : doc.layer === "TOKEN" ? "TOKENS" : "PROPS"}
      </h2>
      <SFTable className="mb-6">
        <SFTableHeader>
          <SFTableRow>
            <SFTableHead>{doc.layer === "TOKEN" ? "TOKEN" : "PROP"}</SFTableHead>
            <SFTableHead>TYPE</SFTableHead>
            <SFTableHead>DEFAULT</SFTableHead>
            <SFTableHead>DESC</SFTableHead>
          </SFTableRow>
        </SFTableHeader>
        <SFTableBody>
          {doc.props.map((prop) => (
            <SFTableRow key={prop.name}>
              <SFTableCell className="text-primary font-bold">{prop.name}</SFTableCell>
              <SFTableCell>
                <code className="text-[var(--text-xs)] bg-muted px-1.5 py-0.5">{prop.type}</code>
              </SFTableCell>
              <SFTableCell className="text-muted-foreground">{prop.default}</SFTableCell>
              <SFTableCell>
                {prop.desc}
                {prop.required && (
                  <SFBadge intent="primary" className="ml-1.5 text-[var(--text-xs)] py-0 px-1 h-auto">REQ</SFBadge>
                )}
              </SFTableCell>
            </SFTableRow>
          ))}
        </SFTableBody>
      </SFTable>

      <h2 className="sf-display text-[var(--text-xl)] mt-12 mb-4 pt-6 border-t-2 border-foreground">USAGE</h2>
      {doc.usage.length === 1 ? (
        <CodeBlock label="TSX" className="my-4">
          <span className="text-[var(--sf-code-text)]">{doc.usage[0].code}</span>
        </CodeBlock>
      ) : (
        <SFTabs defaultValue={doc.usage[0].label}>
          <SFTabsList className="border-b-0 mb-0">
            {doc.usage.map((ex) => (
              <SFTabsTrigger key={ex.label} value={ex.label}>{ex.label}</SFTabsTrigger>
            ))}
          </SFTabsList>
          {doc.usage.map((ex) => (
            <SFTabsContent key={ex.label} value={ex.label} className="mt-0">
              <CodeBlock label="TSX" className="my-4">
                <span className="text-[var(--sf-code-text)]">{ex.code}</span>
              </CodeBlock>
            </SFTabsContent>
          ))}
        </SFTabs>
      )}

      <h2 className="sf-display text-[var(--text-xl)] mt-12 mb-4 pt-6 border-t-2 border-foreground">ACCESSIBILITY</h2>
      <CodeBlock label="INFO" className="my-4">
        <span className="text-muted-foreground">
          {doc.a11y.map((line, i) => (
            <span key={i}>{i > 0 ? "\n" : ""}{i > 0 ? "• " : ""}{line}</span>
          ))}
        </span>
      </CodeBlock>
    </>
  );
}

export function APIExplorer() {
  const [activeNav, setActiveNav] = useState("button");
  const [previewTheme, setPreviewTheme] = useState<"LIGHT" | "DARK" | "FRAME">("DARK");
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  // Scroll progress on center panel — RAF-throttled
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    let rafId = 0;
    const handler = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const { scrollTop, scrollHeight, clientHeight } = el;
        const max = scrollHeight - clientHeight;
        setScrollProgress(max > 0 ? scrollTop / max : 0);
      });
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => {
      el.removeEventListener("scroll", handler);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // GSAP animations — nav stagger, H1 split-text, typewriter, HUD lines, button scramble, magnetic cursor
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let ctx: { revert: () => void } | null = null;
    const magnetCleanups: Array<() => void> = [];
    const scrambleCleanups: Array<() => void> = [];

    import("@/lib/gsap-split").then(({ gsap, SplitText }) => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        // ── 1. Nav items stagger fade-in (#9) ──
        const navItems = sidebarRef.current?.querySelectorAll("button");
        if (navItems?.length) {
          gsap.from(navItems, {
            x: -20,
            opacity: 0,
            duration: 0.35,
            stagger: 0.04,
            ease: "power2.out",
            delay: 0.2,
          });
        }

        // ── 2. H1 split-text reveal (#10) ──
        const h1 = document.querySelector("[data-anim='api-h1']");
        if (h1) {
          const split = SplitText.create(h1, { type: "chars" });
          gsap.from(split.chars, {
            y: "100%",
            opacity: 0,
            duration: 0.45,
            stagger: 0.03,
            ease: "power3.out",
            delay: 0.4,
          });
        }

        // ── 3. Typewriter on import code block (#11) ──
        const codeBlock = document.querySelector("[data-anim='api-import-code']");
        if (codeBlock) {
          const original = codeBlock.textContent || "";
          const el = codeBlock as HTMLElement;
          el.style.overflow = "hidden";
          gsap.fromTo(
            { length: 0 },
            { length: 0 },
            {
              length: original.length,
              duration: original.length * 0.015,
              ease: "none",
              delay: 0.8,
              onUpdate() {
                // Clip visible text via CSS clip-path based on char progress
                const progress = this.targets()[0].length / original.length;
                el.style.clipPath = `inset(0 ${(1 - progress) * 100}% 0 0)`;
              },
              onComplete() {
                el.style.clipPath = "none";
              },
            }
          );
        }

        // ── 4. HUD line stagger (#12) ──
        const hudLines = document.querySelectorAll("[data-anim='hud-line']");
        if (hudLines.length) {
          gsap.from(hudLines, {
            opacity: 0,
            x: -10,
            duration: 0.3,
            stagger: 0.2,
            delay: 0.6,
            ease: "power2.out",
          });
        }

        // ── 5. Button scramble on hover (#13) ──
        const previewButtons = document.querySelectorAll("[data-anim='preview-btn']");
        previewButtons.forEach((btn) => {
          const el = btn as HTMLElement;
          const originalText = el.textContent || "";
          const onEnter = () => {
            gsap.to(el, {
              duration: 0.25,
              scrambleText: {
                text: originalText,
                chars: SF_SCRAMBLE_CHARS,
                speed: 0.5,
              },
            });
          };
          el.addEventListener("mouseenter", onEnter);
          scrambleCleanups.push(() => el.removeEventListener("mouseenter", onEnter));
        });

        // ── 6. Click pop on preview buttons (#25) ──
        previewButtons.forEach((btn) => {
          const el = btn as HTMLElement;
          const onClick = () => {
            gsap.fromTo(el, { scale: 1 }, { scale: 1.08, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.out" });
          };
          el.addEventListener("click", onClick);
          scrambleCleanups.push(() => el.removeEventListener("click", onClick));
        });

        // ── 7. Magnetic cursor on nav items (#14) — single delegated listener ──
        const sidebar = sidebarRef.current;
        if (sidebar) {
          const onMove = (e: MouseEvent) => {
            const btn = (e.target as HTMLElement).closest<HTMLElement>("button");
            if (!btn) return;
            const rect = btn.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const radius = 60;
            if (dist < radius) {
              const strength = (1 - dist / radius) * 6;
              gsap.to(btn, {
                x: (dx / dist) * strength,
                y: (dy / dist) * strength,
                duration: 0.3,
                ease: "power2.out",
              });
            }
          };
          const onLeave = (e: MouseEvent) => {
            const btn = (e.target as HTMLElement).closest<HTMLElement>("button");
            if (btn) {
              gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: "elastic.out(1, 0.5)" });
            }
          };
          sidebar.addEventListener("mousemove", onMove);
          sidebar.addEventListener("mouseleave", onLeave, true);
          magnetCleanups.push(() => {
            sidebar.removeEventListener("mousemove", onMove);
            sidebar.removeEventListener("mouseleave", onLeave, true);
          });
        }
      });
    });

    return () => {
      cancelled = true;
      ctx?.revert();
      magnetCleanups.forEach((fn) => fn());
      scrambleCleanups.forEach((fn) => fn());
    };
  // Animations run once on mount — activeNav changes are handled by re-render, not re-animation.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      // Need to wait for re-render
      requestAnimationFrame(() => {
        sidebarRef.current
          ?.querySelector<HTMLButtonElement>(`button[aria-current="location"]`)
          ?.focus();
      });
    },
    [activeNav]
  );

  const activeItem = findNavItem(activeNav);

  return (
    <div className="mt-[var(--nav-height)]">
      <Breadcrumb segments={[{ label: "API REFERENCE" }]} />
      {/* Page Header */}
      <header className="grid grid-cols-[1fr_auto] items-end border-b-4 border-foreground">
        <h1
          className="sf-display px-6 md:px-12 pt-12 pb-6"
          style={{ fontSize: "clamp(60px, 9vw, 100px)" }}
        >
          <span data-anim="page-heading" suppressHydrationWarning>API</span>
          <br />
          <span data-anim="page-heading" className="text-primary" suppressHydrationWarning>REFERENCE</span>
        </h1>
        <div className="px-6 md:px-12 pb-6 text-right text-[var(--text-sm)] uppercase tracking-[0.15em] text-muted-foreground">
          PROPS · HOOKS · TOKENS · SURFACE
        </div>
      </header>

      {/* MOBILE NAV — Select dropdown (visible below md) */}
      <div className="md:hidden border-b-[3px] border-foreground bg-foreground p-4">
        <SFSelect value={activeNav} onValueChange={handleNavClick}>
          <SFSelectTrigger className="w-full bg-[var(--sf-dark-surface)] text-background border-[var(--sf-subtle-border)] text-[var(--text-sm)] uppercase tracking-[0.1em]">
            <SFSelectValue />
          </SFSelectTrigger>
          <SFSelectContent className="max-h-[50vh]">
            {NAV_SECTIONS.map((section) => (
              <SFSelectGroup key={section.title}>
                <SFSelectLabel>{section.title}</SFSelectLabel>
                {section.items.map((item) => (
                  <SFSelectItem key={item.id} value={item.id} className="text-[var(--text-sm)] uppercase tracking-[0.08em]">
                    {item.label}
                  </SFSelectItem>
                ))}
              </SFSelectGroup>
            ))}
          </SFSelectContent>
        </SFSelect>
      </div>

      <div className="min-h-[calc(100vh-var(--nav-height))] grid grid-cols-1 md:grid-cols-[var(--api-sidebar-w)_1fr_var(--api-preview-w)]" style={{ "--api-sidebar-w": "240px", "--api-preview-w": "380px" } as React.CSSProperties}>
      {/* LEFT PANEL — API Navigation */}
      <nav
        ref={sidebarRef}
        aria-label="API sections"
        onKeyDown={handleSidebarKeyDown}
        className="sticky top-[var(--nav-height)] h-[calc(100vh-var(--nav-height))] bg-foreground text-background hidden md:block"
      >
        <SFScrollArea className="h-full">
          <div className="border-b border-[var(--sf-subtle-border)] p-6 sf-display text-2xl">
            API&trade;
          </div>
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="border-b border-[var(--sf-dark-surface)] py-3">
              <div className="text-[var(--text-xs)] uppercase tracking-[0.2em] text-muted-foreground px-4 pb-2">
                {section.title}
              </div>
              <ul role="list" className="list-none m-0 p-0">
                {section.items.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      aria-current={activeNav === item.id ? "location" : undefined}
                      className={`block w-full text-left no-underline uppercase transition-colors text-[var(--text-xs)] tracking-[0.08em] py-1.5 px-4 ${
                        activeNav === item.id
                          ? "text-primary bg-[var(--sf-dark-surface)] border-l-[3px] border-l-primary"
                          : "text-[var(--sf-muted-text-dark)] hover:text-background hover:bg-[var(--sf-dark-surface)]"
                      }`}
                    >
                      {item.label}
                      {"badge" in item && item.badge && (
                        <SFBadge intent="primary" className="ml-1.5 text-[var(--text-xs)] py-0 px-1.5 h-auto" aria-hidden="true">
                          {item.badge}
                        </SFBadge>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </SFScrollArea>
      </nav>

      {/* CENTER PANEL — Documentation */}
      <div ref={contentRef} className="overflow-y-auto border-r-[3px] border-foreground py-12 px-6 md:px-12 h-auto md:h-[calc(100vh-var(--nav-height))] relative">
        {/* Scroll progress bar */}
        <div
          aria-hidden="true"
          className="fixed top-[var(--nav-height)] left-[var(--api-sidebar-w)] h-[3px] z-[var(--z-progress)] origin-left hidden md:block pointer-events-none"
          style={{
            right: "calc(var(--api-preview-w) + 3px)",
            background: "var(--color-primary)",
            transform: `scaleX(${scrollProgress})`,
            transition: "transform 50ms linear",
          }}
        />
        <div className="text-[var(--text-xs)] uppercase tracking-[0.15em] text-muted-foreground mb-6">
          <span className="text-primary">API</span> /{" "}
          <span className="text-primary">{activeItem.section}</span> / {activeItem.label.toUpperCase()}
        </div>

        {activeNav !== "button" && API_DOCS[activeNav] ? (
          <DataDrivenDoc doc={API_DOCS[activeNav]} />
        ) : activeNav !== "button" ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <h1 className="text-foreground sf-display leading-[0.95]" style={{ fontSize: "clamp(48px, 8vw, 72px)" }}>{activeItem.label.toUpperCase()}</h1>
            <SFBadge intent="outline" className="text-[var(--text-base)] py-2.5 px-8 opacity-50">
              COMING SOON
            </SFBadge>
            <p className="text-[var(--text-xs)] text-muted-foreground uppercase tracking-[0.1em] max-w-[400px] text-center leading-[1.8]">
              THIS COMPONENT&apos;S API DOCUMENTATION IS UNDER CONSTRUCTION.
            </p>
            <SFButton
              intent="primary"
              size="sm"
              onClick={() => handleNavClick("button")}
              className="text-[var(--text-sm)] tracking-[0.1em]"
            >
              VIEW BUTTON REFERENCE →
            </SFButton>
          </div>
        ) : (
          <>
        <h1 data-anim="api-h1" className="text-foreground sf-display leading-[0.95] mb-2" style={{ fontSize: "clamp(48px, 8vw, 72px)" }}>BUTTON</h1>
        <SFBadge intent="signal" className="mb-6 text-[var(--text-sm)] tracking-[0.1em]">
          FRAME LAYER · v2.1.0 · STABLE
        </SFBadge>

        <p className="text-[var(--text-base)] leading-[1.8] text-muted-foreground max-w-[580px] mb-8">
          THE PRIMARY INTERACTIVE ELEMENT. SUPPORTS SIGNAL (DETERMINISTIC)
          AND SIGNAL (GENERATIVE) VARIANTS. PROGRESSIVE ENHANCEMENT — SIGNAL
          EFFECTS LAYER ON TOP WITHOUT BREAKING ACCESSIBILITY.
        </p>

        <h2 className="sf-display text-[var(--text-xl)] mt-12 mb-4 pt-6 border-t-2 border-foreground">IMPORT</h2>
        <div data-anim="api-import-code">
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
        </div>

        <h2 className="sf-display text-[var(--text-xl)] mt-12 mb-4 pt-6 border-t-2 border-foreground">PROPS</h2>
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
                  <code className="text-[var(--text-xs)] bg-muted px-1.5 py-0.5">{prop.type}</code>
                </SFTableCell>
                <SFTableCell className="text-muted-foreground">{prop.default}</SFTableCell>
                <SFTableCell>
                  {prop.desc}
                  {prop.required && (
                    <SFBadge intent="primary" className="ml-1.5 text-[var(--text-xs)] py-0 px-1 h-auto">REQ</SFBadge>
                  )}
                </SFTableCell>
              </SFTableRow>
            ))}
          </SFTableBody>
        </SFTable>

        <h2 className="sf-display text-[var(--text-xl)] mt-12 mb-4 pt-6 border-t-2 border-foreground">USAGE</h2>
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

        <h2 className="sf-display text-[var(--text-xl)] mt-12 mb-4 pt-6 border-t-2 border-foreground">ACCESSIBILITY</h2>
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

      {/* RIGHT PANEL — Context-Aware Preview */}
      <aside className="sticky top-[var(--nav-height)] h-[calc(100vh-var(--nav-height))] bg-[var(--sf-darkest-surface)] text-primary-foreground hidden md:block">
        <SFScrollArea className="h-full">
          <div className="flex items-center justify-between border-b border-[var(--sf-subtle-border)] p-4">
            <span className="text-[var(--text-sm)] uppercase tracking-[0.2em] text-muted-foreground">
              CONTEXT&trade;
            </span>
            <div className="flex gap-2">
              {(["LIGHT", "DARK", "FRAME"] as const).map((label) => (
                <SFButton
                  key={label}
                  intent={previewTheme === label ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setPreviewTheme(label)}
                  className={`text-[var(--text-sm)] h-6 px-2.5 ${
                    previewTheme !== label ? "border-[var(--sf-subtle-border)] text-muted-foreground" : ""
                  }`}
                >
                  {label}
                </SFButton>
              ))}
            </div>
          </div>

          <div
            className="relative flex flex-col items-center justify-center gap-6 p-12 min-h-[300px] transition-colors duration-200"
            style={{
              background:
                previewTheme === "LIGHT" ? "var(--sf-preview-light-bg)"
                : previewTheme === "FRAME" ? "var(--color-primary)"
                : undefined,
            }}
          >
            {/* Context-aware HUD telemetry */}
            <div className={`absolute top-6 left-6 text-[var(--text-xs)] uppercase tracking-[0.2em] opacity-40 ${
              previewTheme === "LIGHT" ? "text-foreground" : "text-[var(--sf-code-text)]"
            }`}>
              {(activeNav === "button" ? [
                "SF//UX::BUTTON::RENDER",
                "VARIANT: FRAME | GHOST | SIGNAL",
                "SIGNAL: SHIMMER @ 0.8",
              ] : API_DOCS[activeNav]?.preview?.lines ?? [
                `SF//UX::${activeItem.label.toUpperCase()}`,
              ]).map((line, i) => (
                <div key={`${activeNav}-${i}`} data-anim="hud-line">{line}</div>
              ))}
              <HudTelemetry />
            </div>

            {/* Context-aware preview content */}
            {activeNav === "button" ? (
              <>
                <div className="text-center mt-[60px]">
                  <div className="text-[var(--text-sm)] uppercase tracking-[0.2em] text-muted-foreground mb-2">VARIANT: FRAME</div>
                  <SFButton intent="ghost" size="lg" data-anim="preview-btn" className="bg-background text-foreground border-background hover:bg-background/80 hover:text-foreground">GET STARTED</SFButton>
                </div>
                <div className="text-center">
                  <div className="text-[var(--text-sm)] uppercase tracking-[0.2em] text-muted-foreground mb-2">VARIANT: GHOST</div>
                  <SFButton intent="ghost" size="lg" data-anim="preview-btn" className="text-foreground border-foreground hover:bg-foreground hover:text-background">VIEW DOCS</SFButton>
                </div>
                <div className="text-center">
                  <div className="text-[var(--text-sm)] uppercase tracking-[0.2em] text-muted-foreground mb-2">VARIANT: SIGNAL (SHIMMER)</div>
                  <SFButton intent="primary" size="lg" data-anim="preview-btn" className="relative overflow-hidden">LAUNCH SEQUENCE</SFButton>
                </div>
                <div className="text-center">
                  <div className="text-[var(--text-sm)] uppercase tracking-[0.2em] text-muted-foreground mb-2">VARIANT: YELLOW (TDR)</div>
                  <SFButton intent="ghost" size="lg" data-anim="preview-btn" className="bg-[var(--sf-yellow)] text-foreground border-[var(--sf-yellow)] hover:bg-foreground hover:text-background hover:border-foreground">
                    BUY ME&trade;
                  </SFButton>
                </div>
              </>
            ) : (
              <div className="w-full mt-[60px] flex flex-col items-center gap-8">
                <div className="sf-display text-[var(--text-3xl)] text-center leading-[0.95] text-muted-foreground/30">
                  {activeItem.label.toUpperCase()}
                </div>
                <SFBadge intent="outline" className="text-[var(--text-sm)] border-[var(--sf-subtle-border)] text-muted-foreground">
                  {API_DOCS[activeNav]?.layer ?? "FRAME"} · {API_DOCS[activeNav]?.version ?? "v2.0.0"}
                </SFBadge>
              </div>
            )}
          </div>

          {/* Context-aware code preview */}
          <div className="w-full p-6 bg-[var(--sf-code-bg)] font-mono text-[var(--text-sm)] text-[var(--sf-code-text)] leading-[1.6] border-t border-[var(--sf-subtle-border)] whitespace-pre">
            <span className="text-muted-foreground">{"// CURRENTLY VIEWING"}</span>
            {"\n"}
            {activeNav === "button" ? (
              <>
                &lt;<span className="text-primary">Button</span>
                {"\n  "}<span className="text-[var(--sf-code-keyword)]">variant</span>=
                <span className="text-[var(--sf-yellow)]">{'"signal"'}</span>
                {"\n  "}<span className="text-[var(--sf-code-keyword)]">size</span>=
                <span className="text-[var(--sf-yellow)]">{'"md"'}</span>
                {"\n/>\n"}
              </>
            ) : (
              <span className="text-[var(--sf-code-text)]">
                {API_DOCS[activeNav]?.preview?.code ?? `// ${activeItem.label.toUpperCase()}`}
              </span>
            )}
          </div>

          {/* VHS badge */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-[var(--text-xs)] uppercase tracking-[0.2em] text-muted-foreground opacity-40">
            <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            <span>SF//UX</span>
          </div>
        </SFScrollArea>
      </aside>
      </div>
    </div>
  );
}
