---
phase: 66-scalecanvas-track-b-architectural-decision
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - .planning/codebase/scale-canvas-track-b-decision.md
  - tests/v1.9-phase66-decision-doc.spec.ts
  - tests/v1.9-phase66-aes04-diff.spec.ts
  - .planning/visual-baselines/v1.9-pre/
autonomous: true
requirements:
  - ARC-01
  - ARC-02
must_haves:
  truths:
    - "scale-canvas-track-b-decision.md exists at .planning/codebase/ with mechanism=Pillarbox + 6-pillar audit + file:line evidence for every claim about current ScaleCanvas behavior."
    - ".planning/visual-baselines/v1.9-pre/ holds 20 PNGs (5 routes × 4 viewports) captured BEFORE any source mutation — the AES-03 mobile cohort reference."
    - "tests/v1.9-phase66-decision-doc.spec.ts asserts mechanism + 6-pillar + file:line evidence presence (schema test) on every PR."
    - "tests/v1.9-phase66-aes04-diff.spec.ts harness exists with --grep strict (desktop+tablet vs v1.8-start/) and --grep cohort (mobile+iphone13 vs v1.9-pre/)."
  artifacts:
    - path: ".planning/codebase/scale-canvas-track-b-decision.md"
      provides: "ARC-01 decision-doc — mirrors v1.8-lcp-diagnosis.md shape; 6-pillar audit table + alternative rejections + verification surface."
      contains: "## Mechanism Selected: Pillarbox"
      min_lines: 200
    - path: "tests/v1.9-phase66-decision-doc.spec.ts"
      provides: "Schema gate — asserts decision-doc exists with mechanism heading + 6-pillar table + scale-canvas.tsx:42-83 file:line citation."
    - path: "tests/v1.9-phase66-aes04-diff.spec.ts"
      provides: "Pixel-diff harness with strict/cohort grep partition (desktop+tablet vs v1.8-start, mobile+iphone13 vs v1.9-pre)."
    - path: ".planning/visual-baselines/v1.9-pre/"
      provides: "20-PNG mobile cohort reference baseline for AES-03 review."
      contains: "home-mobile-360x800.png"
  key_links:
    - from: "tests/v1.9-phase66-aes04-diff.spec.ts"
      to: ".planning/visual-baselines/v1.9-pre/"
      via: "fs.readFile in --grep cohort branch"
      pattern: "v1.9-pre"
    - from: "tests/v1.9-phase66-decision-doc.spec.ts"
      to: ".planning/codebase/scale-canvas-track-b-decision.md"
      via: "fs.readFile + content schema regex"
      pattern: "Mechanism Selected: Pillarbox"
---

<threat_model>
**ASVS L1 default — block on `high`.**

- **T-66-01 (LOW):** Decision-doc tampering — adversary edits `scale-canvas-track-b-decision.md` post-merge to claim a different mechanism, dissolving the audit trail that constrains Plan 02's implementation choice.
  - **Mitigation:** Schema test in `tests/v1.9-phase66-decision-doc.spec.ts` asserts `## Mechanism Selected: Pillarbox` + `## 6-Pillar Visual Audit` + file:line citation for `components/layout/scale-canvas.tsx:42-83`. Test runs on every PR via existing chromium project. Branch protection ruleset (Phase 64) requires PR review before merge. Commit signing in effect.
  - **Severity:** LOW — capture-only plan; no source mutation; tampering surfaces immediately on next PR.
</threat_model>

<objective>
Capture the ARC-01 decision artifact + AES-03 mobile cohort reference baseline BEFORE any source mutation. This plan is BLOCKING for Plans 02 + 03 — the decision-doc constrains what Plan 02 builds, and the v1.9-pre/ baseline IS the mid-phase mobile cohort reference. If Plan 02 ships before this baseline lands, AES-03 cohort review is signal-less (compares pillarbox-state-A to pillarbox-state-A).

Purpose: Encode the ScaleCanvas Track B mechanism choice (pillarbox per RESEARCH §3d) as a committed artifact with file:line evidence + 6-pillar audit, so Plan 02 implements against a fixed contract rather than re-deriving it. Capture v1.9-pre/ baseline so Plan 02's mobile change has a comparison surface.

Output:
- `.planning/codebase/scale-canvas-track-b-decision.md` — ARC-01 deliverable
- `.planning/visual-baselines/v1.9-pre/` — 20 PNGs, 5 routes × 4 viewports
- `tests/v1.9-phase66-decision-doc.spec.ts` — schema gate for ARC-01
- `tests/v1.9-phase66-aes04-diff.spec.ts` — harness for Plan 03 strict + cohort

Risk: LOW — capture-only, no source mutation. Pillarbox mechanism choice is RESEARCH-locked at HIGH confidence per §3d.
</objective>

<execution_context>
@/Users/greyaltaer/.claude/pde-os/engines/gsd/workflows/execute-plan.md
@/Users/greyaltaer/.claude/pde-os/engines/gsd/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@.planning/ROADMAP.md
@.planning/REQUIREMENTS.md
@.planning/phases/66-scalecanvas-track-b-architectural-decision/66-RESEARCH.md
@.planning/phases/66-scalecanvas-track-b-architectural-decision/66-VALIDATION.md
@.planning/codebase/AESTHETIC-OF-RECORD.md
@.planning/codebase/v1.8-lcp-diagnosis.md
@components/layout/scale-canvas.tsx
@app/layout.tsx
@app/globals.css
@.lighthouseci/lighthouserc.json
@.lighthouseci/lighthouserc.desktop.json
@tests/v1.8-baseline-capture.spec.ts
@tests/v1.8-phase60-aes04-diff.spec.ts
@tests/v1.8-phase63-1-bundle-budget.spec.ts

<interfaces>
<!-- Key contracts the executor needs. Extracted from codebase. -->

From `components/layout/scale-canvas.tsx:6-15` (constants):
```typescript
const DESIGN_WIDTH = 1280;
const DESIGN_HEIGHT = 800;
const NAV_MORPH_VH_IDLE = 800;
const NAV_MORPH_VH_FLOOR = 435;
const SHRINK_VH = 435;
```

From `components/layout/scale-canvas.tsx:42-83` (applyScale current body — what Plan 02 will branch):
```typescript
const applyScale = () => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const contentScale = vw / DESIGN_WIDTH;
  const heightScale = Math.min(1, vh / SHRINK_VH);
  const chromeScale = Math.min(contentScale, heightScale);
  const navScale = heightScale;
  const navMorph = Math.max(0, Math.min(1, (NAV_MORPH_VH_IDLE - vh) / (NAV_MORPH_VH_IDLE - NAV_MORPH_VH_FLOOR)));
  outer.style.height = `${inner.offsetHeight * contentScale}px`;
  // ... writes 7 CSS custom properties to documentElement.style
};
```

From `app/layout.tsx:117` (scaleScript pre-hydration IIFE — what Plan 02 will branch):
```javascript
const scaleScript = `(function(){try{var vw=window.innerWidth,vh=window.innerHeight,DW=1280,SHRINK=435,IDLE=800;var s=vw/DW,hs=Math.min(1,vh/SHRINK),cs=Math.min(s,hs),ns=hs;var m=Math.max(0,Math.min(1,(IDLE-vh)/(IDLE-SHRINK)));...})()`;
```

From `app/layout.tsx:128` (canvasSyncScript body-tail IIFE — verify Plan 02 needs identity branch):
```javascript
const canvasSyncScript = `(function(){try{var i=document.querySelector('[data-sf-canvas]');if(!i)return;var o=i.parentElement;if(!o)return;var s=window.innerWidth/1280;o.style.height=(i.offsetHeight*s)+'px';}catch(e){}})()`;
```

From `app/globals.css:2770-2774` (the actual transform application — what Plan 02 wraps in @media):
```css
[data-sf-canvas] {
  transform: scale(var(--sf-content-scale, 1));
  transform-origin: top left;
  will-change: transform;
}
```

From `app/globals.css:316-325` (Scale Canvas tokens — `--sf-vw` is constant 12.8px, NOT viewport-derived):
```css
--sf-canvas-h: 800px;
--sf-vw: 12.8px;
--sf-vh: 8px;
```

From `tests/v1.8-baseline-capture.spec.ts` (canonical baseline-capture pattern Plan 01 must mirror):
- 5 routes: `/`, `/system`, `/init`, `/inventory`, `/reference`
- 4 viewports: `desktop-1440x900`, `iphone13-390x844`, `ipad-834x1194`, `mobile-360x800`
- `page.emulateMedia({ reducedMotion: "reduce" })` + `document.fonts.load('700 100px "Anton"')` + `fonts.ready` + 100ms sleep + nextjs-portal count===0 hard gate.
- Output: `${BASELINE_DIR}/${slug}-${name}.png` via `page.screenshot({ fullPage: true, caret: "hide", animations: "disabled" })`.

From `tests/v1.8-phase60-aes04-diff.spec.ts` (canonical pixel-diff pattern Plan 01 + Plan 03 mirror):
- Same routes/viewports as baseline-capture.
- pixelmatch threshold 0.1 → diffPx → diffPct = (diffPx/totalPx)*100 → assert ≤0.5.
- POST_DIR transient capture, BASELINE_DIR is committed reference.
</interfaces>
</context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Author tests/v1.9-phase66-decision-doc.spec.ts (schema gate, RED first)</name>
  <files>tests/v1.9-phase66-decision-doc.spec.ts</files>
  <read_first>
    - tests/v1.8-phase63-1-bundle-budget.spec.ts (lines 1-80) — pattern for fs-based schema test with header `_path_X_decision`-style block
    - .planning/phases/66-scalecanvas-track-b-architectural-decision/66-RESEARCH.md (§3d Recommendation: Pillarbox + ARC-04 pseudo-element suppression, lines 181-196)
    - .planning/phases/66-scalecanvas-track-b-architectural-decision/66-VALIDATION.md (Per-Task Verification Map row `66-01-*`)
  </read_first>
  <behavior>
    - Test 1: file `.planning/codebase/scale-canvas-track-b-decision.md` exists and is non-empty (>1024 bytes).
    - Test 2: contents include the literal string `## Mechanism Selected: Pillarbox` (asserts ARC-01 mechanism choice locked).
    - Test 3: contents include the literal string `## 6-Pillar Visual Audit` (asserts CRT-style critique convention).
    - Test 4: contents include the literal string `components/layout/scale-canvas.tsx:42-83` (asserts file:line evidence for the load-bearing primitive applyScale function).
    - Test 5: contents include the literal string `app/globals.css:2770-2774` OR `app/globals.css:2770-2774` (asserts transform rule citation).
    - Test 6: contents include the literal string `app/layout.tsx:117` (asserts pre-hydration scaleScript citation).
    - Test 7: contents include `## Counter-scale (Rejected)` AND `## Portal (Rejected)` headings — proves the alternatives were considered + rejected per RESEARCH §3b/§3c.
  </behavior>
  <action>
    Create `tests/v1.9-phase66-decision-doc.spec.ts` mirroring the `tests/v1.8-phase63-1-bundle-budget.spec.ts` pattern. Use Playwright's `test()` runner so it runs in the existing chromium project. Do NOT use Vitest — the rest of the v1.9-phase66 spec set is Playwright (per VALIDATION.md). Skeleton:

    ```typescript
    import { test, expect } from "@playwright/test";
    import { readFileSync, existsSync, statSync } from "node:fs";
    import { join } from "node:path";

    const DOC_PATH = join(process.cwd(), ".planning/codebase/scale-canvas-track-b-decision.md");

    test.describe("@v1.9-phase66 ARC-01 decision-doc schema gate", () => {
      test("decision-doc exists at .planning/codebase/", () => {
        expect(existsSync(DOC_PATH)).toBe(true);
        expect(statSync(DOC_PATH).size).toBeGreaterThan(1024);
      });

      test("decision-doc declares mechanism = Pillarbox", () => {
        const contents = readFileSync(DOC_PATH, "utf-8");
        expect(contents).toContain("## Mechanism Selected: Pillarbox");
      });

      test("decision-doc contains 6-Pillar Visual Audit section", () => {
        const contents = readFileSync(DOC_PATH, "utf-8");
        expect(contents).toContain("## 6-Pillar Visual Audit");
      });

      test("decision-doc cites scale-canvas.tsx applyScale file:line", () => {
        const contents = readFileSync(DOC_PATH, "utf-8");
        expect(contents).toContain("components/layout/scale-canvas.tsx:42-83");
      });

      test("decision-doc cites globals.css transform rule file:line", () => {
        const contents = readFileSync(DOC_PATH, "utf-8");
        expect(contents).toContain("app/globals.css:2770-2774");
      });

      test("decision-doc cites layout.tsx scaleScript file:line", () => {
        const contents = readFileSync(DOC_PATH, "utf-8");
        expect(contents).toContain("app/layout.tsx:117");
      });

      test("decision-doc rejects counter-scale + portal alternatives", () => {
        const contents = readFileSync(DOC_PATH, "utf-8");
        expect(contents).toMatch(/##\s+Counter-scale.*Rejected/i);
        expect(contents).toMatch(/##\s+Portal.*Rejected/i);
      });
    });
    ```

    RUN ONCE before authoring the doc to confirm it RED-fails (file does not exist). Commit the failing test before Task 2.
  </action>
  <verify>
    <automated>pnpm exec playwright test tests/v1.9-phase66-decision-doc.spec.ts --project=chromium</automated>
  </verify>
  <acceptance_criteria>
    - File `tests/v1.9-phase66-decision-doc.spec.ts` exists.
    - File contains the literal `@v1.9-phase66 ARC-01 decision-doc schema gate` describe-block name.
    - First run (before Task 2) reports 7 FAIL — `existsSync(DOC_PATH)` returns false.
    - File compiles under tsc strict mode (no `any`, no unused imports).
  </acceptance_criteria>
  <done>RED test committed; Task 2 will GREEN it by authoring the doc.</done>
</task>

<task type="auto">
  <name>Task 2: Author .planning/codebase/scale-canvas-track-b-decision.md (ARC-01 deliverable, GREEN the schema gate)</name>
  <files>.planning/codebase/scale-canvas-track-b-decision.md</files>
  <read_first>
    - .planning/codebase/v1.8-lcp-diagnosis.md (lines 1-80) — precedent format: header block + numbered sections + file:line evidence + table-driven findings
    - .planning/phases/66-scalecanvas-track-b-architectural-decision/66-RESEARCH.md (entire — every claim in the doc must trace back to RESEARCH evidence; specifically §3 mechanism comparison matrix, §4 current ScaleCanvas behavior, §5 pillarbox specifics, §9 verification surface)
    - components/layout/scale-canvas.tsx (full file, esp. lines 42-83 applyScale)
    - app/globals.css lines 2770-2774 (transform rule) + 2784-2809 (height remap)
    - app/layout.tsx lines 110-128 (scaleScript + canvasSyncScript)
    - .planning/codebase/AESTHETIC-OF-RECORD.md (§2 standing rules; doc MUST NOT contradict)
    - .lighthouseci/lighthouserc.json lines 2-16 (_path_h_decision rationale + review_gate — the canonical close path naming pillarbox)
    - .lighthouseci/lighthouserc.desktop.json lines 2-17 (_path_i_decision rationale + review_gate)
  </read_first>
  <action>
    Create `.planning/codebase/scale-canvas-track-b-decision.md` mirroring the `v1.8-lcp-diagnosis.md` shape. Required structure (literal section headings — Task 1's tests assert these):

    ```markdown
    # ScaleCanvas Track B — Architectural Decision

    > Phase 66 ARC-01 deliverable. Closes path_h (mobile a11y target-size) + path_i (GhostLabel color-contrast) at architectural root.
    > NOT a re-derivation. Every claim cites shipped code.

    **Decided:** 2026-04-29
    **Phase:** 66
    **Risk:** HIGH — load-bearing primitive change
    **Verification surface:** tests/v1.9-phase66-{arc-axe,aes04-diff,pillarbox-transform,lcp-stability,lhci-config}.spec.ts + LHCI prod (mobile + desktop)

    ## Mechanism Selected: Pillarbox

    **Definition:** Below `sm` breakpoint (640px), ScaleCanvas applies `transform: none` (or equivalently `--sf-content-scale = 1`); the canvas renders at native pixel sizes instead of `transform: scale(0.39)`. Above `sm`, behavior unchanged from v1.8.

    **Rationale (citing _path_h_decision review_gate at .lighthouseci/lighthouserc.json:14):**
    The v1.8 ratification block explicitly names this as the canonical close path: *"Tighten back to 0.97 when (a) ScaleCanvas adds a mobile breakpoint exception (e.g., < sm: native layout, no transform)"*. Pillarbox is the most direct fulfillment of v1.8's review_gate.

    ## Current ScaleCanvas Behavior — File:Line Evidence

    ### Where transform is applied
    - `components/layout/scale-canvas.tsx:42-83` — applyScale() body. Line 47: `contentScale = vw / DESIGN_WIDTH` (1280). Lines 75-77: writes --sf-canvas-scale, --sf-content-scale, --sf-nav-scale to documentElement.
    - `app/globals.css:2770-2774` — the `[data-sf-canvas] { transform: scale(var(--sf-content-scale, 1)); }` rule that consumes the var.
    - `app/layout.tsx:117` — pre-hydration `scaleScript` IIFE that mirrors applyScale() at HTML parse time (CLS=0 contract).
    - `app/layout.tsx:128` — body-tail `canvasSyncScript` IIFE that sets outer parent height = `inner.offsetHeight * (vw/1280)` (CRT-01 Phase 59 dependency).

    ### Why axe-core fails post-transform
    Mobile 360px → `--sf-content-scale = 360/1280 = 0.28125`. axe-core target-size + color-contrast both read `getBoundingClientRect()` post-transform. 24px native footer link → 6.75px to axe (FAIL AA). 4% opacity GhostLabel still measured visible to axe-core's color-contrast rule despite `aria-hidden="true"` (Lighthouse-bundled axe quirk per `tests/phase-38-a11y.spec.ts:34-37` comment).

    ## 6-Pillar Visual Audit

    Per CRT-style critique convention (`feedback_aesthetic_direction`). Verdict: **PASS** for desktop+tablet (above breakpoint, identical-by-construction); mobile cohort REVIEW required (deliberate native-mode flip is "feels different" by design).

    | Pillar | Above sm (desktop+tablet) | Below sm (mobile cohort) | Verdict |
    |--------|---------------------------|--------------------------|---------|
    | Structure | Section composition unchanged | Sections fill native viewport (h-screen rule collapses to 100vh when scale=1) | PASS / cohort |
    | Hierarchy | Heading + GhostLabel weight unchanged | GhostLabel renders at native 200-400px (clamp floor); dominates mobile | PASS / cohort (deliberate) |
    | Contrast | OKLCH slot semantics unchanged | Identical (no color changes in scope) | PASS |
    | Spacing | Blessed 9 stops resolve via `--sf-vw=12.8px` constant | Identical — `--sf-vw` is CSS constant, not viewport-derived | PASS |
    | Alignment | Section grid intact | Native-mode grid; cohort review of clamp() floor saturation | PASS / cohort |
    | Motion | GSAP timelines + Lenis untouched (PF-04 contract preserved) | Identical | PASS |

    ## Counter-scale (Rejected)

    Per RESEARCH §3b: tablet AES-04 fails by construction. Counter-scale = `1/0.65 ≈ 1.54` on iPad portrait → a11y descendants 54% larger than siblings, breaking design integrity. Mobile counter-scale = `1/0.281 ≈ 3.55` → footer links balloon, GhostLabel ~710px full-bleed, defeats wayfinding contract. Brittle to nested transforms (GSAP composes multiplicatively). Doesn't address path_i (opacity preserved). NON-VIABLE.

    ## Portal (Rejected)

    Per RESEARCH §3c: hydration concern is CRITICAL. `React.createPortal` is client-only; portaling GhostLabel removes it from SSR HTML stream → mobile LCP candidate (currently GhostLabel per `v1.8-lcp-diagnosis.md`) shifts to delayed/different element. Re-introduces CLS risk if portal mounts visibly post-hydration. Sync layer overhead (ResizeObserver per element × 8 elements). VIABLE BUT OPERATIONALLY HEAVIER than pillarbox; reserved as fallback only if pillarbox cohort review fails.

    ## ARC-04 Suppression Mechanism: CSS Pseudo-Element

    Per RESEARCH §8: GhostLabel renders text via `::before { content: attr(data-ghost-text); }`. axe-core 4.x explicitly excludes pseudo-element content from color-contrast rule (per [Deque docs](https://dequeuniversity.com/rules/axe/4.10/color-contrast); pseudo-content is "not in the accessibility tree"). Visual identical; opacity preserved. Plan 02 Wave 0 verifies mobile LCP candidate post-suppression remains stable above-fold SSR-paintable element (per `feedback_lcp_observer_content_visibility.md` quirk).

    ## AES-04 Risk Assessment

    | Surface | Pre-mutation state | Post-mutation expected | Gate |
    |---------|---------------------|--------------------------|------|
    | Desktop 1440×900 | scale ≈ 1.125, transform applied | scale ≈ 1.125 (vw≥640), transform applied | AES-04 strict ≤0.5% vs v1.8-start/ |
    | iPad 834×1194 | scale ≈ 0.65, transform applied | scale ≈ 0.65 (vw≥640), transform applied | AES-04 strict ≤0.5% vs v1.8-start/ |
    | iPhone 13 390×844 | scale ≈ 0.305, transform applied | scale=1, transform=none, native sizes | AES-03 cohort vs v1.9-pre/ |
    | Mobile 360×800 | scale ≈ 0.281, transform applied | scale=1, transform=none, native sizes | AES-03 cohort vs v1.9-pre/ |

    ## Verification Surface

    1. `tests/v1.9-phase66-pillarbox-transform.spec.ts` — at vw<640 assert `[data-sf-canvas]` computed transform = identity matrix.
    2. `tests/v1.9-phase66-arc-axe.spec.ts` — direct axe target-size (mobile) + color-contrast (desktop) — violations[]=0.
    3. `tests/v1.9-phase66-aes04-diff.spec.ts` --grep strict — desktop+tablet pixel-diff vs v1.8-start ≤0.5%.
    4. `tests/v1.9-phase66-aes04-diff.spec.ts` --grep cohort — mobile+iphone13 capture vs v1.9-pre (manual review).
    5. `tests/v1.9-phase66-lhci-config.spec.ts` — _path_h_decision + _path_i_decision blocks absent.
    6. `tests/v1.9-phase66-lcp-stability.spec.ts` — mobile LCP candidate post-suppression is stable SSR-paintable above-fold (NOT 0×0 bounding rect element per `feedback_chrome_lcp_text_in_defs_quirk`).
    7. LHCI prod mobile + desktop — categories:accessibility ≥0.97 on https://signalframe.culturedivision.com.

    ## Open Questions (Resolved Pre-Plan-02)

    1. **canvasSyncScript identity branch** — when scale=1 below sm, outer.height = `inner.offsetHeight * (window.innerWidth/1280)` becomes `inner.offsetHeight * (vw/1280)` which is < inner.offsetHeight. Plan 02 Task 2 verifies this collapses cleanly OR adds branch logic. Per RESEARCH §4b "These three are the ONLY scale writers" + Open Question 3.

    2. **LHCI desktop config location** — confirmed at `.lighthouseci/lighthouserc.desktop.json` (verified by file presence in `.lighthouseci/` directory listing). _path_i_decision block lives in this file at lines 2-17.

    3. **Mobile LCP candidate post-ARC-04** — Plan 02 Wave 0 task captures new candidate identity. If shifts to noise (0×0 rect, content-visibility:auto null entry.element), escalate to Option A (mask-image).

    ## Verification Verdicts (Updated by Plan 03)

    *Pending Plan 03 execution — this section is updated post-implementation with evidence + any deviations.*
    ```

    Doc must be ≥200 lines. Every section heading must match the literal strings asserted by Task 1's tests. Cite RESEARCH.md sections inline where rationale is borrowed.
  </action>
  <verify>
    <automated>pnpm exec playwright test tests/v1.9-phase66-decision-doc.spec.ts --project=chromium</automated>
  </verify>
  <acceptance_criteria>
    - `.planning/codebase/scale-canvas-track-b-decision.md` exists.
    - File ≥200 lines (`wc -l` ≥200).
    - File contains literal `## Mechanism Selected: Pillarbox`.
    - File contains literal `## 6-Pillar Visual Audit`.
    - File contains literal `components/layout/scale-canvas.tsx:42-83`.
    - File contains literal `app/globals.css:2770-2774`.
    - File contains literal `app/layout.tsx:117`.
    - File contains a `Counter-scale.*Rejected` heading and a `Portal.*Rejected` heading.
    - All 7 tests in `tests/v1.9-phase66-decision-doc.spec.ts` PASS green.
  </acceptance_criteria>
  <done>ARC-01 deliverable committed; schema gate green; Plan 02 has fixed mechanism contract.</done>
</task>

<task type="auto">
  <name>Task 3: Author tests/v1.9-phase66-aes04-diff.spec.ts (strict + cohort harness, no execution yet)</name>
  <files>tests/v1.9-phase66-aes04-diff.spec.ts</files>
  <read_first>
    - tests/v1.8-phase60-aes04-diff.spec.ts (full file — canonical pixel-diff harness pattern; copy structure verbatim)
    - .planning/phases/66-scalecanvas-track-b-architectural-decision/66-RESEARCH.md (§9c AES-04 pixel-diff strategy at lines 456-476 — defines VIEWPORTS_STRICT vs VIEWPORTS_COHORT_ONLY split)
    - .planning/phases/66-scalecanvas-track-b-architectural-decision/66-VALIDATION.md (rows `66-01-baseline`, `66-03-aes04-strict`)
  </read_first>
  <action>
    Create `tests/v1.9-phase66-aes04-diff.spec.ts` by copying `tests/v1.8-phase60-aes04-diff.spec.ts` shape and partitioning viewports into two groups via Playwright `test.describe()` blocks tagged with `@strict` and `@cohort` so `--grep` filters them.

    Concrete viewport split:
    ```typescript
    const VIEWPORTS_STRICT = [
      { name: "desktop-1440x900", width: 1440, height: 900 },
      { name: "ipad-834x1194", width: 834, height: 1194 },
    ] as const;

    const VIEWPORTS_COHORT = [
      { name: "iphone13-390x844", width: 390, height: 844 },
      { name: "mobile-360x800", width: 360, height: 800 },
    ] as const;
    ```

    Strict block compares against `.planning/visual-baselines/v1.8-start/` and asserts diffPct ≤0.5 (hard fail).
    Cohort block compares against `.planning/visual-baselines/v1.9-pre/` and writes diffPct to `.planning/phases/66-scalecanvas-track-b-architectural-decision/66-cohort-results.md` for human review (NO assertion that fails the test — capture-only).

    Use `test.describe("@v1.9-phase66-aes04 strict desktop+tablet", ...)` and `test.describe("@v1.9-phase66-aes04 cohort mobile+iphone13", ...)` so `--grep strict` and `--grep cohort` partition.

    POST_DIR transient capture: `.planning/phases/66-scalecanvas-track-b-architectural-decision/66-aes04-postcapture/`.
    Reduce-motion + warm Anton + nextjs-portal hard gate copied verbatim from phase60 spec.
    On dimension drift (base.width ≠ post.width OR base.height ≠ post.height), strict block throws (FAIL); cohort block records 100% in results doc and continues (capture-only).

    For Task 3 (this task), the v1.9-pre/ baseline does NOT yet exist — cohort tests will fail at fs.readFile until Task 4 runs. THAT IS EXPECTED. Cohort describe-block must `test.skip()` if `.planning/visual-baselines/v1.9-pre/` directory does not exist (use `existsSync` check at top of describe block) so the spec is committable RED-on-cohort but green-on-strict-once-baseline-comparison-runs.

    Skeleton:
    ```typescript
    import { test, expect } from "@playwright/test";
    import path from "node:path";
    import { promises as fs } from "node:fs";
    import { existsSync } from "node:fs";
    import { PNG } from "pngjs";
    import pixelmatch from "pixelmatch";

    const ROUTES = [
      { path: "/", slug: "home" },
      { path: "/system", slug: "system" },
      { path: "/init", slug: "init" },
      { path: "/inventory", slug: "inventory" },
      { path: "/reference", slug: "reference" },
    ] as const;

    const VIEWPORTS_STRICT = [...] as const;  // see above
    const VIEWPORTS_COHORT = [...] as const;  // see above

    const STRICT_BASELINE_DIR = path.resolve(process.cwd(), ".planning/visual-baselines/v1.8-start");
    const COHORT_BASELINE_DIR = path.resolve(process.cwd(), ".planning/visual-baselines/v1.9-pre");
    const POST_DIR = path.resolve(process.cwd(), ".planning/phases/66-scalecanvas-track-b-architectural-decision/66-aes04-postcapture");
    const COHORT_RESULTS = path.resolve(process.cwd(), ".planning/phases/66-scalecanvas-track-b-architectural-decision/66-cohort-results.md");

    async function captureAndDiff(page, route, vp, baselineDir) {
      // ... copy verbatim from phase60 spec lines 57-100, parameterize baselineDir
    }

    test.describe("@v1.9-phase66-aes04 strict desktop+tablet", () => {
      for (const route of ROUTES) {
        for (const vp of VIEWPORTS_STRICT) {
          test(`${route.slug} @ ${vp.name}`, async ({ page }) => {
            const diffPct = await captureAndDiff(page, route, vp, STRICT_BASELINE_DIR);
            expect(diffPct, `${route.slug}@${vp.name} pixel-diff ${diffPct.toFixed(3)}% > 0.5%`).toBeLessThanOrEqual(0.5);
          });
        }
      }
    });

    test.describe("@v1.9-phase66-aes04 cohort mobile+iphone13", () => {
      test.skip(!existsSync(COHORT_BASELINE_DIR), "v1.9-pre/ baseline not yet captured (run Task 4 first)");
      // capture-only: write diffPct to results doc, do not fail test on diffPct
      ...
    });
    ```

    File compiles under tsc strict; no `any`; reuses pngjs + pixelmatch already in devDeps.
  </action>
  <verify>
    <automated>pnpm exec playwright test tests/v1.9-phase66-aes04-diff.spec.ts --list --project=chromium</automated>
  </verify>
  <acceptance_criteria>
    - File `tests/v1.9-phase66-aes04-diff.spec.ts` exists.
    - File contains literal `@v1.9-phase66-aes04 strict desktop+tablet` describe-block name.
    - File contains literal `@v1.9-phase66-aes04 cohort mobile+iphone13` describe-block name.
    - File contains literal `.planning/visual-baselines/v1.9-pre` (cohort baseline path).
    - File contains literal `.planning/visual-baselines/v1.8-start` (strict baseline path).
    - `playwright test --list` enumerates 10 strict tests (5 routes × 2 viewports) + 10 cohort tests (5 routes × 2 viewports) = 20 total under the describe blocks.
    - Cohort block uses `test.skip(!existsSync(COHORT_BASELINE_DIR), ...)` skip pattern.
    - File compiles under `pnpm exec tsc --noEmit` (no errors).
  </acceptance_criteria>
  <done>Harness committed; --grep strict and --grep cohort both enumerate; cohort skipped until Task 4 captures baseline.</done>
</task>

<task type="auto">
  <name>Task 4: Capture .planning/visual-baselines/v1.9-pre/ — 5 routes × 4 viewports BEFORE any source mutation [BLOCKING]</name>
  <files>.planning/visual-baselines/v1.9-pre/</files>
  <read_first>
    - tests/v1.8-baseline-capture.spec.ts (full file — exact pattern to clone; ROUTES, VIEWPORTS, reduced-motion + warm-Anton + nextjs-portal hard gate)
    - .planning/phases/66-scalecanvas-track-b-architectural-decision/66-RESEARCH.md (§9e Mid-phase mobile cohort baseline at lines 488-492 — explicitly mandates capture BEFORE any source mutation, Pitfall 4 at lines 653-655)
    - .planning/phases/66-scalecanvas-track-b-architectural-decision/66-VALIDATION.md (row `66-01-baseline` — verify command + expected output)
  </read_first>
  <action>
    Create `.planning/visual-baselines/v1.9-pre/` directory and capture the full 5-route × 4-viewport (= 20 PNG) baseline using a temporary spec that mirrors `tests/v1.8-baseline-capture.spec.ts` with `BASELINE_DIR` repointed.

    Two-step approach (do NOT add a permanent `tests/v1.9-baseline-capture.spec.ts` — this is a one-shot ops action, not a recurring CI gate):

    **Step A — Create temporary spec** at `tests/v1.9-pre-baseline-capture.spec.ts.tmp` (use `.tmp` extension so Playwright glob ignores it; we will run it with explicit path):
    ```typescript
    import { test, expect } from "@playwright/test";
    import path from "node:path";

    const ROUTES = [
      { path: "/", slug: "home" },
      { path: "/system", slug: "system" },
      { path: "/init", slug: "init" },
      { path: "/inventory", slug: "inventory" },
      { path: "/reference", slug: "reference" },
    ] as const;

    const VIEWPORTS = [
      { name: "desktop-1440x900", width: 1440, height: 900 },
      { name: "iphone13-390x844", width: 390, height: 844 },
      { name: "ipad-834x1194", width: 834, height: 1194 },
      { name: "mobile-360x800", width: 360, height: 800 },
    ] as const;

    const BASELINE_DIR = path.resolve(process.cwd(), ".planning/visual-baselines/v1.9-pre");

    test.describe("@v1.9-pre baseline capture (cohort reference)", () => {
      for (const route of ROUTES) {
        for (const vp of VIEWPORTS) {
          test(`${route.slug} @ ${vp.name}`, async ({ page }) => {
            await page.setViewportSize({ width: vp.width, height: vp.height });
            await page.emulateMedia({ reducedMotion: "reduce" });
            await page.goto(route.path, { waitUntil: "networkidle" });
            await page.evaluate(() => document.fonts.load('700 100px "Anton"'));
            await page.evaluate(() => document.fonts.ready);
            await page.waitForTimeout(100);
            await expect(page.locator("nextjs-portal")).toHaveCount(0);
            const outPath = path.join(BASELINE_DIR, `${route.slug}-${vp.name}.png`);
            await page.screenshot({ path: outPath, fullPage: true, caret: "hide", animations: "disabled" });
            const fs = await import("node:fs/promises");
            const stat = await fs.stat(outPath);
            expect(stat.size).toBeGreaterThan(1024);
          });
        }
      }
    });
    ```

    **Step B — Build prod + run capture:**
    ```bash
    rm -rf .next/cache .next  # BND-04 stale-chunk guard per v1.8 standing rule
    pnpm build
    pnpm start &  # background; capture-script targets http://localhost:3000
    SERVER_PID=$!
    sleep 5  # let server boot
    pnpm exec playwright test tests/v1.9-pre-baseline-capture.spec.ts.tmp --project=chromium --workers=1
    kill $SERVER_PID
    rm tests/v1.9-pre-baseline-capture.spec.ts.tmp  # one-shot — delete after capture
    ```

    Note: pnpm start serves on port 3000 by default; playwright.config.ts already targets http://localhost:3000 per existing baseline-capture spec. If playwright.config has webServer config, use that instead — verify by reading playwright.config.ts before running.

    Sanity-check after capture:
    ```bash
    ls -1 .planning/visual-baselines/v1.9-pre/ | wc -l  # MUST equal 20
    ls -1 .planning/visual-baselines/v1.9-pre/ | grep -c "^home-mobile-360x800.png$"  # MUST equal 1
    ```

    **CRITICAL ORDERING:** This task must complete BEFORE any source mutation (Plan 02). If Plan 02 ships first, baselines capture pillarbox-state, defeating AES-03 cohort review per RESEARCH Pitfall 4.

    If `.planning/visual-baselines/v1.9-pre/` already exists from a prior run, fail loudly (do not silently overwrite — the existing capture is the canonical pre-mutation state). Prepend the capture script with: `if [ -d .planning/visual-baselines/v1.9-pre ]; then echo "v1.9-pre/ already captured — investigate before overwriting"; exit 1; fi`.
  </action>
  <verify>
    <automated>test -d .planning/visual-baselines/v1.9-pre && test $(ls -1 .planning/visual-baselines/v1.9-pre | wc -l) -eq 20 && test -f .planning/visual-baselines/v1.9-pre/home-mobile-360x800.png</automated>
  </verify>
  <acceptance_criteria>
    - Directory `.planning/visual-baselines/v1.9-pre/` exists.
    - Directory contains exactly 20 PNG files (5 routes × 4 viewports).
    - File `.planning/visual-baselines/v1.9-pre/home-mobile-360x800.png` exists and is >1024 bytes.
    - File `.planning/visual-baselines/v1.9-pre/home-iphone13-390x844.png` exists and is >1024 bytes.
    - Temporary spec `tests/v1.9-pre-baseline-capture.spec.ts.tmp` is REMOVED after capture (verify via `! test -f tests/v1.9-pre-baseline-capture.spec.ts.tmp`).
    - Capture executed against `pnpm build && pnpm start` (production), NOT `pnpm dev` — confirmed by nextjs-portal count===0 hard gate inside spec.
    - The cohort tests in `tests/v1.9-phase66-aes04-diff.spec.ts` no longer skip (existsSync(COHORT_BASELINE_DIR) === true) when `playwright test --list` is re-run.
    - No source files under `components/`, `app/`, `lib/`, or `public/` were modified during this task (verify via `git status` shows only baselines + plan + decision-doc + test specs as changed).
  </acceptance_criteria>
  <done>BLOCKING gate cleared — Plan 02 may now ship pillarbox + ARC-04 changes with a real cohort comparison surface.</done>
</task>

</tasks>

<verification>
**Plan 01 phase-level checks:**

1. `pnpm exec playwright test tests/v1.9-phase66-decision-doc.spec.ts --project=chromium` — 7 tests PASS (schema gate green).
2. `pnpm exec playwright test tests/v1.9-phase66-aes04-diff.spec.ts --list --project=chromium` — enumerates 20 tests across 2 describe blocks.
3. `ls -1 .planning/visual-baselines/v1.9-pre/ | wc -l` — equals 20.
4. `git status` shows no modifications to `components/`, `app/`, `lib/`, or `public/` (capture-only invariant).
5. `wc -l .planning/codebase/scale-canvas-track-b-decision.md` ≥200.
</verification>

<success_criteria>
- ARC-01 deliverable committed at `.planning/codebase/scale-canvas-track-b-decision.md` with mechanism=Pillarbox + 6-pillar audit + file:line evidence + counter-scale/portal rejection sections.
- Schema gate `tests/v1.9-phase66-decision-doc.spec.ts` (7 tests) green.
- AES-04 harness `tests/v1.9-phase66-aes04-diff.spec.ts` committed with strict + cohort partition; --grep strict and --grep cohort both enumerate cleanly.
- `.planning/visual-baselines/v1.9-pre/` captured (20 PNGs) BEFORE any Plan 02 source mutation.
- Plan 02 unblocked.
</success_criteria>

<output>
After completion, create `.planning/phases/66-scalecanvas-track-b-architectural-decision/66-01-SUMMARY.md` documenting:
- Decision-doc structure + word count
- Spec test counts (decision-doc: 7; aes04-diff: 20)
- v1.9-pre/ baseline capture command run + timestamp
- Any deviations from the recommended Pillarbox mechanism (none expected per RESEARCH HIGH confidence)
- Confirmation that no source files were mutated
</output>