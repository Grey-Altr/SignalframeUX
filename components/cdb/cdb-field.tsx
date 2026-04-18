import React from "react";
import { cn } from "@/lib/utils";

interface CdBFieldProps extends React.ComponentProps<"section"> {
  grain?: boolean;
  bleed?: "viewport" | "section";
}

/*
 * cdB ground primitive. Pure-black field with SVG feTurbulence grain
 * floor. The cdB grammar requires substrate truth: no gradient backdrop,
 * no soft-grey, grain visible under every form. Grain opacity held at
 * 0.04 via --cdb-grain token — below this the field reads flat, above
 * it reads distressed.
 */
export function CdBField({
  grain = true,
  bleed = "section",
  className,
  children,
  ...props
}: CdBFieldProps) {
  return (
    <section
      data-cdb-field
      className={cn(
        "relative bg-[var(--cdb-black)] text-[var(--cdb-paper)] overflow-hidden",
        bleed === "viewport" && "min-h-screen",
        className
      )}
      {...props}
    >
      {grain && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-screen"
          style={{
            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/></svg>")`,
            opacity: "var(--cdb-grain-opacity, 0.04)",
          }}
        />
      )}
      {children}
    </section>
  );
}
