import { cn } from "@/lib/utils";

/** Shared code block renderer used across API explorer and start page */
export function SharedCodeBlock({
  children,
  label,
  className,
}: {
  children: React.ReactNode;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-x-auto font-mono bg-[var(--sf-code-bg)] text-[var(--sf-code-text)] p-[var(--sfx-space-6)] text-[var(--text-sm)] leading-[1.7] shadow-[inset_0_2px_4px_var(--sf-inset-shadow-color)]",
        className
      )}
      role="region"
      aria-label={label ? `Code: ${label}` : "Code example"}
    >
      {label && (
        <span className="absolute top-1.5 right-2.5 text-[var(--text-xs)] uppercase tracking-[0.2em] text-muted-foreground" aria-hidden="true">
          {label}
        </span>
      )}
      {children}
    </div>
  );
}
