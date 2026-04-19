"use client";

import Link from "next/link";

export type DossierRoute =
  | "kloroform"
  | "cyber2k"
  | "brando"
  | "blackflag"
  | "diagrams2"
  | "helghanese";

type Entry = {
  route: DossierRoute;
  code: string;
  href: string;
};

const ENTRIES: Entry[] = [
  { route: "kloroform", code: "SF//KLO-00", href: "/" },
  { route: "cyber2k", code: "SF//HUD-00", href: "/system" },
  { route: "brando", code: "SF//MRK-00", href: "/reference" },
  { route: "blackflag", code: "SF//E00-00", href: "/inventory" },
  { route: "diagrams2", code: "SF//DGM-00", href: "/builds" },
  { route: "helghanese", code: "SF//HLG-00", href: "/init" },
];

export function CatalogNav({ active }: { active: DossierRoute }) {
  const activeColor =
    active === "helghanese"
      ? "oklch(0.8 0.2 135)" // lime-green parallel-world break
      : "oklch(0.65 0.3 350)"; // magenta default

  return (
    <nav aria-label="Dossier catalog" className="flex flex-wrap gap-x-3 gap-y-1">
      {ENTRIES.map((e, i) => {
        const isActive = e.route === active;
        return (
          <span key={e.route} className="flex items-center gap-x-3">
            <Link
              href={e.href}
              aria-current={isActive ? "page" : undefined}
              className="no-underline transition-colors"
              style={{
                color: isActive ? activeColor : "oklch(0.55 0 0)",
                textDecoration: isActive ? "underline" : "none",
                textUnderlineOffset: "3px",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = "oklch(0.95 0 0)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = "oklch(0.55 0 0)";
              }}
            >
              {e.code}
            </Link>
            {i < ENTRIES.length - 1 ? (
              <span aria-hidden="true" style={{ color: "oklch(0.35 0 0)" }}>
                ·
              </span>
            ) : null}
          </span>
        );
      })}
    </nav>
  );
}
