import type { Metadata } from "next";
import { Syne } from "next/font/google";
import Link from "next/link";
import { DossierChrome, PointcloudRing } from "@/components/dossier";
import { cn } from "@/lib/utils";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SF//KLO-00 — KLOROFORM plate",
  description: "Dossier plate 01. Generative pointcloud morphology.",
};

const TILES = [
  { code: "SF//HUD-00", label: "CYBER2K", href: "/system", glyph: "⬡" },
  { code: "SF//MRK-00", label: "BRANDO", href: "/reference", glyph: "◉" },
  { code: "SF//E00-00", label: "BLACK-F", href: "/inventory", glyph: "≋" },
  { code: "SF//DGM-00", label: "DIAGRAM", href: "/builds", glyph: "⊹" },
  { code: "SF//HLG-00", label: "HELGHAN", href: "/init", glyph: "▮" },
  { code: "SF//KLO-00", label: "KLOROFRM", href: "/", glyph: "○" },
] as const;

export default function Page() {
  return (
    <DossierChrome route="kloroform" substrate="black">
      <div className={syne.variable}>
        {/* Pointcloud layer — sibling of <main>, paints behind it */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="aspect-square w-[min(90vw,90vh)]">
            <PointcloudRing count={2400} radius={0.42} />
          </div>
        </div>

        <main className="relative min-h-screen overflow-hidden">
          {/* Content layer — centered column */}
          <div className="relative z-10 flex min-h-screen items-center justify-center px-6 md:px-12">
            <div className="w-full max-w-[1200px] text-center">
              <h1
                data-plate="kloroform-hero"
                className={cn(
                  "uppercase leading-[0.85] tracking-[-0.04em]",
                  "font-[var(--font-jetbrains)]",
                )}
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontWeight: 800,
                  fontSize: "clamp(26px, 7vw, 104px)",
                }}
              >
                SIGNALFRAME
                <span
                  style={{
                    opacity: 0.5,
                    letterSpacing: "-0.2em",
                    fontSize: "1.3em",
                  }}
                >
                  {"//"}
                </span>
                UX
              </h1>

              <p
                className="mx-auto mt-8 max-w-[60ch] text-[13px] leading-[1.6] opacity-70 md:text-[14px]"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              >
                Six plates from one reference dossier. Every plate quotes a
                specific pack from the cdB corpus — KLOROFORM, Cyber2k, Brando
                Corp 250, Black Flag E0000, Diagrams2, Helghanese. One accent,
                one substrate, one grammar per plate.
              </p>

              <nav
                aria-label="Plate previews"
                className="mx-auto mt-16 grid max-w-[75%] grid-cols-3 gap-3 md:grid-cols-6"
              >
                {TILES.map((t) => (
                  <Link
                    key={t.code}
                    href={t.href}
                    data-plate="kloroform-tile"
                    className={cn(
                      "group border px-4 py-1 text-left no-underline transition-colors",
                      "border-[color:oklch(0_0_0_/_0.2)]",
                      "hover:border-[color:oklch(0_0_0_/_0.6)]",
                    )}
                    style={{
                      fontFamily: "var(--font-jetbrains), monospace",
                      background: "var(--sfx-yellow, oklch(0.91 0.18 98))",
                      color: "oklch(0.15 0 0)",
                      clipPath:
                        "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)",
                    }}
                  >
                    <div
                      className="mb-2 text-[20px] leading-none"
                      style={{ color: "oklch(0.15 0 0)" }}
                    >
                      {t.glyph}
                    </div>
                    <div
                      className="text-[9px] uppercase tracking-[0.15em]"
                      style={{ color: "oklch(0.4 0 0)" }}
                    >
                      {t.code}
                    </div>
                    <div
                      className="mt-1 text-[11px] uppercase tracking-[0.1em]"
                      style={{ color: "oklch(0.2 0 0)" }}
                    >
                      {t.label}
                    </div>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </main>
      </div>
    </DossierChrome>
  );
}
