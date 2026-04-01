"use client";

const MARQUEE_TEXT =
  "SIGNAL//FIELD™ // DESIGN SYSTEM // BUILT FOR ENGINEERS // SHIP FASTER // ACCEPT THE INTERFACE // ";

export function MarqueeBand() {
  return (
    <section
      className="bg-primary border-y-[3px] border-foreground overflow-hidden h-12 flex items-center group"
      aria-label="Scrolling marquee"
    >
      <div
        className="flex whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused]"
        style={{
          fontFamily: "var(--font-display)",
        }}
      >
        <span className="text-background text-[18px] uppercase tracking-[0.15em] px-2">
          {MARQUEE_TEXT}
          {MARQUEE_TEXT}
        </span>
        <span className="text-background text-[18px] uppercase tracking-[0.15em] px-2" aria-hidden="true">
          {MARQUEE_TEXT}
          {MARQUEE_TEXT}
        </span>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </section>
  );
}
