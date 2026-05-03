---
phase: 76-final-gate
status: deferred
inherited_from: [74-sffileupload, 75-sfdaterangepicker]
items_total: 11
items_signed_off: 0
created: 2026-05-02
updated: 2026-05-02
note: |
  Consolidates 11 manual-only verification items from Phase 74 (M-01..M-07) and
  Phase 75 (M-01..M-04) into a single inheritable document for the v1.11 milestone
  or a hardening pass. Per `feedback_audit_before_planning.md` precedent, items
  remain in this doc until user signs off; manual UAT failures route to a follow-up
  phase, NOT a v1.10 phase reopen.
  These items DO NOT block v1.10 milestone close.
---

# Phase 76 — Consolidated Human Verification (Deferred)

> 11 manual-only verification items copied verbatim from Phase 74 and Phase 75 HUMAN-UAT docs.
> Each item has a permanent test surface (mobile device, screen reader, cross-browser, real Chromium drag-drop) that cannot be exercised in CI Playwright.
> Items remain here until user signs off; do NOT delete to "clear the list".

---

## Phase 74 Carry-Forward (M-01..M-07) — SFFileUpload

### M-01 — Drag-active visual state on real Chromium

- **Requirement:** FU-01
- **Why manual:** Computed-style assertion across hover/dragover transitions doesn't survive Playwright's synthetic event injection
- **Test instructions:**
  1. Visit `/dev-playground/sf-file-upload` in Chromium (Chrome or Edge)
  2. Drag a file from Finder/Explorer over the drop zone
  3. Confirm drop zone background shifts to `bg-foreground/10` on dragover
  4. Drag away (still over the page) — confirm the bg reverts on dragleave
  5. Sign off ONLY if both transitions render visibly within 100ms
- **Status:** deferred
- **Sign-off date:** {pending}
- **Sign-off by:** {pending}

### M-02 — Real drag→drop ingestion (the permanent gap)

- **Requirement:** FU-05 (the permanent Chromium `dataTransfer.files` gap)
- **Why manual:** Documented as first-class FU-05 deliverable in `74-VERIFICATION.md` §Permanent Gap with 3 primary sources. Playwright `setInputFiles` exercises the input fallback, NOT the drag→drop path
- **Test instructions:**
  1. Visit `/dev-playground/sf-file-upload` in Chromium
  2. Drag an image file from Finder/Explorer onto the drop zone and release
  3. Confirm file appears in the list with image preview thumbnail (`blob:` URL)
  4. Repeat with a non-image file (e.g. PDF) — confirm placeholder icon renders
  5. Sign off ONLY if both ingestion paths complete with correct previews
- **Status:** deferred
- **Sign-off date:** {pending}
- **Sign-off by:** {pending}

### M-03 — Image preview render quality

- **Requirement:** FU-02
- **Why manual:** Visual flicker / broken-image flash is rendering-pipeline timing, not assertable in Playwright
- **Test instructions:**
  1. Drag-drop 5 images via M-02 path
  2. Confirm each preview `<img>` renders within ~100ms with no flicker
  3. Click × to remove each in turn — confirm no broken-image flash on removal
  4. Sign off ONLY if all 5 transitions are clean
- **Status:** deferred
- **Sign-off date:** {pending}
- **Sign-off by:** {pending}

### M-04 — `URL.revokeObjectURL` on removal

- **Requirement:** FU-02 (memory hygiene)
- **Why manual:** DevTools Memory tab inspection isn't a CI assertion
- **Test instructions:**
  1. Open Chrome DevTools → Memory → "Allocation instrumentation on timeline"
  2. Drag-drop 10 images, then × remove each
  3. Stop recording; filter retained objects for `Blob` / `blob:` URL
  4. Confirm zero orphaned blob: URLs after × remove
  5. Sign off ONLY if heap shows clean revocation
- **Status:** deferred
- **Sign-off date:** {pending}
- **Sign-off by:** {pending}

### M-05 — Screen reader announcement (macOS VoiceOver)

- **Requirement:** FU-04 (a11y)
- **Why manual:** SR cursor navigation and announcement timing not exercised by CI axe-core
- **Test instructions:**
  1. macOS VoiceOver: visit `/dev-playground/sf-file-upload`
  2. Tab to drop zone; activate file picker via Space
  3. Select 2 files in the OS dialog
  4. Confirm VoiceOver announces "2 files selected" (or equivalent semantics)
  5. Tab to one of the file rows; activate × button
  6. Confirm VoiceOver announces "{name} removed" (or equivalent)
  7. Sign off ONLY if both announcements convey state semantically
- **Status:** deferred
- **Sign-off date:** {pending}
- **Sign-off by:** {pending}

### M-06 — Light + dark mode parity

- **Requirement:** FU-01..05 cumulative
- **Why manual:** Cross-mode visual diff not in Chromatic baseline scope
- **Test instructions:**
  1. Visit `/dev-playground/sf-file-upload` in light mode
  2. Walk: empty drop zone, dragover state, populated file list, removal hover, error state, progress bar
  3. Toggle to dark mode (if theme toggle present, else `prefers-color-scheme: dark` via DevTools)
  4. Re-walk the same 6 states
  5. Sign off ONLY if all 6 states are legible in both modes (no contrast failures, no invisible borders)
- **Status:** deferred
- **Sign-off date:** {pending}
- **Sign-off by:** {pending}

### M-07 — Keyboard parity (LOCKDOWN R-64-d)

- **Requirement:** FU-04 (keyboard model)
- **Why manual:** Browser-native file dialog interception varies (the LOCKDOWN R-64-d Space-key behavior must NOT advance the panel cursor)
- **Test instructions:**
  1. Visit `/dev-playground/sf-file-upload`
  2. Tab focus to the drop zone (or its trigger button)
  3. Press Space — confirm OS file dialog opens AND the surrounding panel does NOT advance focus to the next focusable
  4. Cancel the dialog — confirm focus returns to the drop zone
  5. Sign off ONLY if Space behavior is deterministic across attempts
- **Status:** deferred
- **Sign-off date:** {pending}
- **Sign-off by:** {pending}

---

## Phase 75 Carry-Forward (M-01..M-04) — SFDateRangePicker

### M-01 — Touch-target on calendar day cells

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

### M-02 — Screen-reader announce of range selection

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

### M-03 — Popover positioning on small viewport (375px width)

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

### M-04 — `<SFInput type="time">` keyboard parity across browsers

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

## Phase 76 New Items

(none captured — user resume-signal `continue` did not include `approved-with-notes: <details>`)

---

## Resolution Path

These 11 items do **NOT** block v1.10 milestone close. They are tracked here as the durable backlog for:

- **v1.11 hardening pass** — recommended sequence; bundle items into a dedicated UAT phase.
- **Ad-hoc as-encountered fixes** — if any item fails when the user reaches it organically, file a follow-up plan rather than reopening v1.10.
- **Independent partial sign-off** — items can be signed off individually; partial sign-off is acceptable for v1.10 close.

If any item FAILS during user verification, file a follow-up phase (Phases 74 + 75 NOT reopened mid-milestone per `feedback_audit_before_planning.md` precedent).

Status frontmatter `items_signed_off` increments as items are completed.
