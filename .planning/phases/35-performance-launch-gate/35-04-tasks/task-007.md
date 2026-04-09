---
phase: 35-performance-launch-gate
plan: 04
task: 7
task_of: 7
---

# Task 7: Task 7: Write awwwards-description.md three-act hybrid + v1.6-carry-overs.md

**Phase:** 35-performance-launch-gate
**Plan:** 04 — Execute Wave 2 (chrome-devtools MCP exploratory pass), Wave 3 (triage with 5-fix cap), and the Awwwards package preparation (LR-01)
**Task:** 7 of 7
**Files this task modifies:** .planning/phases/35-performance-launch-gate/awwwards-description.md, .planning/phases/35-performance-launch-gate/v1.6-carry-overs.md
**ACs this task satisfies:** AC-2, AC-3, AC-4, AC-5, AC-10

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
/Users/greyaltaer/Library/Mobile Documents/iCloud~md~obsidian/Documents/second-brain/wiki/analyses/v1.5-phase35-brief.md (§LR-01 entire section — three-act shape, constraints, tech stack string, submission URL)
    .planning/phases/35-performance-launch-gate/OPEN-ITEMS.md (OPEN-1 resolution from Task 6)
    .planning/phases/35-performance-launch-gate/wave-3-triage.md (deferred items for v1.6-carry-overs.md)

## Task Boundaries (DO NOT CHANGE)

The following paths/sections must not be modified by this task:
<!-- Act 1 MUST name "Liquid Glass" by name. Non-negotiable per brief §LR-01. -->
    <!-- Act 2 MUST NOT contain any of: seamless, delightful, intuitive, powerful, craft, story, journey. -->
    <!-- Act 2 MUST NOT contain second-person pronouns (you, your). -->
    <!-- Tech stack string MUST be byte-exact to the brief lock. -->
    <!-- Submission URL is ROOT `/`, NOT deep-linked. -->
    <!-- Total word count 120-180 across all three acts. -->
    <!-- Do NOT write marketing tell words. Do NOT use "experience" or "journey" or "transforms your workflow" or anything from SaaS copy lineage. -->
    <!-- Metrics in Act 3 must match the ACTUAL v1.5 ship metrics: shared JS bundle = ~100 kB (per baseline), CLS = 0, LCP < 1.0s, test count (pull actual from `tests/phase-35-*.spec.ts` + prior phase tests), 5 routes, 6 layer categories, 54 SF-prefixed components. If any metric is unverifiable, use the research baseline from 35-RESEARCH.md. -->

## Task Action

**Part A — Write `awwwards-description.md`:**

Structure:

```markdown
# SignalframeUX — Awwwards Submission Package

## Live URL

https://<the metadataBase URL from plan 35-03 Task 3 resolution>

## Submission URL

/ (root — NOT deep-linked; Awwwards judges land on ENTRY cold-boot)

## Hero Screenshot

`01-thesis-pinned.png` (1440x900) — THESIS pinned mid-manifesto

## Description (three-act hybrid)

### Act 1 — Headline (register B, positioned + polemical)

{One sentence. Names "Liquid Glass" by name. Lead word is a declarative register noun. Use the brief example as a starting draft but write the final version yourself — the planner's job is to obey the constraints, not to ship the placeholder.}

### Act 2 — Body (register A, technical + declarative)

{2-3 sentences in Dischord-record-sleeve register. No second-person pronouns. No forbidden marketing-tell words. Describe the system's shape without marketing language. Use the brief example as structural reference — components as instruments, typography as architecture, cockpit not invitation.}

### Act 3 — Spec metrics (register D)

{Single line, comma-separated. Exact tech stack string from brief §LR-01. Then metrics: shared JS, CLS, LCP, test count, routes, layer categories, component count. All metrics pulled from verified sources (see "Metrics Sources" section below).}

## Tech Stack String (copy-paste verbatim for Awwwards submission form)

Next.js 15, React 19, TypeScript, Tailwind CSS, GSAP ScrollTrigger, Lenis, Three.js, GLSL, Playwright, OKLCH, shadcn/ui registry

## Credits

{Resolved from OPEN-1 decision in Task 6:}
- **Studio:** {Culture Division / not applicable}
- **Designer + Developer:** {Grey Altaer / not applicable}
- **Attribution mode:** {both / cd-only / grey-only}

## Screenshot Manifest

1. `01-thesis-pinned.png` — HERO — THESIS pinned mid-manifesto, 1440x900
2. `02-entry-cold-boot.png` — ENTRY hero post-fade
3. `03-inventory-breadth.png` — 12-row breadth sample
4. `04-system-specimens.png` — type scale + spacing + OKLCH grid
5. `05-reference-schematic.png` — Dischord tracklist density

## Metrics Sources

| Metric | Value | Source |
|--------|-------|--------|
| Shared JS bundle | {value} kB gzip | `tests/phase-35-bundle-gate.spec.ts` run against {commit sha} |
| CLS | 0 | `tests/phase-35-cls-all-routes.spec.ts` all routes |
| LCP | < 1.0s | `tests/phase-35-lcp-homepage.spec.ts` on `/` |
| Playwright tests passing | {n}/{n} | `pnpm test` on {commit sha} |
| Routes | 5 | `/`, `/system`, `/init`, `/reference`, `/inventory` |
| Component layer categories | 6 | FRM, LAY, NAV, FBK, DAT, GEN |
| SF-prefixed components | 54 | registry.json count |

## Lighthouse Advisory Result

{pull from wave-2-cdt-findings.md Lighthouse Advisory section}

## Submission readiness

- [ ] Screenshots captured and at 1440x900
- [ ] Description passes voice-lock check (no forbidden words, no second-person)
- [ ] Tech stack string byte-matches brief
- [ ] Credits resolved
- [ ] Grey's manual click: submit via awwwards.com (NOT a planner task)
```

**Self-check the description against the constraints before marking done:**

```bash
# No forbidden marketing-tell words in Act 2:
grep -iE "\\b(seamless|delightful|intuitive|powerful|craft|story|journey)\\b" .planning/phases/35-performance-launch-gate/awwwards-description.md | grep -v "^#" | grep -v "forbidden"

# No second-person pronouns in Act 2:
# (grep the Act 2 section specifically, since the credits section may legitimately contain "your")
sed -n '/Act 2/,/Act 3/p' .planning/phases/35-performance-launch-gate/awwwards-description.md | grep -iwE "you|your"

# Tech stack string byte-exact:
grep -q "Next.js 15, React 19, TypeScript, Tailwind CSS, GSAP ScrollTrigger, Lenis, Three.js, GLSL, Playwright, OKLCH, shadcn/ui registry" .planning/phases/35-performance-launch-gate/awwwards-description.md

# Liquid Glass named in Act 1:
sed -n '/Act 1/,/Act 2/p' .planning/phases/35-performance-launch-gate/awwwards-description.md | grep -q "Liquid Glass"

# Word count 120-180:
sed -n '/### Act 1/,/## Tech Stack/p' .planning/phases/35-performance-launch-gate/awwwards-description.md | wc -w
```

If any check fails, rewrite until all pass.

**Part B — Write `v1.6-carry-overs.md`:**

For every finding above the 5-fix cap (or if cap was not exceeded, an explicit single-line "No carry-overs" message):

```markdown
# Phase 35 → v1.6 Carry-Over Items

**Phase 35 5-fix cap status:** {honored / expanded from 5 to N}
**Phase 35 close commit:** {will be filled by plan 35-05}

## Deferred Items

{If cap not exceeded:}
No carry-overs — all Wave 1 + Wave 2 findings were addressed within the 5-fix cap or scored as PASS.

{If cap exceeded, one entry per deferred item:}
### Item N: {one-line summary}

- **Source:** {agent-N report / wave-2 CDT finding ID / Lighthouse Advisory}
- **Severity:** BLOCK / FLAG
- **File:line:** {where the fix would land}
- **Deferral reason:** {why it didn't fit the cap}
- **Suggested v1.6 plan target:** {e.g., "v1.6 Phase 36 — WebGL Performance Pass"}
```

## Acceptance Criteria



## Verification

<automated>test -f .planning/phases/35-performance-launch-gate/awwwards-description.md && test -f .planning/phases/35-performance-launch-gate/v1.6-carry-overs.md && grep -q "Liquid Glass" .planning/phases/35-performance-launch-gate/awwwards-description.md && grep -q "Next.js 15, React 19, TypeScript, Tailwind CSS, GSAP ScrollTrigger, Lenis, Three.js, GLSL, Playwright, OKLCH, shadcn/ui registry" .planning/phases/35-performance-launch-gate/awwwards-description.md && ! sed -n '/### Act 2/,/### Act 3/p' .planning/phases/35-performance-launch-gate/awwwards-description.md | grep -iE "\\b(seamless|delightful|intuitive|powerful|craft|story|journey)\\b" && ! sed -n '/### Act 2/,/### Act 3/p' .planning/phases/35-performance-launch-gate/awwwards-description.md | grep -iwE "you|your" && grep -q "Credits" .planning/phases/35-performance-launch-gate/awwwards-description.md && [ -z "$(git diff components/blocks/entry-section.tsx)" ]</automated>

## Done Condition

awwwards-description.md exists with all three acts, tech stack string verbatim, Liquid Glass named in Act 1, Act 2 passes forbidden-word + pronoun checks, credits resolved per OPEN-1. v1.6-carry-overs.md exists (even if empty). VL-05 slash sibling unchanged.

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
