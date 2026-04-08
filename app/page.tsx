import type { Metadata } from "next";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { SFSection } from "@/components/sf";
import { SectionIndicator } from "@/components/layout/section-indicator";
import { EntrySection } from "@/components/blocks/entry-section";
import { ThesisSection } from "@/components/blocks/thesis-section";

export const metadata: Metadata = {
  title: "SIGNALFRAME//UX — Deterministic Interface. Generative Expression.",
  description:
    "A dual-layer design system with 28 SF components and growing. Signal layer for generative expression, Frame layer for deterministic structure.",
};

export default function HomePage() {
  return (
    <>
      <Nav />
      <main id="main-content">
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
            className="py-0"
          >
            <ThesisSection />
          </SFSection>

          {/* PROOF — 100vh stub (Phase 32 fills) */}
          <SFSection
            label="PROOF"
            bgShift="black"
            id="proof"
            data-section="proof"
            className="py-0 min-h-screen flex items-center justify-center"
          >
            <h2 className="font-mono text-sm text-muted-foreground uppercase tracking-widest">
              PROOF
            </h2>
          </SFSection>

          {/* INVENTORY — 100vh stub (Phase 33 fills) */}
          <SFSection
            label="INVENTORY"
            bgShift="white"
            id="inventory"
            data-section="inventory"
            className="py-0 min-h-screen flex items-center justify-center"
          >
            <h2 className="font-mono text-sm text-muted-foreground uppercase tracking-widest">
              INVENTORY
            </h2>
          </SFSection>

          {/* SIGNAL — 100vh stub (Phase 32 fills) */}
          <SFSection
            label="SIGNAL"
            bgShift="black"
            id="signal"
            data-section="signal"
            className="py-0 min-h-screen flex items-center justify-center"
          >
            <h2 className="font-mono text-sm text-muted-foreground uppercase tracking-widest">
              SIGNAL
            </h2>
          </SFSection>

          {/* ACQUISITION — 100vh stub (Phase 33 fills) */}
          <SFSection
            label="ACQUISITION"
            bgShift="white"
            id="acquisition"
            data-section="acquisition"
            className="py-0 min-h-screen flex items-center justify-center"
          >
            <h2 className="font-mono text-sm text-muted-foreground uppercase tracking-widest">
              ACQUISITION
            </h2>
          </SFSection>
        </div>
        <SectionIndicator />
      </main>
      <Footer />
    </>
  );
}
