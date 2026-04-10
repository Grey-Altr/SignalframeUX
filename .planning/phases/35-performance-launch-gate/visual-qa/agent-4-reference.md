# Agent 4 — reference — Wave 1 Findings

**Date:** 2026-04-10T16:50:00Z
**Spec file:** `tests/phase-35-reference.spec.ts`
**Commit:** e0a1ce1 (35-02 route spec files)
**Run mode:** dev server not running — ERR_CONNECTION_REFUSED for runtime tests

## Summary

| Metric | Value |
|--------|-------|
| Tests passed | 0 |
| Tests failed | 17 |
| Tests skipped | 0 |
| BLOCK count | 1 |
| FLAG count | 4 |

Note: All failures are ERR_CONNECTION_REFUSED plus one source-read failure. The source-read test `schematic register: font-mono applied to category headings` fails because `app/reference/page.tsx` does not directly contain `font-mono` — the class lives in `components/blocks/api-explorer.tsx` (confirmed by grep). The test assertion needs to target the correct source file in Wave 3.

## Findings

| Test | Status | Severity | Notes |
|------|--------|----------|-------|
| EDGE-2: reduced-motion h1 does not overlap nav at 375x667 | FAIL | BLOCK | ERR_CONNECTION_REFUSED — Wave 0 test preserved verbatim |
| nav-reveal: hidden on load (desktop) | FAIL | FLAG | ERR_CONNECTION_REFUSED |
| nav-reveal: hidden on load (tablet) | FAIL | FLAG | ERR_CONNECTION_REFUSED |
| nav-reveal: hidden on load (mobile) | FAIL | FLAG | ERR_CONNECTION_REFUSED |
| InstrumentHUD: [REF//API] (desktop) | FAIL | FLAG | ERR_CONNECTION_REFUSED |
| InstrumentHUD: [REF//API] (tablet) | FAIL | FLAG | ERR_CONNECTION_REFUSED |
| InstrumentHUD: [REF//API] (mobile) | FAIL | FLAG | ERR_CONNECTION_REFUSED |
| schematic register: font-mono on category headings (desktop) | FAIL | FLAG | Source-read failure — font-mono is in components/blocks/api-explorer.tsx, not app/reference/page.tsx; test file path needs updating in Wave 3 |
| schematic register: font-mono on category headings (tablet) | FAIL | FLAG | Same source path issue |
| schematic register: font-mono on category headings (mobile) | FAIL | FLAG | Same source path issue |
| schematic register: API content rows (desktop) | FAIL | FLAG | ERR_CONNECTION_REFUSED |
| schematic register: API content rows (tablet) | FAIL | FLAG | ERR_CONNECTION_REFUSED |
| schematic register: API content rows (mobile) | FAIL | FLAG | ERR_CONNECTION_REFUSED |
| LR-04: reduced-motion nav-visible=true first paint | FAIL | FLAG | ERR_CONNECTION_REFUSED |

## Wave 3 Triage Candidates

- **[BLOCK]** EDGE-2 Gap 2: h1/nav overlap at 375x667 reducedMotion on /reference — `tests/phase-35-reference.spec.ts:15`
- **[FLAG]** schematic register font-mono: fix source path to read `components/blocks/api-explorer.tsx` instead of `app/reference/page.tsx` — confirmed `font-mono` exists in api-explorer.tsx line 166 — `tests/phase-35-reference.spec.ts:61`
- **[FLAG]** schematic register row count: runtime DOM check; requires live server — `tests/phase-35-reference.spec.ts:69`
- **[FLAG]** LR-04 reduced-motion first-paint /reference: runtime check — `tests/phase-35-reference.spec.ts:85`
