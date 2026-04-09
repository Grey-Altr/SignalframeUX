---
phase: 34-visual-language-subpage-redesign
generated: "2026-04-08T00:00:00Z"
finding_count: 4
high_count: 2
has_bdd_candidates: true
---

# Phase 34: Edge Cases

**Generated:** 2026-04-08
**Findings:** 4 (cap: 8)
**HIGH severity:** 2
**BDD candidates:** yes

## Findings

### 1. [HIGH] NavRevealMount race condition: querySelector returns null on first paint for client islands rendered before target element mounts

**Plan element:** `components/layout/nav-reveal-mount.tsx`
**Category:** error_path

`NavRevealMount` uses `useEffect(() => { triggerRef.current = document.querySelector(...) })` to populate the trigger ref. If the mount island renders BEFORE the target element (e.g. because the JSX places `<NavRevealMount />` before the `<header data-nav-reveal-trigger>` in document order), the querySelector still works because `useEffect` runs after the entire tree mounts. However, if a future refactor moves the mount into a Suspense boundary that hydrates before the header, `triggerRef.current` will be null, and the hook will fall through to the safety fallback (`navVisible="true"` immediately) — defeating the locked CONTEXT.md SP-05 contract. The plans correctly place the mount inside `<main>` (after Breadcrumb), but no test asserts the mount sequencing requirement.

**BDD Acceptance Criteria Candidate:**
```
Given a subpage with <NavRevealMount targetSelector="[data-nav-reveal-trigger]" /> and a <header data-nav-reveal-trigger> in the same <main>
When the page hydrates fully (DOMContentLoaded fires)
Then document.body.dataset.navVisible equals "false" within 500ms (proving the hook resolved the real header element, not the safety fallback)
```

### 2. [HIGH] Reduced-motion users on subpages: nav appears immediately, but the subpage h1 is the LCP element — no scroll trigger means nav overlap can hide the h1 on small viewports

**Plan element:** `hooks/use-nav-reveal.ts` reduced-motion branch + subpage `<header data-nav-reveal-trigger>`
**Category:** boundary_condition

The hook's reduced-motion branch sets `body[data-nav-visible="true"]` immediately on mount. The subpage h1 is rendered at `clamp(80px, 12vw, 160px)` and the nav has fixed positioning. On a 375×667 mobile viewport, an immediately-visible nav can overlap the top of the h1 if the page uses `mt-[var(--nav-height)]` but the nav becomes visible at runtime via opacity (not by inserting layout). The plans test reduced-motion `body[data-nav-visible="true"]` but do NOT test that the h1 LCP element remains fully visible at 375px in reduced-motion mode.

**BDD Acceptance Criteria Candidate:**
```
Given a user with prefers-reduced-motion: reduce on /system at 375x667 viewport
When the page completes initial paint
Then the page h1 ("TOKEN / EXPLORER") bounding box top is greater than or equal to the nav element bounding box bottom (no overlap)
```

### 3. [MEDIUM] Wave 0 RED-state verify: `! npx playwright test ...` exits 0 if the test file is empty or syntactically broken (no tests run = "no failures = exit 0")

**Plan element:** `34-01-PLAN.md` Task 0 verify block (`<automated>npx playwright test ... --list | grep -c "Phase 34" && ! npx playwright test ...</automated>`)
**Category:** error_path

The verify chain depends on `! npx playwright test --reporter=line` succeeding when tests fail. However, `npx playwright test` exits 0 when no tests are matched OR when all tests pass. The preceding `--list | grep -c "Phase 34"` partially mitigates this (it requires at least one test in the file), but `grep -c` returns the count and `&&` only checks for non-zero exit (which `grep -c` returns when matches are found). If the file has tests that all PASS against the current tree (e.g. a test that asserts something already true), `! npx playwright test` returns false and the verify fails — which is correct behavior. The risk is the inverse: if a developer adds `test.skip(...)` or no-op assertions, RED state is faked. The boundary_check is partially covered by Task 0's <done> requirement ("Zero `test.skip` / `test.fixme` in the file") but no automated grep enforces it.

### 4. [MEDIUM] Magenta audit Task 5 boundary: 5 files audited, 1 file (`app/system/page.tsx`) excluded with note "1 — page-level gradient — keep, load-bearing", but no test asserts the gradient remains intact

**Plan element:** `34-01-PLAN.md` Task 5 magenta audit
**Category:** boundary_condition

Task 5 audits 5 target files (`token-tabs`, `api-explorer`, `code-section`, `components-explorer`, `app/init/page.tsx`) and excludes `app/system/page.tsx` because its single magenta use is the load-bearing page-level gradient. However, no test asserts the gradient is still present after the visual language pass. If a downstream task accidentally removes it (e.g. during Task 4 Part B's GhostLabel + h1 bump in `app/system/page.tsx`), the regression is silent.
