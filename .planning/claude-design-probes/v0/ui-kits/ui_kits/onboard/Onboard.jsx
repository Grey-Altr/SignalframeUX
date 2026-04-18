// SignalframeUX onboarding — pick a primary, answer a few questions,
// agent synthesizes a themed manifest.
/* eslint-disable */
const { useState, useMemo } = React;

function seededRand(seed, i) { return ((seed * 9301 + i * 49297) % 233280) / 233280; }

// ── STEP 00 · PRIMARY ──────────────────────────────────────
// Derive the full palette from the chosen hue so the user sees the system adapt live.
function derivePalette(hue) {
  const accent = (hue + 180) % 360;
  const split1 = (hue + 150) % 360;
  const split2 = (hue + 210) % 360;
  return {
    primary:     `oklch(0.65 0.3 ${hue})`,
    primaryDim:  `oklch(0.45 0.22 ${hue})`,
    primaryLift: `oklch(0.78 0.28 ${hue})`,
    surface:     `oklch(0.145 0 0)`,
    surfaceLift: `oklch(0.205 0 0)`,
    foreground:  `oklch(0.985 0 0)`,
    muted:       `oklch(0.55 0.02 ${hue})`,
    accent:      `oklch(0.65 0.20 ${accent})`,
    split1:      `oklch(0.65 0.22 ${split1})`,
    split2:      `oklch(0.65 0.22 ${split2})`,
    ring:        `oklch(0.78 0.28 ${hue})`,
    hue, accentHue: accent,
  };
}

const SwatchField = ({ hue, setHue }) => {
  const steps = Array.from({ length: 36 }, (_, i) => i * 10);
  const P = derivePalette(hue);
  const chips = [
    ["primary",      P.primary,     "oklch(0.65 0.30 H)"],
    ["primary/dim",  P.primaryDim,  "oklch(0.45 0.22 H)"],
    ["primary/lift", P.primaryLift, "oklch(0.78 0.28 H)"],
    ["accent",       P.accent,      "oklch(0.65 0.20 H+180)"],
    ["split-a",      P.split1,      "oklch(0.65 0.22 H+150)"],
    ["split-b",      P.split2,      "oklch(0.65 0.22 H+210)"],
    ["muted",        P.muted,       "oklch(0.55 0.02 H)"],
    ["ring",         P.ring,        "oklch(0.78 0.28 H)"],
  ];
  return (
    <div>
      <SFLabel style={{ color: "oklch(0.65 0 0)" }}>PRIMARY HUE · 0–359</SFLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(18, 1fr)", gap: 2, marginTop: 12 }}>
        {steps.map(h => (
          <button key={h} onClick={() => setHue(h)} aria-label={`Hue ${h}`} style={{
            aspectRatio: "1", background: `oklch(0.65 0.3 ${h})`,
            transform: hue === h ? "scale(1.15)" : "scale(1)",
            zIndex: hue === h ? 2 : 1, position: "relative",
            border: 0, padding: 0, cursor: "pointer",
            transition: "transform 100ms cubic-bezier(0.2,0,0,1)"
          }}/>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "192px 1fr", gap: 24, marginTop: 24, alignItems: "start" }}>
        <div>
          <div style={{ width: 192, height: 192, background: P.primary }}/>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 48, lineHeight: 0.9, textTransform: "uppercase", marginTop: 12 }}>HUE:{String(hue).padStart(3, "0")}</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "oklch(0.65 0 0)", letterSpacing: "0.12em", marginTop: 4 }}>{P.primary}</div>
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
            <SFLabel style={{ color: "oklch(0.65 0 0)" }}>DERIVED PALETTE</SFLabel>
            <SFLabel style={{ color: P.primaryLift }}>{chips.length} TOKENS · LIVE</SFLabel>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            {chips.map(([name, color, expr]) => (
              <div key={name} style={{ display: "flex", gap: 10, alignItems: "center", background: "oklch(0.18 0 0)", padding: "8px 10px" }}>
                <div style={{ width: 32, height: 32, background: color, flexShrink: 0 }}/>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "oklch(0.985 0 0)" }}>{name}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "oklch(0.6 0 0)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{expr.replace("H", String(hue))}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 20, marginBottom: 8 }}>
            <SFLabel style={{ color: "oklch(0.65 0 0)" }}>ANCHORS · COMMON HUES</SFLabel>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {[350, 200, 98, 145, 25, 270, 310, 40].map(h => (
              <button key={h} onClick={() => setHue(h)} style={{
                fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em",
                padding: "6px 14px 6px 10px", border: 0,
                background: hue === h ? "oklch(0.72 0.17 95)" : "oklch(0.88 0.17 95)",
                color: "oklch(0.145 0 0)", cursor: "pointer",
                display: "flex", gap: 8, alignItems: "center",
                clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)"
              }}>
                <span style={{ width: 10, height: 10, background: `oklch(0.65 0.3 ${h})` }}/>
                {String(h).padStart(3, "0")}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── STEP 01 · INTAKE ─────────────────────────────────────
// Glyphs are rendered as filled rectangles on a 16×16 pixel grid with round corners/joins.
// This gives a chunky pixel-art read that still feels smooth at option scale.
const Glyph = ({ blocks, size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden style={{ flexShrink: 0, display: "block" }}>
    {blocks.map((b, i) => (
      <rect key={i}
        x={b[0]} y={b[1]} width={b[2]} height={b[3]}
        rx="0.25" ry="0.25"
        fill="currentColor"/>
    ))}
  </svg>
);

// Each block is [x, y, w, h] on a 16×16 grid.
const QUESTIONS = [
  {
    id: "register", prompt: "Choose a register.",
    options: [
      // QUIET — single horizontal bar
      ["QUIET",   [[2,7,12,2]],
        "Structural only. FRAME carries the design; SIGNAL recedes."],
      // LIVE — two staggered bars
      ["LIVE",    [[2,4,12,2],[2,10,12,2]],
        "Balanced. FRAME holds, SIGNAL operates at low intensity."],
      // CHARGED — stack of bars, louder
      ["CHARGED", [[2,2,12,2],[2,7,12,2],[2,12,12,2]],
        "SIGNAL-weighted. Motion, noise, and seeded variation are present."],
      // SCATTER — fragmented blocks
      ["SCATTER", [[2,3,4,2],[10,2,4,2],[3,8,3,2],[9,9,5,2],[2,13,6,2],[11,13,3,2]],
        "Seeded mix across the spectrum. Intensity determined by seed."],
    ]
  },
  {
    id: "lineage", prompt: "Select a lineage.",
    options: [
      // CATALOG — boxed grid
      ["CATALOG",  [[2,2,12,2],[2,7,12,2],[2,12,12,2]],
        "Hard cuts. Coded numbering. Catalog page as typographic surface."],
      // REPUBLIC — L-shape
      ["REPUBLIC", [[2,2,2,12],[2,12,12,2],[6,7,6,2]],
        "Total minimalism. Coded naming is the only decoration permitted."],
      // DATAFORM — staircase
      ["DATAFORM", [[2,12,2,2],[5,9,2,5],[8,6,2,8],[11,3,2,11]],
        "Data-as-material. Generative rules, micro-type, perception thresholds."],
      // MATERIAL — cross
      ["MATERIAL", [[2,7,12,2],[7,2,2,12]],
        "Exposed structure. Legibility and expression held in tension."],
    ]
  },
  {
    id: "density", prompt: "Set the density.",
    options: [
      ["OPEN",   [[7,7,2,2]],
        "One idea per viewport. Silence is load-bearing."],
      ["STEADY", [[4,4,2,2],[10,4,2,2],[4,10,2,2],[10,10,2,2]],
        "Measured. A small number of elements per surface."],
      ["PACKED", [[2,2,3,3],[7,2,3,3],[12,2,2,3],[2,7,3,3],[7,7,3,3],[12,7,2,3],[2,12,3,2],[7,12,3,2],[12,12,2,2]],
        "Catalog-grade density. Information functions as ornament."],
      ["MAX",    [[2,2,2,2],[5,2,2,2],[8,2,2,2],[11,2,2,2],[2,5,2,2],[5,5,2,2],[8,5,2,2],[11,5,2,2],[2,8,2,2],[5,8,2,2],[8,8,2,2],[11,8,2,2],[2,11,2,2],[5,11,2,2],[8,11,2,2],[11,11,2,2]],
        "Terminal-grade. Data walls. No negative space."],
    ]
  },
  {
    id: "motion", prompt: "Define the motion profile.",
    options: [
      // STILL — solid square
      ["STILL",    [[3,3,10,10]],
        "None. Instant swaps only. Print on a screen."],
      // SNAP — arrow-ish
      ["SNAP",     [[2,7,8,2],[9,5,2,6],[10,4,2,2],[10,10,2,2]],
        "Ease-out only. Under 200ms. Decisive."],
      // ALIVE — waveform
      ["ALIVE",    [[2,9,2,2],[4,7,2,2],[6,9,2,2],[8,7,2,2],[10,9,2,2],[12,7,2,2]],
        "Ambient. Idle grain, scanlines, sub-perceptual drift."],
      // RESTLESS — denser waveform
      ["RESTLESS", [[2,10,2,3],[4,5,2,3],[6,9,2,4],[8,3,2,5],[10,8,2,4],[12,4,2,6]],
        "Continuous. Arrival, hover, scroll, and seeded idle passes."],
    ]
  },
  {
    id: "surface", prompt: "Set the default surface.",
    options: [
      ["NIGHT",    [[2,2,12,12]],
        "Dark. Deep neutrals. SIGNAL overlays permitted."],
      ["DAY",      [[2,2,12,2],[2,12,12,2],[2,2,2,12],[12,2,2,12]],
        "Light. Paper-white. Typography carries the weight."],
      ["BOTH",     [[2,2,6,12],[8,2,6,12]],
        "Dual. Surface follows system state; both are first-class."],
      ["CONTRAST", [[2,2,6,6],[8,8,6,6]],
        "Monochrome. No mid-tones. Black, white, and the primary."],
    ]
  },
];

// Filled-background (borderless-default) option card with angular glyph
const Question = ({ q, answer, setAnswer, hue }) => (
  <div style={{ padding: "24px 0" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
      <SFLabel style={{ color: "oklch(0.55 0 0)" }}>Q · {q.id}</SFLabel>
      <SFLabel style={{ color: `oklch(0.78 0.28 ${hue})` }}>{answer || "—"}</SFLabel>
    </div>
    <div style={{ fontFamily: "var(--font-display)", fontSize: 40, textTransform: "uppercase", lineHeight: 0.9, marginBottom: 16 }}>{q.prompt}</div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      {q.options.map(([key, glyph, desc]) => {
        const selected = answer === key;
        return (
          <button key={key} onClick={() => setAnswer(key)} style={{
            textAlign: "left", padding: "16px 18px",
            border: 0,
            background: selected ? `oklch(0.65 0.3 ${hue})` : "oklch(0.18 0 0)",
            color: selected ? "oklch(0.985 0 0)" : "oklch(0.92 0 0)",
            cursor: "pointer", fontFamily: "var(--font-sans)",
            transition: "background 100ms cubic-bezier(0.2,0,0,1)",
            display: "flex", gap: 14, alignItems: "flex-start"
          }}>
            <div style={{ color: selected ? "oklch(0.985 0 0)" : `oklch(0.78 0.28 ${hue})`, paddingTop: 1 }}>
              <Glyph blocks={glyph}/>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700,
                letterSpacing: "0.15em", color: "oklch(0.985 0 0)"
              }}>{key}</div>
              <div style={{ fontSize: 12, color: selected ? "oklch(0.985 0 0 / 0.85)" : "oklch(0.7 0 0)", marginTop: 6, lineHeight: 1.5 }}>{desc}</div>
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

// ── STEP 02 · AGENT SYNTHESIS ──────────────────────────────
function synthesize({ hue, answers }) {
  const seed = (hue * 31
    + (answers.register?.length || 0) * 17
    + (answers.lineage?.length || 0) * 11
    + (answers.density?.length || 0) * 7
    + (answers.motion?.length || 0) * 5
    + (answers.surface?.length || 0) * 3) % 65535;

  // SCATTER register = seeded mix of QUIET/LIVE/CHARGED anchors
  const wild = (answers.register === "SCATTER");
  const wildMix = seededRand(seed, 1); // 0..1

  const intensityMap = { QUIET: 0.15, LIVE: 0.5, CHARGED: 0.8 };
  const intensity = wild
    ? 0.1 + wildMix * 0.85
    : (intensityMap[answers.register] ?? 0.5);

  const speedMap = { STILL: 0, SNAP: 1.0, ALIVE: 1.2, RESTLESS: 1.6 };
  const speed = speedMap[answers.motion] ?? 1.0;

  const trackingMap = { OPEN: 0.22, STEADY: 0.16, PACKED: 0.14, MAX: 0.12 };
  const tracking = trackingMap[answers.density] ?? 0.15;

  const surface = answers.surface || "NIGHT";
  const dark = surface !== "DAY";
  const mono = surface === "CONTRAST";

  const accent = (hue + 180) % 360;

  const presetMap = {
    CATALOG:  "R08 · CATALOG",
    REPUBLIC: "R07 · REPUBLIC",
    DATAFORM: "R06 · DATAFORM",
    MATERIAL: "R05 · MATERIAL",
  };
  const preset = presetMap[answers.lineage] || "R00 · UNDEFINED";

  return {
    seed: seed.toString(16).toUpperCase().padStart(4, "0"),
    accent, intensity, speed, tracking, dark, mono, preset, wild,
    name: `SF/${answers.lineage || "X"}/${String(hue).padStart(3,"0")}/${answers.register || "X"}`,
  };
}

const Barcode = ({ seed, hue }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(48, 1fr)", gap: 1, height: 36 }}>
    {Array.from({ length: 48 }).map((_, i) => {
      const n = seededRand(parseInt(seed, 16), i);
      return <div key={i} style={{ background: n > 0.5 ? `oklch(0.78 0.28 ${hue})` : "oklch(0.985 0 0)", width: "100%", alignSelf: "end", height: `${30 + n * 70}%` }}/>;
    })}
  </div>
);

const Manifest = ({ hue, answers, manifest, rationale }) => {
  const M = manifest;
  return (
    <div style={{ background: "oklch(0.08 0 0)", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <SFLabel style={{ color: `oklch(0.78 0.28 ${hue})` }}>MANIFEST · v0.1 · GENERATED{M.wild ? " · SCATTER" : ""}</SFLabel>
        <SFLabel style={{ color: "oklch(0.55 0 0)" }}>{new Date().toISOString().slice(0,16).replace("T"," ")}</SFLabel>
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 64, lineHeight: 0.9, textTransform: "uppercase", marginTop: 12 }}>
        {M.preset}<br/>
        <span style={{ color: `oklch(0.78 0.28 ${hue})` }}>HUE:{String(hue).padStart(3,"0")} · SEED:0x{M.seed}</span>
      </div>
      <div style={{ marginTop: 20 }}><Barcode seed={M.seed} hue={hue}/></div>

      {rationale && (
        <div style={{ marginTop: 24, background: "oklch(0.145 0 0)", padding: 16 }}>
          <SFLabel style={{ color: `oklch(0.78 0.28 ${hue})` }}>AGENT NOTE</SFLabel>
          <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.55, color: "oklch(0.92 0 0)", whiteSpace: "pre-wrap" }}>{rationale}</div>
        </div>
      )}

      <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", background: "oklch(0.145 0 0)" }}>
        {[
          ["--sfx-theme-hue", hue],
          ["--signal-intensity", M.intensity.toFixed(2)],
          ["--signal-speed", M.speed.toFixed(2) + "x"],
          ["--sf-tracking-label", M.tracking.toFixed(2) + "em"],
          ["--color-primary", `oklch(0.65 0.3 ${hue})`],
          ["--color-accent", M.mono ? "oklch(0.4 0 0)" : `oklch(0.93 0.005 ${M.accent})`],
          ["--color-background", M.dark ? "oklch(0.145 0 0)" : "oklch(1 0 0)"],
          ["--radius-*", "0px (locked)"],
          ["--border-element", "2px (locked)"],
          ["--ease-default", "cubic-bezier(0.2, 0, 0, 1)"],
        ].map((row, i) => (
          <React.Fragment key={i}>
            <div style={{ padding: "8px 12px", fontFamily: "var(--font-mono)", fontSize: 11, color: "oklch(0.65 0 0)", background: i % 2 ? "oklch(0.12 0 0)" : "oklch(0.145 0 0)" }}>{row[0]}</div>
            <div style={{ padding: "8px 12px", fontFamily: "var(--font-mono)", fontSize: 11, color: `oklch(0.78 0.28 ${hue})`, background: i % 2 ? "oklch(0.12 0 0)" : "oklch(0.145 0 0)" }}>{row[1]}</div>
          </React.Fragment>
        ))}
      </div>

      <div style={{ marginTop: 24, background: M.dark ? "oklch(0.08 0 0)" : "oklch(1 0 0)", color: M.dark ? "oklch(0.985 0 0)" : "oklch(0.145 0 0)", padding: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(to bottom,transparent 0,transparent 3px,oklch(0 0 0 / 0.35) 3px,oklch(0 0 0 / 0.35) 4px)", opacity: M.intensity * 0.6, pointerEvents: "none" }}/>
        <SFLabel style={{ color: `oklch(0.78 0.28 ${hue})` }}>PREVIEW · INSTANCE</SFLabel>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 72, lineHeight: 0.9, textTransform: "uppercase", marginTop: 8 }}>
          SIGNAL<span style={{ color: `oklch(0.78 0.28 ${hue})` }}>//</span>{answers.lineage || "FRAME"}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
          <SFBadge variant="primary">{M.name}</SFBadge>
          <SFBadge variant="solid">ARMED</SFBadge>
          <SFBadge variant="success">STABLE</SFBadge>
        </div>
      </div>
    </div>
  );
};

const CodeExport = ({ hue, manifest }) => {
  const css = `:root {
  --sfx-theme-hue: ${hue};
  --signal-intensity: ${manifest.intensity.toFixed(2)};
  --signal-speed: ${manifest.speed.toFixed(2)};
  --sf-tracking-label: ${manifest.tracking.toFixed(2)}em;
  /* FRAME (locked) */
  --radius: 0px;
  --border-element: 2px;
  --ease-default: cubic-bezier(0.2, 0, 0, 1);
  /* Preset: ${manifest.preset} · seed:0x${manifest.seed} */
}`;
  return (
    <div style={{ marginTop: 16, background: "oklch(0.08 0 0)" }}>
      <div style={{ padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "oklch(0.18 0 0)" }}>
        <SFLabel style={{ color: "oklch(0.65 0 0)" }}>EXPORT · manifest.css</SFLabel>
        <SFButton variant="ghost" size="sm" style={{ color: "oklch(0.985 0 0)", borderColor: "oklch(0.4 0 0)" }} onClick={() => navigator.clipboard?.writeText(css)}>COPY</SFButton>
      </div>
      <pre style={{ margin: 0, padding: 16, fontFamily: "var(--font-mono)", fontSize: 11, color: "oklch(0.85 0 0)", overflowX: "auto" }}>{css}</pre>
    </div>
  );
};

// ── Agent rationale via window.claude.complete ────────────
async function requestRationale({ hue, answers, manifest }) {
  if (!window.claude?.complete) return null;
  const prompt = `You are the Culture Division design agent. A user has configured a SignalframeUX instance. Write a short note (3–4 sentences) describing the posture you will hold on their behalf. Tone: declarative, precise, slightly tense. No colloquialisms. No marketing language. No exclamations. No emoji. Reference tokens and choices by name.

Inputs:
- primary hue: ${hue} (oklch(0.65 0.3 ${hue}))
- register: ${answers.register || "—"}
- lineage: ${answers.lineage || "—"}
- density: ${answers.density || "—"}
- motion: ${answers.motion || "—"}
- surface: ${answers.surface || "—"}

Derived:
- accent hue: ${manifest.accent}
- --signal-intensity: ${manifest.intensity.toFixed(2)}
- --signal-speed: ${manifest.speed.toFixed(2)}
- seed: 0x${manifest.seed}
- preset: ${manifest.preset}

Write the note now. Plain prose, no headings.`;
  try {
    const text = await window.claude.complete(prompt);
    return text?.trim() || null;
  } catch { return null; }
}

Object.assign(window, { SwatchField, QUESTIONS, Question, synthesize, Manifest, CodeExport, requestRationale, derivePalette });
