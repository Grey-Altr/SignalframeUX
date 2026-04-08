# Phase 32: SIGNAL + PROOF Sections — Context

**Gathered:** 2026-04-08
**Status:** Ready for planning
**Source:** cdBrain wiki — v1.5-phase32-33-brief.md + v1.5-section-reference-map.md + v1.5-compile-back.md

<domain>
## Phase Boundary

Phase 32 delivers two consecutive full-viewport homepage sections:

1. **SIGNAL** — 150vh atmospheric parallax section. Full-viewport WebGL shader at maximum intensity. No text (one monospaced data point max). No interaction. Ikeda-reference: perceptual threshold, pure atmosphere.
2. **PROOF** — 100vh interactive layer-separation demo. Mouse (+ touch + gyroscope) drives `--signal-intensity`. The user physically separates the SIGNAL/FRAME layers. Pompidou-reference: machinery exposed as design.

**Phase order within Phase 32:** PROOF before SIGNAL. PROOF has a structural decision (FRAME-at-zero state) already locked; SIGNAL is low-risk and buildable after. Starting with SIGNAL risks false sense of completion before hitting PROOF's complexity.

</domain>

<decisions>
## Implementation Decisions

### PROOF — FRAME-at-zero state

**LOCKED 2026-04-08:** A + B + C simultaneously. Not alternatives, not states — concurrent layers:

- **A — Geometric lattice (shader branch):** At low `--signal-intensity`, shader renders structured geometry (squares, lines, right angles) — the deterministic pattern underlying the noise. At high intensity: full generative output.
- **B — Component skeleton layer:** A subset of SF components rendered in stroke-only/bare FRAME state, absolutely positioned behind the shader. `opacity` interpolates from `1→0` as intensity rises. Visually: you see the components dissolving into the generated signal.
- **C — FRAME-pole left column:** Dedicated left column with monospaced codes, system specs, architecture readout at `intensity: 0` side. Right side open to shader at full intensity.

The "before/after slider" risk from C is neutralized by A and B being live — the lattice runs, the component bones are visible. It reads as two live states of one system, not a reveal panel.

### PROOF — `--signal-intensity` implementation

```
sectionRef.addEventListener('pointermove', (e) => {
  const intensity = e.clientX / window.innerWidth
  // NOT documentElement — scope to section to avoid bleeding into ENTRY/SIGNAL shaders
  sectionRef.style.setProperty('--signal-intensity', intensity.toString())
})
```

**Lerp via rAF** — do NOT use CSS `transition: --signal-intensity`. Use a `requestAnimationFrame` lerp loop for smooth tracking without jitter. Raw pointermove is jittery.

**Restore on leave:** `pointerleave` → restore `--signal-intensity` to `1.0` (SIGNAL default). ScrollTrigger `onLeave`/`onLeaveBack` deactivate the pointermove listener and restore the default.

**ScrollTrigger on PROOF:** No pin, no scrub. Simple `onEnter`/`onLeave`/`onEnterBack`/`onLeaveBack` callbacks to activate/deactivate pointer listener. This avoids the zero-range scrub trap entirely.

### PROOF — mobile input

**LOCKED 2026-04-08:** Gyroscope implementation (not touch-only).

- **Touch:** Use `pointermove` Pointer Events API (not `touchmove`). Identical handler to desktop — `touch.clientX / window.innerWidth`.
- **Gyroscope:** `DeviceOrientationEvent.gamma` (range: -90 to +90). Map: `(gamma + 90) / 180 → --signal-intensity`. iOS 13+ requires `DeviceOrientationEvent.requestPermission()` — trigger on first `touchstart` on the PROOF section (user gesture gate).
- Gyroscope makes mobile PROOF a **peer surface**, not a fallback. Tilt is a mobile-native affordance desktop cannot replicate.

**Touch discovery test:** The interaction must be discoverable in ≤5 seconds without any instruction overlay. No "try dragging" prompt allowed.

### PROOF — reduced-motion fallback

Static split view: both layers visible side-by-side. No animation, no interaction. The two-pole layout (FRAME-pole left, SIGNAL-pole right) is always visible in the static state.

### SIGNAL section setup

**ScrollTrigger pattern** (Lenis-safe):
```javascript
ScrollTrigger.create({
  trigger: signalSectionRef.current,
  start: 'top bottom',
  end: 'bottom top',
  scrub: 2,  // atmospheric, slow
  onUpdate: (self) => {
    const parallaxOffset = self.progress * 40  // 40px max
    shaderRef.current.style.transform = `translateY(${-parallaxOffset}px)`
  }
})
```

**Log `trigger.start` and `trigger.end`** on creation — confirm they differ by ≈`1.5 * window.innerHeight`. If equal: zero-range trap active, diagnose font loading / Lenis init order.

**`--signal-intensity` management:** `onEnter` → set to `1.0`. Let it persist on `onLeave` (SIGNAL ends at full intensity — correct handoff to ACQUISITION's austere register).

**Reduced-motion fallback:** Static frame of the generative output. No animation, no parallax.

### WebGL performance

- **SignalCanvas singleton** already handles scissor/viewport for concurrent context management. Confirm it covers ENTRY + SIGNAL running simultaneously.
- Use `position: absolute` on the canvas with its own stacking context — prevents CLS from siblings shifting during 150vh atmospheric scroll.
- **No new npm packages.** All animation via GSAP ScrollTrigger + existing Three.js/GLSL infrastructure.

### Data points in PROOF section

System stats (component count, bundle size, Lighthouse score) appear **inside the PROOF section as data points within the FRAME-pole column** — not as a separate band above or below. They are part of the A+B+C concurrent layer implementation (column C content).

### Phase 32 requirements not requiring design decisions

- **SG-01–05, PR-01–06:** All mapped to the decisions above. The WebGL scene for SIGNAL is `GLSLHero`/`SignalMesh` at maximum intensity (existing infrastructure). No new scenes.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### cdBrain — Design Intent
- `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/second-brain/wiki/analyses/v1.5-phase32-33-brief.md` — Structural decisions, FRAME-at-zero locked decision, mobile approach
- `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/second-brain/wiki/analyses/v1.5-section-reference-map.md` — SIGNAL/PROOF design references (Ikeda, Pompidou), quality tests, mobile references
- `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/second-brain/wiki/analyses/v1.5-compile-back.md` — GSAP compound bug patterns, zero-range trap, SplitText race

### Project Infrastructure (already shipped)
- `.planning/phases/29-infrastructure-hardening/` — PinnedSection, GSAP Observer, Lenis autoResize:false, fonts-ready hook
- `.planning/phases/30-homepage-architecture-entry-section/30-02-SUMMARY.md` — GLSLHero uMouse pattern, container-scoped pointer interaction template
- `.planning/STATE.md` — Critical constraints from v1.1 (SignalCanvas singleton, useSignalScene, Observer pattern)
- `.planning/REQUIREMENTS.md` — SG-01..05, PR-01..06 requirement definitions

### Quality Tests (from reference map)
- **SIGNAL test:** "If someone walked past your screen and glanced at this section for 2 seconds, would they stop?" — Not because they understood it, but because it looked unlike any website they'd seen.
- **PROOF test:** "Does a non-designer feel something when they move their mouse?" — Not "I understand the system" but "I felt the system change."
- **PROOF mobile test:** "Do their fingers find the interaction within 5 seconds without a prompt?"

</canonical_refs>

<specifics>
## Specific Implementation Notes

### Component skeletons for PROOF (Approach B)
- Use a subset of SF components in "bare FRAME state" — stroke-only, no fill, monochrome
- These should be the same 12 components that will appear in Phase 33 INVENTORY (spans both sections, creates visual coherence)
- `opacity` lerp from `1` (intensity=0) to `0` (intensity=1) driven by the same `--signal-intensity` CSS var

### PROOF left column content (Approach C)
- `SF//BTN-001`, `SF//CRD-001`, etc. — coded nomenclature preview (Phase 33 INVENTORY format)
- System specs: component count (51), bundle size (100KB), Lighthouse (100/100)
- Architecture readout: monospaced, JetBrains Mono

### Shader branch for Approach A
- New conditional geometry mode in the existing GLSL shader
- At `u_signal_intensity < 0.3`: render structured geometry (regular grid, right angles)
- At `u_signal_intensity > 0.7`: render noise output
- Smooth blend in between
- This requires `u_signal_intensity` uniform to be wired to `--signal-intensity` CSS var via JavaScript bridge (same pattern as `uMouse` in GLSLHero)

</specifics>

<deferred>
## Deferred Items

- Char-level SplitText animation — dropped in Phase 31, explicitly documented in v1.5-compile-back.md. Can return in Phase 34+ only with pre-split-before-hydration approach.
- Phase 33 INVENTORY section (12 component subset selection, `patternTier` field, coded nomenclature) — Phase 33 scope.
- Phase 33 ACQUISITION section — Phase 33 scope.
- Gyroscope haptic feedback layer (pressure → intensity) — optional enhancement, lower priority than core pointermove+gyroscope.

</deferred>

---

*Phase: 32-signal-proof-sections*
*Context gathered: 2026-04-08 from cdBrain wiki (not discuss-phase — decisions pre-locked)*
