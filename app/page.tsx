import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Footer } from "@/components/layout/footer";
import { SFPanel, SFSection } from "@/components/sf";
// EntrySection is statically imported — above-the-fold LCP context.
// Pitfall #3 forbids lazy-mounting elements above the LCP boundary;
// lazy-mounting the LCP candidate defers its JS chunk but keeps SSR HTML
// only if ssr:true is set — however even with ssr:true a dynamic-import
// boundary on the LCP element risks LCP de-qualification on slower devices.
// Per .planning/codebase/v1.8-lcp-diagnosis.md DGN-01: mobile LCP =
// GhostLabel (inside ThesisSection's SFSection wrapper) and desktop LCP =
// VL-05 magenta // span (inside EntrySection). EntrySection MUST be static.
import { EntrySection } from "@/components/blocks/entry-section";
// Below-fold sections — route-level code-split per Phase 63.1 Plan 01 Task 2.
// ssr: true MANDATORY: keeps SSR HTML in initial response so:
//   (a) GhostLabel + mobile LCP candidate remain paintable from HTML;
//   (b) Phase 60 LCP-02 candidate b (content-visibility on ghost-label) stays applicable;
//   (c) SEO crawlers see section content.
//   (d) @layer signalframeux cascade is NOT broken — next/dynamic with ssr:true
//       does not emit per-component CSS chunks in App Router (Next 15 verified).
// JS chunks lazy-load post-paint via Next 15 dynamic-import chunk graph.
// Named-export pattern: .then((m) => ({ default: m.X })) required because
// next/dynamic expects a default export; all 5 sections use named exports.
const ProofSection = dynamic(
  () => import("@/components/blocks/proof-section").then((m) => ({ default: m.ProofSection })),
  { ssr: true }
);
const ThesisSection = dynamic(
  () => import("@/components/blocks/thesis-section").then((m) => ({ default: m.ThesisSection })),
  { ssr: true }
);
const SignalSection = dynamic(
  () => import("@/components/blocks/signal-section").then((m) => ({ default: m.SignalSection })),
  { ssr: true }
);
const InventorySection = dynamic(
  () => import("@/components/blocks/inventory-section").then((m) => ({ default: m.InventorySection })),
  { ssr: true }
);
const AcquisitionSection = dynamic(
  () => import("@/components/blocks/acquisition-section").then((m) => ({ default: m.AcquisitionSection })),
  { ssr: true }
);
import { GhostLabel } from "@/components/animation/ghost-label";
import { CDSymbol } from "@/components/sf/cd-symbol";

export const metadata: Metadata = {
  title: "SIGNALFRAME//UX — Deterministic Interface. Generative Expression.",
  description:
    "A dual-layer design system with 48 SF components. Signal layer for generative expression, Frame layer for deterministic structure.",
};

export default function HomePage() {
  return (
    <>
      <main id="main-content">
        <div id="bg-shift-wrapper">
          {/* ENTRY — full-viewport GLSL hero with title overlay */}
          <SFPanel
            name="entry"
            mode="fill"
            label="ENTRY"
            bgShift="black"
            id="entry"
            className="relative"
          >
            <EntrySection />
          </SFPanel>

          {/* THESIS — 200-calc(300*var(--sf-vh)) pinned manifesto (Phase 31).
              R-63-e / D-11 exception: pinned sections count as ONE panel
              externally but internally consume N × port of scroll distance.
              SFPanel enforces fixed height, so THESIS stays on SFSection
              until a PinnedPanel primitive emerges. Registry still picks
              it up via [data-section="thesis"]. */}
          <SFSection
            label="THESIS"
            bgShift="white"
            id="thesis"
            data-section="thesis"
            className="py-0 relative block overflow-x-hidden"
          >
            <GhostLabel
              text="THESIS"
              className="-left-[calc(3*var(--sf-vw))] top-1/2 -translate-y-1/2 text-foreground/[0.04]"
            />
            <ThesisSection />
            {/* ── Symbol divider: THESIS → PROOF ── */}
            <div className="absolute bottom-0 left-0 w-full flex items-center justify-center gap-[var(--sfx-space-3)] py-[var(--sfx-space-4)] bg-background border-t border-foreground/10 z-10">
              <CDSymbol name="dash" size={16} className="text-foreground/30" />
              <CDSymbol name="diamond" size={10} className="text-primary" />
              <CDSymbol name="dash" size={16} className="text-foreground/30" />
            </div>
          </SFSection>

          {/* PROOF — interactive SIGNAL/FRAME layer demo (Phase 32) */}
          <SFPanel
            name="proof"
            mode="fill"
            label="PROOF"
            bgShift="black"
            id="proof"
            className="sf-circuit relative"
          >
            <ProofSection />
          </SFPanel>

          {/* INVENTORY — 12-item catalog table with fixed overlay ComponentDetail (Phase 33) */}
          <SFPanel
            name="inventory"
            mode="fit"
            label="INVENTORY"
            bgShift="white"
            id="inventory"
            className="sf-circuit relative"
          >
            <InventorySection />
            {/* ── Symbol divider: INVENTORY → SIGNAL ── */}
            <div className="absolute bottom-0 left-0 w-full flex items-center justify-center gap-[var(--sfx-space-3)] py-[var(--sfx-space-4)] bg-background border-t border-foreground/10 z-10">
              <CDSymbol name="dash" size={16} className="text-foreground/30" />
              <CDSymbol name="crosshair" size={12} className="text-primary" />
              <CDSymbol name="dash" size={16} className="text-foreground/30" />
            </div>
          </SFPanel>

          {/* SIGNAL — calc(150*var(--sf-vh)) atmospheric parallax (Phase 32) */}
          <SFPanel
            name="signal"
            mode="fill"
            label="SIGNAL"
            bgShift="black"
            id="signal"
            className="relative"
          >
            <SignalSection />
          </SFPanel>

          {/* ACQUISITION — terminal instrument panel, ≤calc(50*var(--sf-vh)) (Phase 33).
              flex+flex-col+justify-center replaces the implicit flex layout
              SFSection previously provided; SFPanel is minimal by design. */}
          <SFPanel
            name="acquisition"
            mode="fit"
            label="ACQUISITION"
            bgShift="black"
            id="acquisition"
            className="sf-circuit relative flex flex-col justify-center"
          >
            <AcquisitionSection />
          </SFPanel>
        </div>
      </main>
      <Footer />
    </>
  );
}
