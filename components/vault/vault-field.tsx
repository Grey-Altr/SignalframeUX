import React from "react";
import { cn } from "@/lib/utils";

interface VaultFieldProps extends React.ComponentProps<"section"> {
  bleed?: "viewport" | "section" | "auto";
  grain?: "soft" | "strong" | "dither";
  scanlines?: boolean;
  pack?: string;
}

/*
 * Vault ground primitive. Tiers above CdBField:
 *   grain="soft"    — FBM noise floor (default cdB level)
 *   grain="strong"  — heavier FBM, visible static texture
 *   grain="dither"  — Vanzyst MULTICOLORED: red/blue/yellow pixel dither
 *                     layered over black substrate
 *   scanlines=true  — Cyber2k acetate substrate overlay
 *
 * The `pack` prop stamps a small corner label (e.g., "KLOROFORM /
 * POINTCLOUD") so each section self-identifies which vault pack
 * it's channeling — a living catalog citation.
 */
export function VaultField({
  bleed = "section",
  grain = "soft",
  scanlines = false,
  pack,
  className,
  children,
  ...props
}: VaultFieldProps) {
  return (
    <section
      data-vault-field
      data-pack={pack}
      className={cn(
        "relative bg-[var(--cdb-black)] text-[var(--cdb-paper)] overflow-hidden",
        bleed === "viewport" && "min-h-screen",
        bleed === "section" && "min-h-[80vh]",
        className
      )}
      {...props}
    >
      {/* FBM grain floor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${grain === "strong" ? 1.1 : 0.9}' numOctaves='${grain === "strong" ? 3 : 2}' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/></svg>")`,
          opacity: grain === "strong" ? 0.09 : 0.04,
        }}
      />
      {/* Vanzyst MULTICOLORED dither — layered RGB pixel erosion */}
      {grain === "dither" && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 mix-blend-screen"
            style={{
              backgroundImage: `radial-gradient(var(--vault-red) 1px, transparent 1px), radial-gradient(var(--vault-blue) 1px, transparent 1px), radial-gradient(var(--vault-yellow) 1px, transparent 1px)`,
              backgroundSize: `11px 11px, 13px 13px, 17px 17px`,
              backgroundPosition: `0 0, 3px 5px, 6px 2px`,
              opacity: 0.18,
            }}
          />
        </>
      )}
      {/* Cyber2k scanlines */}
      {scanlines && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent 0 2px, rgba(250,250,250,0.055) 2px 3px)`,
          }}
        />
      )}
      {/* pack citation — bottom-right of section */}
      {pack && (
        <div className="pointer-events-none absolute bottom-3 right-4 z-20 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.16em] text-[var(--cdb-paper)]/45">
          {pack}
        </div>
      )}
      {children}
    </section>
  );
}
