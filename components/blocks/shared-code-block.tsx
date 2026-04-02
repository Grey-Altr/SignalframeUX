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
      className={`relative overflow-x-auto font-mono bg-[var(--sf-code-bg)] text-[var(--sf-code-text)] p-5 pr-6 text-[12px] leading-[1.7] shadow-[inset_0_2px_4px_oklch(0_0_0/0.2)] ${className ?? ""}`}
      role="region"
      aria-label={label ? `Code: ${label}` : "Code example"}
    >
      {label && (
        <span className="absolute top-1.5 right-2.5 text-[10px] text-muted-foreground uppercase tracking-[0.2em]" aria-hidden="true">
          {label}
        </span>
      )}
      {children}
    </div>
  );
}
