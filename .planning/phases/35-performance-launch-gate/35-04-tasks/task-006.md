---
phase: 35-performance-launch-gate
plan: 04
task: 6
task_of: 7
---

# Task 6: Task 6: Author awwwards-description.md — resolve OPEN-1 credits, apply voice locks

**Phase:** 35-performance-launch-gate
**Plan:** 04 — Execute Wave 2 (chrome-devtools MCP exploratory pass), Wave 3 (triage with 5-fix cap), and the Awwwards package preparation (LR-01)
**Task:** 6 of 7
**Files this task modifies:** 
**ACs this task satisfies:** AC-2, AC-3, AC-4, AC-5

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


## Task Action



## Acceptance Criteria



## Verification



## Done Condition



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
