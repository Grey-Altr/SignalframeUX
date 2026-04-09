---
phase: 35-performance-launch-gate
plan: 04
task: 2
task_of: 7
---

# Task 2: Task 2: Capture 5 Awwwards screenshots via chrome-devtools MCP at 1440x900

**Phase:** 35-performance-launch-gate
**Plan:** 04 — Execute Wave 2 (chrome-devtools MCP exploratory pass), Wave 3 (triage with 5-fix cap), and the Awwwards package preparation (LR-01)
**Task:** 2 of 7
**Files this task modifies:** .planning/phases/35-performance-launch-gate/awwwards-screenshots/01-thesis-pinned.png, .planning/phases/35-performance-launch-gate/awwwards-screenshots/02-entry-cold-boot.png, .planning/phases/35-performance-launch-gate/awwwards-screenshots/03-inventory-breadth.png, .planning/phases/35-performance-launch-gate/awwwards-screenshots/04-system-specimens.png, .planning/phases/35-performance-launch-gate/awwwards-screenshots/05-reference-schematic.png
**ACs this task satisfies:** AC-1

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
/Users/greyaltaer/Library/Mobile Documents/iCloud~md~obsidian/Documents/second-brain/wiki/analyses/v1.5-phase35-brief.md (§LR-01 "Hero frame" + "Screenshots 2-5 supporting" + "Screenshot capture method")

## Task Boundaries (DO NOT CHANGE)

The following paths/sections must not be modified by this task:
<!-- MUST use chrome-devtools MCP, NOT Playwright. Brief §LR-01 explicitly locks this: "Playwright's screenshots miss font loading states and animation-frame timing. chrome-devtools MCP runs a real Chrome instance with real font loading and real paint timing, which matches what Awwwards judges see when they click through." -->
    <!-- All 5 screenshots MUST be 1440x900 exactly. Not "roughly" — exact. -->
    <!-- PNG format, no JPEG artifacts. -->
    <!-- Filename order is LOCKED. Do not rename or reorder. -->
    <!-- Hero frame (#1) is deep-linked to mid-THESIS scroll — use window.scrollTo via chrome-devtools MCP JavaScript execution to reach the mid-manifesto position before capture. -->
    <!-- components/blocks/entry-section.tsx lines 43-58 — VL-05 slash sibling status-quo lock (this plan shouldn't touch it at all, just sanity-check). -->

## Task Action

Using the same chrome-devtools MCP session from Task 1 (or a fresh one if preferred):

1. **Resize viewport** to exactly 1440×900.

2. **Screenshot 1 — `01-thesis-pinned.png`**: Navigate to `/` (live production or preview URL, NOT localhost — brief §LR-01 "Screenshot capture method" locks this). Scroll to the middle of the THESIS pinned manifesto section. The target state per brief: one pinned manifesto phrase visible at full opacity, GhostLabel SIGNALFRAME/UX visible in the background, InstrumentHUD top-right showing `[02//THESIS]`, ≥95% negative space, nav visible at top (post-reveal state). Use chrome-devtools MCP `evaluate_script` to run `window.scrollTo(0, <target-y>)` if precise positioning is needed. Capture with `take_screenshot` → save to `.planning/phases/35-performance-launch-gate/awwwards-screenshots/01-thesis-pinned.png`.

3. **Screenshot 2 — `02-entry-cold-boot.png`**: Navigate to `/` with a full page reload. Wait for entry-section fade-in to complete (the 0.01 → 1.0 h1 animation + GLSL hero warmup). Target state: ENTRY hero post-fade with GLSL dither, `SIGNALFRAME//UX` Anton headline fully resolved, HUD `[01//ENTRY]` visible, nav visible, first scroll cue visible. Capture.

4. **Screenshot 3 — `03-inventory-breadth.png`**: Navigate to `/inventory`. Scroll to show the 12-row breadth sample. Target: all 6 category labels visible (FRM, LAY, NAV, FBK, DAT, GEN) with the two `[//SIGNAL]` GEN rows at the bottom (positions 11-12). Capture.

5. **Screenshot 4 — `04-system-specimens.png`**: Navigate to `/system`. Scroll to the specimen ladder where type scale + spacing bars + OKLCH color grid are all visible simultaneously. Capture.

6. **Screenshot 5 — `05-reference-schematic.png`**: Navigate to `/reference`. Capture a view showing the schematic row layout with monospaced density, Dischord-tracklist register visible.

**Post-capture validation:** Run the following to confirm dimensions:
```bash
file .planning/phases/35-performance-launch-gate/awwwards-screenshots/*.png
# each should report "1440 x 900"
```

If any screenshot is not exactly 1440×900 (e.g., the viewport was off by a few pixels), re-capture that single screenshot with correct viewport. Do NOT scale/resize post-capture.

If chrome-devtools MCP session is not accessible (e.g., spawned in a non-MCP environment), this task BLOCKS and requires a human to run the captures manually. Fall-through is NOT to use Playwright — the brief explicitly forbids that for Awwwards captures.

## Acceptance Criteria



## Verification

<automated>ls .planning/phases/35-performance-launch-gate/awwwards-screenshots/*.png 2>/dev/null | wc -l | tr -d ' ' | grep -q "^5$" && test -f .planning/phases/35-performance-launch-gate/awwwards-screenshots/01-thesis-pinned.png && test -f .planning/phases/35-performance-launch-gate/awwwards-screenshots/02-entry-cold-boot.png && test -f .planning/phases/35-performance-launch-gate/awwwards-screenshots/03-inventory-breadth.png && test -f .planning/phases/35-performance-launch-gate/awwwards-screenshots/04-system-specimens.png && test -f .planning/phases/35-performance-launch-gate/awwwards-screenshots/05-reference-schematic.png && file .planning/phases/35-performance-launch-gate/awwwards-screenshots/01-thesis-pinned.png | grep -q "1440 x 900"</automated>

## Done Condition

All 5 screenshots exist at the locked filenames, each is exactly 1440×900 PNG, all captured via chrome-devtools MCP (not Playwright), hero frame is deep-linked to mid-THESIS scroll per brief.

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
