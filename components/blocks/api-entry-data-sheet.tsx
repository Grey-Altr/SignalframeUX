"use client";

import { Fragment } from "react";
import type { ComponentDoc } from "@/lib/api-docs";

export function APIEntryDataSheet({ doc }: { doc: ComponentDoc }) {
  const propsLabel =
    doc.layer === "HOOK" ? "RETURNS" : doc.layer === "TOKEN" ? "TOKENS" : "PROPS";

  return (
    <div className="max-w-[var(--max-w-wide)]">
      <p className="font-mono text-[var(--text-sm)] uppercase tracking-tight text-muted-foreground leading-[1.6] max-w-[72ch] mb-[var(--sfx-space-8)]">
        {doc.description}
      </p>

      <section className="mb-[var(--sfx-space-8)]">
        <div className="text-[var(--text-xs)] uppercase tracking-[0.2em] text-muted-foreground mb-[var(--sfx-space-2)] border-b border-foreground/15 pb-[var(--sfx-space-1)]">
          IMPORT
        </div>
        <pre className="overflow-x-auto font-mono text-[var(--text-sm)] text-foreground whitespace-pre-wrap break-all">
          {`import { ${doc.importName} } from "${doc.importPath}";`}
        </pre>
      </section>

      {doc.props.length > 0 && (
        <section className="mb-[var(--sfx-space-8)]">
          <div className="text-[var(--text-xs)] uppercase tracking-[0.2em] text-muted-foreground mb-[var(--sfx-space-3)] border-b border-foreground/15 pb-[var(--sfx-space-1)]">
            {propsLabel}
          </div>
          <div
            data-api-props-table
            role="list"
            aria-label={`${doc.name} ${propsLabel.toLowerCase()}`}
            className="grid grid-cols-[minmax(120px,auto)_minmax(140px,1.4fr)_minmax(90px,auto)_minmax(200px,2fr)] gap-x-6 gap-y-2 font-mono text-[var(--text-xs)] pt-[var(--sfx-space-2)]"
          >
            <div className="uppercase tracking-[0.15em] text-muted-foreground">NAME</div>
            <div className="uppercase tracking-[0.15em] text-muted-foreground">TYPE</div>
            <div className="uppercase tracking-[0.15em] text-muted-foreground">DEFAULT</div>
            <div className="uppercase tracking-[0.15em] text-muted-foreground">DESCRIPTION</div>
            {doc.props.map((prop) => (
              <Fragment key={prop.name}>
                <div className="text-foreground break-all">
                  {prop.name}
                  {prop.required ? <span className="text-primary">*</span> : null}
                </div>
                <div className="text-muted-foreground break-all">{prop.type}</div>
                <div className="text-muted-foreground tabular-nums break-all">
                  {prop.default || "—"}
                </div>
                <div className="text-muted-foreground uppercase tracking-tight leading-[1.5]">
                  {prop.desc}
                </div>
              </Fragment>
            ))}
          </div>
        </section>
      )}

      {doc.usage.length > 0 && (
        <section className="mb-[var(--sfx-space-8)]">
          <div className="text-[var(--text-xs)] uppercase tracking-[0.2em] text-muted-foreground mb-[var(--sfx-space-3)] border-b border-foreground/15 pb-[var(--sfx-space-1)]">
            USAGE
          </div>
          <div className="space-y-4">
            {doc.usage.map((ex) => (
              <div key={ex.label}>
                <div className="text-[var(--text-xs)] uppercase tracking-[0.15em] text-muted-foreground mb-[var(--sfx-space-1)]">
                  {"// "}{ex.label}
                </div>
                <pre className="overflow-x-auto font-mono text-[var(--text-sm)] text-foreground bg-foreground/[0.05] border border-foreground/10 p-[var(--sfx-space-4)] whitespace-pre">
                  {ex.code}
                </pre>
              </div>
            ))}
          </div>
        </section>
      )}

      {doc.a11y.length > 0 && (
        <section>
          <div className="text-[var(--text-xs)] uppercase tracking-[0.2em] text-muted-foreground mb-[var(--sfx-space-3)] border-b border-foreground/15 pb-[var(--sfx-space-1)]">
            A11Y
          </div>
          <ul className="list-none m-0 p-0 font-mono text-[var(--text-xs)] uppercase tracking-tight text-muted-foreground space-y-1">
            {doc.a11y.map((note, i) => (
              <li key={i} className="leading-[1.6]">
                <span aria-hidden="true" className="text-muted-foreground">{"// "}</span>
                {note}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
