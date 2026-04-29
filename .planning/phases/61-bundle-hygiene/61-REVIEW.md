---
phase: 61-bundle-hygiene
reviewed: 2026-04-26T00:00:00Z
depth: standard
files_reviewed: 2
files_reviewed_list:
  - next.config.ts
  - tests/v1.8-phase61-bundle-hygiene.spec.ts
findings:
  critical: 0
  warning: 0
  info: 3
  total: 3
status: issues_found
---

# Phase 61: Code Review Report

**Reviewed:** 2026-04-26
**Depth:** standard
**Files Reviewed:** 2
**Status:** issues_found (info-only — no blocking issues)

## Summary

Both files are correct, type-safe, and faithful to the Phase 61 plan + validation contract. The `optimizePackageImports` array exactly matches the Plan 02 end-state (7 entries, ordered eager-then-lazy, `radix-ui` meta-package form, `date-fns` correctly skipped). The pixel-diff spec is a clean clone of `tests/v1.8-phase59-pixel-diff.spec.ts` with `MAX_DIFF_RATIO = 0` per the strict invisible-by-construction gate. Baseline directory and all 20 PNGs (5 routes x 4 viewports) exist on disk.

No critical or warning issues found. Three info-level observations are documented below for trace-through context; none block the Phase 61 final gate.

### Verifications passed

- `optimizePackageImports` array: 7 entries, no duplicates, no typos, correct order — matches Plan 02 §interfaces target verbatim.
- All 7 packages are present in `package.json` `dependencies` at the expected semver ranges (`lucide-react ^0.488.0`, `radix-ui ^1.4.3`, `input-otp ^1.4.2`, `cmdk ^1.1.1`, `vaul ^1.1.2`, `sonner ^2.0.7`, `react-day-picker ^9.14.0`).
- `date-fns` correctly omitted (BND-02 SKIP decision honored — already in Next.js 15 default-optimized list per 61-RESEARCH §1).
- Meta-package `radix-ui` form is correct: 29 files in `components/` import from `"radix-ui"`, zero from `"@radix-ui/react-*"`. The forbidden scoped-package substring is absent from `next.config.ts`.
- `useCache: true` and the `redirects()` block preserved verbatim per Plan 01 §interfaces.
- `NextConfig` type import + `withBundleAnalyzer` HOF wrapping is type-safe and idiomatic.
- Pixel-diff spec: `ROUTES` (5) x `VIEWPORTS` (4) = 20 tests = full coverage of the v1.8-start baseline set. All 20 baseline PNGs verified present at `.planning/visual-baselines/v1.8-start/{slug}-{viewport}.png`.
- `MAX_DIFF_RATIO === 0` matches VALIDATION.md task `61-03-00` Wave 0 requirement and the failure message string ("Phase 61 strict 0% gate").
- Server-lifecycle assumption is correct: `playwright.config.ts` only auto-starts production server under `CI=true` (`pnpm build && pnpm start`); the spec's docblock explicitly mandates this and warns against `pnpm dev`.
- Warmup discipline (Anton font preload, `nextjs-portal` count === 0 hard gate, reduced-motion emulation, `animations: "disabled"`, dimension assertion before pixelmatch) is identical to Phase 57 baseline-capture and Phase 59 pixel-diff specs — reproducibility preserved.
- No emojis, no rounded-corner CSS in either file. Naming conventions adhere to project style (`SCREAMING_SNAKE_CASE` for module-level constants, kebab-case route slugs, dash-prefixed viewport names matching baseline filenames).
- TypeScript: `as const` assertions on `ROUTES` and `VIEWPORTS` preserve literal types, `Promise<PNG>` return type explicit on `readPng`, no `any` casts.

## Info

### IN-01: Per-pixel `threshold: 0.1` is non-zero while ratio gate is strict-zero

**File:** `tests/v1.8-phase61-bundle-hygiene.spec.ts:75`
**Issue:** `pixelmatch` is invoked with `{ threshold: 0.1 }` (per-pixel YIQ tolerance — pixels with delta ≤ 0.1 are NOT counted as differing), while the test's overall gate is `MAX_DIFF_RATIO = 0` (zero pixels may differ). The combination means: a pixel must differ by more than the 0.1 YIQ threshold to count, AND once any single pixel exceeds that threshold the test fails. This is identical to the Phase 59 spec it was cloned from, so the behavior is a deliberate inheritance — but the docblock claims "Any non-zero pixel diff is a regression" which strictly speaking is per-pixel post-threshold, not per-pixel pre-threshold. For Phase 61's invisible-by-construction promise this is the correct posture (sub-threshold antialiasing flicker should not fail the gate, true rendering changes should), but the comment could be sharpened.
**Fix:** Optional. Either (a) drop the per-pixel threshold to `0` to match the docblock's "any non-zero pixel diff" claim literally, or (b) tighten the docblock to: "Any pixel exceeding pixelmatch's default-tolerance threshold (0.1) is a regression — sub-threshold antialiasing flicker is permitted." Recommend (b) — tightening the comment — to preserve cross-spec consistency with Phase 59.

### IN-02: `await page.evaluate(() => document.fonts.ready)` returns a Promise but `evaluate` does not chain it

**File:** `tests/v1.8-phase61-bundle-hygiene.spec.ts:54`
**Issue:** `document.fonts.ready` is itself a `Promise<FontFaceSet>`. Returning a Promise from `page.evaluate` causes Playwright to await it serialization-side, but the returned value is non-serializable (`FontFaceSet` is not structured-clonable). In practice Playwright handles this gracefully (the await resolves to `undefined` for non-clonable returns) and the wait still happens because Playwright awaits the inner Promise before serializing. This is identical behavior to Phase 57/59/60 specs and is well-tested in this codebase. Worth noting for trace-through reviewers only.
**Fix:** Optional. To make the intent unambiguous: `await page.evaluate(async () => { await document.fonts.ready; })`. Not required — the current pattern is consistent with all other v1.8 specs and proven to work.

### IN-03: `path.resolve(process.cwd(), ...)` is identical across three sibling specs

**File:** `tests/v1.8-phase61-bundle-hygiene.spec.ts:38, 82`
**Issue:** Three v1.8 pixel-diff specs (Phase 58, 59, 61) duplicate the `BASELINE_DIR` resolution and the `.playwright-artifacts/{phase}-...` output dir pattern. This is intentional (each phase pins its own MAX_DIFF_RATIO + artifact subdir) and the duplication is small enough to not warrant a shared helper. Flagging only because if a fourth pixel-diff spec lands in v1.9, a `lib/test-helpers/baseline-diff.ts` extraction may become worthwhile to avoid drift in the warmup discipline.
**Fix:** No action for v1.8. Track for v1.9 cleanup if the pattern reaches 4+ specs.

---

_Reviewed: 2026-04-26_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
