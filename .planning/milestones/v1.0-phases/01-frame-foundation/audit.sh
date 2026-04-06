#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────
# Phase 1 — FRAME Foundation: Automated Audit Script
# Runs all grep verifications in sequence. Exit 0 = all pass.
# Run from project root: bash .planning/phases/01-frame-foundation/audit.sh
# ──────────────────────────────────────────────────────────────────

set -euo pipefail
PASS=0
FAIL=0
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

pass() { echo -e "${GREEN}PASS${NC}  $1"; PASS=$((PASS+1)); }
fail() { echo -e "${RED}FAIL${NC}  $1"; FAIL=$((FAIL+1)); }

echo "── Phase 1 / FRAME Foundation Audit ──────────────────────────"
echo ""

# ── FRM-01: Blessed spacing stops only (no 5, 7, 10 in sf/ blocks/ layout/) ──
echo "[FRM-01] Non-blessed Tailwind spacing sweep"
NONBLESSED=$(grep -rEn " (p|px|py|m|mx|my|gap|pt|pb|pl|pr|mt|mb|ml|mr)-(5|7|10)[^0-9]" \
  components/sf/ components/blocks/ components/layout/ \
  --include="*.tsx" 2>/dev/null || true)
if [ -z "$NONBLESSED" ]; then
  pass "FRM-01: Zero non-blessed spacing values in sf/, blocks/, layout/"
else
  fail "FRM-01: Non-blessed spacing values found:"
  echo "$NONBLESSED"
fi

# ── FRM-02: Semantic typography aliases defined in globals.css ──
echo ""
echo "[FRM-02] Semantic typography aliases"
for cls in "text-heading-1" "text-heading-2" "text-heading-3" "text-body" "text-small"; do
  if grep -q "$cls" app/globals.css 2>/dev/null; then
    pass "FRM-02: .$cls defined in globals.css"
  else
    fail "FRM-02: .$cls NOT found in globals.css"
  fi
done

# ── FRM-03: Layout tokens defined ──
echo ""
echo "[FRM-03] Layout tokens in globals.css"
for token in "max-w-content" "max-w-wide" "max-w-full" "gutter:" "gutter-sm"; do
  if grep -qF -- "--$token" app/globals.css 2>/dev/null; then
    pass "FRM-03: --$token present in globals.css"
  else
    fail "FRM-03: --$token NOT found in globals.css"
  fi
done

# ── FRM-04: CSS var() fallbacks — no bare color or font consumers ──
echo ""
echo "[FRM-04] CSS var() fallbacks on critical properties"
COLOR_BARE=$(grep -n "var(--color-[^,)]*)" app/globals.css 2>/dev/null | grep -v "@theme" | grep -v ", " || true)
if [ -z "$COLOR_BARE" ]; then
  pass "FRM-04: No bare color var() consumers without fallback"
else
  fail "FRM-04: Bare color var() calls without fallback:"
  echo "$COLOR_BARE"
fi

FONT_BARE=$(grep -n "var(--font-[^,)]*)" app/globals.css 2>/dev/null \
  | grep -v ":root\|@theme\|--text-heading\|--text-body\|--text-small\|--font-" || true)
if [ -z "$FONT_BARE" ]; then
  pass "FRM-04: No bare font var() consumers without fallback"
else
  fail "FRM-04: Bare font var() calls without fallback:"
  echo "$FONT_BARE"
fi

# ── FRM-05: Color tier documentation ──
echo ""
echo "[FRM-05] Color tier documentation block"
for keyword in "CORE" "EXTENDED" "EXPANSION POLICY"; do
  if grep -q "$keyword" app/globals.css 2>/dev/null; then
    pass "FRM-05: '$keyword' found in globals.css"
  else
    fail "FRM-05: '$keyword' NOT found in globals.css"
  fi
done

# ── FRM-06: VHS namespace migration ──
echo ""
echo "[FRM-06] VHS namespace (--vhs- must be zero, --sf-vhs- must exist)"
VHS_BARE=$(grep -c '\-\-vhs-[^s]' app/globals.css 2>/dev/null | tr -d '[:space:]' || echo "0")
VHS_BARE=${VHS_BARE:-0}
if [ "$VHS_BARE" -eq 0 ] 2>/dev/null; then
  pass "FRM-06: Zero bare --vhs- tokens (non-sf- prefix)"
else
  fail "FRM-06: $VHS_BARE bare --vhs- token(s) without sf- prefix"
fi

SF_VHS=$(grep -c '\-\-sf-vhs-' app/globals.css 2>/dev/null | tr -d '[:space:]' || echo "0")
if [ "$SF_VHS" -ge 4 ]; then
  pass "FRM-06: $SF_VHS --sf-vhs- occurrences (expected >= 4)"
else
  fail "FRM-06: Only $SF_VHS --sf-vhs- occurrences found (expected >= 4)"
fi

# ── FRM-07: CVA intent standard ──
echo ""
echo "[FRM-07] CVA intent + defaultVariants standard"
for component in "components/sf/sf-button.tsx" "components/sf/sf-badge.tsx" "components/sf/sf-toggle.tsx"; do
  if grep -q "defaultVariants" "$component" 2>/dev/null; then
    pass "FRM-07: $component has defaultVariants"
  else
    fail "FRM-07: $component missing defaultVariants"
  fi
done

if grep -q "pre-standard extension" components/sf/sf-button.tsx 2>/dev/null; then
  pass "FRM-07: signal intent documented as pre-standard extension in sf-button.tsx"
else
  fail "FRM-07: signal intent pre-standard extension comment missing from sf-button.tsx"
fi

# ── FRM-08: Print media block ──
echo ""
echo "[FRM-08] Print media stylesheet"
PRINT_COUNT=$(grep -c "@media print" app/globals.css 2>/dev/null || echo "0")
if [ "$PRINT_COUNT" -eq 1 ]; then
  pass "FRM-08: Exactly 1 @media print block found"
else
  fail "FRM-08: Expected 1 @media print block, found $PRINT_COUNT"
fi

if grep -q "display: none !important" app/globals.css 2>/dev/null && \
   grep -q "vhs-overlay" app/globals.css 2>/dev/null; then
  pass "FRM-08: .vhs-overlay suppressed in print block"
else
  fail "FRM-08: .vhs-overlay not suppressed in print block"
fi

if grep -q "background: white !important" app/globals.css 2>/dev/null; then
  pass "FRM-08: Background inverted to white in print block"
else
  fail "FRM-08: background: white !important not found in print block"
fi

# ── Summary ──────────────────────────────────────────────────────
echo ""
echo "──────────────────────────────────────────────────────────────"
echo "Results: ${GREEN}${PASS} passed${NC}  |  ${RED}${FAIL} failed${NC}"
if [ "$FAIL" -eq 0 ]; then
  echo -e "${GREEN}Phase 1 audit: ALL PASS${NC}"
  exit 0
else
  echo -e "${RED}Phase 1 audit: $FAIL FAILURE(S)${NC}"
  exit 1
fi
