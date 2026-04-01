"use client";

import { useState } from "react";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";

/* ── Sidebar nav structure ── */
const NAV_SECTIONS = [
  {
    title: "CORE",
    items: [
      { label: "createSignalframeUX", id: "createSignalframeUX" },
      { label: "useSignalframe", id: "useSignalframe" },
      { label: "SFUXProvider", id: "SFUXProvider" },
      { label: "defineTheme", id: "defineTheme" },
    ],
  },
  {
    title: "COMPONENTS",
    items: [
      { label: "Button", id: "button", badge: "340+" },
      { label: "Input", id: "input" },
      { label: "Card", id: "card" },
      { label: "Modal", id: "modal" },
      { label: "Table", id: "table" },
      { label: "Tabs", id: "tabs" },
      { label: "Toast", id: "toast" },
      { label: "Dropdown", id: "dropdown" },
      { label: "Drawer", id: "drawer" },
      { label: "Badge", id: "badge" },
    ],
  },
  {
    title: "FIELD LAYER",
    items: [
      { label: "NoiseBG", id: "noisebg" },
      { label: "ParticleMesh", id: "particlemesh" },
      { label: "GlitchText", id: "glitchtext" },
      { label: "Waveform", id: "waveform" },
      { label: "ReactiveCanvas", id: "reactivecanvas" },
    ],
  },
  {
    title: "TOKENS",
    items: [
      { label: "colors", id: "colors" },
      { label: "spacing", id: "spacing" },
      { label: "typography", id: "typography" },
      { label: "motion", id: "motion" },
      { label: "elevation", id: "elevation" },
    ],
  },
  {
    title: "HOOKS",
    items: [
      { label: "useFieldEffect", id: "useFieldEffect" },
      { label: "useToken", id: "useToken" },
      { label: "useMotion", id: "useMotion" },
      { label: "useBreakpoint", id: "useBreakpoint" },
    ],
  },
];

/* ── Props table data ── */
const BUTTON_PROPS = [
  {
    name: "variant",
    type: "'signal' | 'ghost' | 'field' | 'danger'",
    default: "'signal'",
    desc: "VISUAL VARIANT",
  },
  {
    name: "size",
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    desc: "BUTTON SIZE",
  },
  {
    name: "fieldEffect",
    type: "'shimmer' | 'pulse' | 'glitch' | 'none'",
    default: "'none'",
    desc: "FIELD LAYER EFFECT",
  },
  {
    name: "fieldIntensity",
    type: "number (0-1)",
    default: "0.5",
    desc: "EFFECT STRENGTH",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    desc: "DISABLE INTERACTION",
  },
  {
    name: "onClick",
    type: "() => void",
    default: "—",
    desc: "CLICK HANDLER",
    required: true,
  },
];

export default function APIPage() {
  const [activeNav, setActiveNav] = useState("button");
  const [activeTab, setActiveTab] = useState<"signal" | "field">("signal");

  return (
    <>
      <Nav />
      <main>
        {/* 3-panel grid layout */}
        <div
          className="mt-[83px] min-h-[calc(100vh-83px)]"
          style={{
            display: "grid",
            gridTemplateColumns: "240px 1fr 380px",
          }}
        >
          {/* ═══════════════════════════════════════════
              LEFT PANEL — API Navigation
              ═══════════════════════════════════════════ */}
          <aside
            className="sticky top-[83px] h-[calc(100vh-83px)] overflow-y-auto"
            style={{ background: "#000", color: "#fff" }}
          >
            {/* Header */}
            <div
              className="border-b border-[#333]"
              style={{
                padding: "20px 16px",
                fontFamily: "var(--font-display)",
                fontSize: "24px",
                textTransform: "uppercase",
              }}
            >
              API™
            </div>

            {/* Nav sections */}
            {NAV_SECTIONS.map((section) => (
              <div
                key={section.title}
                className="border-b border-[#222]"
                style={{ padding: "12px 0" }}
              >
                <div
                  style={{
                    fontSize: "9px",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    color: "#888",
                    padding: "0 16px 8px",
                  }}
                >
                  {section.title}
                </div>
                {section.items.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setActiveNav(item.id)}
                    className={`block no-underline uppercase transition-colors ${
                      activeNav === item.id
                        ? "text-[#FF0090] bg-[#1a1a1a] border-l-[3px] border-l-[#FF0090]"
                        : "text-[#aaa] hover:text-white hover:bg-[#1a1a1a]"
                    }`}
                    style={{
                      padding: "6px 16px",
                      fontSize: "11px",
                      letterSpacing: "0.08em",
                      textDecoration: "none",
                    }}
                  >
                    {item.label}
                    {"badge" in item && item.badge && (
                      <span
                        className="ml-1.5 inline-block"
                        style={{
                          fontSize: "8px",
                          background: "#FF0090",
                          color: "#fff",
                          padding: "1px 5px",
                          textTransform: "uppercase",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </a>
                ))}
              </div>
            ))}
          </aside>

          {/* ═══════════════════════════════════════════
              CENTER PANEL — Documentation
              ═══════════════════════════════════════════ */}
          <div
            className="overflow-y-auto border-r-[3px] border-foreground"
            style={{
              padding: "40px 48px",
              height: "calc(100vh - 83px)",
            }}
          >
            {/* Breadcrumb */}
            <div
              style={{
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "#888",
                marginBottom: "24px",
              }}
            >
              <span className="text-[#FF0090]">API</span> /{" "}
              <span className="text-[#FF0090]">COMPONENTS</span> / BUTTON
            </div>

            {/* Title */}
            <h1
              className="text-foreground"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "72px",
                textTransform: "uppercase",
                lineHeight: 0.95,
                marginBottom: "8px",
              }}
            >
              BUTTON
            </h1>

            {/* Version badge */}
            <span
              className="inline-block font-bold"
              style={{
                fontSize: "9px",
                padding: "3px 10px",
                background: "#FFE500",
                color: "#333",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "24px",
              }}
            >
              SIGNAL LAYER · v2.1.0 · STABLE
            </span>

            {/* Description */}
            <p
              style={{
                fontSize: "14px",
                lineHeight: 1.8,
                color: "#333",
                maxWidth: "580px",
                marginBottom: "32px",
              }}
            >
              THE PRIMARY INTERACTIVE ELEMENT. SUPPORTS SIGNAL (DETERMINISTIC)
              AND FIELD (GENERATIVE) VARIANTS. PROGRESSIVE ENHANCEMENT — FIELD
              EFFECTS LAYER ON TOP WITHOUT BREAKING ACCESSIBILITY.
            </p>

            {/* ── IMPORT ── */}
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "32px",
                textTransform: "uppercase",
                marginTop: "48px",
                marginBottom: "16px",
                paddingTop: "24px",
                borderTop: "2px solid #000",
              }}
            >
              IMPORT
            </h2>
            <div
              className="relative overflow-x-auto font-mono"
              style={{
                background: "#111",
                color: "#00FF00",
                padding: "20px 24px",
                fontSize: "12px",
                lineHeight: 1.7,
                margin: "16px 0",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              <span
                className="absolute"
                style={{
                  top: "6px",
                  right: "10px",
                  fontSize: "8px",
                  color: "#888",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                }}
              >
                TSX
              </span>
              <span style={{ color: "#FF0090" }}>import</span>
              {" { "}
              <span style={{ color: "#00FF00" }}>Button</span>
              {" } "}
              <span style={{ color: "#FF0090" }}>from</span>{" "}
              <span style={{ color: "#FFE500" }}>
                {"'@sfux/components'"}
              </span>
              {"\n\n"}
              <span style={{ color: "#555" }}>{"// OR DIRECT IMPORT"}</span>
              {"\n"}
              <span style={{ color: "#FF0090" }}>import</span>
              {" { "}
              <span style={{ color: "#00FF00" }}>Button</span>
              {" } "}
              <span style={{ color: "#FF0090" }}>from</span>{" "}
              <span style={{ color: "#FFE500" }}>
                {"'@sfux/components/Button'"}
              </span>
            </div>

            {/* ── PROPS ── */}
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "32px",
                textTransform: "uppercase",
                marginTop: "48px",
                marginBottom: "16px",
                paddingTop: "24px",
                borderTop: "2px solid #000",
              }}
            >
              PROPS
            </h2>
            <table
              className="w-full font-mono"
              style={{
                borderCollapse: "collapse",
                marginBottom: "24px",
                fontSize: "11px",
              }}
            >
              <thead>
                <tr>
                  {["PROP", "TYPE", "DEFAULT", "DESC"].map((h) => (
                    <th
                      key={h}
                      className="text-left"
                      style={{
                        padding: "10px 12px",
                        background: "#000",
                        color: "#fff",
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        fontSize: "9px",
                        fontWeight: 700,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BUTTON_PROPS.map((prop) => (
                  <tr key={prop.name}>
                    <td
                      style={{
                        padding: "10px 12px",
                        borderBottom: "1px solid #ddd",
                        color: "#FF0090",
                        fontWeight: 700,
                      }}
                    >
                      {prop.name}
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "10px",
                          background: "#f0f0f0",
                          padding: "2px 6px",
                          color: "#333",
                        }}
                      >
                        {prop.type}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        borderBottom: "1px solid #ddd",
                        color: "#888",
                      }}
                    >
                      {prop.default}
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      {prop.desc}
                      {prop.required && (
                        <span
                          className="ml-1.5"
                          style={{
                            fontSize: "8px",
                            background: "#E91E63",
                            color: "#fff",
                            padding: "1px 4px",
                          }}
                        >
                          REQ
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ── USAGE ── */}
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "32px",
                textTransform: "uppercase",
                marginTop: "48px",
                marginBottom: "16px",
                paddingTop: "24px",
                borderTop: "2px solid #000",
              }}
            >
              USAGE
            </h2>

            {/* Tabs */}
            <div className="flex gap-0 mb-0">
              <button
                onClick={() => setActiveTab("signal")}
                className="uppercase font-mono font-bold"
                style={{
                  fontSize: "13px",
                  letterSpacing: "0.1em",
                  padding: "8px 16px",
                  border: "none",
                  borderBottom:
                    activeTab === "signal"
                      ? "3px solid #FF0090"
                      : "3px solid transparent",
                  color: activeTab === "signal" ? "#FF0090" : "#888",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                SIGNAL (DEFAULT)
              </button>
              <button
                onClick={() => setActiveTab("field")}
                className="uppercase font-mono font-bold"
                style={{
                  fontSize: "13px",
                  letterSpacing: "0.1em",
                  padding: "8px 16px",
                  border: "none",
                  borderBottom:
                    activeTab === "field"
                      ? "3px solid #FF0090"
                      : "3px solid transparent",
                  color: activeTab === "field" ? "#FF0090" : "#888",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                FIELD VARIANT (GENERATIVE)
              </button>
            </div>

            {activeTab === "signal" ? (
              <div
                className="relative overflow-x-auto font-mono"
                style={{
                  background: "#111",
                  color: "#00FF00",
                  padding: "20px 24px",
                  fontSize: "12px",
                  lineHeight: 1.7,
                  margin: "0 0 16px 0",
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                <span
                  className="absolute"
                  style={{
                    top: "6px",
                    right: "10px",
                    fontSize: "8px",
                    color: "#888",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                  }}
                >
                  TSX
                </span>
                <span style={{ color: "#00FF00" }}>&lt;Button</span>{" "}
                <span style={{ color: "#FF6B6B" }}>variant</span>=
                <span style={{ color: "#FFE500" }}>{'"signal"'}</span>
                <span style={{ color: "#00FF00" }}>&gt;</span>
                {"\n  GET STARTED\n"}
                <span style={{ color: "#00FF00" }}>&lt;/Button&gt;</span>
              </div>
            ) : (
              <div
                className="relative overflow-x-auto font-mono"
                style={{
                  background: "#111",
                  color: "#00FF00",
                  padding: "20px 24px",
                  fontSize: "12px",
                  lineHeight: 1.7,
                  margin: "0 0 16px 0",
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                <span
                  className="absolute"
                  style={{
                    top: "6px",
                    right: "10px",
                    fontSize: "8px",
                    color: "#888",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                  }}
                >
                  TSX
                </span>
                <span style={{ color: "#00FF00" }}>&lt;Button</span>
                {"\n  "}
                <span style={{ color: "#FF6B6B" }}>variant</span>=
                <span style={{ color: "#FFE500" }}>{'"field"'}</span>
                {"\n  "}
                <span style={{ color: "#FF6B6B" }}>fieldEffect</span>=
                <span style={{ color: "#FFE500" }}>{'"shimmer"'}</span>
                {"\n  "}
                <span style={{ color: "#FF6B6B" }}>fieldIntensity</span>
                {"={"}
                <span style={{ color: "#FF6B6B" }}>0.8</span>
                {"}"}
                {"\n"}
                <span style={{ color: "#00FF00" }}>&gt;</span>
                {"\n  LAUNCH SEQUENCE\n"}
                <span style={{ color: "#00FF00" }}>&lt;/Button&gt;</span>
              </div>
            )}

            {/* ── ACCESSIBILITY ── */}
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "32px",
                textTransform: "uppercase",
                marginTop: "48px",
                marginBottom: "16px",
                paddingTop: "24px",
                borderTop: "2px solid #000",
              }}
            >
              ACCESSIBILITY
            </h2>
            <div
              className="font-mono"
              style={{
                background: "#111",
                color: "#555",
                padding: "20px 24px",
                fontSize: "12px",
                lineHeight: 1.7,
                margin: "16px 0",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              <span
                className="absolute"
                style={{
                  top: "6px",
                  right: "10px",
                  fontSize: "8px",
                  color: "#888",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                }}
              >
                INFO
              </span>
              WCAG 2.1 AA COMPLIANT{"\n"}
              {"• "}FOCUS RING: 3PX SOLID, OFFSET 2PX{"\n"}
              {"• "}CONTRAST: 7:1 MIN (SIGNAL), 4.5:1 (FIELD){"\n"}
              {"• "}FIELD EFFECTS: RESPECTS PREFERS-REDUCED-MOTION{"\n"}
              {"• "}ARIA: ROLE=&quot;BUTTON&quot; AUTOMATIC
            </div>
          </div>

          {/* ═══════════════════════════════════════════
              RIGHT PANEL — Live Preview
              ═══════════════════════════════════════════ */}
          <aside
            className="sticky top-[83px] h-[calc(100vh-83px)] overflow-y-auto"
            style={{ background: "#0a0a0a", color: "#fff" }}
          >
            {/* Preview header */}
            <div
              className="flex items-center justify-between border-b border-[#333]"
              style={{ padding: "16px 20px" }}
            >
              <span
                style={{
                  fontSize: "9px",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: "#888",
                }}
              >
                LIVE PREVIEW™
              </span>
              <div className="flex gap-2">
                {["LIGHT", "DARK", "FIELD"].map((label, i) => (
                  <button
                    key={label}
                    className="font-mono"
                    style={{
                      fontSize: "9px",
                      padding: "4px 10px",
                      border:
                        i === 0
                          ? "1px solid #FF0090"
                          : "1px solid #444",
                      color: i === 0 ? "#FF0090" : "#888",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      background: "transparent",
                      cursor: "pointer",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview stage */}
            <div
              className="relative flex flex-col items-center justify-center gap-6"
              style={{ padding: "40px 24px", minHeight: "300px" }}
            >
              {/* HUD overlay */}
              <div
                className="absolute"
                style={{
                  top: "20px",
                  left: "20px",
                  fontSize: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: "#00FF00",
                  opacity: 0.4,
                }}
              >
                <div>SF//UX::BUTTON::RENDER</div>
                <div>VARIANT: SIGNAL | GHOST | FIELD</div>
                <div>FIELD: SHIMMER @ 0.8</div>
                <div>FPS: 60 | MEM: 2.4MB</div>
              </div>

              {/* Rendered buttons */}
              <div className="text-center">
                <div
                  style={{
                    fontSize: "9px",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    color: "#888",
                    marginBottom: "8px",
                  }}
                >
                  VARIANT: SIGNAL
                </div>
                <button
                  className="font-mono font-bold uppercase"
                  style={{
                    fontSize: "12px",
                    letterSpacing: "0.15em",
                    padding: "14px 28px",
                    background: "#fff",
                    color: "#000",
                    border: "2px solid #fff",
                    cursor: "pointer",
                  }}
                >
                  GET STARTED
                </button>
              </div>

              <div className="text-center">
                <div
                  style={{
                    fontSize: "9px",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    color: "#888",
                    marginBottom: "8px",
                  }}
                >
                  VARIANT: GHOST
                </div>
                <button
                  className="font-mono font-bold uppercase"
                  style={{
                    fontSize: "12px",
                    letterSpacing: "0.15em",
                    padding: "14px 28px",
                    background: "transparent",
                    color: "#fff",
                    border: "2px solid #fff",
                    cursor: "pointer",
                  }}
                >
                  VIEW DOCS
                </button>
              </div>

              <div className="text-center">
                <div
                  style={{
                    fontSize: "9px",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    color: "#888",
                    marginBottom: "8px",
                  }}
                >
                  VARIANT: FIELD (SHIMMER)
                </div>
                <button
                  className="font-mono font-bold uppercase relative overflow-hidden"
                  style={{
                    fontSize: "12px",
                    letterSpacing: "0.15em",
                    padding: "14px 28px",
                    background: "#FF0090",
                    color: "#fff",
                    border: "2px solid #FF0090",
                    cursor: "pointer",
                  }}
                >
                  LAUNCH SEQUENCE
                </button>
              </div>

              <div className="text-center">
                <div
                  style={{
                    fontSize: "9px",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    color: "#888",
                    marginBottom: "8px",
                  }}
                >
                  VARIANT: YELLOW (TDR)
                </div>
                <button
                  className="font-mono font-bold uppercase"
                  style={{
                    fontSize: "12px",
                    letterSpacing: "0.15em",
                    padding: "14px 28px",
                    background: "#FFE500",
                    color: "#000",
                    border: "2px solid #FFE500",
                    cursor: "pointer",
                  }}
                >
                  BUY ME™
                </button>
              </div>
            </div>

            {/* Preview code */}
            <div
              className="font-mono"
              style={{
                width: "100%",
                padding: "20px",
                background: "#111",
                fontSize: "11px",
                color: "#00FF00",
                lineHeight: 1.6,
                borderTop: "1px solid #333",
              }}
            >
              <span style={{ color: "#888" }}>
                {"// CURRENTLY RENDERED"}
              </span>
              {"\n"}
              &lt;<span style={{ color: "#FF0090" }}>Button</span>
              {"\n  "}
              <span style={{ color: "#FF6B6B" }}>variant</span>=
              <span style={{ color: "#FFE500" }}>{'"signal"'}</span>
              {"\n  "}
              <span style={{ color: "#FF6B6B" }}>size</span>=
              <span style={{ color: "#FFE500" }}>{'"md"'}</span>
              {"\n/>\n"}
            </div>
          </aside>
        </div>

        {/* ── Responsive: override grid on mobile ── */}
        <style>{`
          @media (max-width: 900px) {
            .mt-\\[83px\\] {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </main>
      <Footer />
    </>
  );
}
