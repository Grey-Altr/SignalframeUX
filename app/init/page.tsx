import type { Metadata } from "next";
import { Zen_Dots, Share_Tech_Mono } from "next/font/google";
import { DossierChrome, TerminalSession } from "@/components/dossier";

const zenDots = Zen_Dots({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-zen-dots",
  display: "swap",
});
const shareTech = Share_Tech_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-share-tech-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SF//HLG-00 — Helghanese init plate",
  description: "Dossier plate 06. Parallel-world terminal session.",
};

const SESSION = [
  { prompt: true,  text: "npx signalframeux init" },
  { text: "» reading dossier...              [ok]", intent: "ok" as const },
  { text: "» resolving reference packs (6)...[ok]", intent: "ok" as const },
  { text: "» downloading signal shaders...   [ok]", intent: "ok" as const },
  { text: "» compiling frame primitives...   [ok]", intent: "ok" as const },
  { text: "» calibrating lime-green accent.. [ok]", intent: "ok" as const },
  { text: "» projecting parallel timeline... [ok]", intent: "ok" as const },
  { text: "» handshake: CULTURE DIVISION     [ok]", intent: "ok" as const },
  { text: "" },
  { text: "installed. you are now in the parallel timeline." },
  { text: "" },
  { text: "» exit 0" },
];

export default function InitPage() {
  return (
    <DossierChrome route="helghanese" substrate="black">
      <div className={`${zenDots.variable} ${shareTech.variable}`}>
        <main className="min-h-screen grid grid-rows-[auto_1fr_auto] px-6 md:px-16 py-24 md:py-32">

          <h1
            data-plate="helghanese-header"
            className="uppercase tracking-[0.02em] leading-none"
            style={{
              fontFamily: "var(--font-zen-dots), monospace",
              fontSize: "clamp(22px, 4vw, 56px)",
              color: "var(--dossier-nav-active-break)",
            }}
          >
            SF//UX INIT v0.1
          </h1>

          <div className="grid grid-cols-[auto_1fr_auto] gap-10 md:gap-16 items-start mt-16">

            {/* Left margin: repeating glyph column (Helghanese-like) */}
            <div
              aria-hidden="true"
              className="text-[22px] leading-[1.4] opacity-40 flex flex-col gap-1"
              style={{ fontFamily: "var(--font-zen-dots), monospace" }}
            >
              {"◆◈◆◉◇◈◆◉◇◈◆".split("").map((g, i) => (
                <span key={i}>{g}</span>
              ))}
            </div>

            {/* Center: terminal session */}
            <div>
              <TerminalSession lines={SESSION} />
            </div>

            {/* Right margin: vertical repeated wordmark */}
            <div
              aria-hidden="true"
              className="uppercase opacity-40 text-[11px] tracking-[0.3em] [writing-mode:vertical-rl] rotate-180"
              style={{ fontFamily: "var(--font-share-tech-mono), monospace" }}
            >
              PARALLEL WORLDS · PARALLEL WORLDS · PARALLEL WORLDS
            </div>
          </div>

          <p
            className="mt-16 max-w-[60ch] text-[13px] opacity-70 leading-[1.7]"
            style={{ fontFamily: "var(--font-share-tech-mono), monospace" }}
          >
            To adopt SignalframeUX, run the install sequence above. The system
            resolves against its dossier — six reference plates, one coherent
            grammar. This page is the only plate in the system that breaks the
            one-accent rule; everything else uses magenta.
          </p>
        </main>
      </div>
    </DossierChrome>
  );
}
