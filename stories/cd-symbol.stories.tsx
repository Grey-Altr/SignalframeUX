import type { Meta, StoryObj } from "@storybook/react";
import { CDSymbol } from "@/components/sf/cd-symbol";

const SYMBOL_NAMES = [
  "crosshair", "circuit-node", "signal-wave", "data-burst", "grid-cell", "frequency-bar",
  "arrow-right", "arrow-down", "chevron", "caret",
  "dot", "ring", "pulse", "diamond",
  "line-h", "line-v", "dash", "zigzag",
  "hex", "triangle", "square", "plus", "minus", "asterisk",
];

const meta: Meta<typeof CDSymbol> = {
  title: "Signal/CDSymbol",
  component: CDSymbol,
  tags: ["autodocs"],
  args: {
    name: "crosshair",
    size: 24,
  },
};
export default meta;

type Story = StoryObj<typeof CDSymbol>;

export const Default: Story = {};

export const AllSymbols: Story = {
  render: () => (
    <div className="grid grid-cols-6 gap-6 p-8 bg-background text-foreground">
      {SYMBOL_NAMES.map((name) => (
        <div key={name} className="flex flex-col items-center gap-2">
          <CDSymbol name={name} size={32} />
          <span className="font-mono text-xs text-muted-foreground">{name}</span>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-6 p-8">
      {[12, 16, 24, 32, 48].map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <CDSymbol name="crosshair" size={size} />
          <span className="font-mono text-xs text-muted-foreground">{size}px</span>
        </div>
      ))}
    </div>
  ),
};

export const Colored: Story = {
  render: () => (
    <div className="flex gap-6 p-8">
      <CDSymbol name="signal-wave" size={32} className="text-primary" />
      <CDSymbol name="diamond" size={32} className="text-foreground" />
      <CDSymbol name="hex" size={32} className="text-muted-foreground" />
      <CDSymbol name="circuit-node" size={32} className="text-destructive" />
    </div>
  ),
};

export const SectionDivider: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-3 py-4">
      <CDSymbol name="dash" size={16} className="text-foreground/30" />
      <CDSymbol name="diamond" size={10} className="text-primary" />
      <CDSymbol name="dash" size={16} className="text-foreground/30" />
    </div>
  ),
};
