import type { ReactNode } from "react";

// 8-sided clip-path polygon — chamfered rectangle.
// Corner cuts sized as a percentage of the smaller axis.
export function HudOctagonFrame({
  children,
  corner = 24,
  className = "",
}: {
  children: ReactNode;
  corner?: number; // px
  className?: string;
}) {
  const c = `${corner}px`;
  return (
    <div
      data-plate="cyber2k-octagon"
      className={`relative ${className}`}
      style={{
        clipPath: `polygon(
          ${c} 0,
          calc(100% - ${c}) 0,
          100% ${c},
          100% calc(100% - ${c}),
          calc(100% - ${c}) 100%,
          ${c} 100%,
          0 calc(100% - ${c}),
          0 ${c}
        )`,
        border: "1px solid oklch(0.95 0 0 / 0.5)",
        background: "transparent",
      }}
    >
      {/* Corner ticks */}
      <span aria-hidden="true" className="absolute top-2 left-2 w-3 h-px bg-white/50" />
      <span aria-hidden="true" className="absolute top-2 left-2 h-3 w-px bg-white/50" />
      <span aria-hidden="true" className="absolute top-2 right-2 w-3 h-px bg-white/50" />
      <span aria-hidden="true" className="absolute top-2 right-2 h-3 w-px bg-white/50" />
      <span aria-hidden="true" className="absolute bottom-2 left-2 w-3 h-px bg-white/50" />
      <span aria-hidden="true" className="absolute bottom-2 left-2 h-3 w-px bg-white/50" />
      <span aria-hidden="true" className="absolute bottom-2 right-2 w-3 h-px bg-white/50" />
      <span aria-hidden="true" className="absolute bottom-2 right-2 h-3 w-px bg-white/50" />
      {children}
    </div>
  );
}
