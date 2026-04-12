/**
 * AcquisitionSection — terminal instrument panel section.
 *
 * Server Component. The only interactive element (copy trigger) is isolated
 * into AcquisitionCopyButton ('use client') to keep this file fully static.
 *
 * Design intent: the last thing a user sees before the footer — must feel
 * like a terminal session that ended, not an invitation. No CTA energy.
 * `npx signalframeux init` is the entire pitch in one line.
 *
 * Constraints:
 *   - data-acquisition-root on section root (required by Phase 33 AQ-04 test)
 *   - maxHeight: '50vh' hard cap — if content exceeds 50vh it clips (overflow-hidden)
 *   - Zero border-radius, no styled buttons, no CTA copy
 *   - Stats sourced from SYSTEM_STATS — single source of truth
 *   - Two text anchors only: → /init and → /inventory (no buttons)
 *
 * @module components/blocks/acquisition-section
 */

import Link from "next/link";
import { SYSTEM_STATS } from "@/lib/system-stats";
import { AcquisitionCopyButton } from "./acquisition-copy-button";
import { CDSymbol } from "@/components/sf/cd-symbol";

export function AcquisitionSection() {
  return (
    <section
      data-acquisition-root
      className="font-mono w-full border-t-4 border-foreground overflow-hidden"
      style={{ maxHeight: "50vh" }}
    >
      <div className="px-8 md:px-12 py-8 md:py-10 flex flex-col gap-6 md:gap-8">
        {/* Section header — subdued, data-sheet register */}
        <span className="text-muted-foreground text-xs tracking-widest uppercase flex items-center gap-2">
          <CDSymbol name="circuit-node" size={10} className="text-primary" />
          ACQUIRE
        </span>

        {/* CLI hero + copy trigger */}
        <div className="flex items-baseline gap-4 flex-wrap">
          <span className="text-xl md:text-2xl lg:text-3xl tracking-tight text-foreground">
            npx signalframeux init
          </span>
          <AcquisitionCopyButton command="npx signalframeux init" />
        </div>

        {/* Stats — column-aligned monospaced data points */}
        <div className="flex flex-col gap-0.5 text-sm text-foreground/80">
          <span>COMPONENTS     // {SYSTEM_STATS.components}</span>
          <span>BUNDLE         // {SYSTEM_STATS.bundle}</span>
          <span>LIGHTHOUSE     // {SYSTEM_STATS.lighthouse}</span>
        </div>

        {/* Text anchors — monospaced, not buttons */}
        <div className="flex gap-8 text-sm">
          <Link
            href="/init"
            className="text-muted-foreground hover:text-foreground transition-colors duration-[var(--sfx-duration-instant)]"
          >
            → /init
          </Link>
          <Link
            href="/inventory"
            className="text-muted-foreground hover:text-foreground transition-colors duration-[var(--sfx-duration-instant)]"
          >
            → /inventory
          </Link>
        </div>
      </div>
    </section>
  );
}
