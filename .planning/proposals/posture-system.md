# Proposal: Posture System

**Status:** PROPOSED · v0.2+ scope (NOT v0.1 stabilization)
**Origin:** Claude Design v0 probe, 2026-04-18
**Source:** `.planning/claude-design-probes/v0/colors_and_type.css` lines 178-202

---

## Concept

Parametric axes that express how the system **behaves**, not how it **looks**. Applied via class on any subtree to set a parametric mood. Extends and generalizes the existing `--sfx-signal-intensity` single-dial control into a coordinated axis set with presets.

### Axes

| Token | Range | Purpose |
|---|---|---|
| `--posture-intensity` | 0–1 | Expressive level: overlay opacity, grain, scanline weight |
| `--posture-speed` | multiplier | Motion cadence: transition/animation duration divider |
| `--posture-tracking` | em | Label letter-spacing |
| `--posture-density` | multiplier | Control padding scaler (1 = normal, <1 tighter, >1 looser) |
| `--posture-reach` | px | Signal-layer motion travel distance |

### Presets

| Preset | Intensity | Speed | Tracking | Density | Reach | Usage |
|---|---|---|---|---|---|---|
| `.posture-quiet` | 0.15 | 0.8 | 0.12em | 1.0 | 12px | Archive views, long-form reading, dense data |
| `.posture-live` | 0.5 | 1.0 | 0.15em | 1.0 | 24px | Default working state |
| `.posture-charged` | 0.85 | 1.4 | 0.2em | 0.92 | 48px | Hero moments, launch pages, cinematic sequences |

### Derived tokens

Components read derived values, not raw axes:

- `--posture-motion-duration: calc(320ms / var(--posture-speed))`
- `--posture-motion-duration-sm: calc(160ms / var(--posture-speed))`
- `--posture-motion-duration-lg: calc(640ms / var(--posture-speed))`
- `--posture-label-tracking: var(--posture-tracking)`
- `--posture-control-py: calc(12px * var(--posture-density))`
- `--posture-control-px: calc(20px * var(--posture-density))`
- `--posture-row-height: calc(44px * var(--posture-density))`
- `--posture-overlay-opacity: var(--posture-intensity)`
- `--posture-grain-opacity: calc(var(--posture-intensity) * 0.4)`

---

## Why interesting

- **Genuinely extends SIGNAL layer conceptually.** Current `--sfx-signal-intensity` is a single dial; posture is a coordinated axis set with sensible presets. More controllable, more composable, more self-documenting.
- **Subtree-scoped.** Apply `.posture-quiet` to an inspector panel inside a `.posture-live` page — dense controls in a default environment, without rewriting component code.
- **Maps cleanly to Culture Division mood language.** "Quiet" (archive view, gallery), "live" (default working state, cdOS), "charged" (hero moments, launch pages, releases).
- **Reduces per-component decision fatigue.** Density, speed, tracking are currently decided ad-hoc per component. Posture makes them a system-level choice.
- **Composable with signal-intensity.** Posture could subsume `--sfx-signal-intensity` (intensity axis maps 1:1) OR run alongside it — either path works.

---

## Why deferred

- Outside v0.1 stabilization scope.
- Would subsume or coexist with `--sfx-signal-intensity` — migration and back-compat decisions needed.
- Risk: "parametric mood" is a trendy pattern; easy to over-engineer without concrete use cases.
- All existing components need to be audited: which ones should *read* posture-derived tokens? Blanket refactor is too much; selective opt-in needs a policy.

---

## If pursued in v0.2

### Pre-work
1. **Identify 3–5 concrete scenes** where posture switching materially improves the output:
   - Portfolio archive (`.posture-quiet`) vs. portfolio hero (`.posture-charged`)
   - cdOS working state (`.posture-live`) vs. cdOS launch overlay (`.posture-charged`)
   - Inspector panel density (`.posture-quiet`) inside default page
   - Docs reading mode (`.posture-quiet`) vs. marketing page (`.posture-live`)
2. **Validate the three presets against real content.** Tune intensity/speed/density values empirically.
3. **Decide signal-intensity overlap:** alias (`--sfx-signal-intensity` → `--posture-intensity`)? replace? coexist?

### Integration sequence
1. Add posture axes + presets + derived tokens to `app/globals.css`.
2. Add posture section to `design.md` §4.
3. Refactor components to consume derived tokens — start with 3 components where density matters most (`SFButton`, `SFTable`, `SFInput`).
4. Add posture explorer to `/tokens` page with live toggle between presets.
5. Document when to use which preset (against the 3–5 validated scenes).

### Risks
- **Over-abstraction.** Five axes is a lot. If only 2 (intensity, density) carry real weight, simplify.
- **Preset ossification.** If teams only ever use the 3 presets and never touch raw axes, the axis system is overhead. Validate raw-axis use cases before shipping.
- **Interaction with FRAME tokens.** Posture changes control padding; FRAME spacing tokens also govern padding. Policy needed: posture-aware components opt in via derived tokens; posture-unaware components stay on FRAME spacing.

---

## Reject criteria

- If `--sfx-signal-intensity` + per-component density classes prove sufficient in practice (e.g., `<SFTable variant="compact">`), reject as premature abstraction.
- If fewer than 3 concrete scenes emerge where posture switching is materially better than ad-hoc class overrides, reject.
- If posture presets are only ever used at whole-page level (never subtree-scoped), the parametric machinery is overhead — simplify to a single `data-posture="charged"` root attribute instead.

---

## Provenance

See `colors_and_type.css` lines 178-202 and `foundations/posture.html` in the v0 probe bundle for Claude Design's full rationale. Axis names, preset values, and derived-token formulas are preserved here verbatim for reference.
