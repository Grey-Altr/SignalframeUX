const STATS = [
  { value: "340", label: "COMPONENTS" },
  { value: "48", label: "OKLCH SCALES" },
  { value: "12", label: "MOTION CURVES" },
  { value: "∞", label: "FRAME STATES" },
];

export function StatsBand() {
  return (
    <section data-anim="section-reveal" className="grid grid-cols-2 md:grid-cols-4 border-b-4 border-foreground">
      {STATS.map((stat, i) => (
        <div
          key={stat.label}
          className={`px-8 py-12 text-center border-b-[4px] border-foreground ${
            i < STATS.length - 1 ? "border-r-0 md:border-r-4" : ""
          }`}
        >
          <div
            className="text-[clamp(48px,5vw,72px)] leading-none text-foreground"
            style={{ fontFamily: "var(--font-anton)" }}
            {...(stat.value !== "∞" ? { "data-anim": "stat-number", "data-target": stat.value } : {})}
          >
            {stat.value}
          </div>
          <div className="mt-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-bold">
            {stat.label}
          </div>
        </div>
      ))}
    </section>
  );
}
