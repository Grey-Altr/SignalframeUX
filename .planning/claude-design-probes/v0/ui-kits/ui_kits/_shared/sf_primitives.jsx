// Shared SF primitives for UI kits — Babel JSX
// Expects colors_and_type.css to already be imported.

const SFButton = ({ variant = "primary", size = "md", children, onClick, style, ...rest }) => {
  const base = {
    fontFamily: "var(--font-mono)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: 700,
    border: "2px solid",
    padding: size === "sm" ? "6px 12px" : size === "lg" ? "14px 28px" : "10px 22px",
    fontSize: size === "sm" ? "10px" : size === "lg" ? "13px" : "12px",
    cursor: "pointer",
    transition: "all 100ms cubic-bezier(0.2,0,0,1)",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  };
  const variants = {
    primary: { background: "oklch(0.65 0.3 var(--sfx-theme-hue))", color: "oklch(0.985 0 0)", borderColor: "oklch(0.65 0.3 var(--sfx-theme-hue))" },
    solid:   { background: "var(--color-foreground)", color: "var(--color-background)", borderColor: "var(--color-foreground)" },
    ghost:   { background: "transparent", color: "currentColor", borderColor: "currentColor" },
    signal:  { background: "var(--color-foreground)", color: "oklch(0.985 0 0)", borderColor: "oklch(0.65 0.3 var(--sfx-theme-hue))" },
    destructive: { background: "transparent", color: "oklch(0.550 0.180 25)", borderColor: "oklch(0.550 0.180 25)" },
  };
  return <button onClick={onClick} style={{ ...base, ...variants[variant], ...style }} {...rest}>{children}</button>;
};

const SFLabel = ({ children, style }) => (
  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", ...style }}>
    {children}
  </div>
);

const SFBadge = ({ variant = "default", children }) => {
  const palettes = {
    default: { bg: "transparent", fg: "currentColor", border: "currentColor" },
    primary: { bg: "oklch(0.65 0.3 var(--sfx-theme-hue))", fg: "oklch(0.985 0 0)", border: "oklch(0.65 0.3 var(--sfx-theme-hue))" },
    solid:   { bg: "var(--color-foreground)", fg: "var(--color-background)", border: "var(--color-foreground)" },
    success: { bg: "oklch(0.85 0.25 145)", fg: "var(--color-foreground)", border: "oklch(0.85 0.25 145)" },
    warning: { bg: "oklch(0.91 0.18 98)", fg: "var(--color-foreground)", border: "oklch(0.91 0.18 98)" },
    destructive: { bg: "transparent", fg: "oklch(0.550 0.180 25)", border: "oklch(0.550 0.180 25)" },
  };
  const p = palettes[variant];
  return <span style={{ display: "inline-block", padding: "3px 8px", border: `2px solid ${p.border}`, background: p.bg, color: p.fg, fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em" }}>{children}</span>;
};

const SFStatusDot = ({ color = "oklch(0.85 0.25 145)", label }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700 }}>
    <span style={{ width: 8, height: 8, background: color, display: "inline-block" }} />
    {label}
  </span>
);

const SFInput = ({ state = "default", ...rest }) => {
  const border = state === "focus"
    ? "oklch(0.65 0.3 var(--sfx-theme-hue))"
    : state === "error"
    ? "oklch(0.550 0.180 25)"
    : "currentColor";
  return <input style={{ width: "100%", padding: "9px 10px", border: `2px solid ${border}`, background: "transparent", color: "currentColor", fontFamily: "var(--font-mono)", fontSize: 12, outline: "none", boxShadow: state === "focus" ? "0 0 0 2px oklch(0.65 0.3 350 / 0.2)" : "none" }} {...rest}/>;
};

const SFDivider = ({ weight = "element", color }) => (
  <hr style={{ border: 0, borderTop: `${weight === "section" ? 4 : weight === "divider" ? 3 : 2}px solid ${color || "currentColor"}`, margin: 0 }}/>
);

const SFSection = ({ children, style }) => (
  <section style={{ padding: "32px", borderBottom: "4px solid currentColor", ...style }}>{children}</section>
);

const SFContainer = ({ children, style }) => (
  <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", ...style }}>{children}</div>
);

// Grain+scanline overlay layer
const SFSignalOverlay = ({ intensity = 0.5 }) => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 9999 }}>
    <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(to bottom,transparent 0,transparent 3px,oklch(0 0 0 / 0.18) 3px,oklch(0 0 0 / 0.18) 4px)", opacity: intensity * 0.5 }}/>
    <div style={{ position: "absolute", inset: 0, backgroundImage: "url('../../assets/grain.svg')", opacity: intensity * 0.4, mixBlendMode: "screen" }}/>
  </div>
);

const CDSymbol = ({ size = 32, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden>
    <rect x="2" y="2" width="36" height="36" stroke={color} strokeWidth="3" fill="none"/>
    <path d="M10 10 H30 M10 20 H30 M10 30 H22" stroke={color} strokeWidth="3"/>
  </svg>
);

Object.assign(window, { SFButton, SFLabel, SFBadge, SFStatusDot, SFInput, SFDivider, SFSection, SFContainer, SFSignalOverlay, CDSymbol });
