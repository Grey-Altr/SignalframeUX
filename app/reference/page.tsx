import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { APIExplorer } from "@/components/blocks/api-explorer";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { SFSection } from "@/components/sf";

export const metadata: Metadata = {
  title: "API Reference — SIGNALFRAME//UX",
  description: "Full API documentation — props, hooks, tokens, and the programmable surface.",
};

export default function APIPage() {
  return (
    <>
      <main id="main-content" data-cursor data-section="ref" data-section-label="API" data-primary className="mt-[var(--nav-height)]">
        <Breadcrumb segments={[{ label: "API" }]} />
        <SFSection label="API REFERENCE HEADER" className="py-0 relative h-screen flex flex-col justify-end overflow-hidden">
          <header
            data-nav-reveal-trigger
            className="grid grid-cols-1 md:grid-cols-[1fr_auto] border-b-4 border-foreground items-end min-w-0"
          >
            <h1
              aria-label="API Reference"
              className="sf-display px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] pt-[var(--sfx-space-12)] pb-[var(--sfx-space-6)] leading-[0.9] uppercase tracking-[-0.02em] min-w-0 break-all"
              style={{ fontSize: "clamp(80px, calc(12*var(--sf-vw)), 160px)" }}
            >
              <span data-anim="page-heading" suppressHydrationWarning>API</span>
              <br />
              <span data-anim="page-heading" suppressHydrationWarning>REFERENCE</span>
            </h1>
            <div className="hidden md:block px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] pb-[var(--sfx-space-6)] text-right text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
              PROGRAMMABLE SURFACES
            </div>
          </header>
        </SFSection>
        <SFSection label="API REFERENCE" className="py-0">
          <APIExplorer />
        </SFSection>
      </main>
      <Footer />
    </>
  );
}

