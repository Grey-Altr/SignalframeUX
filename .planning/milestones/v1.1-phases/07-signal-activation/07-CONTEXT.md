# Phase 7: SIGNAL Activation - Context

**Gathered:** 2026-04-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Multi-sensory SIGNAL activation — canvas cursor placement on all showcase sections, idle state animation (grain drift + OKLCH color pulse), Web Audio oscillator feedback, Vibration API haptics with graceful Safari/iOS degradation. All effects respect prefers-reduced-motion.

</domain>

<decisions>
## Implementation Decisions

### Audio Feedback Design
- Hover on interactive components (buttons, cards, links) triggers audio — DU/TDR terminal "acknowledgment" pattern
- Square wave oscillator, 200-800Hz frequency range — terminal/CRT register, not musical or UI-sounding
- Very low gain (0.03-0.08) — ambient, not attention-grabbing
- Audio entirely suppressed when prefers-reduced-motion is active — silent + static

### Idle State Behavior
- 8-second inactivity threshold before idle activates
- Subtle grain drift — shift existing grain overlay opacity/position via `lib/grain.ts`
- OKLCH color pulse: slow oscillation of `--color-primary` lightness ±5% over 4s cycle — barely perceptible
- Instant snap-back on any mouse/keyboard/touch event — no fade transition

### Haptic & Cursor Activation
- Haptic vibration: single 10ms pulse on click, 5ms on hover — micro-vibration
- All sections on homepage + all showcase pages get `[data-cursor]` — blanket coverage per SIG-09
- Same crosshair + particle trail everywhere — consistency is the aesthetic
- Safari/iOS: silent no-op via `navigator.vibrate` check, no error, no console warning

### Claude's Discretion
- Web Audio API initialization timing (user gesture gating strategy)
- Idle state animation implementation approach (CSS custom properties vs GSAP)
- Audio oscillator parameter tuning (exact frequencies per interaction type)
- Grain drift implementation details (reuse vs extend lib/grain.ts)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/animation/canvas-cursor.tsx` — existing CanvasCursor with crosshair + particle trail, scoped to `[data-cursor]` sections
- `lib/grain.ts` — grain effect utility already implemented
- `components/animation/color-cycle-frame.tsx` — OKLCH color cycling animation pattern
- `components/layout/global-effects.tsx` — global effect mounting pattern
- `lib/color-resolve.ts` — OKLCH→sRGB bridge (from Phase 6)
- `components/sf/sf-section.tsx` — section primitive with `data-section` attribute

### Established Patterns
- `prefers-reduced-motion` handled in 22+ components — matchMedia listener pattern
- GSAP ticker integration via `lib/gsap-core.ts`
- `[data-cursor]` attribute scoping already in canvas-cursor.tsx — just needs placement
- Global effects lazy-loaded via `global-effects-lazy.tsx`

### Integration Points
- `app/page.tsx` — homepage sections needing `[data-cursor]`
- Showcase pages — all need `[data-cursor]` on relevant sections
- `components/layout/global-effects.tsx` — idle state detection mounts here
- `components/sf/sf-section.tsx` — could add `[data-cursor]` at the primitive level

</code_context>

<specifics>
## Specific Ideas

- DU/TDR terminal voice register for audio — not generic UI sounds, more like acknowledgment tones from industrial/terminal interfaces
- Grain drift should feel like the site is "breathing" when idle — alive but not distracting
- Haptics should be imperceptible on first notice, only consciously felt after repeated use

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
