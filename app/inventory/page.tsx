import type { Metadata } from "next";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { ComponentsExplorer } from "@/components/blocks/components-explorer";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { NavRevealMount } from "@/components/layout/nav-reveal-mount";
// Three.js WebGL scene — SignalMesh icosahedron relocated from homepage hero
import { SignalMeshLazy } from "@/components/animation/signal-mesh-lazy";
import { SFSection } from "@/components/sf";
import { highlight } from "@/lib/code-highlight";
import { COMPONENT_REGISTRY } from "@/lib/component-registry";

export const metadata: Metadata = {
  title: "Inventory — SIGNALFRAME//UX",
  description: "Browse 54 Signal and Frame components with live previews, filtering, and code examples.",
};

export default async function ComponentsPage() {
  // Pre-compute all highlighted code snippets (server-only, zero client JS cost)
  const highlightedCodeMap: Record<string, string> = {};
  const entries = Object.entries(COMPONENT_REGISTRY);
  await Promise.all(
    entries.map(async ([index, entry]) => {
      if (entry.code) {
        highlightedCodeMap[index] = await highlight(entry.code);
      }
    })
  );

  return (
    <>
      <Nav />
      <main id="main-content" data-cursor data-section="inv" data-section-label="INV" data-primary className="mt-[var(--nav-height)]">
        <Breadcrumb segments={[{ label: "INVENTORY" }]} />
        {/* SP-05: nav hides until the page header scrolls out of view (CONTEXT.md §VL — Nav reveal pattern, LOCKED) */}
        <NavRevealMount targetSelector="[data-nav-reveal-trigger]" />
        {/* ── Page Header: INVE\nNTORY + 54 stat ── */}
        <SFSection label="INVENTORY" className="py-0">
          <header
            data-nav-reveal-trigger
            className="grid grid-cols-[1fr_auto] items-end border-b-4 border-foreground"
          >
            <h1
              aria-label="Inventory"
              className="leading-[0.9] uppercase tracking-[-0.02em] px-6 md:px-12 pt-12 pb-6 sf-display"
              style={{ fontSize: "clamp(80px, 12vw, 160px)" }}
            >
              <span data-anim="page-heading" suppressHydrationWarning>INVE</span>
              <br />
              <span data-anim="page-heading" suppressHydrationWarning>NTORY</span>
            </h1>
            <div className="px-6 md:px-12 pb-6 text-right">
              <strong
                className="block text-foreground sf-display"
                style={{ fontSize: "clamp(28px, 4vw, 48px)", lineHeight: 1 }}
              >
                54
              </strong>
              <span className="text-muted-foreground text-[11px] uppercase tracking-[0.15em] leading-snug block mt-1">
                FRAME + SIGNAL PRIMITIVES
                <br />
                FOR EVERY SURFACE
              </span>
            </div>
          </header>
        </SFSection>

        {/* WebGL showcase — SignalMesh icosahedron relocated from homepage hero */}
        <SFSection label="SIGNAL MESH" className="py-0">
          <div className="relative h-[300px] border-b-4 border-foreground overflow-hidden" data-cursor>
            <SignalMeshLazy />
          </div>
        </SFSection>

        <ComponentsExplorer highlightedCodeMap={highlightedCodeMap} />
      </main>
      <Footer />
    </>
  );
}
