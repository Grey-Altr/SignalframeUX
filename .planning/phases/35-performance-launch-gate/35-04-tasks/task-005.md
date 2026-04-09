---
phase: 35-performance-launch-gate
plan: 04
task: 5
task_of: 7
---

# Task 5: Task 5: Apply approved Wave 3 fixes as atomic commits (test + impl per commit)

**Phase:** 35-performance-launch-gate
**Plan:** 04 — Execute Wave 2 (chrome-devtools MCP exploratory pass), Wave 3 (triage with 5-fix cap), and the Awwwards package preparation (LR-01)
**Task:** 5 of 7
**Files this task modifies:** varies per fix — determined by triage output
**ACs this task satisfies:** AC-8, AC-9, AC-11

## Plan Objective (Context)

Execute Wave 2 (chrome-devtools MCP exploratory pass), Wave 3 (triage with 5-fix cap), and the Awwwards package preparation (LR-01). This plan is the primary human-involved plan of Phase 35 — most tasks require the orchestrator to drive chrome-devtools MCP in real time, and two tasks block on Grey's decisions (OPEN-1 credits attribution; Wave 3 fix cap approval).

Purpose: The brief's Phase 34 evidence (3-of-5 UAT items needed real code fixes that the automated spec missed) is the empirical floor. Playwright assertions from plan 35-02 catch everything that can be expressed as a spec; chrome-devtools MCP catches register feel, first-impression polish, lower-bound moments (like the VL-05 hero magenta moment Phase 34 initially missed), off-spec visual bugs, and subjective "does this read as Awwwards" judgment. The 5-fix cap is the forcing function that keeps Phase 35 shippable.

Output: 5 Awwwards screenshot PNGs, a three-act description deck with Grey's credits attribution resolved, a Wave 2 findings report, a Wave 3 triage document showing which items were approved/deferred, and a v1.6 carry-overs memo for deferred items. Awwwards submission itself is NOT a task — that is Grey's click after Phase 35 closes (per user correction).

## Plan Acceptance Criteria (Reference)

ACs this task must help satisfy (see ac_refs above for which apply):

**AC-1:** Given `.planning/phases/35-performance-launch-gate/awwwards-screenshots/`, when the directory is listed, then exactly 5 PNG files exist with names matching the locked manifest: `01-thesis-pinned.png`, `02-entry-cold-boot.png`, `03-inventory-breadth.png`, `04-system-specimens.png`, `05-reference-schematic.png`. Each PNG is 1440×900 pixels (confirmed via `file` command or image dimension check).

**AC-2:** Given `awwwards-description.md`, when grepped, it contains all three acts: Act 1 mentions `Liquid Glass` verbatim, Act 2 is 2-3 sentences in the Dischord register, Act 3 is a single line starting with `Next.js 15, React 19`. Total word count of the three acts combined is 120-180 words (inclusive).

**AC-3:** Given the description, when Act 2 is grepped for the forbidden marketing-tell word set `{seamless, delightful, intuitive, powerful, craft, story, journey}`, then zero matches are found. When grepped for second-person pronouns (`\b(you|your)\b`), zero matches are found.

**AC-4:** Given the tech stack string in the description, when compared to the LOCKED brief string `Next.js 15, React 19, TypeScript, Tailwind CSS, GSAP ScrollTrigger, Lenis, Three.js, GLSL, Playwright, OKLCH, shadcn/ui registry`, it matches byte-for-byte.

**AC-5:** Given `.planning/phases/35-performance-launch-gate/OPEN-ITEMS.md`, when checked, OPEN-1 (credits attribution) is marked `RESOLVED: <Grey's choice>`. When `awwwards-description.md` is grepped, the credits line matches the resolved choice (Culture Division, Grey Altaer, or both).

**AC-6:** Given `wave-2-cdt-findings.md`, when read, it contains a section per route × viewport (15 sections) OR a single findings table with route+viewport columns. Every finding has a BLOCK/FLAG/PASS tag. The file records the Lighthouse advisory result from Task "Run launch-gate.ts" (the script from plan 35-03).

**AC-7:** Given `wave-3-triage.md`, when read, it contains a ranked list of at most 5 approved fixes with Grey's explicit yes/no/backlog per item. Items 6+ appear in `v1.6-carry-overs.md` with their source reference (which agent report or CDT finding), the severity tag, and the deferral reason.

**AC-8:** Given Wave 3 fix commits (if any), when `git log --oneline | grep "phase-35" | head -10` runs after triage completes, then each approved-fix commit contains BOTH a test change (updates a phase-35-*.spec.ts assertion or adds a new one) AND an implementation change, matching the brief §Wave 3 protocol "atomic commits (one fix per commit, test + impl change together)".

**AC-9:** Given the homepage VL-05 magenta moment regression check, when `tests/phase-35-homepage.spec.ts` is run after all Wave 3 fixes land, then the test asserting the presence of `data-anim="hero-slash-moment"` + `mix-blend-mode: screen` + `opacity: 0.25` in `components/blocks/entry-section.tsx` still PASSES. When chrome-devtools MCP scrolls the homepage to the entry-section scroll progress range, the magenta slash is visually present at or near the Phase 34 shipped scroll position.

**AC-10:** Given `v1.6-carry-overs.md`, when read, it contains an entry for every finding above the 5-fix cap OR a single line "No cap overflow — all findings addressed within cap" if the cap was not exceeded. Format per deferred item: finding summary, source reference, severity, deferral reason, suggested v1.6 plan target.

**AC-11:** Given `components/blocks/entry-section.tsx`, when diffed after the entire plan completes, then EITHER the diff is empty (no Wave 3 fix needed this file) OR any changes explicitly preserve the VL-05 slash sibling block at lines 43-58 with `data-anim="hero-slash-moment"`, `mix-blend-mode: screen`, and `opacity: 0.25` all intact.

**AC-12:** Given the brief-locked 5-fix cap, when Grey overrides it with an explicit "Cap expanded from 5 to N because [reason]" statement, then `wave-3-triage.md` records that statement verbatim at the top of the document. If no override, the top of the document says "Cap honored: 5-fix limit applied."

## Read First

Before making any changes, read these files:
.planning/phases/35-performance-launch-gate/wave-3-triage.md (from Task 4)
    .planning/phases/35-performance-launch-gate/visual-qa/ (agent reports)
    .planning/phases/35-performance-launch-gate/wave-2-cdt-findings.md
    /Users/greyaltaer/Library/Mobile Documents/iCloud~md~obsidian/Documents/second-brain/wiki/analyses/v1.5-phase35-brief.md (§Visual-QA Pass Shape Wave 3 + §Technical Traps)

## Task Boundaries (DO NOT CHANGE)

The following paths/sections must not be modified by this task:
<!-- At most 5 commits (or N if Grey expanded the cap in Task 4). Do NOT silently add fixes. -->
    <!-- Each commit MUST contain BOTH a test change AND an implementation change. Test-only or impl-only commits are forbidden. Brief §Wave 3 protocol "atomic commits (one fix per commit, test + impl change together)". -->
    <!-- components/blocks/entry-section.tsx lines 43-58 — VL-05 status-quo lock. If a Wave 3 fix touches entry-section.tsx, the slash sibling block (data-anim="hero-slash-moment", mix-blend-mode: screen, opacity: 0.25) MUST remain intact. Any deviation is a BLOCK and must escalate to Grey. -->
    <!-- GSAP opacity property collision trap: if a fix adds opacity animation to an already-animated element (like anything in entry-section.tsx), it will silently break VL-05 per [[v1.5-compile-back]] Bug 3. Check the existing animation chain in page-animations.tsx before animating opacity. -->
    <!-- Next.js version lock: no fix may upgrade Next.js beyond 15.x. No proxy.ts renames. No Cache Components. Brief §Next.js Version Lock. -->
    <!-- Do NOT touch app/layout.tsx metadata — that's locked by plan 35-03. -->
    <!-- Do NOT touch the locked assertion bodies in tests/phase-35-bundle-gate.spec.ts, tests/phase-35-lcp-homepage.spec.ts, tests/phase-35-cls-all-routes.spec.ts — those are measurement gates, not remediation targets. Fixes happen in the production code the gates measure. -->

## Task Action

For each approved triage item from Task 4, land one atomic commit containing both a test update and an implementation update. Protocol per commit:

1. **Identify the fix target** — which file + line does the finding point to?
2. **Write the test first** — update the corresponding `tests/phase-35-*.spec.ts` assertion or add a new one that fails against current code and passes after the fix.
3. **Implement the minimal fix** — just enough to make the test pass. No drive-by refactors, no optimization, no style improvements.
4. **Verify VL-05 lock** — if the fix touched any homepage file, run `git diff components/blocks/entry-section.tsx` and confirm either (a) the diff is empty OR (b) the slash sibling block is intact.
5. **Run the full phase-35 suite** — `pnpm exec playwright test -g "@phase35"` — to confirm no regression in the other assertions.
6. **Commit** with format:
   ```
   fix(phase-35): <one-line finding summary>

   Triage source: {agent-N report or wave-2 finding ID}
   Severity: {BLOCK/FLAG}
   Test + impl atomic per brief §Wave 3 protocol.
   ```
7. **Re-run chrome-devtools MCP targeted spot-check** on the fix site (~1-2 min per fix, NOT a full Wave 2 re-pass). Confirm the fix looks right visually.

After all approved fixes land, run the ~10-minute spot-check re-verification per user correction: navigate to each fix site via chrome-devtools MCP and visually confirm. If a fix introduces a NEW BLOCK, roll it back and escalate to Grey — do NOT chain fixes on fixes (that's the scenario the 5-fix cap exists to prevent).

**If the approved list was empty** (all Wave 1/2 findings were PASS), write a single commit noting "Wave 3: no findings — cap unused" in the Phase 35 close commit trail and skip to Task 6.

**Append a results table** to `wave-3-triage.md` documenting commit SHA per approved fix.

## Acceptance Criteria



## Verification

<automated>if [ -f .planning/phases/35-performance-launch-gate/wave-3-triage.md ] && grep -qE "approved|commit" .planning/phases/35-performance-launch-gate/wave-3-triage.md; then git log --oneline --grep="phase-35" | head -10 && pnpm exec playwright test -g "@phase35" --reporter=list 2>&1 | tail -5 && [ -z "$(git diff components/blocks/entry-section.tsx)" ] || grep -q "hero-slash-moment" components/blocks/entry-section.tsx; else echo "Wave 3 not applicable — empty triage"; fi</automated>

## Done Condition

At most 5 (or N if cap expanded) atomic fix commits land, each containing test + impl changes. VL-05 hero slash sibling is preserved. The @phase35 test suite passes after all fixes. Triage document records commit SHAs.

## Plan Must-Haves (Relevant to This Task)

**Truths:**
- "chrome-devtools MCP has captured 5 screenshots at 1440x900 per the locked hero composition"
- "Awwwards description deck exists as a three-act hybrid (A+B+D) — headline + body + spec metrics"
- "Description names Liquid Glass by name in Act 1 per brief §LR-01 voice lock"
- "Description Act 2 contains zero of the forbidden marketing-tell words: seamless, delightful, intuitive, powerful, craft, story, journey"
- "Description Act 2 contains zero second-person pronouns (you, your)"
- "Tech stack string is the exact frozen string from brief §LR-01"
- "Credits attribution is resolved per Grey's OPEN-1 decision"
- "Wave 2 chrome-devtools MCP findings are recorded with BLOCK/FLAG/PASS tagging"
- "Wave 3 triage applies the 5-fix cap; items 6+ go to v1.6-carry-overs.md"
- "VL-05 homepage hero magenta moment is present at Phase 34 scroll position (regression check, not modification)"
