import type { ReactNode } from "react";
import { CornerLabel } from "./corner-label";
import { CatalogNav, DOSSIER_CODE, type DossierRoute } from "./catalog-nav";

export type Substrate = "black" | "paper-cream" | "paper-warm";

const substrateStyle: Record<Substrate, { background: string; color: string }> = {
  black: { background: "oklch(0 0 0)", color: "oklch(0.95 0 0)" },
  "paper-cream": { background: "oklch(0.92 0.01 85)", color: "oklch(0.15 0 0)" },
  "paper-warm": { background: "oklch(0.9 0.02 70)", color: "oklch(0.2 0.08 28)" },
};

// Server-start ISO date — stable across SSR/CSR for one server process.
// Note: this re-evaluates on each cold start, not on each request, so it will
// shift across server restarts but won't cause hydration mismatches within a session.
const SERVER_START_DATE = new Date().toISOString().slice(0, 10);

export function DossierChrome({
  route,
  substrate = "black",
  children,
}: {
  route: DossierRoute;
  substrate?: Substrate;
  children: ReactNode;
}) {
  const s = substrateStyle[substrate];
  return (
    <div
      data-dossier-route={route}
      data-substrate={substrate}
      className="relative min-h-screen"
      style={
        {
          background: s.background,
          color: s.color,
          ["--dossier-ink" as string]: s.color,
          ["--dossier-substrate" as string]: s.background,
        } as React.CSSProperties
      }
    >
      <CornerLabel slot="tl">
        <div>SF//UX</div>
        <div style={{ opacity: 0.6 }}>{DOSSIER_CODE[route]}</div>
      </CornerLabel>

      <CornerLabel slot="tr">
        <div>LAX 34°03&apos;N 118°15&apos;W</div>
        <div style={{ opacity: 0.6 }}>{SERVER_START_DATE}</div>
      </CornerLabel>

      <CornerLabel slot="bl">
        <CatalogNav active={route} />
      </CornerLabel>

      <CornerLabel slot="br">
        <div>signalframe.culturedivision.com</div>
        <div style={{ opacity: 0.6 }}>v0.1 / CDB-V3</div>
      </CornerLabel>

      {children}
    </div>
  );
}
