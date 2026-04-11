import type { Metadata } from "next";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { SFSection } from "@/components/sf";
import { EntrySection } from "@/components/blocks/entry-section";
import { ProofSection } from "@/components/blocks/proof-section";
import { ThesisSection } from "@/components/blocks/thesis-section";
import { SignalSection } from "@/components/blocks/signal-section";
import { InventorySection } from "@/components/blocks/inventory-section";
import { AcquisitionSection } from "@/components/blocks/acquisition-section";
import { GhostLabel } from "@/components/animation/ghost-label";
import { NavRevealMount } from "@/components/layout/nav-reveal-mount";

export const metadata: Metadata = {
  title: "SIGNALFRAME//UX — Deterministic Interface. Generative Expression.",
  description:
    "A dual-layer design system with 48 SF components. Signal layer for generative expression, Frame layer for deterministic structure.",
};

export default function HomePage() {
  return (
    <>
      <Nav />
      <main id="main-content">
        <NavRevealMount targetSelector="[data-entry-section]" />
        <div id="bg-shift-wrapper">
          {/* ENTRY — full-viewport GLSL hero with title overlay */}
          <SFSection
            label="ENTRY"
            bgShift="black"
            id="entry"
            data-section="entry"
            className="py-0 relative"
          >
            <EntrySection />
          </SFSection>

          {/* THESIS — 200-300vh pinned manifesto (Phase 31) */}
          <SFSection
            label="THESIS"
            bgShift="white"
            id="thesis"
            data-section="thesis"
            className="py-0 relative overflow-hidden"
          >
            <GhostLabel
              text="THESIS"
              className="-left-[3vw] top-1/2 -translate-y-1/2 text-foreground/[0.04]"
            />
            <ThesisSection />
          </SFSection>

          {/* PROOF — interactive SIGNAL/FRAME layer demo (Phase 32) */}
          <SFSection
            label="PROOF"
            bgShift="black"
            id="proof"
            data-section="proof"
            className="py-0"
          >
            <ProofSection />
          </SFSection>

          {/* INVENTORY — 12-item catalog table with fixed overlay ComponentDetail (Phase 33) */}
          <SFSection
            label="INVENTORY"
            bgShift="white"
            id="inventory"
            data-section="inventory"
            className="py-0"
          >
            <InventorySection />
          </SFSection>

          {/* SIGNAL — 150vh atmospheric parallax (Phase 32) */}
          <SFSection
            label="SIGNAL"
            bgShift="black"
            id="signal"
            data-section="signal"
            className="py-0"
          >
            <SignalSection />
          </SFSection>

          {/* ACQUISITION — terminal instrument panel, ≤50vh (Phase 33) */}
          <SFSection
            label="ACQUISITION"
            bgShift="black"
            id="acquisition"
            data-section="acquisition"
            className="py-0"
          >
            <AcquisitionSection />
          </SFSection>
        </div>
      </main>
      <Footer />
    </>
  );
}
