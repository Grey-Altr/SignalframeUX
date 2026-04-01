"use client";

const SIGNAL_TAGS = ["LAYOUT", "TYPOGRAPHY", "COLOR", "SPACING", "MOTION"];
const FIELD_TAGS = ["GENERATIVE", "PARAMETRIC", "DATA-DRIVEN", "CANVAS", "SHADER"];

export function DualLayer() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 border-b-4 border-foreground">
      {/* Left — SIGNAL (white) */}
      <div className="px-[clamp(24px,5vw,48px)] py-[clamp(24px,5vw,60px)] border-r-0 md:border-r-4 border-foreground relative">
        <h2
          className="text-[clamp(48px,6vw,80px)] leading-none tracking-[-0.02em] text-foreground mb-6"
          style={{ fontFamily: "var(--font-display)" }}
        >
          SIGNAL
        </h2>
        <p className="text-[13px] leading-[1.8] max-w-[440px] uppercase tracking-[0.08em] text-foreground/70">
          THE DETERMINISTIC LOGIC LAYER. FIND CONTROL. GRID CONTROL.
          STYLE CONTROL. TYPOGRAPHY. SEMANTIC TOKENS.
          EVERYTHING THE USER READS AND NAVIGATES.
          ZERO AMBIGUITY. FULL PREDICTABILITY.
        </p>
        <div className="flex flex-wrap gap-2 mt-8">
          {SIGNAL_TAGS.map((tag) => (
            <span
              key={tag}
              className="sf-pressable border border-foreground px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-foreground cursor-default inline-block hover:border-2 hover:px-[11px] hover:py-[5px]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Right — //FIELD (black) */}
      <div className="bg-foreground px-[clamp(24px,5vw,48px)] py-[clamp(24px,5vw,60px)]">
        <h2
          className="text-[clamp(48px,6vw,80px)] leading-none tracking-[-0.02em] text-primary mb-6"
          style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
        >
          //FIELD
        </h2>
        <p className="text-[13px] leading-[1.8] max-w-[440px] uppercase tracking-[0.08em] text-[oklch(0.55_0_0)]">
          THE GENERATIVE EXPRESSION LAYER. PARAMETRIC NOISE.
          DATA-REACTIVE VISUALS. CANVAS OVERLAYS.
          EVERYTHING THE USER FEELS BUT DOESN&apos;T CLICK.
          NEVER INTERFERES WITH READABILITY.
        </p>
        <div className="flex flex-wrap gap-2 mt-8">
          {FIELD_TAGS.map((tag) => (
            <span
              key={tag}
              className="border border-[oklch(0.35_0_0)] px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-[oklch(0.55_0_0)] inline-block"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
