import type { Metadata } from "next";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { ComponentsExplorer } from "@/components/blocks/components-explorer";

export const metadata: Metadata = {
  title: "Components — SIGNALFRAME//UX",
  description: "Browse 340+ Signal and Frame components with live previews, filtering, and code examples.",
};

export default function ComponentsPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="mt-[var(--nav-height)]">
        {/* ── Page Header: COMP\nONENTS + 340 stat ── */}
        <header className="grid grid-cols-[1fr_auto] items-end border-b-4 border-foreground">
          <h1
            className="leading-[0.9] uppercase tracking-[-0.02em] px-6 md:px-12 pt-10 pb-6 sf-display"
            style={{ fontSize: "clamp(60px, 9vw, 120px)" }}
          >
            COMP
            <br />
            ONENTS
          </h1>
          <div className="px-6 md:px-12 pb-6 text-right">
            <strong
              className="block text-primary sf-display"
              style={{ fontSize: "clamp(28px, 4vw, 48px)", lineHeight: 1 }}
            >
              340
            </strong>
            <span className="text-muted-foreground text-[11px] uppercase tracking-[0.15em] leading-snug block mt-1">
              FRAME + SIGNAL PRIMITIVES
              <br />
              FOR EVERY SURFACE
            </span>
          </div>
        </header>

        <ComponentsExplorer />
      </main>
      <Footer />
    </>
  );
}
