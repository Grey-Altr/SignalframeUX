type SpacingToken = { name: string; rem: string; px: number };

interface SpacingSpecimenProps {
  tokens: SpacingToken[];
}

/**
 * Spacing scale as ruler/grid specimen.
 * Each stop is a horizontal bar with labeled measurement.
 * Inspired by architectural drawings -- blessed stops 4/8/12/16/24/32/48/64/96.
 *
 * Server Component (no client state, no interactivity).
 */
export function SpacingSpecimen({ tokens }: SpacingSpecimenProps) {
  const maxPx = Math.max(...tokens.map((t) => t.px));

  return (
    <div className="border-b-4 border-foreground sf-halftone" data-halftone>
      <div className="sf-display px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] pt-[var(--sfx-space-8)] pb-[var(--sfx-space-4)] border-b-2 border-foreground" style={{ fontSize: "clamp(32px, 5vw, 48px)" }}>
        SPACING_SCALE
      </div>

      <div className="px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] py-[var(--sfx-space-12)] font-mono">
        <div className="grid grid-cols-[120px_1fr_80px] gap-[var(--sfx-space-6)] text-[var(--text-2xs)] uppercase tracking-[0.2em] text-muted-foreground pb-[var(--sfx-space-4)] border-b border-foreground/20">
          <span>TOKEN</span>
          <span>RULER</span>
          <span className="text-right">PX</span>
        </div>

        <div className="divide-y divide-foreground/10">
          {tokens.map((t) => {
            const widthPct = (t.px / maxPx) * 100;
            const tickCount = Math.ceil(maxPx / 4);
            return (
              <div
                key={t.name}
                data-spacing-token={t.name}
                className="grid grid-cols-[120px_1fr_80px] gap-[var(--sfx-space-6)] items-center py-[var(--sfx-space-6)]"
              >
                <div className="flex flex-col">
                  <span className="text-[var(--text-sm)] font-bold text-foreground uppercase tracking-[0.1em]">
                    {t.name}
                  </span>
                  <span className="text-[var(--text-2xs)] text-muted-foreground">
                    {t.rem}
                  </span>
                </div>

                <div className="relative h-8 flex items-center">
                  {/* Tick marks every 4px (under the bar) */}
                  <div
                    className="absolute inset-x-0 bottom-0 flex items-end pointer-events-none"
                    aria-hidden="true"
                  >
                    {Array.from({ length: tickCount + 1 }).map((_, i) => {
                      const isMajor = i % 4 === 0;
                      return (
                        <span
                          key={i}
                          className={isMajor ? "w-px bg-foreground/30" : "w-px bg-foreground/10"}
                          style={{
                            height: isMajor ? "8px" : "4px",
                            marginLeft: i === 0 ? 0 : `calc(${(4 / maxPx) * 100}% - 1px)`,
                          }}
                        />
                      );
                    })}
                  </div>
                  {/* The actual spacing bar */}
                  <div
                    className="h-4 bg-foreground relative z-10"
                    style={{ width: `${widthPct}%` }}
                    role="img"
                    aria-label={`${t.px} pixels`}
                  />
                </div>

                <span className="text-right text-[var(--text-sm)] text-muted-foreground tabular-nums">
                  {t.px}PX
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
