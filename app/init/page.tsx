import type { Metadata } from "next";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { SFSection } from "@/components/sf";
import { SharedCodeBlock } from "@/components/blocks/shared-code-block";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { NavRevealMount } from "@/components/layout/nav-reveal-mount";


export const metadata: Metadata = {
  title: "[00//BOOT] — SIGNALFRAME//UX",
  description: "From zero to Signal//Frame in 5 minutes. Install, initialize, and deploy.",
};

const STEPS: Array<{ number: string; title: string; description: string; code: CodeLine[]; note: string | null; highlight: boolean }> = [
  {
    number: "01",
    title: "INSTALL",
    description:
      "ADD SIGNALFRAMEUX\u2122 TO YOUR PROJECT. THE CORE PACKAGE INCLUDES ALL FRAME LAYER COMPONENTS, TOKENS, AND THE API SURFACE. SIGNAL LAYER IS INCLUDED BUT OPT-IN.",
    code: [
      { type: "comment", text: "# NPM" },
      { type: "line", parts: [{ text: "npm", cls: "fn" }, { text: " install " }, { text: "@sfux/core @sfux/components @sfux/tokens", cls: "str" }] },
      { type: "blank" },
      { type: "comment", text: "# PNPM (RECOMMENDED)" },
      { type: "line", parts: [{ text: "pnpm", cls: "fn" }, { text: " add " }, { text: "@sfux/core @sfux/components @sfux/tokens", cls: "str" }] },
      { type: "blank" },
      { type: "comment", text: "# SIGNAL LAYER (OPTIONAL)" },
      { type: "line", parts: [{ text: "pnpm", cls: "fn" }, { text: " add " }, { text: "@sfux/signal", cls: "str" }] },
    ],
    note: "REQUIRES REACT 18+ AND TYPESCRIPT 5+. TAILWINDCSS IS OPTIONAL BUT RECOMMENDED.",
    highlight: false,
  },
  {
    number: "02",
    title: "INITIALIZE",
    description:
      "WRAP YOUR APP IN THE SFUX PROVIDER. PASS A CONFIG OBJECT TO SET YOUR THEME, TOKEN MODE, AND SIGNAL LAYER PREFERENCES.",
    code: [
      { type: "line", parts: [{ text: "import", cls: "kw" }, { text: " { " }, { text: "SFUXProvider", cls: "fn" }, { text: ", " }, { text: "createSignalframeUX", cls: "fn" }, { text: " } " }, { text: "from", cls: "kw" }, { text: " " }, { text: "'@sfux/core'", cls: "str" }] },
      { type: "blank" },
      { type: "line", parts: [{ text: "const", cls: "kw" }, { text: " config = " }, { text: "createSignalframeUX", cls: "fn" }, { text: "({" }] },
      { type: "line", parts: [{ text: "  " }, { text: "theme", cls: "cn" }, { text: ": " }, { text: "'dark'", cls: "str" }, { text: "," }] },
      { type: "line", parts: [{ text: "  " }, { text: "tokens", cls: "cn" }, { text: ": " }, { text: "'oklch'", cls: "str" }, { text: "," }] },
      { type: "line", parts: [{ text: "  " }, { text: "signal", cls: "cn" }, { text: ": { " }, { text: "enabled", cls: "cn" }, { text: ": " }, { text: "true", cls: "kw" }, { text: " }" }] },
      { type: "line", parts: [{ text: "})" }] },
      { type: "blank" },
      { type: "line", parts: [{ text: "export default function", cls: "kw" }, { text: " " }, { text: "App", cls: "fn" }, { text: "() {" }] },
      { type: "line", parts: [{ text: "  " }, { text: "return", cls: "kw" }, { text: " (" }] },
      { type: "line", parts: [{ text: "    <" }, { text: "SFUXProvider", cls: "fn" }, { text: " " }, { text: "config", cls: "cn" }, { text: "={config}>" }] },
      { type: "line", parts: [{ text: "      <" }, { text: "YourApp", cls: "fn" }, { text: " />" }] },
      { type: "line", parts: [{ text: "    </" }, { text: "SFUXProvider", cls: "fn" }, { text: ">" }] },
      { type: "line", parts: [{ text: "  )" }] },
      { type: "line", parts: [{ text: "}" }] },
    ],
    note: null,
    highlight: false,
  },
  {
    number: "03",
    title: "USE_COMPONENTS",
    description:
      "IMPORT ANY OF THE 340+ COMPONENTS. THEY AUTOMATICALLY INHERIT YOUR THEME AND TOKEN CONFIGURATION. FRAME COMPONENTS ARE STRUCTURAL. SIGNAL VARIANTS ADD GENERATIVE EFFECTS ON TOP.",
    code: [
      { type: "line", parts: [{ text: "import", cls: "kw" }, { text: " { " }, { text: "Button", cls: "fn" }, { text: ", " }, { text: "Card", cls: "fn" }, { text: ", " }, { text: "Input", cls: "fn" }, { text: " } " }, { text: "from", cls: "kw" }, { text: " " }, { text: "'@sfux/components'", cls: "str" }] },
      { type: "blank" },
      { type: "line", parts: [{ text: "function", cls: "kw" }, { text: " " }, { text: "Dashboard", cls: "fn" }, { text: "() {" }] },
      { type: "line", parts: [{ text: "  " }, { text: "return", cls: "kw" }, { text: " (" }] },
      { type: "line", parts: [{ text: "    <" }, { text: "Card", cls: "fn" }, { text: ">" }] },
      { type: "line", parts: [{ text: "      <" }, { text: "Input", cls: "fn" }, { text: " " }, { text: "placeholder", cls: "cn" }, { text: "=" }, { text: '"SEARCH SIGNALS..."', cls: "str" }, { text: " />" }] },
      { type: "line", parts: [{ text: "      <" }, { text: "Button", cls: "fn" }, { text: " " }, { text: "variant", cls: "cn" }, { text: "=" }, { text: '"signal"', cls: "str" }, { text: ">" }] },
      { type: "line", parts: [{ text: "        \u2022TRANSMIT" }] },
      { type: "line", parts: [{ text: "      </" }, { text: "Button", cls: "fn" }, { text: ">" }] },
      { type: "line", parts: [{ text: "      <" }, { text: "Button", cls: "fn" }, { text: " " }, { text: "variant", cls: "cn" }, { text: "=" }, { text: '"signal"', cls: "str" }, { text: " " }, { text: "signalEffect", cls: "cn" }, { text: "=" }, { text: '"shimmer"', cls: "str" }, { text: ">" }] },
      { type: "line", parts: [{ text: "        ENGAGE FRAME" }] },
      { type: "line", parts: [{ text: "      </" }, { text: "Button", cls: "fn" }, { text: ">" }] },
      { type: "line", parts: [{ text: "    </" }, { text: "Card", cls: "fn" }, { text: ">" }] },
      { type: "line", parts: [{ text: "  )" }] },
      { type: "line", parts: [{ text: "}" }] },
    ],
    note: null,
    highlight: true,
  },
  {
    number: "04",
    title: "ACTIVATE_FRAME",
    description:
      "THE SIGNAL LAYER IS THE GENERATIVE EXPRESSION SYSTEM. ADD NOISE BACKGROUNDS, PARTICLE MESHES, GLITCH TEXT, AND REACTIVE CANVAS EFFECTS. THEY NEVER INTERFERE WITH THE FRAME LAYER\u2019S READABILITY.",
    code: [
      { type: "line", parts: [{ text: "import", cls: "kw" }, { text: " { " }, { text: "NoiseBG", cls: "fn" }, { text: ", " }, { text: "GlitchText", cls: "fn" }, { text: " } " }, { text: "from", cls: "kw" }, { text: " " }, { text: "'@sfux/signal'", cls: "str" }] },
      { type: "blank" },
      { type: "line", parts: [{ text: "<" }, { text: "NoiseBG", cls: "fn" }] },
      { type: "line", parts: [{ text: "  " }, { text: "intensity", cls: "cn" }, { text: "={" }, { text: "0.3", cls: "cn" }, { text: "}" }] },
      { type: "line", parts: [{ text: "  " }, { text: "reactive", cls: "cn" }, { text: "=" }, { text: '"cursor"', cls: "str" }] },
      { type: "line", parts: [{ text: "  " }, { text: "color", cls: "cn" }, { text: "=" }, { text: '"oklch(0.6 0.28 330)"', cls: "str" }] },
      { type: "line", parts: [{ text: "/>" }] },
      { type: "blank" },
      { type: "line", parts: [{ text: "<" }, { text: "GlitchText", cls: "fn" }, { text: " " }, { text: "trigger", cls: "cn" }, { text: "=" }, { text: '"hover"', cls: "str" }, { text: ">" }] },
      { type: "line", parts: [{ text: "  SIGNAL//FRAME\u2122" }] },
      { type: "line", parts: [{ text: "</" }, { text: "GlitchText", cls: "fn" }, { text: ">" }] },
    ],
    note: "SIGNAL EFFECTS AUTOMATICALLY RESPECT PREFERS-REDUCED-MOTION. USE signalIntensity TO CONTROL VISUAL WEIGHT.",
    highlight: false,
  },
  {
    number: "05",
    title: "DEPLOY",
    description:
      "SIGNALFRAMEUX\u2122 IS FRAMEWORK-AGNOSTIC BUT OPTIMIZED FOR NEXT.JS + VERCEL. TREE-SHAKING ENSURES YOU ONLY SHIP THE COMPONENTS YOU USE. SIGNAL LAYER IS CODE-SPLIT AND LOADED ON DEMAND.",
    code: [
      { type: "comment", text: "# BUILD FOR PRODUCTION" },
      { type: "line", parts: [{ text: "pnpm", cls: "fn" }, { text: " build" }] },
      { type: "blank" },
      { type: "comment", text: "# BUNDLE ANALYSIS" },
      { type: "line", parts: [{ text: "pnpm", cls: "fn" }, { text: " analyze" }] },
      { type: "blank" },
      { type: "comment", text: "# CORE: ~12KB GZIPPED" },
      { type: "comment", text: "# COMPONENTS: ~3KB PER COMPONENT (AVG)" },
      { type: "comment", text: "# FRAME: ~8KB BASE + ~2KB PER EFFECT" },
    ],
    note: null,
    highlight: false,
  },
];

type CodePart = { text: string; cls?: string };
type CodeLine =
  | { type: "comment"; text: string }
  | { type: "blank" }
  | { type: "line"; parts: CodePart[] };

const COLOR_MAP: Record<string, string> = {
  kw: "text-primary",
  str: "text-[var(--sf-yellow)]",
  fn: "text-[var(--sf-code-text)]",
  cn: "text-[var(--sf-code-keyword)]",
};

function CodeBlock({ lines }: { lines: CodeLine[] }) {
  return (
    <SharedCodeBlock label="TERMINAL™" className="text-base">
      <code>
        {lines.map((line, i) => {
          if (line.type === "blank") return <br key={i} />;
          if (line.type === "comment")
            return (
              <div key={i} className="text-muted-foreground">
                {line.text}
              </div>
            );
          return (
            <div key={i} className="text-[var(--sf-code-text)]">
              {line.parts.map((part, j) => {
                if (!part.cls) return <span key={j}>{part.text}</span>;
                return (
                  <span key={j} className={COLOR_MAP[part.cls] ?? ""}>
                    {part.text}
                  </span>
                );
              })}
            </div>
          );
        })}
      </code>
    </SharedCodeBlock>
  );
}

export default function InitPage() {
  return (
    <>
      <Nav />
      <main id="main-content" data-cursor data-section="init" data-section-label="SYS" data-primary className="mt-[var(--nav-height)]">
        <Breadcrumb segments={[{ label: "INIT" }]} />

        {/* SP-05: nav hides until the page header scrolls out of view
            (CONTEXT.md §VL — Nav reveal pattern, LOCKED) */}
        <NavRevealMount targetSelector="[data-nav-reveal-trigger]" />

        {/* ═══ PAGE HEADER ═══ */}
        <SFSection label="INIT" className="py-0 relative overflow-hidden">
          <header
            data-nav-reveal-trigger
            className="grid grid-cols-[1fr_auto] border-b-4 border-foreground items-end relative z-10"
          >
            <div className="px-6 md:px-12 pt-10 pb-6">
              <div className="font-mono text-[var(--text-xs)] uppercase tracking-[0.2em] text-muted-foreground mb-4">
                [00//BOOT]
              </div>
              <h1
                aria-label="Initialize"
                className="sf-display leading-[0.9] uppercase tracking-[-0.02em]"
                style={{ fontSize: "clamp(80px, 12vw, 160px)" }}
              >
                <span data-anim="page-heading" suppressHydrationWarning>INITIA</span>
                <br />
                <span data-anim="page-heading" suppressHydrationWarning>LIZE</span>
              </h1>
            </div>
            <div className="px-6 md:px-12 pb-6 text-right font-mono text-[var(--text-xs)] uppercase tracking-[0.15em] text-muted-foreground">
              5 STEP SEQUENCE
            </div>
          </header>
        </SFSection>

        {/* ═══ BRINGUP SEQUENCE ═══ */}
        <SFSection label="SEQUENCE" className="py-0">
          <div className="divide-y divide-foreground/15">
            {STEPS.map((step, i) => {
              const CODES = ["INIT", "HANDSHAKE", "LINK", "TRANSMIT", "DEPLOY"] as const;
              const code = `[${step.number}//${CODES[i]}]`;
              return (
                <article
                  key={step.number}
                  data-init-step={step.number}
                  className="grid grid-cols-[auto_1fr] gap-8 md:gap-12 py-12 md:py-16 px-6 md:px-12"
                >
                  {/* Step number at display size */}
                  <div
                    className="sf-display leading-none text-foreground tabular-nums"
                    style={{ fontSize: "clamp(80px, 10vw, 160px)" }}
                  >
                    {step.number}
                  </div>

                  <div className="min-w-0">
                    {/* Coded indicator */}
                    <div className="font-mono text-[var(--text-xs)] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                      {code}
                    </div>

                    {/* Title */}
                    <h2
                      className="sf-display uppercase tracking-tight mb-5 leading-[0.95]"
                      style={{ fontSize: "var(--text-3xl)" }}
                    >
                      {step.title}
                    </h2>

                    {/* Description — all caps monospace, tracking tight */}
                    <p className="font-mono uppercase text-[var(--text-sm)] leading-relaxed tracking-tight text-muted-foreground max-w-prose mb-6">
                      {step.description}
                    </p>

                    {/* Code block — preserve CodeBlock helper */}
                    <CodeBlock lines={step.code} />

                    {/* Optional note — terminal comment register */}
                    {step.note && (
                      <div className="mt-4 font-mono text-[var(--text-xs)] uppercase tracking-[0.15em] text-muted-foreground">
                        {"// " + step.note}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </SFSection>

        {/* ═══ TERMINAL FOOTER ═══ */}
        <SFSection label="TERMINAL" className="border-t-4 border-foreground py-16 px-6 md:px-12">
          <div className="font-mono uppercase tracking-[0.15em] text-muted-foreground">
            [OK] SYSTEM READY
          </div>
        </SFSection>
      </main>
      <Footer />
    </>
  );
}
