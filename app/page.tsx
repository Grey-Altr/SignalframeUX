import { Nav } from "@/components/layout/nav";
import { Hero } from "@/components/blocks/hero";
import { ComponentGrid } from "@/components/blocks/component-grid";
import { ManifestoBand } from "@/components/blocks/manifesto-band";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ComponentGrid />
        <ManifestoBand />
      </main>
      <Footer />
    </>
  );
}
