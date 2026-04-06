import { CodeTypewriter, type CodeLine } from "@/components/animation/code-typewriter";
import { XrayReveal } from "@/components/animation/xray-reveal";

/** Code lines for the typewriter reveal */
const CODE_LINES: CodeLine[] = [
  { text: "// INITIALIZE SIGNALFRAMEUX™", color: "var(--sf-dim-text)" },
  { text: "import { createSignalframeUX } from '@sfux/core'" },
  { text: "" },
  { text: "const sfux = createSignalframeUX({" },
  { text: "  theme: 'dark',", color: "var(--sf-yellow)" },
  { text: "  tokens: 'oklch',", color: "var(--sf-yellow)" },
  { text: "  frame: {" },
  { text: "    enabled: true,", color: "var(--sf-code-const)" },
  { text: "    intensity: 0.6,", color: "var(--sf-code-const)" },
  { text: "    reactive: 'cursor'", color: "var(--sf-yellow)" },
  { text: "  }" },
  { text: "})" },
  { text: "" },
  { text: "// ACCESS ANY COMPONENT", color: "var(--sf-dim-text)" },
  { text: "const btn = sfux.component('Button')" },
  { text: "btn.render({ variant: 'signal' })" },
];

/** Annotation layer — token values revealed via X-ray cursor */
const ANNOTATION_LINES: CodeLine[] = [
  { text: "" },
  { text: "// ← @sfux/core v2.1.0 — 12KB gzipped", color: "var(--color-primary)" },
  { text: "" },
  { text: "// ← Returns SFUXInstance", color: "var(--color-primary)" },
  { text: "// ← oklch(0.145 0 0) — foreground base", color: "var(--color-primary)" },
  { text: "// ← 49 OKLCH scales auto-generated", color: "var(--color-primary)" },
  { text: "" },
  { text: "// ← Frame layer active", color: "var(--color-primary)" },
  { text: "// ← 0–1 float, maps to --sf-grain-opacity", color: "var(--color-primary)" },
  { text: "// ← 'cursor' | 'scroll' | 'audio'", color: "var(--color-primary)" },
  { text: "" },
  { text: "" },
  { text: "" },
  { text: "" },
  { text: "// ← Returns ComponentAPI<Button>", color: "var(--color-primary)" },
  { text: "// ← Renders to nearest SFUXProvider", color: "var(--color-primary)" },
];

export function CodeSection() {
  return (
    <section data-anim="section-reveal" aria-label="API initialization example" className="grid grid-cols-1 md:grid-cols-2 border-b-4 border-foreground">
      {/* Left — Description */}
      <div className="px-[clamp(24px,5vw,48px)] py-[clamp(24px,5vw,60px)] border-r-0 md:border-r-4 border-foreground">
        <h2
          className="sf-display text-[clamp(40px,5vw,64px)] leading-none text-foreground mb-6"
        >
          API_INIT
        </h2>
        <p className="text-base leading-[1.8] text-muted-foreground max-w-[440px]">
          SIGNALFRAMEUX OPERATES AS A PROGRAMMABLE API.
          INITIALIZE WITH A CONFIG OBJECT. EVERY TOKEN,
          COMPONENT, AND FRAME EFFECT IS ADDRESSABLE
          THROUGH A UNIFIED INTERFACE.
        </p>
        <p className="mt-4 text-[var(--text-xs)] uppercase tracking-[0.15em] text-primary font-bold hidden md:block">
          ◎ HOVER CODE TO REVEAL ANNOTATIONS
        </p>
      </div>

      {/* Right — Code block with typewriter + X-ray annotations */}
      <div className="bg-[var(--sf-code-bg)] px-8 py-12 relative overflow-hidden" style={{ boxShadow: "var(--sf-inset-shadow)" }}>
        {/* Terminal label */}
        <div className="absolute top-4 right-6 text-sm uppercase tracking-[0.2em] text-[var(--sf-dim-text)] font-bold z-[3]">
          TERMINAL™
        </div>

        <XrayReveal
          radius={100}
          className="mt-4"
          topLayer={
            <CodeTypewriter
              lines={CODE_LINES}
              lineDelay={80}
              cursorColor="var(--color-primary)"
            />
          }
          bottomLayer={
            <div className="bg-[var(--sf-code-bg)]">
              <pre className="text-base leading-[1.7] font-mono overflow-x-auto">
                <code>
                  {ANNOTATION_LINES.map((line, i) => (
                    <div key={i} style={{ color: line.color || "var(--sf-muted-text-dark)" }}>
                      {line.text || "\u00A0"}
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          }
        />
      </div>
    </section>
  );
}
