---
phase: 75-sfdaterangepicker
status: pending_user_signoff
items_total: 4
items_signed_off: 0
created: 2026-05-02
---

# Phase 75 — Human Verification (Deferred)

> 4 manual-only verification items copied verbatim from `75-VALIDATION.md` §Manual-Only Verifications.
> Each item has a permanent test surface (mobile device + screen reader + cross-browser) that cannot be exercised in CI Playwright.
> Items remain in this doc until user signs off; do NOT delete to "clear the list" (T-75-V09 mitigation).

---

## M-01 — Touch-Target on Calendar Day Cells

- **Requirement:** DR-01
- **Why manual:** react-day-picker default sizing may not hit 44×44 minimum on mobile with `rounded-none` override; only iPhone Safari real-device tap can confirm hit-area
- **Test instructions:**
  1. Visit `/showcase/date-range-picker` on iPhone Safari (or simulator with realistic touch model)
  2. Tap a day cell with thumb (not finger-pointed precision)
  3. Confirm tap registers reliably on first attempt across ≥10 randomly-selected day cells
  4. Sign off ONLY if 10/10 taps register correctly
- **Status:** deferred
- **Sign-off date:** {pending}
- **Sign-off by:** {pending}

---

## M-02 — Screen-Reader Announce of Range Selection

- **Requirement:** DR-01
- **Why manual:** NVDA/VoiceOver behavior on `<button aria-pressed>` cells varies; CI axe-core does not exercise SR cursor navigation
- **Test instructions:**
  1. NVDA (Windows) or VoiceOver (macOS): visit `/showcase/date-range-picker`
  2. Open the popover trigger via Enter
  3. Navigate calendar with arrow keys
  4. Hit Enter on start day cell — confirm announcement includes "selected" or "range start"
  5. Hit Enter on end day cell — confirm announcement includes "range end" (or equivalent semantics)
  6. Sign off ONLY if both announcements convey selection state semantically (exact wording may vary by SR)
- **Status:** deferred
- **Sign-off date:** {pending}
- **Sign-off by:** {pending}

---

## M-03 — Popover Positioning on Small Viewport (375px width)

- **Requirement:** DR-02
- **Why manual:** Radix UI auto-positions but may collide with viewport edge in `withTime` mode; only real mobile viewport can confirm collision-avoidance
- **Test instructions:**
  1. Mobile Safari (iPhone SE viewport, 375×667 logical) or Chrome DevTools mobile-emulation at 375px
  2. Visit `/showcase/date-range-picker`
  3. Scroll to Section 3 (withTime fixture)
  4. Tap the trigger when it is positioned near the right viewport edge
  5. Confirm popover flips OR repositions to stay within viewport (no horizontal scroll)
  6. Sign off ONLY if popover is fully visible AND no horizontal page scroll appears
- **Status:** deferred
- **Sign-off date:** {pending}
- **Sign-off by:** {pending}

---

## M-04 — `<SFInput type="time">` Keyboard Parity Across Browsers

- **Requirement:** DR-04
- **Why manual:** Native `type="time"` UX varies (Chrome step-arrows vs Safari spinner vs Firefox); cross-browser real-device behavior cannot be E2E-verified in CI
- **Test instructions:**
  1. Open `/showcase/date-range-picker` in Chrome, Safari, AND Firefox (3 browsers)
  2. Toggle Section 3 (withTime fixture)
  3. Click the Start time input; type "10:30" then Tab to End time input; type "17:45"
  4. In each browser: verify the typed value appears in the JSON echo `<pre>` block AND the input visually displays the typed value
  5. In each browser: verify arrow keys (Up/Down) increment/decrement the time when input is focused
  6. Sign off ONLY if all 3 browsers produce coherent typed-value behavior AND functional arrow-key adjustment
- **Status:** deferred
- **Sign-off date:** {pending}
- **Sign-off by:** {pending}

---

## Sign-Off Protocol

- User runs each item AND records the date + their identifier (initials or name)
- Items can be signed off independently — partial sign-off is acceptable for v1.10 close
- If any item FAILS during user verification, file a follow-up phase (Phase 75 NOT reopened mid-milestone per `feedback_audit_before_planning.md` precedent)
- Status frontmatter `items_signed_off` increments as items are completed
