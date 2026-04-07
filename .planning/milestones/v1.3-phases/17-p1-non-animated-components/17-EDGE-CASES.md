---
phase: 17-p1-non-animated-components
generated: "2026-04-06T00:00:00Z"
finding_count: 5
high_count: 0
has_bdd_candidates: false
---

# Phase 17: Edge Cases

**Generated:** 2026-04-06
**Findings:** 5 (cap: 8)
**HIGH severity:** 0
**BDD candidates:** no

## Findings

### 1. [MEDIUM] SFAvatar loading state gap between image request and render

**Plan element:** `components/sf/sf-avatar.tsx`
**Category:** empty_state

The plan covers the fallback chain (image -> initials -> icon) but does not address what renders during the loading state before the image resolves or errors. Radix Avatar handles this internally via its onLoadingStatusChange, so risk is low.

### 2. [MEDIUM] SFAlert icon slot usage unspecified

**Plan element:** `components/sf/sf-alert.tsx`
**Category:** empty_state

CVA variants include `[&>svg]:text-primary` selectors implying icon support, but the plan does not specify default icons per intent or document whether icons are optional. Falls under Claude's Discretion per CONTEXT.md.

### 3. [MEDIUM] SFStatusDot GSAP ease value must be GSAP string not CSS variable

**Plan element:** `components/sf/sf-status-dot.tsx`
**Category:** error_path

The CONTEXT.md decision says use `--ease-default` but GSAP cannot parse CSS custom property strings. Plan 02 Task 2 action correctly specifies `ease: "power2.out"` which is valid GSAP syntax. Executor should use GSAP-native ease, not CSS var reference.

### 4. [LOW] SFEmptyState Bayer dither base64 PNG is placeholder in plan

**Plan element:** `components/sf/sf-empty-state.tsx`
**Category:** boundary_condition

The action specifies base64 PNG data URI but uses `"data:image/png;base64,..."` as placeholder text. Executor must generate an actual 8x8 ordered dither pattern. The action explicitly acknowledges this.

### 5. [LOW] ComponentsExplorer grep verify command may have false positives

**Plan element:** `components/blocks/components-explorer.tsx`
**Category:** boundary_condition

The verify command `grep -c "013|014|015|016|017|018|019"` could match other numeric occurrences. Build verification (`pnpm build`) provides the primary safety net.
