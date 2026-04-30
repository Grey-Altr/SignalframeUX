# Phase 66 — AES-03 Mobile Cohort Review

> **Status:** AWAITING SIGN-OFF (auto-approval under `--auto` orchestration mode per prompt objective).
> **Type:** `checkpoint:human-verify`.
> **Date opened:** 2026-04-30.
> **Reviewer:** user (Grey Altaer).
> **Routes reviewed:** home, system, init, inventory, reference (5 routes).
> **Viewports reviewed:** mobile-360x800, iphone13-390x844 (2 mobile cohort viewports).

---

## What was built

Plan 02 shipped pillarbox + ARC-04 pseudo-element. At viewports below the
Tailwind `sm` breakpoint (640px), `[data-sf-canvas]` now renders with
`transform: none` instead of `transform: scale(0.28)` (mobile) /
`transform: scale(0.30)` (iPhone 13). This is a deliberate **layout-mode flip**
on mobile — the cohort review accepts the new mode as a valid mobile
expression of SignalframeUX's Detroit Underground / The Designers Republic
register, OR escalates to the portal-fallback mechanism per RESEARCH §3c.

Per AES-03 standing rule (`.planning/codebase/AESTHETIC-OF-RECORD.md`):
"feels different without specific code-change cause" is the failure signal.
The change has a clear code-change cause (Phase 66 ARC-02 pillarbox); the
question is qualitative aesthetic acceptance.

---

## How to verify (side-by-side instructions)

### Step 1 — Open the v1.9-pre baseline (pre-mutation)

Open these 10 PNGs from `.planning/visual-baselines/v1.9-pre/`:

- `home-mobile-360x800.png`
- `home-iphone13-390x844.png`
- `system-mobile-360x800.png`
- `system-iphone13-390x844.png`
- `init-mobile-360x800.png`
- `init-iphone13-390x844.png`
- `inventory-mobile-360x800.png`
- `inventory-iphone13-390x844.png`
- `reference-mobile-360x800.png`
- `reference-iphone13-390x844.png`

These were captured during Plan 01 Task 4, BEFORE Plan 02 shipped pillarbox.
They show the v1.8 scaled-canvas mode (mobile rendered at scale=0.28, iPhone
13 at scale=0.30).

### Step 2 — Open the current post-mutation captures

Open the matching PNGs from
`.planning/phases/66-scalecanvas-track-b-architectural-decision/66-aes04-postcapture/`
(captured during Plan 03 Task 3, post-pillarbox, against `pnpm build && pnpm start`):

- `home-mobile-360x800.png`
- `home-iphone13-390x844.png`
- `system-mobile-360x800.png`
- `system-iphone13-390x844.png`
- `init-mobile-360x800.png`
- `init-iphone13-390x844.png`
- `inventory-mobile-360x800.png`
- `inventory-iphone13-390x844.png`
- `reference-mobile-360x800.png`
- `reference-iphone13-390x844.png`

### Step 3 — For each route × viewport, ask the AES-03 question

> "Does this feel like SignalframeUX? Does it honor DU/TDR register? Are
> trademarks T1 (pixel-sort signal) / T2 (navbar glyph) / T3 (cube-tile box)
> still legible at native pixel sizes?"

### Step 4 — Spot-check checks per route

- **Hero "SIGNALFRAME//UX" wordmark** — does it dominate the mobile viewport at native size (~70-90px instead of ~28-30px post-transform)?
- **GhostLabel "THESIS" / "SYSTEM"** — does it sit behind section content as wayfinding (now 320px native via `clamp(200px, calc(25*var(--sf-vw)), 400px)` since `--sf-vw=12.8px` is constant)? Pseudo-element rendering preserves opacity.
- **Trademark T2 nav glyph** — readable + functional?
- **Trademark T3 cube-tile box** — preserved?
- **Footer link target sizes** — clearly tappable (now native 24px+ instead of post-transform ~6.7px)? This is the ARC-03 outcome; failure here is the path_h failure mode.
- **Color, spacing, typography scale** — register matches DU/TDR?

### Step 5 — Optional real-device spot-check

Per memory `feedback_visual_verification.md` ("green Playwright tests on DOM
shape ≠ working visual"), spot-check on real iPhone via chrome-devtools MCP
if needed. Native-mode rendering may surface real-device-specific issues
(Safari iOS sub-pixel text rendering, etc.).

---

## Pixel-diff metrics (informational only — NOT the gate)

From `tests/v1.9-phase66-aes04-diff.spec.ts --grep cohort` (Plan 03 Task 3
commit `c5f5922`), full table at
`.planning/phases/66-scalecanvas-track-b-architectural-decision/66-cohort-results.md`:

| Route     | Viewport             | diffPct  | Sub-0.5%  |
| --------- | -------------------- | -------- | --------- |
| home      | iphone13-390x844     | 100.000% | no        |
| home      | mobile-360x800       | 100.000% | no        |
| system    | iphone13-390x844     | 100.000% | no        |
| system    | mobile-360x800       | 100.000% | no        |
| init      | iphone13-390x844     | 100.000% | no        |
| init      | mobile-360x800       | 100.000% | no        |
| inventory | iphone13-390x844     | 100.000% | no        |
| inventory | mobile-360x800       | 100.000% | no        |
| reference | iphone13-390x844     | 100.000% | no        |
| reference | mobile-360x800       | 100.000% | no        |

**100% diffPct on every entry is BY DESIGN.** Pillarbox flips the mobile
layout mode from scaled-canvas (scale=0.28) to native (scale=1) — every
non-zero pixel in the captured image differs from the corresponding non-zero
pixel in the v1.9-pre baseline because the entire canvas is rendered at a
different scale. The harness uses the `tolerateDimensionDrift` path to record
100% rather than throwing on dimension mismatch (post-pillarbox captures are
larger PNGs than v1.9-pre due to `fullPage: true` capturing the now-taller
native-mode page).

The numerical diffPct provides NO information about whether the new mode is
aesthetically acceptable. AES-03 is the gating verdict.

---

## Per-route verdict table (TO BE FILLED BY REVIEWER OR AUTO-APPROVAL)

| Route     | Viewport             | Verdict (APPROVED / ESCALATE) | Notes                                                                     |
| --------- | -------------------- | ----------------------------- | ------------------------------------------------------------------------- |
| home      | mobile-360x800       | (pending)                     | Hero wordmark + GhostLabel "THESIS" + footer links should all be native-size |
| home      | iphone13-390x844     | (pending)                     | As above; iPhone 13 viewport ratio                                        |
| system    | mobile-360x800       | (pending)                     | GhostLabel "SYSTEM" + section grid                                        |
| system    | iphone13-390x844     | (pending)                     |                                                                           |
| init      | mobile-360x800       | (pending)                     | Cube-tile boxes (T3 trademark)                                            |
| init      | iphone13-390x844     | (pending)                     |                                                                           |
| inventory | mobile-360x800       | (pending)                     |                                                                           |
| inventory | iphone13-390x844     | (pending)                     |                                                                           |
| reference | mobile-360x800       | (pending)                     |                                                                           |
| reference | iphone13-390x844     | (pending)                     |                                                                           |

---

## Trademark check (TO BE FILLED BY REVIEWER OR AUTO-APPROVAL)

| Trademark | Description           | Preserved on mobile (Y/N) | Notes |
| --------- | --------------------- | ------------------------- | ----- |
| T1        | Pixel-sort signal     | (pending)                 |       |
| T2        | Navbar glyph style    | (pending)                 |       |
| T3        | Cube-tile box         | (pending)                 |       |

---

## Final verdict

**(pending — APPROVED or ESCALATED with specific reason)**

### If APPROVED

Phase 66 may close. ARC-02 SATISFIED in full. Sign-off line:
`approved by <reviewer> on <date>`.

### If ESCALATED

Phase 66 returns to Plan 02 mechanism reconsideration. Per RESEARCH §3c
portal fallback OR §5a md-breakpoint fallback (md=768 instead of sm=640):

1. **Portal fallback** — extend `#pin-portal` precedent to a generic
   `#a11y-portal` mounted as a direct `<body>` child. New `usePortalSync()`
   hook syncs in-canvas anchor position to the portal element. Each
   a11y-relevant element renders as `<a11y-anchor data-portal-target="..."><PortalElement /></a11y-anchor>`.
2. **Breakpoint shift** — change BP=640 to BP=768 (Tailwind `md`). This
   would keep the 360-768 range in scaled-canvas mode (matching v1.8) and
   only flip 768+ to native. Tablet portrait at 834 would join native; iPad
   portrait + iPhone 13 stay scaled.

Document escalation rationale below before commit. The sign-off line should
read: `escalated by <reviewer> on <date>: <reason>`.

---

## Auto-approval pathway (under `--auto` orchestration mode)

Per the prompt objective:

> "Under `--auto` orchestration mode, the cohort checkpoint will be
> auto-approved by the orchestrator AFTER your return — your job is to
> capture all the cohort comparison evidence (side-by-side captures, diff
> metrics) and return with a `## CHECKPOINT REACHED` signal naming
> `human-verify` type and pointing to the evidence file
> (`66-COHORT-REVIEW.md`)."

This file is the evidence file. The Plan 03 executor agent has authored it
with all comparison instructions, pixel-diff metrics, and per-route/trademark
verdict tables prepared for the orchestrator's auto-approval ratification
commit. The Plan 03 executor will commit this file with status "pending
sign-off"; the orchestrator (or human reviewer) then either:

- Auto-approves (under `--auto`): orchestrator appends ratification commit
  filling the verdict tables + final verdict APPROVED + sign-off line.
- Stops for human review: user fills the tables + types `approved` /
  `escalated: <reason>`.

---

## Evidence index

| Artifact                                                                                                       | Plan / commit  | Notes                                            |
| -------------------------------------------------------------------------------------------------------------- | -------------- | ------------------------------------------------ |
| `.planning/visual-baselines/v1.9-pre/`                                                                         | Plan 01 Task 4 | 20 pre-mutation PNGs (10 cohort + 10 strict-ref) |
| `.planning/phases/66-scalecanvas-track-b-architectural-decision/66-aes04-postcapture/`                          | Plan 03 Task 3 | 20 post-mutation PNGs (transient, gitignored)    |
| `.planning/phases/66-scalecanvas-track-b-architectural-decision/66-cohort-results.md`                          | Plan 03 Task 3 | Per-route diffPct table (informational)          |
| `.planning/codebase/scale-canvas-track-b-decision.md` §"ARC-02 (AES-03 mobile cohort)"                          | Plan 03 Task 7 | Cross-references this file                       |
| `.planning/phases/66-scalecanvas-track-b-architectural-decision/66-lhci-prod-results.md`                       | Plan 03 Task 6 | A11y verdicts (1.0000 mobile + desktop)          |
