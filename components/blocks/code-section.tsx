export function CodeSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 border-b-4 border-foreground">
      {/* Left — Description */}
      <div className="px-[clamp(24px,5vw,48px)] py-[clamp(24px,5vw,60px)] border-r-0 md:border-r-4 border-foreground">
        <h2
          className="text-[clamp(40px,5vw,64px)] leading-none text-foreground mb-6"
          style={{ fontFamily: "var(--font-display)" }}
        >
          API_INIT
        </h2>
        <p className="text-[13px] leading-[1.8] text-foreground/60 max-w-[440px]">
          SIGNALFRAMEUX OPERATES AS A PROGRAMMABLE API.
          INITIALIZE WITH A CONFIG OBJECT. EVERY TOKEN,
          COMPONENT, AND FIELD EFFECT IS ADDRESSABLE
          THROUGH A UNIFIED INTERFACE.
        </p>
      </div>

      {/* Right — Code block */}
      <div className="bg-[#111] px-8 py-10 relative overflow-hidden" style={{ boxShadow: "inset 0 2px 12px rgba(0,0,0,0.5)" }}>
        {/* Terminal label */}
        <div className="absolute top-4 right-6 text-[9px] uppercase tracking-[0.2em] text-[#555] font-bold">
          TERMINAL™
        </div>

        <pre className="text-[13px] leading-[1.7] font-mono overflow-x-auto mt-4">
          <code>
            <Line comment="// INITIALIZE SIGNALFRAMEUX™" />
            <Line>
              <Kw>import</Kw> {"{ "}
              <Fn>createSignalframeUX</Fn>
              {" }"} <Kw>from</Kw> <Str>&apos;@sfux/core&apos;</Str>
            </Line>
            <Line />
            <Line>
              <Kw>const</Kw> <Const>sfux</Const> = <Fn>createSignalframeUX</Fn>({"{"})
            </Line>
            <Line indent={2}>
              theme: <Str>&apos;dark&apos;</Str>,
            </Line>
            <Line indent={2}>
              tokens: <Str>&apos;oklch&apos;</Str>,
            </Line>
            <Line indent={2}>field: {"{"}</Line>
            <Line indent={4}>
              enabled: <Const>true</Const>,
            </Line>
            <Line indent={4}>
              intensity: <Const>0.6</Const>,
            </Line>
            <Line indent={4}>
              reactive: <Str>&apos;cursor&apos;</Str>
            </Line>
            <Line indent={2}>{"}"}</Line>
            <Line>{"})"}</Line>
            <Line />
            <Line comment="// ACCESS ANY COMPONENT" />
            <Line>
              <Kw>const</Kw> <Const>btn</Const> = <Const>sfux</Const>.<Fn>component</Fn>(<Str>&apos;Button&apos;</Str>)
            </Line>
            <Line>
              <Const>btn</Const>.<Fn>render</Fn>({"{"} variant: <Str>&apos;signal&apos;</Str> {"}"})
            </Line>
          </code>
        </pre>
      </div>
    </section>
  );
}

/* Syntax highlighting helper components */
function Line({
  children,
  comment,
  indent = 0,
}: {
  children?: React.ReactNode;
  comment?: string;
  indent?: number;
}) {
  const spaces = " ".repeat(indent);
  if (comment) {
    return (
      <div>
        <span style={{ color: "#555" }}>{comment}</span>
      </div>
    );
  }
  if (!children) return <div className="h-[1.7em]" />;
  return (
    <div>
      {spaces && <span>{spaces}</span>}
      {children}
    </div>
  );
}

function Kw({ children }: { children: React.ReactNode }) {
  return <span style={{ color: "oklch(0.65 0.29 350)" }}>{children}</span>;
}

function Str({ children }: { children: React.ReactNode }) {
  return <span style={{ color: "var(--sf-yellow)" }}>{children}</span>;
}

function Fn({ children }: { children: React.ReactNode }) {
  return <span style={{ color: "oklch(0.85 0.25 145)" }}>{children}</span>;
}

function Const({ children }: { children: React.ReactNode }) {
  return <span style={{ color: "#FF6B6B" }}>{children}</span>;
}
