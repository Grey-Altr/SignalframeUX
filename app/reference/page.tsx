import type { Metadata } from "next";
import { Archivo, Archivo_Black } from "next/font/google";
import Link from "next/link";
import { DossierChrome, Y2KMarkGrid } from "@/components/dossier";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-archivo",
  display: "swap",
});
const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-archivo-black",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SF//MRK-00 — Brando Y2K reference plate",
  description: "Dossier plate 03. Catalog of SFUX reference marks.",
};

export default function ReferencePage() {
  return (
    <DossierChrome route="brando" substrate="paper-cream">
      <div className={`${archivo.variable} ${archivoBlack.variable}`}>
        <main className="min-h-screen px-6 md:px-12 py-24 md:py-28">

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_42ch] gap-10 md:gap-16 items-start">
            <h1
              data-plate="brando-hero"
              className="uppercase tracking-[-0.02em] leading-[0.88]"
              style={{
                fontFamily: "var(--font-archivo-black), sans-serif",
                fontSize: "clamp(48px, 11vw, 180px)",
                color: "oklch(0.15 0 0)",
              }}
            >
              API<br/>REFERENCE
            </h1>
            <div
              className="text-[13px] leading-[1.7] max-w-[44ch]"
              style={{ fontFamily: "var(--font-archivo), sans-serif", color: "oklch(0.2 0 0)" }}
            >
              <p>
                SignalframeUX exposes a programmable surface — 54 components, 49 color scales, 9 spacing stops, 12 easings. The marks below catalog the system&apos;s reference vocabulary, Brando-style.
              </p>
              <p className="mt-4">
                Every mark is serialized. Look for <strong>SF//MRK-042</strong> — it is the one you are meant to notice.
              </p>
              <p className="mt-6 text-[11px] uppercase tracking-[0.15em] opacity-70">
                → <Link href="/inventory" style={{ color: "inherit" }}>see component inventory for props and live previews</Link>
              </p>
            </div>
          </div>

          <div className="mt-16 md:mt-20">
            <Y2KMarkGrid count={60} litIndex={42} />
          </div>
        </main>
      </div>
    </DossierChrome>
  );
}
