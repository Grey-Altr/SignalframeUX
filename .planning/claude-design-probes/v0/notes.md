# Claude Design v0 Probe — Notes

**Date:** 2026-04-18
**Target:** `design.md` v0.1.0 → Claude Design → drift audit
**Claude Design doc ID:** `88479770-7445-40c0-9ca4-95d6cc39a787` (per screenshot URL)
**Artifacts:** 5 zips + 1 CSS file, extracted into this directory as:
- `assets-base/` — 4 SVG assets (cd-symbol, grain, logo-mark, logo-wordmark)
- `foundations/` — 8 foundation reference pages (HTML)
- `previews/` — 23 component/token preview fragments (HTML)
- `ui-kits/` — 3 UI kit examples (cdOS, onboard, portfolio) as JSX + HTML + README
- `uploads/` — user's input screenshots preserved in Claude Design export
- `colors_and_type.css` — distilled token stylesheet (13KB, 342 lines)

---

## Prompt shape (reconstructed)

User uploaded SignalframeUX screenshots + `design.md` manifest as grounding. Asked Claude Design to produce a full design system documentation package. Claude Design delivered foundation pages, component previews, UI kit examples, and a distilled token stylesheet. Workflow spanned 2026-04-17 to 2026-04-18.

---

## Drift audit

| Axis | Finding | Grade |
|---|---|---|
| **Border-radius** | Zero non-zero values across 36 generated files | A+ |
| **Component naming** | 34 `SF*` references across 6 JSX/HTML files | A |
| **Hex colors** | 2 occurrences (`foundations/data-viz.html`, `foundations/type-specimens.html`) | A |
| **Easings** | Spring curve introduced in `--ease-hover`; 3 different ease-out curves across output | B (drift) |
| **Gradients** | 14 occurrences across 10 files; context not fully audited (likely legitimate in signal-layer/halftone demos) | flagged for review |
| **Aesthetic register** | DU/TDR faithful — coded naming (`SF·BATCH·047`), magenta-on-black, Anton display, tri-column tension, "IF IT ISN'T HERE, IT'S WRONG" voice | A+ |
| **Generic dark-mode** | Absent. DU-inflected throughout | A+ |
| **OKLCH discipline** | Strong — colors_and_type.css is 100% OKLCH | A+ |

---

## Confirmed drift → fed into manifest v0.1.1

1. **Spring easing leaked.** `--ease-hover: cubic-bezier(0.34, 1.56, 0.64, 1)` appears in `colors_and_type.css:161`. Direct violation of "no spring, no bounce, no anticipation."
2. **Multiple ease-out curves.** Three variants across output: `0.2,0,0,1` (Claude's primary), `0.2,0.8,0.4,1` (motion-states, spacing-rhythm), `0,0,0.2,1` (the canonical value in `app/globals.css`). Manifest must lock ONE.
3. **Hex in output.** 2 slippages despite OKLCH-only rule. Need to reinforce.

---

## Inventions (flagged as v0.2+ proposals — NOT merged into SF)

Claude Design generated two coherent subsystems that don't exist in v0.1:

1. **Elevation ladder** — `--surface-sink / -base / -raise / -lift / -peak` (5-step L-only surface differentiation, zero shadow/radius). Captured at `.planning/proposals/elevation-ladder.md`.
2. **Posture system** — parametric axes (`--posture-intensity / -speed / -tracking / -density / -reach`) with 3 presets (`.posture-quiet / .posture-live / .posture-charged`). Captured at `.planning/proposals/posture-system.md`.

Both are coherent with SF's aesthetic and respect hard constraints (zero radius, no shadow, OKLCH). Both are v0.2+ scope — **do not merge into v0.1 stabilization.** Manifest v0.1.1 adds an explicit "no subsystem invention" rule to prevent this from becoming a pattern.

---

## Visual evidence

`uploads/uploads/Screenshot 2026-04-18 at 11.09.51 AM.png` — `foundations/spacing-rhythm.html` rendered in Claude Design preview.

Visible elements validate register translation:
- "DATA. / UI. / SIGNAL." — Anton display, `text-heading-1`, uppercase ✓
- `RHYTHM · THREE POSTURES` — mono caps label, `0.15em` tracking ✓
- `SF·BATCH·047` catalog IDs — mono, coded nomenclature ✓
- `live / queued / drift` — status semantic tokens ✓
- Tri-column grid, hairline dividers, zero ornament ✓
- Magenta accents on near-black — DU palette ✓
- Voice: `IF IT ISN'T HERE, IT'S WRONG` — register-appropriate edge ✓

---

## What translated well

- DU/TDR aesthetic lineage (hardest to capture — landed cleanly)
- Coded-naming-as-type (catalog IDs, revision hashes as first-class content)
- Dark register (non-generic, DU-inflected)
- Zero-radius discipline (not a single slip)
- SF component naming discipline (34/34 correct where attempted)
- Semantic type aliases (heading-1/-2/-3/body/small all correct)
- Tracking/leading values preserved

## What to strengthen in manifest v0.1.1

- Canonical easing curve — lock ONE value (not "all easings resolve to X")
- Rejected easing curves named explicitly (`cubic-bezier(0.34, 1.56, 0.64, 1)` etc.)
- Hex ban reinforced — including comments, docs, attributes
- Explicit rule: no subsystem invention; propose additions separately

---

## Inventions assessment

The two inventions (Elevation, Posture) are **better than a naive AI would produce.** Both respect SF's hard constraints, both extend FRAME/SIGNAL coherently, both come with clean implementation. If v0.1 weren't a stabilization milestone, they'd be serious candidates for inclusion.

Interpretation: the manifest gave Claude Design enough context that its inventions *stay in register*. That's a strong signal about the manifest's quality. The remaining problem isn't taste, it's scope discipline.

---

## Next

1. Manifest v0.1.1 applied (see `design.md` changelog).
2. Proposals stubbed at `.planning/proposals/elevation-ladder.md` and `.planning/proposals/posture-system.md`.
3. Re-probe pending — rerun catalog prompt against v0.1.1, verify spring easing + hex slippages are eliminated.
