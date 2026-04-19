import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IBM_Plex_Mono, IBM_Plex_Sans_Condensed } from "next/font/google";
import { DossierChrome } from "@/components/dossier";
import { BUILDS } from "@/app/builds/builds-data";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});
const ibmPlexSansCondensed = IBM_Plex_Sans_Condensed({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-ibm-plex-sans-condensed",
  display: "swap",
});

export async function generateStaticParams() {
  return BUILDS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const build = BUILDS.find((b) => b.slug === slug);
  return {
    title: `${build?.code ?? "SF//DGM"} — ${build?.title ?? "build"}`,
  };
}

export default async function BuildDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const build = BUILDS.find((b) => b.slug === slug);
  if (!build) notFound();

  return (
    <DossierChrome route="diagrams2" substrate="paper-warm">
      <div className={`${ibmPlexMono.variable} ${ibmPlexSansCondensed.variable}`}>
        <main className="min-h-screen px-6 md:px-16 py-24 md:py-32" style={{ color: "oklch(0.25 0.18 28)" }}>
          <div className="text-[11px] uppercase tracking-[0.2em] opacity-70 mb-4"
               style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}>
            {build.code}
          </div>
          <h1
            className="uppercase tracking-[0.01em] leading-[0.95] max-w-[24ch]"
            style={{
              fontFamily: "var(--font-ibm-plex-sans-condensed), sans-serif",
              fontWeight: 600,
              fontSize: "clamp(36px, 6vw, 80px)",
            }}
          >
            {build.title}
          </h1>
          <div className="mt-6 text-[12px] uppercase tracking-[0.15em] opacity-70"
               style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}>
            {build.subject} · status: {build.status}
          </div>

          <div className="mt-16 max-w-[60ch] space-y-6 text-[15px] leading-[1.7]"
               style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            <p>{build.concept}</p>
            <p><strong>FRAME:</strong> {build.frameUse}</p>
            <p><strong>SIGNAL:</strong> {build.signalUse}</p>
          </div>

          <div className="mt-16 text-[11px] uppercase tracking-[0.2em] opacity-60"
               style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}>
            <Link href="/builds" style={{ color: "currentColor" }}>← back to schematic</Link>
          </div>
        </main>
      </div>
    </DossierChrome>
  );
}
