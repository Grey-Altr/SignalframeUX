import type { Metadata } from "next";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { TokenTabs } from "@/components/blocks/token-tabs";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { TokenVizLoader } from "@/components/animation/token-viz-loader";
import { SFSection } from "@/components/sf";
import { GhostLabel } from "@/components/animation/ghost-label";

export const metadata: Metadata = {
  title: "Token Explorer — SIGNALFRAME//UX",
  description: "Visualize and customize OKLCH color scales, spacing, typography, and motion tokens.",
};

export default async function TokensPage() {
  'use cache';
  return (
    <>
      <Nav />
      <main id="main-content" data-cursor data-section="sys" data-section-label="TOK" data-primary className="mt-[var(--nav-height)]">
        <Breadcrumb segments={[{ label: "TOKENS" }]} />
        {/* ═══ PAGE HEADER ═══ */}
        <SFSection label="TOKENS" className="py-0 relative h-screen flex flex-col justify-center overflow-hidden">
          <div className="relative overflow-hidden flex-1 flex flex-col justify-end">
            <GhostLabel
              text="SYSTEM"
              className="-left-[calc(2*var(--sf-vw))] top-1/2 -translate-y-1/2 text-foreground/[0.04]"
            />
            <header
              data-nav-reveal-trigger
              className="grid grid-cols-[1fr_auto] border-b-4 border-foreground items-end"
            >
              <h1
                aria-label="Token Explorer"
                className="sf-display px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] pt-[var(--sfx-space-12)] pb-[var(--sfx-space-6)] relative z-10"
                style={{ fontSize: "clamp(80px, calc(12*var(--sf-vw)), 160px)" }}
              >
                <span data-anim="page-heading" suppressHydrationWarning>TOKEN</span>
                <br />
                <span data-anim="page-heading" suppressHydrationWarning>EXPLORER</span>
              </h1>
              <div className="px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] pb-[var(--sfx-space-6)] text-right text-[11px] uppercase tracking-[0.15em] text-muted-foreground relative z-10">
                OKLCH COLOR SPACE · 49 SCALES
              </div>
            </header>
          </div>
        </SFSection>

        {/* ═══ CATEGORY TABS (client island) ═══ */}
        <TokenTabs />

        {/* ═══ TOKEN DIAGNOSTIC VISUALIZATION (Canvas 2D) ═══ */}
        <TokenVizLoader />

        {/* Gradient separator */}
        <div
          className="h-1.5"
          style={{ background: "linear-gradient(90deg, var(--color-primary), var(--sf-yellow), var(--color-primary))" }}
        />
      </main>
      <Footer />
    </>
  );
}
