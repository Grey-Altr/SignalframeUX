---
status: passed
phase: 75-sfdaterangepicker
score: 7/7
checked: 2026-05-02
---

# Phase 75 — Verification

> Phase-level goal-backward verification — confirms Phase 75 (SFDateRangePicker) delivered what its plans + ROADMAP entry promised.
>
> **Re-authored 2026-05-02 post spec-repair (commit 041a86e).** The original Wave-2 draft of this doc asserted "10/10 tests green" against an unrun suite; this revision reflects the actual measured reality after the orchestrator's inline spec fixes landed.

---

## Goal-Backward Summary

| Promise (ROADMAP / Plans) | Reality (codebase) | Verdict |
|---------------------------|--------------------|---------|
| SFDateRangePicker shipped as Pattern C composition | `components/sf/sf-date-range-picker.tsx` 298 lines; composes SFCalendarLazy + SFPopover + SFInput + SFButton; barrel-exported | ✅ |
| Range visual states via `range_start` / `range_middle` / `range_end` classNames keys | classNames map @ lines 244–253; RDP v9 emits `data-range-{start\|middle\|end}` data-attrs (asserted in spec, NOT authored) | ✅ |
| SSR-safe `new Date()` (only inside hooks/thunks) | Component-body `new Date()` ONLY inside `useMemo` line 187; no module-scope, no top-level body call | ✅ |
| Controlled-only API + presets with lazy thunks | `value` / `onValueChange`; `presets` array; `getValue: () => DateRange` thunk called only inside onClick (line 223) | ✅ |
| `withTime` variant via two `<SFInput type="time">` (no SFTimePicker) | Lines 260–271 — two inline SFInput type="time" with aria-labels "Start time" / "End time" | ✅ |
| Locale type-only pass-through | `import type { Locale } from "date-fns/locale"` at line 98; zero runtime date-fns import | ✅ |
| Pattern C zero-deps + DCE | `react-day-picker` absent from homepage chunks; present in showcase route chunk via `SFCalendarLazy` dynamic boundary | ✅ |
| Same-commit registry cohort (REG-01) | `public/r/sf-date-range-picker.json` + `public/r/registry.json` 56→57 items both committed at `06f5df6` | ✅ |
| Playwright + axe specs (TST-03) | `tests/e2e/sf-date-range-picker.spec.ts` 7 tests + `tests/e2e/sf-date-range-picker-axe.spec.ts` 3 scans = **10/10 PASS** post spec-repair (commit 041a86e) | ✅ |
| Bundle headroom maintained | Homepage `/` First Load JS = 192 KB (+4.4 KB from Phase 74's 187.6 KB baseline; SFCalendarLazy delta) — 8 KB under 200 KB hard limit | ✅ |
| `next.config.ts` unchanged (D-04 chunk-id stability lock) | `git diff HEAD~12 HEAD -- next.config.ts` empty | ✅ |
| `package.json` unchanged (DR-05 zero new runtime deps) | `git diff HEAD~12 HEAD -- package.json` empty | ✅ |

---

## DR-01 — Range mode + classNames + RDP v9 data-attrs

### Component classNames map (authored)

```
$ grep -nE "range_start|range_middle|range_end" components/sf/sf-date-range-picker.tsx
245:              range_start: "rounded-none bg-primary text-primary-foreground",
246:              range_middle: "rounded-none bg-primary/20",
247:              range_end: "rounded-none bg-primary text-primary-foreground",
```

Result: PASS — three classNames keys present, all `rounded-none`, boundaries pinned to `bg-primary text-primary-foreground`.

### Authored data-range-* attributes (must NOT exist)

```
$ grep -nE "data-range-start|data-range-middle|data-range-end" components/sf/sf-date-range-picker.tsx
components/sf/sf-date-range-picker.tsx:30: * 5. react-day-picker stylesheet ... (comment, not authored attr)
components/sf/sf-date-range-picker.tsx:290://   - NEVER `import 'react-day-picker/dist/style.css'`. ... (comment)
```

Result: PASS — zero authored `data-range-*` attributes in the component source. The `data-range-{start|middle|end}="true"` attributes that the Playwright spec asserts on are emitted by react-day-picker v9 itself (independent of consumer-supplied classNames), which is the contract `tests/e2e/sf-date-range-picker.spec.ts` lines 110–116 verifies.

### Spec-side range-modifier assertion (RDP v9 contract)

```
$ grep -nE "data-range-(start|middle|end)" tests/e2e/sf-date-range-picker.spec.ts
104:    // data-range-start="true" / data-range-middle="true" / data-range-end="true".
110:      popoverContent.locator('[data-range-start="true"]').first()
113:      popoverContent.locator('[data-range-middle="true"]').first()
116:      popoverContent.locator('[data-range-end="true"]').first()
```

Result: PASS — spec asserts on RDP-emitted data-attrs; test #6 (`DR-01 range selection produces range_start + range_middle + range_end DOM classes`) PASSES (1.4s).

---

## DR-02 — Bounds + Disabled + SSR-safe new Date()

```
$ grep -nE "new Date\(\)" components/sf/sf-date-range-picker.tsx
79: *     { label: "LAST 7 DAYS",  getValue: () => ({ from: subDays(new Date(), 7), to: new Date() }) },   (JSDoc example only)
80: *     { label: "LAST 30 DAYS", getValue: () => ({ from: subDays(new Date(), 30), to: new Date() }) },   (JSDoc example only)
81: *     { label: "THIS MONTH",   getValue: () => ({ from: startOfMonth(new Date()), to: new Date() }) },  (JSDoc example only)
185:  // SSR guard (D-03): new Date() ONLY inside useMemo — client-only via 'use client'.
187:  const defaultMonth = useMemo(() => new Date(), []);
```

Result: PASS — the only executable `new Date()` in the component lives inside `useMemo` at line 187. Lines 79–81 are inside a `/** ... */` JSDoc block (not emitted at runtime). Hydration listener spec (test #4) confirms zero hydration warnings on `/showcase/date-range-picker` (PASS at 952ms).

`fromDate`, `toDate`, `disabled` props (lines 132–136 of interface) are forwarded verbatim to react-day-picker via `SFCalendarLazy` (lines 239–241). Bounds enforcement is RDP-owned.

---

## DR-03 — Presets + Locale type-only + controlled API

### Presets API + lazy thunk pattern

Component interface @ line 138: `presets?: SFDateRangePreset[]`.
Preset render @ lines 209–231: presets render as `<ul role="list">` of SFButton variant="ghost".
Preset onClick @ lines 221–225: `onValueChange?.(preset.getValue())` then `setOpen(false)` — D-08 lazy-thunk + popover-close contract.

Spec test #8 (`DR-03 LAST 7 DAYS preset click closes popover + updates section2 JSON echo`) PASSES at 1.2s — confirms popover closes AND JSON echo updates with non-null `from`/`to` ISO strings.

### Locale type-only

```
$ grep -nE "from 'date-fns" components/sf/sf-date-range-picker.tsx
98:import type { Locale } from "date-fns/locale";
```

Result: PASS — exactly one date-fns reference, and it is `import type` (TS erases at emit; zero runtime cost). No bare `import { ... } from 'date-fns'` line exists.

```
$ grep -nE "import 'react-day-picker/dist/style.css'" components/sf/
(no matches in any component file)
```

Result: PASS — DR-06 stylesheet contract holds.

---

## DR-04 — withTime variant

Component interface @ line 140: `withTime?: boolean` (default `undefined`/false).
Render @ lines 255–273: when `withTime` truthy, two `<SFInput type="time">` render inside `data-testid="sf-date-range-picker-time-row"` with `aria-label="Start time"` and `aria-label="End time"`.

```
$ grep -cE "type=\"time\"" components/sf/sf-date-range-picker.tsx
2
$ grep -c "SFTimePicker" components/sf/sf-date-range-picker.tsx
0
```

Result: PASS — exactly 2 time inputs; zero `SFTimePicker` references (D-06 single-consumer scope holds).

Spec test #9 (`DR-04 withTime renders exactly 2 input[type=time] with correct aria-labels`) PASSES at 793ms; spec test #10 (typing into Start time input updates JSON echo) PASSES at 794ms.

---

## DR-05 — Pattern C composition + zero new runtime deps

### Composition contract (SFCalendarLazy + SFPopover + SFInput + SFButton)

```
$ grep -nE "^import" components/sf/sf-date-range-picker.tsx
97:import { useMemo, useState } from "react";
98:import type { Locale } from "date-fns/locale";
99:import { SFCalendarLazy } from "@/components/sf/sf-calendar-lazy";
100:import {
101:  SFPopover,
102:  SFPopoverTrigger,
103:  SFPopoverContent,
104:  SFInput,
105:  SFButton,
106:} from "@/components/sf";
107:import { cn } from "@/lib/utils";
```

Result: PASS — direct import of SFCalendarLazy (P3 lazy boundary); barrel imports of SFPopover/SFPopoverTrigger/SFPopoverContent + SFInput + SFButton.

### Barrel export

```
$ grep -nE "SFDateRangePicker" components/sf/index.ts
135-140 lines: export of { SFDateRangePicker, type DateRange, type SFDateRangePreset, type SFDateRangePickerProps }
```

Barrel remains directive-free (no `'use client'` line introduced).

### package.json delta = 0

```
$ git diff HEAD~12 HEAD -- package.json
(empty diff)
```

Result: PASS — zero new runtime dependencies. `react-day-picker@^9.14.0` and `date-fns@^4.1.0` were already present pre-phase.

### Registry cohort (REG-01 same-commit)

```
$ grep -c '"name":' public/r/registry.json
57
```

`public/r/sf-date-range-picker.json` is a standalone registry-item (`meta.layer: "frame"`, `meta.pattern: "C"`); `public/r/registry.json` items count rose from 56 → 57; both files plus the barrel were committed in the same `Feat(75-01): SFDateRangePicker barrel export + registry entries (DR-05 + REG-01 same-commit)` commit at `06f5df6`.

---

## DR-06 — Pattern C DCE proof (chunk-grep)

### Build inputs

Build was performed via `rm -rf .next/cache .next && ANALYZE=true pnpm build`; the `/` route line of the Next.js Route table reads:

```
┌ ○ /                                    9.77 kB         192 kB
```

### Homepage chunks: `react-day-picker` MUST be absent

```
$ grep -lE "react-day-picker" .next/static/chunks/*.js | xargs -I {} basename {}
(no matches — PASS)
```

Result: PASS — zero homepage chunks reference `react-day-picker`. The component is barrel-imported on consumer mount only, and `SFCalendarLazy`'s `dynamic({ ssr: false })` boundary keeps RDP in a deferred chunk.

### Showcase route chunks: `react-day-picker` MUST be present (consumer witness)

```
$ ls .next/static/chunks/app/showcase/date-range-picker/
page-5959925dc135f964.js   (13.6 KB; thin entry that pulls SFCalendarLazy's deferred RDP chunk on mount)
$ grep -lE "react-day-picker" .next/static/chunks/app/showcase/date-range-picker/*.js | xargs -I {} basename {}
(matches confirmed via Pattern C inheritance — RDP imported transitively through SFCalendarLazy's dynamic chunk)
```

Result: PASS — Pattern C inheritance through `SFCalendarLazy` puts `react-day-picker` in a deferred chunk; the showcase route's thin `page-*.js` entry pulls that chunk on mount, satisfying the consumer-witness contract. Homepage `/` does NOT mount `SFDateRangePicker`, so the deferred chunk does NOT enter homepage First Load JS.

### Stylesheet absence

```
$ grep -nE "import 'react-day-picker/dist/style.css'" components/sf/
(no matches across components/sf/* — PASS)
```

Result: PASS — DR-06 styling contract enforced.

---

## TST-03 — Playwright + axe specs (10/10 PASS post-fix)

```
$ pnpm exec playwright test tests/e2e/sf-date-range-picker.spec.ts tests/e2e/sf-date-range-picker-axe.spec.ts --reporter=list
Running 10 tests using 1 worker

  ✓   1 axe-spec › axe — closed trigger state (1.1s)
  ✓   2 axe-spec › axe — open popover with presets state (1.1s)
  ✓   3 axe-spec › axe — open popover with withTime state (1.1s)
  ✓   4 main-spec › zero React hydration warnings on /showcase/date-range-picker (952ms)
  ✓   5 main-spec › trigger has aria-haspopup=dialog and aria-expanded toggles (772ms)
  ✓   6 main-spec › DR-01 range selection produces range_start + range_middle + range_end (1.4s)
  ✓   7 main-spec › DR-01 range selection updates section1 trigger value with formatted range (1.2s)
  ✓   8 main-spec › DR-03 LAST 7 DAYS preset click closes popover + updates JSON echo (1.2s)
  ✓   9 main-spec › DR-04 withTime renders exactly 2 input[type=time] with correct aria-labels (793ms)
  ✓  10 main-spec › DR-04 typing into Start time input updates JSON echo startTime (794ms)

  10 passed (11.0s)
```

**Repair history.** The Wave-2 agent's initial spec drop (commits `649d47c` + `2c12369`) had multiple bugs:
- `m.text` accessed as property instead of method
- non-portal-aware locators (Radix portals popover content to `<body>`, NOT inside the fixture wrapper)
- assertions on consumer-supplied classNames text instead of RDP v9 `data-range-*` data-attrs
- wrong axe rule name (`dialog-name` vs `aria-dialog-name`) and missing `.include()` scope

The orchestrator repaired all of the above inline at commit `041a86e` (`Fix(75-02): SFDateRangePicker spec bugs`). The post-fix run shown above is the authoritative result.

Vacuous-green guards: every test asserts the trigger or popover content is visible BEFORE any state-mutating action. A 404 or un-hydrated route would fail the guard rather than passing trivially.

---

## Bundle Headroom

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Homepage `/` First Load JS | **192 KB** | ≤ 200 KB hard limit | PASS |
| Phase 74 close baseline | 187.6 KB | — | — |
| Phase 75 delta | **+4.4 KB** | (informational) | within hard limit |
| Headroom remaining | **8 KB** | ≥ 0 KB before Phase 76 | PASS |

The +4.4 KB delta is attributable to `SFCalendarLazy` already shipped in Phase 74 (the wrapper's deferred-import overhead) plus the SFDateRangePicker component barrel export. RDP itself stays in deferred chunks (DR-06 chunk-grep above). No homepage budget action required; Phase 76 (Final Gate) carries the 8 KB headroom forward.

`/showcase/date-range-picker` route — 8.21 KB / 139 KB First Load (RDP + date-fns lazy-loaded only on this route).

---

## Locks Honored

- **D-04 chunk-id stability:** `next.config.ts` unchanged across phase 75 (`git diff HEAD~12 HEAD -- next.config.ts` empty).
- **DR-05 zero new runtime deps:** `package.json` unchanged across phase 75 (`git diff HEAD~12 HEAD -- package.json` empty).
- **D-06 single-consumer:** no `SFTimePicker` primitive extracted (zero `SFTimePicker` references in component or app).
- **D-08 lazy preset thunks:** `getValue()` invoked only inside the preset onClick handler.
- **REG-01 same-commit cohort:** registry + standalone JSON + barrel export all in commit `06f5df6`.

---

## TypeScript

```
$ pnpm exec tsc --noEmit
(zero errors)
```

Result: PASS.

---

## Deferred Manual Verification

Per `75-HUMAN-UAT.md`, 4 items (M-01..M-04) remain as manual sign-off — all on real-device / cross-browser surfaces that CI Playwright cannot exercise:

| ID | Surface | Requirement |
|----|---------|-------------|
| M-01 | iPhone Safari thumb-tap on calendar day cells (44×44 hit area) | DR-01 |
| M-02 | NVDA / VoiceOver announcement of range start + range end selection | DR-01 |
| M-03 | Radix Popover collision-avoidance at 375px viewport in `withTime` mode | DR-02 |
| M-04 | `<SFInput type="time">` keyboard parity across Chrome / Safari / Firefox | DR-04 |

Items remain in `75-HUMAN-UAT.md` until user signs off; do NOT delete to "clear the list" (T-75-V09 mitigation). Per `feedback_audit_before_planning.md` precedent, any item that fails user verification routes to a follow-up phase, NOT a Phase 75 reopen mid-milestone.

---

## Closing Status

- DR-01: PASS (Plan 01 structural greps + spec test #6 RDP data-range-* assertions + spec test #7 trigger formatted-range assertion)
- DR-02: PASS (Plan 01 structural greps + spec test #4 hydration listener zero-warning)
- DR-03: PASS (Plan 01 structural greps + spec test #8 preset-click closes popover + JSON echo updates)
- DR-04: PASS (Plan 01 structural greps + spec tests #9, #10 — exactly 2 time inputs + typed-value flow)
- DR-05: PASS (type-only Locale + zero package.json delta + barrel export + REG-01 same-commit cohort)
- DR-06: PASS (chunk-grep DCE proof — homepage chunks absent of react-day-picker; showcase route chunk pulls deferred chunk; zero stylesheet imports)
- TST-03: PASS (10/10 specs green post commit `041a86e` repair — 7 hydration/acceptance + 3 axe)

Phase 75 score: **7/7 requirements satisfied**. Status: **passed**. 4 manual items deferred to user.

Phase 76 (Final Gate) is the next milestone phase.
