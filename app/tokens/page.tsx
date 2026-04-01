"use client";

import { useState } from "react";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";

/* ── COLOR SCALE DATA ── */
const COLOR_SCALES = [
  {
    name: "NEUTRAL",
    hue: 0,
    swatches: [
      { step: 50, l: 0.99, c: 0, h: 0 },
      { step: 100, l: 0.96, c: 0, h: 0 },
      { step: 200, l: 0.90, c: 0, h: 0 },
      { step: 300, l: 0.82, c: 0, h: 0 },
      { step: 400, l: 0.70, c: 0, h: 0 },
      { step: 500, l: 0.55, c: 0, h: 0 },
      { step: 600, l: 0.45, c: 0, h: 0 },
      { step: 700, l: 0.37, c: 0, h: 0 },
      { step: 800, l: 0.27, c: 0, h: 0 },
      { step: 900, l: 0.20, c: 0, h: 0 },
      { step: 950, l: 0.14, c: 0, h: 0 },
      { step: 1000, l: 0.05, c: 0, h: 0 },
    ],
  },
  {
    name: "SIGNAL",
    hue: 330,
    swatches: [
      { step: 50, l: 0.97, c: 0.02, h: 330 },
      { step: 100, l: 0.93, c: 0.05, h: 330 },
      { step: 200, l: 0.85, c: 0.10, h: 330 },
      { step: 300, l: 0.77, c: 0.16, h: 330 },
      { step: 400, l: 0.68, c: 0.22, h: 330 },
      { step: 500, l: 0.60, c: 0.28, h: 330 },
      { step: 600, l: 0.52, c: 0.26, h: 330 },
      { step: 700, l: 0.44, c: 0.22, h: 330 },
      { step: 800, l: 0.36, c: 0.18, h: 330 },
      { step: 900, l: 0.28, c: 0.14, h: 330 },
      { step: 950, l: 0.22, c: 0.10, h: 330 },
      { step: 1000, l: 0.15, c: 0.06, h: 330 },
    ],
  },
  {
    name: "FIELD",
    hue: 145,
    swatches: [
      { step: 50, l: 0.97, c: 0.03, h: 145 },
      { step: 100, l: 0.93, c: 0.08, h: 145 },
      { step: 200, l: 0.85, c: 0.15, h: 145 },
      { step: 300, l: 0.78, c: 0.22, h: 145 },
      { step: 400, l: 0.70, c: 0.28, h: 145 },
      { step: 500, l: 0.62, c: 0.28, h: 145 },
      { step: 600, l: 0.52, c: 0.24, h: 145 },
      { step: 700, l: 0.42, c: 0.20, h: 145 },
      { step: 800, l: 0.34, c: 0.16, h: 145 },
      { step: 900, l: 0.26, c: 0.12, h: 145 },
      { step: 950, l: 0.20, c: 0.08, h: 145 },
      { step: 1000, l: 0.12, c: 0.04, h: 145 },
    ],
  },
  {
    name: "DANGER",
    hue: 25,
    swatches: [
      { step: 50, l: 0.97, c: 0.02, h: 25 },
      { step: 100, l: 0.90, c: 0.08, h: 25 },
      { step: 200, l: 0.82, c: 0.14, h: 25 },
      { step: 300, l: 0.72, c: 0.20, h: 25 },
      { step: 400, l: 0.62, c: 0.24, h: 25 },
      { step: 500, l: 0.55, c: 0.24, h: 25 },
      { step: 600, l: 0.48, c: 0.22, h: 25 },
      { step: 700, l: 0.40, c: 0.18, h: 25 },
      { step: 800, l: 0.32, c: 0.14, h: 25 },
      { step: 900, l: 0.25, c: 0.10, h: 25 },
      { step: 950, l: 0.18, c: 0.06, h: 25 },
      { step: 1000, l: 0.12, c: 0.04, h: 25 },
    ],
  },
  {
    name: "YELLOW",
    hue: 100,
    swatches: [
      { step: 50, l: 0.99, c: 0.03, h: 100 },
      { step: 100, l: 0.96, c: 0.08, h: 100 },
      { step: 200, l: 0.93, c: 0.14, h: 100 },
      { step: 300, l: 0.90, c: 0.18, h: 100 },
      { step: 400, l: 0.88, c: 0.20, h: 100 },
      { step: 500, l: 0.85, c: 0.20, h: 100 },
      { step: 600, l: 0.75, c: 0.16, h: 100 },
      { step: 700, l: 0.60, c: 0.12, h: 100 },
      { step: 800, l: 0.45, c: 0.08, h: 100 },
      { step: 900, l: 0.35, c: 0.06, h: 100 },
      { step: 950, l: 0.25, c: 0.04, h: 100 },
      { step: 1000, l: 0.15, c: 0.02, h: 100 },
    ],
  },
  {
    name: "ACCENT",
    hue: 350,
    swatches: [
      { step: 50, l: 0.97, c: 0.03, h: 350 },
      { step: 100, l: 0.93, c: 0.06, h: 350 },
      { step: 200, l: 0.85, c: 0.12, h: 350 },
      { step: 300, l: 0.77, c: 0.18, h: 350 },
      { step: 400, l: 0.68, c: 0.24, h: 350 },
      { step: 500, l: 0.60, c: 0.29, h: 350 },
      { step: 600, l: 0.52, c: 0.27, h: 350 },
      { step: 700, l: 0.44, c: 0.23, h: 350 },
      { step: 800, l: 0.36, c: 0.19, h: 350 },
      { step: 900, l: 0.28, c: 0.15, h: 350 },
      { step: 950, l: 0.22, c: 0.11, h: 350 },
      { step: 1000, l: 0.15, c: 0.07, h: 350 },
    ],
  },
];

/* ── SPACING DATA ── */
const SPACING = [
  { name: "space-1", rem: "0.25rem", px: 4 },
  { name: "space-2", rem: "0.5rem", px: 8 },
  { name: "space-3", rem: "0.75rem", px: 12 },
  { name: "space-4", rem: "1rem", px: 16 },
  { name: "space-6", rem: "1.5rem", px: 24 },
  { name: "space-8", rem: "2rem", px: 32 },
  { name: "space-12", rem: "3rem", px: 48 },
  { name: "space-16", rem: "4rem", px: 64 },
  { name: "space-24", rem: "6rem", px: 96 },
];

/* ── TYPE SCALE DATA ── */
const TYPE_SCALE = [
  { name: "DISPLAY", sample: "SIGNAL//FRAME\u2122", font: "var(--font-display)", size: 64, weight: 700, meta: "ANTON \u00b7 64PX \u00b7 700" },
  { name: "H1", sample: "COMPONENTS", font: "var(--font-display)", size: 45, weight: 700, meta: "ANTON \u00b7 45PX \u00b7 700" },
  { name: "H2", sample: "API_REFERENCE", font: "var(--font-display)", size: 32, weight: 700, meta: "ANTON \u00b7 32PX \u00b7 700" },
  { name: "H3", sample: "TOKEN EXPLORER", font: "inherit", size: 22, weight: 700, meta: "ELECTROLIZE \u00b7 22PX \u00b7 700" },
  { name: "BODY", sample: "Deterministic interface. Generative expression.", font: "inherit", size: 14, weight: 400, meta: "ELECTROLIZE \u00b7 14PX \u00b7 400" },
  { name: "CAPTION", sample: "SIGNAL LAYER \u00b7 V2.1.0", font: "inherit", size: 11, weight: 700, meta: "ELECTROLIZE \u00b7 11PX \u00b7 700", uppercase: true },
  { name: "CODE", sample: "const sfux = createSignalframeUX()", font: "'JetBrains Mono', monospace", size: 13, weight: 400, meta: "JETBRAINS MONO \u00b7 13PX \u00b7 400", code: true },
];

/* ── MOTION DATA ── */
const MOTION_TOKENS = [
  { name: "EASE-DEFAULT", easing: "ease", duration: "200ms", css: "ease \u00b7 200ms" },
  { name: "EASE-IN", easing: "ease-in", duration: "200ms", css: "ease-in \u00b7 200ms" },
  { name: "EASE-OUT", easing: "ease-out", duration: "150ms", css: "ease-out \u00b7 150ms" },
  { name: "SPRING", easing: "cubic-bezier(0.68,-0.55,0.27,1.55)", duration: "400ms", css: "cubic-bezier(0.68,-0.55,0.27,1.55) \u00b7 400ms" },
  { name: "STEP", easing: "steps(8)", duration: "500ms", css: "steps(8) \u00b7 500ms" },
];

const TABS = ["COLOR", "SPACING", "TYPOGRAPHY", "MOTION", "ELEVATION", "RADIUS", "BREAKPOINTS"] as const;

export default function TokensPage() {
  const [activeTab, setActiveTab] = useState<string>("COLOR");

  return (
    <>
      <Nav />
      <main className="mt-[83px]">
        {/* ═══ PAGE HEADER ═══ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            borderBottom: "4px solid #000",
            alignItems: "end",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-anton)",
              fontSize: "clamp(60px, 9vw, 100px)",
              textTransform: "uppercase",
              lineHeight: 0.9,
              padding: "40px 48px 24px",
            }}
          >
            TOKEN
            <br />
            EXPLORER
          </h1>
          <div
            style={{
              padding: "24px 48px",
              textAlign: "right",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "#888",
            }}
          >
            OKLCH COLOR SPACE · 48 SCALES
          </div>
        </div>

        {/* ═══ CATEGORY TABS ═══ */}
        <div
          style={{
            display: "flex",
            borderBottom: "3px solid #000",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            flexWrap: "wrap",
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "14px 24px",
                fontWeight: 700,
                background: activeTab === tab ? "#000" : "transparent",
                color: activeTab === tab ? "#FF0090" : "inherit",
                borderTop: "none",
                borderLeft: "none",
                borderRight: "2px solid #000",
                borderBottom: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                transition: "background 100ms ease, color 100ms ease",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab) {
                  e.currentTarget.style.background = "#000";
                  e.currentTarget.style.color = "#fff";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "inherit";
                }
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ═══ OKLCH INFO BAND (yellow) ═══ */}
        <div
          style={{
            background: "#FFE500",
            padding: "40px 48px",
            borderBottom: "4px solid #000",
            position: "relative",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-anton)",
              fontSize: "clamp(32px, 5vw, 48px)",
              textTransform: "uppercase",
              marginBottom: "16px",
              color: "#333",
            }}
          >
            OKLCH COLOR SYSTEM™
          </h2>
          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.7,
              color: "#333",
              maxWidth: "700px",
            }}
          >
            SignalframeUX™ uses{" "}
            <code
              style={{
                background: "rgba(0,0,0,0.1)",
                padding: "2px 6px",
                fontSize: "12px",
              }}
            >
              oklch()
            </code>{" "}
            for perceptually uniform color. Every scale maintains consistent
            lightness across hues. No more blue looking darker than yellow at
            the same step. 48 scales × 12 steps = 576 color tokens. Accept
            color into your life.™
          </p>
          {/* Marquee band */}
          <div
            style={{
              height: "32px",
              overflow: "hidden",
              position: "relative",
              marginTop: "20px",
              borderTop: "1px solid rgba(0,0,0,0.1)",
              borderBottom: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: "100%",
                whiteSpace: "nowrap",
                animation: "sf-marquee-scroll 20s linear infinite",
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "#333",
                }}
              >
                PERCEPTUALLY UNIFORM // OKLCH COLOR SPACE // 576 TOKENS //
                CONSISTENT ACROSS HUES //&nbsp;&nbsp;&nbsp;&nbsp;PERCEPTUALLY
                UNIFORM // OKLCH COLOR SPACE // 576 TOKENS // CONSISTENT ACROSS
                HUES //&nbsp;&nbsp;&nbsp;&nbsp;PERCEPTUALLY UNIFORM // OKLCH
                COLOR SPACE // 576 TOKENS // CONSISTENT ACROSS HUES
                //&nbsp;&nbsp;&nbsp;&nbsp;PERCEPTUALLY UNIFORM // OKLCH COLOR
                SPACE // 576 TOKENS // CONSISTENT ACROSS HUES
                //&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            </div>
          </div>
        </div>

        {/* ═══ COLOR SCALES ═══ */}
        <div
          style={{
            fontFamily: "var(--font-anton)",
            fontSize: "clamp(32px, 5vw, 48px)",
            textTransform: "uppercase",
            padding: "32px 48px 16px",
            borderBottom: "2px solid #000",
          }}
        >
          COLOR_SCALES ( {COLOR_SCALES.length} / 48 )
        </div>
        <div>
          {COLOR_SCALES.map((scale) => (
            <div
              key={scale.name}
              style={{
                display: "grid",
                gridTemplateColumns: "200px repeat(12, 1fr)",
                borderBottom: "2px solid #000",
              }}
            >
              <div
                style={{
                  padding: "0 24px",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  borderRight: "2px solid #000",
                  background: "#000",
                  color: "#fff",
                }}
              >
                {scale.name}
              </div>
              {scale.swatches.map((sw) => {
                const isDark = sw.l < 0.55;
                const oklchStr = sw.c === 0
                  ? `oklch(${sw.l} 0 0)`
                  : `oklch(${sw.l} ${sw.c} ${sw.h})`;
                return (
                  <div
                    key={sw.step}
                    style={{
                      aspectRatio: "1",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      background: oklchStr,
                      color: isDark ? "#fff" : "#000",
                      position: "relative",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "8px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        opacity: 0.7,
                      }}
                    >
                      {sw.step}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* ═══ GRADIENT SEPARATOR BAR ═══ */}
        <div
          style={{
            height: "6px",
            background: "linear-gradient(90deg, #FF0090, #FFE500, #FF0090)",
          }}
        />

        {/* ═══ SPACING SCALE ═══ */}
        <div
          style={{
            fontFamily: "var(--font-anton)",
            fontSize: "clamp(32px, 5vw, 48px)",
            textTransform: "uppercase",
            padding: "32px 48px 16px",
            borderBottom: "2px solid #000",
          }}
        >
          SPACING_SCALE
        </div>
        <div style={{ borderBottom: "4px solid #000" }}>
          {/* Header row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "120px 200px 1fr 120px",
              background: "#000",
              color: "#fff",
              fontSize: "9px",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              fontWeight: 700,
            }}
          >
            <span style={{ padding: "10px 16px" }}>TOKEN</span>
            <span style={{ padding: "10px 16px" }}>VALUE</span>
            <span style={{ padding: "10px 16px" }}>VISUAL</span>
            <span style={{ padding: "10px 16px" }}>PX</span>
          </div>
          {SPACING.map((s) => (
            <div
              key={s.name}
              style={{
                display: "grid",
                gridTemplateColumns: "120px 200px 1fr 120px",
                borderBottom: "1px solid #ddd",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  padding: "12px 16px",
                  fontWeight: 700,
                  fontSize: "11px",
                  textTransform: "uppercase",
                  color: "#FF0090",
                }}
              >
                {s.name}
              </div>
              <div
                style={{
                  padding: "12px 16px",
                  fontSize: "11px",
                  color: "#333",
                }}
              >
                {s.rem}
              </div>
              <div style={{ padding: "12px 16px" }}>
                <div
                  style={{
                    height: "16px",
                    background: "#000",
                    width: `${s.px}px`,
                    transition: "width 0.3s",
                  }}
                />
              </div>
              <div
                style={{
                  padding: "12px 16px",
                  fontSize: "10px",
                  color: "#888",
                  textAlign: "right",
                }}
              >
                {s.px}px
              </div>
            </div>
          ))}
        </div>

        {/* ═══ GRADIENT SEPARATOR BAR ═══ */}
        <div
          style={{
            height: "6px",
            background: "linear-gradient(90deg, #FF0090, #FFE500, #FF0090)",
          }}
        />

        {/* ═══ TYPOGRAPHY SCALE ═══ */}
        <div
          style={{
            fontFamily: "var(--font-anton)",
            fontSize: "clamp(32px, 5vw, 48px)",
            textTransform: "uppercase",
            padding: "32px 48px 16px",
            borderBottom: "2px solid #000",
          }}
        >
          TYPE_SCALE ( AUGMENTED FOURTH · 1.414 )
        </div>
        <div style={{ borderBottom: "4px solid #000" }}>
          {TYPE_SCALE.map((t) => (
            <div
              key={t.name}
              style={{
                display: "grid",
                gridTemplateColumns: "160px 1fr 200px",
                borderBottom: "1px solid #ddd",
                alignItems: "baseline",
              }}
            >
              <div
                style={{
                  padding: "20px 16px",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "#FF0090",
                  fontWeight: 700,
                }}
              >
                {t.name}
              </div>
              <div
                style={{
                  padding: "20px 16px",
                  fontFamily: t.font,
                  fontSize: `${t.size}px`,
                  fontWeight: t.weight,
                  lineHeight: 1,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  textTransform: t.uppercase ? "uppercase" : undefined,
                  letterSpacing: t.uppercase ? "0.15em" : undefined,
                  ...(t.code
                    ? {
                        color: "#00FF00",
                        background: "#111",
                        padding: "8px 12px",
                        margin: "12px 16px",
                      }
                    : {}),
                }}
              >
                {t.sample}
              </div>
              <div
                style={{
                  padding: "20px 16px",
                  fontSize: "9px",
                  color: "#888",
                  textAlign: "right",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {t.meta}
              </div>
            </div>
          ))}
        </div>

        {/* ═══ GRADIENT SEPARATOR BAR ═══ */}
        <div
          style={{
            height: "6px",
            background: "linear-gradient(90deg, #FF0090, #FFE500, #FF0090)",
          }}
        />

        {/* ═══ MOTION TOKENS ═══ */}
        <div
          style={{
            fontFamily: "var(--font-anton)",
            fontSize: "clamp(32px, 5vw, 48px)",
            textTransform: "uppercase",
            padding: "32px 48px 16px",
            borderBottom: "2px solid #000",
          }}
        >
          MOTION_TOKENS
        </div>
        <div style={{ borderBottom: "4px solid #000" }}>
          {MOTION_TOKENS.map((m, i) => (
            <div
              key={m.name}
              style={{
                display: "grid",
                gridTemplateColumns: "200px 1fr 200px",
                borderBottom: "1px solid #ddd",
                alignItems: "center",
                padding: "16px 0",
              }}
            >
              <div
                style={{
                  padding: "0 16px",
                  fontWeight: 700,
                  fontSize: "11px",
                  textTransform: "uppercase",
                  color: "#FF0090",
                }}
              >
                {m.name}
              </div>
              <div
                style={{
                  padding: "0 16px",
                  position: "relative",
                  height: "24px",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    background: "#000",
                    position: "absolute",
                    top: "-2px",
                    animation: `sf-motion-slide 2s infinite alternate`,
                    animationTimingFunction:
                      i === 0
                        ? "ease"
                        : i === 1
                        ? "ease-in"
                        : i === 2
                        ? "ease-out"
                        : i === 3
                        ? "cubic-bezier(0.68, -0.55, 0.27, 1.55)"
                        : "steps(8)",
                  }}
                />
              </div>
              <div
                style={{
                  padding: "0 16px",
                  fontSize: "10px",
                  color: "#888",
                  textAlign: "right",
                }}
              >
                {m.css}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />

      {/* ═══ KEYFRAME ANIMATIONS ═══ */}
      <style jsx global>{`
        @keyframes sf-marquee-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @keyframes sf-motion-slide {
          from {
            left: 0;
          }
          to {
            left: calc(100% - 28px);
          }
        }
      `}</style>
    </>
  );
}
