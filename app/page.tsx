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

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ManifestoBand />
        <CircuitDivider variant="default" />
        <DualLayer />
        <CircuitDivider variant="minimal" />
        <StatsBand />
        <MarqueeBand />
        <CircuitDivider variant="complex" />
        <CodeSection />
        <ComponentGrid />
      </main>
      <Footer />
    </>
  );
}
