import Link from "next/link";

export interface BreadcrumbSegment {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  segments: BreadcrumbSegment[];
  className?: string;
}

/**
 * Slash-separated breadcrumbs — terminal path convention.
 * SFUX / Components / Button / API
 * Current segment in magenta, links use sf-link-draw underline.
 */
export function Breadcrumb({ segments, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`px-6 md:px-12 py-3 border-b-2 border-foreground/20 ${className ?? ""}`}
    >
      <ol className="flex items-center gap-0 text-[var(--text-xs)] font-mono uppercase tracking-[0.15em] font-bold">
        {/* Always start with SFUX root */}
        <li>
          <Link href="/" className="sf-link-draw text-muted-foreground hover:text-foreground no-underline">
            SFUX
          </Link>
        </li>

        {segments.map((seg, i) => {
          const isLast = i === segments.length - 1;

          return (
            <li key={seg.label} className="flex items-center">
              <span className="mx-2 text-muted-foreground/50" aria-hidden="true">/</span>
              {isLast || !seg.href ? (
                <span className="text-primary" aria-current="page">
                  {seg.label}
                </span>
              ) : (
                <Link href={seg.href} className="sf-link-draw text-muted-foreground hover:text-foreground no-underline">
                  {seg.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
