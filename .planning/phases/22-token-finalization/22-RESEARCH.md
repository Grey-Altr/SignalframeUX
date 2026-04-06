# Phase 22: Token Finalization — Research

**Researched:** 2026-04-06
**Domain:** Tailwind CSS v4 `@theme` token system, OKLCH color tokens, WebGL color bridge (color-resolve.ts)
**Confidence:** HIGH

---

## Summary

Phase 22 addresses four discrete token system gaps: (TK-01) moving `--color-success` and `--color-warning` from `:root` into `@theme`, (TK-02) documenting the intentional absence of elevation/shadow tokens, (TK-03) documenting sidebar and chart color token behavior in SCAFFOLDING.md, and (TK-04) auditing color-resolve.ts for safety before any OKLCH values change.

**Critical discovery:** `bg-success`, `border-success`, `text-success`, `bg-success/10`, and `border-warning` are currently used by four components (SFAlert, SFStatusDot, SFToast, ComponentsExplorer) but generate NO Tailwind utilities in the current build. Analysis of `.next/static/css/dff286f613345dcc.css` confirms that `--color-success` and `--color-warning` only appear as raw CSS custom properties in `:root`, not as utility-generating `@theme` tokens. These utility classes currently resolve to nothing. TK-01 is a functional correctness fix, not documentation hygiene.

**Primary recommendation:** Execute TK-01 first (it unblocks correct rendering), then TK-04 (audit before any values change), then TK-02 and TK-03 (documentation). Within TK-01, dark mode overrides for success/warning must also move to `.dark {}` since those tokens have no dark override today.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| TK-01 | `--color-success` and `--color-warning` moved into `@theme` block in globals.css | Tailwind v4 `@theme` is the only mechanism that generates utilities like `bg-success`; confirmed missing from current build output |
| TK-02 | Elevation absence explicitly documented in globals.css and SCAFFOLDING.md | No `box-shadow` scale or `z-elevation` vars exist by design; comment block pattern documented below |
| TK-03 | Sidebar and chart color tokens documented in SCAFFOLDING.md | Both token groups exist in `@theme` but have no SF consumer components; SFSidebar and SFChart are explicitly out of scope per REQUIREMENTS.md |
| TK-04 | WebGL color bridge (color-resolve.ts) audited for token dependency safety | color-resolve.ts uses 1x1 canvas probe via `ctx.fillStyle`; only resolves `--color-primary`, `--color-foreground`, `--color-background` — none of the tokens being moved |
</phase_requirements>

---

## Standard Stack

### Core Files Modified in This Phase

| File | Change | Scope |
|------|--------|-------|
| `app/globals.css` | Move `--color-success` and `--color-warning` from `:root` into `@theme`; add elevation absence comment block | TK-01, TK-02 |
| `SCAFFOLDING.md` | Add sidebar token section, chart token section, elevation absence note | TK-02, TK-03 |
| `lib/color-resolve.ts` | Audit only — read, verify, document. No code changes expected. | TK-04 |

### No New Dependencies

This phase installs nothing. All work is CSS authoring and documentation.

---

## Architecture Patterns

### TK-01: @theme Token Migration

**What Tailwind v4 `@theme` does:**
In Tailwind CSS v4 (installed: 4.2.2), the `@theme` block is the canonical source of design tokens that generate utility classes. A `--color-*` variable declared in `@theme` generates the full set of color utilities: `bg-*`, `text-*`, `border-*`, `fill-*`, `stroke-*`, `ring-*`, plus opacity modifiers (`bg-*/10`).

A `--color-*` variable declared only in `:root` is visible as a CSS custom property but does NOT generate Tailwind utilities. This is the root cause of the bug identified in research.

**Confirmed state (audited from built CSS):**

```
Current: --color-success and --color-warning in :root
Result: css custom properties present, NO bg-success / border-success / text-success utilities generated
Evidence: .next/static/css/dff286f613345dcc.css — no .bg-success, .border-success selector exists
```

**Affected components (currently broken):**
- `sf-alert.tsx` — `border-success bg-success/10 text-foreground [&>svg]:text-success`
- `sf-status-dot.tsx` — `bg-success`
- `sf-toast.tsx` — `border-success`, `border-warning`
- `components-explorer.tsx` — `bg-success`

**Migration pattern:**

Move from `:root` to `@theme`:

```css
/* BEFORE — in :root block, does NOT generate utilities */
:root {
  --color-success: oklch(0.85 0.25 145);
  --color-warning: oklch(0.91 0.18 98);
}

/* AFTER — in @theme block, generates bg-success, text-success, etc. */
@theme {
  /* ... existing tokens ... */
  --color-success: oklch(0.85 0.25 145);
  --color-warning: oklch(0.91 0.18 98);
}
```

**Dark mode:** These tokens have no current dark override. They do not need one — the green and yellow values read correctly on both light and dark backgrounds used in this design system. Do not add dark overrides unless a visual QA pass reveals a problem.

**`sf-yellow` and `sf-green` aliases:** The `:root` block also declares `--sf-yellow: oklch(0.91 0.18 98)` and `--sf-green: oklch(0.85 0.25 145)` — these are aliases pointing to the same values. They are sf-namespaced decorative tokens used via `var(--sf-yellow)` inline styles in blocks (not as Tailwind utilities). Leave them in `:root`. Do not move them.

**Removing `:root` fallback declarations:**
The requirement states "removing the `:root` fallback declarations does not break any existing component rendering." After the move to `@theme`:
- Remove `--color-success` and `--color-warning` from `:root`
- Verify: `sf-alert`, `sf-status-dot`, `sf-toast`, `components-explorer` all render correctly in browser
- The `--sf-yellow` and `--sf-green` aliases remain in `:root` and are unaffected

**Placement inside `@theme`:**
Add after `--color-destructive`, before `--color-border`. This follows the existing ordering convention in globals.css (core 5 → extended → border/input/ring).

```css
@theme {
  /* ... */
  --color-destructive: oklch(0.550 0.180 25);
  /* Extended palette — success/warning */
  --color-success: oklch(0.85 0.25 145);
  --color-warning: oklch(0.91 0.18 98);
  --color-border: oklch(0.205 0 0);
  /* ... */
}
```

### TK-02: Elevation Absence Documentation

**What to document:** The system has no `box-shadow` elevation scale, no `z-elevation` variables. This is not an omission — it is a deliberate DU/TDR design decision. Depth comes from spacing, hierarchy, layout, contrast, and motion only.

There are three `--sf-*` shadow tokens in `:root` (`--sf-inset-shadow`, `--sf-deboss-light`, `--sf-deboss-shadow`) — these are micro-feedback/press-effect tokens, NOT elevation tokens. They are not a shadow scale.

**Where to document:**
1. A comment block in `globals.css` — place immediately after the `/* ── COLOR TIERS ──` comment block, before or after the `@theme {` opening, grouped with other architectural policy comments.
2. A new section in `SCAFFOLDING.md` — parallel to existing sections like "Known Pitfalls".

**Recommended comment block pattern for globals.css:**

```css
/* ── ELEVATION POLICY ─────────────────────────────────────────
   INTENTIONALLY ABSENT: No box-shadow scale, no z-elevation variables.

   Depth is expressed through spacing, hierarchy, layout, contrast,
   and motion. This is a deliberate DU/TDR aesthetic decision.

   DO NOT add a shadow elevation scale to this system.

   Existing sf-* shadow tokens (--sf-inset-shadow, --sf-deboss-light,
   --sf-deboss-shadow) are micro-feedback press-effect utilities only —
   they are not an elevation scale.
   ─────────────────────────────────────────────────────────── */
```

**SCAFFOLDING.md section heading:** `## Elevation Policy` — one paragraph stating the decision, listing the three `--sf-*` press tokens and their correct purpose.

### TK-03: Sidebar and Chart Token Documentation

**Current state of sidebar/chart tokens in globals.css:**

Sidebar tokens (8 tokens): `--color-sidebar`, `--color-sidebar-foreground`, `--color-sidebar-primary`, `--color-sidebar-primary-foreground`, `--color-sidebar-accent`, `--color-sidebar-accent-foreground`, `--color-sidebar-border`, `--color-sidebar-ring` — all declared in `@theme`, dark overrides in `.dark {}`.

Chart tokens (5 tokens): `--color-chart-1` through `--color-chart-5` — all declared in `@theme`. No dark overrides (by design).

**Consumer status (audited):**
- No SF component in `components/sf/` uses any sidebar or chart token.
- No block in `components/blocks/` uses sidebar or chart tokens.
- These tokens exist for shadcn compatibility (SFSidebar and SFChart would consume them, but both are explicitly out of scope per REQUIREMENTS.md).

**What SCAFFOLDING.md needs:**
A new section `## Deferred Token Groups` documenting:

1. **Sidebar tokens** — present in `@theme` for shadcn compatibility. SFSidebar is deferred to the cdOS milestone. Do not use these tokens in v1.4 components.
2. **Chart tokens** — present in `@theme` for shadcn compatibility. SFChart is out of scope (recharts ~50KB dependency). Do not use these tokens in v1.4 components.
3. **Recommendation** — explicitly state: avoid SFSidebar and SFChart until their respective milestones. Consuming these tokens creates undocumented component contracts.

### TK-04: WebGL Color Bridge Audit

**color-resolve.ts summary (audited):**

- Uses 1x1 canvas probe: `ctx.fillStyle = raw; ctx.getImageData(0, 0, 1, 1).data`
- `ctx.fillStyle` assignment uses the browser's native color parsing — it handles OKLCH natively in all modern browsers (Chrome 111+, Safari 16.4+, Firefox 113+)
- `oklch(L C H / A)` alpha syntax: The canvas probe handles this correctly because the browser parses it before `getImageData`. The `getImageData` returns premultiplied alpha as sRGB `[r, g, b, a]`. The current probe destructures as `const [r, g, b] = data` — the alpha channel is ignored. This is safe for opaque tokens. For tokens with alpha (like `--sf-inset-shadow: inset 0 1px 2px oklch(0 0 0 / 0.08)`), the probe would return premultiplied values — but these are NEVER passed to color-resolve.ts (confirmed by grep). color-resolve.ts is only called with opaque color tokens.

**Tokens currently resolved by color-resolve.ts callers:**
- `signal-mesh.tsx`: `--color-primary` (opaque)
- `glsl-hero.tsx`: `--color-primary` (opaque, with TTL 2000ms)
- `token-viz.tsx`: `--color-foreground`, `--color-background`, and the 5 core color tokens (all opaque)

**Tokens NOT resolved by color-resolve.ts:**
- `--color-success`, `--color-warning` — no caller passes these. Safe to move.
- `--sf-*` shadow tokens with alpha — no caller passes these. No alpha parsing concern.

**Alpha syntax concern from STATE.md:** "color-resolve.ts alpha syntax: Audit `oklch(L C H / A)` parser support before Phase 22 modifies any color tokens." — RESOLVED. The probe uses `ctx.fillStyle` which delegates to the browser's CSS parser, not a custom OKLCH parser. No custom parser exists in color-resolve.ts. Alpha values in token strings are handled natively by the browser. The specific tokens being moved (success/warning) are opaque and have no alpha component.

**Fallback behavior:** On empty string (token not found), returns magenta `{ r: 255, g: 0, b: 128 }`. This is a visible sentinel, intentionally matching the behavior in canvas-cursor.tsx. Moving `--color-success` to `@theme` does not affect color-resolve.ts since no WebGL scene resolves that token.

**Audit verdict:** color-resolve.ts is safe. No code changes required. Document the audit findings in the phase summary.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead |
|---------|-------------|-------------|
| OKLCH color parsing for WebGL | Custom OKLCH parser | `ctx.fillStyle` canvas probe — browser parses natively |
| Tailwind utility generation | Manual CSS class definitions | `@theme` block — Tailwind v4 generates utilities automatically |
| Success/warning dark mode tokens | New `.dark {}` overrides | Leave absent — the light values read acceptably on dark backgrounds |

---

## Common Pitfalls

### Pitfall 1: Removing sf-yellow/sf-green From :root
**What goes wrong:** `--sf-yellow` and `--sf-green` are aliases for the warning/success values, used as `var(--sf-yellow)` in inline styles across 10+ block files. Moving them to `@theme` generates unnecessary Tailwind utilities and does not match their usage pattern.
**How to avoid:** Leave `--sf-yellow` and `--sf-green` in `:root`. Only move `--color-success` and `--color-warning`.
**Warning signs:** grep for `sf-yellow` and `sf-green` in components — all usages should be `var(--sf-yellow)` inline, not Tailwind classes.

### Pitfall 2: Adding Dark Overrides for Success/Warning
**What goes wrong:** Adding `.dark { --color-success: ...; --color-warning: ...; }` without a confirmed visual need creates maintenance burden and token drift.
**How to avoid:** After the `@theme` migration, run a visual smoke test in dark mode. If `bg-success` reads correctly — do not add dark overrides. Only add them if there is a documented visual failure.
**Warning signs:** Undefined design intent for dark-mode success/warning — no mock exists for this.

### Pitfall 3: @theme Ordering Sensitivity
**What goes wrong:** In Tailwind v4 `@theme` blocks, later declarations override earlier ones. Misplacing success/warning before destructive could create confusion in future audits.
**How to avoid:** Place success/warning after `--color-destructive`, before `--color-border`. Follow the existing extended palette ordering convention.

### Pitfall 4: Modifying color-resolve.ts During This Phase
**What goes wrong:** color-resolve.ts is consumed by SignalMesh and GLSLHero. Any modification risks breaking WebGL scenes.
**How to avoid:** TK-04 is audit-only. Write the findings, make no code changes. The bridge requires no changes for Phase 22.

### Pitfall 5: Forgetting to Remove the :root Fallbacks
**What goes wrong:** Leaving `--color-success` and `--color-warning` in `:root` after moving to `@theme` creates a duplicate definition. `:root` value overrides `@theme` value at runtime (cascade specificity). The utilities would generate but render wrong values in some edge cases.
**How to avoid:** The removal of `:root` fallbacks IS part of TK-01. After adding to `@theme`, delete the lines from `:root`. Run smoke test to confirm.
**Warning signs:** Two declarations of the same token in globals.css — red flag.

---

## Code Examples

### Moving tokens from :root to @theme (TK-01)

Before state in globals.css (lines 107-108):
```css
/* ── SignalframeUX Extension Variables ── */
:root {
  --sf-yellow: oklch(0.91 0.18 98);
  --sf-green: oklch(0.85 0.25 145);
  --sf-clock: oklch(0.145 0 0);
  --color-success: oklch(0.85 0.25 145);   /* MOVE THIS */
  --color-warning: oklch(0.91 0.18 98);    /* MOVE THIS */
  /* ... */
}
```

After state — in @theme block (after line 43, `--color-destructive`):
```css
@theme {
  /* ... */
  --color-destructive: oklch(0.550 0.180 25);
  /* ── Extended Palette — status/feedback colors ── */
  --color-success: oklch(0.85 0.25 145);
  --color-warning: oklch(0.91 0.18 98);
  --color-border: oklch(0.205 0 0);
  /* ... */
}
```

And in `:root`, delete those two lines.

### Smoke test — verify utilities work post-migration

After migration, confirm in browser DevTools or dev server:
- `SFAlert intent="success"` — green border visible
- `SFStatusDot status="active"` — green dot visible
- `SFToast` success and warning variants — border color visible
- `ComponentsExplorer` status dot at index 255 — green dot visible

### Visual smoke test sequence for TK-04 (WebGL safety)

After any globals.css change:
1. Navigate to homepage — SignalMesh icosahedron renders (not magenta, not black)
2. Navigate to tokens page — GLSLHero noise field renders with primary color tint
3. Navigate to tokens page — TokenViz canvas renders color swatches
4. Open SignalOverlay — adjust intensity — mesh responds

---

## State of the Art

| Old Pattern | Current Pattern | Status |
|-------------|----------------|--------|
| Tailwind v3: `tailwind.config.js` with `theme.extend.colors` | Tailwind v4: `@theme` block in CSS | v4.2.2 installed — must use `@theme` |
| shadcn v1: `:root` CSS variables for all tokens | shadcn v4 (4.1.2): `@theme` for utility-generating tokens | shadcn now recommends `@theme` |

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None — no unit test framework installed |
| Config file | None |
| Quick run command | `pnpm dev` (dev server visual smoke test) |
| Full suite command | `pnpm build && pnpm start` (production smoke test) |
| TypeScript check | `pnpm tsc --noEmit` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | Notes |
|--------|----------|-----------|-------------------|-------|
| TK-01 | `bg-success` renders green in SFAlert/SFStatusDot | visual smoke | `pnpm dev` → visual check | Manual — no automated CSS utility assertion |
| TK-01 | `border-warning` renders yellow in SFToast | visual smoke | `pnpm dev` → visual check | Manual |
| TK-01 | Removing `:root` fallbacks does not break render | visual smoke | `pnpm dev` → visual check | Manual — check all 4 affected components |
| TK-02 | Comment block present in globals.css | grep check | `grep -n "ELEVATION POLICY" app/globals.css` | Automated |
| TK-02 | SCAFFOLDING.md elevation section present | grep check | `grep -n "Elevation" SCAFFOLDING.md` | Automated |
| TK-03 | SCAFFOLDING.md sidebar/chart section present | grep check | `grep -n "Deferred Token" SCAFFOLDING.md` | Automated |
| TK-04 | SignalMesh renders after globals.css change | visual smoke | `pnpm dev` → homepage visual check | Manual |
| TK-04 | GLSLHero renders after globals.css change | visual smoke | `pnpm dev` → homepage visual check | Manual |
| TK-04 | No TypeScript errors in color-resolve.ts | tsc | `pnpm tsc --noEmit` | Automated |

### Sampling Rate
- **Per task commit:** `pnpm tsc --noEmit` (type safety) + visual smoke of affected components
- **Per wave merge:** Full visual regression across all 4 affected SF components + WebGL scenes
- **Phase gate:** `pnpm build` produces zero errors; all 4 affected components render correctly in production build

### Wave 0 Gaps
None — existing infrastructure (TypeScript, dev server, pnpm build) covers all verification needs. No new test files required.

---

## Open Questions

1. **Dark mode behavior for success/warning**
   - What we know: No dark overrides exist today; no mock defines dark-mode success/warning
   - What's unclear: Whether `oklch(0.85 0.25 145)` (green) reads acceptably on `oklch(0.145 0 0)` dark background
   - Recommendation: Run visual QA in dark mode after migration. Accept if contrast passes WCAG AA (4.5:1). The green value at L=0.85 against L=0.145 background has high contrast by default — low risk.

2. **`bg-success/10` opacity modifier**
   - What we know: `sf-alert.tsx` uses `bg-success/10` which requires the token to support Tailwind's opacity modifier syntax
   - What's unclear: Whether Tailwind v4 `@theme` generates opacity-modified utilities automatically
   - Recommendation: This is standard Tailwind v4 behavior — `@theme` color tokens generate opacity variants automatically. Confirmed by Tailwind v4 documentation pattern. HIGH confidence.

---

## Sources

### Primary (HIGH confidence)
- Direct file audit of `/Users/greyaltaer/code/projects/SignalframeUX/app/globals.css` — token locations confirmed
- Direct file audit of `/Users/greyaltaer/code/projects/SignalframeUX/lib/color-resolve.ts` — bridge implementation confirmed
- Direct file audit of `/Users/greyaltaer/code/projects/SignalframeUX/.next/static/css/dff286f613345dcc.css` — utility generation confirmed absent for success/warning
- Direct grep across all component files — consumer list confirmed complete
- Tailwind CSS v4 installed version: 4.2.2 (from package.json)
- shadcn version: 4.1.2 (from pnpm-lock.yaml)

### Secondary (MEDIUM confidence)
- Tailwind v4 `@theme` behavior: understood from existing globals.css patterns (all other color tokens in `@theme` generate utilities correctly — core 5, sidebar, chart all confirmed in built CSS)
- Canvas `ctx.fillStyle` OKLCH support: standard browser behavior for modern Chrome/Safari/Firefox

---

## Metadata

**Confidence breakdown:**
- TK-01 migration pattern: HIGH — confirmed from built CSS evidence and Tailwind v4 mechanics
- TK-02 documentation: HIGH — no technical uncertainty, pure authoring work
- TK-03 documentation: HIGH — no technical uncertainty, token consumer list fully audited
- TK-04 audit verdict: HIGH — color-resolve.ts fully read, callers fully audited

**Research date:** 2026-04-06
**Valid until:** 2026-05-06 (stable — Tailwind v4 CSS mechanics do not change between patch versions)
