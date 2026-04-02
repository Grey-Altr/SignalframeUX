const STATS = [
  { value: "340", label: "COMPONENTS", accent: false },
  { value: "48", label: "OKLCH SCALES", accent: false },
  { value: "12", label: "MOTION CURVES", accent: false },
  { value: "∞", label: "FRAME STATES", accent: true },
];

export function StatsBand() {
  return (
    <section aria-label="Key statistics" data-anim="section-reveal" suppressHydrationWarning className="grid grid-cols-2 md:grid-cols-4 border-b-4 border-foreground">
      {STATS.map((stat, i) => (
        <div
          key={stat.label}
          className={`px-8 py-12 text-center ${
            i < 2 ? "border-b-4 md:border-b-0" : ""
          } border-foreground ${
            i % 2 === 0 ? "border-r-4" : i < STATS.length - 1 ? "md:border-r-4" : ""
          } ${stat.accent ? "bg-foreground dark:bg-[var(--sf-darker-surface)]" : ""}`}
        >
          <div
            className={`sf-display text-[clamp(48px,5vw,72px)] leading-none ${
              stat.accent ? "text-primary" : "text-foreground"
            }`}
            suppressHydrationWarning
            aria-label={`${stat.value === "∞" ? "Infinite" : stat.value} ${stat.label.toLowerCase()}`}
            {...(!stat.accent ? { "data-anim": "stat-number", "data-target": stat.value } : {})}
          >
            {stat.value}
          </div>
          <div className={`mt-3 text-[10px] uppercase tracking-[0.25em] font-bold ${
            stat.accent ? "text-background dark:text-muted-foreground" : "text-muted-foreground"
          }`}>
            {stat.label}
          </div>
        </div>
      ))}
    </section>
  );
}
