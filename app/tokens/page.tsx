import type { Metadata } from "next";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { TokenTabs } from "@/components/blocks/token-tabs";
import { Breadcrumb } from "@/components/layout/breadcrumb";

export const metadata: Metadata = {
  title: "Token Explorer — SIGNALFRAME//UX",
  description: "Visualize and customize OKLCH color scales, spacing, typography, and motion tokens.",
};

export default function TokensPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="mt-[var(--nav-height)]">
        <Breadcrumb segments={[{ label: "TOKENS" }]} />
        {/* ═══ PAGE HEADER ═══ */}
        <div className="grid grid-cols-[1fr_auto] border-b-4 border-foreground items-end">
          <h1
            aria-label="Token Explorer"
            className="sf-display px-6 md:px-12 pt-10 pb-6"
            style={{ fontSize: "clamp(60px, 9vw, 100px)" }}
          >
            <span data-anim="page-heading" suppressHydrationWarning>TOKEN</span>
            <br />
            <span data-anim="page-heading" suppressHydrationWarning>EXPLORER</span>
          </h1>
          <div className="px-6 md:px-12 pb-6 text-right text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
            OKLCH COLOR SPACE · 49 SCALES
          </div>
        </div>

        {/* ═══ CATEGORY TABS (client island) ═══ */}
        <TokenTabs />

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
