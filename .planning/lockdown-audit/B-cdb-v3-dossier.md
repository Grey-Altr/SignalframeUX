# Branch B — cdb-v3-dossier — DEFERRED candidates

**Audited:** 2026-04-21 (code-only, chrome-devtools disconnected)
**Tip:** `5dc0ecc` — "Feat: KLOROFORM plate homepage — yellow plate tiles + mono wordmark"
**Status:** User deferred DECIDE items; defaults applied.

## Applied defaults (HOLD — do not pull)

These diverge from locked SignalframeUX trademarks (T1 pixel-sort, T2 rect-only glyph, T3 cube-tile) or represent Culture Division parent-brand content.

- `components/cdb/*` — cdB parent-brand primitives (banner, corner-chrome, field, mark, pointcloud, stamp)
- `components/vault/*` — unidentified "vault" product family (biocircuit shader, chrome, flag, helghanese, pointcloud, schematic, stamp, trademark, data-field, field)
- `components/dossier/blackflag-catalog*` — cdB-specific plate catalog
- 6-plate routing aesthetic (kloroform · cyber2k · brando · blackflag · diagrams2 · helghanese) — cdB dossier, not SF

## Deferred DECIDE items (revisit after pass D distillation)

| ID | Primitive | Source file(s) | Divergence from locked trademark | Options |
|---|---|---|---|---|
| **D-01** | `HalftoneCorrugated` | `components/dossier/halftone-corrugated.tsx` | Canvas halftone texture w/ pre-bucketed 32-step OKLCH gray ramp. NOT pixel-sort. | PULL as 2nd signal primitive / HOLD to keep pixel-sort exclusive |
| **D-02** | `HudOctagonFrame` | `components/dossier/hud-octagon-frame.tsx` | 8-sided chamfered clip-path container w/ corner-tick glyphs. Violates T3-d (square) | PULL as 2nd container for diagnostic/alert zones / HOLD |
| **D-03** | `BuildSchematic` nodes | `components/dossier/build-schematic.tsx` | Stroke-based SVG glyphs (transformer/relay/cathode/plate). Violates T2-b (rect-only) | PULL as 2nd glyph class for /builds or /system / HOLD |
| **D-04** | Geolocation readout | `components/dossier/dossier-chrome.tsx` | SSR-resolved Vercel geo headers → `LAX 34°03'N 118°15'W`. Natural chrome extension | PULL into SF telemetry readout / HOLD |
| **D-05** | Paper substrates | `components/dossier/dossier-chrome.tsx` | `paper-cream`, `paper-warm` OKLCH backgrounds alongside `black` | PULL as 3rd+ bgShift variant / HOLD binary |
| **D-06** | `TerminalSession` | `components/dossier/terminal-session.tsx` | Pre-formatted terminal component w/ intent coloring + blinking cursor. Uses share-tech-mono (not JetBrains) | PULL into /init install step (swap font) / HOLD current |
| **D-07** | `Y2KMarkGrid` | `components/dossier/y2k-mark-grid.tsx` | Stroke-based geometric marks (Hexagon, Recycle, Asterisk, NestedCubes). Same T2 divergence as D-03 | PULL as expanded glyph library / HOLD T2 strict |

## When to revisit

After Pass D (`LOCKDOWN.md` distilled from main). At that point, each DECIDE can be evaluated against the locked rule set — is the divergence worth a trademark extension, or does the rule stay strict?
