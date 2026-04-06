# Pitfalls Research

**Domain:** Adding 15+ components to an established Next.js design system with strict aesthetic, bundle, and API constraints (v1.3 Component Expansion)
**Researched:** 2026-04-06
**Confidence:** HIGH (border-radius, bundle, Server/Client boundary, accessibility) / MEDIUM (registry drift, SIGNAL layer consistency) / HIGH (z-index stacking — directly measurable in codebase)

---

## Critical Pitfalls

### Pitfall 1: Radix Defaults Override `--radius: 0px` on New Components

**What goes wrong:**
`Avatar`, `Progress`, `Toast`, and `Calendar` in shadcn are generated with hardcoded Tailwind `rounded-full`, `rounded-*`, and `rounded-[var(--radius)]` classes. The global `--radius: 0px` token in `globals.css` overrides `rounded-[var(--radius)]` usages correctly — but `rounded-full` and `rounded-lg` do NOT reference the `--radius` custom property. They are literal Tailwind utility classes that produce a fixed `border-radius` regardless of the CSS variable.

Specific failures to expect:
- `Avatar` (`ui/avatar.tsx`): `AvatarImage` and `AvatarFallback` both use `rounded-full` — the avatar will be a circle. Zero border-radius is a non-negotiable aesthetic constraint.
- `Progress` (`ui/progress.tsx`): The track and fill both use `rounded-full` by default.
- `Toast` (`ui/toast.tsx`): The toast container uses `rounded-md`.
- `Calendar` (`ui/calendar.tsx`): Day cell buttons use `rounded-md` and `rounded-full` for selected states.

The failure mode is silent at TypeScript level. The component renders, passes tests, looks correct at first glance with content — but zooming in reveals pill or circle geometry that breaks the DU/TDR industrial edge system.

**Why it happens:**
shadcn's generator outputs Tailwind utility classes directly, not via CSS variable references. The convention shifted to `rounded-[var(--radius)]` for some components but not all. `rounded-full` (Avatar) and `rounded-full` (Progress fill) are intentional aesthetic choices in the shadcn design language — they will never be generated with the var reference.

**How to avoid:**
Every new SF wrapper MUST include an explicit `rounded-none` override on every element that carries a rounded class from the base UI component. This cannot be assumed from the existing `--radius: 0px` global.

Pattern to enforce in every SF wrapper:
```tsx
// WRONG — relies on --radius: 0px cascading into rounded-full:
<AvatarImage className={cn("rounded-full", className)} />

// CORRECT — explicitly overrides:
<AvatarImage className={cn("rounded-none", className)} />
```

For complex multi-subcomponent wrappers (Calendar, NavigationMenu), the override must be applied at every sub-element level, not just the root. Audit with browser DevTools computed styles on every new component before marking as done.

**Warning signs:**
- Any SF wrapper that does NOT include `rounded-none` in its className for elements inheriting from the base UI component
- Browser DevTools showing `border-radius: 9999px` or any non-zero value on an SF component element
- Visual: any circular or pill-shaped element in the component explorer

**Phase to address:** Precondition phase (Phase 0 / infrastructure setup). Add `rounded-none` audit as a checklist item in the SF wrapper creation checklist before P1 components begin. Do not discover this at component 8 of 15.

---

### Pitfall 2: `sf/index.ts` Barrel Exports Pulling Client Components Into Server Subtrees

**What goes wrong:**
`sf/index.ts` is the main barrel export for all SF components. It currently exports 15 Server Components and 15 Client Components from the same file, without any `'use client'` directive at the barrel level. This works correctly today because Next.js handles the Server/Client boundary at the file level, not the import level — a Server Component can import from a barrel that re-exports Client Components, as long as the barrel itself does not have `'use client'`.

The risk compounds as 15+ new components are added. All new interactive SF components (Accordion, Toast, NavigationMenu, ToggleGroup, Stepper, Calendar, Menubar) will require `'use client'`. If any author adds `'use client'` to `sf/index.ts` itself — a plausible mistake when "the barrel feels like it should be a client thing" — every Server Component currently exported from the barrel (SFContainer, SFSection, SFStack, SFGrid, SFText) becomes a Client Component. This silently inflates the JS bundle by pulling 5 layout primitives and all their transitive imports into the client bundle.

The second vector: a new SF wrapper that does NOT have `'use client'` but imports a Radix component that requires it. Next.js will throw a build error, but the temptation is to add `'use client'` to the barrel as a quick fix instead of to the specific wrapper file.

**Why it happens:**
Barrel files in large component libraries accumulate `'use client'` directives when authors try to "fix" individual component errors at the barrel level. This is a copy-paste or shortcut mistake that has a real bundle cost.

**How to avoid:**
- Never add `'use client'` to `sf/index.ts`. The barrel must remain directive-free.
- Every new interactive SF wrapper (anything using Radix primitives with state, any component using `useState`/`useEffect`/GSAP) must declare `'use client'` at the top of its own file.
- Enforce via code review: `sf/index.ts` changes should be reviewed for `'use client'` additions.
- Verify with `next build` + `@next/bundle-analyzer`: layout primitives (SFContainer, SFSection, SFStack, SFGrid, SFText) must NOT appear in any client chunk.

**Warning signs:**
- `'use client'` appearing in `sf/index.ts`
- Bundle analyzer showing `sf-container`, `sf-section`, `sf-stack`, `sf-grid`, or `sf-text` in client chunks
- Initial JS bundle size increasing by more than ~5KB per new component (layout primitives are zero-cost; their appearance in the client bundle is a signal something broke)

**Phase to address:** Phase 0 (preconditions). Document the barrel rule in the SF wrapper creation checklist. Verify after every batch of new components with a `next build` check.

---

### Pitfall 3: Initial Bundle Budget Breach from Client Component Accumulation

**What goes wrong:**
The current initial bundle is 102KB (Three.js in an async chunk, primitives as Server Components). The 200KB budget seems generous until accounting for what 15 new interactive Client Components actually add. Each Radix-based component ships its own JS: NavigationMenu is ~12KB, Calendar (date-fns) is 40-60KB without careful tree-shaking, Menubar is ~8KB. Accordion, Toast, ToggleGroup, and Stepper are lighter (~3-6KB each) but add up.

The failure mode: components are added one at a time during development, each "only adding a few KB," and the budget is not measured until the milestone is complete. By then, NavigationMenu + Calendar alone may have breached the budget, requiring an architecture change (lazy loading) that should have been planned upfront.

Specific high-risk packages:
- `react-day-picker` (Calendar peer dep): ~35-45KB minified+gzip. This is the single largest risk.
- `@radix-ui/react-navigation-menu`: ~10-12KB
- `@radix-ui/react-accordion`: ~4-5KB
- Any date library added for Calendar (date-fns: ~30KB, dayjs: ~7KB)

**Why it happens:**
Bundle budget is measured at milestone end, not component by component. By the time the breach is detected, multiple components are already integrated and partial rollback is painful.

**How to avoid:**
- Establish the budget gate in Phase 0: run `ANALYZE=true pnpm build` and record the current initial bundle baseline.
- Measure after every component addition during development, not at milestone end.
- Calendar and Menubar are already designated P3/registry-only — enforce this as a lazy-loaded `dynamic()` import, not a standard import. The `next.config.ts` already uses `optimizePackageImports` for `lucide-react` — add `react-day-picker` to this list if it ends up in the bundle.
- NavigationMenu must be measured before integration: if it pushes initial bundle past 160KB, it should also be lazy-loaded.
- Do NOT add `date-fns` as a dependency. Use the native `Intl.DateTimeFormat` API for any date formatting needs in Calendar display. If `react-day-picker` requires `date-fns` as a peer dep, the Calendar component should remain registry-only (not imported in the app).

**Warning signs:**
- Initial JS bundle exceeds 150KB (danger zone — 50KB buffer before hard limit)
- `react-day-picker` or `date-fns` appearing in `next build` output as non-lazy chunks
- `ANALYZE=true pnpm build` shows Calendar or Menubar in the shared chunk

**Phase to address:** Phase 0 (performance baseline) and P3 phase (Calendar/Menubar). Bundle check after each P1 and P2 component addition. Do not wait for P3.

---

### Pitfall 4: CVA `intent` Prop vs. Semantic Variant Drift Across New Components

**What goes wrong:**
The existing system uses `intent` as the primary CVA variant prop across all SF components (confirmed in `sf-button.tsx`, `sf-badge.tsx`). New components under authoring pressure tend to introduce `variant`, `color`, `type`, or `status` as prop names when `intent` feels semantically awkward — e.g., `SFStatusDot` might get `status="active"` instead of `intent="active"`, `SFToast` might get `type="success"` instead of `intent="success"`.

Each deviation creates an API inconsistency in the barrel. A consumer importing from `@/components/sf` now has to remember: Button uses `intent`, StatusDot uses `status`, Toast uses `type`. The inconsistency compounds to the point where new authors stop trusting the API and start inspecting each component individually, defeating the DX purpose of the design system.

**Why it happens:**
Semantic pressure: `intent="error"` feels less natural than `variant="destructive"`. Authors writing new components in isolation default to their mental model from the upstream shadcn component (which uses `variant`). The `intent` convention is tribal knowledge, not enforced by any linting rule.

**How to avoid:**
- The rule is explicit in `CLAUDE.md` and `project_pressure_test.md`: `intent` is the standard CVA variant prop for all SF components.
- Add to the SF wrapper checklist: "Does the component use `intent` as the primary variant prop? If semantics require a second variant, is it named `size`, `orientation`, or another non-`variant` name?"
- The mapping for new components:
  - `SFToast`: `intent="default" | "success" | "warning" | "destructive"` (not `type`, not `variant`)
  - `SFStatusDot`: `intent="active" | "inactive" | "warning" | "error"` (not `status`, not `variant`)
  - `SFProgress`: `intent="default" | "signal"` (not `variant`, not `color`)
  - `SFAccordion`: `intent="default" | "ghost"` (not `variant`)
  - `SFAlertDialog`: `intent="default" | "destructive"` (not `variant`)
- For components where Radix/shadcn exposes a `variant` prop, rename it to `intent` in the SF wrapper's CVA config. Do NOT pass `variant` through to the base component from the SF wrapper's public API.

**Warning signs:**
- Any new SF file with a CVA config using `variant:` as the top-level key instead of `intent:`
- Any new SF component prop named `type`, `color`, `status`, or `mode` when it is controlling the primary visual variant
- Code review finding inconsistent prop names across P1 and P2 batches

**Phase to address:** Phase 0 (SF wrapper creation checklist). Catch at the component authoring stage, not in code review after the fact.

---

### Pitfall 5: Accessibility Regressions in Complex Keyboard Navigation Components

**What goes wrong:**
`NavigationMenu` and `Calendar` are the two highest-risk components for keyboard navigation regressions. Both have complex keyboard interaction models defined by WAI-ARIA patterns that Radix implements — but SF wrapping can break these patterns in subtle ways.

Specific failure vectors:

`NavigationMenu`: Radix implements the WAI-ARIA `navigation` role with arrow key traversal between menu items and a separate Tab stop for the viewport. If the SF wrapper applies `cn()` overrides that interfere with the `data-state` CSS selectors Radix uses for focus management (e.g., removing the `data-[state=open]:` visibility class via Tailwind class conflicts), the keyboard flow breaks silently. The component still looks correct — it just does not open on arrow key press.

`Calendar`: `react-day-picker` implements a grid navigation pattern (arrow keys for day navigation within the month, Tab for month navigation). Applying `rounded-none` via `className` override on day cell buttons can conflict with the focus ring styles if the SF `sf-focusable` class is also applied — resulting in a focus indicator that is present but invisible (same color as background) in some states.

`Accordion`: The `Enter`/`Space` toggle and `Down`/`Up` arrow key traversal between items are Radix-provided. If the SF wrapper intercepts `onKeyDown` for any reason (e.g., SIGNAL activation), Radix's event handling must not be suppressed.

**Why it happens:**
During rapid component addition, accessibility keyboard testing is the last item checked and the first item skipped under time pressure. Visual QA (does it look right?) is faster than interaction QA (does Tab, Enter, arrow, Escape all work correctly?). The regression is invisible in screenshots and in most automated tests.

**How to avoid:**
- Mandatory keyboard nav test protocol for every new component before marking complete:
  - Tab into the component
  - Activate with Enter/Space
  - Navigate within with arrow keys
  - Dismiss with Escape
  - Tab out to next focusable element
- For NavigationMenu: verify `data-state` CSS selectors still function after SF class overrides. Radix sets `data-state="open"` / `data-state="closed"` — never override these attributes from the SF wrapper.
- For Calendar: verify focus ring is visible on day cell buttons in both light and dark modes after `rounded-none` + `sf-focusable` are applied.
- For any component where SIGNAL activation is added: use `data-` attribute listeners, not `onKeyDown`, to avoid intercepting Radix event handlers.

**Warning signs:**
- NavigationMenu: mouse interaction works, keyboard arrow keys do not open submenus
- Calendar: clicking a day works, keyboard arrow key navigation within month does not move focus
- Accordion: items open/close on click but not on Enter key
- Focus ring invisible after applying `sf-focusable` on top of Radix component

**Phase to address:** P2 phase (NavigationMenu) and P3 phase (Calendar). Include keyboard nav test as a gate criterion for each component's completion.

---

### Pitfall 6: Toast Positioning Conflict With SignalOverlay Panel

**What goes wrong:**
`SignalOverlay` is positioned `fixed bottom-4 right-4` at `z-index: calc(var(--z-scroll-top, 9000) + 10)` — approximately z-index 210 in the defined scale. shadcn's `Toaster` component defaults to `fixed bottom-0 right-0` (or bottom-right corner) with a z-index that is typically around 100 in the shadcn default stylesheet.

With default positioning, Toast notifications render behind the SignalOverlay panel button in the bottom-right corner. In the collapsed state, the SignalOverlay button (a small trigger at `bottom-4 right-4`) physically overlaps where Toasts appear. In the expanded state, the SignalOverlay panel (`fixed bottom-16 right-4`) directly occludes a full column of toast notifications.

This is not a visual glitch that affects one screen — it is a permanent structural conflict because both are fixed-position elements in the same corner.

**Why it happens:**
Toast position is chosen at integration time without checking the existing fixed-position element inventory. The bottom-right corner is the universal shadcn Toaster default, and authors follow the default without auditing what else exists in that corner.

**How to avoid:**
- `SFToaster` (the SF wrapper for the Toaster) must NOT use the bottom-right corner. Default position: `bottom-left` (`bottom-4 left-4`). This is unoccupied in the current fixed-position element inventory.
- Z-index assignment for Toast: use `--z-overlay` (100) — Toasts are overlay content, not system chrome. They must not compete with SignalOverlay (210+), VHS overlay (99999), or the canvas cursor (500).
- Fixed-position element inventory (current):
  - `--z-nav` (9999): Nav bar (top)
  - `--z-scroll-top` (200) + 10: SignalOverlay (bottom-right)
  - `--z-cursor` (500): Canvas cursor
  - `--z-vhs` (99999): VHS overlay
  - 850: Back-to-top button
- Toast at `bottom-4 left-4` at z-100 has zero conflicts with the above inventory.
- Add a `--z-toast` token to globals.css (value: 100) so Toast z-index is named, not magic.

**Warning signs:**
- Toast appears behind SignalOverlay button on mobile or small viewports
- SignalOverlay expanded panel covers toast notifications
- Any Toaster instantiation using `position="bottom-right"` (the shadcn default)

**Phase to address:** P1 phase (Toast integration). Position must be set in the `SFToaster` wrapper, not left as the shadcn default.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Skipping `rounded-none` audit and relying on `--radius: 0px` | Faster wrapper authoring | Circle/pill geometry on Avatar, Progress, Calendar — aesthetic violation discovered in visual QA late | Never |
| Adding `'use client'` to `sf/index.ts` to fix a build error | Stops the red error immediately | All 5 layout primitives become Client Components, bundle bloat, Server Component guarantee broken | Never |
| Using `variant` instead of `intent` for a new component's CVA config | Matches shadcn naming, feels natural | API inconsistency in barrel export, future authors confused about which prop to use | Never |
| Importing Calendar/Menubar at the top level (not lazy) | Simpler import pattern | `react-day-picker` or `date-fns` enters initial bundle, potentially breaching 200KB budget | Never — these are explicitly designated P3/lazy |
| Skipping keyboard nav test for a complex component | Saves 10 minutes | WCAG AA violation, unfixable without understanding Radix's internal event model | Never |
| Hardcoding Toast to `bottom-right` (shadcn default) | Zero config | Permanent overlap with SignalOverlay — not fixable after other consumers depend on position | Never |
| Using arbitrary Tailwind spacing (e.g., `p-[18px]`) in a new component | Achieves exact design spec | Breaks spacing system consistency, impossible to audit programmatically | Never |
| Registering a component in the shadcn registry without `meta.layer` and `meta.pattern` fields | Faster entry | Registry becomes inconsistent after the v1.2 normalization work, ComponentsExplorer filtering breaks | Never during v1.3 |
| Adding a SIGNAL layer animation "quickly" without checking `prefers-reduced-motion` | Faster animation integration | Motion plays for users who have requested reduced motion — accessibility regression | Never |

---

## Integration Gotchas

Common mistakes when connecting components to existing system infrastructure.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Radix Avatar with SF wrapper | Relying on `--radius: 0px` to eliminate `rounded-full` | Explicit `rounded-none` override in `SFAvatar` and `SFAvatarFallback` classNames |
| Radix Progress with SF wrapper | `rounded-full` on the fill element survives CSS var override | Override `rounded-none` on both the track and the fill `Indicator` element |
| Toast Toaster placement | Default `bottom-right` position from shadcn | Override in `SFToaster` to `bottom-left`, assign `--z-toast: 100` |
| NavigationMenu + GSAP | Adding GSAP hover effects to NavMenu triggers that conflict with Radix's `onPointerEnter` open logic | Use `data-cursor` attribute for GSAP cursor effects only; never attach GSAP `mouseenter` listeners to NavMenu trigger elements |
| Calendar + date formatting | Installing `date-fns` as a dependency | Use `Intl.DateTimeFormat` for display, or confirm `react-day-picker` v8+ ships a native-only mode |
| SIGNAL animation on Accordion | Running GSAP stagger in the `AnimatePresence` lifecycle | Radix Accordion does not use Framer Motion; animate via `data-[state=open]` CSS transitions or in the `onAnimationEnd` callback |
| Toast + SIGNAL layer | Adding SIGNAL visual treatment directly in Toast JSX | Use CSS `data-[state=open]` selector in globals.css instead, to avoid forcing Toast to depend on GSAP |
| ToggleGroup + intent variants | Passing Radix `type="single"` and `type="multiple"` as `intent` | Keep `type` as-is (it controls Radix behavior, not appearance); use `intent` only for visual variant |
| Registry entry for components with SIGNAL animations | Including animation component files in `registryDependencies` | SIGNAL animation components are system-internal — list only shadcn base names in `registryDependencies` |
| New SF wrapper + existing sf/index.ts | Forgetting to add the export to the barrel after creating the file | Add barrel export in the same commit as the component file — never ship a component that cannot be imported from `@/components/sf` |

---

## Performance Traps

Patterns that work at small scale but fail as component count grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Unguarded `useEffect` in every new Client Component | Each component runs effects on mount even when not visible | Add a visibility/mount guard or lazy-load components not in the initial viewport | At 15+ components on a single page (ComponentsExplorer) |
| GSAP context not cleaned up in complex components | Memory leak as user navigates between pages | Every `gsap.context()` call in a `useEffect` must return `() => ctx.revert()` | Accumulates across navigation — noticeable after 5+ page transitions |
| SVG or Canvas animation in Stepper/Progress without reduced-motion guard | Ignores user preference, fails WCAG | Every animated component checks `window.matchMedia('(prefers-reduced-motion: reduce)')` | First time an affected user visits |
| `optimizePackageImports` not extended for new heavy deps | Lucide is optimized but new heavy packages are not | Add any new dep over 10KB to `optimizePackageImports` in `next.config.ts` | At `next build` — increases initial chunk |
| Inline GSAP ScrollTrigger in every new animated component | Multiple ScrollTrigger instances pinning the same container | Consolidate ScrollTrigger usage — use the existing `signal-motion.tsx` pattern | Visible jank at 3+ ScrollTrigger instances on same scroll container |

---

## UX Pitfalls

Common user experience mistakes specific to design system component addition.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| SIGNAL treatment inconsistency: some new components get it, others do not | System feels arbitrary — users notice that some components have "life" and others do not | Define which component types are animation-eligible upfront (Progress fill, Toast slide, Accordion stagger = YES; StatusDot, Breadcrumb, Pagination = NO) |
| Avatar fallback using a full letter (like Material Design) without truncation | Long names break fallback layout | SFAvatarFallback should render max 2 characters, uppercase monospace, 2px border, no fill (transparent background = industrial) |
| Stepper not communicating current step to screen readers | Keyboard-only users lose context when moving between steps | Stepper must emit `aria-current="step"` on the active step and `aria-label` on the stepper container |
| Breadcrumb ellipsis without a disclosure pattern | Users on mobile cannot see the full path; clicking ellipsis goes nowhere | Ellipsis in SFBreadcrumb should either expand inline or not exist — no silent truncation |
| Progress without a label or aria-valuenow update | Screen readers cannot report progress to assistive tech users | SFProgress must accept and render `aria-label` and update `aria-valuenow` dynamically |
| Toast auto-dismiss timer too fast | Users with cognitive disabilities cannot read the message | Default dismiss delay: 5000ms minimum. Do not allow under 3000ms without explicit `duration` prop |
| EmptyState without an action | User is stranded — no path forward from the empty state | Every EmptyState must accept and render an action slot (even if caller passes nothing, the slot must exist in the API) |

---

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **SFAvatar:** Renders with no visible `border-radius` — verify `AvatarImage` AND `AvatarFallback` sub-elements in DevTools computed styles show `border-radius: 0px`
- [ ] **SFProgress:** Track AND fill both show `border-radius: 0px` — the fill (Radix `ProgressIndicator`) is a separate element that also carries `rounded-full`
- [ ] **SFToast / SFToaster:** Position is `bottom-left`, z-index is `--z-toast` (100), does NOT overlap SignalOverlay in collapsed or expanded state
- [ ] **SFCalendar:** Day cell focus ring is visible (not invisible-against-background) in both light and dark mode after `rounded-none` and `sf-focusable` are applied
- [ ] **SFNavigationMenu:** Arrow key traversal works correctly after SF class overrides (test: Tab into menu, arrow right/left between items, arrow down to open, Escape to close)
- [ ] **SFAccordion SIGNAL layer:** `prefers-reduced-motion` stops the stagger animation, but accordion still opens/closes (SIGNAL = optional, FRAME = required)
- [ ] **Every new SF wrapper:** `rounded-none` override present on all child elements inheriting Radix `rounded-*` classes
- [ ] **Every new SF wrapper:** `intent` used as primary CVA variant prop, not `variant`, `type`, `color`, or `status`
- [ ] **Every new SF wrapper:** Added to `sf/index.ts` barrel in the same commit
- [ ] **Every new SF wrapper:** Registry entry added to `registry.json` with `meta.layer` and `meta.pattern` fields in the same commit
- [ ] **Every new SF wrapper:** JSDoc block present with `@param`, `@example`, and FRAME/SIGNAL layer note
- [ ] **P3 components (Calendar, Menubar):** Imported via `dynamic()` with `{ ssr: false }` or `{ ssr: true }` depending on content — never as a static top-level import
- [ ] **Initial bundle:** `ANALYZE=true pnpm build` run after every P1 component, after P2 complete, and after P3 complete — budget stays below 150KB (gate) and 200KB (hard limit)
- [ ] **Registry:** `pnpm registry:build` runs clean after every new component addition (no JSON schema errors, no missing file references)
- [ ] **Token enforcement:** Zero arbitrary spacing values (`p-[Xpx]`, `m-[Xrem]`) in any new component — only blessed Tailwind spacing stops

---

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| `rounded-full` found on shipped component | LOW | Add `rounded-none` to the specific element, commit. One-line fix per element. |
| `'use client'` added to `sf/index.ts` accidentally | MEDIUM | Remove directive from barrel. Verify all layout primitives disappear from client bundle via analyzer. May require fixing individual wrappers that incorrectly lack `'use client'`. |
| `variant` used instead of `intent` in a shipped component | MEDIUM | Requires a prop rename + update to all call sites in the codebase. Run `tsc --noEmit` before and after. Do not alias — fix all call sites. |
| Bundle budget breached by Calendar/Menubar | MEDIUM | Convert from static import to `dynamic()` lazy import. Verify lazy chunk is separate in build output. |
| Toast overlapping SignalOverlay discovered after consumer use | MEDIUM | Update `SFToaster` position to `bottom-left`. Any consumer hardcoding `bottom-right` in JSX must also be updated. |
| Keyboard nav broken in NavigationMenu after SF class override | HIGH | Must trace which className override conflicts with Radix `data-state` selectors. Requires DevTools + Radix source inspection. Cannot be fixed by removing all overrides — must find specific conflict. |
| Accessibility regression on Calendar focus | HIGH | Requires audit of focus management CSS in sf-calendar + globals.css `.sf-focusable` rule interaction. May require adding a `[data-day-picker]` CSS scope to isolate SF focus overrides from Radix's focus management. |
| SIGNAL layer applied inconsistently (some components animated, some not) | LOW | Audit animation-eligible components against the defined list. Add missing animations. Does not affect FRAME layer stability. |

---

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| `rounded-full` Radix defaults | Phase 0 (SF wrapper checklist — add `rounded-none` audit step) | DevTools computed styles on every new component before phase completion |
| Barrel `'use client'` infection | Phase 0 (document barrel rule) + after each component addition | `next build` + bundle analyzer: layout primitives absent from client chunks |
| Bundle budget breach | Phase 0 (record baseline) + after P1 batch + after P2 batch + after P3 batch | `ANALYZE=true pnpm build` output; initial chunk stays below 150KB gate |
| CVA `intent` drift | Phase 0 (SF wrapper checklist) | Code review gate: any `variant:` key in CVA config fails review |
| Keyboard nav regression | P2 phase (NavigationMenu) + P3 phase (Calendar) | Manual keyboard nav test protocol on each complex component |
| Toast / SignalOverlay z-index conflict | P1 phase (Toast) | Visual test: trigger Toast while SignalOverlay is visible; verify no overlap |
| Token enforcement degradation | All phases | `grep -rn "\[.*px\]"` in `components/sf/` returns zero matches for arbitrary values |
| SIGNAL layer inconsistency | P1 (define eligibility list) + P2/P3 (apply to eligible components) | Check all animated components for `prefers-reduced-motion` guard |
| Registry drift | All phases (same-commit rule) | `pnpm registry:build` passes clean after each component addition |
| API inconsistency accumulation | All phases (checklist) + final P2 pass | Grep all SF wrappers for `variant:` in CVA configs — zero matches expected |

---

## Sources

- Radix UI Avatar docs — `AvatarImage` and `AvatarFallback` use `rounded-full` by default: https://www.radix-ui.com/primitives/docs/components/avatar
- Radix UI Progress docs — `ProgressIndicator` carries `rounded-full`: https://www.radix-ui.com/primitives/docs/components/progress
- shadcn/ui Toast source (confirmed `rounded-md` in generated base): https://ui.shadcn.com/docs/components/toast
- shadcn/ui Calendar — uses `react-day-picker` with `rounded-md` and `rounded-full` on day cells: https://ui.shadcn.com/docs/components/calendar
- WAI-ARIA Navigation Menu pattern (keyboard interaction model): https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
- WAI-ARIA Grid pattern (Calendar keyboard navigation): https://www.w3.org/WAI/ARIA/apg/patterns/grid/
- Next.js App Router — Server and Client Component boundary (barrel export behavior): https://nextjs.org/docs/app/getting-started/server-and-client-components
- Next.js `optimizePackageImports` — https://nextjs.org/docs/app/api-reference/config/next-config-js/optimizePackageImports
- react-day-picker bundle size data — https://bundlephobia.com/package/react-day-picker
- Existing codebase — `components/animation/signal-overlay.tsx` lines 170, 191 (fixed positioning, z-index values)
- Existing codebase — `app/globals.css` z-index scale (lines 179–188)
- Existing codebase — `components/sf/sf-switch.tsx` (established pattern for `rounded-none` override on Radix Switch)
- Existing codebase — `components/sf/sf-button.tsx` (established `intent` as primary CVA variant prop)
- Existing codebase — `package.json` (confirmed `@next/bundle-analyzer` available; current Three.js at 102KB initial)

---

*Pitfalls research for: v1.3 Component Expansion — 15+ components added to SignalframeUX with strict aesthetic, bundle, and API constraints*
*Researched: 2026-04-06*
