import type { Metadata } from "next";
import { Anton } from "next/font/google";
import { DossierChrome, HalftoneCorrugated } from "@/components/dossier";
import { BlackflagCatalogDeferred } from "@/components/dossier/blackflag-catalog-deferred";
import { COMPONENT_REGISTRY } from "@/lib/component-registry";

const anton = Anton({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-anton",
  // LCP-critical: 220px hero "INVE/NTORY" + 36px card titles. display:
  // "optional" prevents font-swap from re-triggering LCP measurement.
  display: "optional",
});

export const metadata: Metadata = {
  title: "SF//E00-00 — Black Flag inventory plate",
  description: "Dossier plate 04. Serialized component catalog as E0000 sheet.",
};

export default function InventoryPage() {
  const entries = Object.entries(COMPONENT_REGISTRY).map(([key, value], i) => ({
    idx: i + 1,
    key,
    value,
  }));

  return (
    <DossierChrome route="blackflag" substrate="black">
      <div className={anton.variable}>
        <main className="min-h-screen">
          {/* Top: halftone wave */}
          <section className="relative h-[50vh] md:h-[60vh] overflow-hidden border-b border-white/20">
            <HalftoneCorrugated className="absolute inset-0" />
            <div className="absolute inset-0 flex items-end p-6 md:p-12">
              <h1
                data-plate="blackflag-hero"
                className="uppercase leading-[0.85] tracking-[-0.02em]"
                style={{
                  fontFamily: "var(--font-anton), sans-serif",
                  fontSize: "clamp(56px, 14vw, 220px)",
                }}
              >
                INVE<br/>NTORY
              </h1>
            </div>
          </section>

          {/* Bottom: serialized catalog grid (deferred) */}
          <BlackflagCatalogDeferred entries={entries} />
        </main>
      </div>
    </DossierChrome>
  );
}
