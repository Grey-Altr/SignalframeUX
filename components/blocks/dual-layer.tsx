const FRAME_TAGS = ["LAYOUT", "TYPOGRAPHY", "COLOR", "SPACING", "MOTION"];
const SIGNAL_TAGS = ["GENERATIVE", "PARAMETRIC", "DATA-DRIVEN", "CANVAS", "SHADER"];

export function DualLayer() {
  return (
    <section data-anim="section-reveal" className="grid grid-cols-1 md:grid-cols-2 border-b-4 border-foreground">
      {/* Left — FRAME (white, structural) */}
      <div className="px-[clamp(24px,calc(5*var(--sf-vw)),48px)] py-[clamp(24px,calc(5*var(--sf-vw)),60px)] border-r-0 md:border-r-4 border-foreground relative">
        <h2
          className="sf-display text-[clamp(48px,calc(6*var(--sf-vw)),80px)] leading-none tracking-[-0.02em] text-foreground mb-[var(--sfx-space-6)]"
        >
          FRAME
        </h2>
        <p className="text-[var(--text-base)] leading-[1.8] max-w-[clamp(280px,calc(30.556*var(--sf-vw)),440px)] uppercase tracking-[0.08em] text-foreground/70">
          THE STRUCTURAL LOGIC LAYER. GRID CONTROL.
          STYLE CONTROL. TYPOGRAPHY. SEMANTIC TOKENS.
          EVERYTHING THE USER READS AND NAVIGATES.
          ZERO AMBIGUITY. FULL PREDICTABILITY.
        </p>
        <div className="flex flex-wrap gap-[var(--sfx-space-2)] mt-[var(--sfx-space-8)]">
          {FRAME_TAGS.map((tag) => (
            <span
              key={tag}
              data-anim="tag"
                           className="border border-foreground px-[var(--sfx-space-3)] py-[var(--sfx-space-1)] text-[var(--text-xs)] uppercase tracking-[0.15em] text-foreground inline-block"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Right — //SIGNAL (black, generative) */}
      <div className="bg-foreground dark:bg-[var(--sfx-darker-surface)] px-[clamp(24px,calc(5*var(--sf-vw)),48px)] py-[clamp(24px,calc(5*var(--sf-vw)),60px)]">
        <h2
          className="sf-display text-[clamp(48px,calc(6*var(--sf-vw)),80px)] leading-none tracking-[-0.02em] text-primary mb-[var(--sfx-space-6)]"
        >
          {"//SIGNAL"}
        </h2>
        <p className="text-[var(--text-base)] leading-[1.8] max-w-[clamp(280px,calc(30.556*var(--sf-vw)),440px)] uppercase tracking-[0.08em] text-[var(--sfx-muted-text-dark)] dark:text-muted-foreground">
          THE GENERATIVE EXPRESSION LAYER. PARAMETRIC NOISE.
          DATA-REACTIVE VISUALS. CANVAS OVERLAYS.
          EVERYTHING THE USER FEELS BUT DOESN&apos;T CLICK.
          NEVER INTERFERES WITH READABILITY.
        </p>
        <div className="flex flex-wrap gap-[var(--sfx-space-2)] mt-[var(--sfx-space-8)]">
          {SIGNAL_TAGS.map((tag) => (
            <span
              key={tag}
              data-anim="tag"
                           className="border border-[var(--sfx-subtle-border)] dark:border-[var(--sfx-dim-text)] px-[var(--sfx-space-3)] py-[var(--sfx-space-1)] text-[var(--text-xs)] uppercase tracking-[0.15em] text-[var(--sfx-muted-text-dark)] dark:text-muted-foreground inline-block"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
