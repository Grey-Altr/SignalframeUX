import { Nav } from "@/components/layout/nav";
import { Hero } from "@/components/blocks/hero";
import { ManifestoBand } from "@/components/blocks/manifesto-band";
import { DualLayer } from "@/components/blocks/dual-layer";
import { StatsBand } from "@/components/blocks/stats-band";
import { MarqueeBand } from "@/components/blocks/marquee-band";
import { CodeSection } from "@/components/blocks/code-section";
import { ComponentGrid } from "@/components/blocks/component-grid";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ManifestoBand />
        <DualLayer />
        <StatsBand />
        <MarqueeBand />
        <CodeSection />
        <ComponentGrid />
      </main>
      <Footer />
    </>
  );
}
