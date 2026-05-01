import type { Meta, StoryObj } from "@storybook/react";
import { SFRichEditorLazy } from "@/components/sf/sf-rich-editor-lazy";

const meta = {
  title: "SF / Rich Editor",
  component: SFRichEditorLazy,
  parameters: {
    // Meta-level chromatic.delay — inherited by all stories as a baseline.
    // ProseMirror's contenteditable DOM init is async vs. React's render cycle,
    // so a 500ms delay ensures Chromatic captures the editor post-mount, not
    // in the SFSkeleton fallback state.
    chromatic: { delay: 500 },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SFRichEditorLazy>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Start typing...",
  },
  parameters: {
    // Per-story chromatic.delay duplicates meta-level inheritance — kept explicit so
    // any future story addition can't silently regress to <500ms (chromatic merges,
    // doesn't replace). Belt-and-suspenders: both levels must be present.
    chromatic: { delay: 500 },
  },
};

export const WithContent: Story = {
  args: {
    defaultValue:
      "<p>Hello <strong>world</strong>. This fixture exercises <em>italic</em>, <u>underline</u>, and <code>inline code</code>.</p><h1>Heading 1</h1><h2>Heading 2</h2><h3>Heading 3</h3><ul><li>Bullet item</li><li>Second bullet</li></ul><ol><li>Ordered item</li></ol><blockquote>A blockquote paragraph with more content.</blockquote>",
  },
  parameters: {
    // Per-story chromatic.delay duplicates meta-level inheritance — kept explicit so
    // any future story addition can't silently regress to <500ms (chromatic merges,
    // doesn't replace). Belt-and-suspenders: both levels must be present.
    chromatic: { delay: 500 },
  },
};

export const ReadOnly: Story = {
  args: {
    value:
      "<p>This content is <strong>read-only</strong>. The toolbar is absent from the DOM.</p><h2>Read-only heading</h2>",
    readOnly: true,
  },
  parameters: {
    // Per-story chromatic.delay duplicates meta-level inheritance — kept explicit so
    // any future story addition can't silently regress to <500ms (chromatic merges,
    // doesn't replace). Belt-and-suspenders: both levels must be present.
    chromatic: { delay: 500 },
  },
};

export const Controlled: Story = {
  args: {
    value: "<p>Controlled editor — value driven from outside.</p>",
    onChange: (v: string) => console.log("onChange", v),
  },
  parameters: {
    // Per-story chromatic.delay duplicates meta-level inheritance — kept explicit so
    // any future story addition can't silently regress to <500ms (chromatic merges,
    // doesn't replace). Belt-and-suspenders: both levels must be present.
    chromatic: { delay: 500 },
  },
};
