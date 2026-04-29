---
phase: 47-viewport-polish
plan: 01
status: complete
completed: "2026-04-25"
commit: "e1dcf8f"
---

# Summary — Phase 47 Plan 01: Token floor lift + scope ratification

## What was done

Pre-flight audit revealed three of four original VPT requirements were obsolete or already shipped, so this plan ratified reality rather than re-implementing it. The only real code change is a clamp-floor lift on `--sfx-text-2xs` and `--sfx-text-xs` so functional micro-text reaches 10px / 11px on a 1280px MacBook 13" viewport. VPT-02 and VPT-04 are documented as RATIFIED (file:line citations to the shipped code), VPT-03 is documented as OBSOLETE (architectural rationale), and a stale Phase 47 plan reference inherited from Phase 44 was corrected in ROADMAP.md. Lean execution per `feedback_ratify_reality_bias.md` and CLAUDE.md "DO NOT add features beyond stabilization scope".

## Changes made

**VPT-01 — Clamp floor lift** (commit `d79dfc0`):
- `app/globals.css:200` — `--sfx-text-2xs: clamp(8px, …, 12px)` → `clamp(10px, …, 12px)`
- `app/globals.css:201` — `--sfx-text-xs: clamp(9px, …, 14px)` → `clamp(11px, …, 14px)`
- Multipliers (0.625 / 0.694) and caps (12px / 14px) preserved — pure floor lift, no curve change above ~1600px viewport.

**VPT-02 / VPT-04 — Ratified** (commit `709e8e9`):
- VPT-02 RATIFIED — already shipped at `components/blocks/components-explorer.tsx:817` (`grid-cols-2 md:grid-cols-3 lg:grid-cols-4`).
- VPT-04 RATIFIED — already shipped at `.storybook/preview.ts:23-34` (`macbook13` 1280×800 + `macbook15` 1440×900).
- REQUIREMENTS.md body status updated to `[x]` with file:line citations; traceability matrix rows updated to `Ratified`.

**VPT-03 — Obsolete** (commit `709e8e9`):
- The `pt-10` page-header pattern no longer exists. Subpages (`/inventory`, `/system`, `/init`, `/builds`, `/reference`) use `<main className="mt-[var(--nav-height)]">` + SFPanel-based heroes — there is no header-padding target left to fix.
- REQUIREMENTS.md body line annotated `OBSOLETE 2026-04-25` with the architectural rationale; traceability matrix row updated to `Obsolete`.

**Bookkeeping** (commit `e1dcf8f`):
- ROADMAP.md Phase 47 entry corrected: `44-01-PLAN.md — Fix all copy across 6 source files` → `47-01-PLAN.md — Token floor lift + scope ratification`. Phase 48's identical stale reference deliberately preserved (out of scope).

## Verification

| Check | Outcome |
|-------|---------|
| `grep -nE "^\s*--sfx-text-2xs: clamp\(10px," app/globals.css` returns line 200 | PASS |
| `grep -nE "^\s*--sfx-text-xs: clamp\(11px," app/globals.css` returns line 201 | PASS |
| `grep -cE "^\s*--sfx-text-2xs: clamp\(8px," app/globals.css` returns 0 (old floor gone) | PASS |
| `grep -cE "^\s*--sfx-text-xs: clamp\(9px," app/globals.css` returns 0 (old floor gone) | PASS |
| Other 8 type tokens (`sm`/`base`/`md`/`lg`/`xl`/`2xl`/`3xl`/`4xl`) untouched | PASS (8 matches) |
| `grep -c "^- \[x\] \*\*VPT-0[1-4]\*\*" .planning/REQUIREMENTS.md` returns 4 | PASS |
| `RATIFIED 2026-04-25` appears 2× in REQUIREMENTS.md (VPT-02 + VPT-04) | PASS |
| `OBSOLETE 2026-04-25` appears 1× in REQUIREMENTS.md (VPT-03) | PASS |
| Matrix has 4 VPT rows with `Complete` / `Ratified` / `Obsolete` / `Ratified` | PASS |
| Zero `Pending` VPT rows remain | PASS |
| Phase 47 plan reference now points at `47-01-PLAN.md` | PASS |
| Phase 48 plan reference still has stale `44-01-PLAN.md` (deliberate, out of scope) | PASS |
| `47-01-PLAN.md` occurrence count in ROADMAP.md = 1 | PASS |
| `pnpm exec tsc --noEmit` exits clean | PASS (no output, exit 0) |

All 3 task acceptance criteria met. No regression in other type tokens, no new dependencies, no new components, no new tests.

## Notes

**Architectural shift that obsoleted VPT-03.** Earlier phase planning assumed subpages used a `pt-10` (40px) top padding on a page-header div, with VPT-03 lifting that to `pt-12` (48px) to match the blessed spacing scale (4/8/12/16/24/32/48/64/96 from CLAUDE.md). At some point between original requirements drafting and now, the subpage architecture was refactored — `<main>` carries `mt-[var(--nav-height)]` instead of internal padding, and hero/header content lives inside `SFPanel` components. The `pt-10` target ceased to exist. Per `feedback_ratify_reality_bias.md`, ratifying reality (mark OBSOLETE) beats reverting to fit a stale spec. Future readers seeing VPT-03 marked `Obsolete` in the traceability matrix can find the rationale on the requirement line itself.

**Ratifying already-shipped code (VPT-02 / VPT-04).** The grid breakpoint and Storybook viewport presets were both shipped during earlier phases without crossing the VPT requirement boundary cleanly — VPT-02 likely landed during the inventory grid build in Phase 30s, and VPT-04 likely landed when Storybook was first configured. Adding RATIFIED annotations with file:line citations turns implicit code state into explicit, traceable spec compliance — useful for future audits and onboarding without adding regression test surface area (out of stabilization scope per CLAUDE.md).

**Phase 48 cleanup deferred.** Phase 48's `Plans:` line has the same stale `44-01-PLAN.md` reference. Fixing it now would expand Phase 47 scope; it's left for whoever plans Phase 48 to overwrite naturally.
