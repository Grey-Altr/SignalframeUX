const MARQUEE_TEXT =
  "SIGNAL//FRAME™ // DESIGN SYSTEM // BUILT FOR ENGINEERS // COMPOSABLE BY DESIGN // ACCEPT THE INTERFACE // ";

export function MarqueeBand() {
  return (
    <section
      className="bg-yellow-400 border-y-4 border-foreground overflow-hidden h-12 flex items-center justify-center group relative"
      aria-label="Scrolling marquee"
    >
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-7 bg-yellow-400 border-y border-yellow-600" aria-hidden="true" />
      <span className="sr-only">SIGNAL//FRAME™ — Design system built for engineers. Composable by design. Accept the interface.</span>
      <div
        className="sf-display flex whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] relative z-10"
        aria-hidden="true"
      >
        <span className="text-black text-lg uppercase tracking-[0.15em] px-2">
          {MARQUEE_TEXT}
          {MARQUEE_TEXT}
        </span>
        <span className="text-black text-lg uppercase tracking-[0.15em] px-2">
          {MARQUEE_TEXT}
          {MARQUEE_TEXT}
        </span>
      </div>
    </section>
  );
}
