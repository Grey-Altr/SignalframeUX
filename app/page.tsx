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
// GLSL hero shader — SSR-safe Client Component wrapper (mirrors SignalCanvasLazy)
import { GLSLHeroLazy } from "@/components/animation/glsl-hero-lazy";
import { SFSection } from "@/components/sf";

export const metadata: Metadata = {
  title: "SIGNALFRAME//UX — Deterministic Interface. Generative Expression.",
  description: "A dual-layer design system with 28 SF components and growing. Signal layer for generative expression, Frame layer for deterministic structure.",
};

export default function HomePage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="transition-none">
        <div id="bg-shift-wrapper">
          <SFSection label="HERO" data-bg-shift="white" data-section="hero" data-cursor className="py-0 relative">
            <Hero />
            <GLSLHeroLazy />
          </SFSection>
          <SFSection label="MANIFESTO" data-bg-shift="black" data-section="manifesto" data-cursor className="py-0 relative overflow-hidden">
            <GhostLabel text="MANIFEST" className="-left-4 top-1/2 -translate-y-1/2" />
            <ManifestoBand />
          </SFSection>
          <CircuitDivider variant="default" />
          <SFSection label="SIGNAL / FRAME" data-bg-shift="white" data-section="signal" data-cursor className="py-0 relative overflow-hidden">
            <GhostLabel text="SIGNAL" className="right-0 top-0" />
            <DualLayer />
          </SFSection>
          <CircuitDivider variant="minimal" />
          <SFSection label="STATS" data-bg-shift="black" data-section="stats" data-cursor className="py-0"><StatsBand /></SFSection>
          <MarqueeBand />
          <CircuitDivider variant="complex" />
          <SFSection label="API" data-bg-shift="white" data-section="code" data-cursor className="py-0 relative overflow-hidden">
            <GhostLabel text="CODE" className="-left-4 top-1/4" />
            <CodeSection />
          </SFSection>
          <SFSection label="COMPONENTS" data-bg-shift="black" data-section="grid" data-cursor className="py-0 relative overflow-hidden">
            <GhostLabel text="GRID" className="right-0 bottom-0" />
            <ComponentGrid />
          </SFSection>
        </div>
        <SectionIndicator />
      </main>
      <Footer />
    </>
  );
}
