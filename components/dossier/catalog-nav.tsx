import Link from "next/link";
import { cn } from "@/lib/utils";

export type DossierRoute =
  | "kloroform"
  | "cyber2k"
  | "brando"
  | "blackflag"
  | "diagrams2"
  | "helghanese";

export const DOSSIER_ENTRIES = [
  { route: "kloroform", code: "SF//KLO-00", href: "/" },
  { route: "cyber2k", code: "SF//HUD-00", href: "/system" },
  { route: "brando", code: "SF//MRK-00", href: "/reference" },
  { route: "blackflag", code: "SF//E00-00", href: "/inventory" },
  { route: "diagrams2", code: "SF//DGM-00", href: "/builds" },
  { route: "helghanese", code: "SF//HLG-00", href: "/init" },
] as const satisfies ReadonlyArray<{ route: DossierRoute; code: string; href: string }>;

export const DOSSIER_CODE: Record<DossierRoute, string> =
  Object.fromEntries(DOSSIER_ENTRIES.map((e) => [e.route, e.code])) as Record<DossierRoute, string>;

export function CatalogNav({ active }: { active: DossierRoute }) {
  const activeColor =
    active === "helghanese"
      ? "var(--dossier-nav-active-break)"
      : "var(--dossier-nav-active)";

  return (
    <nav aria-label="Dossier catalog" className="flex flex-wrap gap-x-3 gap-y-1">
      {DOSSIER_ENTRIES.map((entry, idx) => {
        const isActive = entry.route === active;
        return (
          <span key={entry.route} className="flex items-center gap-x-3">
            <Link
              href={entry.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "no-underline transition-colors inline-flex items-center min-h-6",
                isActive
                  ? "underline underline-offset-[3px]"
                  : "hover:text-[color:var(--dossier-nav-hover)]",
              )}
              style={{
                color: isActive ? activeColor : "var(--dossier-nav-idle)",
              }}
            >
              {entry.code}
            </Link>
            {idx < DOSSIER_ENTRIES.length - 1 ? (
              <span aria-hidden="true" style={{ color: "var(--dossier-nav-sep)" }}>
                ·
              </span>
            ) : null}
          </span>
        );
      })}
    </nav>
  );
}
