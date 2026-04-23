"use client";

import type { ComponentDoc } from "@/lib/api-docs";

interface APIEntryRowProps {
  id: string;
  doc: ComponentDoc;
  active: boolean;
  showStatus?: boolean; // 1-col mobile: true. 2-col desktop: false.
  onClick: (id: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>, id: string) => void;
}

/** Render a monospaced type signature stub for a doc entry.
 *  HOOKS render as `useName()`. TOKENS render as `name:`. Everything else as `Name(`. */
function formatSignature(doc: ComponentDoc): string {
  if (doc.layer === "HOOK") return "()";
  if (doc.layer === "TOKEN") return ":";
  return "(";
}

export function APIEntryRow({ id, doc, active, showStatus = true, onClick, onKeyDown }: APIEntryRowProps) {
  const cols = showStatus
    ? "grid-cols-[16px_1fr_6ch_9ch_8ch] md:grid-cols-[16px_1fr_8ch_10ch_9ch]"
    : "grid-cols-[16px_1fr_7ch_7ch]";

  return (
    <button
      type="button"
      data-api-entry={id}
      data-api-entry-active={active ? "true" : undefined}
      aria-current={active ? "location" : undefined}
      aria-expanded={active}
      onClick={() => onClick(id)}
      onKeyDown={(e) => onKeyDown(e, id)}
      className={`group w-full text-left px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] py-[var(--sfx-space-1)] grid ${cols} items-baseline gap-[var(--sfx-space-4)] border-l-[3px] transition-colors outline-none ${
        active
          ? "border-l-primary bg-foreground/[0.06]"
          : "border-l-transparent hover:bg-foreground/[0.04] focus-visible:bg-foreground/[0.08] focus-visible:border-l-foreground/40"
      }`}
    >
      <span aria-hidden="true" className="text-[var(--text-xs)] tabular-nums text-muted-foreground">
        {active ? "◉" : "○"}
      </span>
      <span className="min-w-0 text-foreground tracking-tight text-[var(--text-sm)] truncate">
        {doc.importName}
        <span className="text-muted-foreground">{formatSignature(doc)}</span>
      </span>
      <span className="text-[var(--text-xs)] tabular-nums text-muted-foreground text-right">
        {doc.version}
      </span>
      <span className="text-[var(--text-xs)] uppercase tracking-[0.15em] text-muted-foreground text-right">
        [{doc.layer}]
      </span>
      {showStatus && (
        <span className="hidden md:inline text-[var(--text-xs)] uppercase tracking-[0.15em] text-muted-foreground text-right">
          {doc.status}
        </span>
      )}
    </button>
  );
}
