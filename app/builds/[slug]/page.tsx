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

  const monoFont = { fontFamily: "var(--font-ibm-plex-mono), monospace" };
  const proseFont = { fontFamily: "var(--font-space-grotesk), sans-serif" };

  return (
    <DossierChrome route="diagrams2" substrate="paper-warm">
      <div className={`${ibmPlexMono.variable} ${ibmPlexSansCondensed.variable}`}>
        <main
          className="min-h-screen px-6 md:px-16 py-24 md:py-32"
          style={{ color: "oklch(0.25 0.18 28)" }}
        >
          <div className="text-[11px] uppercase tracking-[0.2em] opacity-70 mb-4" style={monoFont}>
            {build.code} · {build.registerLabel}
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
          <div className="mt-6 text-[12px] uppercase tracking-[0.15em] opacity-70" style={monoFont}>
            {build.subject} · status: {build.status}
          </div>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-10 md:gap-16 items-start">
            <div className="max-w-[60ch] space-y-6 text-[15px] leading-[1.7]" style={proseFont}>
              <p className="text-[17px] leading-[1.55]">{build.mission}</p>
              <p>{build.concept}</p>
              <p><strong>FRAME:</strong> {build.frameUse}</p>
              <p><strong>SIGNAL:</strong> {build.signalUse}</p>
            </div>

            <div className="space-y-10 max-w-[52ch]">
              <Spec heading={build.frameHeading} items={build.frameStack} />
              <Spec heading={build.signalHeading} items={build.signalStack} />
              <Spec heading={build.interactionHeading} items={build.interactionModel} ordered />
              <Spec heading={build.outputLabel} items={[build.output]} />
              <Spec heading="OPERATOR NOTE" items={[build.operatorNote]} italic />
            </div>
          </div>

          <div className="mt-20 text-[11px] uppercase tracking-[0.2em] opacity-60" style={monoFont}>
            <Link href="/builds" style={{ color: "currentColor" }}>← back to schematic</Link>
          </div>
        </main>
      </div>
    </DossierChrome>
  );
}

function Spec({
  heading,
  items,
  ordered = false,
  italic = false,
}: {
  heading: string;
  items: string[];
  ordered?: boolean;
  italic?: boolean;
}) {
  const monoFont = { fontFamily: "var(--font-ibm-plex-mono), monospace" };
  const proseFont = { fontFamily: "var(--font-space-grotesk), sans-serif" };
  const ListTag = ordered ? "ol" : "ul";

  return (
    <section className="border-t pt-5" style={{ borderColor: "currentColor", borderTopWidth: 1, opacity: 1 }}>
      <h2
        className="text-[11px] uppercase tracking-[0.2em] mb-4 opacity-80"
        style={monoFont}
      >
        {heading}
      </h2>
      <ListTag className="space-y-2 text-[14px] leading-[1.6]" style={proseFont}>
        {items.map((item, i) => (
          <li key={i} className="flex gap-3">
            <span className="opacity-50 select-none shrink-0" style={monoFont}>
              {ordered ? String(i + 1).padStart(2, "0") : "—"}
            </span>
            <span className={italic ? "italic" : ""}>{item}</span>
          </li>
        ))}
      </ListTag>
    </section>
  );
}
