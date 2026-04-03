const MARQUEE_TEXT =
  "SIGNAL//FRAME™ // DESIGN SYSTEM // BUILT FOR ENGINEERS // SHIP FASTER // ACCEPT THE INTERFACE // ";

export function MarqueeBand() {
  return (
    <section
      className="bg-primary border-y-4 border-foreground overflow-hidden h-12 flex items-center group"
      aria-label="Scrolling marquee"
    >
      <span className="sr-only">SIGNAL//FRAME™ — Design system built for engineers. Ship faster. Accept the interface.</span>
      <div
        className="sf-display flex whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
        aria-hidden="true"
      >
        <span className="text-primary-foreground text-lg uppercase tracking-[0.15em] px-2">
          {MARQUEE_TEXT}
          {MARQUEE_TEXT}
        </span>
        <span className="text-primary-foreground text-lg uppercase tracking-[0.15em] px-2">
          {MARQUEE_TEXT}
          {MARQUEE_TEXT}
        </span>
      </div>
    </section>
  );
}
