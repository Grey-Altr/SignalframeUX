---
phase: 35-performance-launch-gate
plan: 05
task: 4
task_of: 5
---

# Task 4: Task 4: Update REQUIREMENTS.md + compose close commit with both verification strings

**Phase:** 35-performance-launch-gate
**Plan:** 05 — Wave 4 — Phase 35 close
**Task:** 4 of 5
**Files this task modifies:** .planning/REQUIREMENTS.md
**ACs this task satisfies:** AC-5, AC-9, AC-10, AC-11, AC-12

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
.planning/REQUIREMENTS.md (traceability table at line 155+)
    .planning/phases/35-performance-launch-gate/production-console-sweep.md (from Task 2)
    .planning/phases/35-performance-launch-gate/launch-gate-final.json (from Task 3)
    .planning/phases/35-performance-launch-gate/OPEN-ITEMS.md (both items resolved by now)
    .planning/phases/35-performance-launch-gate/35-04-SUMMARY.md (wave 3 commit list + 5-fix cap status)
    /Users/greyaltaer/Library/Mobile Documents/iCloud~md~obsidian/Documents/second-brain/wiki/analyses/v1.5-phase35-brief.md (§LR-03 close commit format)

## Task Boundaries (DO NOT CHANGE)

The following paths/sections must not be modified by this task:
<!-- Do NOT modify REQUIREMENTS.md rows for requirements OUTSIDE Phase 35. Only the 7 Phase 35 IDs: PF-01, PF-02, PF-03, LR-01, LR-02, LR-03, LR-04. -->
    <!-- Do NOT modify REQUIREMENTS.md checkbox lines for any other phase. -->
    <!-- STATE.md + ROADMAP.md flips are in Task 5, NOT this task. Keep the close commit focused on requirements + audit strings. -->
    <!-- components/blocks/entry-section.tsx lines 43-58 — VL-05 status-quo lock. -->

## Task Action

**Step 1 — Update REQUIREMENTS.md:**

In the traceability table (around line 155), update the status for the 7 Phase 35 IDs:

```
| PF-01 | Phase 35 | Complete |
| PF-02 | Phase 35 | Complete |
| PF-03 | Phase 35 | Complete |
| LR-01 | Phase 35 | Complete |
| LR-02 | Phase 35 | Complete |
| LR-03 | Phase 35 | Complete |
| LR-04 | Phase 35 | Complete |
```

Also update the checkboxes in the PF-01..PF-06 section (around line 82) and LR-01..LR-04 section (around line 91):

```
- [x] **PF-01**: Shared JS bundle remains under 150 KB gzip after all redesign changes
- [x] **PF-02**: Lighthouse 100/100 on all four categories against deployed URL
- [x] **PF-03**: LCP < 1.0s on homepage (ENTRY section)
- [x] **LR-01**: Awwwards submission package prepared (project description, technologies, screenshots)
- [x] **LR-02**: Open Graph / social meta tags updated for redesigned site (title, description, preview image)
- [x] **LR-03**: Vercel production deployment live with no console errors
- [x] **LR-04**: Mobile responsive across all new sections (tested at 375px, 768px, 1440px)
```

If PF-02 result was accept-as-risk (< 100 on a category), mark PF-02 as Complete anyway — the advisory mechanism accepts graceful degradation per brief §PF-02 — but note the actual score in the close commit message.

**Step 2 — Compose the close commit:**

Stage all outstanding Phase 35 files:

```bash
git add .planning/REQUIREMENTS.md \
        .planning/phases/35-performance-launch-gate/production-console-sweep.md \
        .planning/phases/35-performance-launch-gate/launch-gate-final.json \
        .planning/phases/35-performance-launch-gate/35-04-SUMMARY.md \
        .planning/phases/35-performance-launch-gate/35-05-SUMMARY.md \
        .planning/phases/35-performance-launch-gate/awwwards-description.md \
        .planning/phases/35-performance-launch-gate/awwwards-screenshots/*.png \
        .planning/phases/35-performance-launch-gate/wave-2-cdt-findings.md \
        .planning/phases/35-performance-launch-gate/wave-3-triage.md \
        .planning/phases/35-performance-launch-gate/v1.6-carry-overs.md \
        .planning/phases/35-performance-launch-gate/OPEN-ITEMS.md
```

Note: `launch-gate-*.json` timestamped files are gitignored per plan 35-03 Task 5; only `launch-gate-final.json` is committed.

**Commit message template** (fill in the placeholders):

```
chore(phase-35): close Phase 35 Performance + Launch Gate after v1.5 ship

Production deploy: <HEAD sha> → <prod URL>

Lighthouse verified at commit <sha> on date <YYYY-MM-DD> against production URL <prod URL>:
  Performance: <n>
  Accessibility: <n>
  Best Practices: <n>
  SEO: <n>

Production console verified on <YYYY-MM-DD> at commit <sha>:
  /:          0 errors, 0 warnings
  /system:    0 errors, 0 warnings
  /init:      0 errors, 0 warnings
  /reference: 0 errors, 0 warnings
  /inventory: 0 errors, 0 warnings

Phase 35 5-fix cap status: <honored / expanded from 5 to N — reason>
Wave 3 fix commits: <list SHAs or "none">
v1.6 carry-overs: <count> (see `.planning/phases/35-performance-launch-gate/v1.6-carry-overs.md`)

OPEN items resolved:
- OPEN-1 credits attribution: <Grey's choice>
- OPEN-2 metadataBase URL: <Grey's choice>

Awwwards submission package ready at:
  `.planning/phases/35-performance-launch-gate/awwwards-description.md`
  `.planning/phases/35-performance-launch-gate/awwwards-screenshots/`

Next action (OUTSIDE Phase 35 scope per user correction): Grey submits to awwwards.com manually.

Closes: PF-01, PF-02, PF-03, LR-01, LR-02, LR-03, LR-04
```

Use `git commit -F /tmp/phase-35-close-msg.txt` with a heredoc-written message file to preserve formatting. Do NOT use `-m` with inline strings (newlines break in zsh).

**Step 3 — Verify searchability:**

```bash
git log --grep "Lighthouse verified" --oneline | head -5
git log --grep "Production console verified" --oneline | head -5
```

Both should return the fresh close commit SHA.

## Acceptance Criteria



## Verification

<automated>grep -E "^\| PF-01 \| Phase 35 \| Complete" .planning/REQUIREMENTS.md && grep -E "^\| LR-04 \| Phase 35 \| Complete" .planning/REQUIREMENTS.md && git log --grep "Lighthouse verified" --oneline | head -1 | grep -qE "[a-f0-9]+" && git log --grep "Production console verified" --oneline | head -1 | grep -qE "[a-f0-9]+" && git log -1 --format="%B" | grep -q "Closes: PF-01, PF-02, PF-03, LR-01, LR-02, LR-03, LR-04" && [ -z "$(git diff components/blocks/entry-section.tsx)" ]</automated>

## Done Condition

REQUIREMENTS.md shows all 7 Phase 35 IDs as Complete. Close commit landed with both verification strings. `git log --grep` returns the commit for both search phrases. VL-05 slash sibling unchanged.

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
