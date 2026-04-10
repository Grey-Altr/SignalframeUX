import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const alt = "SignalframeUX — Deterministic Interface. Generative Expression.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// NOTE: do NOT export `runtime = 'edge'`. Node.js default runtime is required
// for fs.readFile font loading and to avoid Fluid Compute cold-start overhead.
// Brief §LR-02 "Critical runtime lock".
//
// Mono font: GeistMono (Vercel OFL — from geist@1.7.0 npm package).
// The live site uses JetBrains Mono via next/font/google; the OG image's mono
// register intentionally diverges to honor the brief §LR-02 literal "GeistMono"
// reference per Grey's 2026-04-09 ~20:40 PDT Option A decision.
// See wiki/analyses/v1.5-lr02-font-strategy.md (commit 96a52f2) for the 4-option
// analysis; Option B (JetBrains Mono) was recommended but Option A was chosen.

export default async function OpengraphImage() {
  const antonPath = join(process.cwd(), "public/fonts/Anton-Regular.ttf");
  const monoPath = join(process.cwd(), "public/fonts/GeistMono-Regular.ttf");
  const [anton, mono] = await Promise.all([
    readFile(antonPath),
    readFile(monoPath),
  ]);
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#000000",
          color: "#e8e8e8",
          fontFamily: "GeistMono",
          fontSize: 24,
          padding: 80,
          justifyContent: "space-between",
        }}
      >
        {/* Header block — [SF//UX] in Anton, v1.5 REDESIGN below */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Anton",
              fontSize: 96,
              letterSpacing: "0.02em",
              color: "#fafafa",
            }}
          >
            [SF//UX]
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 16,
              fontSize: 28,
              color: "#888888",
              letterSpacing: "0.08em",
            }}
          >
            v1.5 — REDESIGN
          </div>
        </div>

        {/* Readout block — monospace stack, SIG line uses magenta accent */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex" }}>COMPONENTS:54</div>
          <div style={{ display: "flex", color: "#e91e90" }}>SIG:0.7</div>
          <div style={{ display: "flex" }}>CLS:0</div>
          <div style={{ display: "flex" }}>LCP:&lt;1.0S</div>
          <div style={{ display: "flex" }}>77/77 ✓</div>
        </div>

        {/* Footer — BOOT OK */}
        <div
          style={{
            display: "flex",
            fontSize: 20,
            color: "#555555",
            letterSpacing: "0.1em",
          }}
        >
          BOOT OK
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Anton", data: anton, style: "normal" },
        { name: "GeistMono", data: mono, style: "normal" },
      ],
    }
  );
}
