// cdOS internal console — Culture Division operator surface
/* eslint-disable */
const { useState } = React;

const OSChrome = ({ children }) => (
  <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", height: "100vh", background: "oklch(0.145 0 0)", color: "oklch(0.985 0 0)", fontFamily: "var(--font-sans)" }}>{children}</div>
);

const Sidebar = ({ active, onSelect, hue }) => {
  const groups = [
    ["§00 · HOME", [{ id: "signal", label: "SIGNAL" }, { id: "index", label: "INDEX" }]],
    ["§01 · INGEST", [{ id: "stream", label: "STREAM" }, { id: "manifest", label: "MANIFEST" }, { id: "queue", label: "QUEUE · 3" }]],
    ["§02 · TOOLING", [{ id: "composer", label: "COMPOSER" }, { id: "ops", label: "OPERATORS" }, { id: "logs", label: "LOGS" }]],
    ["§03 · FRAME", [{ id: "tokens", label: "TOKENS" }, { id: "lineage", label: "LINEAGE" }]],
  ];
  return (
    <aside style={{ borderRight: "2px solid oklch(0.4 0 0)", padding: "16px 0", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "0 16px 16px", borderBottom: "2px solid oklch(0.4 0 0)", display: "flex", alignItems: "center", gap: 10 }}>
        <img src="../../assets/cd-symbol.svg" width="24" height="24" alt="CD"/>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, textTransform: "uppercase", lineHeight: 1 }}>cdOS</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "oklch(0.65 0 0)" }}>v0.1 · hue:{350}</div>
        </div>
      </div>
      <div style={{ overflowY: "auto", flex: 1, padding: "12px 0" }}>
        {groups.map(([heading, items]) => (
          <div key={heading} style={{ marginBottom: 16 }}>
            <div style={{ padding: "0 16px 6px", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "oklch(0.55 0 0)", fontWeight: 700 }}>{heading}</div>
            {items.map(it => (
              <button key={it.id} onClick={() => onSelect(it.id)} style={{
                width: "100%", textAlign: "left", background: active === it.id ? `oklch(0.65 0.3 ${hue})` : "transparent",
                color: active === it.id ? "oklch(0.985 0 0)" : "oklch(0.85 0 0)",
                padding: "8px 16px", border: 0, borderLeft: active === it.id ? `4px solid oklch(0.985 0 0)` : "4px solid transparent",
                fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", cursor: "pointer"
              }}>{it.label}</button>
            ))}
          </div>
        ))}
      </div>
      <div style={{ padding: 12, borderTop: "2px solid oklch(0.4 0 0)", fontFamily: "var(--font-mono)", fontSize: 10, color: "oklch(0.65 0 0)", letterSpacing: "0.1em" }}>
        <SFStatusDot color="oklch(0.85 0.25 145)" label="OPERATOR · ONLINE"/>
      </div>
    </aside>
  );
};

const Toolbar = ({ hue, onHue }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", borderBottom: "2px solid oklch(0.4 0 0)", background: "oklch(0.12 0 0)" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <SFLabel style={{ color: "oklch(0.65 0 0)" }}>§02 · TOOLING / COMPOSER</SFLabel>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "oklch(0.5 0 0)" }}>/ R08 / signal / armed</span>
    </div>
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {[350, 200, 98, 145].map(h => (
        <button key={h} onClick={() => onHue(h)} style={{ width: 16, height: 16, background: `oklch(0.65 0.3 ${h})`, border: hue === h ? "2px solid oklch(0.985 0 0)" : "2px solid transparent", cursor: "pointer", padding: 0 }}/>
      ))}
      <span style={{ width: 1, height: 16, background: "oklch(0.4 0 0)", margin: "0 4px" }}/>
      <SFButton variant="ghost" size="sm" style={{ color: "oklch(0.985 0 0)" }}>↻ REBUILD</SFButton>
      <SFButton variant="primary" size="sm">COMMIT</SFButton>
    </div>
  </div>
);

const ComposerView = ({ hue, intensity, onIntensity }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 0, flex: 1, overflow: "hidden" }}>
    <div style={{ padding: 24, overflowY: "auto" }}>
      <SFLabel style={{ color: "oklch(0.65 0 0)" }}>CANVAS · preview</SFLabel>
      <div style={{ marginTop: 12, background: "oklch(0.08 0 0)", border: "2px solid oklch(0.4 0 0)", minHeight: 360, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(to bottom,transparent 0,transparent 3px,oklch(0 0 0 / 0.4) 3px,oklch(0 0 0 / 0.4) 4px)", opacity: intensity, pointerEvents: "none" }}/>
        <div style={{ position: "absolute", left: 32, top: 32, fontFamily: "var(--font-display)", fontSize: 96, lineHeight: 0.9, textTransform: "uppercase" }}>
          SIGNAL<span style={{ color: `oklch(0.78 0.28 ${hue})` }}>//</span>FRAME
        </div>
        <div style={{ position: "absolute", left: 32, bottom: 32, right: 32, display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em", color: `oklch(0.78 0.28 ${hue})`, textTransform: "uppercase" }}>
          <span>CATALOG · R08</span><span>HUE:{hue} · INTENSITY:{intensity.toFixed(2)}</span>
        </div>
      </div>
      <SFLabel style={{ marginTop: 20, color: "oklch(0.65 0 0)" }}>MANIFEST · tokens</SFLabel>
      <div style={{ marginTop: 10, border: "2px solid oklch(0.4 0 0)" }}>
        {[
          ["--sfx-theme-hue", hue],
          ["--signal-intensity", intensity.toFixed(2)],
          ["--radius", "0px"],
          ["--border-element", "2px"],
          ["--duration-fast", "100ms"],
        ].map((row, i) => (
          <div key={row[0]} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: i ? "2px solid oklch(0.4 0 0)" : 0, fontFamily: "var(--font-mono)", fontSize: 11 }}>
            <div style={{ padding: "8px 12px", color: "oklch(0.65 0 0)" }}>{row[0]}</div>
            <div style={{ padding: "8px 12px", borderLeft: "2px solid oklch(0.4 0 0)", color: `oklch(0.78 0.28 ${hue})` }}>{row[1]}</div>
          </div>
        ))}
      </div>
    </div>
    <aside style={{ borderLeft: "2px solid oklch(0.4 0 0)", padding: 20, background: "oklch(0.12 0 0)", overflowY: "auto" }}>
      <SFLabel style={{ color: "oklch(0.65 0 0)" }}>INSPECTOR</SFLabel>
      <div style={{ marginTop: 16 }}>
        <SFLabel style={{ fontSize: 9 }}>--signal-intensity</SFLabel>
        <input type="range" min="0" max="1" step="0.01" value={intensity} onChange={e => onIntensity(+e.target.value)} style={{ width: "100%", marginTop: 8 }}/>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: `oklch(0.78 0.28 ${hue})`, marginTop: 4 }}>{intensity.toFixed(2)}</div>
      </div>
      <div style={{ marginTop: 20 }}>
        <SFLabel style={{ fontSize: 9 }}>PASSES</SFLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
          {[["feedback", true], ["displace", true], ["bloom", false], ["glitch", true], ["particle", false]].map(([name, on]) => (
            <label key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "2px solid oklch(0.4 0 0)", padding: "6px 10px", fontFamily: "var(--font-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>
              <span>{name}</span>
              <span style={{ width: 26, height: 14, background: on ? `oklch(0.65 0.3 ${hue})` : "oklch(0.3 0 0)", position: "relative" }}>
                <span style={{ position: "absolute", top: 2, left: on ? 14 : 2, width: 10, height: 10, background: "oklch(0.985 0 0)" }}/>
              </span>
            </label>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 20 }}>
        <SFLabel style={{ fontSize: 9 }}>ACTIONS</SFLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
          <SFButton variant="ghost" size="sm" style={{ color: "oklch(0.985 0 0)", justifyContent: "space-between", width: "100%" }}>REGENERATE SEED<span>↻</span></SFButton>
          <SFButton variant="ghost" size="sm" style={{ color: "oklch(0.985 0 0)", justifyContent: "space-between", width: "100%" }}>EXPORT MANIFEST<span>↓</span></SFButton>
          <SFButton variant="ghost" size="sm" style={{ color: "oklch(0.985 0 0)", justifyContent: "space-between", width: "100%" }}>FORK FRAME<span>⎇</span></SFButton>
        </div>
      </div>
    </aside>
  </div>
);

const QueueView = ({ hue }) => (
  <div style={{ padding: 24, overflowY: "auto" }}>
    <SFLabel style={{ color: "oklch(0.65 0 0)" }}>§01 · INGEST / QUEUE</SFLabel>
    <h1 style={{ fontFamily: "var(--font-display)", fontSize: 64, textTransform: "uppercase", lineHeight: 0.9, margin: "8px 0 24px" }}>INCOMING SIGNAL</h1>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
      <thead>
        <tr style={{ borderBottom: "3px solid oklch(0.985 0 0)" }}>
          {["ID", "SOURCE", "KIND", "SIZE", "STATUS", ""].map(h => (
            <th key={h} style={{ textAlign: "left", padding: "10px 8px", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, color: "oklch(0.65 0 0)" }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody style={{ fontFamily: "var(--font-mono)" }}>
        {[
          ["R08-24-0417", "detund.bandcamp", "audio", "48.2M", "INGESTING", "primary"],
          ["R08-24-0416", "tdr-archive", "image", "12.8M", "STABLE", "success"],
          ["R08-24-0415", "neubau-berlin", "video", "142.0M", "DRIFT", "warning"],
          ["R08-24-0414", "ikeda-data", "data", "0.4M", "STABLE", "success"],
          ["R08-24-0413", "autechre-warp", "audio", "88.1M", "ARCHIVE", "default"],
        ].map(([id, src, kind, size, status, variant]) => (
          <tr key={id} style={{ borderBottom: "2px solid oklch(0.4 0 0)" }}>
            <td style={{ padding: "10px 8px", fontWeight: 700 }}>{id}</td>
            <td style={{ padding: "10px 8px", color: "oklch(0.75 0 0)" }}>{src}</td>
            <td style={{ padding: "10px 8px", color: "oklch(0.75 0 0)" }}>{kind}</td>
            <td style={{ padding: "10px 8px" }}>{size}</td>
            <td style={{ padding: "10px 8px" }}><SFBadge variant={variant}>{status}</SFBadge></td>
            <td style={{ padding: "10px 8px", textAlign: "right", color: `oklch(0.78 0.28 ${hue})`, fontWeight: 700 }}>→</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const TokensView = ({ hue }) => (
  <div style={{ padding: 24, overflowY: "auto" }}>
    <SFLabel style={{ color: "oklch(0.65 0 0)" }}>§03 · FRAME / TOKENS</SFLabel>
    <h1 style={{ fontFamily: "var(--font-display)", fontSize: 64, textTransform: "uppercase", lineHeight: 0.9, margin: "8px 0 24px" }}>TOKEN LEDGER</h1>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
      {[
        ["PRIMARY", `oklch(0.65 0.3 ${hue})`, "--color-primary"],
        ["SUCCESS", "oklch(0.85 0.25 145)", "--color-success"],
        ["WARNING", "oklch(0.91 0.18 98)", "--color-warning"],
        ["DESTRUCTIVE", "oklch(0.55 0.18 25)", "--color-destructive"],
        ["FOREGROUND", "oklch(0.985 0 0)", "--color-foreground"],
        ["BORDER", "oklch(0.4 0 0)", "--color-border"],
      ].map(([name, color, token]) => (
        <div key={name} style={{ border: "2px solid oklch(0.4 0 0)" }}>
          <div style={{ height: 80, background: color }}/>
          <div style={{ padding: 12 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em" }}>{name}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "oklch(0.65 0 0)", marginTop: 2 }}>{token}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

Object.assign(window, { OSChrome, Sidebar, Toolbar, ComposerView, QueueView, TokensView });
