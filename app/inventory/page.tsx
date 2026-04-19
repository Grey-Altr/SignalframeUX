import type { Metadata } from "next";
import { Anton } from "next/font/google";
import { DossierChrome, HalftoneCorrugated } from "@/components/dossier";
import { COMPONENT_REGISTRY } from "@/lib/component-registry";

const anton = Anton({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-anton",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SF//E00-00 — Black Flag inventory plate",
  description: "Dossier plate 04. Serialized component catalog as E0000 sheet.",
};

function pad(n: number) {
  return String(n).padStart(3, "0");
}

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

          {/* Bottom: serialized catalog grid */}
          <section className="p-6 md:p-12">
            <div
              className="mb-8 text-[11px] uppercase tracking-[0.2em] opacity-60"
              style={{ fontFamily: "var(--font-jetbrains), monospace" }}
            >
              {entries.length} SERIALIZED COMPONENTS · E0000 SHEET
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 border-t border-l border-white/20">
              {entries.map((e) => (
                <li
                  key={e.key}
                  data-plate="blackflag-entry"
                  className="border-r border-b border-white/20 p-4 md:p-5"
                >
                  <div
                    data-plate="blackflag-code"
                    className="text-[10px] uppercase tracking-[0.18em] opacity-50"
                    style={{ fontFamily: "var(--font-jetbrains), monospace" }}
                  >
                    SF//E00-{pad(e.idx)}
                  </div>
                  <div
                    className="uppercase leading-[0.95] mt-2"
                    style={{
                      fontFamily: "var(--font-anton), sans-serif",
                      fontSize: "clamp(20px, 3vw, 36px)",
                    }}
                  >
                    {e.value?.name ?? e.key}
                  </div>
                  <div
                    className="text-[11px] mt-2 opacity-60 leading-[1.5]"
                    style={{ fontFamily: "var(--font-jetbrains), monospace" }}
                  >
                    {e.value?.importPath ?? "—"}
                  </div>
                  <div
                    className="text-[9px] uppercase tracking-[0.15em] opacity-40 mt-3"
                    style={{ fontFamily: "var(--font-jetbrains), monospace" }}
                  >
                    {e.value?.category ?? "—"}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>
    </DossierChrome>
  );
}
