# LOCKDOWN ADDENDUM — R-63 · R-64

**Status:** DRAFT · pending user sign-off
**Target:** LOCKDOWN.md v0.1.1 → v0.1.2
**Scope:** introduce two coupled primitives — the Panel Model (layout) and the Keyboard Model (interaction). R-63 is the layout primitive; R-64 is the interaction consequence that falls out once R-63 holds.
**Author discussion:** 2026-04-22 session, user confirmed viewport-locked panels + spacebar-advance + integer-multiple page height.

> **Why coupled:** keyboard advance is only honest if every panel is the same size and the page ends on a whole frame. Ship them together or not at all — a partially-panelled site with spacebar-advance is worse than no keyboard model.

---

## 1 · What this addendum adds to LOCKDOWN.md

1. **New subsection §4.4 · PANEL MODEL** with rule family **R-63**
2. **New subsection §9.7 · KEYBOARD MODEL** with rule family **R-64**
3. **§13 carry-items** for the retrofit work (existing pages do not yet conform)
4. **§14 execution-queue items** for the implementation
5. **New tokens** in `app/globals.css`
6. **New primitive** `SFPanel` in `components/sf/`
7. **New hook** `hooks/use-frame-navigation.ts`

---

## 2 · §4.4 · PANEL MODEL (R-63)

Each page is composed of N viewport-height **panels**. Total document scroll-height is exactly `N × port-height` — no partial frames, no orphan content below the last full panel. This is the layout primitive; R-64 is the interaction that falls out of it.

> **Trademark elevation:** the panel is now a first-class system primitive alongside T1 (pixel-sort), T2 (glyph), T3 (cube), T4 (`//`). Every page ships as a deck, not a long-scroll document.

| # | Rule | Source |
|---|---|---|
| **R-63-a** | Panel height = `100dvh` (dynamic viewport). `100svh` as fallback / floor for fit-mode composition. Never raw `vh` — mobile browser chrome eats it and composition reflows mid-transition. | pending execution |
| **R-63-b** | Total page scroll-height is an integer multiple of port height: `document.documentElement.scrollHeight === N × window.innerHeight` within sub-pixel tolerance. No half-panels, no trailing gutters. Dev-only assertion warns on violation. | pending execution |
| **R-63-c** | **No internal scroll inside a panel.** A panel that scrolls internally breaks R-64 — the user presses Space, nothing visible happens, the keyboard model dies silently. Content that exceeds the port either recomposes (fit-mode) or paginates across panels. | pending execution |
| **R-63-d** | Two authorial modes, author picks per panel: **`fit`** — content composes inside the port, type scales via `clamp()` with viewport units. **`fill`** — content fills edge-to-edge, may recompose per aspect ratio. Every panel is one or the other. | pending execution |
| **R-63-e** | **Pinned sections count as one panel externally.** `PinnedSection` (THESIS, future pins) internally consumes N × port of scroll distance for sub-phase choreography — that distance is transparent to the keyboard model. R-64 skips the entire pin on one keystroke. | `PinnedSection` + R-64 coupling |
| **R-63-f** | New primitive **SFPanel** — thin wrapper enforcing `height: var(--sf-panel-height)`, `overflow: hidden`, auto-sets `data-section`, takes `mode="fit" \| "fill"` prop. All page composition is `<SFPanel>` children; raw `<section>`/`<div>` panel-sized blocks are a violation. | pending execution |
| **R-63-g** | **Long-form prose exception — DECIDE.** Articles, case-study writeups, documentation pages may not fit one port. Two resolutions: **(a)** paginate across multiple SFPanel frames, or **(b)** introduce a dedicated prose-page template where R-63 is explicitly relaxed. User decision required before any such page ships. | pending user DECIDE |
| **R-63-h** | Typography gains a **`-fluid` tier** layered on top of the semantic aliases (§3). `heading-1`, `body`, etc. remain stable; `heading-1-fluid` etc. layer `clamp(min, preferred-vi, max)` for fit-mode composition. Fixed-size tier unchanged. | pending execution |
| **R-63-i** | Panel registry (panel offsets in px) is cached on mount, invalidated via `ResizeObserver` (port resize) + `MutationObserver` (DOM shape change). Per R-61 — no `getBoundingClientRect` reads in per-frame or per-keystroke hot paths. | R-61 compliance |

**New tokens** (`app/globals.css`):

```css
--sf-panel-height: 100dvh;       /* canonical */
--sf-panel-height-floor: 100svh; /* fit-mode floor, older Safari */
--sf-panel-height-max: 100lvh;   /* ceiling if explicitly needed */
```

**Why:** the deck model is the register we've been building toward — Apple-keynote / Linear-landing / TDR-spread rhythm. Each transition is intentional. It also forces authorial sharpness: if your content doesn't compose in a port, either the content is wrong or the type scale is wrong. Non-conformance is self-evident — you see a half-panel and it's broken.

---

## 3 · §9.7 · KEYBOARD MODEL (R-64)

The site is **fully mouse-operable** and **optimized for keyboard on desktop**. Spacebar advances one frame — the verb literally mirrors the FRAME/SIGNAL metaphor. Mobile is unaffected (no hardware keyboard). This is a commitment to a keyboard-first desktop input model, not just WCAG-floor navigability.

| # | Rule | Source |
|---|---|---|
| **R-64-a** | **Mouse parity is mandatory.** Every keyboard affordance has a mouse equivalent and vice versa. No hover-only reveals without focus equivalents. No "click outside to dismiss" without Esc. | §9.3 extension |
| **R-64-b** | **WCAG AA floor.** Visible focus rings on every interactive surface (primary-tinted, hard-edged — no glow, no soft elevation; matches DU/TDR register). Logical tab order matches visual reading order. No `tabindex > 0` hacks. Skip-to-content link at document start. | §9.3 extension |
| **R-64-c** | **`Space` advances to the next panel boundary** (R-63 snap target). **`Shift+Space`** retreats. **`PageDown`/`PageUp`** aliased to same behavior. **`Home`/`End`** jump to first/last panel. One keypress = one frame transition. | pending execution |
| **R-64-d** | **Focus guards — non-negotiable.** Keybindings are inactive when focus is inside `<input>`, `<textarea>`, `[contenteditable]`, `[role="textbox"]`, or `[role="combobox"]`. Native spacebar behavior preserved in those contexts. Without this guard, the site breaks every form and search field. | pending execution |
| **R-64-e** | **Motion.** Smooth scroll via `lenis.scrollTo(panelOffset, { lock: true })`. Under `prefers-reduced-motion: reduce`, instant jump — no tween. Input is locked during transition (debounce ≈ tween duration) to prevent mash-queueing past the destination. | `LenisProvider` + pending execution |
| **R-64-f** | **Mouse wheel stays continuous.** No wheel-snap, no scroll-jacking on wheel input. Snap is opt-in by keystroke; wheel remains fluid for users who want granular control (including inside pinned sections for sub-phase choreography). | pending execution |
| **R-64-g** | **R-61 compliance.** The keydown path never reads layout geometry. Panel offsets come from the cached registry (R-63-i). `ResizeObserver` + `MutationObserver` invalidate; the keystroke handler is O(1). | R-61 compliance |
| **R-64-h** | **R-62 compliance.** Low quality-tier forces instant jumps (skips Lenis tween). Keyboard model is free but must not re-introduce jank on low-end devices. | R-62 compliance |
| **R-64-i** | **Discoverability — staged.** v0.1: silent (power-user reward). v0.2+: `?` cheatsheet overlay listing the full keymap in FRAME vocabulary (`Space — Next frame`, `Shift+Space — Previous frame`, etc.). CommandPalette (`⌘K`, already shipped) extends with `nextFrame` / `prevFrame` / `firstFrame` / `lastFrame` palette commands. | pending v0.2 |
| **R-64-j** | **Route-switch focus handling.** On route change, focus moves to the new route's `<h1>` or first panel heading. Focus never lands nowhere. Focus trap in overlays (NavOverlay, CommandPalette, dialogs) returns focus to the trigger element on dismiss. | pending execution |

**New hook** (`hooks/use-frame-navigation.ts`):

```ts
// signature sketch — real implementation pending
function useFrameNavigation(): void {
  // - reads panel positions from a ref-cached registry
  // - subscribes to Lenis for current scroll position
  // - binds keydown at document level with focus guards
  // - invalidates registry on resize + DOM mutation
}
```

Installed once at `app/layout.tsx` via a client component (`<FrameNavigation />`).

**Why:** spacebar-as-frame-advance is not a power-user cherry on top — it's the only honest interaction verb once the panel model is locked. Each panel is a frame. Space advances the frame. The keyboard becomes the first-class navigation surface on desktop, matching the editorial rhythm of the deck model.

---

## 4 · §13 additions (known issues, carry to v0.2)

Append to §13 "Open" list:

- **Panel model retrofit** — existing pages (`/`, `/system`, `/inventory`, `/reference`, `/init`, `/builds`, `/builds/[slug]`) are not yet `N × port` compliant. Pre-R-63 composition assumed variable-height sections. Retrofit is an execution item — each page audited, sections converted to SFPanel, total height reconciled.
- **Prose pages DECIDE (R-63-g)** — no existing page currently ships long-form prose, but `/reference` (158 API surfaces) is close. Decide paginate-across-panels vs dedicated prose template before next doc-heavy page.
- **Keyboard model retrofit** — existing overlays (NavOverlay, CommandPalette, SFDialog instances) need R-64-j audit: do they return focus to trigger on close? Are focus traps correct?
- **Typography `-fluid` tier unbuilt** — R-63-h requires fluid variants of semantic aliases; currently only fixed-size scale exists (§3.2).

---

## 5 · §14 additions (execution queue)

Append to §14:

8. Add `--sf-panel-height` / `-floor` / `-max` tokens to `app/globals.css`.
9. Build `SFPanel` primitive in `components/sf/sf-panel.tsx`, add to barrel export.
10. Build `useFrameNavigation` hook + `<FrameNavigation />` mount in `app/layout.tsx`.
11. Retrofit homepage `/` to SFPanel composition (6 blocks → 6 panels, ENTRY may be 1 panel with pin-subphases transparent).
12. Retrofit `/system`, `/inventory`, `/reference`, `/init`, `/builds`, `/builds/[slug]` to SFPanel composition.
13. Add dev-only assertion: warn when `scrollHeight % innerHeight !== 0` (within tolerance).
14. Audit every overlay for R-64-j (focus-return on dismiss).
15. Build `-fluid` typography tier (R-63-h) — `heading-1-fluid` etc. with `clamp()` scaling.
16. v0.2: `?` cheatsheet overlay + CommandPalette `nextFrame`/`prevFrame`/`firstFrame`/`lastFrame` entries (R-64-i).

---

## 6 · DECIDE callbacks

Items that require explicit user sign-off before implementation begins:

- **D-08 · R-63-g** — long-form prose handling: paginate across panels (a) or dedicated relaxed template (b)?
- **D-09 · R-64-i timing** — ship `?` cheatsheet in v0.1 along with R-64 (teach the model at introduction), or defer to v0.2 (silent power-user reward first, then announce)?
- **D-10 · R-64-b focus ring style** — confirm "hard-edged, primary-tinted, no glow" matches intent. Alternative: double-ring (1px offset) for a TDR-ish monospaced-box feel. Worth a quick visual probe before locking.
- **D-11 · ENTRY panel count** — is ENTRY one panel (pin-subphases internal) or N panels (each sub-phase is its own frame, spacebar steps through them)? R-63-e says one; user may prefer the richer mapping for the hero specifically.

---

## 7 · Merge plan

On approval:

1. Bump LOCKDOWN.md header to **v0.1.2**, update "Audit inputs" line with the 2026-04-22 keyboard/panel session.
2. Insert §4.4 and §9.7 in-place (not as appendix — full citizens of the spec).
3. Append §13 and §14 items.
4. Commit as `Feat: LOCKDOWN v0.1.2 — R-63 panel model + R-64 keyboard model`.
5. Delete this addendum file (it lives in git history).

---

*Draft end. Reply with DECIDE answers to D-08 / D-09 / D-10 / D-11, plus any rule edits, then I'll merge into LOCKDOWN.md.*
