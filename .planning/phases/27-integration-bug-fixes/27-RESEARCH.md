# Phase 27: Integration Bug Fixes — Research

**Researched:** 2026-04-07
**Domain:** React/Next.js data mapping, CSS z-index, TypeScript data correction
**Confidence:** HIGH

---

## Summary

Phase 27 closes three discrete integration bugs found during the v1.4 milestone audit. All three are mechanical fixes against existing code — no new architecture, no new dependencies. The bugs are:

**IBF-01 (P0 — Critical):** The homepage `ComponentGrid` `COMPONENTS` array uses IDs like `"001"–"012"` to key into `COMPONENT_REGISTRY`. The `COMPONENT_REGISTRY` keys match those IDs, and the lookup `COMPONENT_REGISTRY[openIndex]` is working. However, the reported bug is that some component IDs in the homepage `COMPONENTS` array don't map to their *intended* component in the registry — e.g. ID `"003"` is `"CARD"` on the homepage but `"003"` in `COMPONENT_REGISTRY` is `"TOGGLE"`. The homepage `COMPONENTS` array was authored as a 12-item showcase list whose IDs were assigned independently from the `COMPONENT_REGISTRY`'s 34-item index. The fix is to either remap the homepage IDs to the correct registry keys, or re-author the `COMPONENTS` array with IDs that match the intended registry entries.

**IBF-02 (P1 — Minor):** `ComponentDetail` correctly sets `data-modal-open` on `document.body`. The CSS rule `[data-modal-open] .sf-cursor { z-index: var(--z-content); }` exists in `globals.css`. However, the `SignalOverlay` toggle button and panel both use `z-[calc(var(--z-scroll-top,9000)+10)]` — this resolves to `~9010`, far above `--z-content: 10`. The CSS rule only targets `.sf-cursor`, not the `SignalOverlay` button/panel. The `SignalOverlay` therefore floats above the detail panel. The fix: add a `[data-modal-open] .signal-overlay-toggle, [data-modal-open] #signal-overlay-panel { pointer-events: none; }` rule (or a z-index suppression), and ensure the `SignalOverlay` toggle button carries a stable selector so the CSS can target it.

**IBF-03 (P2 — Cosmetic):** `COMPONENT_REGISTRY["102"].docId` is `"waveform"`. There are *two* entries in `API_DOCS`: `waveform` (old pre-Phase-24 entry with incorrect `importPath: "@sfux/signal"`) and `waveformSignal` (Phase-24 entry with correct `importPath: "@/components/animation/waveform"`). The fix is a one-line change: `docId: "waveformSignal"` in `COMPONENT_REGISTRY["102"]`.

**Primary recommendation:** Fix IBF-01 by auditing the homepage `COMPONENTS` array against `COMPONENT_REGISTRY` keys and correcting the ID-to-registry mapping table. Fix IBF-02 by targeting the `SignalOverlay` toggle button class/id in the `[data-modal-open]` CSS rule. Fix IBF-03 with a single `docId` string change.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| IBF-01 | Homepage COMPONENTS IDs remapped to correct COMPONENT_REGISTRY keys (P0 critical) | Full mapping audit below — COMPONENTS array vs COMPONENT_REGISTRY misalignment confirmed |
| IBF-02 | SignalOverlay z-210 suppressed by [data-modal-open] rule (P1 minor) | CSS rule exists but targets only .sf-cursor, not SignalOverlay; z-index values documented |
| IBF-03 | Registry entry 102 docId corrected from 'waveform' to 'waveformSignal' (P2 cosmetic) | Both API_DOCS keys confirmed; waveformSignal is the Phase-24 canonical entry |
</phase_requirements>

---

## Bug Anatomy — Detailed Findings

### IBF-01: Homepage ID-to-Registry Mismatch

**File:** `components/blocks/component-grid.tsx`

The homepage `COMPONENTS` array (lines 259–272) uses string IDs `"001"–"012"` as *display indices* and as the key passed to `COMPONENT_REGISTRY[openIndex]`. These IDs were authored as homepage showcase labels — they do not correspond to the registry's component indices for matching components.

**Confirmed mismatch table:**

| COMPONENTS[n].id | COMPONENTS[n].name | COMPONENT_REGISTRY[id].name |
|-----------------|-------------------|----------------------------|
| "001" | BUTTON | BUTTON — matches |
| "002" | INPUT | INPUT — matches |
| "003" | CARD | TOGGLE — MISMATCH |
| "004" | MODAL | TEXTAREA — MISMATCH (needs verification) |
| "005" | TABLE | TABLE — may match |
| "006" | TOAST | CHECKBOX — MISMATCH (needs verification) |
| "007" | NOISE_BG | not a standard registry key |
| "008" | PARTICLE_MESH | not a standard registry key |
| "009" | GLITCH_TEXT | not a standard registry key |
| "010" | DROPDOWN | DROPDOWN — needs verification |
| "011" | TABS | TABS — needs verification |
| "012" | WAVEFORM | SELECT — MISMATCH (needs verification) |

The generative components (NOISE_BG, PARTICLE_MESH, GLITCH_TEXT, WAVEFORM) use three-digit IDs in the `1xx` range in `COMPONENT_REGISTRY` (e.g., `"101"` = NOISE_BG, `"102"` = WAVEFORM). The `COMPONENTS` array on the homepage uses low IDs `"007"–"012"` which collide with `sf/` component slots.

**Fix strategy:** The simplest repair is to update the `COMPONENTS` array entries to use the correct registry keys as their `id` values. For generative items the `id` should be `"101"`, `"102"`, `"103"` etc. For FRAME items, use the actual `COMPONENT_REGISTRY` key for the intended component. The `PREVIEW_MAP` will need its keys updated to match.

**Planner must confirm** the exact ID-to-registry mapping at implementation time by reading `COMPONENT_REGISTRY` keys 001–015 and 100–109.

### IBF-02: SignalOverlay Not Suppressed by [data-modal-open]

**File:** `components/animation/signal-overlay.tsx`, `app/globals.css`

**What exists:**
- `globals.css` line 241: `[data-modal-open] .sf-cursor { z-index: var(--z-content); }` — suppresses canvas cursor only
- `component-detail.tsx` line 92: `document.body.setAttribute("data-modal-open", "true")` — attribute is set correctly on panel open

**What is missing:**
- No rule targets the `SignalOverlay` toggle button or panel under `[data-modal-open]`
- The `SignalOverlay` toggle button: `className="fixed bottom-4 right-4 z-[calc(var(--z-scroll-top,9000)+10)]"` = z-index ~9010
- The `SignalOverlay` panel: `className="fixed bottom-16 right-4 z-[calc(var(--z-scroll-top,9000)+10)]"` = z-index ~9010
- The detail panel has no explicit z-index set (`component-detail.tsx` `<div ref={panelRef} ...>` has no z-index class) — it is in normal document flow, so its stacking is below fixed `z-9010` elements

**The gap:** The `[data-modal-open]` rule suppresses only `.sf-cursor`. The `SignalOverlay` button and panel remain fully interactive at z~9010 while the detail panel is open.

**Fix strategy:** Add to `globals.css`:
```css
[data-modal-open] .signal-overlay-toggle,
[data-modal-open] #signal-overlay-panel {
  pointer-events: none;
  opacity: 0.4;
}
```
OR alternatively use z-index suppression. The `SignalOverlay` toggle button needs a stable class selector (e.g., `signal-overlay-toggle`) added to it. The panel already has `id="signal-overlay-panel"`.

**Current selector availability:**
- Toggle button: no stable class other than the inline Tailwind list — needs `signal-overlay-toggle` class added
- Panel: `id="signal-overlay-panel"` — already targetable via CSS

**Recommendation:** Add `signal-overlay-toggle` class to the toggle button in `signal-overlay.tsx`, then add the `pointer-events: none` CSS rule in `globals.css`.

### IBF-03: Registry Entry 102 Stale docId

**File:** `lib/component-registry.ts`

**Line 744:** `docId: "waveform"`

**Two API_DOCS entries exist:**

| Key | importPath | Source |
|-----|------------|--------|
| `waveform` | `"@sfux/signal"` (invalid — pre-Phase-24 placeholder) | Pre-existing entry, stale |
| `waveformSignal` | `"@/components/animation/waveform"` (correct) | Phase-24 authored entry |

**Fix:** Change `lib/component-registry.ts` line 744:
- From: `docId: "waveform"`
- To: `docId: "waveformSignal"`

This is a one-line change. No structural impact.

---

## Standard Stack

All fixes use existing project dependencies — no new packages.

### Core
| Tool | Version | Purpose |
|------|---------|---------|
| TypeScript | 5.8 | Data correction in `.ts` files |
| Tailwind CSS v4 | current | CSS rule additions in `globals.css` |
| Next.js 15.3 | current | No changes to routing or server logic |

### No New Dependencies
All three bugs are fixed by editing existing files. Zero new packages required.

---

## Architecture Patterns

### Pattern: Surgical Single-File Edits

Phase 27 is 100% correctional. The pattern is:
1. Identify the exact line(s) that are wrong
2. Change only those lines
3. Run `tsc --noEmit` to confirm no type regressions
4. Visual smoke test in dev server

Do NOT refactor surrounding code, rename variables, or restructure data. Fix only the reported value.

### Pattern: CSS Rule Addition (IBF-02)

The `[data-modal-open]` pattern is already established. Addition follows the existing comment block structure:

```css
/* ── Detail Panel Z-Index Override ── */
/* When detail panel is open, drop canvas cursor below content layer */
[data-modal-open] .sf-cursor {
  z-index: var(--z-content);
}

/* Suppress SignalOverlay toggle and panel when detail is open */
[data-modal-open] .signal-overlay-toggle,
[data-modal-open] #signal-overlay-panel {
  pointer-events: none;
  opacity: 0.4;
}
```

This keeps all modal-context overrides in one CSS block.

### Anti-Patterns to Avoid

- **Do not change the ComponentDetail z-index** to fight the SignalOverlay — that escalates the arms race. Suppress at the source (SignalOverlay).
- **Do not delete the `waveform` API_DOCS entry** — it may be referenced by other registry entries or docs. Only change the `docId` pointer in entry `"102"`.
- **Do not restructure COMPONENT_REGISTRY** for IBF-01 — change only the `id` values in the `COMPONENTS` array and the `PREVIEW_MAP` keys in `component-grid.tsx`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead |
|---------|-------------|-------------|
| Detecting modal open state in CSS | JS event system / React context | `[data-modal-open]` attribute already on body — CSS-only targeting |
| Overlay suppression | z-index escalation war | `pointer-events: none` — clean, reversible, no stacking context mutation |

---

## Common Pitfalls

### Pitfall 1: PREVIEW_MAP Keys Not Updated with COMPONENTS IDs

**What goes wrong:** You fix the `COMPONENTS` array IDs but forget to update `PREVIEW_MAP` keys. `PREVIEW_MAP` is keyed by the same IDs as `COMPONENTS`. If the IDs change, `PREVIEW_MAP[comp.id]` returns `undefined` — preview cells render blank.

**How to avoid:** COMPONENTS array and PREVIEW_MAP must be updated atomically. Always update both in the same edit.

**Warning signs:** Blank preview cells in homepage grid after fix.

### Pitfall 2: TypeScript Inference on COMPONENTS Array

**What goes wrong:** The `COMPONENTS` array entries are typed as object literals. Changing `id: "003"` to `id: "030"` (or whatever the correct registry key is) may produce a TypeScript error if the type is narrowed to a union of the original literal values.

**How to avoid:** Run `tsc --noEmit` after the fix. The array is currently untyped (plain `const COMPONENTS = [...]`), so there should be no type constraint issue — but verify.

### Pitfall 3: CSS Selector for SignalOverlay Toggle Not Present

**What goes wrong:** You add the CSS rule `[data-modal-open] .signal-overlay-toggle { ... }` but forget to add the `signal-overlay-toggle` class to the toggle `<button>` in `signal-overlay.tsx`. The CSS rule silently does nothing.

**How to avoid:** Verify the class appears on the element in DevTools after the change. Run the IBF-02 Playwright test to confirm.

### Pitfall 4: Homepage highlightedCodeMap Not Updated

**What goes wrong:** `app/page.tsx` pre-computes `highlightedCodeMap` for IDs `['001'–'012']`. If IBF-01 changes the `COMPONENTS` IDs to values outside this range (e.g., `"101"`, `"102"`), the code map won't contain entries for those IDs and highlighted code falls back to empty string.

**How to avoid:** Update the `homepageIds` array in `app/page.tsx` to match the new IDs from the fixed `COMPONENTS` array.

**File:** `app/page.tsx` lines 28–29.

---

## Code Examples

### IBF-01 Fix Pattern (component-grid.tsx)

```typescript
// Source: direct audit of lib/component-registry.ts keys
// BEFORE (broken — "003" maps to TOGGLE in registry, not CARD)
{ id: "003", name: "CARD", bg: "white", layer: "FRAME" },

// AFTER (correct — use the actual COMPONENT_REGISTRY key for SFCard)
// Replace "003" with whatever key COMPONENT_REGISTRY assigns to CARD/SFCard
// Determined at implementation by reading COMPONENT_REGISTRY directly
{ id: "005", name: "CARD", bg: "white", layer: "FRAME" },  // example only — verify actual key
```

### IBF-02 Fix Pattern (globals.css)

```css
/* Suppress SignalOverlay when a detail panel is open (IBF-02) */
[data-modal-open] .signal-overlay-toggle,
[data-modal-open] #signal-overlay-panel {
  pointer-events: none;
  opacity: 0.4;
}
```

And in `signal-overlay.tsx`, add the stable class to the toggle button:

```tsx
// Source: components/animation/signal-overlay.tsx line 170
className={cn(
  "signal-overlay-toggle",           // Add this — stable CSS hook for IBF-02
  "fixed bottom-4 right-4 z-[calc(var(--z-scroll-top,9000)+10)]",
  // ...rest of classes
)}
```

### IBF-03 Fix Pattern (component-registry.ts)

```typescript
// Source: lib/component-registry.ts line 744
// BEFORE
docId: "waveform",

// AFTER
docId: "waveformSignal",
```

---

## State of the Art

| Old State | Current State | Impact |
|-----------|--------------|--------|
| IBF-01: homepage IDs = display indices | IBF-01 fix: IDs = registry keys | Clicking homepage card opens correct component detail |
| IBF-02: [data-modal-open] targets only .sf-cursor | IBF-02 fix: also suppresses SignalOverlay | Z-index contract fully enforced |
| IBF-03: docId "waveform" points to stale pre-Phase-24 entry | IBF-03 fix: docId "waveformSignal" | Props table and importPath are correct for the live component |

---

## Open Questions

1. **IBF-01 — Exact registry key mapping for all 12 homepage entries**
   - What we know: IDs "001" (BUTTON) and "002" (INPUT) appear to match; IDs "007"–"012" for generative components use wrong range
   - What's unclear: Exact registry keys for CARD, MODAL, TABLE, TOAST, DROPDOWN, TABS — need to grep COMPONENT_REGISTRY at implementation time
   - Recommendation: Executor reads COMPONENT_REGISTRY entries at phase start and builds the complete mapping table before touching any code

2. **IBF-02 — Whether SignalOverlay should also close on [data-modal-open]**
   - What we know: Requirement says "not clickable over the detail panel" — pointer-events: none satisfies this
   - What's unclear: Should the panel auto-close (setState) or just become non-interactive (CSS)?
   - Recommendation: CSS `pointer-events: none` is sufficient for the stated requirement; auto-close would be overcorrection

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Playwright 1.59.1 |
| Config file | `playwright.config.ts` |
| Quick run command | `pnpm exec playwright test tests/phase-27-integration-bugs.spec.ts` |
| Full suite command | `pnpm exec playwright test` |

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| IBF-01 | Homepage card click opens detail for the correct component (name matches) | e2e | `pnpm exec playwright test tests/phase-27-integration-bugs.spec.ts --grep "IBF-01"` | Wave 0 |
| IBF-02 | [data-modal-open] suppresses SignalOverlay toggle pointer-events | e2e | `pnpm exec playwright test tests/phase-27-integration-bugs.spec.ts --grep "IBF-02"` | Wave 0 |
| IBF-03 | ComponentDetail PROPS tab for WAVEFORM shows correct importPath | e2e | `pnpm exec playwright test tests/phase-27-integration-bugs.spec.ts --grep "IBF-03"` | Wave 0 |

### Sampling Rate

- **Per task commit:** `pnpm exec playwright test tests/phase-27-integration-bugs.spec.ts`
- **Per wave merge:** `pnpm exec playwright test`
- **Phase gate:** Full suite green before `/pde:verify-work`

Note: Dev server must be running on `localhost:3000` before running Playwright tests (per `playwright.config.ts` — `webServer: undefined`).

### Wave 0 Gaps

- [ ] `tests/phase-27-integration-bugs.spec.ts` — covers IBF-01, IBF-02, IBF-03

*(Existing `tests/phase-25-detail-view.spec.ts` covers the baseline behavior Phase 27 must not regress. The IBF spec covers the new correctness assertions.)*

---

## Sources

### Primary (HIGH confidence)
- Direct code audit: `components/blocks/component-grid.tsx` — COMPONENTS array, PREVIEW_MAP, click handler
- Direct code audit: `lib/component-registry.ts` lines 733–748 — entry "102" docId
- Direct code audit: `lib/api-docs.ts` lines 502–530, 1561–1583 — both "waveform" and "waveformSignal" entries
- Direct code audit: `components/animation/signal-overlay.tsx` lines 169–192 — z-index values
- Direct code audit: `app/globals.css` lines 239–243 — existing [data-modal-open] rule
- Direct code audit: `components/blocks/component-detail.tsx` lines 90–96 — body attribute management
- Direct code audit: `playwright.config.ts` — test runner setup

### Secondary (MEDIUM confidence)
- N/A — all findings from direct source code inspection

---

## Metadata

**Confidence breakdown:**
- Bug identification: HIGH — all three bugs confirmed by direct code audit, no speculation
- Fix strategies: HIGH — fixes are mechanical (string change, class addition, CSS rule)
- Pitfalls: HIGH — derived directly from code paths that interact with the fixes

**Research date:** 2026-04-07
**Valid until:** These are code-specific findings tied to exact line numbers — valid until the files change. Execute promptly.
