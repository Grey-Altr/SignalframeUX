# Phase 44: Copy Audit Fixes - Research

**Researched:** 2026-04-11
**Domain:** Static copy accuracy — hardcoded strings in TSX components and metadata
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Component count source: non-lazy SF component files in `components/sf/` (currently 48, site claims 28)
- Hardcoded count — update manually when components change (matches current pattern across all locations)
- All locations must show the same number: stats-band, hero, OG image, init page, homepage meta description
- OG image version string: update from "v1.5 — REDESIGN" to "v1.7"
- Hero version string must match OG image
- `FRAMEWORK-AGNOSTIC` on /init → replace with "BUILT FOR REACT + NEXT.JS"
- `and growing` filler in hero + homepage meta → remove entirely, state count without filler
- `phase-35-metadata.spec.ts` assertions must validate exact copy strings (not patterns)

### Claude's Discretion
- `SHIP FASTER` in marquee-band → choose a specific, honest claim that fits the DU/TDR typographic voice

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| COP-01 | Component count reconciled to single accurate number across all pages (stats-band, hero, OG image, manifesto-band, init page) | Exact current count verified: 48 non-lazy, non-index files in `components/sf/`. Six specific locations identified with current stale values. |
| COP-02 | Version string consistent across hero and OG image — matches current release | Hero currently shows `SF//UX v2.0.0 · 2026`. OG image shows `v1.5 — REDESIGN`. Decision: update OG to `v1.7`. Hero version tag must be reconciled to same milestone label. |
| COP-03 | "FRAMEWORK-AGNOSTIC" replaced with accurate React/Next.js claim on /init | Located at `app/init/page.tsx` line 109, inside STEPS[4] description string. Replacement: "BUILT FOR REACT + NEXT.JS" |
| COP-04 | "SHIP FASTER" replaced with specific claim in marquee-band | Located at `components/blocks/marquee-band.tsx` line 2 in MARQUEE_TEXT constant. Claude's discretion for replacement copy. |
| COP-05 | "and growing" filler removed from hero and homepage meta | Hero: line 93 `28 SF COMPONENTS AND GROWING`. Meta description: `app/page.tsx` line 17 `28 SF components and growing`. Both need count updated to 48 and filler removed. |
| COP-06 | Playwright test assertions updated to match new copy strings (phase-35-metadata.spec.ts) | Currently asserts `v1.5`, `REDESIGN`, `COMPONENTS:54`, `77/77`. All four assertions will need updating to match new OG image values. |
</phase_requirements>

---

## Summary

Phase 44 is a pure accuracy pass — no new features, no architectural changes. Every piece of public-facing copy that makes a quantitative or qualitative claim must be corrected to match reality. The work is localized to six source files and one test file.

The component count discrepancy is the largest gap: the site claims 28 in three locations but the `components/sf/` directory contains 48 non-lazy, non-index `.tsx` files. The OG image has two stale values: the version tag `v1.5 — REDESIGN` and the readout line `COMPONENTS:54` (which is also wrong — 48 is correct). The `/init` step 05 description contains a false `FRAMEWORK-AGNOSTIC` claim. The hero and homepage meta description both carry `and growing` filler that should be dropped. The marquee contains a vague `SHIP FASTER` claim that needs to be replaced with something specific and honest.

The Playwright test file `phase-35-metadata.spec.ts` currently hard-asserts the stale OG values (`v1.5`, `REDESIGN`, `COMPONENTS:54`, `77/77`). These assertions will fail after the OG image is updated. The test file must be updated last, after all copy changes are confirmed, to assert the new correct strings.

**Primary recommendation:** Fix all six source files in dependency order (copy files first, test file last). Use 48 as the single canonical component count everywhere. Keep all copy in DU/TDR uppercase typographic voice.

---

## Standard Stack

No library changes. This phase touches only:

| File Type | Tool | Notes |
|-----------|------|-------|
| TSX JSX strings | Direct edit | No abstraction layer — all copy is hardcoded inline |
| Metadata objects | Direct edit | `export const metadata: Metadata` in Next.js App Router |
| `next/og` ImageResponse | Direct edit | OG image uses JSX-in-JS inline style — no className |
| Playwright spec | Direct edit | `readFileSync` source assertions + string matchers |

No new npm dependencies. No build tooling changes.

---

## Architecture Patterns

### Copy Is Fully Hardcoded — No Central Constants File

All copy lives inline in the component or page file. There is no shared `copy.ts` or `constants.ts` layer. This is the established pattern; the fix follows it — update each location directly.

### OG Image Is Source-Assertion Tested

`phase-35-metadata.spec.ts` test "LR-02: OG image contains all locked content fields" uses `readFileSync` to read `app/opengraph-image.tsx` as a string and calls `.toContain()` on literal substrings. This means:

- The test asserts against source code text, not rendered output.
- Changing the OG image source breaks this test until the spec is updated.
- The test must be updated to the new strings; it cannot be made "flexible" — the whole point is exact-string drift detection.

### Version Tag Inconsistency Already Exists

The hero component (`hero.tsx` line 121) currently shows `SF//UX v2.0.0 · 2026`. The OG image shows `v1.5 — REDESIGN`. These are different version strings for different contexts — the hero version tag appears to be a semantic version (`v2.0.0`), while the OG version is a milestone label (`v1.5 — REDESIGN`). The locked decision is to update the OG image to `v1.7`. The hero version tag (`v2.0.0`) is a separate semver that may reflect a different versioning track. The planner must decide whether to touch the hero version tag or only the OG milestone label. Given the requirement says "hero version string must match OG image," the hero tag likely needs to be updated to `v1.7` as well, or at minimum reconciled.

### Anti-Patterns to Avoid

- **Do not introduce a shared copy constants file.** The project pattern is inline. Introducing abstraction for a one-off accuracy fix adds complexity.
- **Do not update the test before the source.** The test file exists to catch drift — update it only after all copy changes are verified.
- **Do not change OG image layout or styles.** Only the text content strings change. The `display: "flex"` / inline-style-only constraint and the `fs/promises` font loading pattern must remain intact (the test asserts on these).

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead |
|---------|-------------|-------------|
| Keeping count in sync long-term | A script that counts files at build time | Manual update (current pattern; automation is out of scope) |
| Playwright copy drift detection | New test infra | Update existing `phase-35-metadata.spec.ts` assertions |

---

## Common Pitfalls

### Pitfall 1: Wrong Component Count

**What goes wrong:** Counting directory entries without excluding `index.ts` and the three `-lazy.tsx` files gives 52. Counting only `.tsx` files gives 51 (includes the 3 lazy variants). The correct count is 48: all `.tsx` files minus the 3 lazy variants (`sf-calendar-lazy.tsx`, `sf-drawer-lazy.tsx`, `sf-menubar-lazy.tsx`).

**Verified count:**
```
components/sf/ contains:
  - index.ts (1 — excluded)
  - *-lazy.tsx (3 — sf-calendar-lazy, sf-drawer-lazy, sf-menubar-lazy — excluded)
  - component .tsx files (48 — these are the canonical count)
Total directory entries: 52
Canonical component count: 48
```

**How to avoid:** Use the CONTEXT.md decision: "non-lazy SF component files" = `*.tsx` files that do not end in `-lazy.tsx`.

### Pitfall 2: OG Image Has Two Stale Values, Not One

**What goes wrong:** Only updating the version string (`v1.5 — REDESIGN` → `v1.7`) but missing the `COMPONENTS:54` readout line, which is also stale (should be `48`). Or vice versa.

**Current OG image stale values (both must change):**
- Line 64: `v1.5 — REDESIGN` → should reflect `v1.7`
- Line 70: `COMPONENTS:54` → should be `COMPONENTS:48`
- Line 76: `77/77 ✓` — this is a Lighthouse score readout; unclear if stale; verify against current production scores before changing (or leave if it's accurate)

**How to avoid:** Read `app/opengraph-image.tsx` fully before editing, update all stale fields in one pass.

### Pitfall 3: Test Assertions Assert Source Text, Not Runtime Output

**What goes wrong:** Assuming the Playwright test checks what users see in the browser. In fact, "LR-02: OG image contains all locked content fields" calls `readFileSync` on the `.tsx` source file and checks for literal substrings. The test will pass if the source contains the expected string, even if the rendered output differs.

**How to avoid:** Update the spec's `.toContain()` arguments to the new literal source strings after editing `opengraph-image.tsx`.

### Pitfall 4: The `/init` FRAMEWORK-AGNOSTIC String Is Embedded in a Data Array

**What goes wrong:** Searching for `FRAMEWORK-AGNOSTIC` as a JSX attribute or visible text label and not finding it in JSX markup, then concluding it doesn't exist or is rendered differently.

**Reality:** The string lives inside the `STEPS` constant array at index 4 (step "05 DEPLOY"), in the `description` field (line 109). It is a plain string inside a TypeScript object literal, not a JSX child. The fix is to edit that string value.

### Pitfall 5: Hero and Meta Description Both Need Count + Filler Removal

**What goes wrong:** Fixing only one of the two `and growing` locations.

**Both locations:**
1. `components/blocks/hero.tsx` line 93: `28 SF COMPONENTS AND GROWING` → `48 SF COMPONENTS`
2. `app/page.tsx` line 17 meta description: `"28 SF components and growing"` → update count to 48, remove filler

---

## Code Examples

### Current State of All Six Copy Locations

**`components/blocks/hero.tsx` line 93 (COP-01, COP-05):**
```tsx
// CURRENT — stale count, has filler
28 SF COMPONENTS AND GROWING

// AFTER
48 SF COMPONENTS
```

**`components/blocks/hero.tsx` line 121 (COP-02):**
```tsx
// CURRENT
SF//UX v2.0.0 · 2026

// AFTER — reconcile to v1.7 milestone label or keep as semver (planner decision)
SF//UX v1.7 · 2026
```

**`components/blocks/stats-band.tsx` line 2 (COP-01):**
```tsx
// CURRENT
{ value: "28", label: "SF COMPONENTS", accent: false },

// AFTER
{ value: "48", label: "SF COMPONENTS", accent: false },
```

**`components/blocks/marquee-band.tsx` line 2 (COP-04):**
```tsx
// CURRENT
"SIGNAL//FRAME™ // DESIGN SYSTEM // BUILT FOR ENGINEERS // SHIP FASTER // ACCEPT THE INTERFACE // "

// AFTER — "SHIP FASTER" replaced with specific, honest claim (Claude's discretion)
// Candidate: "ZERO COMPROMISE" / "COMPOSABLE BY DESIGN" / "SIGNAL-AWARE COMPONENTS"
// Must fit DU/TDR voice: uppercase, sharp, no filler, measurable or demonstrably true
```

**`app/page.tsx` line 17 (COP-01, COP-05):**
```tsx
// CURRENT
description: "A dual-layer design system with 28 SF components and growing. Signal layer for generative expression, Frame layer for deterministic structure.",

// AFTER
description: "A dual-layer design system with 48 SF components. Signal layer for generative expression, Frame layer for deterministic structure.",
```

**`app/init/page.tsx` line 109 (COP-03):**
```tsx
// CURRENT
"SIGNALFRAMEUX™ IS FRAMEWORK-AGNOSTIC BUT OPTIMIZED FOR NEXT.JS + VERCEL..."

// AFTER (locked decision)
"SIGNALFRAMEUX™ IS BUILT FOR REACT + NEXT.JS + VERCEL..."
// (preserve rest of string — tree-shaking and bundle notes remain accurate)
```

**`app/opengraph-image.tsx` lines 64, 70 (COP-01, COP-02):**
```tsx
// CURRENT line 64
v1.5 — REDESIGN
// AFTER
v1.7

// CURRENT line 70
<div style={{ display: "flex" }}>COMPONENTS:54</div>
// AFTER
<div style={{ display: "flex" }}>COMPONENTS:48</div>
```

### Playwright Test Updates (COP-06)

**`tests/phase-35-metadata.spec.ts` — "LR-02: OG image contains all locked content fields":**
```typescript
// CURRENT assertions to change:
expect(src).toContain("v1.5");       // → expect(src).toContain("v1.7");
expect(src).toContain("REDESIGN");   // → remove or update to new label
expect(src).toContain("COMPONENTS:54"); // → expect(src).toContain("COMPONENTS:48");
expect(src).toContain("77/77");      // → verify current Lighthouse score, update if stale

// Assertions to KEEP (structure/format guards — still valid):
expect(src).toContain("[SF//UX]");
expect(src).toContain("SIG:0.7");
expect(src).toContain("CLS:0");
expect(src).toContain("LCP:");
expect(src).toContain("BOOT OK");
```

---

## Marquee Copy Recommendation (Claude's Discretion — COP-04)

The current `SHIP FASTER` claim is vague and unverifiable. The DU/TDR voice demands specificity and control — claims that can be substantiated or that describe observable system properties.

**Recommended replacement:** `COMPOSABLE BY DESIGN`

Rationale: True (every SF component is independently composable via CVA intent variants), fits the uppercase typographic voice, is not marketing filler, and describes a real architectural property of the system. It also echoes the "deterministic structure" thesis without repeating it verbatim.

**Alternatives if the planner prefers a different register:**
- `48 COMPONENTS. ZERO COMPROMISE.` — leads with the now-accurate count, doubles as accuracy reinforcement
- `SIGNAL-AWARE. FRAME-STABLE.` — dual-layer thesis, measurable property
- `LIGHTHOUSE 100.` — verifiable, technical, terse

All four maintain the DU/TDR voice. Avoid anything that implies speed, ease, or subjective quality without specificity.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Playwright (version from package.json) |
| Config file | `playwright.config.ts` |
| Quick run command | `pnpm exec playwright test tests/phase-35-metadata.spec.ts` |
| Full suite command | `pnpm exec playwright test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| COP-01 | Component count = 48 across all locations | Source assertion (readFileSync) + visual check | `pnpm exec playwright test tests/phase-35-metadata.spec.ts` | Partial — OG covered; hero/stats/meta need manual or new assertions |
| COP-02 | Version string = v1.7 in OG image | Source assertion (readFileSync) | `pnpm exec playwright test tests/phase-35-metadata.spec.ts` | Partial — currently asserts v1.5 (will pass after fix) |
| COP-03 | No "FRAMEWORK-AGNOSTIC" on /init | Manual visual check or new source assertion | Manual | No — new assertion needed if automated coverage is desired |
| COP-04 | "SHIP FASTER" absent from marquee | Manual visual check | Manual | No |
| COP-05 | "and growing" absent from hero + meta | Manual visual check | Manual | No |
| COP-06 | phase-35-metadata.spec.ts passes clean | Playwright spec | `pnpm exec playwright test tests/phase-35-metadata.spec.ts` | Yes (needs assertion updates) |

### Sampling Rate

- **Per task commit:** `pnpm exec playwright test tests/phase-35-metadata.spec.ts`
- **Per wave merge:** `pnpm exec playwright test`
- **Phase gate:** `phase-35-metadata.spec.ts` passes green before `/pde:verify-work`

### Wave 0 Gaps

None for the core test coverage requirement (COP-06 only requires updating existing assertions, not creating new infrastructure). Optional: add source assertions for hero, stats-band, and marquee copy strings if stricter drift protection is desired post-phase.

---

## Execution Order

The seven edits should land in this order to avoid a partially-broken test state:

1. `components/blocks/stats-band.tsx` — update `"28"` → `"48"` (COP-01)
2. `components/blocks/hero.tsx` — update count paragraph + version tag (COP-01, COP-02, COP-05)
3. `app/page.tsx` — update meta description (COP-01, COP-05)
4. `app/init/page.tsx` — update STEPS[4].description (COP-03)
5. `components/blocks/marquee-band.tsx` — replace `SHIP FASTER` (COP-04)
6. `app/opengraph-image.tsx` — update version string + COMPONENTS count (COP-01, COP-02)
7. `tests/phase-35-metadata.spec.ts` — update assertions to new strings (COP-06) — **LAST**

---

## Open Questions

1. **Hero version tag: semver vs. milestone label**
   - What we know: Hero shows `SF//UX v2.0.0 · 2026` (semver). OG shows `v1.5 — REDESIGN` (milestone label). The locked decision says "hero version string must match OG image."
   - What's unclear: Does "match" mean same format (both `v1.7`) or just same milestone identity? The `v2.0.0` on the hero may be an intentional semver distinct from the milestone label.
   - Recommendation: Update hero to `SF//UX v1.7 · 2026` to satisfy COP-02 literally. If `v2.0.0` is intentional (e.g., the npm package version), document the distinction and keep it — but that would be a departure from the locked decision.

2. **OG `77/77 ✓` Lighthouse readout — stale?**
   - What we know: OG currently shows `77/77 ✓`. Lighthouse Performance baseline is 78 (per project context). This may be stale.
   - What's unclear: Whether the number refers to Performance only or an aggregate. The spec test currently asserts `.toContain("77/77")`.
   - Recommendation: The planner should verify the current Lighthouse Performance score and update both the OG readout and the test assertion together if stale.

---

## Sources

### Primary (HIGH confidence)
- Direct source file reads: `components/blocks/hero.tsx`, `components/blocks/stats-band.tsx`, `components/blocks/marquee-band.tsx`, `app/page.tsx`, `app/init/page.tsx`, `app/opengraph-image.tsx`, `tests/phase-35-metadata.spec.ts`
- `components/sf/` directory listing: 52 entries, 48 non-lazy non-index component files
- `.planning/phases/44-copy-audit-fixes/44-CONTEXT.md`: locked decisions
- `.planning/REQUIREMENTS.md`: COP-01 through COP-06 definitions
- `.planning/STATE.md`: v1.7 phase map, v1.7 critical constraints

### Secondary (MEDIUM confidence)
- `CLAUDE.md` project rules: DU/TDR voice guidance, zero-dependency constraint, commit patterns

---

## Metadata

**Confidence breakdown:**
- Copy locations and current values: HIGH — all verified by direct file read
- Component count (48): HIGH — counted directly from directory listing using the CONTEXT.md exclusion rule
- Test assertion targets: HIGH — read directly from spec file
- Marquee replacement copy: MEDIUM — Claude's discretion; no single verifiable source, guided by DU/TDR aesthetic principles from CLAUDE.md
- Hero version tag interpretation: MEDIUM — ambiguity between semver and milestone label documented in Open Questions

**Research date:** 2026-04-11
**Valid until:** Immediately valid; static copy does not change unless a developer edits the files. Count becomes stale when new SF components are added.
