---
phase: 35-performance-launch-gate
plan: 05
task: 2
task_of: 5
---

# Task 2: Task 2: LR-03 — chrome-devtools MCP console sweep across 5 routes on production URL

**Phase:** 35-performance-launch-gate
**Plan:** 05 — Wave 4 — Phase 35 close
**Task:** 2 of 5
**Files this task modifies:** .planning/phases/35-performance-launch-gate/production-console-sweep.md
**ACs this task satisfies:** AC-3, AC-8, AC-9

## Plan Objective (Context)

Wave 4 — Phase 35 close. Run the production deploy, execute the LR-03 chrome-devtools MCP console sweep across all 5 routes, run the final launch-gate.ts Lighthouse advisory against the production URL, and compose the close commit with both verification strings per brief §Execution Order steps 22-26. After close, flip STATE.md and ROADMAP.md to Complete.

Purpose: This is the plan that takes v1.5 from "code done" to "shipped". LR-03 production console verification is specifically called out as requiring chrome-devtools MCP (not Playwright) because brief §LR-03 notes Playwright misses CSP violations that fire during real CDN font loading and third-party script errors that Chromium headless doesn't see. The Lighthouse advisory is recorded in the close commit as searchable audit trail per brief §PF-02 "Lighthouse verified..." convention.

Output: Production deployment live, verified, and documented. Close commit landed. STATE.md + ROADMAP.md flipped. Phase 35 officially Complete. Awwwards submission becomes Grey's next action (outside Phase 35 scope per user correction).

## Plan Acceptance Criteria (Reference)

ACs this task must help satisfy (see ac_refs above for which apply):

**AC-1:** Given `.vercel/project.json` is present and `vercel whoami` returns a user in the correct team, when `vercel --prod` runs from project root, then a production deployment completes and the CLI prints a production URL (format: `https://...vercel.app` or the custom domain from OPEN-2 resolution). The URL is captured for subsequent tasks.

**AC-2:** Given the production URL is live, when each of the 5 routes is fetched via `curl -I -L` or chrome-devtools MCP navigation, then each returns HTTP 200 (or 301/302 to a 200). No 404, 500, or hang.

**AC-3:** Given chrome-devtools MCP navigates to each of the 5 routes in sequence against the production URL, when `list_console_messages` is captured per route, then every route's message list contains ZERO entries with severity `error` AND ZERO entries with severity `warning`. Info-level messages are allowed.

**AC-4:** Given `scripts/launch-gate.ts` is executed with `--url <production URL>`, when the run completes, then it outputs 4 category scores (Performance, Accessibility, Best Practices, SEO) after the worst-of-3 mitigation. The JSON is written to `.planning/phases/35-performance-launch-gate/launch-gate-final.json` (or timestamped equivalent moved to this final name).

**AC-5:** Given the Phase 35 close commit, when `git log --grep "Lighthouse verified" -n 5` runs, then the close commit appears with the verification string block matching the brief format. When `git log --grep "Production console verified" -n 5` runs, the same close commit appears with the console verification string block. Both strings are searchable.

**AC-6:** Given `.planning/STATE.md` after close, when read, the Phase 35 row in the "v1.5 Phase Map" shows `Complete` and the progress block shows `v1.5: [██████████] 100% (20/20 plans) MILESTONE COMPLETE — shipped {date}`.

**AC-7:** Given `.planning/ROADMAP.md` after close, when grepped, every Phase 35 plan checkbox is `[x]` and the Progress table row for Phase 35 shows `Complete` with today's date.

**AC-8:** Given `.planning/phases/35-performance-launch-gate/production-console-sweep.md` after this plan runs, when read, it contains a table with one row per route showing `{route}: {n} errors, {n} warnings` matching the close commit string. If any count is non-zero, the file documents the triage decision (fix within cap, expand cap, or accept-as-risk with Grey's explicit approval).

**AC-9:** Given `components/blocks/entry-section.tsx` after the entire phase completes, when grepped, lines 43-58 still contain `data-anim="hero-slash-moment"`, `mix-blend-mode: screen`, and `opacity: 0.25` — VL-05 hero slash sibling status-quo lock holds through Wave 4.

**AC-10:** Given the Awwwards submission is EXPLICITLY outside this plan's scope, when `git log` is reviewed after Phase 35 close, no commit contains the word "submit" or "awwwards" in a way that implies the submission action was taken as a planner task. The awwwards-description.md and screenshots directory are present as artifacts; the click is Grey's.

**AC-11:** Given the 7 requirement IDs for Phase 35 (PF-01, PF-02, PF-03, LR-01, LR-02, LR-03, LR-04), when `.planning/REQUIREMENTS.md` is updated in this plan (or confirmed updated), then each ID moves from `Pending` to `Complete` in the traceability table, matching the Phase 35 column.

**AC-12:** Given the two OPEN items, when OPEN-ITEMS.md is reviewed in the close commit, then BOTH OPEN-1 (credits attribution) AND OPEN-2 (metadataBase URL) show `RESOLVED: <value>` with Grey's choice recorded.

## Read First

Before making any changes, read these files:
/Users/greyaltaer/Library/Mobile Documents/iCloud~md~obsidian/Documents/second-brain/wiki/analyses/v1.5-phase35-brief.md (§LR-03 — locked verification protocol)
    .planning/phases/35-performance-launch-gate/wave-2-cdt-findings.md (from plan 35-04 — preview URL console state, for comparison)

## Task Boundaries (DO NOT CHANGE)

The following paths/sections must not be modified by this task:
<!-- MUST use chrome-devtools MCP against the PRODUCTION URL. NOT Playwright, NOT preview URL. Brief §LR-03 lock. -->
    <!-- Both errors AND warnings are launch-gate failures per brief. Do NOT silently filter warnings. -->
    <!-- components/blocks/entry-section.tsx lines 43-58 — VL-05 status-quo lock. -->

## Task Action

Using the production URL from Task 1, drive chrome-devtools MCP through all 5 routes and capture console messages per route.

Protocol per route:
1. `navigate_page` to `{PROD_URL}{route}`
2. Wait for first paint + document fonts ready (~2-3 seconds)
3. Scroll to bottom, then back to top (triggers any scroll-dependent errors)
4. `list_console_messages` — capture FULL message list
5. Count entries by severity: `error`, `warning`, `info`, `log`
6. Record in the sweep report

Write `.planning/phases/35-performance-launch-gate/production-console-sweep.md`:

```markdown
# Phase 35 — LR-03 Production Console Sweep

**Date:** {YYYY-MM-DD}
**Production URL:** {prod URL from Task 1}
**Deploy commit:** {git rev-parse HEAD}
**Driver:** chrome-devtools MCP (single-session per brief §LR-03)

## Per-Route Results

| Route | Errors | Warnings | Info | Log | Status |
|-------|--------|----------|------|-----|--------|
| `/` | 0 | 0 | {n} | {n} | PASS |
| `/system` | 0 | 0 | {n} | {n} | PASS |
| `/init` | 0 | 0 | {n} | {n} | PASS |
| `/reference` | 0 | 0 | {n} | {n} | PASS |
| `/inventory` | 0 | 0 | {n} | {n} | PASS |

## Detailed Findings (if any)

{For each error or warning, one entry:}
### Route: {route}
- **Severity:** error / warning
- **Message:** `{verbatim console text}`
- **Source:** `{file:line}` (if available)
- **Action taken:** {fix commit sha / accepted risk / escalated}

{If all rows PASS:}
No errors or warnings observed. Production console is clean.

## Close Commit String (paste into Phase 35 close commit)

```
Production console verified on {YYYY-MM-DD} at commit {sha}:
  /:          0 errors, 0 warnings
  /system:    0 errors, 0 warnings
  /init:      0 errors, 0 warnings
  /reference: 0 errors, 0 warnings
  /inventory: 0 errors, 0 warnings
```
```

**If any route has non-zero errors or warnings:**

The 5-fix cap from plan 35-04 was already applied to the pre-deploy test suite. A NEW post-deploy finding here means the production environment surfaced something the preview/local environment didn't — typically CSP, CDN font loading, or third-party script errors.

Options:
1. **Fix within the original cap** if cap has headroom (i.e., Wave 3 used < 5 fixes) — land a fix commit, redeploy, re-run this task.
2. **Cap overflow escalation** — if cap was already at 5 or this would exceed it, STOP and escalate to Grey with explicit "Cap expanded from 5 to N because [production-only error]" message.
3. **Accept-as-risk** — if Grey decides the finding is tolerable for launch (e.g., a benign third-party warning), document the decision in the sweep report and in `v1.6-carry-overs.md`.

Do NOT silently proceed with non-zero counts. The close commit must reflect the truth.

## Acceptance Criteria



## Verification

<automated>test -f .planning/phases/35-performance-launch-gate/production-console-sweep.md && grep -q "Per-Route Results" .planning/phases/35-performance-launch-gate/production-console-sweep.md && grep -qE "^\| \`/\`" .planning/phases/35-performance-launch-gate/production-console-sweep.md && grep -q "/system" .planning/phases/35-performance-launch-gate/production-console-sweep.md && grep -q "/init" .planning/phases/35-performance-launch-gate/production-console-sweep.md && grep -q "/reference" .planning/phases/35-performance-launch-gate/production-console-sweep.md && grep -q "/inventory" .planning/phases/35-performance-launch-gate/production-console-sweep.md && grep -q "Production console verified" .planning/phases/35-performance-launch-gate/production-console-sweep.md && [ -z "$(git diff components/blocks/entry-section.tsx)" ]</automated>

## Done Condition

production-console-sweep.md exists with per-route table (5 routes). Either all rows are "0 errors, 0 warnings" OR non-zero findings are triaged with commit SHAs / escalation notes. Close-commit-ready verification string is present in the file. VL-05 slash sibling unchanged.

## Plan Must-Haves (Relevant to This Task)

**Truths:**
- "vercel --prod has landed a production deployment from main branch at the final v1.5 commit"
- "Production URL is live and returns 200 on all 5 routes"
- "chrome-devtools MCP has visited all 5 routes on the production URL and captured console messages"
- "All 5 routes report zero `error` severity console messages and zero `warning` severity messages"
- "scripts/launch-gate.ts has run against the production URL and the result is documented in the close commit message"
- "Phase 35 close commit contains both the Lighthouse verification string and the production console verification string"
- "STATE.md phase map Phase 35 row is flipped to Complete"
- "ROADMAP.md Phase 35 plan list checkboxes are all [x]"
