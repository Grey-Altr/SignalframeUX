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
  { text: "    enabled: true,", color: "var(--sfx-code-const)" },
  { text: "    intensity: 0.6,", color: "var(--sfx-code-const)" },
  { text: "    reactive: 'cursor'", color: "var(--sf-yellow)" },
  { text: "  }" },
  { text: "})" },
  { text: "" },
  { text: "// ACCESS ANY COMPONENT", color: "var(--sf-dim-text)" },
  { text: "const btn = sfux.component('Button')" },
  { text: "btn.render({ variant: 'signal' })" },
];

/** Annotation layer — token values revealed via X-ray cursor.
 * Annotation color uses --sf-muted-text-dark (neutral) per Phase 34 magenta audit;
 * the 3 load-bearing anchor annotations keep var(--color-primary) accent to
 * mark the highest-signal system callouts. */
const ANNOTATION_ACCENT = "var(--color-primary)";
const ANNOTATION_MUTED = "var(--sf-muted-text-dark)";
const ANNOTATION_LINES: CodeLine[] = [
  { text: "" },
  { text: "// ← @sfux/core v2.1.0 — 12KB gzipped", color: ANNOTATION_ACCENT },
  { text: "" },
  { text: "// ← Returns SFUXInstance", color: ANNOTATION_MUTED },
  { text: "// ← oklch(0.145 0 0) — foreground base", color: ANNOTATION_ACCENT },
  { text: "// ← 49 OKLCH scales auto-generated", color: ANNOTATION_MUTED },
  { text: "" },
  { text: "// ← Frame layer active", color: ANNOTATION_MUTED },
  { text: "// ← 0–1 float, maps to --sf-grain-opacity", color: ANNOTATION_MUTED },
  { text: "// ← 'cursor' | 'scroll' | 'audio'", color: ANNOTATION_MUTED },
  { text: "" },
  { text: "" },
  { text: "" },
  { text: "" },
  { text: "// ← Returns ComponentAPI<Button>", color: ANNOTATION_MUTED },
  { text: "// ← Renders to nearest SFUXProvider", color: ANNOTATION_ACCENT },
];

export function CodeSection() {
  return (
    <section data-anim="section-reveal" aria-label="API initialization example" className="grid grid-cols-1 md:grid-cols-2 border-b-4 border-foreground">
      {/* Left — Description */}
      <div className="px-[clamp(24px,calc(5*var(--sf-vw)),48px)] py-[clamp(24px,calc(5*var(--sf-vw)),60px)] border-r-0 md:border-r-4 border-foreground">
        <h2
          className="sf-display text-[clamp(40px,calc(5*var(--sf-vw)),64px)] leading-none text-foreground mb-[var(--sfx-space-6)]"
        >
          API_INIT
        </h2>
        <p className="text-base leading-[1.8] text-muted-foreground max-w-[clamp(280px,calc(30.556*var(--sf-vw)),440px)]">
          SIGNALFRAMEUX OPERATES AS A PROGRAMMABLE API.
          INITIALIZE WITH A CONFIG OBJECT. EVERY TOKEN,
          COMPONENT, AND FRAME EFFECT IS ADDRESSABLE
          THROUGH A UNIFIED INTERFACE.
        </p>
        <p className="mt-[var(--sfx-space-4)] text-[var(--text-xs)] uppercase tracking-[0.15em] text-foreground font-bold hidden md:block">
          ◎ HOVER CODE TO REVEAL ANNOTATIONS
        </p>
      </div>

      {/* Right — Code block with typewriter + X-ray annotations */}
      <div className="bg-[var(--sfx-code-bg)] px-[var(--sfx-space-8)] py-[var(--sfx-space-12)] relative overflow-hidden" style={{ boxShadow: "var(--sfx-inset-shadow)" }}>
        {/* Terminal label */}
        <div className="absolute top-4 right-6 text-sm uppercase tracking-[0.2em] text-[var(--sf-dim-text)] font-bold z-[3]">
          TERMINAL™
        </div>

        <XrayReveal
          radius={100}
          className="mt-[var(--sfx-space-4)]"
          topLayer={
            <CodeTypewriter
              lines={CODE_LINES}
              lineDelay={80}
              cursorColor="var(--color-primary)"
            />
          }
          bottomLayer={
            <div className="bg-[var(--sfx-code-bg)]">
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
