import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { APIExplorerPaginated } from "@/components/blocks/api-explorer-paginated";
import { APIExplorerProvider } from "@/context/api-explorer-context";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { SFPanel } from "@/components/sf";

export const metadata: Metadata = {
  title: "API Reference — SIGNALFRAME//UX",
  description: "Full API documentation — props, hooks, tokens, and the programmable surface.",
};

export default function APIPage() {
  return (
    <>
      <main
        id="main-content"
        data-cursor
        data-section="ref"
        data-section-label="API"
        data-primary
        className="mt-[var(--nav-height)]"
      >
        <Breadcrumb segments={[{ label: "API" }]} />
        <APIExplorerProvider>
          <SFPanel
            name="reference-hero"
            mode="fit"
            label="API REFERENCE"
            className="relative flex flex-col justify-end"
          >
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
          </SFPanel>

          {/* §14.18 R-63-g closure: APIExplorerPaginated emits N fit-mode SFPanels.
              Total page scroll = (hero + N COMPONENTS + 1 AUX) × port. */}
          <APIExplorerPaginated />
        </APIExplorerProvider>
      </main>
      <Footer />
    </>
  );
}

