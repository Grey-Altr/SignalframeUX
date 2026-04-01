import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";

const STEPS = [
  {
    number: "01",
    title: "INSTALL",
    description:
      "ADD SIGNALFRAMEUX\u2122 TO YOUR PROJECT. THE CORE PACKAGE INCLUDES ALL SIGNAL LAYER COMPONENTS, TOKENS, AND THE API SURFACE. FIELD LAYER IS INCLUDED BUT OPT-IN.",
    code: [
      { type: "comment", text: "# NPM" },
      {
        type: "line",
        parts: [
          { text: "npm", cls: "fn" },
          { text: " install " },
          { text: "@sfux/core @sfux/components @sfux/tokens", cls: "str" },
        ],
      },
      { type: "blank" },
      { type: "comment", text: "# PNPM (RECOMMENDED)" },
      {
        type: "line",
        parts: [
          { text: "pnpm", cls: "fn" },
          { text: " add " },
          { text: "@sfux/core @sfux/components @sfux/tokens", cls: "str" },
        ],
      },
      { type: "blank" },
      { type: "comment", text: "# FIELD LAYER (OPTIONAL)" },
      {
        type: "line",
        parts: [
          { text: "pnpm", cls: "fn" },
          { text: " add " },
          { text: "@sfux/field", cls: "str" },
        ],
      },
    ],
    note: "REQUIRES REACT 18+ AND TYPESCRIPT 5+. TAILWINDCSS IS OPTIONAL BUT RECOMMENDED.",
    highlight: false,
  },
  {
    number: "02",
    title: "INITIALIZE",
    description:
      "WRAP YOUR APP IN THE SFUX PROVIDER. PASS A CONFIG OBJECT TO SET YOUR THEME, TOKEN MODE, AND FIELD LAYER PREFERENCES.",
    code: [
      {
        type: "line",
        parts: [
          { text: "import", cls: "kw" },
          { text: " { " },
          { text: "SFUXProvider", cls: "fn" },
          { text: ", " },
          { text: "createSignalframeUX", cls: "fn" },
          { text: " } " },
          { text: "from", cls: "kw" },
          { text: " " },
          { text: "'@sfux/core'", cls: "str" },
        ],
      },
      { type: "blank" },
      {
        type: "line",
        parts: [
          { text: "const", cls: "kw" },
          { text: " config = " },
          { text: "createSignalframeUX", cls: "fn" },
          { text: "({" },
        ],
      },
      {
        type: "line",
        parts: [
          { text: "  " },
          { text: "theme", cls: "cn" },
          { text: ": " },
          { text: "'dark'", cls: "str" },
          { text: "," },
        ],
      },
      {
        type: "line",
        parts: [
          { text: "  " },
          { text: "tokens", cls: "cn" },
          { text: ": " },
          { text: "'oklch'", cls: "str" },
          { text: "," },
        ],
      },
      {
        type: "line",
        parts: [
          { text: "  " },
          { text: "field", cls: "cn" },
          { text: ": { " },
          { text: "enabled", cls: "cn" },
          { text: ": " },
          { text: "true", cls: "kw" },
          { text: " }" },
        ],
      },
      { type: "line", parts: [{ text: "})" }] },
      { type: "blank" },
      {
        type: "line",
        parts: [
          { text: "export default function", cls: "kw" },
          { text: " " },
          { text: "App", cls: "fn" },
          { text: "() {" },
        ],
      },
      {
        type: "line",
        parts: [{ text: "  " }, { text: "return", cls: "kw" }, { text: " (" }],
      },
      {
        type: "line",
        parts: [
          { text: "    <" },
          { text: "SFUXProvider", cls: "fn" },
          { text: " " },
          { text: "config", cls: "cn" },
          { text: "={config}>" },
        ],
      },
      {
        type: "line",
        parts: [
          { text: "      <" },
          { text: "YourApp", cls: "fn" },
          { text: " />" },
        ],
      },
      {
        type: "line",
        parts: [
          { text: "    </" },
          { text: "SFUXProvider", cls: "fn" },
          { text: ">" },
        ],
      },
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
      "IMPORT ANY OF THE 340+ COMPONENTS. THEY AUTOMATICALLY INHERIT YOUR THEME AND TOKEN CONFIGURATION. SIGNAL COMPONENTS ARE DETERMINISTIC. FIELD VARIANTS ADD GENERATIVE EFFECTS ON TOP.",
    code: [
      {
        type: "line",
        parts: [
          { text: "import", cls: "kw" },
          { text: " { " },
          { text: "Button", cls: "fn" },
          { text: ", " },
          { text: "Card", cls: "fn" },
          { text: ", " },
          { text: "Input", cls: "fn" },
          { text: " } " },
          { text: "from", cls: "kw" },
          { text: " " },
          { text: "'@sfux/components'", cls: "str" },
        ],
      },
      { type: "blank" },
      {
        type: "line",
        parts: [
          { text: "function", cls: "kw" },
          { text: " " },
          { text: "Dashboard", cls: "fn" },
          { text: "() {" },
        ],
      },
      {
        type: "line",
        parts: [{ text: "  " }, { text: "return", cls: "kw" }, { text: " (" }],
      },
      {
        type: "line",
        parts: [{ text: "    <" }, { text: "Card", cls: "fn" }, { text: ">" }],
      },
      {
        type: "line",
        parts: [
          { text: "      <" },
          { text: "Input", cls: "fn" },
          { text: " " },
          { text: "placeholder", cls: "cn" },
          { text: "=" },
          { text: '"SEARCH SIGNALS..."', cls: "str" },
          { text: " />" },
        ],
      },
      {
        type: "line",
        parts: [
          { text: "      <" },
          { text: "Button", cls: "fn" },
          { text: " " },
          { text: "variant", cls: "cn" },
          { text: "=" },
          { text: '"signal"', cls: "str" },
          { text: ">" },
        ],
      },
      { type: "line", parts: [{ text: "        \u2022TRANSMIT" }] },
      {
        type: "line",
        parts: [
          { text: "      </" },
          { text: "Button", cls: "fn" },
          { text: ">" },
        ],
      },
      {
        type: "line",
        parts: [
          { text: "      <" },
          { text: "Button", cls: "fn" },
          { text: " " },
          { text: "variant", cls: "cn" },
          { text: "=" },
          { text: '"field"', cls: "str" },
          { text: " " },
          { text: "fieldEffect", cls: "cn" },
          { text: "=" },
          { text: '"shimmer"', cls: "str" },
          { text: ">" },
        ],
      },
      { type: "line", parts: [{ text: "        ENGAGE FIELD" }] },
      {
        type: "line",
        parts: [
          { text: "      </" },
          { text: "Button", cls: "fn" },
          { text: ">" },
        ],
      },
      {
        type: "line",
        parts: [
          { text: "    </" },
          { text: "Card", cls: "fn" },
          { text: ">" },
        ],
      },
      { type: "line", parts: [{ text: "  )" }] },
      { type: "line", parts: [{ text: "}" }] },
    ],
    note: null,
    highlight: true,
  },
  {
    number: "04",
    title: "ACTIVATE_FIELD",
    description:
      "THE FIELD LAYER IS THE GENERATIVE EXPRESSION SYSTEM. ADD NOISE BACKGROUNDS, PARTICLE MESHES, GLITCH TEXT, AND REACTIVE CANVAS EFFECTS. THEY NEVER INTERFERE WITH THE SIGNAL LAYER\u2019S READABILITY.",
    code: [
      {
        type: "line",
        parts: [
          { text: "import", cls: "kw" },
          { text: " { " },
          { text: "NoiseBG", cls: "fn" },
          { text: ", " },
          { text: "GlitchText", cls: "fn" },
          { text: " } " },
          { text: "from", cls: "kw" },
          { text: " " },
          { text: "'@sfux/field'", cls: "str" },
        ],
      },
      { type: "blank" },
      {
        type: "line",
        parts: [{ text: "<" }, { text: "NoiseBG", cls: "fn" }],
      },
      {
        type: "line",
        parts: [
          { text: "  " },
          { text: "intensity", cls: "cn" },
          { text: "={" },
          { text: "0.3", cls: "cn" },
          { text: "}" },
        ],
      },
      {
        type: "line",
        parts: [
          { text: "  " },
          { text: "reactive", cls: "cn" },
          { text: "=" },
          { text: '"cursor"', cls: "str" },
        ],
      },
      {
        type: "line",
        parts: [
          { text: "  " },
          { text: "color", cls: "cn" },
          { text: "=" },
          { text: '"oklch(0.6 0.28 330)"', cls: "str" },
        ],
      },
      { type: "line", parts: [{ text: "/>" }] },
      { type: "blank" },
      {
        type: "line",
        parts: [
          { text: "<" },
          { text: "GlitchText", cls: "fn" },
          { text: " " },
          { text: "trigger", cls: "cn" },
          { text: "=" },
          { text: '"hover"', cls: "str" },
          { text: ">" },
        ],
      },
      { type: "line", parts: [{ text: "  SIGNAL//FRAME\u2122" }] },
      {
        type: "line",
        parts: [
          { text: "</" },
          { text: "GlitchText", cls: "fn" },
          { text: ">" },
        ],
      },
    ],
    note: "FIELD EFFECTS AUTOMATICALLY RESPECT PREFERS-REDUCED-MOTION. USE fieldIntensity TO CONTROL VISUAL WEIGHT.",
    highlight: false,
  },
  {
    number: "05",
    title: "DEPLOY",
    description:
      "SIGNALFRAMEUX\u2122 IS FRAMEWORK-AGNOSTIC BUT OPTIMIZED FOR NEXT.JS + VERCEL. TREE-SHAKING ENSURES YOU ONLY SHIP THE COMPONENTS YOU USE. FIELD LAYER IS CODE-SPLIT AND LOADED ON DEMAND.",
    code: [
      { type: "comment", text: "# BUILD FOR PRODUCTION" },
      {
        type: "line",
        parts: [
          { text: "pnpm", cls: "fn" },
          { text: " build" },
        ],
      },
      { type: "blank" },
      { type: "comment", text: "# BUNDLE ANALYSIS" },
      {
        type: "line",
        parts: [
          { text: "pnpm", cls: "fn" },
          { text: " analyze" },
        ],
      },
      { type: "blank" },
      { type: "comment", text: "# CORE: ~12KB GZIPPED" },
      { type: "comment", text: "# COMPONENTS: ~3KB PER COMPONENT (AVG)" },
      { type: "comment", text: "# FIELD: ~8KB BASE + ~2KB PER EFFECT" },
    ],
    note: null,
    highlight: false,
  },
];

const CHECKLIST = [
  { label: "INSTALL @SFUX/CORE AND DEPENDENCIES", done: true, status: "COMPLETE" },
  { label: "WRAP APP IN SFUXPROVIDER", done: true, status: "COMPLETE" },
  { label: "IMPORT AND USE SIGNAL COMPONENTS", done: true, status: "COMPLETE" },
  { label: "CONFIGURE OKLCH TOKEN OVERRIDES", done: false, status: "OPTIONAL" },
  { label: "ENABLE FIELD LAYER EFFECTS", done: false, status: "OPTIONAL" },
  { label: "SET UP STORYBOOK FOR DEVELOPMENT", done: false, status: "RECOMMENDED" },
];

const NEXT_CARDS = [
  {
    title: "BROWSE COMPONENTS",
    description:
      "EXPLORE ALL 340+ SIGNAL AND FIELD COMPONENTS WITH LIVE PREVIEWS AND CODE EXAMPLES.",
    arrow: "COMPONENT LIBRARY",
    href: "/components",
  },
  {
    title: "API REFERENCE",
    description:
      "DIVE INTO THE FULL API \u2014 PROPS, HOOKS, TOKENS, AND THE PROGRAMMABLE SURFACE.",
    arrow: "API DOCS",
    href: "/api",
  },
  {
    title: "TOKEN EXPLORER",
    description:
      "VISUALIZE AND CUSTOMIZE THE OKLCH COLOR SCALES, SPACING, TYPE, AND MOTION TOKENS.",
    arrow: "TOKEN EXPLORER",
    href: "/tokens",
  },
];

type CodePart = { text: string; cls?: string };
type CodeLine =
  | { type: "comment"; text: string }
  | { type: "blank" }
  | { type: "line"; parts: CodePart[] };

const COLOR_MAP: Record<string, string> = {
  kw: "text-[#FF0090]",
  str: "text-[#FFE500]",
  fn: "text-[#00FF00]",
  cm: "text-[#555]",
  cn: "text-[#FF6B6B]",
};

function CodeBlock({ lines }: { lines: CodeLine[] }) {
  return (
    <div className="relative bg-[#111] p-5 pr-6 font-mono text-[13px] leading-[1.7] overflow-x-auto shadow-[inset_0_1px_3px_rgba(0,0,0,0.15)]">
      <span className="absolute top-1.5 right-2.5 text-[8px] text-[#888] uppercase tracking-[0.3em]">
        TERMINAL&trade;
      </span>
      <code>
        {lines.map((line, i) => {
          if (line.type === "blank") return <br key={i} />;
          if (line.type === "comment")
            return (
              <div key={i} className="text-[#555]">
                {line.text}
              </div>
            );
          return (
            <div key={i} className="text-[#00FF00]">
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
    </div>
  );
}

const GRAIN_BG_STYLE = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
  backgroundSize: "150px 150px",
};

const MARQUEE_STYLE = {
  fontFamily: "var(--font-display)",
  fontSize: "16px",
  animation: "sf-marquee-scroll 12s linear infinite",
};

export default function StartPage() {
  return (
    <>
      <Nav />
      <main className="mt-[83px]">
        {/* ═══ HERO ═══ */}
        <section className="bg-black text-white py-[clamp(48px,8vw,80px)] px-[clamp(20px,4vw,48px)] border-b-4 border-foreground">
          <h1
            className="text-[clamp(48px,11vw,120px)] leading-[0.9] uppercase mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            GET
            <br />
            <span className="text-[#FF0090]">STARTED</span>
          </h1>
          <p className="text-[16px] text-[#888] uppercase tracking-[0.2em] max-w-[600px] leading-[1.5]">
            FROM ZERO TO SIGNAL//FRAME&trade; IN 5 MINUTES. ACCEPT THE
            INTERFACE INTO YOUR LIFE.
          </p>
          <p className="mt-6 text-[11px] text-[#FF0090] uppercase tracking-[0.15em]">
            &bull; ESTIMATED TIME: 5 MIN &bull; SIGNALFRAMEUX V2.0
          </p>
        </section>

        {/* ═══ STEPS ═══ */}
        {STEPS.map((step) => (
          <div
            key={step.number}
            className="grid grid-cols-[60px_1fr] md:grid-cols-[80px_1fr] border-b-[3px] border-foreground min-h-[200px]"
          >
            {/* Step number column */}
            <div
              className={`flex items-center justify-center border-r-[3px] border-foreground transition-colors duration-200 ${
                step.highlight
                  ? "bg-[var(--sf-yellow)] text-[#333]"
                  : "bg-black text-white hover:bg-[#FF0090]"
              }`}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(24px, 4vw, 48px)",
              }}
            >
              {step.number}
            </div>

            {/* Step content column */}
            <div
              className={`py-10 px-[clamp(20px,4vw,48px)] relative ${
                step.highlight ? "bg-[var(--sf-yellow)]" : ""
              }`}
            >
              {/* Grain overlay for yellow step */}
              {step.highlight && (
                <div
                  className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
                  style={GRAIN_BG_STYLE}
                />
              )}
              <h2
                className={`uppercase leading-none mb-4 ${
                  step.highlight ? "text-[#333]" : "text-foreground"
                }`}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(24px, 4vw, 48px)",
                }}
              >
                {step.title}
              </h2>
              <p
                className={`text-[13px] leading-[1.8] max-w-[600px] mb-5 ${
                  step.highlight ? "text-[#333]" : "text-[#333] dark:text-[#ccc]"
                }`}
              >
                {step.description}
              </p>
              <CodeBlock lines={step.code as CodeLine[]} />
              {step.note && (
                <div className="mt-4 text-[11px] text-[#888] uppercase tracking-[0.1em] py-3 px-4 border-l-[3px] border-[#FF0090]">
                  {step.note}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* ═══ CHECKLIST ═══ */}
        <section className="border-b-[3px] border-foreground py-10 px-[clamp(20px,4vw,48px)]">
          <h2
            className="uppercase mb-6"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(24px, 4vw, 48px)",
            }}
          >
            SETUP_CHECKLIST
          </h2>
          <div>
            {CHECKLIST.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 py-3 border-b border-[#ddd] dark:border-[#333] text-[13px] uppercase tracking-[0.08em]"
              >
                <div
                  className={`w-5 h-5 border-2 flex items-center justify-center text-[14px] shrink-0 ${
                    item.done
                      ? "bg-[#FF0090] border-[#FF0090] text-white"
                      : "border-foreground"
                  }`}
                >
                  {item.done ? "\u2713" : ""}
                </div>
                <div className="flex-1">{item.label}</div>
                <div className="text-[9px] text-[#888] tracking-[0.15em]">
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ NEXT STEPS ═══ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 border-b-[3px] border-foreground">
          {NEXT_CARDS.map((card, i) => (
            <Link
              key={card.title}
              href={card.href}
              className={`group relative overflow-hidden py-10 px-8 transition-all duration-150 no-underline text-foreground ${
                i < NEXT_CARDS.length - 1
                  ? "border-b-[3px] sm:border-b-0 sm:border-r-[3px] border-foreground"
                  : ""
              } hover:bg-black hover:text-white`}
            >
              {/* Animated border lines */}
              <span className="absolute top-0 left-0 h-[2px] bg-[#FF0090] w-0 group-hover:w-full transition-all duration-100" />
              <span className="absolute top-0 right-0 w-[2px] bg-[#FF0090] h-0 group-hover:h-full transition-all duration-100 delay-100" />
              <span className="absolute bottom-0 right-0 h-[2px] bg-[#FF0090] w-0 group-hover:w-full transition-all duration-100 delay-200" />
              <span className="absolute bottom-0 left-0 w-[2px] bg-[#FF0090] h-0 group-hover:h-full transition-all duration-100 delay-300" />

              <h3
                className="uppercase text-[15px] mb-3 transition-colors duration-150 group-hover:text-[#FF0090]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {card.title}
              </h3>
              <p className="text-[12px] text-[#333] dark:text-[#888] leading-[1.7] transition-colors duration-150 group-hover:text-[#888]">
                {card.description}
              </p>
              <div className="mt-4 text-[11px] text-[#FF0090] uppercase tracking-[0.15em]">
                &rarr; {card.arrow}
              </div>
            </Link>
          ))}
        </div>

        {/* ═══ COMMUNITY BAND ═══ */}
        <section className="bg-[var(--sf-yellow)] border-b-[3px] border-foreground relative overflow-hidden">
          {/* Grain overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
            style={GRAIN_BG_STYLE}
          />

          {/* Marquee */}
          <div className="h-8 overflow-hidden relative z-[1]">
            <div
              className="flex whitespace-nowrap uppercase tracking-[0.15em] leading-8 text-[#333] sf-marquee-track"
              style={MARQUEE_STYLE}
            >
              {[...Array(4)].map((_, i) => (
                <span key={i} className="inline-block pr-12">
                  OPEN SOURCE // BUILT BY ENGINEERS // WORK BUILD SIGNAL REPEAT
                  //
                </span>
              ))}
            </div>
          </div>

          <div className="py-10 px-[clamp(20px,4vw,48px)] relative z-[1]">
            <h2
              className="uppercase text-[#333] mb-3"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(24px, 4vw, 48px)",
              }}
            >
              JOIN THE SIGNAL&trade;
            </h2>
            <p className="text-[14px] leading-[1.7] text-[#333] max-w-[700px]">
              SignalframeUX&trade; is open source. Built by people who believe
              design systems should be{" "}
              <a
                href="#"
                className="text-[#E91E63] no-underline hover:underline"
              >
                programmable surfaces
              </a>
              , not static pattern libraries. Work. Build. Signal.
              Repeat.&trade;
            </p>
            <div className="mt-5 flex gap-4">
              <a
                href="#"
                className="text-[12px] font-bold uppercase tracking-[0.15em] py-3 px-6 bg-[#333] text-[var(--sf-yellow)] no-underline transition-all duration-150 hover:bg-black hover:text-[#FF0090]"
              >
                GITHUB
              </a>
              <a
                href="#"
                className="text-[12px] font-bold uppercase tracking-[0.15em] py-3 px-6 bg-[#333] text-[var(--sf-yellow)] no-underline transition-all duration-150 hover:bg-black hover:text-[#FF0090]"
              >
                STORYBOOK
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
