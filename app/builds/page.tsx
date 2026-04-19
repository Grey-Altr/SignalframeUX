import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans_Condensed } from "next/font/google";
import { DossierChrome, BuildSchematic, type SchematicNode } from "@/components/dossier";
import { BUILDS } from "@/app/builds/builds-data";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

const ibmPlexSansCondensed = IBM_Plex_Sans_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-sans-condensed",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SF//DGM-00 — Diagrams2 build schematic",
  description: "Dossier plate 05. Conceptual SFUX builds rendered as a circuit diagram.",
};

const KINDS: SchematicNode["kind"][] = [
  "transformer", "relay", "cathode", "plate", "transformer", "relay",
];

export default function BuildsPage() {
  const nodes: SchematicNode[] = BUILDS.map((b, i) => ({
    slug: b.slug,
    code: b.code,
    label: b.title,
    subject: b.subject,
    kind: KINDS[i % KINDS.length],
  }));

  return (
    <DossierChrome route="diagrams2" substrate="paper-warm">
      <div className={`${ibmPlexMono.variable} ${ibmPlexSansCondensed.variable}`}>
        <main className="min-h-screen px-6 md:px-16 py-24 md:py-32">
          <h1
            data-plate="diagrams2-title"
            className="uppercase tracking-[0.01em] leading-[0.95] mb-12"
            style={{
              fontFamily: "var(--font-ibm-plex-sans-condensed), sans-serif",
              fontWeight: 600,
              fontSize: "clamp(36px, 7vw, 96px)",
              color: "oklch(0.25 0.18 28)",
            }}
          >
            SIGNALFRAME//UX<br/>BUILD SCHEMATIC
          </h1>

          <div className="text-[11px] uppercase tracking-[0.2em] mb-10 opacity-70" style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}>
            {BUILDS.length} conceptual builds · frame + signal in practice
          </div>

          <BuildSchematic nodes={nodes} />
        </main>
      </div>
    </DossierChrome>
  );
}
