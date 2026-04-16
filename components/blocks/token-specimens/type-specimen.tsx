import { cn } from "@/lib/utils";

type TypeToken = {
  name: string;
  sample: string;
  font: string;
  size: number;
  weight: number;
  meta: string;
  uppercase?: boolean;
  code?: boolean;
};

interface TypeSpecimenProps {
  tokens: TypeToken[];
}

/**
 * Type scale as specimen sheet -- Brody/Fuse register.
 * Each step shown as a sample rendered at its full token size, with metadata callouts
 * in small monospaced type. No tables. Samples run flush-left, metadata flush-right.
 *
 * Server Component (no interactivity).
 */
export function TypeSpecimen({ tokens }: TypeSpecimenProps) {
  return (
    <div className="border-b-4 border-foreground sf-halftone" data-halftone>
      <div className="sf-display px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] pt-[var(--sfx-space-8)] pb-[var(--sfx-space-4)] border-b-2 border-foreground" style={{ fontSize: "clamp(32px, calc(5*var(--sf-vw)), 48px)" }}>
        TYPE_SCALE ( MINOR THIRD &middot; 1.2 )
      </div>

      <div className="divide-y divide-foreground/15">
        {tokens.map((t) => (
          <div
            key={t.name}
            data-type-sample={t.name}
            className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-[var(--sfx-space-4)] md:gap-[var(--sfx-space-8)] px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] py-10 items-baseline"
          >
            <div
              className={cn(
                "overflow-hidden whitespace-nowrap text-ellipsis",
                t.uppercase && "uppercase tracking-[0.15em]",
                t.code && "font-mono",
              )}
              style={{
                fontFamily: t.font,
                fontSize: `${t.size}px`,
                fontWeight: t.weight,
                lineHeight: 1,
                ...(t.code
                  ? {
                      color: "var(--sf-code-text)",
                      background: "var(--sf-code-bg)",
                      padding: "8px 12px",
                      display: "inline-block",
                    }
                  : {}),
              }}
            >
              {t.sample}
            </div>

            <div className="font-mono text-[var(--text-2xs)] uppercase tracking-[0.2em] text-muted-foreground md:text-right space-y-1 shrink-0">
              <div className="text-foreground font-bold">{t.name}</div>
              <div className="tabular-nums">{t.size}PX</div>
              <div className="tabular-nums">{(t.size / 16).toFixed(3)}REM</div>
              <div className="opacity-70">{t.meta}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
