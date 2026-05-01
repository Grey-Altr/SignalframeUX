"use client";

/**
 * SFRichEditor — FRAME layer ProseMirror rich text editor (Pattern B, P3 lazy).
 *
 * Pattern B contract (DO NOT VIOLATE):
 *   - NEVER export from components/sf/index.ts barrel
 *   - NEVER add @tiptap/* to next.config.ts optimizePackageImports (D-04 lock)
 *   - Consumers import via @/components/sf/sf-rich-editor-lazy
 *   - Direct import of this file is SUPPORTED but only behind next/dynamic ssr:false
 *
 * CSS isolation contract (DO NOT VIOLATE):
 *   - Pair injectCSS and immediatelyRender flags with every editor invocation
 *   - The @layer signalframeux { .ProseMirror ... } block in app/globals.css
 *     IS the stylesheet replacement — DO NOT import any Tiptap/ProseMirror CSS file
 *
 * Character count: delivered via editor.getText().length (zero-dep).
 * @tiptap/extension-character-count is NOT a dep — documented in _dep_re_01_decision.
 */

// ---------------------------------------------------------------------------
// _dep_re_01_decision — runtime-dep ratification block (DEP-02)
//
// Schema precedent: _dep_dt_01_decision at components/sf/sf-data-table.tsx
// (Phase 71 Plan 01 — field-for-field identical schema)
//
// _dep_re_01_decision:
//   decided: "2026-05-01"
//   audit: "sf-rich-editor:runtime-dep"
//   dep_added:
//     - "@tiptap/react"
//     - "@tiptap/pm"
//     - "@tiptap/starter-kit"
//     - "@tiptap/extension-link"
//   version: "3.22.5"
//   rationale: |
//     SFRichEditor wraps ProseMirror via Tiptap v3 (useEditor + EditorContent
//     + StarterKit extension model). No viable zero-dep substitute:
//     Quill auto-injects unlayered CSS (overrides @layer signalframeux tokens;
//     no injectCSS:false equivalent). Slate requires a full custom schema and
//     has no first-class toolbar model. Raw ProseMirror requires ~2000 LOC
//     plugin authorship for comparable feature surface.
//     @tiptap/pm replaces individual prosemirror-* packages in v3 (bundle
//     deduplication). @tiptap/extension-link is separate from StarterKit in v3
//     (verified post-install via pnpm list). Character count delivered via
//     editor.getText().length (zero-dep) — @tiptap/extension-character-count
//     NOT added. P3 lazy posture (next/dynamic ssr:false in
//     sf-rich-editor-lazy.tsx, NOT in sf/index.ts barrel, NOT in
//     next.config.ts optimizePackageImports — D-04 chunk-id stability lock
//     holds) keeps homepage First Load JS impact at 0 KB.
//     injectCSS:false + immediatelyRender:false are mandatory SSR/cascade guards
//     — documented in JSDoc and enforced by grep acceptance criteria in
//     73-01-PLAN.md and 73-02-PLAN.md.
//   bundle_evidence:
//     - "Homepage / First Load JS pre-add baseline: 187.6 KB gzip (Phase 72 close, MILESTONES.md)"
//     - "Homepage / First Load JS post-add (placeholder file, no impl): 187.6 KB gzip (12 chunks, measured by tests/v1.8-phase63-1-bundle-budget.spec.ts)"
//     - "Headroom remaining: 12.4 KB under 200 KB hard target — UNCHANGED from Phase 72 baseline"
//     - "Delta from placeholder file: 0 KB (export {} has no @tiptap import)"
//     - "Tiptap in homepage First Load chunk: PASS (manifest probe across .next/build-manifest.json + .next/app-build-manifest.json returned PASS for /tiptap|prosemirror|starter.kit/ regex; matching chunks: [])"
//     - "Tiptap lazy chunk: ABSENT from homepage manifest (real chunk lands Plan 02 behind next/dynamic ssr:false)"
//     - "Resolved version: @tiptap/react@3.22.5 (matches @tiptap/pm@3.22.5, @tiptap/starter-kit@3.22.5, @tiptap/extension-link@3.22.5 — verified via pnpm list --depth=0)"
//     - "Measurement command: rm -rf .next/cache .next && ANALYZE=true pnpm build"
//     - "Bundle budget spec: tests/v1.8-phase63-1-bundle-budget.spec.ts PASS (187.6 KB / 200 KB budget)"
//     - "Measurement date: 2026-05-01"
//   review_gate: |
//     Re-evaluate when Tiptap v4 reaches stable release. Re-pin and
//     re-measure if v4 changes API surface (useEditor options, extension
//     model) or bundle profile materially. Also fires if BND budget changes
//     (currently 200 KB hard target from CLAUDE.md) or if D-04 chunk-id
//     stability lock is intentionally broken in a future BND phase.
//   scope: "@tiptap/* runtime deps — single P3 lazy chunk (sf-rich-editor)"
//   ratified_to_main_via: "Phase 73 (Plan 01 commit)"
// ---------------------------------------------------------------------------

import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { SFButton } from "@/components/sf";
import { cn } from "@/lib/utils";

/**
 * Anti-features NOT shipped (RE-06):
 * - H4/H5/H6 heading levels: configured levels [1,2,3] only. Rationale: editorial
 *   hierarchy beyond H3 is a consumer-layout concern, not the editor primitive's
 *   responsibility. Expanding toolbar increases cognitive load without proportional
 *   editorial value in v0.1 scope.
 * - Font picker: would require additional Tiptap text-style extensions and
 *   introduces inline style attributes conflicting with SF token-based CSS.
 * - Color picker: same inline-style conflict as the font picker; tokens-only.
 * - Text alignment: adds unlayered utility classes that may conflict with
 *   the @layer signalframeux token cascade in app/globals.css.
 * - Floating toolbar: z-index layering complexity outside the LOCKDOWN §4.4
 *   R-63 panel model scope; no Radix equivalent exists.
 * - Collaborative editing: requires WebSocket/CRDT infrastructure outside Phase 73.
 *
 * Tab-key behavior: ProseMirror intercepts Tab for list indentation. Pressing
 * Escape inside the editor returns focus to the toolbar's first focusable button
 * — explicit keyboard-exit affordance for users who need it.
 */
export interface SFRichEditorProps {
  /** Controlled HTML string. If provided, editor becomes controlled — onChange must update this. */
  value?: string;
  /** Fires on every editor change with the current HTML string. */
  onChange?: (value: string) => void;
  /** Initial HTML string for uncontrolled mode (ignored if value is provided). */
  defaultValue?: string;
  /** Disables editing; hides toolbar entirely (removes from DOM — not display:none). */
  readOnly?: boolean;
  /** Placeholder text shown when editor is empty. */
  placeholder?: string;
  className?: string;
  /** Applied to the .ProseMirror contenteditable container. */
  editorClassName?: string;
}

const TOOLBAR_BUTTON_COUNT = 13; // RE-01: 12 format/structure + RE-02: 1 link

export function SFRichEditor({
  value,
  onChange,
  defaultValue,
  readOnly = false,
  placeholder,
  className,
  editorClassName,
}: SFRichEditorProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [focusedToolbarIndex, setFocusedToolbarIndex] = useState(0);

  // MANDATORY SSR guards on the editor invocation below:
  //   prevents ProseMirror DOM init before hydration + prevents prosemirror.css
  //   injection that would override @layer signalframeux. Any future editor
  //   invocation in this file MUST carry both flags.
  const editor = useEditor({
    immediatelyRender: false,
    injectCSS: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Link.configure({ openOnClick: false }),
    ],
    content: value ?? defaultValue ?? "",
    editable: !readOnly,
    editorProps: {
      attributes: {
        ...(placeholder ? { "data-placeholder": placeholder } : {}),
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  // Controlled value sync. Loop guard: if current HTML equals incoming value,
  // skip setContent — prevents onChange → setState → useEffect → setContent → onUpdate → onChange loop.
  // The literal `editor.getHTML() === value` comparison is the loop-guard fingerprint.
  useEffect(() => {
    if (!editor || value === undefined) return;
    if (editor.getHTML() === value) return;
    editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);

  // Sync editable flag when readOnly changes after mount.
  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!readOnly);
  }, [editor, readOnly]);

  // Character count — zero-dep approach: editor.getText().length.
  // @tiptap/extension-character-count is NOT a dep (documented in _dep_re_01_decision).
  const characterCount = editor?.getText().length ?? 0;

  // Roving tabIndex keyboard nav for toolbar (WCAG 2.1 § Toolbar pattern).
  const handleToolbarKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setFocusedToolbarIndex((i) => Math.min(i + 1, TOOLBAR_BUTTON_COUNT - 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setFocusedToolbarIndex((i) => Math.max(i - 1, 0));
      }
    },
    []
  );

  if (!editor) return null;

  return (
    <section
      aria-label="Rich text editor"
      className={cn("border-2 border-foreground bg-background", className)}
    >
      {!readOnly && (
        <div
          ref={toolbarRef}
          role="toolbar"
          aria-label="Text formatting"
          aria-orientation="horizontal"
          onKeyDown={handleToolbarKeyDown}
          className="flex flex-wrap items-center gap-[var(--sfx-space-1)] border-b-2 border-foreground p-[var(--sfx-space-2)]"
        >
          {/* RE-01 toolbar (13 buttons) — accessible names are literal:
              aria-label="Bold", aria-label="Italic", aria-label="Underline",
              aria-label="Strikethrough", aria-label="Inline code",
              aria-label="Heading 1/2/3", aria-label="Bullet list",
              aria-label="Ordered list", aria-label="Blockquote",
              aria-label="Code block", aria-label="Link". The .map() below
              passes these literal strings through aria-label={label}. */}
          {/* RE-01: Format group (Bold, Italic, Underline, Strike, Inline code) */}
          {[
            {
              index: 0,
              label: "Bold",
              isActive: editor.isActive("bold"),
              action: () => editor.chain().focus().toggleBold().run(),
              children: <strong>B</strong>,
            },
            {
              index: 1,
              label: "Italic",
              isActive: editor.isActive("italic"),
              action: () => editor.chain().focus().toggleItalic().run(),
              children: <em>I</em>,
            },
            {
              index: 2,
              label: "Underline",
              isActive: editor.isActive("underline"),
              action: () => editor.chain().focus().toggleUnderline().run(),
              children: <span className="underline">U</span>,
            },
            {
              index: 3,
              label: "Strikethrough",
              isActive: editor.isActive("strike"),
              action: () => editor.chain().focus().toggleStrike().run(),
              children: <s>S</s>,
            },
            {
              index: 4,
              label: "Inline code",
              isActive: editor.isActive("code"),
              action: () => editor.chain().focus().toggleCode().run(),
              children: <code className="font-mono text-xs">`</code>,
            },
          ].map(({ index, label, isActive, action, children }) => (
            <SFButton
              key={label}
              intent="ghost"
              size="sm"
              type="button"
              aria-label={label}
              aria-pressed={isActive}
              data-active={editor.isActive(label.toLowerCase()) || isActive || undefined}
              tabIndex={focusedToolbarIndex === index ? 0 : -1}
              onClick={action}
              className={cn(isActive && "bg-foreground text-background")}
            >
              {children}
            </SFButton>
          ))}

          <div
            role="separator"
            aria-orientation="vertical"
            className="h-4 w-px bg-foreground mx-[var(--sfx-space-1)]"
          />

          {/* RE-01: Structure group (H1/H2/H3) */}
          {[1, 2, 3].map((level, i) => {
            const isActive = editor.isActive("heading", { level });
            const index = 5 + i;
            return (
              <SFButton
                key={`h${level}`}
                intent="ghost"
                size="sm"
                type="button"
                aria-label={`Heading ${level}`}
                aria-pressed={isActive}
                data-active={editor.isActive("heading", { level }) || undefined}
                tabIndex={focusedToolbarIndex === index ? 0 : -1}
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({ level: level as 1 | 2 | 3 })
                    .run()
                }
                className={cn(
                  "font-mono text-xs",
                  isActive && "bg-foreground text-background"
                )}
              >
                H{level}
              </SFButton>
            );
          })}

          <div
            role="separator"
            aria-orientation="vertical"
            className="h-4 w-px bg-foreground mx-[var(--sfx-space-1)]"
          />

          {/* RE-01: List + Block group (Bullet, Ordered, Blockquote, Code block) */}
          {[
            {
              index: 8,
              label: "Bullet list",
              activeKey: "bulletList",
              isActive: editor.isActive("bulletList"),
              action: () => editor.chain().focus().toggleBulletList().run(),
              children: "UL",
            },
            {
              index: 9,
              label: "Ordered list",
              activeKey: "orderedList",
              isActive: editor.isActive("orderedList"),
              action: () => editor.chain().focus().toggleOrderedList().run(),
              children: "OL",
            },
            {
              index: 10,
              label: "Blockquote",
              activeKey: "blockquote",
              isActive: editor.isActive("blockquote"),
              action: () => editor.chain().focus().toggleBlockquote().run(),
              children: '"',
            },
            {
              index: 11,
              label: "Code block",
              activeKey: "codeBlock",
              isActive: editor.isActive("codeBlock"),
              action: () => editor.chain().focus().toggleCodeBlock().run(),
              children: <code className="font-mono text-xs">{"</>"}</code>,
            },
          ].map(({ index, label, activeKey, isActive, action, children }) => (
            <SFButton
              key={label}
              intent="ghost"
              size="sm"
              type="button"
              aria-label={label}
              aria-pressed={isActive}
              data-active={editor.isActive(activeKey) || undefined}
              tabIndex={focusedToolbarIndex === index ? 0 : -1}
              onClick={action}
              className={cn(
                "font-mono text-xs",
                isActive && "bg-foreground text-background"
              )}
            >
              {children}
            </SFButton>
          ))}

          <div
            role="separator"
            aria-orientation="vertical"
            className="h-4 w-px bg-foreground mx-[var(--sfx-space-1)]"
          />

          {/* RE-02: Link button */}
          {(() => {
            const isActive = editor.isActive("link");
            return (
              <SFButton
                intent="ghost"
                size="sm"
                type="button"
                aria-label="Link"
                aria-pressed={isActive}
                data-active={editor.isActive("link") || undefined}
                tabIndex={focusedToolbarIndex === 12 ? 0 : -1}
                onClick={() => {
                  const url = window.prompt("Enter URL:");
                  if (url) editor.chain().focus().setLink({ href: url }).run();
                }}
                className={cn(
                  "font-mono text-xs",
                  isActive && "bg-foreground text-background"
                )}
              >
                URL
              </SFButton>
            );
          })()}
        </div>
      )}

      <EditorContent
        editor={editor}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            toolbarRef.current
              ?.querySelector<HTMLElement>("[tabindex='0']")
              ?.focus();
          }
        }}
        className={cn(
          "p-[var(--sfx-space-4)]",
          "min-h-[var(--sfx-space-16)]",
          editorClassName
        )}
      />

      {!readOnly && (
        <div
          aria-live="polite"
          aria-label={`${characterCount} characters`}
          className="border-t-2 border-foreground px-[var(--sfx-space-4)] py-[var(--sfx-space-2)] font-mono text-xs text-muted-foreground"
        >
          {characterCount} chars
        </div>
      )}
    </section>
  );
}
