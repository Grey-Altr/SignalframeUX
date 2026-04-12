"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "@/lib/gsap-core";
import * as SF from "@/components/sf";
import {
  SFTabs,
  SFTabsList,
  SFTabsTrigger,
  SFTabsContent,
  SFBadge,
} from "@/components/sf";
import type { ComponentRegistryEntry } from "@/lib/component-registry";
import type { ComponentDoc } from "@/lib/api-docs";
import { cn } from "@/lib/utils";

// ── Sub-components ─────────────────────────────────────────────────────────

function VariantCard({
  componentName,
  props,
}: {
  componentName: string;
  props: Record<string, unknown>;
}) {
  const Comp = (SF as Record<string, unknown>)[
    componentName
  ] as React.ComponentType<Record<string, unknown>> | undefined;

  if (!Comp) {
    return (
      <div className="border-2 border-destructive p-4 text-[var(--text-xs)] font-mono uppercase text-destructive">
        {componentName} — NOT IN BARREL (PATTERN B/C)
      </div>
    );
  }

  return <Comp {...props} />;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — silent fail
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="uppercase text-[var(--text-xs)] tracking-[0.15em] font-bold px-3 py-1 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors"
    >
      {copied ? "COPIED" : "COPY"}
    </button>
  );
}

// ── Tab trigger shared classes ─────────────────────────────────────────────

const TAB_TRIGGER_CLASSES =
  "rounded-none uppercase tracking-[0.15em] text-[var(--text-sm)] font-bold px-6 py-3 border-0 border-r-2 border-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none";

// ── Main Export ────────────────────────────────────────────────────────────

export interface ComponentDetailProps {
  entry: ComponentRegistryEntry;
  doc: ComponentDoc | undefined;
  highlightedCode: string;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
}

export function ComponentDetail({
  entry,
  doc,
  highlightedCode,
  onClose,
  triggerRef,
}: ComponentDetailProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);

  // ── body data-modal-open contract (SI-04) ────────────────────────────────
  useEffect(() => {
    document.body.setAttribute("data-modal-open", "true");
    return () => {
      document.body.removeAttribute("data-modal-open");
    };
  }, []);

  // ── GSAP open animation (DV-04) ──────────────────────────────────────────
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
      gsap.set(panel, { height: "auto", overflow: "visible" });
    } else {
      gsap.fromTo(
        panel,
        { height: 0, overflow: "hidden" },
        {
          height: panel.scrollHeight,
          duration: 0.2,
          ease: "power2.out",
          clearProps: "height,overflow",
        }
      );
    }
  }, []);

  // ── Close animation helper ───────────────────────────────────────────────
  const handleClose = () => {
    if (closingRef.current) return;
    closingRef.current = true;

    const panel = panelRef.current;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!panel || reducedMotion) {
      onClose();
      triggerRef.current?.focus();
      return;
    }

    gsap.to(panel, {
      height: 0,
      overflow: "hidden",
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        onClose();
        triggerRef.current?.focus();
      },
    });
  };

  // ── Escape key handler (DV-10) ───────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── CLI install command text ─────────────────────────────────────────────
  const cliCommand = `pnpm dlx shadcn add sf-${entry.name.toLowerCase().replace(/_/g, "-")}`;

  return (
    <div
      ref={panelRef}
      className="border-t-4 border-primary bg-background overflow-hidden"
      style={{ height: 0 }}
      role="region"
      aria-label={`${entry.name} component details`}
    >
      {/* Detail Header (DV-08, DV-09) */}
      <div className="flex items-center gap-4 px-6 py-4 border-b-2 border-foreground flex-wrap">
        <h3 className="sf-display text-[var(--text-xl)] uppercase tracking-[-0.02em]">
          {entry.name}
        </h3>

        <SFBadge
          intent={entry.layer === "signal" ? "signal" : "default"}
          className="uppercase text-[var(--text-2xs)] tracking-[0.2em]"
        >
          {entry.layer.toUpperCase()}
        </SFBadge>

        <span className="text-[var(--text-xs)] font-mono uppercase tracking-[0.15em] text-muted-foreground">
          PATTERN {entry.pattern}
        </span>

        {entry.layer === "signal" && (
          <span className="text-[var(--text-xs)] font-mono uppercase tracking-[0.15em] text-muted-foreground ml-auto">
            --duration-normal / --ease-default
          </span>
        )}

        <button
          type="button"
          onClick={handleClose}
          aria-label="Close component detail"
          className={cn(
            "text-[var(--text-xs)] font-mono uppercase tracking-[0.15em]",
            "px-3 py-1 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors",
            entry.layer === "signal" ? "ml-0" : "ml-auto"
          )}
        >
          CLOSE ×
        </button>
      </div>

      {/* Tabs (DV-04, DV-05, DV-06, DV-07, SI-03) */}
      <SFTabs defaultValue="variants">
        <SFTabsList
          className="bg-transparent border-b-2 border-foreground rounded-none h-auto p-0 w-full flex justify-start"
        >
          <SFTabsTrigger value="variants" className={TAB_TRIGGER_CLASSES}>
            VARIANTS
          </SFTabsTrigger>
          <SFTabsTrigger value="props" className={TAB_TRIGGER_CLASSES}>
            PROPS
          </SFTabsTrigger>
          <SFTabsTrigger value="code" className={TAB_TRIGGER_CLASSES}>
            CODE
          </SFTabsTrigger>
        </SFTabsList>

        {/* VARIANTS tab (DV-05) */}
        <SFTabsContent value="variants">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
            {entry.variants.map((v) => (
              <div
                key={v.label}
                className="flex flex-col items-center gap-2 p-4 border-2 border-foreground/20"
              >
                <VariantCard componentName={entry.component} props={v.props} />
                <span className="text-[var(--text-xs)] font-mono uppercase tracking-[0.15em] text-muted-foreground">
                  {v.label}
                </span>
              </div>
            ))}
          </div>
        </SFTabsContent>

        {/* PROPS tab (DV-06) */}
        <SFTabsContent value="props">
          <div className="overflow-x-auto p-6">
            {doc && doc.props.length > 0 ? (
              <table className="w-full text-left text-[var(--text-sm)]">
                <thead>
                  <tr className="border-b-2 border-foreground">
                    <th className="py-2 pr-4 font-mono uppercase tracking-[0.15em] text-[var(--text-xs)]">NAME</th>
                    <th className="py-2 pr-4 font-mono uppercase tracking-[0.15em] text-[var(--text-xs)]">TYPE</th>
                    <th className="py-2 pr-4 font-mono uppercase tracking-[0.15em] text-[var(--text-xs)]">DEFAULT</th>
                    <th className="py-2 pr-4 font-mono uppercase tracking-[0.15em] text-[var(--text-xs)]">REQ</th>
                    <th className="py-2 font-mono uppercase tracking-[0.15em] text-[var(--text-xs)]">DESCRIPTION</th>
                  </tr>
                </thead>
                <tbody>
                  {doc.props.map((p) => (
                    <tr key={p.name} className="border-b border-foreground/10">
                      <td className="py-2 pr-4 font-mono text-primary">{p.name}</td>
                      <td className="py-2 pr-4 font-mono text-muted-foreground">{p.type}</td>
                      <td className="py-2 pr-4 font-mono">{p.default || "---"}</td>
                      <td className="py-2 pr-4 font-mono">{p.required ? "YES" : "---"}</td>
                      <td className="py-2 text-muted-foreground">{p.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-muted-foreground text-[var(--text-sm)] uppercase tracking-[0.15em] py-4">
                NO PROP DOCUMENTATION AVAILABLE
              </p>
            )}
          </div>
        </SFTabsContent>

        {/* CODE tab (DV-07) */}
        <SFTabsContent value="code">
          <div className="p-6 flex flex-col gap-6">
            {/* Usage snippet */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[var(--text-xs)] font-mono uppercase tracking-[0.15em] text-muted-foreground">
                  USAGE
                </span>
                <CopyButton text={entry.code} />
              </div>
              {/* Server-generated HTML from shiki -- trusted source (registry data, not user input) */}
              <ShikiOutput html={highlightedCode} />
            </div>

            {/* CLI install */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[var(--text-xs)] font-mono uppercase tracking-[0.15em] text-muted-foreground">
                  INSTALL
                </span>
                <CopyButton text={cliCommand} />
              </div>
              <pre className="bg-card p-6 font-mono text-[var(--text-sm)] text-foreground overflow-x-auto border-2 border-foreground/20">
                {cliCommand}
              </pre>
            </div>
          </div>
        </SFTabsContent>
      </SFTabs>
    </div>
  );
}

// ── ShikiOutput: safe wrapper around server-generated syntax HTML ───────────
// The HTML string comes from shiki running server-side on known registry code snippets.
// It is NOT user input and does NOT go through any user-controlled code path.
function ShikiOutput({ html }: { html: string }) {
  return (
    <div
      className="border-2 border-foreground/20 overflow-hidden [&_pre]:p-6 [&_pre]:overflow-x-auto [&_pre]:m-0 [&_pre]:font-mono [&_pre]:text-[var(--text-sm)]"
      // nosec: trusted server-generated HTML from shiki on registry code snippets
      // skipcq: JS-0440
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
