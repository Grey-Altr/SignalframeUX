import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { SFSection, CDSymbol } from "@/components/sf";
import { BUILDS } from "@/app/builds/builds-data";
import { BuildSigilDiagram } from "@/components/animation/build-sigil-diagram";

export const metadata: Metadata = {
  title: "Builds — SIGNALFRAME//UX",
  description:
    "Community buildboard for conceptual SignalframeUX experiments and mods across culture-adjacent subjects.",
};

export default function BuildsPage() {
  return (
    <>
      <Nav />
      <main
        id="main-content"
        data-cursor
        data-section="builds"
        data-section-label="BLD"
        data-primary
        className="mt-[var(--nav-height)]"
      >
        <Breadcrumb segments={[{ label: "BUILDS" }]} />

        <SFSection label="BUILDS" className="py-0 relative h-screen flex flex-col justify-end overflow-hidden">
          <header
            data-nav-reveal-trigger
            className="grid grid-cols-1 md:grid-cols-[1fr_auto] border-b-4 border-foreground items-end"
          >
            <div className="px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] pt-[var(--sfx-space-12)] pb-[var(--sfx-space-6)]">
              <div className="font-mono text-[var(--text-xs)] uppercase tracking-[0.2em] text-muted-foreground mb-[var(--sfx-space-4)]">
                [BUILD//INDEX]
              </div>
              <h1
                aria-label="Builds"
                className="sf-display leading-[0.9] uppercase tracking-[-0.02em]"
                style={{ fontSize: "clamp(80px, 12vw, 160px)" }}
              >
                <span data-anim="page-heading" suppressHydrationWarning>BUILD</span>
                <br />
                <span data-anim="page-heading" suppressHydrationWarning>BOARD</span>
              </h1>
            </div>
            <div className="px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] pb-[var(--sfx-space-6)] text-left md:text-right font-mono text-[var(--text-xs)] uppercase tracking-[0.15em] text-muted-foreground">
              6 CONCEPTUAL BUILDS
              <br />
              FRAME + SIGNAL IN PRACTICE
            </div>
          </header>
        </SFSection>

        <SFSection label="CALL" className="py-[var(--sfx-space-12)] border-b-2 border-foreground/20">
          <div className="px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-[var(--sfx-space-8)] items-start">
            <div>
              <p className="font-mono text-[var(--text-xs)] uppercase tracking-[0.2em] text-muted-foreground">
                [OPEN CALL]
              </p>
              <h2 className="sf-display uppercase mt-[var(--sfx-space-3)]" style={{ fontSize: "var(--text-2xl)", lineHeight: 1 }}>
                SHARE YOUR SFUX BUILD
              </h2>
              <p className="mt-[var(--sfx-space-4)] max-w-[72ch] font-mono text-[var(--text-sm)] uppercase tracking-[0.04em] text-muted-foreground leading-relaxed">
                Send a concept, a working prototype, a theme pack, or a strange utility mod. If it keeps FRAME readable and
                pushes SIGNAL with intent, it belongs here.
              </p>
            </div>
            <Link
              href="mailto:hello@culturedivision.com?subject=SFUX%20BUILD%20SUBMISSION"
              className="inline-flex items-center gap-[var(--sfx-space-3)] border-2 border-foreground bg-foreground text-background px-[var(--sfx-space-4)] py-[var(--sfx-space-3)] font-mono text-[var(--text-xs)] uppercase tracking-[0.15em] no-underline transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <CDSymbol name="crosshair" size={12} />
              SUBMIT BUILD
            </Link>
          </div>
        </SFSection>

        <SFSection label="DIAGRAM" className="py-0 border-b-2 border-foreground/20">
          <div className="px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] py-[var(--sfx-space-6)]">
            <BuildSigilDiagram
              className="h-[180px]"
              seed="BUILD-INDEX-MORPH"
              words={["BUILDS", "FRAME", "SIGNAL", "SIGIL", "INDEX", "CULTURE"]}
              mode="decorative"
            />
          </div>
        </SFSection>

        <SFSection label="SHOWCASE" className="py-[var(--sfx-space-12)]">
          <div className="px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] grid grid-cols-1 lg:grid-cols-2 gap-[var(--sfx-space-6)]">
            {BUILDS.map((build) => (
              <article
                key={build.code}
                className={`border-2 border-foreground p-[var(--sfx-space-6)] ${build.toneClass}`}
              >
                <div className="flex items-center justify-between gap-[var(--sfx-space-3)] border-b border-foreground/20 pb-[var(--sfx-space-3)]">
                  <span className="font-mono text-[var(--text-xs)] uppercase tracking-[0.15em] text-muted-foreground">
                    {build.code}
                  </span>
                  <span className="font-mono text-[var(--text-2xs)] uppercase tracking-[0.15em] text-primary">
                    {build.status}
                  </span>
                </div>

                <h3 className="sf-display uppercase mt-[var(--sfx-space-5)] leading-none" style={{ fontSize: "var(--text-xl)" }}>
                  {build.title}
                </h3>

                <p className="mt-[var(--sfx-space-3)] font-mono text-[var(--text-xs)] uppercase tracking-[0.12em] text-muted-foreground">
                  {build.subject}
                </p>

                <p className="mt-[var(--sfx-space-4)] text-[var(--text-sm)] leading-relaxed text-foreground">
                  {build.concept}
                </p>

                <div className="mt-[var(--sfx-space-5)] grid gap-[var(--sfx-space-3)] text-[var(--text-sm)]">
                  <p className="text-muted-foreground">
                    <span className="font-mono uppercase tracking-[0.12em] text-foreground">FRAME:</span> {build.frameUse}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-mono uppercase tracking-[0.12em] text-foreground">SIGNAL:</span> {build.signalUse}
                  </p>
                </div>
                <div className="mt-[var(--sfx-space-5)]">
                  <Link
                    href={`/builds/${build.slug}`}
                    className="inline-flex items-center gap-[var(--sfx-space-2)] border border-foreground px-[var(--sfx-space-3)] py-[var(--sfx-space-2)] font-mono text-[var(--text-2xs)] uppercase tracking-[0.15em] no-underline hover:bg-foreground hover:text-background transition-colors"
                  >
                    VIEW BUILD
                    <CDSymbol name="dash" size={12} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </SFSection>
      </main>
      <Footer />
    </>
  );
}
