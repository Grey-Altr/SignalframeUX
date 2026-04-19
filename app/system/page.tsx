import type { Metadata } from "next";
import { Chakra_Petch } from "next/font/google";
import { DossierChrome, HudOctagonFrame } from "@/components/dossier";

const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-chakra-petch",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SF//HUD-00 — Cyber2k system plate",
  description: "Dossier plate 02. Token system rendered as Cyber2k HUD.",
};

const LEGEND = [
  { label: "COLOR",   count: "49 SCALES" },
  { label: "SPACING", count: "9 STOPS" },
  { label: "MOTION",  count: "12 EASES" },
];

const READOUT_ROWS = [
  { id: "∞", name: "SIG_INT",  val: "0.00–1.00" },
  { id: "ℓ", name: "LCP_TGT",  val: "<1.0s" },
  { id: "φ", name: "CLS_TGT",  val: "0.00" },
  { id: "ψ", name: "CONTRAST", val: "≥ AA" },
];

export default function SystemPage() {
  return (
    <DossierChrome route="cyber2k" substrate="black">
      <div className={chakraPetch.variable}>
        <main className="min-h-screen px-6 md:px-16 py-24">
          <h1
            data-plate="cyber2k-hero"
            className="uppercase tracking-[0.02em] leading-none mb-12 md:mb-16"
            style={{
              fontFamily: "var(--font-chakra-petch), sans-serif",
              fontWeight: 700,
              fontSize: "clamp(40px, 8vw, 112px)",
            }}
          >
            TOKEN<br/>INSTRUMENT
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr_280px] gap-6 md:gap-8 items-start">

            {/* Left: legend */}
            <ul
              data-plate="cyber2k-legend"
              className="space-y-3"
              style={{ fontFamily: "var(--font-jetbrains), monospace" }}
            >
              {LEGEND.map((l) => (
                <li
                  key={l.label}
                  className="border border-white/20 p-3 text-[11px] uppercase tracking-[0.15em]"
                >
                  <div className="opacity-60">{l.label}</div>
                  <div className="text-[16px] mt-1">{l.count}</div>
                </li>
              ))}
            </ul>

            {/* Center: octagon with reticle */}
            <HudOctagonFrame dataPlate="cyber2k-octagon" className="aspect-square w-full max-w-[520px] mx-auto">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* brackets + waveform */}
                <div
                  className="relative w-[72%] aspect-square flex items-center justify-center"
                  style={{ fontFamily: "var(--font-chakra-petch), sans-serif" }}
                >
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[48px] leading-none opacity-60">[</span>
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[48px] leading-none opacity-60">]</span>
                  <div className="w-full text-center">
                    <div className="text-[11px] uppercase tracking-[0.2em] opacity-60" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
                      SYSTEM READOUT
                    </div>
                    <div className="text-[64px] leading-none mt-2 font-bold">SF//UX</div>
                    <div className="text-[11px] uppercase tracking-[0.2em] opacity-60 mt-3" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
                      v0.1 · LOCKED
                    </div>
                  </div>
                </div>
              </div>
            </HudOctagonFrame>

            {/* Right: diagnostic readout */}
            <div
              data-plate="cyber2k-readout"
              className="space-y-2"
              style={{ fontFamily: "var(--font-jetbrains), monospace" }}
            >
              {READOUT_ROWS.map((r) => (
                <div key={r.id} className="border border-white/20 px-3 py-2 flex items-baseline justify-between text-[11px] uppercase tracking-[0.12em]">
                  <span className="opacity-60">{r.id} · {r.name}</span>
                  <span style={{ color: "oklch(0.65 0.3 350)" }}>{r.val}</span>
                </div>
              ))}
              {/* pulsing bar */}
              <div className="h-px bg-white/20 relative overflow-hidden mt-6">
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1/3"
                  style={{
                    background: "oklch(0.65 0.3 350)",
                    animation: "hudPulse 3s ease-in-out infinite",
                  }}
                />
              </div>
              <style>{`
                @keyframes hudPulse {
                  0%, 100% { transform: translateX(0); opacity: 0.3; }
                  50%     { transform: translateX(200%); opacity: 1; }
                }
                @media (prefers-reduced-motion: reduce) {
                  [data-plate='cyber2k-readout'] span[aria-hidden='true'] {
                    animation: none !important;
                  }
                }
              `}</style>
            </div>
          </div>
        </main>
      </div>
    </DossierChrome>
  );
}
