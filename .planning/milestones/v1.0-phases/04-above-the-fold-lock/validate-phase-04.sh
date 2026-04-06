#!/usr/bin/env bash
# Phase 4 — Above-the-Fold Lock: Behavioral Validation Suite
# Runs grep-based checks against source files, reporting named pass/fail per requirement.
# Usage: bash .planning/phases/04-above-the-fold-lock/validate-phase-04.sh

set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../" && pwd)"

PASS=0
FAIL=0

check() {
  local label="$1"
  local req="$2"
  shift 2
  if "$@" &>/dev/null; then
    echo "  PASS  [$req] $label"
    PASS=$((PASS + 1))
  else
    echo "  FAIL  [$req] $label"
    FAIL=$((FAIL + 1))
  fi
}

echo ""
echo "Phase 4 — Above-the-Fold Lock: Validation Suite"
echo "================================================"
echo ""

# ── ATF-01 / ATF-02: Hero animation timeline (04-01) ──────────────────────────

echo "04-01: Hero Animation Timeline"

# hero-mesh GSAP target exists in page-animations.tsx
check \
  "hero-mesh GSAP target at delay:0 in page-animations.tsx" \
  "ATF-02" \
  grep -qn "hero-mesh" "$ROOT/components/layout/page-animations.tsx"

# hero-mesh fade fires with delay:0 (not a later delay)
check \
  "hero-mesh fromTo uses delay: 0 (first visible motion)" \
  "ATF-02" \
  grep -qn "delay: 0" "$ROOT/components/layout/page-animations.tsx"

# hero-char SplitText fires at delay:0.4 (not the original 2.3)
check \
  "hero-char SplitText reveal fires at delay:0.4" \
  "ATF-02" \
  grep -qn "delay: 0\.4" "$ROOT/components/layout/page-animations.tsx"

# hero-mesh wrapper in hero.tsx has data-anim attribute
check \
  "hero.tsx HeroMesh wrapper has data-anim=\"hero-mesh\"" \
  "ATF-01" \
  grep -qn 'data-anim="hero-mesh"' "$ROOT/components/blocks/hero.tsx"

# hero-mesh starts at opacity-0 (GSAP controls fade-in, not CSS)
check \
  "hero.tsx HeroMesh wrapper starts at opacity-0" \
  "ATF-01" \
  grep -qn "opacity-0" "$ROOT/components/blocks/hero.tsx"

# no layout-triggering properties animated (no width/height/padding/margin in initHeroAnimations)
check \
  "hero animation uses only opacity/transform/filter — no CLS-risk properties" \
  "ATF-02" \
  bash -c "! grep -n 'gsap\.\(to\|fromTo\|set\)' '$ROOT/components/layout/page-animations.tsx' | grep -E '\"(width|height|padding|margin|top|left|right|bottom)\"'"

echo ""

# ── ATF-03: Honest component count (04-01) ────────────────────────────────────

echo "04-01: Component Count Accuracy"

# stats-band shows "28" not "340"
check \
  "stats-band.tsx shows value \"28\" (not inflated 340)" \
  "ATF-03" \
  grep -qn '"28"' "$ROOT/components/blocks/stats-band.tsx"

# stats-band has no "340" remaining
check \
  "stats-band.tsx has no remaining \"340\" claim" \
  "ATF-03" \
  bash -c "! grep -q '\"340\"' '$ROOT/components/blocks/stats-band.tsx'"

# page.tsx metadata contains "28" and "growing"
check \
  "app/page.tsx metadata description contains \"28\" and \"growing\"" \
  "ATF-03" \
  bash -c "grep -q '28' '$ROOT/app/page.tsx' && grep -q 'growing' '$ROOT/app/page.tsx'"

# hero.tsx right panel displays component count line with "growing"
check \
  "hero.tsx right panel contains \"28 SF COMPONENTS AND GROWING\"" \
  "ATF-03" \
  grep -qi "28.*growing\|AND GROWING" "$ROOT/components/blocks/hero.tsx"

echo ""

# ── ATF-04: Error and not-found pages (04-02) ────────────────────────────────

echo "04-02: Crafted Error and Not-Found Pages"

# error.tsx uses SFContainer for FRAME structure
check \
  "app/error.tsx imports and uses SFContainer" \
  "ATF-04" \
  grep -qn "SFContainer" "$ROOT/app/error.tsx"

# error.tsx uses SFText for typography
check \
  "app/error.tsx imports and uses SFText" \
  "ATF-04" \
  grep -qn "SFText" "$ROOT/app/error.tsx"

# error.tsx has data-anim="error-code" for ScrambleText targeting
check \
  "app/error.tsx error code element has data-anim=\"error-code\"" \
  "ATF-04" \
  grep -qn 'data-anim="error-code"' "$ROOT/app/error.tsx"

# error.tsx has sf-glitch VHS effect class
check \
  "app/error.tsx error code element has sf-glitch class" \
  "ATF-04" \
  grep -qn "sf-glitch" "$ROOT/app/error.tsx"

# error.tsx guards ScrambleText with prefers-reduced-motion check
check \
  "app/error.tsx ScrambleText is guarded by prefers-reduced-motion matchMedia check" \
  "ATF-04" \
  grep -qn "prefers-reduced-motion" "$ROOT/app/error.tsx"

# not-found.tsx uses SFContainer for FRAME structure
check \
  "app/not-found.tsx imports and uses SFContainer" \
  "ATF-04" \
  grep -qn "SFContainer" "$ROOT/app/not-found.tsx"

# not-found.tsx uses SFText for typography
check \
  "app/not-found.tsx imports and uses SFText" \
  "ATF-04" \
  grep -qn "SFText" "$ROOT/app/not-found.tsx"

# not-found.tsx 404 heading has data-anim for ScrambleText wiring
check \
  "app/not-found.tsx 404 heading has data-anim=\"page-heading\" for ScrambleText" \
  "ATF-04" \
  grep -qn 'data-anim="page-heading"' "$ROOT/app/not-found.tsx"

# not-found.tsx is a Server Component (no "use client")
check \
  "app/not-found.tsx is a Server Component (no \"use client\" directive)" \
  "ATF-04" \
  bash -c "! grep -q '\"use client\"' '$ROOT/app/not-found.tsx'"

echo ""

# ── ATF-05: Empty states (04-02) ─────────────────────────────────────────────

echo "04-02: Empty States as First-Class Design Moments"

# ComponentsExplorer has a conditional branch for filtered.length === 0
check \
  "components-explorer.tsx renders a designed empty state when filtered.length === 0" \
  "ATF-05" \
  grep -qn "filtered.length === 0" "$ROOT/components/blocks/components-explorer.tsx"

# ComponentsExplorer empty state has a reset CTA
check \
  "components-explorer.tsx empty state has RESET FILTERS action" \
  "ATF-05" \
  grep -qi "RESET FILTERS" "$ROOT/components/blocks/components-explorer.tsx"

# API explorer COMING SOON placeholder uses DU/TDR voice
check \
  "api-explorer.tsx COMING SOON placeholder uses DU/TDR voice" \
  "ATF-05" \
  grep -qn "SIGNAL WILL BE TRANSMITTED" "$ROOT/components/blocks/api-explorer.tsx"

# Token explorer has structural placeholder (extended scales CTA)
check \
  "token-tabs.tsx COLOR tab shows structural placeholder with extended scale count" \
  "ATF-05" \
  grep -qi "EXTENDED SCALES" "$ROOT/components/blocks/token-tabs.tsx"

# Token explorer placeholder has a SHOW ALL CTA
check \
  "token-tabs.tsx structural placeholder has SHOW ALL scales CTA" \
  "ATF-05" \
  grep -qi "SHOW ALL" "$ROOT/components/blocks/token-tabs.tsx"

echo ""

# ── ATF-06: Reduced-motion coverage (04-03) ──────────────────────────────────

echo "04-03: Reduced-Motion as First-Class Experience"

# globals.css has prefers-reduced-motion media query
check \
  "app/globals.css contains prefers-reduced-motion media query blocks" \
  "ATF-06" \
  grep -qn "prefers-reduced-motion" "$ROOT/app/globals.css"

# hero-mesh is in the reduced-motion reset block
check \
  "app/globals.css has [data-anim=\"hero-mesh\"] in reduced-motion reset block" \
  "ATF-06" \
  grep -qn 'data-anim="hero-mesh"' "$ROOT/app/globals.css"

# error-code is in the reduced-motion reset block
check \
  "app/globals.css has [data-anim=\"error-code\"] in reduced-motion reset block" \
  "ATF-06" \
  grep -qn 'data-anim="error-code"' "$ROOT/app/globals.css"

# hero-mesh has an initial-state CSS rule (opacity:0) for GSAP control
check \
  "app/globals.css has hero-mesh initial-state CSS rule (opacity:0 for GSAP)" \
  "ATF-06" \
  bash -c "grep -A2 'data-anim.*hero-mesh' '$ROOT/app/globals.css' | grep -q 'opacity: 0'"

# error-code has an initial-state CSS rule (opacity:0) for GSAP control
check \
  "app/globals.css has error-code initial-state CSS rule (opacity:0 for GSAP)" \
  "ATF-06" \
  bash -c "grep -A2 'data-anim.*error-code' '$ROOT/app/globals.css' | grep -q 'opacity: 0'"

# SIGNAL-SPEC.md has the Reduced-Motion Behavior section (Section 7)
check \
  "SIGNAL-SPEC.md contains Reduced-Motion Behavior section" \
  "ATF-06" \
  grep -qn "Reduced-Motion" "$ROOT/.planning/phases/03-signal-expression/SIGNAL-SPEC.md"

# SIGNAL-SPEC.md documents QA-verified effects
check \
  "SIGNAL-SPEC.md has per-effect QA status column with Verified entries" \
  "ATF-06" \
  bash -c "[ \$(grep -c 'Verified' '$ROOT/.planning/phases/03-signal-expression/SIGNAL-SPEC.md') -ge 10 ]"

echo ""

# ── TypeScript build ──────────────────────────────────────────────────────────

echo "Build: TypeScript Compilation"

check \
  "npx tsc --noEmit passes with zero TypeScript errors" \
  "ATF-01..06" \
  bash -c "cd '$ROOT' && npx tsc --noEmit 2>&1; [ \$? -eq 0 ]"

echo ""

# ── Summary ───────────────────────────────────────────────────────────────────

TOTAL=$((PASS + FAIL))
echo "================================================"
echo "Results: $PASS/$TOTAL passed"
if [ "$FAIL" -gt 0 ]; then
  echo "Status: FAIL ($FAIL failing checks)"
  exit 1
else
  echo "Status: ALL GREEN"
  exit 0
fi
