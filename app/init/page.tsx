import type { Metadata } from "next";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { SFButton, SFBadge, SFSection } from "@/components/sf";
import Link from "next/link";
import { SharedCodeBlock } from "@/components/blocks/shared-code-block";
import { Breadcrumb } from "@/components/layout/breadcrumb";


export const metadata: Metadata = {
  title: "Get Started — SIGNALFRAME//UX",
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

const CHECKLIST = [
  { label: "INSTALL @SFUX/CORE AND DEPENDENCIES", done: true, status: "COMPLETE" },
  { label: "WRAP APP IN SFUXPROVIDER", done: true, status: "COMPLETE" },
  { label: "IMPORT AND USE FRAME COMPONENTS", done: true, status: "COMPLETE" },
  { label: "CONFIGURE OKLCH TOKEN OVERRIDES", done: false, status: "OPTIONAL" },
  { label: "ENABLE SIGNAL LAYER EFFECTS", done: false, status: "OPTIONAL" },
  { label: "SET UP STORYBOOK FOR DEVELOPMENT", done: false, status: "RECOMMENDED" },
];

const NEXT_CARDS = [
  { title: "BROWSE COMPONENTS", description: "EXPLORE ALL 340+ SIGNAL AND FRAME COMPONENTS WITH LIVE PREVIEWS AND CODE EXAMPLES.", arrow: "COMPONENT LIBRARY", href: "/components" },
  { title: "API REFERENCE", description: "DIVE INTO THE FULL API \u2014 PROPS, HOOKS, TOKENS, AND THE PROGRAMMABLE SURFACE.", arrow: "API DOCS", href: "/reference" },
  { title: "TOKEN EXPLORER", description: "VISUALIZE AND CUSTOMIZE THE OKLCH COLOR SCALES, SPACING, TYPE, AND MOTION TOKENS.", arrow: "TOKEN EXPLORER", href: "/tokens" },
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

export default function StartPage() {
  return (
    <>
      <Nav />
      <main id="main-content" data-cursor className="mt-[var(--nav-height)]">
        <Breadcrumb segments={[{ label: "GET STARTED" }]} />
        {/* ═══ HERO ═══ */}
        <SFSection label="GET STARTED" className="py-0 bg-foreground text-background border-b-4 border-foreground relative overflow-hidden">
          {/* Yellow accent bar */}
          <div className="h-[6px] bg-[var(--sf-yellow)]" aria-hidden="true" />
          <div className="py-[clamp(48px,8vw,80px)] px-[clamp(20px,4vw,48px)]">
            <div className="flex items-start justify-between">
              <h1 className="sf-display text-[clamp(48px,11vw,120px)] mb-6">
                <span data-anim="page-heading" suppressHydrationWarning>GET</span>
                <br />
                <span data-anim="page-heading" className="text-primary" suppressHydrationWarning>STARTED</span>
              </h1>
              {/* Monogram watermark */}
              <span className="sf-display text-[clamp(60px,12vw,160px)] text-background/15 select-none leading-none hidden md:block" aria-hidden="true">
                SF
              </span>
            </div>
            <p className="text-md text-muted-foreground uppercase tracking-[0.2em] max-w-[600px] leading-[1.5]">
              FROM ZERO TO SIGNAL//FRAME&trade; IN 5 MINUTES. ACCEPT THE
              INTERFACE INTO YOUR LIFE.
            </p>
            <p className="mt-6 text-sm text-primary uppercase tracking-[0.15em]">
              &bull; ESTIMATED TIME: 5 MIN &bull; SIGNALFRAMEUX V2.0
            </p>
          </div>
        </SFSection>

        {/* ═══ STEPS ═══ */}
        {STEPS.map((step) => (
          <SFSection
            key={step.number}
            label={step.title}
            aria-label={`Step ${step.number}: ${step.title}`}
            className="py-0 grid grid-cols-[60px_1fr] md:grid-cols-[80px_1fr] border-b-[3px] border-foreground min-h-[200px]"
          >
            {/* Step number column */}
            <div
              className={`flex items-center justify-center border-r-[3px] border-foreground transition-colors duration-200 sf-display ${
                step.highlight
                  ? "bg-[var(--sf-yellow)] text-foreground"
                  : "bg-foreground text-background hover:bg-primary"
              }`}
              style={{ fontSize: "clamp(24px, 4vw, 48px)" }}
            >
              {step.number}
            </div>

            {/* Step content column */}
            <div
              className={`py-10 px-[clamp(20px,4vw,48px)] relative ${
                step.highlight ? "bg-[var(--sf-yellow)] sf-grain" : ""
              }`}
            >
              <h2
                className="sf-display leading-none mb-4 text-foreground"
                style={{ fontSize: "clamp(24px, 4vw, 48px)" }}
              >
                {step.title}
              </h2>
              <p
                className={`text-base leading-[1.8] max-w-[600px] mb-5 ${
                  step.highlight
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {step.description}
              </p>
              <CodeBlock lines={step.code} />
              {step.note && (
                <div className="mt-4 text-sm text-muted-foreground uppercase tracking-[0.1em] py-3 px-4 border-l-[3px] border-primary">
                  {step.note}
                </div>
              )}
            </div>
          </SFSection>
        ))}

        {/* ═══ CHECKLIST ═══ */}
        <SFSection label="SETUP CHECKLIST" className="border-b-[3px] border-foreground py-10 px-[clamp(20px,4vw,48px)]">
          <h2
            className="sf-display mb-6"
            style={{ fontSize: "clamp(24px, 4vw, 48px)" }}
          >
            SETUP_CHECKLIST
          </h2>
          <div>
            {CHECKLIST.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 py-3 border-b border-border text-base uppercase tracking-[0.08em]"
              >
                <div
                  role="img"
                  aria-label={item.done ? "Complete" : "Incomplete"}
                  className={`w-5 h-5 border-2 flex items-center justify-center text-sm shrink-0 ${
                    item.done
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-foreground"
                  }`}
                >
                  {item.done ? "\u2713" : ""}
                </div>
                <div className="flex-1">{item.label}</div>
                <SFBadge
                  intent={item.done ? "primary" : "outline"}
                  className="text-sm"
                >
                  {item.status}
                </SFBadge>
              </div>
            ))}
          </div>
        </SFSection>

        {/* ═══ NEXT STEPS ═══ */}
        <SFSection label="NEXT STEPS" className="py-0">
          <div data-anim="stagger" className="grid grid-cols-1 sm:grid-cols-3 border-b-[3px] border-foreground">
          {NEXT_CARDS.map((card, i) => (
            <Link
              key={card.title}
              href={card.href}
              className={`group relative overflow-hidden py-10 px-8 transition-all duration-150 no-underline text-foreground ${
                i < NEXT_CARDS.length - 1
                  ? "border-b-[3px] sm:border-b-0 sm:border-r-[3px] border-foreground"
                  : ""
              } hover:bg-foreground hover:text-background`}
            >
              {/* Animated border lines */}
              <span className="absolute top-0 left-0 h-[2px] bg-primary w-0 group-hover:w-full transition-all duration-100" />
              <span className="absolute top-0 right-0 w-[2px] bg-primary h-0 group-hover:h-full transition-all duration-100 delay-100" />
              <span className="absolute bottom-0 right-0 h-[2px] bg-primary w-0 group-hover:w-full transition-all duration-100 delay-200" />
              <span className="absolute bottom-0 left-0 w-[2px] bg-primary h-0 group-hover:h-full transition-all duration-100 delay-300" />

              <h3 className="sf-display text-base mb-3 transition-colors duration-150 group-hover:text-primary">
                {card.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-[1.7] transition-colors duration-150">
                {card.description}
              </p>
              <div className="mt-4 text-sm text-primary uppercase tracking-[0.15em]">
                &rarr; {card.arrow}
              </div>
            </Link>
          ))}
          </div>
        </SFSection>

        {/* ═══ COMMUNITY BAND ═══ */}
        <SFSection label="COMMUNITY" className="py-0 sf-yellow-band sf-grain border-b-[3px] border-foreground relative overflow-hidden">

          {/* Marquee */}
          <span className="sr-only">Open source. Built by engineers. Work. Build. Signal. Repeat.</span>
          <div className="h-8 overflow-hidden relative z-[var(--z-above-bg)]">
            <div
              aria-hidden="true"
              className="flex whitespace-nowrap uppercase tracking-[0.15em] leading-8 text-foreground sf-display text-md"
              style={{ animation: "sf-marquee-scroll 12s linear infinite" }}
            >
              {[...Array(4)].map((_, i) => (
                <span key={i} className="inline-block pr-12">
                  OPEN SOURCE // BUILT BY ENGINEERS // WORK BUILD SIGNAL REPEAT //
                </span>
              ))}
            </div>
          </div>

          <div className="py-10 px-[clamp(20px,4vw,48px)] relative z-[var(--z-above-bg)]">
            <h2
              className="sf-display text-foreground mb-3"
              style={{ fontSize: "clamp(24px, 4vw, 48px)" }}
            >
              JOIN THE SIGNAL&trade;
            </h2>
            <p className="text-sm leading-[1.7] text-foreground max-w-[700px]">
              SignalframeUX&trade; is open source. Built by people who believe
              design systems should be{" "}
              <Link href="/components" className="text-primary no-underline hover:underline">
                programmable surfaces
              </Link>
              , not static pattern libraries. Work. Build. Signal. Repeat.&trade;
            </p>
            <div className="mt-5 flex gap-4">
              <SFButton asChild intent="signal" className="bg-foreground text-[var(--sf-yellow)] border-foreground hover:bg-foreground/90">
                <a href="https://github.com/signalframeux" target="_blank" rel="noopener noreferrer">
                  GITHUB
                  <span className="sr-only">(opens in new tab)</span>
                </a>
              </SFButton>
              <SFButton asChild intent="signal" className="bg-foreground text-[var(--sf-yellow)] border-foreground hover:bg-foreground/90">
                <a href="https://github.com/signalframeux/storybook" target="_blank" rel="noopener noreferrer">
                  STORYBOOK
                  <span className="sr-only">(opens in new tab)</span>
                </a>
              </SFButton>
            </div>
          </div>
        </SFSection>
      </main>
      <Footer />
    </>
  );
}
