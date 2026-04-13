type MotionToken = {
  name: string;
  easing: string;
  duration: string;
  css: string;
};

interface MotionSpecimenProps {
  tokens: MotionToken[];
}

/**
 * Parse "cubic-bezier(x1, y1, x2, y2)" -> [x1, y1, x2, y2].
 * Falls back to named-easing approximations; ultimate fallback is [0, 0, 1, 1] (linear).
 */
function parseCubicBezier(
  easing: string,
): [number, number, number, number] {
  const m = easing.match(
    /cubic-bezier\s*\(\s*([\d.-]+)\s*,\s*([\d.-]+)\s*,\s*([\d.-]+)\s*,\s*([\d.-]+)\s*\)/,
  );
  if (m) {
    return [
      parseFloat(m[1]),
      parseFloat(m[2]),
      parseFloat(m[3]),
      parseFloat(m[4]),
    ];
  }
  const named: Record<string, [number, number, number, number]> = {
    linear: [0, 0, 1, 1],
    ease: [0.25, 0.1, 0.25, 1],
    "ease-in": [0.42, 0, 1, 1],
    "ease-out": [0, 0, 0.58, 1],
    "ease-in-out": [0.42, 0, 0.58, 1],
  };
  return named[easing.trim()] ?? [0, 0, 1, 1];
}

/**
 * Motion tokens as SVG cubic-bezier curve plots.
 * Each specimen shows the SHAPE of the motion -- not a marketing animation.
 * Grid + control point lines expose the bezier construction (truth to materials).
 *
 * Server Component -- pure static SVG, no state.
 */
export function MotionSpecimen({ tokens }: MotionSpecimenProps) {
  return (
    <div className="border-b-4 border-foreground sf-halftone" data-halftone>
      <div className="sf-display px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] pt-[var(--sfx-space-8)] pb-[var(--sfx-space-4)] border-b-2 border-foreground" style={{ fontSize: "clamp(32px, 5vw, 48px)" }}>
        MOTION_TOKENS
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/15 border-b border-foreground/15">
        {tokens.map((t) => {
          const [x1, y1, x2, y2] = parseCubicBezier(t.easing);
          // SVG viewBox 0..100 in X and Y, but Y axis inverted for top-left origin
          const cx1 = x1 * 100;
          const cy1 = 100 - y1 * 100;
          const cx2 = x2 * 100;
          const cy2 = 100 - y2 * 100;
          const d = `M 0 100 C ${cx1.toFixed(2)} ${cy1.toFixed(2)}, ${cx2.toFixed(2)} ${cy2.toFixed(2)}, 100 0`;
          return (
            <div
              key={t.name}
              data-motion-token={t.name}
              className="p-[var(--sfx-space-8)] bg-background font-mono space-y-4"
            >
              <svg
                viewBox="-10 -10 120 120"
                className="w-full h-auto text-foreground"
                aria-label={`${t.name} easing curve`}
                role="img"
              >
                {/* Frame */}
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="100"
                  stroke="currentColor"
                  strokeOpacity="0.25"
                  strokeWidth="0.5"
                />
                <line
                  x1="0"
                  y1="100"
                  x2="100"
                  y2="100"
                  stroke="currentColor"
                  strokeOpacity="0.25"
                  strokeWidth="0.5"
                />
                <line
                  x1="100"
                  y1="0"
                  x2="100"
                  y2="100"
                  stroke="currentColor"
                  strokeOpacity="0.1"
                  strokeWidth="0.5"
                  strokeDasharray="2"
                />
                <line
                  x1="0"
                  y1="0"
                  x2="100"
                  y2="0"
                  stroke="currentColor"
                  strokeOpacity="0.1"
                  strokeWidth="0.5"
                  strokeDasharray="2"
                />
                {/* Control-point tangents */}
                <line
                  x1="0"
                  y1="100"
                  x2={cx1}
                  y2={cy1}
                  stroke="currentColor"
                  strokeOpacity="0.35"
                  strokeWidth="0.5"
                />
                <line
                  x1="100"
                  y1="0"
                  x2={cx2}
                  y2={cy2}
                  stroke="currentColor"
                  strokeOpacity="0.35"
                  strokeWidth="0.5"
                />
                {/* Control points */}
                <circle
                  cx={cx1}
                  cy={cy1}
                  r="2"
                  fill="currentColor"
                  fillOpacity="0.6"
                />
                <circle
                  cx={cx2}
                  cy={cy2}
                  r="2"
                  fill="currentColor"
                  fillOpacity="0.6"
                />
                {/* Endpoints */}
                <circle cx="0" cy="100" r="1.5" fill="currentColor" />
                <circle cx="100" cy="0" r="1.5" fill="currentColor" />
                {/* The curve */}
                <path
                  data-motion-curve
                  d={d}
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>

              <div className="space-y-1 text-[var(--text-2xs)] uppercase tracking-[0.2em]">
                <div className="text-foreground font-bold">{t.name}</div>
                <div className="text-muted-foreground tabular-nums">
                  {t.duration}
                </div>
                <div className="text-muted-foreground truncate" title={t.easing}>
                  {t.easing}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
