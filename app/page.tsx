import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { SFSection } from "@/components/sf";
import { EntrySection } from "@/components/blocks/entry-section";
import { ProofSection } from "@/components/blocks/proof-section";
import { ThesisSection } from "@/components/blocks/thesis-section";
import { SignalSection } from "@/components/blocks/signal-section";
import { InventorySection } from "@/components/blocks/inventory-section";
import { AcquisitionSection } from "@/components/blocks/acquisition-section";
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
          <SFSection
            label="ENTRY"
            bgShift="black"
            id="entry"
            data-section="entry"
            className="py-0 relative h-screen overflow-hidden"
          >
            <EntrySection />
          </SFSection>

          {/* THESIS — 200-calc(300*var(--sf-vh)) pinned manifesto (Phase 31) */}
          <SFSection
            label="THESIS"
            bgShift="white"
            id="thesis"
            data-section="thesis"
            className="py-0 relative block"
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
          <SFSection
            label="PROOF"
            bgShift="black"
            id="proof"
            data-section="proof"
            className="py-0 sf-circuit relative h-screen overflow-hidden"
          >
            <ProofSection />
          </SFSection>

          {/* INVENTORY — 12-item catalog table with fixed overlay ComponentDetail (Phase 33) */}
          <SFSection
            label="INVENTORY"
            bgShift="white"
            id="inventory"
            data-section="inventory"
            className="py-0 sf-circuit relative h-screen overflow-hidden"
          >
            <InventorySection />
            {/* ── Symbol divider: INVENTORY → SIGNAL ── */}
            <div className="absolute bottom-0 left-0 w-full flex items-center justify-center gap-[var(--sfx-space-3)] py-[var(--sfx-space-4)] bg-background border-t border-foreground/10 z-10">
              <CDSymbol name="dash" size={16} className="text-foreground/30" />
              <CDSymbol name="crosshair" size={12} className="text-primary" />
              <CDSymbol name="dash" size={16} className="text-foreground/30" />
            </div>
          </SFSection>

          {/* SIGNAL — calc(150*var(--sf-vh)) atmospheric parallax (Phase 32) */}
          <SFSection
            label="SIGNAL"
            bgShift="black"
            id="signal"
            data-section="signal"
            className="py-0 relative h-screen overflow-hidden"
          >
            <SignalSection />
          </SFSection>

          {/* ACQUISITION — terminal instrument panel, ≤calc(50*var(--sf-vh)) (Phase 33) */}
          <SFSection
            label="ACQUISITION"
            bgShift="black"
            id="acquisition"
            data-section="acquisition"
            className="py-0 sf-circuit relative h-screen overflow-hidden justify-center"
          >
            <AcquisitionSection />
          </SFSection>
        </div>
      </main>
      <Footer />
    </>
  );
}
