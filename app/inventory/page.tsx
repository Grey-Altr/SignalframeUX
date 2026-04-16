import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { ComponentsExplorer } from "@/components/blocks/components-explorer";
import { Breadcrumb } from "@/components/layout/breadcrumb";
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
      <main id="main-content" data-cursor data-section="inv" data-section-label="INV" data-primary className="mt-[var(--nav-height)]">
        <Breadcrumb segments={[{ label: "INVENTORY" }]} />
        {/* ── Page Header & WebGL Showcase (calc(100*var(--sf-vh)) combined) ── */}
        <SFSection label="INVENTORY" className="py-0 relative h-screen flex flex-col justify-between overflow-hidden">
          <header
            data-nav-reveal-trigger
            className="grid grid-cols-[1fr_auto] items-end border-b-4 border-foreground shrink-0"
          >
            <h1
              aria-label="Inventory"
              className="leading-[0.9] uppercase tracking-[-0.02em] px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] pt-[var(--sfx-space-12)] pb-[var(--sfx-space-6)] sf-display"
              style={{ fontSize: "clamp(80px, calc(12*var(--sf-vw)), 160px)" }}
            >
              <span data-anim="page-heading" suppressHydrationWarning>INVE</span>
              <br />
              <span data-anim="page-heading" suppressHydrationWarning>NTORY</span>
            </h1>
            <div className="px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] pb-[var(--sfx-space-6)] text-right">
              <strong
                className="block text-foreground sf-display"
                style={{ fontSize: "clamp(28px, calc(4*var(--sf-vw)), 48px)", lineHeight: 1 }}
              >
                54
              </strong>
              <span className="text-muted-foreground text-[11px] uppercase tracking-[0.15em] leading-snug block mt-[var(--sfx-space-1)]">
                FRAME + SIGNAL PRIMITIVES
                <br />
                FOR EVERY SURFACE
              </span>
            </div>
          </header>

          {/* WebGL showcase — SignalMesh icosahedron relocated from homepage hero */}
          <div className="relative flex-1 border-b-4 border-foreground overflow-hidden" data-cursor>
            <SignalMeshLazy />
          </div>
        </SFSection>

        <ComponentsExplorer highlightedCodeMap={highlightedCodeMap} />
      </main>
      <Footer />
    </>
  );
}
