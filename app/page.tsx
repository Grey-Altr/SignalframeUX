import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { SFPanel, SFSection } from "@/components/sf";
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
