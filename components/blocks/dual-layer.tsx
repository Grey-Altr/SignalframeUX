const FRAME_TAGS = ["LAYOUT", "TYPOGRAPHY", "COLOR", "SPACING", "MOTION"];
const SIGNAL_TAGS = ["GENERATIVE", "PARAMETRIC", "DATA-DRIVEN", "CANVAS", "SHADER"];

export function DualLayer() {
  return (
    <section data-anim="section-reveal" className="grid grid-cols-1 md:grid-cols-2 border-b-4 border-foreground">
      {/* Left — FRAME (white, structural) */}
      <div className="px-[clamp(24px,5vw,48px)] py-[clamp(24px,5vw,60px)] border-r-0 md:border-r-4 border-foreground relative">
        <h2
          className="sf-display text-[clamp(48px,6vw,80px)] leading-none tracking-[-0.02em] text-foreground mb-6"
        >
          FRAME
        </h2>
        <p className="text-[var(--text-base)] leading-[1.8] max-w-[440px] uppercase tracking-[0.08em] text-foreground/70">
          THE STRUCTURAL LOGIC LAYER. GRID CONTROL.
          STYLE CONTROL. TYPOGRAPHY. SEMANTIC TOKENS.
          EVERYTHING THE USER READS AND NAVIGATES.
          ZERO AMBIGUITY. FULL PREDICTABILITY.
        </p>
        <div className="flex flex-wrap gap-2 mt-8">
          {FRAME_TAGS.map((tag) => (
            <span
              key={tag}
              data-anim="tag"
                           className="border border-foreground px-3 py-1.5 text-[var(--text-xs)] uppercase tracking-[0.15em] text-foreground inline-block"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Right — //SIGNAL (black, generative) */}
      <div className="bg-foreground dark:bg-[var(--sf-darker-surface)] px-[clamp(24px,5vw,48px)] py-[clamp(24px,5vw,60px)]">
        <h2
          className="sf-display text-[clamp(48px,6vw,80px)] leading-none tracking-[-0.02em] text-primary mb-6"
        >
          //SIGNAL
        </h2>
        <p className="text-[var(--text-base)] leading-[1.8] max-w-[440px] uppercase tracking-[0.08em] text-[var(--sf-muted-text-dark)] dark:text-muted-foreground">
          THE GENERATIVE EXPRESSION LAYER. PARAMETRIC NOISE.
          DATA-REACTIVE VISUALS. CANVAS OVERLAYS.
          EVERYTHING THE USER FEELS BUT DOESN&apos;T CLICK.
          NEVER INTERFERES WITH READABILITY.
        </p>
        <div className="flex flex-wrap gap-2 mt-8">
          {SIGNAL_TAGS.map((tag) => (
            <span
              key={tag}
              data-anim="tag"
                           className="border border-[var(--sf-subtle-border)] dark:border-[var(--sf-dim-text)] px-3 py-1.5 text-[var(--text-xs)] uppercase tracking-[0.15em] text-[var(--sf-muted-text-dark)] dark:text-muted-foreground inline-block"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
