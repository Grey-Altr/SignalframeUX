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
        <main className="relative min-h-screen overflow-hidden">
          {/* Pointcloud layer — full bleed, centered */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="aspect-square w-[min(90vw,90vh)]">
              <PointcloudRing count={2400} radius={0.42} />
            </div>
          </div>

          {/* Content layer — centered column */}
          <div className="relative z-10 flex min-h-screen items-center justify-center px-6 md:px-12">
            <div className="w-full max-w-[1200px] text-center">
              <h1
                data-plate="kloroform-hero"
                className={cn(
                  "uppercase italic leading-[0.85] tracking-[-0.04em]",
                  "font-[var(--font-syne)]",
                )}
                style={{
                  fontFamily: "var(--font-syne), sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(44px, 7vw, 104px)",
                }}
              >
                SIGNALFRAME
                <br />
                <span style={{ opacity: 0.5 }}>{"//"}</span>UX
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
                className="mt-16 grid grid-cols-3 gap-3 md:grid-cols-6"
              >
                {TILES.map((t) => (
                  <Link
                    key={t.code}
                    href={t.href}
                    data-plate="kloroform-tile"
                    className={cn(
                      "group border p-4 no-underline transition-colors",
                      "border-[color:oklch(0.95_0_0_/_0.2)]",
                      "hover:border-[color:oklch(0.95_0_0_/_0.6)]",
                    )}
                    style={{ fontFamily: "var(--font-jetbrains), monospace" }}
                  >
                    <div className="mb-3 text-[20px] leading-none opacity-80">
                      {t.glyph}
                    </div>
                    <div className="text-[9px] uppercase tracking-[0.15em] opacity-60">
                      {t.code}
                    </div>
                    <div className="mt-1 text-[11px] uppercase tracking-[0.1em]">
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
