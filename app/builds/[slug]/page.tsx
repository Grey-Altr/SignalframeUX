import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { SFSection, CDSymbol } from "@/components/sf";
import { BUILDS, getBuildBySlug } from "@/app/builds/builds-data";
import { BuildSigilDiagram } from "@/components/animation/build-sigil-diagram";
import { SFSignalComposerLazy as SFSignalComposer } from "@/components/animation/sf-signal-composer-lazy";
import type { EffectPassName } from "@/components/animation/sf-signal-composer";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type BuildVisual = {
  motif: string;
  frameSymbol: string;
  signalSymbol: string;
  panelTone: string;
  stripTone: string;
  interactionTone: string;
  cadenceLabel: string;
};

const BUILD_VISUALS: Record<string, BuildVisual> = {
  "sonic-pressure-map": {
    motif: "frequency-bar",
    frameSymbol: "grid-cell",
    signalSymbol: "data-burst",
    panelTone: "bg-primary/10 border-primary/40",
    stripTone: "bg-primary/5",
    interactionTone: "bg-primary/5",
    cadenceLabel: "CADENCE: DENSITY DETENT",
  },
  "ritual-poster-engine": {
    motif: "zigzag",
    frameSymbol: "ring",
    signalSymbol: "triangle",
    panelTone: "bg-[var(--sf-yellow)]/10 border-[var(--sf-yellow)]/40",
    stripTone: "bg-[var(--sf-yellow)]/10",
    interactionTone: "bg-[var(--sf-yellow)]/10",
    cadenceLabel: "CADENCE: CAMPAIGN PULSE",
  },
  "operator-wardrobe-skin": {
    motif: "hex",
    frameSymbol: "square",
    signalSymbol: "signal-wave",
    panelTone: "bg-foreground/5 border-foreground/40",
    stripTone: "bg-foreground/5",
    interactionTone: "bg-foreground/5",
    cadenceLabel: "CADENCE: PERSONA SHIFT",
  },
  "caption-interceptor": {
    motif: "caret",
    frameSymbol: "line-h",
    signalSymbol: "zigzag",
    panelTone: "bg-accent/10 border-accent/40",
    stripTone: "bg-accent/10",
    interactionTone: "bg-accent/10",
    cadenceLabel: "CADENCE: SPEAKER HANDOFF",
  },
  "archive-heatwave": {
    motif: "diamond",
    frameSymbol: "chevron",
    signalSymbol: "pulse",
    panelTone: "bg-secondary/20 border-secondary/50",
    stripTone: "bg-secondary/20",
    interactionTone: "bg-secondary/20",
    cadenceLabel: "CADENCE: LINEAGE RECALL",
  },
  "night-shift-wayfinder": {
    motif: "arrow-right",
    frameSymbol: "plus",
    signalSymbol: "signal-wave",
    panelTone: "bg-background border-primary/40",
    stripTone: "bg-primary/5",
    interactionTone: "bg-primary/5",
    cadenceLabel: "CADENCE: ROUTE DELTA",
  },
};

const BUILD_EFFECTS: Record<string, { passes: EffectPassName[]; intensity: number }> = {
  "sonic-pressure-map": { passes: ["feedback", "bloom", "glitch"], intensity: 0.7 },
  "ritual-poster-engine": { passes: ["displace", "bloom"], intensity: 0.6 },
  "operator-wardrobe-skin": { passes: ["particle", "feedback"], intensity: 0.5 },
  "caption-interceptor": { passes: ["glitch", "displace"], intensity: 0.65 },
  "archive-heatwave": { passes: ["feedback", "displace", "bloom"], intensity: 0.55 },
  "night-shift-wayfinder": { passes: ["particle", "bloom", "glitch"], intensity: 0.6 },
};

export async function generateStaticParams() {
  return BUILDS.map((build) => ({ slug: build.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const build = getBuildBySlug(slug);
  if (!build) {
    return {
      title: "Build Not Found — SIGNALFRAME//UX",
    };
  }
  return {
    title: `${build.title} — BUILDS — SIGNALFRAME//UX`,
    description: build.concept,
  };
}

export default async function BuildDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const build = getBuildBySlug(slug);
  if (!build) notFound();
  const visual = BUILD_VISUALS[build.slug];
  const effects = BUILD_EFFECTS[build.slug] ?? { passes: ["displace"] as EffectPassName[], intensity: 0.4 };
  const buildIndex = BUILDS.findIndex((item) => item.slug === build.slug);
  const signalFirst = buildIndex % 2 === 1;
  const diagramWords = [
    build.code,
    ...build.subject.split(" ").slice(0, 3),
    ...build.title.split(" ").slice(0, 2),
    "SIGIL",
    "FRAME",
    "SIGNAL",
  ];

  return (
    <>
      <Nav />
      <main
        id="main-content"
        data-cursor
        data-section="build-detail"
        data-section-label={build.code}
        data-primary
        className="mt-[var(--nav-height)]"
      >
        <Breadcrumb
          segments={[
            { label: "BUILDS", href: "/builds" },
            { label: build.code },
          ]}
        />

        <SFSection label={build.code} className="py-0 relative h-screen flex flex-col justify-end overflow-hidden">
          <SFSignalComposer
            passes={effects.passes}
            intensity={effects.intensity}
            preserveLegibility
          />
          <header
            data-nav-reveal-trigger
            className="grid grid-cols-1 md:grid-cols-[1fr_auto] border-b-4 border-foreground items-end"
          >
            <div className="px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] pt-[var(--sfx-space-12)] pb-[var(--sfx-space-6)]">
              <div className="font-mono text-[var(--text-xs)] uppercase tracking-[0.2em] text-muted-foreground mb-[var(--sfx-space-4)]">
                {`[${build.code}::${build.subject}]`}
              </div>
              <h1
                aria-label={build.title}
                className="sf-display leading-[0.9] uppercase tracking-[-0.02em]"
                style={{ fontSize: "clamp(56px, 9vw, 132px)" }}
              >
                {build.title}
              </h1>
            </div>
            <div className="px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] pb-[var(--sfx-space-6)] text-left md:text-right font-mono text-[var(--text-xs)] uppercase tracking-[0.15em] text-muted-foreground">
              {build.status}
              <p className="mt-[var(--sfx-space-3)] max-w-[42ch] md:ml-auto text-[var(--text-2xs)] tracking-[0.08em] normal-case leading-relaxed">
                {build.operatorNote}
              </p>
            </div>
          </header>
          <div className={`border-b border-foreground/20 ${visual.stripTone}`}>
            <div className="px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] py-[var(--sfx-space-3)] flex items-center justify-between gap-[var(--sfx-space-3)]">
              <div className="flex items-center gap-[var(--sfx-space-2)] text-primary">
                <CDSymbol name={visual.motif} size={14} />
                <CDSymbol name={visual.frameSymbol} size={12} />
                <CDSymbol name={visual.signalSymbol} size={14} />
              </div>
              <p className="font-mono text-[var(--text-2xs)] uppercase tracking-[0.15em] text-muted-foreground">
                {visual.cadenceLabel}
              </p>
            </div>
          </div>
        </SFSection>

        <SFSection label="OVERVIEW" className="py-[var(--sfx-space-12)] border-b-2 border-foreground/20">
          <div className="px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-[var(--sfx-space-8)]">
            <div>
              <h2 className="sf-display uppercase" style={{ fontSize: "var(--text-2xl)", lineHeight: 1 }}>
                CONCEPT
              </h2>
              <p className="mt-[var(--sfx-space-4)] text-[var(--text-base)] leading-relaxed max-w-[70ch]">
                {build.concept}
              </p>
              <p className="mt-[var(--sfx-space-4)] font-mono text-[var(--text-sm)] uppercase tracking-[0.06em] text-muted-foreground">
                Mission: {build.mission}
              </p>
              <BuildSigilDiagram
                className="mt-[var(--sfx-space-6)] h-[240px]"
                seed={`${build.code}-${build.slug}`}
                words={diagramWords}
                mode="poignant"
              />
            </div>

            <div className={`border-2 border-foreground p-[var(--sfx-space-6)] ${build.toneClass}`}>
              <div className="font-mono text-[var(--text-xs)] uppercase tracking-[0.15em] text-muted-foreground">
                {build.registerLabel}
              </div>
              <div className="mt-[var(--sfx-space-5)] grid gap-[var(--sfx-space-3)] text-[var(--text-sm)]">
                <p className="text-muted-foreground">
                  <span className="font-mono uppercase tracking-[0.12em] text-foreground">FRAME:</span> {build.frameUse}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-mono uppercase tracking-[0.12em] text-foreground">SIGNAL:</span> {build.signalUse}
                </p>
              </div>
              <div className="mt-[var(--sfx-space-5)] flex items-center gap-[var(--sfx-space-2)] text-primary">
                <CDSymbol name={visual.frameSymbol} size={12} />
                <CDSymbol name="dash" size={12} className="text-foreground/40" />
                <CDSymbol name={visual.signalSymbol} size={12} />
              </div>
            </div>
          </div>
        </SFSection>

        <SFSection label="SYSTEM" className="py-[var(--sfx-space-12)] border-b-2 border-foreground/20">
          <div className="px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] grid grid-cols-1 lg:grid-cols-2 gap-[var(--sfx-space-6)]">
            <article className={`border-2 border-foreground p-[var(--sfx-space-6)] ${signalFirst ? "lg:order-2" : ""}`}>
              <h3 className="sf-display uppercase" style={{ fontSize: "var(--text-xl)", lineHeight: 1 }}>
                {build.frameHeading}
              </h3>
              <ul className="mt-[var(--sfx-space-5)] grid gap-[var(--sfx-space-3)]">
                {build.frameStack.map((item) => (
                  <li key={item} className="flex items-start gap-[var(--sfx-space-2)] text-muted-foreground">
                    <CDSymbol name={visual.frameSymbol} size={10} className="text-primary mt-[6px]" />
                    <span className="text-[var(--text-sm)] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className={`border-2 border-foreground p-[var(--sfx-space-6)] ${visual.panelTone} ${signalFirst ? "lg:order-1" : ""}`}>
              <h3 className="sf-display uppercase" style={{ fontSize: "var(--text-xl)", lineHeight: 1 }}>
                {build.signalHeading}
              </h3>
              <ul className="mt-[var(--sfx-space-5)] grid gap-[var(--sfx-space-3)]">
                {build.signalStack.map((item) => (
                  <li key={item} className="flex items-start gap-[var(--sfx-space-2)] text-muted-foreground">
                    <CDSymbol name={visual.signalSymbol} size={12} className="text-primary mt-[5px]" />
                    <span className="text-[var(--text-sm)] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </SFSection>

        <SFSection label="FLOW" className="py-[var(--sfx-space-12)]">
          <div className="px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)]">
            <h3 className="sf-display uppercase" style={{ fontSize: "var(--text-2xl)", lineHeight: 1 }}>
              {build.interactionHeading}
            </h3>
            <div className="mt-[var(--sfx-space-6)] grid grid-cols-1 lg:grid-cols-3 gap-[var(--sfx-space-4)]">
              {build.interactionModel.map((step, idx) => (
                <article key={step} className={`border-2 border-foreground p-[var(--sfx-space-5)] ${idx === 1 ? visual.interactionTone : ""}`}>
                  <p className="font-mono text-[var(--text-xs)] uppercase tracking-[0.15em] text-muted-foreground">
                    STEP {idx + 1}
                  </p>
                  <p className="mt-[var(--sfx-space-3)] text-[var(--text-sm)] leading-relaxed text-foreground">
                    {step}
                  </p>
                  <div className="mt-[var(--sfx-space-3)] text-primary">
                    <CDSymbol name={idx % 2 === 0 ? visual.frameSymbol : visual.signalSymbol} size={10} />
                  </div>
                </article>
              ))}
            </div>

            <BuildSigilDiagram
              className="mt-[var(--sfx-space-6)] h-[140px]"
              seed={`${build.slug}-aux`}
              words={diagramWords.slice().reverse()}
              mode="decorative"
            />

            <div className="mt-[var(--sfx-space-8)] border-t border-foreground/20 pt-[var(--sfx-space-5)] flex flex-col md:flex-row md:items-center md:justify-between gap-[var(--sfx-space-4)]">
              <p className="font-mono text-[var(--text-xs)] uppercase tracking-[0.15em] text-muted-foreground">
                {build.outputLabel}: {build.output}
              </p>
              <Link
                href="/builds"
                className="inline-flex items-center gap-[var(--sfx-space-2)] border border-foreground px-[var(--sfx-space-3)] py-[var(--sfx-space-2)] font-mono text-[var(--text-2xs)] uppercase tracking-[0.15em] no-underline hover:bg-foreground hover:text-background transition-colors"
              >
                BACK TO BUILDS
                <CDSymbol name="dash" size={12} />
              </Link>
            </div>
          </div>
        </SFSection>
      </main>
      <Footer />
    </>
  );
}
