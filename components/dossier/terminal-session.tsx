type Line = { prompt?: boolean; text: string; intent?: "normal" | "ok" | "warn" };

export function TerminalSession({ lines }: { lines: Line[] }) {
  return (
    <pre
      className="whitespace-pre-wrap leading-[1.7] text-[12px] md:text-[13px]"
      style={{ fontFamily: "var(--font-share-tech-mono), monospace" }}
    >
      {lines.map((l, i) => (
        <div
          key={i}
          data-plate="helghanese-line"
          style={{
            color:
              l.intent === "ok" ? "oklch(0.8 0.2 135)" :
              l.intent === "warn" ? "oklch(0.75 0.2 85)" :
              "oklch(0.85 0 0)",
            opacity: l.intent ? 1 : 0.85,
          }}
        >
          {l.prompt ? "$ " : ""}
          {l.text}
        </div>
      ))}
      <span
        data-plate="helghanese-cursor"
        aria-hidden="true"
        style={{
          display: "inline-block",
          width: "0.6em",
          height: "1em",
          background: "oklch(0.8 0.2 135)",
          verticalAlign: "text-bottom",
          animation: "helghBlink 1.1s steps(1) infinite",
        }}
      />
      <style>{`
        @keyframes helghBlink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-plate='helghanese-cursor'] { animation: none !important; opacity: 1 !important; }
        }
      `}</style>
    </pre>
  );
}
