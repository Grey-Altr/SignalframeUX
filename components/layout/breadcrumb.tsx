import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BreadcrumbSegment {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  segments: BreadcrumbSegment[];
  className?: string;
}

/**
 * Subpage breadcrumb -- monospaced coded register.
 *
 * Matches InstrumentHUD + ACQUISITION panel typography: font-mono,
 * text-[var(--text-2xs)], uppercase, tracking-[0.15em], no chevrons,
 * no rounded corners, no magenta. Format: [PARENT]//CURRENT where //
 * is rendered as plain monospace text (not an SVG icon).
 *
 * Phase 34 SP-05 bonus -- cdSB brief section SP-05.
 */
export function Breadcrumb({ segments, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "px-6 md:px-12 py-4 font-mono text-[var(--text-2xs)] uppercase tracking-[0.15em] text-muted-foreground border-b-2 border-foreground/20",
        className,
      )}
    >
      <ol className="flex items-center gap-2 list-none m-0 p-0">
        <li>
          <Link
            href="/"
            className="hover:text-foreground transition-colors no-underline"
          >
            [SFUX]
          </Link>
        </li>
        {segments.map((seg, i) => {
          const isLast = i === segments.length - 1;
          return (
            <li key={`${seg.label}-${i}`} className="flex items-center gap-2">
              <span aria-hidden="true">//</span>
              {seg.href && !isLast ? (
                <Link
                  href={seg.href}
                  className="hover:text-foreground transition-colors no-underline"
                >
                  [{seg.label}]
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={isLast ? "text-foreground" : undefined}
                >
                  [{seg.label}]
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
