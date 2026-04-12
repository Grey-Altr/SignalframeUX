import type { Metadata } from "next";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { APIExplorer } from "@/components/blocks/api-explorer";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { SFSection } from "@/components/sf";
import { NavRevealMount } from "@/components/layout/nav-reveal-mount";

export const metadata: Metadata = {
  title: "API Reference — SIGNALFRAME//UX",
  description: "Full API documentation — props, hooks, tokens, and the programmable surface.",
};

export default function APIPage() {
  return (
    <>
      <Nav />
      <main id="main-content" data-cursor data-section="ref" data-section-label="API" data-primary className="mt-[var(--nav-height)]">
        <Breadcrumb segments={[{ label: "API" }]} />
        <SFSection label="API REFERENCE HEADER" className="py-0">
          <header
            data-nav-reveal-trigger
            className="grid grid-cols-1 md:grid-cols-[1fr_auto] border-b-4 border-foreground items-end min-w-0"
          >
            <h1
              aria-label="API Reference"
              className="sf-display px-6 md:px-12 pt-12 pb-6 leading-[0.9] uppercase tracking-[-0.02em] min-w-0 break-all"
              style={{ fontSize: "clamp(80px, 12vw, 160px)" }}
            >
              <span data-anim="page-heading" suppressHydrationWarning>API</span>
              <br />
              <span data-anim="page-heading" suppressHydrationWarning>REFERENCE</span>
            </h1>
            <div className="hidden md:block px-6 md:px-12 pb-6 text-right text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
              PROGRAMMABLE SURFACES
            </div>
          </header>
        </SFSection>
        <NavRevealMount targetSelector="[data-nav-reveal-trigger]" />
        <SFSection label="API REFERENCE" className="py-0">
          <APIExplorer />
        </SFSection>
      </main>
      <Footer />
    </>
  );
}

