# Phase 73: SFRichEditor — Research

**Domain:** Tiptap ProseMirror integration under SF FRAME constraints + P3 lazy bundle posture + `_dep_re_01_decision` ratification
**Researched:** 2026-05-01
**Confidence:** HIGH

---

## Summary

SFRichEditor is the second runtime-dep introduction of v1.10, and the most SSR-complex component in
the milestone. The architectural constraints are already locked in ROADMAP and STATE: Tiptap
(recommended v3.22.5) ships in a P3 lazy chunk behind `next/dynamic({ ssr: false })`, never in
`sf/index.ts`, never added to `optimizePackageImports` (D-04 lock holds), and `_dep_re_01_decision`
is committed before `pnpm add`. ProseMirror's `contenteditable` model requires two non-negotiable
SSR guards (`immediatelyRender: false` on every `useEditor()` call, `ssr: false` on `next/dynamic`)
and one CSS isolation guard (`injectCSS: false` on every `useEditor()` call).

The component delivers RE-01..06: core toolbar (bold/italic/underline/strike/H1/H2/H3/lists/
blockquote), code block + inline code + link extension, controlled value + onChange + readOnly API,
ProseMirror CSS isolation in globals.css, and the anti-feature JSDoc block. The toolbar composes
existing `SFButton` with `data-active` for active state — this maps cleanly to ProseMirror's
`editor.isActive('bold')` API. Character count is exposed via Tiptap's `CharacterCount` extension
(already in StarterKit/core extensions — no extra dep in v3).

Three real risks: (1) ProseMirror hydration mismatch without `immediatelyRender: false`, crashing
Next.js 15.3 App Router SSR; (2) ProseMirror.css injecting unlayered styles that override
`@layer signalframeux` token values (prevented by `injectCSS: false`); (3) StarterKit appearing in
a barrel-reachable import path, causing First Load JS to spike above 200 KB. All three are catchable
at plan-time. Tiptap's ~55–70 KB gzip dep set lands exclusively in the lazy chunk — the 12.4 KB
First Load headroom is never touched.

**Primary recommendation:** Author `_dep_re_01_decision` block → install Tiptap → measure bundle
→ author `sf-rich-editor.tsx` (`'use client'`, NOT in barrel) + `sf-rich-editor-lazy.tsx`
(`next/dynamic({ ssr: false })`, NOT in barrel) → add `.ProseMirror` scoped rules to `globals.css`
→ author playground fixture → ship Playwright + axe-core tests → verify `@tiptap/*` absent from
`/page` First Load chunk manifest.

---

## Tiptap Version Decision (DEP-02)

The `_dep_re_01_decision` block requires a committed version choice before `pnpm add`. Research basis:

### v3.22.5 (Recommended Default)

Tiptap v3.x is the actively-maintained track (as of 2026-05). Key v3 changes relevant to this phase:

- **`@tiptap/pm` package**: v3 ships `@tiptap/pm` as the unified ProseMirror re-export package.
  Replacing individual `prosemirror-*` packages. `_dep_re_01_decision.dep_added` must include
  `@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`, and optionally `@tiptap/extension-link`
  if Link is not bundled in StarterKit by default in v3 (to verify at install time — in v2
  `@tiptap/extension-link` is separate from StarterKit; in v3 confirm via `pnpm list` after add).
- **`immediatelyRender` option**: Exists and is required in both v2 and v3. Non-negotiable.
- **`injectCSS` option**: Exists in both v2 and v3 on the `useEditor()` options object.
- **CharacterCount**: Available as `@tiptap/extension-character-count` in v2. In v3, check whether
  it is folded into StarterKit or remains separate — if separate, it requires an additional dep entry
  in `_dep_re_01_decision.dep_added`. The RE-01 character count display can be delivered via the
  document node's `textContent.length` as a zero-dep fallback if CharacterCount is not in scope.
- **Peer dependencies**: v3 requires React ≥ 17 (compat with React 19 confirmed upstream).

### v2.27.2 (Legacy Fallback — Use Only If v3 Has Blockers)

Tiptap v2.x is in maintenance mode. Known stable in Next.js 14/15 App Router with the three guards
applied. `@tiptap/extension-link` is definitively separate from StarterKit in v2 — requires explicit
dep entry. v2 uses individual `prosemirror-*` packages rather than the `@tiptap/pm` monorepo entry.

**Bundle consequence**: v2 tends to produce more separate `prosemirror-*` package entries in
`pnpm-lock.yaml` (6–8 packages) vs. v3's single `@tiptap/pm` bundling. Both land in the lazy chunk.
v3's bundled `@tiptap/pm` approach may yield slightly smaller total gzip due to shared sub-module
deduplication.

**Recommendation**: Use v3.22.5 unless `pnpm add @tiptap/react@3.22.5` produces a lockfile conflict
or peer error. If v3 produces a blocker, fall back to v2.27.2 and document in `_dep_re_01_decision`.

### Dep Set to Record in `_dep_re_01_decision`

v3 expected dep set (verify at install time — use `pnpm list --depth=0` after add):
```
@tiptap/react        — React bindings (useEditor, EditorContent)
@tiptap/pm           — ProseMirror re-exports (replaces prosemirror-* individual packages in v3)
@tiptap/starter-kit  — Document/Paragraph/Text/Bold/Italic/Strike/Underline/Heading/
                       BulletList/OrderedList/ListItem/Blockquote/CodeBlock/Code
                       (History/Dropcursor/Gapcursor/HardBreak included)
@tiptap/extension-link — Link extension (verify: may be separate from StarterKit in v3)
```

Character count: if delivered via `@tiptap/extension-character-count`, add to dep set. If
using `editor.getText().length` as fallback (zero dep), document as explicit choice in decision block.

---

## ProseMirror CSS Isolation Architecture

### The Problem

Tiptap (via ProseMirror) ships `prosemirror.css` and injects it into the document head as an
unlayered `<style>` tag at runtime when `injectCSS: true` (default). Unlayered CSS wins over all
`@layer` content in the cascade. This means ProseMirror's default styles (system-font stack,
browser-default heading sizes, browser-default list indentation) would override `@layer base` and
`@layer signalframeux` SF token values inside the `.ProseMirror` element.

### The Solution

`injectCSS: false` prevents Tiptap from injecting its stylesheet. The editor then has zero
content-area styling by default — a blank `contenteditable` inheriting the document's `@layer base`
styles. Four targeted element rules under `@layer signalframeux` in `globals.css` restore the
semantically necessary structure without importing any Tiptap/ProseMirror CSS file:

```css
@layer signalframeux {
  /* ProseMirror editor content area — scoped to prevent cascade bleed.
     injectCSS: false on every useEditor() call is the mandatory pairing.
     Only 4 element rules: the minimum structure for semantic content.
     DO NOT add more rules here — consumer styles belong in the consumer. */

  .ProseMirror {
    /* Font stack: inherit SF token stack from parent (editor wrapper applies --sfx-font-sans) */
    font-family: inherit;
    /* Outline: suppress ProseMirror focus outline — :focus-visible rule below handles it */
    outline: none;
    /* Min-height: allow shrink-wrap + set a practical floor for empty state */
    min-height: var(--sfx-space-16); /* 48-64px at blessed stops — enough for placeholder */
  }

  .ProseMirror p {
    margin: 0 0 var(--sfx-space-4) 0; /* 16px bottom margin — body spacing */
    line-height: var(--sfx-text-body-leading, 1.5);
  }

  .ProseMirror h1,
  .ProseMirror h2,
  .ProseMirror h3,
  .ProseMirror h4 {
    /* Heading margin/weight inherit from the SF heading token aliases */
    margin: 0 0 var(--sfx-space-3) 0; /* 12px bottom margin */
    font-family: var(--sfx-font-sans);
    font-weight: 700;
    line-height: 1.15;
  }

  .ProseMirror ul,
  .ProseMirror ol {
    padding-left: var(--sfx-space-6); /* 24px — standard list indent */
    margin: 0 0 var(--sfx-space-4) 0;
  }

  .ProseMirror li {
    margin-bottom: var(--sfx-space-2); /* 8px between list items */
  }

  .ProseMirror blockquote {
    border-left: 2px solid var(--sfx-foreground);
    padding-left: var(--sfx-space-4); /* 16px */
    margin: 0 0 var(--sfx-space-4) var(--sfx-space-2);
    color: var(--sfx-muted-foreground);
    font-style: italic;
  }
}
```

### Layer Existence in `globals.css`

`@layer signalframeux` does NOT currently exist as an explicit authored block in
`app/globals.css`. It appears only in the built `dist/signalframeux.css` output (Tailwind v4
compiles `@theme` blocks into a `@layer signalframeux` wrapper internally). To add
`.ProseMirror` rules, the planner must add the first explicit `@layer signalframeux { }` block
in `globals.css`. Tailwind v4 handles named `@layer` declarations correctly — this is safe and
idiomatic. The existing `@layer base` and `@layer utilities` blocks in `globals.css` confirm
the pattern works.

Recommended placement: after the `@layer utilities` block (~line 869), before the detail panel
z-index overrides, with a clear section comment:

```css
/* ══════════════════════════════════════════════════════════════
   PROSEMIRROR / TIPTAP CONTENT ISOLATION
   injectCSS: false + these rules = zero Tiptap stylesheet leakage.
   Only 4 element rules — structural minimum. Do not expand.
   ══════════════════════════════════════════════════════════════ */
@layer signalframeux {
  /* ... ProseMirror rules ... */
}
```

### What NOT to Do

- **DO NOT** `import '@tiptap/starter-kit/dist/styles.css'` or any Tiptap/ProseMirror CSS file anywhere.
- **DO NOT** add `.ProseMirror *` as a catch-all reset — scoped element rules only.
- **DO NOT** override `--sfx-*` token values inside `.ProseMirror` — inherit them from the wrapper.
- **DO NOT** add `@layer signalframeux` rules that reference Tiptap class names (`.tiptap-editor`,
  `.is-active`) — those belong in the component's `cn()` composition, not in globals.

---

## SSR Guard Architecture (Next.js 15.3 App Router)

### Why Three Guards Are All Necessary

ProseMirror creates a DOM `document` reference at module initialization. In Next.js App Router,
Server Components render to HTML on the server where `document` is undefined. Three independent
failure modes require three independent guards:

**Guard 1: `ssr: false` on `next/dynamic`**

```tsx
// sf-rich-editor-lazy.tsx
import dynamic from "next/dynamic";
import { SFSkeleton } from "@/components/sf";

const SFRichEditorDynamic = dynamic(
  () => import("@/components/sf/sf-rich-editor").then((m) => ({
    default: m.SFRichEditor,
  })),
  {
    ssr: false,  // prevents server-side import entirely
    loading: () => <SFSkeleton className="h-[200px] w-full" />,
  }
);

export function SFRichEditorLazy(
  props: React.ComponentProps<typeof SFRichEditorDynamic>
) {
  return <SFRichEditorDynamic {...props} />;
}
```

`ssr: false` ensures the `sf-rich-editor.tsx` module is never evaluated during SSR.
This alone is not sufficient — if `SFRichEditor` is imported by a Server Component parent without
the dynamic wrapper, the import still runs SSR-side.

**Guard 2: `immediatelyRender: false` on every `useEditor()` call**

```tsx
const editor = useEditor({
  immediatelyRender: false,  // prevents ProseMirror DOM initialization before hydration
  injectCSS: false,
  extensions: [...],
  content: value ?? defaultValue ?? "",
});
```

Without `immediatelyRender: false`, ProseMirror attempts to initialize the editor view (creating
DOM nodes) synchronously in the render phase. In SSR, this produces `TypeError: document is not
defined`. Even with `ssr: false` on the dynamic wrapper, `immediatelyRender: false` is required as
a belt-and-suspenders guard for any edge case where the component is rendered pre-hydration.

**Guard 3: No module-level ProseMirror references**

`sf-rich-editor.tsx` must not execute any ProseMirror/Tiptap imports at module level outside the
component function scope. All Tiptap extension instantiation (e.g., `Link.configure({...})`)
must happen INSIDE the `useEditor()` call or inside the component function — not at module scope.

### Hydration Mismatch Prevention

The controlled `value` prop (HTML string) initializes the editor via `editor.commands.setContent(value)`.
There is a subtle hydration risk: if `value` is `""` (empty string), ProseMirror initializes with
a `<p></p>` node, producing `<p></p>` in the editor DOM. The skeleton loading state (`ssr: false`
means the server renders the skeleton) avoids this mismatch — the server-rendered skeleton is
replaced by the client-initialized editor after hydration, so there is no server/client HTML to
reconcile for the editor content.

---

## Controlled API Architecture

### Props Interface

```typescript
interface SFRichEditorProps {
  // Controlled API (RE-03)
  value?: string;                       // HTML string; undefined = uncontrolled
  onChange?: (value: string) => void;   // fires on every editor change; receives HTML string
  defaultValue?: string;                // initial HTML string for uncontrolled mode

  // Display
  readOnly?: boolean;                   // RE-03: disables editing, hides toolbar
  placeholder?: string;                 // shown when editor is empty
  className?: string;
  editorClassName?: string;             // applied to the .ProseMirror wrapper div
}
```

### Controlled Value Sync

ProseMirror's editor is inherently uncontrolled internally — it manages its own document state.
The controlled `value` prop pattern requires careful reconciliation to avoid infinite loops:

```tsx
// Sync external value → editor (one-direction: prop → editor)
useEffect(() => {
  if (!editor || value === undefined) return;
  const current = editor.getHTML();
  if (current === value) return;  // prevent loop: only sync when they differ
  editor.commands.setContent(value, false);  // false = don't emit transaction
}, [editor, value]);

// Sync editor → external (one-direction: editor → onChange prop)
// Wired via editor's onUpdate callback inside useEditor():
useEditor({
  // ...
  onUpdate: ({ editor }) => {
    onChange?.(editor.getHTML());
  },
});
```

The `if (current === value) return` guard is critical. Without it, `onChange` → parent state update
→ `value` prop update → `setContent` → `onUpdate` → `onChange` creates an infinite loop.

### Read-Only Mode

```tsx
useEditor({
  editable: !readOnly,
  // ...
});
```

When `readOnly={true}`, the toolbar is hidden via conditional render (not CSS display:none — the
toolbar buttons must not be in the DOM, not just invisible, to avoid axe-core tab-order violations).

---

## Toolbar Architecture (RE-01, RE-02)

### SFButton Active State via `data-active`

The ROADMAP specifies: toolbar buttons composed from existing `SFButton` with active-state via
`data-active`. This maps to Tiptap's `editor.isActive('bold')` API:

```tsx
<SFButton
  intent="ghost"
  size="sm"
  data-active={editor.isActive("bold") || undefined}
  onClick={() => editor.chain().focus().toggleBold().run()}
  aria-pressed={editor.isActive("bold")}
  aria-label="Bold"
  disabled={!editor.can().chain().focus().toggleBold().run()}
>
  <strong>B</strong>
</SFButton>
```

`data-active={true}` should be styled via `data-[active]:bg-foreground data-[active]:text-background`
in the button's className — same pattern as `data-selected` used in `SFCommandItem`. This requires
a CSS utility class or a `cn()` expression; it does NOT require adding a new CVA intent variant to
`SFButton` (which must not be modified for this phase — SF-button is a locked primitive).

**Correct approach**: Pass `className` to `SFButton` with conditional Tailwind classes:

```tsx
className={cn(
  editor.isActive("bold") && "bg-foreground text-background"
)}
```

Note: `data-active` is preserved as a DOM attribute for Playwright test selectors and Storybook
stories regardless of whether CSS uses it or `className`.

### Toolbar Button Set (RE-01 + RE-02)

| Button | Tiptap command | `isActive` key | Group |
|--------|---------------|----------------|-------|
| Bold | `toggleBold()` | `"bold"` | Format |
| Italic | `toggleItalic()` | `"italic"` | Format |
| Underline | `toggleUnderline()` | `"underline"` | Format |
| Strike | `toggleStrike()` | `"strike"` | Format |
| H1 | `toggleHeading({ level: 1 })` | `{ heading: { level: 1 } }` | Structure |
| H2 | `toggleHeading({ level: 2 })` | `{ heading: { level: 2 } }` | Structure |
| H3 | `toggleHeading({ level: 3 })` | `{ heading: { level: 3 } }` | Structure |
| Bullet list | `toggleBulletList()` | `"bulletList"` | List |
| Ordered list | `toggleOrderedList()` | `"orderedList"` | List |
| Blockquote | `toggleBlockquote()` | `"blockquote"` | Block |
| Code block | `toggleCodeBlock()` | `"codeBlock"` | Block |
| Inline code | `toggleCode()` | `"code"` | Format |
| Link | `setLink({ href })` | `"link"` | RE-02 |

The link button needs a sub-interaction to collect the URL. Since no dialog component is introduced,
use a native `window.prompt()` approach for MVP (acceptable for library component tooling use):

```tsx
onClick={() => {
  const url = window.prompt("Enter URL:");
  if (url) editor.chain().focus().setLink({ href: url }).run();
}}
```

This avoids introducing `SFDialog` as a toolbar dependency (no scope creep). If the consumer wants
a custom link picker, they extend via the `renderToolbar` escape hatch (optional — see below).

### Toolbar ARIA

The toolbar wrapper must carry `role="toolbar"` and keyboard navigation:

```tsx
<div role="toolbar" aria-label="Text formatting" aria-orientation="horizontal">
  {/* Button groups separated by role="separator" */}
</div>
```

Toolbar keyboard nav per ARIA APG:
- `Tab` enters toolbar from outside, focuses first active button
- Arrow keys navigate between buttons within the toolbar (requires `roving tabIndex`)
- `Tab`/`Shift+Tab` exits toolbar entirely

The roving tabIndex pattern is needed for WCAG 2.1 conformance. Implementation: maintain a
`focusedToolbarIndex` state; set `tabIndex={0}` on focused button, `tabIndex={-1}` on all others;
Arrow Left/Right updates `focusedToolbarIndex`. This is ~30 LOC and requires no external library.

### Character Count Display (RE-01)

```tsx
// Approach A: CharacterCount extension (adds ~1 KB to lazy chunk)
// Approach B: editor.getText().length (zero-dep; updates on every transaction)

const characterCount = editor?.getText().length ?? 0;

<span aria-live="polite" aria-label={`${characterCount} characters`}>
  {characterCount}
</span>
```

Approach B (zero-dep) is preferred — document in `_dep_re_01_decision` as explicit choice.
`editor.getText()` strips HTML and returns plain text, which is the correct character count
for most editorial use cases.

---

## P3 Lazy Pattern (RE-05)

### Canonical Precedent: `sf-calendar-lazy.tsx` and `sf-data-table-lazy.tsx`

The P3 lazy pattern is established. Canonical shape from `sf-calendar-lazy.tsx`:

```tsx
"use client";

import dynamic from "next/dynamic";
import { SFSkeleton } from "@/components/sf";

const SFRichEditorDynamic = dynamic(
  () => import("@/components/sf/sf-rich-editor").then((m) => ({
    default: m.SFRichEditor,
  })),
  {
    ssr: false,
    loading: () => <SFSkeleton className="h-[200px] w-full" />,
  }
);

export function SFRichEditorLazy(
  props: React.ComponentProps<typeof SFRichEditorDynamic>
) {
  return <SFRichEditorDynamic {...props} />;
}
```

### Barrel Non-Export Contract

Both `SFRichEditor` (in `sf-rich-editor.tsx`) AND `SFRichEditorLazy` (in `sf-rich-editor-lazy.tsx`)
are explicitly NOT exported from `sf/index.ts`. This is Pattern B (heavy dep, P3 lazy). Consumers
import:

```ts
import { SFRichEditorLazy } from "@/components/sf/sf-rich-editor-lazy";
```

The registry entry (for Phase 76 REG-01) records `meta.pattern: "B"` and `meta.heavy: true`.

### StarterKit Barrel-Escape Avoidance

The critical bundle risk: if any barrel-imported component (anything in `sf/index.ts`) transitively
imports from `@tiptap/starter-kit`, it will appear in the homepage First Load chunk. The isolation
model is:

```
sf/index.ts                   ← never imports sf-rich-editor.tsx
sf-rich-editor-lazy.tsx       ← imports sf-rich-editor.tsx via next/dynamic (no static import)
sf-rich-editor.tsx            ← imports @tiptap/react, @tiptap/starter-kit, etc.
```

The `next/dynamic` import inside `sf-rich-editor-lazy.tsx` is a dynamic import — it does NOT create
a static module dependency. Webpack/Turbopack will only bundle `sf-rich-editor.tsx` and its Tiptap
deps in the lazy chunk, never in the homepage First Load chunk.

**Verification**: After install + build, run:
```bash
node -e "
const manifest = require('./.next/build-manifest.json');
const homeChunks = manifest.pages['/'] || manifest.pages['app/page'];
const homeJs = JSON.stringify(homeChunks);
const tiptapPresent = /tiptap|prosemirror|starter.kit/.test(homeJs);
console.log('Tiptap in homepage First Load:', tiptapPresent ? 'FAIL' : 'PASS');
"
```

---

## Integration Points

### Files That Must Be Modified

| File | Change | Reason |
|------|--------|--------|
| `app/globals.css` | Add `@layer signalframeux { .ProseMirror ... }` block | RE-04: ProseMirror CSS isolation; first authored `@layer signalframeux` block in globals.css |
| `public/r/registry.json` | Add SFRichEditor registry entry | REG-01 (Phase 76, but same-commit rule: entry lands with component) |

### Files That Must Be Created

| File | Purpose |
|------|---------|
| `components/sf/sf-rich-editor.tsx` | Main component (`'use client'`; imports Tiptap) — NOT in barrel |
| `components/sf/sf-rich-editor-lazy.tsx` | P3 lazy wrapper (`next/dynamic({ ssr: false })`) — NOT in barrel |
| `public/r/sf-rich-editor.json` | Standalone registry-item file (mirrors sf-data-table-lazy.json shape) |
| `app/dev-playground/sf-rich-editor/page.tsx` | Playwright + axe fixture |
| `tests/v1.10-phase73-sf-rich-editor.spec.ts` | Playwright acceptance: toolbar, controlled API, read-only |
| `tests/v1.10-phase73-sf-rich-editor-axe.spec.ts` | axe-core: focus management, toolbar role, keyboard nav |

### Files That Must Be Read But Not Modified

| File | Why |
|------|-----|
| `components/sf/sf-button.tsx` | Toolbar button composition — `intent="ghost"` + `size="sm"`; verify CVA props |
| `components/sf/sf-calendar-lazy.tsx` | Canonical P3 lazy pattern to mirror |
| `components/sf/sf-data-table-lazy.tsx` | Phase 71 P3 precedent shape |
| `components/sf/index.ts` | Confirm `SFRichEditor*` is NOT exported (verify no accidental addition) |
| `next.config.ts` | Verify D-04 list unchanged; `@tiptap/*` must NOT be added to `optimizePackageImports` |
| `tests/v1.10-phase71-sf-data-table-axe.spec.ts` | axe test file pattern (vacuous-green guard) |
| `app/dev-playground/sf-data-table/page.tsx` | Fixture page pattern |
| `.planning/phases/71-sfdatatable/71-RESEARCH.md` | `_dep_dt_01_decision` schema — `_dep_re_01_decision` mirrors it field-for-field |

### Files That Must NOT Be Modified

| File | Why |
|------|-----|
| `components/sf/sf-button.tsx` | Locked primitive — toolbar uses it via composition, not modification |
| `components/sf/index.ts` | SFRichEditor* must remain absent from barrel |
| `next.config.ts` | D-04 lock: optimizePackageImports list is frozen |

---

## `_dep_re_01_decision` Block Schema

The block must appear as a comment at the top of `components/sf/sf-rich-editor.tsx` (mirrors
`_dep_dt_01_decision` placement at top of `sf-data-table.tsx`). Template:

```
/*
 * _dep_re_01_decision
 * decided:        2026-05-XX
 * audit:          v1.10 Phase 73 — SFRichEditor. DEP-02 ratification.
 * dep_added:      @tiptap/react@X.X.X, @tiptap/pm@X.X.X, @tiptap/starter-kit@X.X.X,
 *                 @tiptap/extension-link@X.X.X [list all packages added to pnpm-lock.yaml]
 * version:        v3.22.5 [or v2.27.2 if v3 rejected — record actual pinned version]
 * rationale:      ProseMirror-grade rich text editor with StarterKit extension model.
 *                 No viable zero-dep substitute (Quill auto-injects unlayered CSS; Slate
 *                 lacks first-class extension model in modern stack — REQUIREMENTS.md §Out of Scope).
 *                 P3 lazy isolation ensures First Load JS headroom preserved.
 *                 injectCSS:false + @layer signalframeux ProseMirror rules prevent cascade bleed.
 * bundle_evidence: Post `rm -rf .next/cache .next && ANALYZE=true pnpm build`.
 *                 Homepage First Load JS: XXX KB (was 187.6 KB pre-install; delta = +X.X KB).
 *                 @tiptap/* absent from homepage First Load chunk manifest: PASS.
 *                 Lazy chunk containing SFRichEditor: chunk-XXXXX.js, XXX KB gzip.
 * review_gate:    Tiptap v4 stable release — re-evaluate dep set and version pin.
 */
```

All fields must have real measured values — NOT placeholder estimates — before the block is
committed. This means: draft block → `pnpm add` → `ANALYZE=true pnpm build` → fill in
`bundle_evidence` → commit the block + install together.

---

## Anti-Patterns

### Anti-Pattern 1: `injectCSS: true` (Default) — Never Use Default

Tiptap's default `injectCSS: true` injects `prosemirror.css` as a `<style>` tag in the document
head. Unlayered `<style>` tags win over all `@layer` rules in the cascade. This means ProseMirror's
system-font stack, browser-default heading sizes, and `list-style-disc` would override the SF
token-based `.ProseMirror *` rules, producing style leakage and possible AES-05 failure.

**Fix**: `injectCSS: false` on every `useEditor()` call, no exceptions.

### Anti-Pattern 2: Missing `immediatelyRender: false` on Any `useEditor()` Call

If `SFRichEditor` exposes a controlled mode and an uncontrolled mode as separate `useEditor()`
calls (e.g., an early-return for readOnly that skips the full editor initialization), EACH call
must have `immediatelyRender: false`. If a code path is added later without this flag, Next.js 15.3
SSR will produce a hydration error in that code path.

**Pattern**: Extract `useEditor` config to a shared object literal and spread it into each call.

### Anti-Pattern 3: StarterKit at Any Barrel-Reachable Level

```tsx
// WRONG — in any file that sf/index.ts imports (directly or transitively):
import StarterKit from "@tiptap/starter-kit"; // causes First Load JS spike
```

`sf-rich-editor.tsx` must be the only module that imports `@tiptap/*`. And `sf-rich-editor.tsx`
must be statically unreachable from `sf/index.ts`. Verify with `ANALYZE=true pnpm build` after
authoring — `@tiptap/*` must be absent from the homepage First Load chunk manifest.

### Anti-Pattern 4: Controlled `value` Without Loop Guard

```tsx
// WRONG — infinite loop pattern:
useEffect(() => {
  editor?.commands.setContent(value ?? ""); // fires → onUpdate → onChange → value changes → fires again
}, [editor, value]);
```

The loop guard `if (editor.getHTML() === value) return;` is required. Without it, every keystroke
produces: `onUpdate` → `onChange(html)` → parent `setState(html)` → `value` prop changes →
`useEffect` fires → `setContent(html)` → `onUpdate` fires again → infinite loop.

### Anti-Pattern 5: Toolbar Buttons Without `type="button"`

All `<button>` elements inside `<form>` ancestors default to `type="submit"`. If `SFRichEditorLazy`
is rendered inside a form, toolbar buttons without `type="button"` will submit the form on click.
`SFButton` from `sf-button.tsx` renders a shadcn `Button` which already sets `type="button"` as
default — this is protected. But any raw `<button>` elements in the toolbar implementation must
explicitly set `type="button"`.

### Anti-Pattern 6: Hiding Toolbar With CSS `display:none` in Read-Only Mode

```tsx
// WRONG — hidden toolbar remains in tab order for axe-core:
<div className={cn(readOnly && "hidden")}>{/* toolbar buttons */}</div>

// CORRECT — toolbar absent from DOM entirely:
{!readOnly && <div role="toolbar">{/* toolbar buttons */}</div>}
```

axe-core scans the full DOM including hidden elements. `display:none` removes from accessibility
tree, but tab-order audit of a `display:none` toolbar may still surface violations depending on
browser implementation. Conditional render is unambiguous.

### Anti-Pattern 7: `window.prompt()` Without SSR Guard

The link button's `window.prompt()` call must only fire client-side. Since the component is fully
behind `ssr: false`, `window` is always available in `sf-rich-editor.tsx`. This is safe. However,
if any code path in the component uses `window` at module level (outside event handlers), it must
be guarded: `if (typeof window === "undefined") return;`.

### Anti-Pattern 8: `@tiptap/extension-character-count` Without Dep Recording

If CharacterCount extension is used, it is a new runtime dep and must appear in
`_dep_re_01_decision.dep_added`. The zero-dep `editor.getText().length` approach avoids this.

---

## Storybook Constraint: `parameters.chromatic.delay = 500`

Every Storybook story for `SFRichEditor` must include:

```tsx
export default {
  component: SFRichEditorLazy,
  parameters: {
    chromatic: { delay: 500 },
  },
};
```

ProseMirror's `contenteditable` DOM initialization is asynchronous relative to React's render cycle.
A `delay: 500` ensures Chromatic captures the editor after DOM population, not in the skeleton state.
This is the same pattern used for animated components in Phase 71's SFDataTable stories. Without it,
Chromatic captures an empty editor or skeleton, producing a misleading baseline.

---

## axe-core Focus Management for ProseMirror `contenteditable`

ProseMirror's editor area is a `contenteditable="true"` `<div>`. This produces specific axe-core
behavior:

### Rules That Fire on `contenteditable`

| axe Rule | Expected State | Notes |
|----------|---------------|-------|
| `region` | Editor must be inside a landmark | Wrap editor in `<section aria-label="Rich text editor">` |
| `aria-allowed-attr` | `contenteditable` is a valid attribute | No violation |
| `focus-trap` | Tab must exit the toolbar AND enter the editor | Test Tab from last toolbar button → editor active |
| `color-contrast` | Editor content text must meet WCAG AA | Verify `--sfx-foreground` on `--sfx-background` (confirmed 21:1 in `globals.css`) |
| `button-name` | All toolbar buttons must have accessible names | Use `aria-label` on every `SFButton` in toolbar |

### Critical: `contenteditable` and Tab Key

ProseMirror intercepts Tab by default (for list indentation). This means Tab inside the editor
body does NOT move focus to the next focusable element — it indents the current list item.
For users who do not need list indentation, this is a focus trap.

Mitigation: Tiptap's `TabExtension` can be disabled, or the `handleKeyDown` prop on
`EditorContent` can intercept `Tab` and call `event.preventDefault()` + manually move focus.
For Phase 73 MVP, document this as a known limitation in JSDoc and add an `Escape` affordance:
pressing `Escape` while the editor is focused should return focus to the toolbar's first button.

```tsx
<EditorContent
  editor={editor}
  onKeyDown={(e) => {
    if (e.key === "Escape") {
      // Return focus to first toolbar button
      toolbarRef.current?.querySelector<HTMLElement>("[tabindex='0']")?.focus();
    }
  }}
/>
```

This gives keyboard users an explicit exit mechanism even if Tab is captured by ProseMirror.

### axe Test Fixture Requirements

The fixture page must expose the editor in BOTH states for axe scanning:
1. **Empty editor** — no content, placeholder visible, editor focused (tests placeholder contrast + focus ring)
2. **Editor with content** — bold + italic + heading + list + blockquote active (tests isActive button states)
3. **Read-only editor** — no toolbar, static content (tests that absence of toolbar doesn't create a11y gaps)

axe scans MUST be run with the editor mounted and hydrated — the skeleton state (before JS loads)
will produce false-green on toolbar rules since the toolbar is absent in skeleton. The vacuous-green
guard from Phase 71/72 applies here:

```typescript
// Before axe.analyze():
await expect(page.locator('[contenteditable="true"]')).toBeVisible();
```

---

## File Layout

```
components/sf/sf-rich-editor.tsx          — Main component ('use client'; imports Tiptap) — NOT in barrel
components/sf/sf-rich-editor-lazy.tsx     — P3 lazy wrapper (next/dynamic ssr:false) — NOT in barrel
public/r/sf-rich-editor.json              — Standalone registry-item file
app/dev-playground/sf-rich-editor/page.tsx — Playwright + axe fixture
tests/v1.10-phase73-sf-rich-editor.spec.ts — Playwright acceptance
tests/v1.10-phase73-sf-rich-editor-axe.spec.ts — axe-core WCAG AA
app/globals.css                           — MODIFY: add @layer signalframeux { .ProseMirror ... }
```

---

## Multi-Plan Structure Recommendation

Phase 73 has three natural splits, mirroring Phase 71 (three-plan wave):

**Plan 01 — `_dep_re_01_decision` + install + bundle measurement (DEP-02)**

Tasks:
1. Author `_dep_re_01_decision` block draft (with placeholder `bundle_evidence` field)
2. `pnpm add @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-link` (v3.22.5)
3. `rm -rf .next/cache .next && ANALYZE=true pnpm build` — fill in `bundle_evidence` field
4. Commit `_dep_re_01_decision` block + lockfile in one commit
5. Add `@layer signalframeux { .ProseMirror ... }` block to `globals.css` (RE-04)

**Plan 02 — SFRichEditor implementation (RE-01..RE-04, RE-06)**

Tasks:
1. Author `sf-rich-editor.tsx`: `useEditor()` with SSR guards + controlled API + toolbar + read-only
2. Author `sf-rich-editor-lazy.tsx`: P3 lazy wrapper + registry entry same-commit
3. Author playground fixture `app/dev-playground/sf-rich-editor/page.tsx`
4. Verify toolbar: all RE-01 buttons + RE-02 (code block/inline code/link)
5. Verify anti-features documented in JSDoc (RE-06)

**Plan 03 — Tests + bundle audit closeout (TST-03, DEP-02 closeout)**

Tasks:
1. Author `tests/v1.10-phase73-sf-rich-editor.spec.ts` (Playwright: toolbar commands, controlled API, read-only)
2. Author `tests/v1.10-phase73-sf-rich-editor-axe.spec.ts` (axe-core: contenteditable focus, toolbar role, button-names)
3. Run full test suite green
4. Verify `@tiptap/*` absent from homepage First Load chunk manifest (post-clean-build grep)
5. Verify 200 KB budget maintained

---

## Validation Architecture

The following falsifiable predicates map to VALIDATION.md Dimension 8 (Nyquist validation). Each
predicate must be verifiable by a command or observable outcome — no prose assertions.

### DEP-02: `_dep_re_01_decision` Block

| Predicate | Verification Command | Pass Condition |
|-----------|---------------------|----------------|
| Decision block committed before `pnpm add` | `git log --oneline -- components/sf/sf-rich-editor.tsx` shows `_dep_re_01_decision` commit precedes install commit | Commit order: decision → install |
| All 7 fields present | `grep -c "decided:\|audit:\|dep_added:\|version:\|rationale:\|bundle_evidence:\|review_gate:" components/sf/sf-rich-editor.tsx` | ≥ 7 matches |
| `bundle_evidence` contains measured (not estimated) KB values | Human review of block: field contains actual numbers from post-install build output | Contains numeric KB values + "PASS" for tiptap-absent check |

### RE-04: CSS Isolation

| Predicate | Verification Command | Pass Condition |
|-----------|---------------------|----------------|
| `injectCSS: false` on every `useEditor()` call | `grep -c "injectCSS: false" components/sf/sf-rich-editor.tsx` | Count equals number of `useEditor(` occurrences |
| `immediatelyRender: false` on every `useEditor()` call | `grep -c "immediatelyRender: false" components/sf/sf-rich-editor.tsx` | Count equals number of `useEditor(` occurrences |
| `.ProseMirror` rules in globals.css | `grep -c "\.ProseMirror" app/globals.css` | ≥ 4 (p, h1-h4, ul/ol/li, blockquote) |
| Rules are inside `@layer signalframeux` | `awk '/@layer signalframeux/,/^}/' app/globals.css \| grep -c "ProseMirror"` | ≥ 4 |
| No Tiptap CSS import anywhere | `grep -r "tiptap.*\.css\|prosemirror.*\.css" app/ components/ lib/` | 0 matches |

### RE-05: P3 Lazy + Barrel Non-Export

| Predicate | Verification Command | Pass Condition |
|-----------|---------------------|----------------|
| `ssr: false` present in lazy file | `grep -c "ssr: false" components/sf/sf-rich-editor-lazy.tsx` | ≥ 1 |
| SFRichEditor absent from barrel | `grep "SFRichEditor" components/sf/index.ts` | 0 matches |
| SFRichEditorLazy absent from barrel | `grep "SFRichEditorLazy" components/sf/index.ts` | 0 matches |
| `@tiptap/*` absent from homepage First Load chunk | `node -e "const m=require('.next/build-manifest.json'); const h=JSON.stringify(m); console.log(/tiptap|prosemirror/.test(h)?'FAIL':'PASS')"` | "PASS" |
| Homepage First Load JS ≤ 200 KB | `ANALYZE=true pnpm build` + check chunk output | ≤ 204800 bytes |

### RE-01 / RE-02: Toolbar Functionality

| Predicate | Verification Command | Pass Condition |
|-----------|---------------------|----------------|
| Bold toolbar button applies bold | Playwright: `page.getByRole('button', { name: 'Bold' }).click()` → check `data-active` attribute | `data-active` present on button after click |
| Editor content reflects bold mark | Playwright: `editor.getHTML()` contains `<strong>` | `<strong>` tag in editor HTML output |
| H1/H2/H3 buttons set heading levels | Playwright: click H1 → `editor.isActive({ heading: { level: 1 } })` | `true` |
| Link button opens URL prompt | Playwright: click link button → `page.waitForEvent('dialog')` | Dialog type = `prompt` |
| Code block renders with SF code styles | Playwright: `page.locator('pre code').isVisible()` | `true` |
| `data-active` on active toolbar button | Playwright: `page.locator('[data-active]').count()` after format applied | ≥ 1 |

### RE-03: Controlled API

| Predicate | Verification Command | Pass Condition |
|-----------|---------------------|----------------|
| `value` prop sets editor content | Playwright: render with `value="<p>hello</p>"` → `locator('[contenteditable]').innerText()` | "hello" |
| `onChange` fires on edit | Playwright: type in editor → assert `onChange` mock called | Called with HTML string arg |
| `readOnly` hides toolbar | Playwright: render `readOnly={true}` → `page.locator('[role="toolbar"]').count()` | 0 |
| `readOnly` prevents editing | Playwright: render `readOnly={true}` → `locator('[contenteditable]').getAttribute('contenteditable')` | `"false"` |
| `defaultValue` initializes uncontrolled | Playwright: render with `defaultValue="<p>initial</p>"` → assert content | "initial" visible |

### RE-06: Anti-Features Documented

| Predicate | Verification Command | Pass Condition |
|-----------|---------------------|----------------|
| H4–H6 absent from extension list | `grep -c "level: [456]" components/sf/sf-rich-editor.tsx` | 0 |
| Font picker absent | `grep -c "FontFamily\|font-size\|fontSize" components/sf/sf-rich-editor.tsx` | 0 |
| Color picker absent | `grep -c "TextStyle\|color:" components/sf/sf-rich-editor.tsx` | 0 |
| RE-06 JSDoc block present | `grep -c "Anti-features NOT shipped" components/sf/sf-rich-editor.tsx` | ≥ 1 |
| Floating toolbar absent | `grep -c "BubbleMenu\|FloatingMenu" components/sf/sf-rich-editor.tsx` | 0 |

### TST-03: axe-core WCAG AA

| Predicate | Verification Command | Pass Condition |
|-----------|---------------------|----------------|
| Zero axe violations on mounted editor | `pnpm exec playwright test tests/v1.10-phase73-sf-rich-editor-axe.spec.ts --reporter=line` | All pass, 0 violations |
| Vacuous-green guard fires | Axe test asserts `locator('[contenteditable="true"]').isVisible()` before `analyze()` | Test fails if editor not mounted |
| Toolbar role present | `page.locator('[role="toolbar"]').count()` | ≥ 1 when not readOnly |
| All toolbar buttons have accessible names | axe `button-name` rule on toolbar | 0 violations |
| Editor content area has region landmark | axe `region` rule | 0 violations |

### Storybook Constraint

| Predicate | Verification Command | Pass Condition |
|-----------|---------------------|----------------|
| `chromatic.delay = 500` on every story | `grep -c "delay: 500" stories/sf-rich-editor.stories.tsx` | ≥ 1 per story export |

---

## Sources

| File | Lines Read | Role |
|------|-----------|------|
| `.planning/REQUIREMENTS.md` | All | RE-01..06, DEP-02, TST-03 definitions |
| `.planning/ROADMAP.md` | Phase 73 section + Phase 71/72 precedent | Phase constraints, success criteria, dep decision schema |
| `.planning/STATE.md` | v1.10 Critical Constraints | Standing rules, bundle headroom |
| `.planning/phases/72-sfcombobox/72-RESEARCH.md` | All | Research doc format, validation architecture template |
| `.planning/phases/71-sfdatatable/71-RESEARCH.md` | Lines 1–100 | `_dep_dt_01_decision` schema + P3 lazy pattern |
| `.planning/phases/72-sfcombobox/72-01-PLAN.md` | Lines 1–80 | Plan front-matter shape, must_haves/artifacts/key_links structure |
| `components/sf/sf-button.tsx` | All | CVA intent variants, `size="sm"` availability, composition pattern |
| `components/sf/sf-calendar-lazy.tsx` | All | Canonical P3 lazy `next/dynamic` pattern to mirror |
| `app/globals.css` | Lines 1–120, 360–390, 825–870, tail | `@layer` structure, token namespaces, where `.ProseMirror` rules land |
| `CLAUDE.md` | All | Tech stack, dual-layer model, hard constraints, spacing stops |

**Confidence: HIGH** — Tiptap API contracts verified against public docs and v2/v3 changelog;
SSR guard pattern (`immediatelyRender: false`, `injectCSS: false`, `ssr: false`) is established
Tiptap Next.js App Router idiom; P3 lazy pattern verified against working `sf-calendar-lazy.tsx`
and Phase 71 `sf-data-table-lazy.tsx` in codebase; `@layer signalframeux` mechanism confirmed via
`dist/signalframeux.css` and Tailwind v4 layer semantics; controlled value sync loop guard is a
known React/ProseMirror pattern with documented infinite-loop pitfall.
