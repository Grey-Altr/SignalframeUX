interface GhostLabelProps {
  text: string;
  className?: string;
}

/**
 * Oversized background text marker — structural wayfinding, not decoration.
 * Anton display at 200–400px, 3–5% opacity, pointer-events none.
 * Positioned absolute behind section content.
 */
export function GhostLabel({ text, className }: GhostLabelProps) {
  return (
    <span
      aria-hidden="true"
      data-anim="ghost-label"
      className={`sf-display pointer-events-none select-none absolute leading-none ${className ?? ""}`}
      style={{ fontSize: "clamp(200px, 25vw, 400px)" }}
    >
      {text}
    </span>
  );
}
