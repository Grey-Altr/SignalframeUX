import type { ReactNode } from "react";
import { headers } from "next/headers";
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

// Studio location — used as the fallback when geo headers aren't available
// (local dev, non-Vercel deploys, missing-header edge cases).
const FALLBACK_LOCATION = { code: "LAX", coords: "34°03'N 118°15'W" };

function formatDMS(decimal: number, axis: "lat" | "lon"): string {
  const abs = Math.abs(decimal);
  const deg = Math.floor(abs);
  const min = Math.floor((abs - deg) * 60);
  const dir = axis === "lat" ? (decimal >= 0 ? "N" : "S") : (decimal >= 0 ? "E" : "W");
  return `${String(deg).padStart(2, "0")}°${String(min).padStart(2, "0")}'${dir}`;
}

async function resolveLocation(): Promise<{ code: string; coords: string }> {
  try {
    const h = await headers();
    const cityRaw = h.get("x-vercel-ip-city");
    const lat = h.get("x-vercel-ip-latitude");
    const lon = h.get("x-vercel-ip-longitude");
    if (!cityRaw || !lat || !lon) return FALLBACK_LOCATION;
    const city = decodeURIComponent(cityRaw);
    const code = city.replace(/[^a-zA-Z]/g, "").slice(0, 3).toUpperCase();
    const latNum = Number(lat);
    const lonNum = Number(lon);
    if (!code || !Number.isFinite(latNum) || !Number.isFinite(lonNum)) {
      return FALLBACK_LOCATION;
    }
    return { code, coords: `${formatDMS(latNum, "lat")} ${formatDMS(lonNum, "lon")}` };
  } catch {
    return FALLBACK_LOCATION;
  }
}

export async function DossierChrome({
  route,
  substrate = "black",
  children,
}: {
  route: DossierRoute;
  substrate?: Substrate;
  children: ReactNode;
}) {
  const s = substrateStyle[substrate];
  const location = await resolveLocation();
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
        <div>{location.code} {location.coords}</div>
        <div style={{ opacity: 0.6 }}>{SERVER_START_DATE}</div>
      </CornerLabel>

      {/* br before bl: on narrow viewports bl grows taller (wrapped catalog
          nav) and rectangularly overlaps br; rendering bl last lets its scrim
          win the z-stack so catalog links remain readable. */}
      <CornerLabel slot="br">
        <div>signalframe.culturedivision.com</div>
        <div style={{ opacity: 0.6 }}>v0.1 / CDB-V3</div>
      </CornerLabel>

      <CornerLabel slot="bl">
        <CatalogNav active={route} />
      </CornerLabel>

      {children}
    </div>
  );
}
