// Culture Division portfolio hero, nav, project index
/* eslint-disable */
const { useState } = React;

const TopNav = ({ theme, onToggle }) => (
  <nav style={{ position: "sticky", top: 0, zIndex: 9999, background: "var(--color-background)", borderBottom: "2px solid var(--color-foreground)", height: 64, display: "flex", alignItems: "center", padding: "0 24px", justifyContent: "space-between" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <img src="../../assets/logo-sf-mark.svg" height="22" alt="SF"/>
      <SFLabel style={{ opacity: 0.6 }}>CULTURE DIVISION · v0.1</SFLabel>
    </div>
    <div style={{ display: "flex", gap: 24 }}>
      {["INDEX", "WORK", "SIGNAL", "MANIFESTO", "CONTACT"].map((x, i) => (
        <a key={x} href="#" style={{ fontFamily: "var(--font-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, color: "currentColor", textDecoration: i === 0 ? "underline" : "none", textUnderlineOffset: 6, textDecorationThickness: 2 }}>{x}</a>
      ))}
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <SFStatusDot color="oklch(0.85 0.25 145)" label="ONLINE"/>
      <button onClick={onToggle} style={{ background: "transparent", border: "2px solid currentColor", color: "currentColor", fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, padding: "6px 10px", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
        {theme === "dark" ? "FRAME/LIGHT" : "FRAME/DARK"}
      </button>
    </div>
  </nav>
);

const HeroFrame = ({ hue, seed }) => (
  <section style={{ position: "relative", minHeight: 520, background: "var(--color-background)", borderBottom: "4px solid currentColor", overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px)`, backgroundSize: "64px 100%", opacity: 0.08, pointerEvents: "none" }}/>
    <div style={{ padding: "32px 24px", maxWidth: 1280, margin: "0 auto", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.18em", opacity: 0.7, marginBottom: 24 }}>
        <span>INDEX · R08 · CULTURE DIVISION</span>
        <span>HUE:{hue} · SEED:{seed} · 2026-04-17</span>
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(60px, 11vw, 180px)", lineHeight: 0.85, textTransform: "uppercase", letterSpacing: "-0.02em", color: "var(--color-foreground)", maxWidth: 1100 }}>
        SIGNAL<span style={{ color: `oklch(0.65 0.3 ${hue})` }}>//</span>FRAME<br/>
        <span style={{ color: `oklch(0.65 0.3 ${hue})` }}>UX</span> IS A<br/>DESIGN STUDIO
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, marginTop: 48, alignItems: "end" }}>
        <div style={{ fontSize: 13, maxWidth: 320, lineHeight: 1.5 }}>
          Culture Division operates at the intersection of electronic music culture, critical design, and product engineering. No gradients. No rounded corners. No apologies.
        </div>
        <div>
          <SFLabel>STUDIO COORDINATES</SFLabel>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, marginTop: 6, lineHeight: 1.6 }}>42.3314° N<br/>83.0458° W<br/>DETROIT // EST. 2018</div>
        </div>
        <div style={{ justifySelf: "end", display: "flex", gap: 10 }}>
          <SFButton variant="solid">VIEW INDEX</SFButton>
          <SFButton variant="ghost">MANIFESTO ↗</SFButton>
        </div>
      </div>
    </div>
  </section>
);

const ProjectRow = ({ id, title, client, year, status, hue }) => (
  <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 220px 80px 120px 24px", gap: 16, padding: "20px 24px", borderBottom: "2px solid currentColor", alignItems: "center", cursor: "pointer", transition: "all 100ms" }}
       onMouseEnter={e => e.currentTarget.style.background = `oklch(0.65 0.3 ${hue} / 0.08)`}
       onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em" }}>{id}</div>
    <div style={{ fontFamily: "var(--font-display)", fontSize: 32, textTransform: "uppercase", lineHeight: 1 }}>{title}</div>
    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.7 }}>{client}</div>
    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700 }}>{year}</div>
    <SFBadge variant={status === "ACTIVE" ? "primary" : status === "ARMED" ? "warning" : "default"}>{status}</SFBadge>
    <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700 }}>→</div>
  </div>
);

const ProjectIndex = ({ hue }) => (
  <section style={{ borderBottom: "4px solid currentColor" }}>
    <div style={{ padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "3px solid currentColor" }}>
      <div>
        <SFLabel style={{ opacity: 0.6 }}>§02 · INDEX</SFLabel>
        <h2 style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: 32, fontWeight: 700, lineHeight: 1.1, marginTop: 4 }}>Selected work, 2018—present.</h2>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <SFButton variant="solid" size="sm">ALL · 12</SFButton>
        <SFButton variant="ghost" size="sm">LIVE · 4</SFButton>
        <SFButton variant="ghost" size="sm">ARCHIVE · 8</SFButton>
      </div>
    </div>
    {[
      { id: "R08", title: "DETROIT UNDERGROUND", client: "CATALOG REISSUE", year: "2024", status: "ACTIVE" },
      { id: "R07", title: "CD-OPERATOR", client: "INTERNAL TOOLING", year: "2024", status: "ARMED" },
      { id: "R06", title: "NEUBAU SPEC", client: "BERLIN GALLERY", year: "2023", status: "LIVE" },
      { id: "R05", title: "WARPED FIELD", client: "AUTECHRE × CD", year: "2023", status: "ARCHIVE" },
      { id: "R04", title: "FUSE REVIVAL", client: "TYPE FOUNDRY", year: "2022", status: "LIVE" },
      { id: "R03", title: "IKEDA DATA//", client: "INSTALLATION", year: "2021", status: "ARCHIVE" },
    ].map(p => <ProjectRow key={p.id} {...p} hue={hue}/>)}
  </section>
);

const SignalPanel = ({ hue, intensity, onIntensity, seed, onSeed }) => (
  <section style={{ background: "var(--color-foreground)", color: "var(--color-background)", padding: "48px 24px", borderBottom: "4px solid var(--color-foreground)", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(to bottom,transparent 0,transparent 3px,oklch(0 0 0 / 0.3) 3px,oklch(0 0 0 / 0.3) 4px)", opacity: intensity, pointerEvents: "none" }}/>
    <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, position: "relative" }}>
      <div>
        <SFLabel style={{ color: `oklch(0.78 0.28 ${hue})` }}>§03 · SIGNAL LAYER</SFLabel>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 80, lineHeight: 0.9, textTransform: "uppercase", marginTop: 8 }}>
          THE SIGNAL<br/>RUNS THROUGH<br/>THE <span style={{ color: `oklch(0.78 0.28 ${hue})` }}>FRAME</span>
        </div>
        <div style={{ fontSize: 13, maxWidth: 460, marginTop: 24, opacity: 0.8, lineHeight: 1.6 }}>
          FRAME is deterministic. SIGNAL is parametric. Every surface carries its own seed; every component has its own variation. Adjust intensity to taste — the frame never breaks.
        </div>
      </div>
      <div style={{ border: "2px solid oklch(0.985 0 0)", padding: 24 }}>
        <SFLabel style={{ color: "oklch(0.65 0 0)" }}>PARAMETERS</SFLabel>
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em" }}>
            <span>--signal-intensity</span><span style={{ color: `oklch(0.78 0.28 ${hue})` }}>{intensity.toFixed(2)}</span>
          </div>
          <input type="range" min="0" max="1" step="0.01" value={intensity} onChange={e => onIntensity(+e.target.value)} style={{ width: "100%", accentColor: `oklch(0.78 0.28 ${hue})`, marginTop: 8 }}/>
        </div>
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em" }}>
            <span>--signal-seed</span><span style={{ color: `oklch(0.78 0.28 ${hue})` }}>0x{seed}</span>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <SFButton variant="ghost" size="sm" style={{ color: "oklch(0.985 0 0)" }} onClick={() => onSeed(Math.floor(Math.random()*65535).toString(16).toUpperCase().padStart(4, "0"))}>↻ REGENERATE</SFButton>
            <SFButton variant="ghost" size="sm" style={{ color: "oklch(0.985 0 0)" }}>COPY</SFButton>
          </div>
        </div>
        <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(16, 1fr)", gap: 2, height: 40 }}>
          {Array.from({ length: 64 }).map((_, i) => {
            const n = (parseInt(seed, 16) + i * 37) % 100;
            return <div key={i} style={{ background: n < intensity * 100 ? `oklch(0.78 0.28 ${hue})` : "oklch(0.3 0 0)", height: `${20 + n * 0.4}%`, alignSelf: "end" }}/>;
          })}
        </div>
      </div>
    </div>
  </section>
);

const Footer = ({ hue, seed }) => (
  <footer style={{ padding: "48px 24px", borderTop: "2px solid currentColor" }}>
    <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 32 }}>
      <div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 48, textTransform: "uppercase", lineHeight: 0.9 }}>INGEST<br/>OR DRIFT.</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.18em", opacity: 0.6, marginTop: 12 }}>CULTURE DIVISION · v0.1 · HUE:{hue} · SEED:{seed}</div>
      </div>
      {[["INDEX", ["Work", "Signal", "Manifesto", "Press"]], ["CONTACT", ["hello@cd.studio", "Detroit, MI", "+1 313 555 0108"]], ["LINEAGE", ["Detroit Underground", "TDR", "Ikeda", "Autechre"]]].map(([title, items]) => (
        <div key={title}>
          <SFLabel>{title}</SFLabel>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
            {items.map(i => <span key={i}>{i}</span>)}
          </div>
        </div>
      ))}
    </div>
  </footer>
);

Object.assign(window, { TopNav, HeroFrame, ProjectIndex, SignalPanel, Footer });
