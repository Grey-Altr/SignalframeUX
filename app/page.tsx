import type { Metadata } from "next";
import { Nav } from "@/components/layout/nav";
import { Hero } from "@/components/blocks/hero";
import { ManifestoBand } from "@/components/blocks/manifesto-band";
import { DualLayer } from "@/components/blocks/dual-layer";
import { StatsBand } from "@/components/blocks/stats-band";
import { MarqueeBand } from "@/components/blocks/marquee-band";
import { CodeSection } from "@/components/blocks/code-section";
import { ComponentGrid } from "@/components/blocks/component-grid";
import { Footer } from "@/components/layout/footer";
import { CircuitDivider } from "@/components/animation/circuit-divider";
import { GhostLabel } from "@/components/animation/ghost-label";
import { SectionIndicator } from "@/components/layout/section-indicator";

export const metadata: Metadata = {
  title: "SIGNALFRAME//UX — Deterministic Interface. Generative Expression.",
  description: "A dual-layer design system with 340+ components. Signal layer for clarity, Frame layer for generative depth.",
};

export default function HomePage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="transition-none">
        <div id="bg-shift-wrapper" style={{ transition: "background-color 0.05s step-end" }}>
          <div data-bg-shift="white" data-section="hero" data-section-label="HERO"><Hero /></div>
          <div data-bg-shift="black" data-section="manifesto" data-section-label="MANIFESTO" className="relative overflow-hidden">
            <GhostLabel text="MANIFEST" className="-left-4 top-1/2 -translate-y-1/2" />
            <ManifestoBand />
          </div>
          <CircuitDivider variant="default" />
          <div data-bg-shift="white" data-section="signal" data-section-label="SIGNAL / FRAME" className="relative overflow-hidden">
            <GhostLabel text="SIGNAL" className="right-0 top-0" />
            <DualLayer />
          </div>
          <CircuitDivider variant="minimal" />
          <div data-bg-shift="black" data-section="stats" data-section-label="STATS"><StatsBand /></div>
          <MarqueeBand />
          <CircuitDivider variant="complex" />
          <div data-bg-shift="white" data-section="code" data-section-label="API" className="relative overflow-hidden">
            <GhostLabel text="CODE" className="-left-4 top-1/4" />
            <CodeSection />
          </div>
          <div data-bg-shift="black" data-section="grid" data-section-label="COMPONENTS" className="relative overflow-hidden">
            <GhostLabel text="GRID" className="right-0 bottom-0" />
            <ComponentGrid />
          </div>
        </div>
        <SectionIndicator />
      </main>
      <Footer />
    </>
  );
}
