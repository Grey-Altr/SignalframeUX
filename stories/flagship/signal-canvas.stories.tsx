import type { Meta, StoryObj } from "@storybook/react";

/**
 * SignalCanvas is a Three.js WebGL renderer. It requires a real browser
 * WebGL context and cannot be rendered in the Storybook sandbox without
 * Three.js as a peer dependency.
 *
 * Usage:
 * ```tsx
 * import { SignalCanvas } from 'signalframeux/webgl';
 *
 * <SignalCanvas
 *   className="w-full h-screen"
 *   intensity={0.8}
 *   color="oklch(0.65 0.3 350)"
 * />
 * ```
 *
 * Peer requirements: three >= 0.183.0
 * Entry point: signalframeux/webgl
 */

// Placeholder component for story display
function SignalCanvasPlaceholder() {
  return (
    <div className="w-full h-64 border-2 border-foreground flex items-center justify-center font-mono text-sm">
      <div className="text-center space-y-2">
        <p className="text-primary">SIGNALCANVAS</p>
        <p className="text-muted-foreground text-xs">WebGL renderer — Three.js required</p>
        <p className="text-muted-foreground text-xs">import from signalframeux/webgl</p>
      </div>
    </div>
  );
}

const meta: Meta<typeof SignalCanvasPlaceholder> = {
  title: "WebGL/SignalCanvas",
  component: SignalCanvasPlaceholder,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
**SignalCanvas** — SIGNAL layer WebGL renderer.

Three.js-based canvas that overlays a generative signal field
onto your layout. Imported from \`signalframeux/webgl\`.

**Key props:**
- \`intensity\` — Signal field strength (0–1)
- \`color\` — Signal color (OKLCH string or hex)
- \`className\` — Applied to the canvas container

**Peer dependencies:** \`three >= 0.183.0\`
        `,
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SignalCanvasPlaceholder>;

export const Reference: Story = {
  render: () => <SignalCanvasPlaceholder />,
};

export const FullBleed: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => (
    <div className="w-full min-h-screen bg-background flex items-center justify-center">
      <SignalCanvasPlaceholder />
    </div>
  ),
};

export const OverlayExample: Story = {
  render: () => (
    <div className="relative w-full h-48 border-2 border-foreground overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-muted-foreground">
        CONTENT LAYER (FRAME)
      </div>
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <span className="font-mono text-xs text-primary opacity-50">
          &lt;SignalCanvas /&gt; overlay (SIGNAL)
        </span>
      </div>
    </div>
  ),
};
